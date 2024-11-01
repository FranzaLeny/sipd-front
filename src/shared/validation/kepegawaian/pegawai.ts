import { z } from 'zod'

export const PegawaiSchema = z.object({
   id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
   instansi: z.string().trim().min(1),
   nama_skpd: z.string().trim().min(1),
   kode_skpd: z.string().trim().min(1),
   nama_sub_skpd: z.string().trim().min(1).nullish(),
   kode_sub_skpd: z.string().trim().min(1).nullish(),
   nama_bagian: z.string().trim().min(1).nullish(),
   nama_sub_bagian: z.string().trim().min(1).nullish(),
   jenis_pegawai: z.string().trim().min(1),
   jenis_kelamin: z.string().trim().min(1),
   nama: z.string().trim().min(1),
   nip: z.string().trim().min(1).nullish(),
   gelar_depan: z.string().trim().min(1).nullish(),
   gelar_belakang: z.string().trim().min(1).nullish(),
   nik: z.string().trim().min(1).nullish(),
   npwp: z.string().trim().min(1).nullish(),
   alamat: z.string().trim().min(1).nullish(),
   jabatan: z.string().trim().min(1),
   pangkat_gol: z.string().trim().min(1).nullish(),
   eselon: z.number().min(1).max(6),
   is_asn: z.number().int(),
   tempat_lahir: z.string().trim().min(1),
   tanggal_lahir: z.coerce.date(),
   tanggal_asn: z.coerce.date().nullish(),
   locked: z.number().int(),
   id_daerah: z.number().int(),
   id_skpd: z.number().int(),
   created_by: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
      .nullish(),
   created_at: z.coerce.date(),
   updated_by: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
      .nullish(),
   updated_at: z.coerce.date(),
   deleted_at: z.coerce.date().nullish(),
})
export const PegawaiUncheckedCreateInputSchema = z
   .object({
      instansi: z.string({ description: 'Instansi Pemerintahan' }).trim().min(1),
      nama_skpd: z.string().trim().min(1),
      kode_skpd: z.string().trim().min(1),
      nama_sub_skpd: z.string().trim().min(1).optional().nullable(),
      kode_sub_skpd: z.string().trim().min(1).optional().nullable(),
      nama_bagian: z.string().trim().min(1).optional().nullable(),
      nama_sub_bagian: z.string().trim().min(1).optional().nullable(),
      jenis_pegawai: z.string().trim().min(1),
      jenis_kelamin: z.string().trim().min(1),
      nama: z.string({ description: 'Nama tanpa gelar' }).trim().min(1),
      nip: z.string({ description: 'NIP/NIPPPK' }).trim().min(1).optional().nullable(),
      gelar_depan: z.string().trim().min(1).optional().nullable(),
      gelar_belakang: z.string().trim().min(1).optional().nullable(),
      nik: z.string().trim().min(1).optional().nullable(),
      npwp: z.string().trim().min(1).optional().nullable(),
      alamat: z.string().trim().min(1).optional().nullable(),
      jabatan: z.string().trim().min(1),
      pangkat_gol: z.string().trim().min(1).optional().nullable(),
      eselon: z.coerce.number().min(1).max(6).optional().nullable(),
      is_asn: z.coerce.number().int(),
      tempat_lahir: z.string().trim().min(1),
      tanggal_lahir: z.coerce.date(),
      tanggal_asn: z.coerce.date().optional().nullable(),
      locked: z.coerce.number().int(),
      id_daerah: z.coerce.number().int(),
      id_skpd: z.coerce.number().int(),
   })
   .strip()

interface PankatPegawai {
   pangkat: string
   golongan: string
   ruang: string
}
declare global {
   type Pegawai = z.infer<typeof PegawaiSchema>
   type PegawaiUncheckedCreateInput = z.infer<typeof PegawaiUncheckedCreateInputSchema>
   type PegawaiWithPangkat = Pegawai & { pangkat: PankatPegawai | null }
}
