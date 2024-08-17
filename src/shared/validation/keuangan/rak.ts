import { z } from '../zod'

/////////////////////////////////////////
// RAK SCHEMA
/////////////////////////////////////////

export const RakSchema = z.object({
   id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
   id_akun: z.number().int(),
   id_bidang_urusan: z.number().int(),
   id_daerah: z.number().int(),
   id_giat: z.number().int(),
   id_program: z.number().int(),
   id_rak_belanja: z.number().int(),
   id_skpd: z.number().int(),
   id_sub_giat: z.number().int(),
   id_sub_skpd: z.number().int(),
   id_unit: z.number().int(),
   id_urusan: z.number().int(),
   is_valid_bud: z.number().int(),
   is_valid_sekda: z.number().int(),
   is_valid_skpd: z.number().int(),
   kode_akun: z.string(),
   kode_bidang_urusan: z.string(),
   kode_giat: z.string(),
   kode_program: z.string(),
   kode_skpd: z.string(),
   kode_sub_giat: z.string(),
   kode_sub_skpd: z.string(),
   nama_akun: z.string(),
   nama_bidang_urusan: z.string(),
   nama_giat: z.string(),
   nama_program: z.string(),
   nama_skpd: z.string(),
   nama_sub_giat: z.string(),
   nama_sub_skpd: z.string(),
   tahun: z.number().int(),
   nilai: z.number().nullish(),
   nilai_rak: z.number().nullish(),
   nilai_realisasi: z.number().nullish(),
   bulan_1: z.number().nullish(),
   bulan_2: z.number().nullish(),
   bulan_3: z.number().nullish(),
   bulan_4: z.number().nullish(),
   bulan_5: z.number().nullish(),
   bulan_6: z.number().nullish(),
   bulan_7: z.number().nullish(),
   bulan_8: z.number().nullish(),
   bulan_9: z.number().nullish(),
   bulan_10: z.number().nullish(),
   bulan_11: z.number().nullish(),
   bulan_12: z.number().nullish(),
   realisasi_1: z.number().nullish(),
   realisasi_2: z.number().nullish(),
   realisasi_3: z.number().nullish(),
   realisasi_4: z.number().nullish(),
   realisasi_5: z.number().nullish(),
   realisasi_6: z.number().nullish(),
   realisasi_7: z.number().nullish(),
   realisasi_8: z.number().nullish(),
   realisasi_9: z.number().nullish(),
   realisasi_10: z.number().nullish(),
   realisasi_11: z.number().nullish(),
   realisasi_12: z.number().nullish(),
   bl_sub_giat_aktif_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
   bl_sub_giat_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
   jadwal_anggaran_murni_id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
      .nullish(),
   jadwal_anggaran_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
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

export const RakUncheckedCreateInputSchema = z
   .object({
      id_akun: z.number().int(),
      id_bidang_urusan: z.number().int(),
      id_daerah: z.number().int(),
      id_giat: z.number().int(),
      id_program: z.number().int(),
      id_rak_belanja: z.number().int(),
      id_skpd: z.number().int(),
      id_sub_giat: z.number().int(),
      id_sub_skpd: z.number().int(),
      id_unit: z.number().int(),
      id_urusan: z.number().int(),
      is_valid_bud: z.number().int(),
      is_valid_sekda: z.number().int(),
      is_valid_skpd: z.number().int(),
      kode_akun: z.string(),
      kode_bidang_urusan: z.string(),
      kode_giat: z.string(),
      kode_program: z.string(),
      kode_skpd: z.string(),
      kode_sub_giat: z.string(),
      kode_sub_skpd: z.string(),
      nama_akun: z.string(),
      nama_bidang_urusan: z.string(),
      nama_giat: z.string(),
      nama_program: z.string(),
      nama_skpd: z.string(),
      nama_sub_giat: z.string(),
      nama_sub_skpd: z.string(),
      tahun: z.number().int(),
      nilai: z.number().nullish(),
      nilai_rak: z.number().nullish(),
      nilai_realisasi: z.number().nullish(),
      bulan_1: z.number().nullish(),
      bulan_2: z.number().nullish(),
      bulan_3: z.number().nullish(),
      bulan_4: z.number().nullish(),
      bulan_5: z.number().nullish(),
      bulan_6: z.number().nullish(),
      bulan_7: z.number().nullish(),
      bulan_8: z.number().nullish(),
      bulan_9: z.number().nullish(),
      bulan_10: z.number().nullish(),
      bulan_11: z.number().nullish(),
      bulan_12: z.number().nullish(),
      realisasi_1: z.number().nullish(),
      realisasi_2: z.number().nullish(),
      realisasi_3: z.number().nullish(),
      realisasi_4: z.number().nullish(),
      realisasi_5: z.number().nullish(),
      realisasi_6: z.number().nullish(),
      realisasi_7: z.number().nullish(),
      realisasi_8: z.number().nullish(),
      realisasi_9: z.number().nullish(),
      realisasi_10: z.number().nullish(),
      realisasi_11: z.number().nullish(),
      realisasi_12: z.number().nullish(),
      bl_sub_giat_aktif_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
      bl_sub_giat_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
      jadwal_anggaran_murni_id: z
         .string()
         .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
         .optional()
         .nullable(),
      jadwal_anggaran_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
   })
   .strip()

/////////////////////////////////////////
// RAK SKPD SCHEMA
/////////////////////////////////////////

export const RakSkpdSchema = z.object({
   id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
   id_daerah: z.number().int(),
   id_skpd: z.number().int(),
   kode_skpd: z.string().trim().min(1),
   nama_skpd: z.string().trim().min(1),
   nilai: z.number().int(),
   nilai_rak: z.number().int(),
   status: z.number().int(),
   tahun: z.number().int(),
   jadwal_anggaran_murni_id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
      .nullish(),
   jadwal_anggaran_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
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

export const RakSkpdUncheckedCreateInputSchema = z
   .object({
      id_daerah: z.number().int(),
      id_skpd: z.number().int(),
      kode_skpd: z.string().trim().min(1),
      nama_skpd: z.string().trim().min(1),
      nilai: z.number().int(),
      nilai_rak: z.number().int(),
      status: z.number().int(),
      tahun: z.number().int(),
      jadwal_anggaran_murni_id: z
         .string()
         .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
         .optional()
         .nullable(),
      jadwal_anggaran_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
   })
   .strip()

export const RealisasiRakInputValidationSchema = RakSchema.pick({
   id: true,
   realisasi_1: true,
   realisasi_2: true,
   realisasi_3: true,
   realisasi_4: true,
   realisasi_5: true,
   realisasi_6: true,
   realisasi_7: true,
   realisasi_8: true,
   realisasi_9: true,
   realisasi_10: true,
   realisasi_11: true,
   realisasi_12: true,
   nilai_realisasi: true,
}).strip()

declare global {
   type Rak = z.infer<typeof RakSchema>
   type RakUncheckedCreateInput = z.infer<typeof RakUncheckedCreateInputSchema>
   type RakSkpd = z.infer<typeof RakSkpdSchema>
   type RakSkpdUncheckedCreateInput = z.infer<typeof RakSkpdUncheckedCreateInputSchema>
   type RealisasiRakInput = z.infer<typeof RealisasiRakInputValidationSchema>
}
