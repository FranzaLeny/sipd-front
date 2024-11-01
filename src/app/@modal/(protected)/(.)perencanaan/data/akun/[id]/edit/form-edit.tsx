'use client'

import BooleanInput from '@components/form/boolean-input'
import TextInput from '@components/form/text-input'
import { createTsForm, createUniqueFieldSchema } from '@ts-react/form'
import { z } from '@zod'

const zTahun = createUniqueFieldSchema(z.number({ description: 'Tahun' }).int().array(), 'tahun')
export const AkunEditSchema = z.object({
   tahun: zTahun,
   nama_akun: z.string().trim().min(1, { message: 'Nama Akun tidak boleh kosong' }),
   kode_akun: z.string().trim().min(1, { message: 'Kode Akun tidak boleh kosong' }),
   is_pendapatan: z.coerce.number({ description: 'Akun Pendapatan' }).int(),
   is_pembiayaan: z.coerce.number({ description: 'Akun Pembiayaan' }).int(),
   is_bl: z.coerce.number({ description: 'Akun Belanja' }).int(),
   is_gaji_asn: z.coerce.number({ description: 'Akun Belanja Gaji dan Tunjangan ASN' }).int(),
   is_barjas: z.coerce.number({ description: 'Akun Belanja Barang Jasa dan Modal' }).int(),
   is_bagi_hasil: z.coerce.number({ description: 'Akun Belanja Bagi Hasil' }).int(),
   is_bankeu_khusus: z.coerce.number({ description: 'Akun Belanja Bantuan Keuangan Khusus' }).int(),
   is_bankeu_umum: z.coerce.number({ description: 'Akun Belanja Bantuan Keuangan Umum' }).int(),
   is_bos: z.coerce.number({ description: 'Akun Dana Bos (BOS Pusat)' }).int(),
   is_btt: z.coerce.number({ description: 'Akun Belanja Tidak Terduga (BTT)' }).int(),
   is_bunga: z.coerce.number({ description: 'Akun Belanja Bunga' }).int(),
   is_hibah_brg: z.coerce.number({ description: 'Akun Belanja Hibah (Barang / Jasa)' }).int(),
   is_hibah_uang: z.coerce.number({ description: 'Akun Belanja Bantuan Hibah (Uang)' }).int(),
   is_modal_tanah: z.coerce.number({ description: 'Akun Belanja Pembebasan Tanah / Lahan' }).int(),
   is_sosial_brg: z.coerce
      .number({ description: 'Akun Belanja Bantuan Sosial (Barang / Jasa)' })
      .int(),
   is_sosial_uang: z.coerce.number({ description: 'Akun Belanja Bantuan Sosial (Uang)' }).int(),
   is_subsidi: z.coerce.number({ description: 'Akun Belanja Subsidi' }).int(),
   is_tkdn: z.coerce.number({ description: 'Akun Tingkat Komponen Dalam Negeri' }).int(),
   set_kab_kota: z.coerce.number({ description: 'Akun Kabupaten/Kota' }).int(),
   set_prov: z.coerce.number({ description: 'Akun Provinsi' }).int(),
   set_input: z.coerce.number({ description: 'Akun Bisa Diinput' }).int(),
   is_locked: z.coerce.number({ description: 'Akun Dikunci' }).int(),
   is_pdinas: z.coerce.number({ description: 'Akun Perjalanan Dinas' }).int().nullable().optional(),
   ket_akun: z.string({ description: 'Keterangan Akun' }).optional().nullable(),
})

export type AkunEdit = z.infer<typeof AkunEditSchema>
const mapping = [
   [z.string(), TextInput],
   [z.number(), BooleanInput],
   [zTahun, TextInput],
] as const
export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {}

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
