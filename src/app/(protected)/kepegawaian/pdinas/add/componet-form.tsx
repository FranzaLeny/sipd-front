'use client'

import BooleanInput from '@components/form/boolean-input'
import DateInput from '@components/form/date-time-input'
import { TextAreaInput } from '@components/form/text-area-input'
import TextInput from '@components/form/text-input'
import { createTsForm, createUniqueFieldSchema } from '@ts-react/form'
import { z } from '@zod'

const zMaksudPd = createUniqueFieldSchema(
   z
      .string({ description: 'Maksud Perjalanan Dinas' })
      .trim()
      .min(1, { message: 'Tidak Boleh Kosong' }),
   'maksud_pd'
)
const zMaksudPdLanjutan = createUniqueFieldSchema(
   z.string({ description: 'Maksud Perjalanan Dinas Lanjutan' }).trim().min(1).optional(),
   'maksud_pd_lanjutan'
)
const zBoolean = createUniqueFieldSchema(
   z.coerce.number({ description: 'Tugas Lanjutan?' }).min(0).max(1),
   'booleanField'
)

const PelaksanaPdSchema = z
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
const PelaksanaPdInputSchema = z
   .array(PelaksanaPdSchema, {
      required_error: 'Pelaksana perjalanan dinas tidak boleh kosong',
      invalid_type_error: 'Pelaksana perjalanan dinas tidak sesuai',
      message: 'Pelaksana perjalanan dinas tidak tidak valid',
   })
   .min(1, {
      message: 'Pelaksana perjalanan dinas tidak boleh kosong',
   })

const zPelaksanaPd = createUniqueFieldSchema(PelaksanaPdInputSchema, 'pelaksana')

const mapping = [
   [z.string(), TextInput],
   [z.number(), TextInput],
   [z.date(), DateInput],
   [zMaksudPd, TextAreaInput],
   [zMaksudPdLanjutan, TextAreaInput],
   [zBoolean, BooleanInput],
   [zPelaksanaPd, TextInput],
] as const

const mappingText = [
   [z.string(), TextAreaInput],
   [z.number(), TextAreaInput],
] as const

const PDinasInputSchema = z
   .object({
      pelaksana: zPelaksanaPd,
      is_lanjutan: zBoolean,
      dasar: z.string().trim().min(1).array().min(1, 'Dasar Perjalanan dinas tidak boleh kosong'),
      maksud_pd: zMaksudPd,
      tujuan_pd: z.string().trim().min(1).array().min(1, 'Tujuan Perjalanan tidak boleh kosong'),
      maksud_pd_lanjutan: zMaksudPdLanjutan,
      tempat_tujuan: z
         .string({
            description: 'Tempat/lokasi Tujuan',
         })
         .trim()
         .min(1, {
            message: 'Tempat/lokasi Tujuan Tidak Boleh Kosong',
         }),
      tahun: z.coerce.number({
         description: 'Tahun',
      }),
      nama_sub_giat: z
         .string({
            description: 'Sub Kegiatan',
         })
         .trim()
         .min(1, { message: 'Sub Kegiatan Tidak Boleh Kosong' }),
      id_sub_bl: z.coerce.number().int().min(1),
      kode_sub_giat: z.string().trim().min(1),
      kode_sbl: z.string().trim().min(1),
      id_akun: z.coerce.number().int().min(1),
      nama_akun: z.string().trim().min(1),
      kode_akun: z.string().trim().min(1),
      unit_kerja: z.string().trim().min(1),
      tanggal_berangkat: z.coerce.date({
         description: 'Tanggal Berangkat',
         required_error: 'Pilih Tanggal Berangkat',
      }),
      tempat_berangkat: z
         .string({
            description: 'Berangkat dari',
         })
         .trim()
         .min(1, {
            message: 'Tempat Berangkat Tidak Boleh Kosong',
         }),
      tanggal_pulang: z.coerce.date({
         description: 'Tanggal Harus Kembali // Pilih Tanggal Kembali',
         required_error: 'Pilih Tanggal Kembali',
      }),
      alat_angkut: z
         .string({
            description: 'Alat Angkut // Masukan kendaraan yang digunalan',
         })
         .trim()
         .min(1, {
            message: 'Alat Angkut Tidak Boleh Kosong',
         }),

      jabatan_ttd_spt: z
         .string({
            description: 'Jabatan Penadatangan SPT',
         })
         .trim()
         .min(1, {
            message: 'Jabatan Penadatangan SPT Tidak Boleh Kosong',
         }),
      nama_ttd_spt: z
         .string({
            description: 'Nama Penadatangan SPT',
         })
         .trim()
         .min(1, {
            message: 'Nama Penadatangan SPT Tidak Boleh Kosong',
         }),
      nip_ttd_spt: z
         .string({
            description: 'NIP Penadatangan SPT',
         })
         .trim()
         .min(1, {
            message: 'NIP Penadatangan SPT Tidak Boleh Kosong',
         }),
      nomor_spt: z
         .string({
            description: 'Nomor SPT',
         })
         .trim()
         .min(1, {
            message: 'Nomor SPT Tidak Boleh Kosong',
         }),
      tanggal_spt: z.date({
         description: 'Tanggal SPT',
      }),
      tempat_terbit_spt: z
         .string({
            description: 'Tempat Terbit SPT',
         })
         .trim()
         .min(1, {
            message: 'Tempat Terbit SPT Tidak Boleh Kosong',
         }),
      jabatan_ttd_spd: z
         .string({
            description: 'Jabatan Penadatangan SPD',
         })
         .trim()
         .min(1, {
            message: 'Jabatan Penadatangan SPD Tidak Boleh Kosong',
         }),
      nama_ttd_spd: z.coerce.string({
         description: 'Nama Penadatangan SPT',
      }),
      nip_ttd_spd: z
         .string({
            description: 'NIP Penadatangan SPD',
         })
         .trim()
         .min(1, {
            message: 'NIP Penadatangan SPD Tidak Boleh Kosong',
         }),
      tanggal_spd: z.coerce.date({
         description: 'Tanggal SPPD',
         required_error: 'Tanggal SPPD Tidak Boleh Kosong',
      }),
      nomor_spd: z
         .string({
            description: 'Nomor SPD',
         })
         .trim()
         .min(1, {
            message: 'Nomor SPD Tidak Boleh Kosong',
         }),
      tempat_terbit_spd: z
         .string({
            description: 'Tempat Terbit SPD',
         })
         .trim()
         .min(1, {
            message: 'Tempat Terbit SPD Tidak Boleh Kosong',
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

const TextInputSchema = z.object({
   value: z
      .string({
         description: 'Masukan teks...',
         message: 'Tidak Boleh Kosong',
      })
      .trim()
      .min(1, { message: 'Tidak Boleh Kosong' }),
})

const TsForm = createTsForm(mapping, { FormComponent: CardForm })
const DasarForm = createTsForm(mappingText, { FormComponent: CardForm })

type PDinasInput = z.infer<typeof PDinasInputSchema>
interface FormProps extends React.HTMLAttributes<HTMLFormElement> {}
type PelaksanaPdValues = PDinasInput['pelaksana']
type PelaksanaPd = z.infer<typeof PelaksanaPdSchema>
type TextInput = z.infer<typeof TextInputSchema>

export { DasarForm, PDinasInputSchema, PelaksanaPdSchema, TextInputSchema, TsForm }
export type { PDinasInput, PelaksanaPd, PelaksanaPdValues, TextInput }
