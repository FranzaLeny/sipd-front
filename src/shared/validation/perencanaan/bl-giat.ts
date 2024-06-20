import { z } from '../zod'

export const BlGiatSchema = z.object({
   id: z.string(),
   id_bl: z.number().int(),
   tahun: z.number().int(),
   id_urusan: z.number().int(),
   id_bidang_urusan: z.number().int(),
   id_daerah: z.number().int(),
   id_unit: z.number().int(),
   id_skpd: z.number().int(),
   id_sub_skpd: z.number().int(),
   id_program: z.number().int(),
   id_giat: z.number().int(),
   id_jadwal: z.number().int(),
   kode_bidang_urusan: z.string(),
   kode_bl: z.string(),
   kode_giat: z.string(),
   kode_program: z.string(),
   kode_skpd: z.string(),
   kode_sub_skpd: z.string(),
   kode_urusan: z.string(),
   nama_bidang_urusan: z.string(),
   nama_giat: z.string(),
   nama_program: z.string(),
   nama_skpd: z.string(),
   nama_sub_skpd: z.string(),
   nama_urusan: z.string(),
   sasaran: z.string(),
   jadwal_anggaran_id: z.string(),
   jadwal_anggaran_murni_id: z.string().nullish(),
})

export const BlGiatUncheckedCreateInputSchema = z
   .object({
      id: z.string().optional(),
      id_bl: z.number().int(),
      tahun: z.number().int(),
      id_urusan: z.number().int(),
      id_bidang_urusan: z.number().int(),
      id_daerah: z.number().int(),
      id_unit: z.number().int(),
      id_skpd: z.number().int(),
      id_sub_skpd: z.number().int(),
      id_program: z.number().int(),
      id_giat: z.number().int(),
      id_jadwal: z.number().int(),
      kode_bidang_urusan: z.string(),
      kode_bl: z.string(),
      kode_giat: z.string(),
      kode_program: z.string(),
      kode_skpd: z.string(),
      kode_sub_skpd: z.string(),
      kode_urusan: z.string(),
      nama_bidang_urusan: z.string(),
      nama_giat: z.string(),
      nama_program: z.string(),
      nama_skpd: z.string(),
      nama_sub_skpd: z.string(),
      nama_urusan: z.string(),
      sasaran: z.string(),
      jadwal_anggaran_id: z.string(),
      jadwal_anggaran_murni_id: z.string().optional().nullable(),
   })
   .strip()

export const CapaianBlGiatSchema = z.object({
   id: z.string(),
   id_bl: z.number().int(),
   id_capaian_bl: z.number().int(),
   id_daerah: z.number().int(),
   id_giat: z.number().int(),
   id_program: z.number().int(),
   id_skpd: z.number().int(),
   id_sub_skpd: z.number().int(),
   id_unit: z.number().int(),
   id_jadwal: z.number().int(),
   kode_rpjm: z.string(),
   satuan: z.string(),
   tahun: z.number().int(),
   target: z.string(),
   target_teks: z.string(),
   tolak_ukur: z.string(),
   created_by: z.string().nullish(),
   created_at: z.coerce.date(),
   updated_by: z.string().nullish(),
   updated_at: z.coerce.date(),
   bl_giat_id: z.string().nullish(),
   jadwal_anggaran_id: z.string(),
})

export const CapaianBlGiatUncheckedCreateInputSchema = z
   .object({
      id: z.string().optional(),
      id_bl: z.number().int(),
      id_capaian_bl: z.number().int(),
      id_daerah: z.number().int(),
      id_giat: z.number().int(),
      id_program: z.number().int(),
      id_skpd: z.number().int(),
      id_sub_skpd: z.number().int(),
      id_unit: z.number().int(),
      id_jadwal: z.number().int(),
      kode_rpjm: z.string(),
      satuan: z.string(),
      tahun: z.number().int(),
      target: z.string(),
      target_teks: z.string(),
      tolak_ukur: z.string(),
      bl_giat_id: z.string().optional().nullable(),
      jadwal_anggaran_id: z.string(),
   })
   .strip()

export type CapaianBlGiatUncheckedCreateInput = z.infer<
   typeof CapaianBlGiatUncheckedCreateInputSchema
>

export const HasilBlGiatSchema = z.object({
   id: z.string(),
   created_user: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_bl: z.number().int(),
   id_daerah: z.number().int(),
   id_giat: z.number().int(),
   id_hasil_bl: z.number().int(),
   id_jadwal: z.number().int(),
   id_program: z.number().int(),
   id_skpd: z.number().int(),
   id_sub_bl: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_sub_skpd: z.number().int(),
   id_unit: z.number().int(),
   satuan: z.string(),
   satuan_sub: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   tahun: z.number().int(),
   target: z.number().int(),
   target_sub: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   target_sub_teks: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   target_teks: z.string(),
   tolak_ukur: z.string(),
   tolok_ukur_sub: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   updated_user: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   created_by: z.string().nullish(),
   created_at: z.coerce.date(),
   updated_by: z.string().nullish(),
   updated_at: z.coerce.date(),
   bl_giat_id: z.string().nullish(),
   jadwal_anggaran_id: z.string(),
})

export type HasilBlGiat = z.infer<typeof HasilBlGiatSchema>

export const HasilBlGiatUncheckedCreateInputSchema = z
   .object({
      id: z.string().optional(),
      created_user: z
         .number()
         .int()
         .transform((v) => (v === 0 ? null : v))
         .optional()
         .nullable(),
      id_bl: z.number().int(),
      id_daerah: z.number().int(),
      id_giat: z.number().int(),
      id_hasil_bl: z.number().int(),
      id_jadwal: z.number().int(),
      id_program: z.number().int(),
      id_skpd: z.number().int(),
      id_sub_bl: z
         .number()
         .int()
         .transform((v) => (v === 0 ? null : v))
         .optional()
         .nullable(),
      id_sub_skpd: z.number().int(),
      id_unit: z.number().int(),
      satuan: z.string(),
      satuan_sub: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      tahun: z.number().int(),
      target: z.number().int(),
      target_sub: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      target_sub_teks: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      target_teks: z.string(),
      tolak_ukur: z.string(),
      tolok_ukur_sub: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      updated_user: z
         .number()
         .int()
         .transform((v) => (v === 0 ? null : v))
         .optional()
         .nullable(),
      bl_giat_id: z.string().optional().nullable(),
      jadwal_anggaran_id: z.string(),
   })
   .strip()

export type HasilBlGiatUncheckedCreateInput = z.infer<typeof HasilBlGiatUncheckedCreateInputSchema>

export const OutputBlGiatSchema = z.object({
   id: z.string(),
   id_daerah: z.number().int(),
   id_bl: z.number().int(),
   id_giat: z.number().int(),
   id_output_giat: z.number().int(),
   id_program: z.number().int(),
   id_skpd: z.number().int(),
   id_sub_skpd: z.number().int(),
   id_unit: z.number().int(),
   id_jadwal: z.number().int(),
   kode_renstra: z.string(),
   kode_rpjm: z.string(),
   satuan: z.string(),
   tahun: z.number().int(),
   target: z.string(),
   target_teks: z.string(),
   tolok_ukur: z.string(),
   created_by: z.string().nullish(),
   created_at: z.coerce.date(),
   updated_by: z.string().nullish(),
   updated_at: z.coerce.date(),
   bl_giat_id: z.string().nullish(),
   jadwal_anggaran_id: z.string(),
})

export type OutputBlGiat = z.infer<typeof OutputBlGiatSchema>

export const OutputBlGiatUncheckedCreateInputSchema = z
   .object({
      id: z.string().optional(),
      id_daerah: z.number().int(),
      id_bl: z.number().int(),
      id_giat: z.number().int(),
      id_output_giat: z.number().int(),
      id_program: z.number().int(),
      id_skpd: z.number().int(),
      id_sub_skpd: z.number().int(),
      id_unit: z.number().int(),
      id_jadwal: z.number().int(),
      kode_renstra: z.string(),
      kode_rpjm: z.string(),
      satuan: z.string(),
      tahun: z.number().int(),
      target: z.string(),
      target_teks: z.string(),
      tolok_ukur: z.string(),
      bl_giat_id: z.string().optional().nullable(),
      jadwal_anggaran_id: z.string(),
   })
   .strip()

export type OutputBlGiatUncheckedCreateInput = z.infer<
   typeof OutputBlGiatUncheckedCreateInputSchema
>

export const CapaianBlGiatDeleteByListIdValidationSchema = z
   .object({
      jadwal_anggaran_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
      bl_giat_id: z
         .string()
         .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
         .optional(),
      list_id_capaian_bl: z.array(CapaianBlGiatSchema.shape.id_capaian_bl).min(1),
      id_unit: CapaianBlGiatSchema.shape.id_unit,
      id_skpd: z.number().optional(),
      operation: z.enum(['in', 'notIn']),
   })
   .strip()

export const HasilBlGiatDeleteByListIdValidationSchema = z
   .object({
      jadwal_anggaran_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
      bl_giat_id: z
         .string()
         .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
         .optional(),
      list_id_hasil_bl: z.array(HasilBlGiatSchema.shape.id_hasil_bl).min(1),
      id_unit: HasilBlGiatSchema.shape.id_unit,
      id_skpd: z.number().optional(),
      operation: z.enum(['in', 'notIn']),
   })
   .strip()

export const OutputBlGiatDeleteByListIdValidationSchema = z
   .object({
      jadwal_anggaran_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
      bl_giat_id: z
         .string()
         .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
         .optional(),
      list_id_output_giat: z.array(OutputBlGiatSchema.shape.id_output_giat).min(1),
      id_unit: OutputBlGiatSchema.shape.id_unit,
      id_skpd: z.number().optional(),
      operation: z.enum(['in', 'notIn']),
   })
   .strip()

export const BlGiatDeleteByListIdValidationSchema = z
   .object({
      jadwal_anggaran_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
      list_id: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })).min(1),
      id_unit: BlGiatSchema.shape.id_unit,
      id_skpd: z.number().optional(),
      operation: z.enum(['in', 'notIn']),
   })
   .strip()

export const BlGiatPayloadSchema = z
   .object({
      tahun: z.coerce.number(),
      id_daerah: z.coerce.number(),
      id_program: z.coerce.number(),
      id_giat: z.coerce.number(),
      id_unit: z.coerce.number(),
      id_skpd: z.coerce.number(),
      id_sub_skpd: z.coerce.number(),
   })
   .strip()
