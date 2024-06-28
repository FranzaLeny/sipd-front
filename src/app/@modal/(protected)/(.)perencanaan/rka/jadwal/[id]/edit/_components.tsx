'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { JadwalAnggaran, updateJadwalAnggaran } from '@actions/perencanaan/rka/jadwal-anggaran'
import BooleanInput from '@components/form/boolean-input'
import DateInput from '@components/form/date-time-input'
import { NumberInput, TextInput } from '@components/form/text-input'
import JadwalInput from '@components/perencanaan/jadwal-anggaran'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import { useQueryClient } from '@tanstack/react-query'
import { createTsForm, createUniqueFieldSchema } from '@ts-react/form'
import { z } from '@zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const booleanSchema = createUniqueFieldSchema(z.number().int().max(1), 'boolean')
export const JadwalAnggaranEditInputSchema = z
   .object({
      id_jadwal_murni: z.coerce.number().int(),
      id_unik_murni: z.string().optional().nullable(),
      is_perubahan: z.boolean({ description: 'Perubahan' }),
      nama_sub_tahap: z.string({ description: 'Nama Sub Tahap' }),
      waktu_selesai: z.date({ description: 'Waktu Selesai // Pilih Tanggal' }),
      waktu_mulai: z.date({ description: 'Waktu Mulai // Pilih Tanggal' }),
      nama_jadwal_murni: z.string({ description: 'Nama Jadwal Murni' }).nullable(),
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
      if (data?.is_perubahan && !data?.id_jadwal_murni) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Jadwal Anggaran Murni tidak boleh kosong',
            path: ['id_jadwal_murni'],
         })
      }
      if (data?.id_jadwal_murni && !data?.is_perubahan) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Perubahan harus dicentang jika Jadwal Anggaran Murni diisi',
            path: ['is_perubahan'],
         })
      }
   })

const mapping = [
   [z.string(), TextInput] as const,
   [z.date(), DateInput] as const,
   [z.number(), NumberInput] as const,
   [booleanSchema, BooleanInput] as const,
] as const

export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {}

type Schema = z.infer<typeof JadwalAnggaranEditInputSchema>

const FormComponent = (props: FormProps) => <form {...props} />

const TsForm = createTsForm(mapping, { FormComponent })

interface Props {
   data: JadwalAnggaran
   user: UserWithoutToken
}

const ModalEdit: React.FC<Props> = ({ data }) => {
   const [isOpen, setIsOpen] = useState(false)
   const router = useRouter()
   const queryClient = useQueryClient()
   const defaultValues = {
      id_jadwal_murni: data?.id_jadwal_murni,
      id_unik_murni: data?.id_unik_murni,
      is_active: data.is_active,
      is_locked: data.is_locked,
      is_perubahan: data.is_perubahan,
      nama_sub_tahap: data?.nama_sub_tahap,
      waktu_mulai: new Date(data?.waktu_mulai),
      waktu_selesai: new Date(data?.waktu_selesai),
      nama_jadwal_murni: data?.nama_jadwal_murni,
   }
   const form = useForm<Schema>({
      defaultValues,
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
            ...value,
            is_lokal: 1,
            is_locked: value.is_locked,
            is_perubahan: value.is_perubahan,
         }
         await updateJadwalAnggaran(data.id, valida_data).then((res) => {
            if (res?.success) {
               toast.success(
                  `${res?.message ?? 'Berhasil ubah data'} ${valida_data?.nama_sub_tahap}`
               )
               queryClient.invalidateQueries({
                  type: 'all',
                  refetchType: 'active',
                  exact: false,
                  predicate: ({ queryKey }: any) => {
                     return queryKey.includes('jadwal_anggaran')
                  },
               })

               handleClose()
            } else {
               toast.error(`${res?.message ?? 'Gagal ubah data'} ${valida_data?.nama_sub_tahap}`, {
                  autoClose: 5000,
               })
            }
         })
      } catch (error: any) {
         toast.error(error?.message ?? 'Gagal Ubah data', { autoClose: 5000 })
      }
   }
   const isPerubahan = watch('is_perubahan')

   const idUnikMurni = watch('id_unik_murni')
   const onJadwalChange = useCallback(
      (data?: JadwalAnggaran) => {
         if (data) {
            handleValueChange('id_jadwal_murni', data.id_jadwal)
            handleValueChange('id_unik_murni', data.id_unik)
            handleValueChange('nama_jadwal_murni', data.nama_jadwal_murni)
            handleValueChange('is_perubahan', 1)
         } else {
            handleValueChange('is_perubahan', 0)
            handleValueChange('id_jadwal_murni', 0)
            handleValueChange('id_unik_murni', null)
            handleValueChange('nama_jadwal_murni', null)
         }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [handleValueChange]
   )
   useEffect(() => {
      if (!!!isPerubahan) {
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
                  schema={JadwalAnggaranEditInputSchema}
                  props={{
                     waktu_mulai: { labelPlacement: 'outside' },
                     waktu_selesai: { labelPlacement: 'outside' },
                     is_active: { label: 'Aktif', typeValue: 'number' },
                     is_perubahan: { label: 'Perubahan', typeValue: 'number' },
                     is_locked: { label: 'Kunci', typeValue: 'number' },
                  }}
                  onSubmit={onSubmit}>
                  {({
                     is_active,
                     is_locked,
                     is_perubahan,
                     nama_sub_tahap,
                     waktu_mulai,
                     waktu_selesai,
                  }) => (
                     <>
                        <ModalHeader>Form Tambah Jadwal</ModalHeader>
                        <ModalBody className='gap-3 transition-all duration-75'>
                           {nama_sub_tahap}
                           {waktu_mulai}
                           {waktu_selesai}
                           <JadwalInput
                              params={{}}
                              label='Jadwal Murni'
                              placeholder='Pilih Jadwal Murni'
                              keyByIdUnik
                              defaultSelectedKey={data?.id_unik_murni ?? undefined}
                              disabledKeys={[data?.id_unik]}
                              isRequired={!!isPerubahan}
                              selectedKey={idUnikMurni}
                              isInvalid={!!errors?.id_jadwal_murni?.message}
                              errorMessage={!!errors?.id_jadwal_murni?.message}
                              onChange={onJadwalChange}
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

export default ModalEdit
