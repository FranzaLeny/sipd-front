'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createJadwalAnggaran } from '@actions/perencanaan/rka/jadwal-anggaran'
import BooleanInput from '@components/form/boolean-input'
import DateInput from '@components/form/date-time-input'
import { NumberInput, TextInput } from '@components/form/text-input'
import JadwalInput from '@components/perencanaan/jadwal-anggaran'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import { useQueryClient } from '@tanstack/react-query'
import { createTsForm, createUniqueFieldSchema } from '@ts-react/form'
import { JadwalAnggaran, z } from '@zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const booleanSchema = createUniqueFieldSchema(z.number().int().max(1), 'boolean')

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
      is_locked: booleanSchema,
      is_active: booleanSchema,
      is_perubahan: booleanSchema,
   })
   .strip()
   .superRefine((data, ctx) => {
      if (data.waktu_selesai < data.waktu_mulai) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Waktu Selesai tidak boleh kurang dari Waktu Mulai',
            path: ['waktu_selesai'],
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
   })

const mapping = [
   [z.string(), TextInput] as const,
   [z.number(), NumberInput] as const,
   [z.date(), DateInput] as const,
   [booleanSchema, BooleanInput] as const,
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
         is_active: data.is_active,
         is_locked: data.is_locked,
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

   useEffect(() => {
      console.log(errors)
   }, [errors])

   const onSubmit = async (value: Schema) => {
      try {
         const valida_data = {
            ...data,
            ...value,
            id_unik: data?.id_unik + ' || ' + value.id_unik,
            is_lokal: 1,
            id: undefined,
            is_locked: value.is_locked,
            is_perubahan: value.is_perubahan,
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
      if (!isPerubahan) {
         handleValueChange('id_jadwal_murni', 0)
         handleValueChange('id_unik_murni', null)
         handleValueChange('nama_jadwal_murni', null)
      }
   }, [isPerubahan, handleValueChange])

   return (
      <Modal
         isOpen={isOpen}
         onClose={handleClose}
         scrollBehavior='outside'
         size='3xl'>
         <ModalContent>
            {(onClose) => (
               <TsForm
                  form={form}
                  schema={JadwalAnggaranCopyInputSchema}
                  props={{
                     is_locked: { label: 'Kunci Jadwal', typeValue: 'number' },
                     is_perubahan: { label: 'Perubahan', typeValue: 'number' },
                     is_active: { label: 'Aktif', typeValue: 'number' },
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
                  }) => (
                     <>
                        <ModalHeader>Form Salin Jadwal</ModalHeader>
                        <ModalBody className='gap-3 transition-all duration-75'>
                           {id_unik}
                           {nama_sub_tahap}
                           {waktu_mulai}
                           {waktu_selesai}
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
                           <div className='flex w-full justify-around'>
                              {is_locked}
                              {is_perubahan}
                              {is_active}
                           </div>
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
