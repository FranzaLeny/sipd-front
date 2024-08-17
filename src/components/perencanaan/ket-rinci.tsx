'use client'

import { forwardRef, useState } from 'react'
import {
   addKetRinciBlSubGiat,
   getKetRinciBlSubGiat,
} from '@actions/perencanaan/rka/bl-rinci-sub-giat'
import { TextInput } from '@components/form/text-input'
import {
   Autocomplete,
   AutocompleteItem,
   AutocompleteProps,
   Button,
   Modal,
   ModalBody,
   ModalContent,
   ModalFooter,
   ModalHeader,
   ModalProps,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { createTsForm } from '@ts-react/form'
import { generateUniqueId } from '@utils/uniq-id'
import { KetRinciBlSubGiatUncheckedCreateInputSchema, z } from '@zod'
import { toast } from 'react-toastify'
import { useRefetchQueries } from '@shared/hooks/use-refetch-queries'

export interface KetSelectorProps
   extends Pick<
      AutocompleteProps,
      Exclude<
         keyof AutocompleteProps,
         'onChange' | 'children' | 'defaultItems' | 'items' | 'onSelectionChange'
      >
   > {
   onChange?: (ketRinciBlSubGiat: KetRinciBlSubGiat | undefined) => void
   onValueChange?: (ket_bl_teks: string | null) => void
   onSelectionChange?: (id_ket_sub_bl: number | null) => void
   params?: GetListKetRinciParams
   delayFetch?: number
}

export const KetRinciSelector = forwardRef(
   (
      {
         onChange,
         params,
         delayFetch = 1000,
         onValueChange,
         onSelectionChange,
         selectedKey,
         ...props
      }: KetSelectorProps,
      ref?: React.Ref<HTMLInputElement>
   ) => {
      const [queryParams, setQueryParams] = useState({
         search: '',
         limit: 1000,
         ...params,
      })

      const { data, isFetching, status, isFetched } = useQuery({
         queryKey: [{ ...queryParams }, 'bl_sub_giat_rinci_ket'] as [GetListKetRinciParams, string],
         queryFn: async ({ queryKey: [params] }) => {
            return await getKetRinciBlSubGiat(params)
         },
         placeholderData: (previousData) => previousData,
      })

      const options = data?.results
      const handleChange = (value?: any) => {
         if (typeof value === 'string') {
            onSelectionChange && onSelectionChange(Number(value))
            const ket = options?.find((d) => d.id_ket_sub_bl?.toString() === value.toString())
            onSelectionChange && onSelectionChange(ket?.id_ket_sub_bl ?? null)
            onValueChange && onValueChange(ket?.ket_bl_teks ?? '')
            onChange && onChange(ket)
         } else {
            onSelectionChange && onSelectionChange(null)
            onChange && onChange(value)
         }
      }
      return (
         <Autocomplete
            listboxProps={{ emptyContent: 'Tidak ada data keteragan' }}
            onKeyDown={(e: any) => e.continuePropagation()}
            popoverProps={{ isOpen: true, defaultOpen: true }}
            aria-labelledby='Keterangan'
            placeholder='Pilih Keterangan...'
            variant='bordered'
            onSelectionChange={handleChange}
            defaultItems={options || []}
            {...props}
            selectedKey={selectedKey ? selectedKey?.toString() : null}
            defaultSelectedKey={props?.defaultSelectedKey?.toString()}
            ref={ref}
            isDisabled={props?.isDisabled || !options}
            isLoading={props?.isLoading || isFetching || status === 'pending'}>
            {({ ket_bl_teks, id_ket_sub_bl }) => (
               <AutocompleteItem
                  className='data-[selected=true]:text-primary'
                  classNames={{ title: 'whitespace-normal' }}
                  value={id_ket_sub_bl}
                  key={id_ket_sub_bl}>
                  {ket_bl_teks ?? ''}
               </AutocompleteItem>
            )}
         </Autocomplete>
      )
   }
)

KetRinciSelector.displayName = 'KetRinciSelector'

export default KetRinciSelector

export interface ModalCreateKetRincianProps
   extends Pick<ModalProps, Exclude<keyof ModalProps, 'children'>> {}

const CreateKetRincianSchema = KetRinciBlSubGiatUncheckedCreateInputSchema

const mapping = [
   [z.string(), TextInput],
   [z.number(), TextInput],
] as const

const getPartialValidatedValue = (value?: Partial<BlSubGiat>) => {
   const random = Math.floor(Math.random() * 100)
   const timestamp = new Date().getTime()
   const id_unik = generateUniqueId()
   const defaultValue = {
      id_ket_sub_bl: random + timestamp,
      id_unik: id_unik + '-' + timestamp,
   }
   if (!value) return defaultValue

   const validationResult = KetRinciBlSubGiatUncheckedCreateInputSchema.partial()
      .omit({ id: true })
      .safeParse({ ...value, bl_sub_giat_id: value?.id })

   return validationResult.success ? { ...validationResult.data, ...defaultValue } : defaultValue
}

const Form = createTsForm(mapping)
export const ModalCreateKetRincian = ({
   defaultValue,
   onOpenChange,
   ...props
}: {
   defaultValue?: Partial<BlSubGiat>
} & Omit<ModalCreateKetRincianProps, 'onPress'>) => {
   const [isSubmitting, setIsSubmitting] = useState(false)

   const { refetchQueries } = useRefetchQueries()

   const defaultValues = getPartialValidatedValue(defaultValue)

   const handleSubmit = async (data: KetRinciBlSubGiatUncheckedCreateInput) => {
      setIsSubmitting(true)
      try {
         const res = await addKetRinciBlSubGiat(data)
         toast(res?.message ?? 'Berhasil', { type: res?.success ? 'success' : 'error' })
         setIsSubmitting(false)
         refetchQueries(['bl_sub_giat_rinci_ket', defaultValue?.id ?? '---'])
         onOpenChange && onOpenChange(false)
      } catch (error: any) {
         toast.error(error?.message ?? 'Gagal simpan data SKPD')
         setIsSubmitting(false)
      }
   }

   return (
      <Modal
         {...props}
         onOpenChange={isSubmitting ? undefined : onOpenChange}>
         <ModalContent>
            {(onClose) => (
               <>
                  <ModalHeader className='flex flex-col gap-1'>Tambah Keterangan</ModalHeader>
                  <ModalBody>
                     <Form
                        formProps={{
                           id: 'add_ket_rinci',
                        }}
                        onSubmit={handleSubmit}
                        schema={CreateKetRincianSchema}
                        defaultValues={defaultValues}>
                        {({ ket_bl_teks }) => <>{ket_bl_teks}</>}
                     </Form>
                  </ModalBody>
                  <ModalFooter>
                     <Button
                        isDisabled={isSubmitting}
                        color='danger'
                        variant='light'
                        onPress={onClose}>
                        Batal
                     </Button>
                     <Button
                        isLoading={isSubmitting}
                        color='primary'
                        form='add_ket_rinci'
                        type='submit'>
                        Tambah
                     </Button>
                  </ModalFooter>
               </>
            )}
         </ModalContent>
      </Modal>
   )
}
