import { z } from 'zod'

export const PDinasSchema = z.object({
   id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
   nomor: z.string(),
   dasar: z.string().array(),
   jenis: z.string(),
   is_lanjutan: z.number().int(),
   tingkat_pd: z.string(),
   maksud_pd: z.string(),
   maksud_pd_lanjutan: z.string().nullish(),
   untuk: z.string().array(),
   tanggal_berangkat: z.coerce.date(),
   tanggal_pulang: z.coerce.date(),
   jumlah_hari: z.number().int(),
   alat_angkut: z.string(),
   tempat_berangkat: z.string(),
   tempat_tujuan: z.string(),
   id_prop: z.string(),
   id_kab_kota: z.string(),
   id_desa_kel: z.string(),
   id_sub_bl: z.number().int(),
   tahun: z.number().int(),
   nama_sub_giat: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
   kode_sub_giat: z.string(),
   nama_akun: z.number().int(),
   kode_akun: z.number().int(),
   pembebanan: z.string(),
   instansi: z.string(),
   tanggal_spt: z.coerce.date(),
   tanggal_spd: z.coerce.date(),
   jabatan_ttd_spt: z.string(),
   jabatan_ttd_spd: z.string(),
   nama_ttd_spt: z.string(),
   nama_ttd_spd: z.string(),
   pangkat_ttd_spt: z.string(),
   pangkat_ttd_spd: z.string(),
   nip_ttd_spt: z.string(),
   nip_ttd_spd: z.string(),
   id_pegawai_ttd_spt: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
      .nullish(),
   id_pegawai_ttd_spd: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
      .nullish(),
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
})

declare global {
   type PDinas = z.infer<typeof PDinasSchema>
}
