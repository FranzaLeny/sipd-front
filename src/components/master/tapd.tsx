'use client'

import {
   addTapdAnggaran,
   getTapdAnggaranList,
   GetTapdAnggaranListParams,
   updateTapdAnggaran,
} from '@actions/data/tapd'
import { TextInput } from '@components/form/text-input'
import UserSipdPerencanaanSelector from '@components/perencanaan/user'
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@components/ui/card'

import '@nextui-org/autocomplete'

import { forwardRef, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import manifest from '@constants/tpd.json'
import {
   Autocomplete,
   AutocompleteItem,
   AutocompleteProps,
   Button,
   cn,
   Input,
   Modal,
   ModalBody,
   ModalContent,
   useDisclosure,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { createTsForm } from '@ts-react/form'
import { generateUniqueId } from '@utils/uniq-id'
import {
   TapdAnggaran,
   TapdAnggaranUncheckedCreateInputSchema,
   TapdAnggaranWithRelations,
} from '@validations/perencanaan/tapd'
import { z } from '@zod'
import { Reorder, useDragControls, useMotionValue } from 'framer-motion'
import { ArrowBigLeft, Pencil, Save, Search, X } from 'lucide-react'
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

export const SkpdSelectByJadwal = ({
   idsSkpd,
   onChange,
   errorMeesage,
   tahun,
   idDaerah,
   isReadonly = false,
}: SkpdSelectByJadwalProps) => {
   return (
      <div className='max-w-1/3 flex flex-col gap-3 print:hidden'>
         {tahun && (
            <SkpdMultipleSelect
               isDisabled={isReadonly}
               label='SKPD'
               selectedKeys={idsSkpd ? new Set(idsSkpd) : undefined}
               onSelectionChange={onChange}
               params={{ tahun, id_daerah: idDaerah }}
               isInvalid={!!errorMeesage}
               errorMessage={errorMeesage}
            />
         )}
      </div>
   )
}

const TrAnggota = ({
   item,
   onAction,
   noUrut,
   className,
}: {
   item: any
   noUrut: number
   className?: string
   onAction?: (id: string, edit?: boolean) => void
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
            {!!onAction && (
               <div className='flex justify-center gap-2 print:hidden'>
                  <Button
                     radius='full'
                     isIconOnly
                     variant='bordered'
                     color='warning'
                     onPress={() => onAction(item?.id, true)}
                     size='sm'>
                     <Pencil className='-m-4 size-4' />
                  </Button>
                  <Button
                     radius='full'
                     isIconOnly
                     variant='bordered'
                     color='danger'
                     size='sm'
                     onPress={() => onAction(item?.id)}>
                     <X className='-m-4 size-4' />
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
   handleAnggotaChange,
   className = '',
   classNameTr = '',
}: {
   values?: Tapd[]
   show?: boolean
   className?: string
   classNameTr?: string
   onChange?: (data: Tapd[]) => void
   handleAnggotaChange?: (id: string, edit?: boolean) => void
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
               <th className='border-print px-3 py-2 text-center'>
                  {!handleAnggotaChange ? 'Tanda Tangan' : 'Aksi'}
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
                  onAction={handleAnggotaChange}
               />
            ))}
         </Reorder.Group>
      </table>
   )
}

const ModalUser = ({
   isOpen,
   onOpenChange,
   onClose,
   onUserSelect,
   idDaerah = 0,
}: {
   isOpen: boolean
   idDaerah?: number
   onOpenChange: () => void
   onClose: () => void
   onUserSelect: (value: any) => void
}) => {
   return (
      <Modal
         className={cn(['my-1 sm:my-1', 'mx-1 sm:mx-1'])}
         hideCloseButton
         shadow='sm'
         isOpen={isOpen}
         radius='lg'
         placement={'center'}
         onOpenChange={onOpenChange}>
         <ModalContent>
            <ModalBody className={cn(['px-1', 'py-1 transition-all'])}>
               {isOpen && (
                  <UserSipdPerencanaanSelector
                     label='Pilih User SIPD'
                     placeholder='Cari ...'
                     params={{ id_daerah: idDaerah }}
                     autoFocus
                     size='lg'
                     onClose={onClose}
                     radius='lg'
                     onChange={onUserSelect}
                  />
               )}
            </ModalBody>
         </ModalContent>
      </Modal>
   )
}

const mapping = [[z.string(), TextInput] as const, [z.number(), TextInput] as const] as const

const TapdSchema = z.object({
   id: z.string().nullable().optional(),
   nama: z.string().trim().min(1, { message: 'Wajib diisi' }),
   jabatan: z.string().trim().min(1, { message: 'Wajib diisi' }),
   nip: z.string().trim().min(1, { message: 'Wajib diisi' }),
})

type ItemTapd = z.infer<typeof TapdSchema>
const FormComponent = (props: React.FormHTMLAttributes<HTMLFormElement>) => (
   <form
      className='w-full'
      {...props}
   />
)
const TsForm = createTsForm(mapping, { FormComponent })
export type Tapd = {
   nama: string
   jabatan: string
   nip: string
   id: string
}

export const FormAnggotaTapd = ({
   defaulValue,
   isReadOnly = false,
}: {
   isReadOnly?: boolean
   defaulValue?: TapdAnggaranWithRelations
}) => {
   const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
   const [anggota, setAnggota] = useState<Tapd[]>(defaulValue?.anggota_tapd ?? [])
   const [edit, setEdit] = useState<string>()
   const [error, setError] = useState<any>({})
   const [loading, setLoading] = useState(false)
   const [nama, setNama] = useState(defaulValue?.nama)
   const { data: session } = useSession()
   const [idsSkpd, setIdsSkpd] = useState<string[]>(defaulValue?.skpd.map((d) => d.id) ?? [])

   const router = useRouter()
   const { refetchQueries } = useRefetchQueries()
   const formAdd = useForm<ItemTapd>({
      resetOptions: { keepDirty: false, keepDefaultValues: false },
      defaultValues: {
         jabatan: 'Anggota',
      },
   })
   const {
      clearErrors,
      setValue,
      reset,
      formState: { errors },
   } = formAdd

   const handleAddValueChange = useCallback(
      (key: keyof ItemTapd, value: any) => {
         if (isReadOnly) {
            return
         }
         clearErrors(key)
         setValue(key, value, { shouldValidate: true })
      },
      [clearErrors, setValue, isReadOnly]
   )
   const addItemTapd = (value: ItemTapd) => {
      if (isReadOnly) {
         return
      }
      let clone = [...anggota]
      if (!!edit) {
         const index = clone.findIndex((d) => d.id === edit)
         if (index !== -1) {
            clone[index] = value as any
         } else {
            clone.push(value as any)
         }
      } else {
         const id = generateUniqueId()
         clone.push({ ...value, id })
      }
      setAnggota(clone)
      reset()
      setEdit(undefined)
   }

   const handleUserSelect = (value: any) => {
      if (value && !isReadOnly) {
         handleAddValueChange('id', value?.id)
         handleAddValueChange('nip', value?.nip)
         handleAddValueChange('nama', value?.nama)
      }
      onClose()
   }
   const handleAnggotaChange = (id: string, edit = false) => {
      if (isReadOnly) {
         return
      }
      const value = anggota.find((d) => d.id === id)
      if (edit && value) {
         setEdit(id)
         handleAddValueChange('id', value?.id)
         handleAddValueChange('jabatan', value?.jabatan)
         handleAddValueChange('nip', value?.nip)
         handleAddValueChange('nama', value?.nama)
      } else {
         const colone = [...anggota.filter((d) => d.id !== id)]
         setAnggota(colone)
      }
   }

   const handleSave = async () => {
      if (isReadOnly) {
         return
      }
      setLoading(true)
      setError({})
      try {
         const id = defaulValue?.id
         const data = {
            anggota_tapd: anggota,
            nama: nama ? nama?.trim() : null,
            skpd: { connect: idsSkpd.map((id) => ({ id })) },
         }
         const validate = TapdAnggaranUncheckedCreateInputSchema.parse(data)
         if (id) {
            const res = await updateTapdAnggaran(id, validate)
            toast(res?.message ?? 'Berhasil', { type: res?.success ? 'success' : 'error' })
            if (res?.success) {
               setNama('')
               setIdsSkpd([])
            }
         } else {
            const res = await addTapdAnggaran(validate)
            toast(res?.message ?? 'Berhasil', { type: res?.success ? 'success' : 'error' })
            if (res?.success) {
               setNama('')
               setIdsSkpd([])
            }
         }
         refetchQueries(['tapd_anggaran'])
         router?.back()
      } catch (e: any) {
         if (e instanceof z.ZodError) {
            const errors = e.flatten()
            const error = {
               nama: errors?.fieldErrors?.nama?.join(', '),
               bl_skpd: errors?.fieldErrors?.bl_skpd?.join(', '),
            }
            setError(error)
            toast.error('Periksa kembali data sebelum disimpan')
         } else {
            toast(e?.message ?? 'Terjadi kesalahan')
         }
      }
      setLoading(false)
   }
   const back = useCallback(() => {
      router.back()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])
   const SearchUser = (
      <Button
         radius='full'
         isIconOnly
         variant='solid'
         color='primary'
         size='sm'
         type='button'
         onPress={onOpen}>
         <Search className='-m-4 size-4' />
      </Button>
   )
   return (
      <div className='flex flex-col gap-3 pt-2 md:flex-row'>
         {!isReadOnly && (
            <Card className='h-fit md:sticky md:top-[calc(var(--height-navbar)+8.1px)] md:w-1/3'>
               <CardHeader>
                  <CardTitle>Tambah Anggoata TAPD</CardTitle>
               </CardHeader>
               <CardContent>
                  <TsForm
                     onSubmit={addItemTapd}
                     form={formAdd}
                     props={{
                        nama: { endContent: SearchUser },
                     }}
                     schema={TapdSchema}>
                     {({ jabatan, nama, nip }) => (
                        <div className='flex w-full flex-col items-center gap-3'>
                           {nama}
                           {nip}
                           {jabatan}
                           <div className='flex justify-around gap-3'>
                              {!!edit && (
                                 <Button
                                    color='danger'
                                    variant='bordered'
                                    endContent={<X className='-mr-2 size-5' />}
                                    onPress={() => {
                                       reset()
                                       setEdit(undefined)
                                    }}
                                    type='button'>
                                    Batal
                                 </Button>
                              )}
                              <Button
                                 color='primary'
                                 variant='bordered'
                                 type='submit'>
                                 {!!edit ? 'Simpan Perubahan' : 'Tambah Anggota'}
                              </Button>
                           </div>
                        </div>
                     )}
                  </TsForm>
                  <CardDescription>
                     <span className='text-danger font-bold'>
                        Perhatikan Urutan dan Nama dari TAPD{' '}
                     </span>
                     Untuk mengatur urutan TAPD silahkan klik dan tarik pada Nomor sesuai urutan
                     yang diinginkan.
                  </CardDescription>
               </CardContent>
            </Card>
         )}
         <Card className='h-fit w-full md:flex-1'>
            <CardHeader>
               <CardTitle>FORM TAPD</CardTitle>
            </CardHeader>
            <CardContent>
               <SkpdSelectByJadwal
                  isReadonly={isReadOnly}
                  tahun={session?.user?.tahun}
                  idsSkpd={idsSkpd}
                  idDaerah={session?.user?.id_daerah}
                  onChange={setIdsSkpd}
                  errorMeesage={error?.bl_skpd}
               />
               <Input
                  label='Kelompok TAPD'
                  name='nama'
                  isReadOnly={isReadOnly}
                  onValueChange={setNama}
                  value={nama}
                  isInvalid={!!error?.nama}
                  errorMessage={error?.nama}
               />

               <TableAnggotaTapd
                  handleAnggotaChange={isReadOnly ? undefined : handleAnggotaChange}
                  onChange={setAnggota}
                  values={anggota}
               />
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
                     isLoading={loading}
                     variant='shadow'
                     color='primary'
                     onPress={handleSave}
                     startContent={<Save className='-ml-2 size-5' />}
                     isDisabled={!anggota.length}>
                     {defaulValue?.id ? 'Update Data TAPD' : 'Simpan Data TAPD'}
                  </Button>
               )}
            </CardFooter>
         </Card>

         {!!isReadOnly && (
            <ModalUser
               idDaerah={session?.user?.id_daerah}
               onClose={onClose}
               onUserSelect={handleUserSelect}
               onOpenChange={onOpenChange}
               isOpen={isOpen}
            />
         )}
      </div>
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
      const [queryParams, setQueryParams] = useState({
         search: '',
         ...params,
      })

      const { data, isFetching, status } = useQuery({
         queryKey: [{ ...queryParams }, 'data_tapd_anggaran'] as [
            GetTapdAnggaranListParams,
            string,
         ],
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
