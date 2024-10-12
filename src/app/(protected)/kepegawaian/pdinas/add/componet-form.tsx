'use client'

import BooleanInput from '@components/form/boolean-input'
import DateInput from '@components/form/date-time-input'
import { TextAreaInput } from '@components/form/text-area-input'
import TextInput from '@components/form/text-input'
import { createTsForm, createUniqueFieldSchema } from '@ts-react/form'
import { z } from '@zod'

const zMaksudPd = createUniqueFieldSchema(
   z.string({ description: 'Maksud Perjalanan Dinas' }).trim().min(1),
   'maksud_pd'
)
const zMaksudPdLanjutan = createUniqueFieldSchema(
   z.string({ description: 'Maksud Perjalanan Dinas Lanjutan' }).trim().min(1).optional(),
   'maksud_pd_lanjutan'
)
export const zBoolean = createUniqueFieldSchema(
   z.number({ description: 'Tugas Lanjutan?' }).min(0).max(1),
   'booleanField'
)

export const PelaksanaPdSchema = z
   .object({
      nomor_urut: z.number().int().min(1),
      nama: z.string(),
      nip: z.string().trim().min(1).optional().nullable(),
      pangkat_gol: z.string().optional().nullable(),
      jabatan: z.string().trim().min(1),
      tanggal_lahir: z.date(),
      keterangan: z.string({
         description: 'Tingkat Perjalanan dinas // Masukan Eselon / Golongan',
      }),
      pegawai_id: z.string(),
      jenis_pegawai: z.string(),
      unit_kerja: z.string(),
      is_pengikut: zBoolean,
   })
   .strip()
export const PelaksanaPdInputSchema = PelaksanaPdSchema.array()
export type PelaksanaPd = z.infer<typeof PelaksanaPdSchema>
export const zPelaksanaPd = createUniqueFieldSchema(PelaksanaPdInputSchema, 'pelaksana')
const mapping = [
   [z.string(), TextInput],
   [z.number(), TextInput],
   [z.date(), DateInput],
   [zMaksudPd, TextAreaInput],
   [zMaksudPdLanjutan, TextAreaInput],
   [zBoolean, BooleanInput],
   [zPelaksanaPd, TextInput],
] as const

export const PDinasInputSchema = z
   .object({
      pelaksana: zPelaksanaPd,
      is_lanjutan: zBoolean,
      dasar: z.string().trim().min(1).array().min(1),
      maksud_pd: zMaksudPd,
      maksud_pd_lanjutan: zMaksudPdLanjutan,
      tempat_tujuan: z.string({
         description: 'Masukan Tempat Tujuan',
      }),
      tanggal_berangkat: z.date({
         description: 'Tanggal Berangkat // Pilih Tanggal Berangkat',
      }),
      tempat_berangkat: z.string({
         description: 'Berangkat dari',
      }),
      tanggal_pulang: z.date({
         description: 'Tanggal Harus Kembali // Pilih Tanggal Kembali',
      }),
      alat_angkut: z.string({
         description: 'Alat Angkut',
      }),

      jabatan_ttd_spt: z.string({
         description: 'Jabatan Penadatangan SPT',
      }),
      nama_ttd_spt: z.string({
         description: 'Nama Penadatangan SPT',
      }),
      nip_ttd_spt: z.string({
         description: 'NIP Penadatangan SPT',
      }),
      nomor_spt: z.string({
         description: 'Nomor SPT',
      }),
      tanggal_spt: z.date({
         description: 'Tanggal SPT',
      }),
      tempat_terbit_spt: z.string({
         description: 'Temoat Terbit SPT',
      }),
      jabatan_ttd_spd: z.string({
         description: 'Jabatan Penadatangan SPD',
      }),
      nama_ttd_spd: z.string({
         description: 'Nama Penadatangan SPT',
      }),
      nip_ttd_spd: z.string({
         description: 'NIP Penadatangan SPD',
      }),
      tanggal_spd: z.date({
         description: 'Tanggal SPPD',
      }),
      nomor_spd: z.string({
         description: 'Nomor SPD',
      }),
      tempat_terbit_spd: z.string({
         description: 'Temoat Terbit SPD',
      }),
   })
   .strict()
   .superRefine(async (data, ctx) => {
      if (data?.is_lanjutan && !data?.maksud_pd_lanjutan) {
         ctx.addIssue({
            code: 'custom',
            message: 'Maksud Perjalanan Dinas Lanjutan harus diisi',
            path: ['maksud_pd_lanjutan'],
         })
      }
   })
export type PDinasInput = z.infer<typeof PDinasInputSchema>
export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {}
export type PelaksanaPdValues = PDinasInput['pelaksana']
const CardForm = (props: FormProps) => {
   return (
      <form
         id='form-sppt'
         name='form-sppt'
         className='flex flex-col gap-3'
         {...props}
      />
   )
}

export const TsForm = createTsForm(mapping, { FormComponent: CardForm })
