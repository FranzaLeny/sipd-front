'use client'

import DateInput from '@components/form/date-time-input'
import RadioGroupInput from '@components/form/radio-input'
import TextInput from '@components/form/text-input'
import { EselonInput } from '@components/master/eselon'
import { createTsForm, createUniqueFieldSchema } from '@ts-react/form'
import { PegawaiUncheckedCreateInputSchema } from '@validations/kepegawaian/pegawai'
import { z } from '@zod'

const zJenisPns = createUniqueFieldSchema(
   z.enum(['PNS', 'P3K', 'PPNPNS'], {
      description: 'Jenis Pegawai',
      message: 'Jenis Pegawai Tidak Valid',
   }),
   'jenis_pegawai'
)
const zJenisKelamin = createUniqueFieldSchema(
   z.enum(['L', 'P'], {
      description: 'Jenis Kelamin',
      message: 'Jenis Kelamin Tidak Valid',
   }),
   'jenis_kelamin'
)
const zEselon = createUniqueFieldSchema(
   z.coerce
      .number({ message: 'Eselon tidak valid' })
      .min(1, { message: 'Eselon tidak valid' })
      .max(6, { message: 'Eselon tidak valid' }),
   'eselon'
)

export const PegawaiCreateSchema = PegawaiUncheckedCreateInputSchema.merge(
   z.object({
      jenis_pegawai: zJenisPns,
      jenis_kelamin: zJenisKelamin,
      eselon: zEselon,
   })
).superRefine((data, ctx) => {
   if (data.tanggal_asn && data.tanggal_asn < data?.tanggal_lahir) {
      ctx.addIssue({
         code: 'custom',
         message: 'TMT ASN tidak boleh lebih kecil dari tanggal Lahir',
         path: ['tanggal_asn'],
      })
      ctx.addIssue({
         code: 'custom',
         message: 'Tanggal Lahir tidak boleh lebih besar dari TMT ASN',
         path: ['tanggal_lahir'],
      })
   }
   if (!!data?.is_asn && !data?.nip) {
      ctx.addIssue({
         code: 'custom',
         message: 'NIP ASN harus diisi',
         path: ['nip'],
      })
   }
   if (!!data?.is_asn && !data?.pangkat_gol) {
      ctx.addIssue({
         code: 'custom',
         message: 'Pangkat/Golongan ASN harus diisi',
         path: ['pangkat_gol'],
      })
   }
})

export type PegawaiCreate = z.infer<typeof PegawaiCreateSchema>
const mapping = [
   [z.string(), TextInput],
   [z.number(), TextInput],
   [z.date(), DateInput],
   [zJenisPns, RadioGroupInput],
   [zJenisKelamin, RadioGroupInput],
   [zEselon, EselonInput],
] as const
export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {}

const CardForm = (props: FormProps) => {
   return (
      <form
         className='flex flex-col gap-3'
         {...props}
      />
   )
}

export const TsForm = createTsForm(mapping, { FormComponent: CardForm })
