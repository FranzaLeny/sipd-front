import { z } from 'zod'

export const PegawaiSchema = z.object({
   id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
   instansi: z.string(),
   nama_skpd: z.string(),
   kode_skpd: z.string(),
   nama_sub_skpd: z.string().nullish(),
   kode_sub_skpd: z.string().nullish(),
   nama_bagian: z.string().nullish(),
   nama_sub_bagian: z.string().nullish(),
   jenis_pegawai: z.string(),
   jenis_kelamin: z.string(),
   nama: z.string(),
   nip: z.string().trim().min(1).nullish(),
   gelar_depan: z.string().trim().min(1).nullish(),
   gelar_belakang: z.string().trim().min(1).nullish(),
   nik: z.string().trim().min(1),
   npwp: z.string().trim().min(1).nullish(),
   alamat: z.string().trim().min(1).nullish(),
   jabatan: z.string().trim().min(1),
   pangkat_gol: z.string().trim().min(1).nullish(),
   eselon: z.number().min(1).max(6),
   is_asn: z.number().int(),
   tempat_lahir: z.string().trim().min(1),
   tanggal_lahir: z.coerce.date(),
   tanggal_asn: z.coerce.date().nullish(),
   tahun: z.number().int().array(),
   locked: z.number().int(),
   id_daerah: z.number().int(),
   id_skpd: z.number().int(),
   id_sub_skpd: z.number().int(),
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

interface PankatPegawai {
   pangkat: string
   golongan: string
   ruang: string
}
declare global {
   type Pegawai = z.infer<typeof PegawaiSchema>
   type PegawaiWithPangkat = Pegawai & { pangkat: PankatPegawai | null }
}
