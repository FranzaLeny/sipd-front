'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createJadwalAnggaran } from '@actions/perencanaan/rka/jadwal-anggaran'
import DateInput from '@components/form/date-time-input'
import RadioGroupInput from '@components/form/radio-input'
import { NumberInput, TextInput } from '@components/form/text-input'
import JadwalInput from '@components/perencanaan/jadwal-anggaran'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import { useQueryClient } from '@tanstack/react-query'
import { createTsForm, createUniqueFieldSchema } from '@ts-react/form'
import { JadwalAnggaran, z } from '@zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const numberSelect = createUniqueFieldSchema(z.number().int(), 'numberSelect')

export const JadwalAnggaranCopyInputSchema = z
   .object({
      id_unik: z.string({ description: 'Nama Unik // Buat nama unik' }),
      id_unik_murni: z.string().optional().nullable(),
      id_jadwal_murni: z.coerce.number().int(),
      nama_jadwal_murni: z.string({ description: 'Nama Jadwal Murni' }).nullable(),
      nama_sub_tahap: z.string({ description: 'Nama Jadwal' }),
      waktu_selesai: z.date({ description: 'Waktu Selesai' }),
      waktu_mulai: z.date({ description: 'Waktu Mulai' }),
   })
   .extend({
      is_locked: numberSelect,
      is_rinci_bl: numberSelect,
      is_active: numberSelect,
      is_perubahan: numberSelect,
   })
   .strip()
   .superRefine((data, ctx) => {
      if (data.waktu_selesai < data.waktu_mulai) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Waktu Selesai tidak boleh kurang dari Waktu Mulai',
            path: ['waktu_selesai'],
         })
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Waktu Mulai tidak boleh besar dari Waktu Selesai',
            path: ['waktu_mulai'],
         })
      }
      if (!!data?.is_perubahan && (!data.id_jadwal_murni || !data.id_unik_murni)) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Jadwal Anggaran Murni tidak boleh kosong',
            path: ['id_jadwal_murni'],
         })
      }
      if ((!!data.id_jadwal_murni || !!data.id_unik_murni) && !data?.is_perubahan) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Perubahan harus dicentang jika Jadwal Anggaran Murni diisi',
            path: ['is_perubahan'],
         })
      }
      if (data?.is_perubahan === 1 && data?.is_rinci_bl === 0) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Centang perubahan hanya jika merupakan jadwal anggaran',
            path: ['is_perubahan'],
         })
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Jadwal anggaran harus dicentang jika perubahan di centang',
            path: ['is_rinci_bl'],
         })
      }
   })

const mapping = [
   [z.string(), TextInput] as const,
   [z.number(), NumberInput] as const,
   [z.date(), DateInput] as const,
   [numberSelect, RadioGroupInput] as const,
] as const

export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {}

type Schema = z.infer<typeof JadwalAnggaranCopyInputSchema>

const FormComponent = (props: FormProps) => <form {...props} />

const TsForm = createTsForm(mapping, { FormComponent })

const ModalCopy = ({ data }: { data: JadwalAnggaran; user: UserWithoutToken }) => {
   const [isOpen, setIsOpen] = useState(false)
   const router = useRouter()
   const queryClient = useQueryClient()
   let currentDate = new Date()
   currentDate.setDate(currentDate.getDate() + 1)
   const form = useForm<Schema>({
      defaultValues: {
         id_jadwal_murni: data?.id_jadwal,
         nama_jadwal_murni: data?.nama_sub_tahap,
         id_unik: 'DLH Lembata',
         id_unik_murni: data?.id_unik,
         is_rinci_bl: 1,
         is_active: 1,
         is_locked: data?.is_locked,
         is_perubahan: !!data.id_jadwal_murni ? 1 : 0,
         nama_sub_tahap: data?.nama_sub_tahap + '(DLH Lembata)',
         waktu_mulai: new Date(),
         waktu_selesai: currentDate,
      },
   })

   const {
      formState: { errors, isSubmitting },
      setValue,
      clearErrors,
      watch,
   } = form

   const handleValueChange = useCallback(
      (key: keyof Schema, value: any) => {
         clearErrors(key)
         setValue(key, value, { shouldValidate: true })
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
   )

   useEffect(() => {
      setIsOpen(true)
      return () => {
         setIsOpen(false)
      }
   }, [])

   const handleClose = useCallback(() => {
      !isSubmitting && router.back()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isSubmitting])

   const onSubmit = async (value: Schema) => {
      try {
         const valida_data = {
            ...data,
            id: undefined,
            ...value,
            is_lokal: 1,
            id_unik: data?.id_unik + ' || ' + value.id_unik,
         }

         await createJadwalAnggaran(valida_data).then((res) => {
            if (res?.success) {
               toast.success(
                  `${res?.message ?? 'Berhasil simpan data jadwal anggran'} ${valida_data?.nama_sub_tahap}`
               )
               queryClient.refetchQueries({
                  type: 'all',
                  exact: false,
                  predicate: ({ queryKey }: any) => {
                     return queryKey.includes('jadwal_anggaran')
                  },
               })

               handleClose()
            } else {
               toast.error(
                  `${res?.message ?? 'Gagal simpan data jadwal anggran'} ${valida_data?.nama_sub_tahap}`,
                  { autoClose: 5000 }
               )
            }
         })
      } catch (error: any) {
         toast.error(error?.message ?? 'Gagal simpan data jadwal anggran', { autoClose: 5000 })
      }
   }
   const idUnikJadwalMurni = watch('id_unik_murni')
   const isPerubahan = watch('is_perubahan')
   const onJadwalChange = useCallback(
      (data?: JadwalAnggaran) => {
         if (data) {
            handleValueChange('id_jadwal_murni', data.id_jadwal)
            handleValueChange('id_unik_murni', data.id_unik)
            handleValueChange('nama_jadwal_murni', data.nama_sub_tahap)
            handleValueChange('is_perubahan', 1)
         } else {
            handleValueChange('is_perubahan', 0)
            handleValueChange('id_jadwal_murni', 0)
            handleValueChange('id_unik_murni', null)
            handleValueChange('nama_jadwal_murni', null)
         }
      },
      [handleValueChange]
   )

   useEffect(() => {
      if (isPerubahan === 0) {
         handleValueChange('id_jadwal_murni', 0)
         handleValueChange('id_unik_murni', null)
         handleValueChange('nama_jadwal_murni', null)
      } else if (isPerubahan === 1) {
         handleValueChange('is_rinci_bl', 1)
      }
   }, [isPerubahan, handleValueChange])

   return (
      <Modal
         isOpen={isOpen}
         onClose={handleClose}
         scrollBehavior='outside'
         size='xl'>
         <ModalContent>
            {(onClose) => (
               <TsForm
                  form={form}
                  schema={JadwalAnggaranCopyInputSchema}
                  props={{
                     is_locked: {
                        label: 'Status Jadwal',
                        typeValue: 'number',
                        orientation: 'horizontal',
                        options: [
                           { value: '0', label: 'Dibuka' },
                           { value: '1', label: 'Dikunci' },
                           { value: '3', label: 'Dihapus' },
                        ],
                     },
                     is_perubahan: {
                        label: 'Jenis Jadwal',
                        typeValue: 'number',
                        orientation: 'horizontal',
                        options: [
                           { value: '0', label: 'Murni' },
                           { value: '1', label: 'Perubahan' },
                        ],
                     },
                     is_active: {
                        label: 'Status Aktif',
                        typeValue: 'number',
                        orientation: 'horizontal',
                        options: [
                           { value: '0', label: 'Non Aktif' },
                           { value: '1', label: 'Aktif' },
                        ],
                     },
                     is_rinci_bl: {
                        label: 'Kelompok Jadwal',
                        typeValue: 'number',
                        orientation: 'horizontal',
                        options: [
                           { value: '0', label: 'Jadwal RKPD' },
                           { value: '1', label: 'Jadwal RKA' },
                        ],
                     },
                  }}
                  onSubmit={onSubmit}>
                  {({
                     is_active,
                     is_locked,
                     is_perubahan,
                     nama_sub_tahap,
                     waktu_mulai,
                     waktu_selesai,
                     id_unik,
                     is_rinci_bl,
                  }) => (
                     <>
                        <ModalHeader>Form Salin Jadwal</ModalHeader>
                        <ModalBody className='gap-3 transition-all duration-75'>
                           {is_rinci_bl}
                           {id_unik}
                           {nama_sub_tahap}
                           {waktu_mulai}
                           {waktu_selesai}
                           {is_perubahan}
                           <JadwalInput
                              placeholder='Pilih Jadwal Murni'
                              keyByIdUnik
                              params={{ is_perubahan: 1 }}
                              defaultSelectedKey={data?.id_unik_murni ?? data?.id_unik ?? undefined}
                              isRequired={!!isPerubahan}
                              onChange={onJadwalChange}
                              selectedKey={idUnikJadwalMurni}
                              isInvalid={!!errors?.id_jadwal_murni?.message}
                              errorMessage={errors?.id_jadwal_murni?.message}
                           />
                           {is_locked}
                           {is_active}
                        </ModalBody>
                        <ModalFooter>
                           <Button
                              color='danger'
                              isDisabled={isSubmitting || !open}
                              onPress={onClose}>
                              Tutup
                           </Button>
                           <Button
                              isLoading={isSubmitting || !open}
                              color='primary'
                              type='submit'>
                              Simpan
                           </Button>
                        </ModalFooter>
                     </>
                  )}
               </TsForm>
            )}
         </ModalContent>
      </Modal>
   )
}

export default ModalCopy
