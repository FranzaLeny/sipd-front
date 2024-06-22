import { z } from '../zod'

/////////////////////////////////////////
// RAK SCHEMA
/////////////////////////////////////////

export const RakSchema = z.object({
   id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
   bulan_1: z.number().int(),
   bulan_10: z.number().int(),
   bulan_11: z.number().int(),
   bulan_12: z.number().int(),
   bulan_2: z.number().int(),
   bulan_3: z.number().int(),
   bulan_4: z.number().int(),
   bulan_5: z.number().int(),
   bulan_6: z.number().int(),
   bulan_7: z.number().int(),
   bulan_8: z.number().int(),
   bulan_9: z.number().int(),
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
   nilai: z.number().int(),
   nilai_rak: z.number().int(),
   tahun: z.number().int(),
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

export type Rak = z.infer<typeof RakSchema>

export const RakUncheckedCreateInputSchema = z
   .object({
      id: z
         .string()
         .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
         .optional(),
      bulan_1: z.number().int(),
      bulan_10: z.number().int(),
      bulan_11: z.number().int(),
      bulan_12: z.number().int(),
      bulan_2: z.number().int(),
      bulan_3: z.number().int(),
      bulan_4: z.number().int(),
      bulan_5: z.number().int(),
      bulan_6: z.number().int(),
      bulan_7: z.number().int(),
      bulan_8: z.number().int(),
      bulan_9: z.number().int(),
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
      kode_akun: z.string().trim().min(1),
      kode_bidang_urusan: z.string().trim().min(1),
      kode_giat: z.string().trim().min(1),
      kode_program: z.string().trim().min(1),
      kode_skpd: z.string().trim().min(1),
      kode_sub_giat: z.string().trim().min(1),
      kode_sub_skpd: z.string().trim().min(1),
      nama_akun: z.string().trim().min(1),
      nama_bidang_urusan: z.string().trim().min(1),
      nama_giat: z.string().trim().min(1),
      nama_program: z.string().trim().min(1),
      nama_skpd: z.string().trim().min(1),
      nama_sub_giat: z.string().trim().min(1),
      nama_sub_skpd: z.string().trim().min(1),
      nilai: z.number().int(),
      nilai_rak: z.number().int(),
      tahun: z.number().int(),
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

export type RakUncheckedCreateInput = z.infer<typeof RakUncheckedCreateInputSchema>

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

export type RakSkpd = z.infer<typeof RakSkpdSchema>

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
export type RakSkpdUncheckedCreateInput = z.infer<typeof RakSkpdUncheckedCreateInputSchema>
