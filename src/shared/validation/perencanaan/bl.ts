import { z } from '../zod'

export const JadwalAnggaranSchema = z.object({
   id: z.string(),
   id_unik: z.string(),
   geser_khusus: z.number().int(),
   id_daerah: z.number().int(),
   id_jadwal: z.number().int(),
   id_jadwal_murni: z.number().int(),
   id_unik_murni: z.string().nullish(),
   id_jadwal_pembahasan: z.number().int(),
   id_jadwal_rpjmd: z.number().int(),
   id_sub_rkpd: z.number().int(),
   id_tahap: z.number().int(),
   is_locked: z.number().int(),
   is_pembahasan: z.number().int(),
   is_perubahan: z.number().int(),
   is_public: z.number().int(),
   is_rinci_bl: z.number().int(),
   is_lokal: z.number(),
   nama_sub_tahap: z.string(),
   no_perda: z.string(),
   no_perkada: z.string(),
   no_registrasi: z.string(),
   rkpd_murni: z.number().int(),
   rkpd_pak: z.number().int(),
   is_active: z.number(),
   tahun: z.number().int(),
   tandai_jadwal: z.number().int(),
   created_user: z.number().int().nullish(),
   updated_user: z.number().int().nullish(),
   kua_murni: z.string().nullish(),
   kua_pak: z.string().nullish(),
   nama_daerah: z.string().nullish(),
   nama_jadwal_murni: z.string().nullish(),
   nama_jadwal_pembahasan: z.string().nullish(),
   nama_jadwal_rpjmd: z.string().nullish(),
   nama_sub_rkpd: z.string().nullish(),
   nama_tahap: z.string().nullish(),
   rollback_jadwal: z.string().nullish(),
   rollback_teks: z.string().nullish(),
   rollback_text: z.string().nullish(),
   tgl_perda: z.string().nullish(),
   tgl_perkada: z.string().nullish(),
   tgl_rka: z.string().nullish(),
   waktu_mulai: z.coerce.date(),
   waktu_selesai: z.coerce.date(),
   id_jadwal_penatausahaan: z.number().int().nullish(),
   jadwal_penatausahaan: z.string().nullish(),
   created_by: z.string().nullish(),
   created_at: z.coerce.date(),
   updated_by: z.string().nullish(),
   updated_at: z.coerce.date(),
})

export type JadwalAnggaran = z.infer<typeof JadwalAnggaranSchema>

export const JadwalAnggaranUncheckedCreateInputSchema = z
   .object({
      id: z.string().optional(),
      id_unik: z.string(),
      geser_khusus: z.number().int(),
      id_daerah: z.number().int(),
      id_jadwal: z.number().int(),
      id_jadwal_murni: z.number().int(),
      id_unik_murni: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      id_jadwal_pembahasan: z.number().int(),
      id_jadwal_rpjmd: z.number().int(),
      id_sub_rkpd: z.number().int(),
      id_tahap: z.coerce.number().int(),
      is_locked: z.number().int(),
      is_pembahasan: z.number().int(),
      is_perubahan: z.number().int(),
      is_public: z.number().int(),
      is_rinci_bl: z.number().int(),
      is_lokal: z.number().optional().default(0),
      nama_sub_tahap: z.string(),
      no_perda: z.string(),
      no_perkada: z.string(),
      no_registrasi: z.string(),
      rkpd_murni: z.number().int(),
      rkpd_pak: z.number().int(),
      is_active: z.number().optional().default(0),
      tahun: z.number().int(),
      tandai_jadwal: z.number().int(),
      created_user: z
         .number()
         .int()
         .transform((v) => (v === 0 ? null : v))
         .optional()
         .nullable(),
      updated_user: z
         .number()
         .int()
         .transform((v) => (v === 0 ? null : v))
         .optional()
         .nullable(),
      kua_murni: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      kua_pak: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      nama_daerah: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      nama_jadwal_murni: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      nama_jadwal_pembahasan: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      nama_jadwal_rpjmd: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      nama_sub_rkpd: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      nama_tahap: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      rollback_jadwal: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      rollback_teks: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      rollback_text: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      tgl_perda: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      tgl_perkada: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      tgl_rka: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      id_jadwal_penatausahaan: z.number().int().optional().nullable(),
      jadwal_penatausahaan: z.string().optional().nullable(),
      waktu_mulai: z.coerce.date(),
      waktu_selesai: z.coerce.date(),
   })
   .strip()

export const JadwalAnggaranUncheckedUpdateInputSchema =
   JadwalAnggaranUncheckedCreateInputSchema.omit({
      id: true,
   })
      .partial()
      .strip()

export const BlSkpdSchema = z.object({
   id: z.string(),
   tahun: z.number().int(),
   id_daerah: z.number().int(),
   id_skpd: z.number().int(),
   id_unit: z.number().int(),
   id_jadwal: z.number().int(),
   kode_skpd: z.string(),
   nama_skpd: z.string(),
   total_giat: z.number().int(),
   belanja_terbuka: z.number().int(),
   set_pagu_skpd: z.number(),
   set_pagu_giat: z.number(),
   pagu_murni: z.number().nullish(),
   rinci_giat: z.number().nullish(),
   realisasi: z.number().nullish(),
   rincian_terbuka: z.number().int().nullish(),
   created_by: z.string().nullish(),
   created_at: z.coerce.date(),
   updated_by: z.string().nullish(),
   updated_at: z.coerce.date(),
   jadwal_anggaran_id: z.string(),
   jadwal_anggaran_murni_id: z.string().nullish(),
})

export type BlSkpd = z.infer<typeof BlSkpdSchema>

export const BlSkpdUncheckedCreateInputSchema = z
   .object({
      id: z.string().optional(),
      tahun: z.number().int(),
      id_daerah: z.number().int(),
      id_skpd: z.number().int(),
      id_unit: z.number().int(),
      id_jadwal: z.number().int(),
      kode_skpd: z.string(),
      nama_skpd: z.string(),
      total_giat: z.number().int(),
      belanja_terbuka: z.number().int(),
      set_pagu_skpd: z.number(),
      set_pagu_giat: z.number(),
      pagu_murni: z.number().optional().nullable(),
      realisasi: z.number().optional().nullable(),
      rinci_giat: z.number().optional().nullable(),
      rincian_terbuka: z.number().int().optional().nullable(),
      jadwal_anggaran_id: z.string(),
      jadwal_anggaran_murni_id: z.string().nullish(),
   })
   .strip()

export const BlSkpdDeleteByListIdValidationSchema = z
   .object({
      jadwal_anggaran_id: BlSkpdSchema.shape.jadwal_anggaran_id,
      list_id: z.array(BlSkpdSchema.shape.id).min(1),
      operation: z.enum(['in', 'notIn']),
   })
   .strip()

export const LaporanBlSkpdParamsSchema = z
   .object({
      id_skpd: z.coerce.number(),
      id_unit: z.coerce.number(),
      tahun: z.coerce.number(),
      jadwal_anggaran_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
   })
   .strict()
export type LaporanBlSkpdParams = z.infer<typeof LaporanBlSkpdParamsSchema>
