'use client'

import { forwardRef, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { addTapdAnggaran, getTapdAnggaranList, updateTapdAnggaran } from '@actions/data/tapd'
import { TextInput } from '@components/form/text-input'
import UserSipdPerencanaanSelector from '@components/perencanaan/user'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@components/ui/card'
import manifest from '@constants/tpd.json'
import {
   Autocomplete,
   AutocompleteItem,
   Button,
   cn,
   Modal,
   ModalBody,
   ModalContent,
   ModalFooter,
   ModalHeader,
   useDisclosure,
   type AutocompleteProps,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { createTsForm, createUniqueFieldSchema } from '@ts-react/form'
import { generateUniqueId } from '@utils/uniq-id'
import { TapdAnggaranUncheckedCreateInputSchema } from '@validations/perencanaan/tapd'
import { z } from '@zod'
import { Reorder, useDragControls, useMotionValue } from 'framer-motion'
import { ArrowBigLeft, Pencil, Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useRaisedShadow } from '@shared/hooks/use-raised-shadow'
import { useRefetchQueries } from '@shared/hooks/use-refetch-queries'
import { useSession } from '@shared/hooks/use-session'

import { SkpdMultipleSelect } from '../perencanaan/skpd'

type SkpdSelectByJadwalProps = {
   onChange?: (idsBlSkpd: string[]) => void
   idsSkpd?: string[]
   idDaerah?: number
   errorMeesage?: string
   tahun?: number
   isReadonly?: boolean
}

type GetTapdAnggaranListParams = Parameters<typeof getTapdAnggaranList>[0]

const TrAnggota = ({
   item,
   onSelected,
   noUrut,
   className,
}: {
   item: any
   noUrut: number
   className?: string
   onSelected?: (data: Tapd) => void
}) => {
   const y = useMotionValue(0)
   const itemStyles = useRaisedShadow(y)
   const dragControls = useDragControls()

   return (
      <Reorder.Item
         as='tr'
         className={cn(
            'relative select-none break-inside-avoid first:break-before-avoid',
            className
         )}
         style={{ ...itemStyles, y }}
         id={item?.id}
         dragListener={false}
         dragControls={dragControls}
         value={item}>
         <td
            onPointerDown={(event) => dragControls.start(event)}
            className='border-print cursor-grab touch-none px-3 py-2 text-center'>
            {noUrut}.
         </td>
         <td className='border-print select-text px-3 py-2'>{item?.nama}</td>
         <td className='border-print select-text px-3 py-2'>{item?.nip}</td>
         <td className='border-print select-text px-3 py-2'>{item?.jabatan}</td>
         <td className='border-print p-1'>
            {!!onSelected && (
               <div className='flex justify-center gap-2 print:hidden'>
                  <Button
                     radius='full'
                     isIconOnly
                     variant='bordered'
                     color='warning'
                     onPress={() => onSelected({ ...item, key: noUrut - 1 })}
                     size='sm'>
                     <Pencil className='-m-4 size-4' />
                  </Button>
               </div>
            )}
         </td>
      </Reorder.Item>
   )
}

export const TableAnggotaTapd = ({
   values = manifest?.data_tapd,
   show = true,
   onChange = () => {},
   onSelected,
   className = '',
   classNameTr = '',
}: {
   values?: Tapd[]
   show?: boolean
   className?: string
   classNameTr?: string
   onChange?: (data: Tapd[]) => void
   onSelected?: (data?: Tapd) => void
}) => {
   return (
      <table
         className={cn(
            className,
            `${!show ? 'hidden print:table' : ''}`,
            'min-w-full break-inside-avoid'
         )}>
         <thead>
            <tr>
               <th
                  colSpan={5}
                  className='border-print px-3 py-2 text-center font-bold '>
                  TIM ANGGARAN PEMERINTAH DAERAH
               </th>
            </tr>
            <tr>
               <th className='border-print px-3 py-2 text-center'>NO</th>
               <th className='border-print px-3 py-2'>Nama</th>
               <th className='border-print px-3 py-2'>NIP</th>
               <th className='border-print px-3 py-2'>Jabatan</th>
               <th
                  align='center'
                  className='border-print text-center'>
                  {!!onSelected ? (
                     <Button
                        color='secondary'
                        size='sm'
                        type='button'
                        onPress={() => onSelected(undefined)}>
                        Tambah
                     </Button>
                  ) : (
                     'Tanda Tangan'
                  )}
               </th>
            </tr>
         </thead>
         <Reorder.Group
            as='tbody'
            axis='y'
            values={values}
            onReorder={onChange}>
            {values?.map((item, index) => (
               <TrAnggota
                  className={classNameTr}
                  key={item?.id}
                  item={item}
                  noUrut={index + 1}
                  onSelected={onSelected}
               />
            ))}
         </Reorder.Group>
      </table>
   )
}

export type Tapd = {
   nama: string
   jabatan: string
   nip: string
   id: string
}

const FormComponent = (props: React.FormHTMLAttributes<HTMLFormElement>) => (
   <form
      className='w-full space-y-3'
      {...props}
   />
)

const AnggotaTapdSchema = z
   .object({
      id: z.string(),
      nama: z.string().trim().min(1, { message: 'Wajib diisi' }),
      nip: z
         .string({ description: 'NIP // Masukan NIP' })
         .trim()
         .min(1, { message: 'Wajib diisi' }),
      jabatan: z
         .string({ description: 'Jabatan // Masukan Jabatan dalam TAPD' })
         .trim()
         .min(1, { message: 'Wajib diisi' }),
   })
   .strip()

const zAnggotaTapd = createUniqueFieldSchema(
   z.array(AnggotaTapdSchema).min(1, { message: 'Minimal harus ada 1 anggota TAPD' }),
   'anggota_tapd'
)
const zSkpd = createUniqueFieldSchema(
   z
      .object({
         connect: z
            .array(
               z
                  .object({
                     id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
                  })
                  .strict()
            )
            .min(1, { message: 'Minimal harus ada 1 SKPD' }),
      })
      .strict(),
   'skpd'
)
export const TapdInputSchema = z
   .object({
      id: z
         .string()
         .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
         .optional(),
      nama: z.string().trim().min(1, { message: 'Wajib diisi' }),
      anggota_tapd: zAnggotaTapd,
      skpd: zSkpd,
   })
   .strip()

type ItemTapd = z.infer<typeof AnggotaTapdSchema>
type TapdInput = z.infer<typeof TapdInputSchema>
const mapping = [
   [z.string(), TextInput],
   [z.number(), TextInput],
   [zAnggotaTapd, TextInput],
   [zSkpd, TextInput],
] as const
const TsForm = createTsForm(mapping, { FormComponent })
const VAL_OP = {
   shouldValidate: true,
   shouldTouch: false,
   shouldDirty: false,
}
export const FormTapd = ({
   defaulValue,
   isReadOnly = false,
}: {
   isReadOnly?: boolean
   defaulValue?: TapdAnggaranWithRelations
}) => {
   const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
   const [anggota, setAnggota] = useState<Tapd[]>(defaulValue?.anggota_tapd ?? [])
   const [anggotaSelected, setAnggotaSelected] = useState<Tapd>()
   const [loading, setLoading] = useState(false)
   const { data: session } = useSession()
   const [idsSkpd, setIdsSkpd] = useState<string[]>(defaulValue?.skpd.map((d) => d.id) ?? [])

   const router = useRouter()
   const { refetchQueries } = useRefetchQueries()

   const handleListAnggotaChange = ({ jabatan, nama, nip, id }: ItemTapd, isDelete = false) => {
      if (id) {
         if (isDelete) {
            setAnggota((old) => old.filter((d) => d.id !== id))
         } else {
            setAnggota((old) => old?.map((d) => (d.id === id ? { ...d, jabatan, nama, nip } : d)))
         }
      } else {
         const id: string = generateUniqueId()
         setAnggota((prev) => [...prev, { jabatan, nama, nip, id }])
      }

      setAnggotaSelected(undefined)
      onClose()
   }
   const back = useCallback(() => {
      router.back()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   const formTapd = useForm<TapdInput>()

   const handleSubmit = async (data: TapdInput) => {
      if (isReadOnly) {
         return
      }
      setLoading(true)
      try {
         const id = defaulValue?.id
         const validate = TapdAnggaranUncheckedCreateInputSchema.parse(data)
         if (id) {
            const res = await updateTapdAnggaran(id, data)
            toast(res?.message ?? 'Berhasil', { type: res?.success ? 'success' : 'error' })
         } else {
            const res = await addTapdAnggaran(validate)
            toast(res?.message ?? 'Berhasil', { type: res?.success ? 'success' : 'error' })
         }
         refetchQueries(['data_tapd_anggaran'])
         router?.back()
      } catch (e: any) {
         if (e instanceof z.ZodError) {
            toast.error('Periksa kembali data sebelum disimpan')
         } else {
            toast(e?.message ?? 'Terjadi kesalahan')
         }
      }
      setLoading(false)
   }
   const handleSelectedAnggotaTapd = (item?: Tapd) => {
      setAnggotaSelected(item)
      onOpen()
   }

   const handleClose = () => {
      setAnggotaSelected(undefined)
      onClose()
   }
   const fieldAnggota = formTapd?.register('anggota_tapd')
   const fieldSkpd = formTapd?.register('skpd')
   const fieldSkpdConn = formTapd?.register('skpd.connect')
   useEffect(() => {
      formTapd?.setValue('anggota_tapd', anggota as any, VAL_OP)
   }, [anggota, formTapd])
   useEffect(() => {
      const newValue = [...idsSkpd]?.map((id) => ({ id }))
      // @ts-expect-error
      formTapd?.setValue('skpd', { connect: newValue }, VAL_OP)
   }, [idsSkpd, formTapd])

   return (
      <Card className='h-fit w-full md:flex-1'>
         <CardHeader>
            <CardTitle>FORM TAPD</CardTitle>
         </CardHeader>
         <CardContent>
            {!isReadOnly && (
               <>
                  <ModalAddPegawai
                     idDaerah={session?.user?.id_daerah}
                     isOpen={isOpen}
                     onClose={handleClose}
                     onOpenChange={onOpenChange}
                     handleDataChange={handleListAnggotaChange}
                     editValue={anggotaSelected}
                  />
               </>
            )}
            <TableAnggotaTapd
               onSelected={isReadOnly ? undefined : handleSelectedAnggotaTapd}
               onChange={setAnggota}
               values={anggota}
            />
            {!!formTapd?.formState?.errors?.anggota_tapd && (
               <p
                  className='text-danger border-danger -mt-3 border p-3'
                  ref={fieldAnggota?.ref}>
                  {formTapd?.formState?.errors?.anggota_tapd?.message}
               </p>
            )}
            <SkpdMultipleSelect
               ref={fieldSkpdConn?.ref}
               selectProps={{
                  isDisabled: isReadOnly,
                  label: 'SKPD',
                  selectedKeys: idsSkpd ? new Set(idsSkpd) : [],
                  isInvalid: !!formTapd?.formState?.errors?.skpd,
                  errorMessage:
                     formTapd?.formState?.errors?.skpd?.message ??
                     formTapd?.formState?.errors?.skpd?.connect?.message,
               }}
               onSelectionChange={setIdsSkpd}
               params={{ tahun: session?.user?.tahun, id_daerah: session?.user?.id_daerah }}
            />

            <TsForm
               form={formTapd}
               schema={TapdInputSchema}
               defaultValues={{ nama: defaulValue?.nama }}
               formProps={{ id: 'form-tapd', className: 'space-y-4 pt-2' }}
               onSubmit={handleSubmit}>
               {({ nama }) => <>{nama}</>}
            </TsForm>
         </CardContent>
         <CardFooter className='flex w-full justify-end gap-4'>
            <Button
               isLoading={loading}
               variant='shadow'
               color='danger'
               onPress={back}
               startContent={<ArrowBigLeft className='-ml-2 size-5' />}>
               Kembali
            </Button>
            {!isReadOnly && (
               <Button
                  form='form-tapd'
                  type='submit'
                  isLoading={loading}
                  variant='shadow'
                  color='primary'
                  startContent={<Save className='-ml-2 size-5' />}>
                  {defaulValue?.id ? 'Update Data TAPD' : 'Simpan Data TAPD'}
               </Button>
            )}
         </CardFooter>
      </Card>
   )
}

export interface TapdAnggaranSelectorProps
   extends Pick<
      AutocompleteProps,
      Exclude<
         keyof AutocompleteProps,
         'onChange' | 'children' | 'defaultItems' | 'items' | 'onSelectionChange'
      >
   > {
   onChange?: (tapd: TapdAnggaran | undefined) => void
   onValueChange?: (nama: string | null) => void
   onSelectionChange?: (id: string | null) => void
   params?: GetTapdAnggaranListParams
   delayFetch?: number
}

export const TapdAnggaranSelector = forwardRef(
   (
      {
         onChange,
         params,
         delayFetch = 1000,
         onValueChange,
         onSelectionChange,
         selectedKey,
         ...props
      }: TapdAnggaranSelectorProps,
      ref?: React.Ref<HTMLInputElement>
   ) => {
      const { data, isFetching, status } = useQuery({
         queryKey: [{ ...params }, 'data_tapd_anggaran'] as [GetTapdAnggaranListParams, string],
         queryFn: async ({ queryKey: [params] }) => {
            return await getTapdAnggaranList(params)
         },
         placeholderData: (previousData) => previousData,
      })

      const options = data?.results
      const handleChange = (value?: any) => {
         if (typeof value === 'string') {
            const subs = options?.find((d) => d.id?.toString() === value.toString())
            onSelectionChange && onSelectionChange(subs?.id ?? null)
            onValueChange && onValueChange(subs?.nama ?? null)
            onChange && onChange(subs)
         } else {
            onSelectionChange && onSelectionChange(null)
            onChange && onChange(value)
         }
      }
      return (
         <Autocomplete
            onKeyDown={(e: any) => e.continuePropagation()}
            popoverProps={{ isOpen: true, defaultOpen: true }}
            listboxProps={{ emptyContent: 'Tidak ada data TAPD anggaran' }}
            aria-labelledby='Tapd Anggaran'
            placeholder='Pilih Tapd Anggaran...'
            variant='bordered'
            onSelectionChange={handleChange}
            defaultItems={options || []}
            {...props}
            defaultSelectedKey={props?.defaultSelectedKey?.toString()}
            selectedKey={selectedKey ? selectedKey?.toString() : null}
            ref={ref}
            isDisabled={props?.isDisabled || !options}
            isLoading={props?.isLoading || isFetching || status === 'pending'}>
            {({ nama, id }) => (
               <AutocompleteItem
                  className='data-[selected=true]:text-primary'
                  classNames={{ title: 'whitespace-normal' }}
                  value={id}
                  startContent={id}
                  key={id}>
                  {nama ?? ''}
               </AutocompleteItem>
            )}
         </Autocomplete>
      )
   }
)

TapdAnggaranSelector.displayName = 'TapdAnggaranSelector'

const ModalAddPegawai = ({
   isOpen,
   onClose = () => {},
   onOpenChange = () => {},
   editValue,
   idDaerah = 0,
   handleDataChange = () => {},
}: {
   isOpen: boolean
   onOpenChange: () => void
   handleDataChange: (item: ItemTapd, isDelete?: boolean) => void
   onClose: () => void
   editValue?: Tapd
   idDaerah?: number
}) => {
   const itemDefault = {
      id: '',
      jabatan: 'Anggota',
   }
   const formAnggotaTapd = useForm<ItemTapd>()

   const handleClose = () => {
      formAnggotaTapd.reset(itemDefault)
      onClose()
   }
   const hanldeSubmit = (data: ItemTapd, isDelete = false) => {
      handleDataChange(data, isDelete)
      formAnggotaTapd.reset(itemDefault)
   }

   const fieldNama = formAnggotaTapd?.register('nama')
   const handleUserSipdSelected = (data?: UserSipdPerencanaan) => {
      if (!!data) {
         formAnggotaTapd.setValue('nip', data?.nip, VAL_OP)
         formAnggotaTapd.setValue('nama', data?.nama, VAL_OP)
      }
   }

   return (
      <Modal
         isOpen={isOpen}
         onClose={handleClose}
         onOpenChange={onOpenChange}
         scrollBehavior='inside'>
         <ModalContent>
            <ModalHeader>{!!editValue ? 'Ubah' : 'Tambah'} Pelaksana Perjalanan Dinas</ModalHeader>
            <ModalBody>
               <UserSipdPerencanaanSelector
                  autocompleteProps={{
                     variant: 'bordered',
                     label: 'Nama',
                     allowsCustomValue: true,
                     errorMessage: formAnggotaTapd?.formState?.errors?.nama?.message,
                     isInvalid: !!formAnggotaTapd?.formState?.errors?.nama,
                     placeholder: 'Masukan nama pegawai',
                     defaultInputValue: editValue?.nama,
                     onBlur: fieldNama?.onBlur,
                     onInputChange: (v) => formAnggotaTapd?.setValue('nama', v, VAL_OP),
                  }}
                  ref={fieldNama?.ref}
                  onChange={handleUserSipdSelected}
                  params={{ id_daerah: idDaerah }}
               />
               <TsForm
                  defaultValues={{ ...itemDefault, ...editValue }}
                  formProps={{ id: 'form-anggota-tapd' }}
                  schema={AnggotaTapdSchema}
                  form={formAnggotaTapd}
                  onSubmit={hanldeSubmit}>
                  {({ jabatan, nip }) => (
                     <>
                        {nip}
                        {jabatan}
                     </>
                  )}
               </TsForm>
            </ModalBody>
            <ModalFooter className='flex items-center justify-end gap-3'>
               {!!editValue && (
                  <Button
                     type='button'
                     color='danger'
                     onPress={() => hanldeSubmit(editValue, true)}>
                     Hapus
                  </Button>
               )}
               <Button
                  form='form-anggota-tapd'
                  type='submit'
                  color='primary'>
                  {!!editValue ? 'Ubah Pegawai' : 'Tambah Pegawai'}
               </Button>
            </ModalFooter>
         </ModalContent>
      </Modal>
   )
}
