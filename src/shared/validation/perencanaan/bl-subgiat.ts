import { z } from '../zod'

/////////////////////////////////////////
// BL SUB GIAT SCHEMA
/////////////////////////////////////////

export const BlSubGiatSchema = z.object({
   id: z.string(),
   created_user: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_bidang_urusan: z.number().int(),
   id_bidang_urusan_pusat: z.number().int(),
   id_bl: z.number().int(),
   id_daerah: z.number().int(),
   id_dana: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_giat: z.number().int(),
   id_jadwal: z.number().int(),
   id_jadwal_murni: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_lokasi: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_pptk: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_program: z.number().int(),
   id_skpd: z.number().int(),
   id_sub_bl: z.number().int(),
   id_sub_giat: z.number().int(),
   id_sub_skpd: z.number().int(),
   id_unik: z.string(),
   id_unit: z.number().int(),
   id_urusan: z.number().int(),
   id_urusan_pusat: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   kode_bidang_urusan: z.string(),
   kode_bidang_urusan_pusat: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   kode_daerah: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   kode_dana: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   kode_giat: z.string(),
   kode_program: z.string(),
   kode_skpd: z.string(),
   kode_sub_giat: z.string(),
   kode_sub_skpd: z.string(),
   kode_unit: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   kode_urusan: z.string(),
   kode_urusan_pusat: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   kua_murni: z.number().int(),
   kua_pak: z.number().int(),
   kunci_akb_rinci_at: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   kunci_bl: z.number().int(),
   kunci_bl_akb: z.number().int(),
   kunci_bl_akb_user: z.number().int(),
   kunci_bl_at: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   kunci_bl_rinci: z.number().int(),
   kunci_bl_rinci_at: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   kunci_bl_rinci_user: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   kunci_bl_user: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   migrated_at: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_bidang_urusan: z.string(),
   nama_bidang_urusan_pusat: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_bl: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_daerah: z.string(),
   nama_dana: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_giat: z.string(),
   nama_jadwal_murni: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_lokasi: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_pptk: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_program: z.string(),
   nama_skpd: z.string(),
   nama_sub_giat: z.string(),
   nama_sub_skpd: z.string(),
   nama_unit: z.string(),
   nama_urusan: z.string(),
   nama_urusan_pusat: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   no_sub_giat: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   output_teks: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   pagu: z.number(),
   pagu_indikatif: z.number(),
   pagu_n_depan: z.number().nullish(),
   pagu_n_lalu: z.number(),
   pagu_n2_depan: z.number(),
   pagu_n2_lalu: z.number(),
   rkpd_murni: z.number(),
   rkpd_pak: z.number(),
   set_pagu_at: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   set_pagu_user: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   tahun: z.number().int(),
   total_rincian: z.number().nullish(),
   updated_user: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   waktu_akhir: z.number().int(),
   waktu_awal: z.number().int(),
   pagu_murni: z.number().nullish(),
   jadwal_anggaran_id: z.string(),
   jadwal_anggaran_murni_id: z.string().nullish(),
   bl_giat_id: z.string().nullish(),
   bl_sub_giat_aktif_id: z.string().nullish(),
   created_by: z.string().nullish(),
   created_at: z.coerce.date(),
   updated_by: z.string().nullish(),
   updated_at: z.coerce.date(),
})

export type BlSubGiat = z.infer<typeof BlSubGiatSchema>

export const BlSubGiatUncheckedCreateInputSchema = z
   .object({
      id: z.string().optional(),
      created_user: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_bidang_urusan: z.number().int(),
      id_bidang_urusan_pusat: z.number().int(),
      id_bl: z.number().int(),
      id_daerah: z.number().int(),
      id_dana: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_giat: z.number().int(),
      id_jadwal: z.number().int(),
      id_jadwal_murni: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_lokasi: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_pptk: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_program: z.number().int(),
      id_skpd: z.number().int(),
      id_sub_bl: z.number().int(),
      id_sub_giat: z.number().int(),
      id_sub_skpd: z.number().int(),
      id_unik: z.string(),
      id_unit: z.number().int(),
      id_urusan: z.number().int(),
      id_urusan_pusat: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      kode_bidang_urusan: z.string(),
      kode_bidang_urusan_pusat: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      kode_daerah: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      kode_dana: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      kode_giat: z.string(),
      kode_program: z.string(),
      kode_skpd: z.string(),
      kode_sub_giat: z.string(),
      kode_sub_skpd: z.string(),
      kode_unit: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      kode_urusan: z.string(),
      kode_urusan_pusat: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      kua_murni: z.number().int(),
      kua_pak: z.number().int(),
      kunci_akb_rinci_at: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      kunci_bl: z.number().int(),
      kunci_bl_akb: z.number().int(),
      kunci_bl_akb_user: z.number().int(),
      kunci_bl_at: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      kunci_bl_rinci: z.number().int(),
      kunci_bl_rinci_at: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      kunci_bl_rinci_user: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      kunci_bl_user: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      migrated_at: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      nama_bidang_urusan: z.string(),
      nama_bidang_urusan_pusat: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      nama_bl: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      nama_daerah: z.string(),
      nama_dana: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      nama_giat: z.string(),
      nama_jadwal_murni: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      nama_lokasi: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      nama_pptk: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      nama_program: z.string(),
      nama_skpd: z.string(),
      nama_sub_giat: z.string(),
      nama_sub_skpd: z.string(),
      nama_unit: z.string(),
      nama_urusan: z.string(),
      nama_urusan_pusat: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      no_sub_giat: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      output_teks: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      pagu: z.number(),
      pagu_indikatif: z.number(),
      pagu_n_depan: z.number().optional().nullable(),
      pagu_n_lalu: z.number(),
      pagu_n2_depan: z.number(),
      pagu_n2_lalu: z.number(),
      rkpd_murni: z.number(),
      rkpd_pak: z.number(),
      set_pagu_at: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      set_pagu_user: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      tahun: z.number().int(),
      total_rincian: z.number().optional().nullable(),
      updated_user: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      waktu_akhir: z.number().int(),
      waktu_awal: z.number().int(),
      pagu_murni: z.number().optional().nullable().default(null),
      jadwal_anggaran_id: z.string(),
      jadwal_anggaran_murni_id: z.string().optional().nullable(),
      bl_giat_id: z.string().optional().nullable(),
      bl_sub_giat_aktif_id: z.string().optional().nullable(),
   })
   .strip()
export type BlSubGiatUncheckedCreateInput = z.infer<typeof BlSubGiatUncheckedCreateInputSchema>

/////////////////////////////////////////
// BL SUB GIAT AKTIF SCHEMA
/////////////////////////////////////////

export const BlSubGiatAktifSchema = z.object({
   id: z.string(),
   created_date: z.string(),
   created_time: z.string(),
   created_user: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_bidang_urusan: z.number().int(),
   id_daerah: z.number().int(),
   id_giat: z.number().int(),
   id_program: z.number().int(),
   id_skpd: z.number().int(),
   id_sub_bl: z.number().int(),
   id_sub_giat: z.number().int(),
   id_sub_skpd: z.number().int(),
   id_unit: z.number().int(),
   id_urusan: z.number().int(),
   is_locked: z.number().int(),
   id_jadwal: z.number().int(),
   id_jadwal_murni: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   kode_bidang_urusan: z.string(),
   kode_bl: z.string(),
   kode_giat: z.string(),
   kode_program: z.string(),
   kode_sbl: z.string(),
   kode_skpd: z.string(),
   kode_sub_giat: z.string(),
   kode_sub_skpd: z.string(),
   kode_urusan: z.string(),
   kunci_bl: z.number().int(),
   kunci_bl_rinci: z.number().int(),
   nama_bidang_urusan: z.string(),
   nama_giat: z.string(),
   nama_program: z.string(),
   nama_skpd: z.string(),
   nama_sub_giat: z.string(),
   nama_sub_skpd: z.string(),
   nama_urusan: z.string(),
   pagu: z.number(),
   pagu_giat: z.number(),
   pagu_indikatif: z.number(),
   set_pagu_at: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   set_pagu_user: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   tahun: z.number().int(),
   rinci_giat: z.number().nullish(),
   rincian: z.number().nullish(),
   pagu_murni: z.number().nullish(),
   updated_date: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   updated_time: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   user_created: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   user_updated: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_jadwal_murni: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   created_by: z.string().nullish(),
   created_at: z.coerce.date(),
   updated_by: z.string().nullish(),
   updated_at: z.coerce.date(),
   jadwal_anggaran_id: z.string(),
   jadwal_anggaran_murni_id: z.string().nullish(),
   bl_giat_id: z.string().nullish(),
})

export type BlSubGiatAktif = z.infer<typeof BlSubGiatAktifSchema>

export const BlSubGiatAktifUncheckedCreateInputSchema = z
   .object({
      id: z.string().optional(),
      created_date: z.string(),
      created_time: z.string(),
      created_user: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_bidang_urusan: z.number().int(),
      id_daerah: z.number().int(),
      id_giat: z.number().int(),
      id_program: z.number().int(),
      id_skpd: z.number().int(),
      id_sub_bl: z.number().int(),
      id_sub_giat: z.number().int(),
      id_sub_skpd: z.number().int(),
      id_unit: z.number().int(),
      id_urusan: z.number().int(),
      is_locked: z.number().int(),
      id_jadwal: z.number().int(),
      id_jadwal_murni: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      kode_bidang_urusan: z.string(),
      kode_bl: z.string(),
      kode_giat: z.string(),
      kode_program: z.string(),
      kode_sbl: z.string(),
      kode_skpd: z.string(),
      kode_sub_giat: z.string(),
      kode_sub_skpd: z.string(),
      kode_urusan: z.string(),
      kunci_bl: z.number().int(),
      kunci_bl_rinci: z.number().int(),
      nama_bidang_urusan: z.string(),
      nama_giat: z.string(),
      nama_program: z.string(),
      nama_skpd: z.string(),
      nama_sub_giat: z.string(),
      nama_sub_skpd: z.string(),
      nama_urusan: z.string(),
      pagu: z.number(),
      pagu_giat: z.number(),
      pagu_indikatif: z.number(),
      set_pagu_at: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      set_pagu_user: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      tahun: z.number().int(),
      rinci_giat: z.number().optional().nullable(),
      rincian: z.number().optional().nullable(),
      pagu_murni: z.number().optional().nullable(),
      updated_date: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      updated_time: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      user_created: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      user_updated: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      nama_jadwal_murni: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      jadwal_anggaran_id: z.string(),
      jadwal_anggaran_murni_id: z.string().optional().nullable(),
      bl_giat_id: z.string().optional().nullable(),
   })
   .strip()

/////////////////////////////////////////
// DANA BL SUB GIAT SCHEMA
/////////////////////////////////////////

export const DanaBlSubGiatSchema = z.object({
   id: z.string(),
   created_user: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_bl: z.number().int(),
   id_daerah: z.number().int(),
   id_dana: z.number(),
   id_dana_sub_bl: z.number().int(),
   id_giat: z.number().int(),
   id_jadwal: z.number().int(),
   id_program: z.number().int(),
   id_skpd: z.number().int(),
   id_sub_bl: z.number().int(),
   id_sub_giat: z.number().int(),
   id_sub_skpd: z.number().int(),
   id_unik: z.string(),
   id_unit: z.number().int(),
   is_locked: z.string(),
   kode_dana: z.string(),
   nama_dana: z.string(),
   pagu_dana: z.number(),
   tahun: z.number().int(),
   created_by: z.string().nullish(),
   created_at: z.coerce.date(),
   updated_by: z.string().nullish(),
   updated_at: z.coerce.date(),
   bl_sub_giat_id: z.string().nullish(),
   jadwal_anggaran_id: z.string(),
})

export type DanaBlSubGiat = z.infer<typeof DanaBlSubGiatSchema>

export const DanaBlSubGiatUncheckedCreateInputSchema = z
   .object({
      id: z.string().optional(),
      created_user: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_bl: z.number().int(),
      id_daerah: z.number().int(),
      id_dana: z.coerce.number().int(),
      id_dana_sub_bl: z.number().int(),
      id_giat: z.number().int(),
      id_jadwal: z.number().int(),
      id_program: z.number().int(),
      id_skpd: z.number().int(),
      id_sub_bl: z.number().int(),
      id_sub_giat: z.number().int(),
      id_sub_skpd: z.number().int(),
      id_unik: z.string(),
      id_unit: z.number().int(),
      is_locked: z.string(),
      kode_dana: z.string(),
      nama_dana: z.string(),
      pagu_dana: z.number(),
      tahun: z.number().int(),
      bl_sub_giat_id: z.string().optional().nullable(),
      jadwal_anggaran_id: z.string(),
   })
   .strip()

export type DanaBlSubGiatUncheckedCreateInput = z.infer<
   typeof DanaBlSubGiatUncheckedCreateInputSchema
>

/////////////////////////////////////////
// LABEL BL SUB GIAT SCHEMA
/////////////////////////////////////////

export const LabelBlSubGiatSchema = z.object({
   id: z.string(),
   created_user: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_bl: z.number().int(),
   id_daerah: z.number().int(),
   id_giat: z.number().int(),
   id_jadwal: z.number().int(),
   id_label_bl: z.number().int(),
   id_label_kokab: z.number().int(),
   id_label_prov: z.number().int(),
   id_label_pusat: z.number().int(),
   id_program: z.number().int(),
   id_skpd: z.number().int(),
   id_sub_bl: z.number().int(),
   id_sub_giat: z.number().int(),
   id_sub_skpd: z.number().int(),
   id_unit: z.number().int(),
   kode_daerah: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   kode_giat: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   kode_program: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   kode_skpd: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   kode_sub_giat: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   kode_sub_skpd: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   kode_unit: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_bl: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_daerah: z.string(),
   nama_giat: z.string(),
   nama_label_kokab: z.string(),
   nama_label_prov: z.string(),
   nama_label_pusat: z.string(),
   nama_program: z.string(),
   nama_skpd: z.string(),
   nama_sub_bl: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_sub_giat: z.string(),
   nama_sub_skpd: z.string(),
   nama_unit: z.string(),
   tahun: z.number().int(),
   updated_user: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   created_by: z.string().nullish(),
   created_at: z.coerce.date(),
   updated_by: z.string().nullish(),
   updated_at: z.coerce.date(),
   bl_sub_giat_id: z.string().nullish(),
   jadwal_anggaran_id: z.string(),
})

export type LabelBlSubGiat = z.infer<typeof LabelBlSubGiatSchema>

export const LabelBlSubGiatUncheckedCreateInputSchema = z
   .object({
      id: z.string().optional(),
      created_user: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_bl: z.number().int(),
      id_daerah: z.number().int(),
      id_giat: z.number().int(),
      id_jadwal: z.number().int(),
      id_label_bl: z.number().int(),
      id_label_kokab: z.number().int(),
      id_label_prov: z.number().int(),
      id_label_pusat: z.number().int(),
      id_program: z.number().int(),
      id_skpd: z.number().int(),
      id_sub_bl: z.number().int(),
      id_sub_giat: z.number().int(),
      id_sub_skpd: z.number().int(),
      id_unit: z.number().int(),
      kode_daerah: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      kode_giat: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      kode_program: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      kode_skpd: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      kode_sub_giat: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      kode_sub_skpd: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      kode_unit: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      nama_bl: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      nama_daerah: z.string(),
      nama_giat: z.string(),
      nama_label_kokab: z.string(),
      nama_label_prov: z.string(),
      nama_label_pusat: z.string(),
      nama_program: z.string(),
      nama_skpd: z.string(),
      nama_sub_bl: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      nama_sub_giat: z.string(),
      nama_sub_skpd: z.string(),
      nama_unit: z.string(),
      tahun: z.number().int(),
      updated_user: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      bl_sub_giat_id: z.string().optional().nullable(),
      jadwal_anggaran_id: z.string(),
   })
   .strip()

export type LabelBlSubGiatUncheckedCreateInput = z.infer<
   typeof LabelBlSubGiatUncheckedCreateInputSchema
>

/////////////////////////////////////////
// LOKASI BL SUB GIAT SCHEMA
/////////////////////////////////////////

export const LokasiBlSubGiatSchema = z.object({
   id: z.string(),
   created_user: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_bl: z.number().int(),
   id_camat: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_daerah: z.number().int(),
   id_detil_lokasi: z.number().int(),
   id_giat: z.number().int(),
   id_jadwal: z.number().int(),
   id_kab_kota: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_lurah: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_program: z.number().int(),
   id_skpd: z.number().int(),
   id_sub_bl: z.number().int(),
   id_sub_giat: z.number().int(),
   id_sub_skpd: z.number().int(),
   id_unit: z.number().int(),
   kode_camat: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   kode_daerah: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   kode_kab_kota: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   kode_lurah: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_camat: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_daerah: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_kab_kota: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_lurah: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_unit: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   tahun: z.number().int(),
   updated_user: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   created_by: z.string().nullish(),
   created_at: z.coerce.date(),
   updated_by: z.string().nullish(),
   updated_at: z.coerce.date(),
   bl_sub_giat_id: z.string().nullish(),
   jadwal_anggaran_id: z.string(),
})

export type LokasiBlSubGiat = z.infer<typeof LokasiBlSubGiatSchema>

export const LokasiBlSubGiatUncheckedCreateInputSchema = z
   .object({
      id: z.string().optional(),
      created_user: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_bl: z.number().int(),
      id_camat: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_daerah: z.number().int(),
      id_detil_lokasi: z.number().int(),
      id_giat: z.number().int(),
      id_jadwal: z.number().int(),
      id_kab_kota: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_lurah: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_program: z.number().int(),
      id_skpd: z.number().int(),
      id_sub_bl: z.number().int(),
      id_sub_giat: z.number().int(),
      id_sub_skpd: z.number().int(),
      id_unit: z.number().int(),
      kode_camat: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      kode_daerah: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      kode_kab_kota: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      kode_lurah: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      nama_camat: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      nama_daerah: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      nama_kab_kota: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      nama_lurah: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      nama_unit: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      tahun: z.number().int(),
      updated_user: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      bl_sub_giat_id: z.string().optional().nullable(),
      jadwal_anggaran_id: z.string(),
   })
   .strip()

export type LokasiBlSubGiatUncheckedCreateInput = z.infer<
   typeof LokasiBlSubGiatUncheckedCreateInputSchema
>

/////////////////////////////////////////
// OUTPUT BL SUB GIAT SCHEMA
/////////////////////////////////////////

export const OutputBlSubGiatSchema = z.object({
   id: z.string(),
   created_user: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_bl: z.number().int(),
   id_daerah: z.number().int(),
   id_giat: z.number().int(),
   id_jadwal: z.number().int(),
   id_output_bl: z.number().int(),
   id_program: z.number().int(),
   id_skpd: z.number().int(),
   id_sub_bl: z.number().int(),
   id_sub_giat: z.number().int(),
   id_sub_skpd: z.number().int(),
   id_unit: z.number().int(),
   satuan: z.string(),
   satuan_sub: z.string(),
   tahun: z.number().int(),
   target: z.string(),
   target_sub: z.number().int(),
   target_sub_teks: z.string(),
   target_teks: z.string(),
   tolak_ukur: z.string(),
   tolok_ukur_sub: z.string(),
   updated_user: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   created_by: z.string().nullish(),
   created_at: z.coerce.date(),
   updated_by: z.string().nullish(),
   updated_at: z.coerce.date(),
   bl_sub_giat_id: z.string().nullish(),
   jadwal_anggaran_id: z.string(),
})

export type OutputBlSubGiat = z.infer<typeof OutputBlSubGiatSchema>

export const OutputBlSubGiatUncheckedCreateInputSchema = z
   .object({
      id: z.string().optional(),
      created_user: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_bl: z.number().int(),
      id_daerah: z.number().int(),
      id_giat: z.number().int(),
      id_jadwal: z.number().int(),
      id_output_bl: z.number().int(),
      id_program: z.number().int(),
      id_skpd: z.number().int(),
      id_sub_bl: z.number().int(),
      id_sub_giat: z.number().int(),
      id_sub_skpd: z.number().int(),
      id_unit: z.number().int(),
      satuan: z.string(),
      satuan_sub: z.string(),
      tahun: z.number().int(),
      target: z.string(),
      target_sub: z.number().int(),
      target_sub_teks: z.string(),
      target_teks: z.string(),
      tolak_ukur: z.string(),
      tolok_ukur_sub: z.string(),
      updated_user: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      bl_sub_giat_id: z.string().optional().nullable(),
      jadwal_anggaran_id: z.string(),
   })
   .strip()
export type OutputBlSubGiatUncheckedCreateInput = z.infer<
   typeof OutputBlSubGiatUncheckedCreateInputSchema
>
/////////////////////////////////////////
// RINCI BL SUB GIAT SCHEMA
/////////////////////////////////////////

export const RinciBlSubGiatSchema = z.object({
   id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
   id_akun: z.number().int(),
   id_daerah: z.number().int(),
   id_dana: z.number().int(),
   id_giat: z.number().int(),
   id_jadwal: z.number().int(),
   id_program: z.number().int(),
   id_rinci_sub_bl: z.number().int(),
   id_skpd: z.number().int(),
   id_standar_harga: z.number().int(),
   id_sub_bl: z.number().int(),
   id_sub_giat: z.number().int(),
   id_sub_skpd: z.number().int(),
   id_unik: z.string(),
   id_unit: z.number().int(),
   id_bl: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_blt: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_jadwal_murni: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_jenis_usul: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_ket_sub_bl: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_standar_nfs: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_subs_sub_bl: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_usulan: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   is_lokus_akun: z.number().int(),
   jenis_bl: z.string(),
   kode_akun: z.string(),
   kode_standar_harga: z.string(),
   koefisien: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   kua_murni: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   kua_pak: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   kode_bidang_urusan: z.string(),
   kode_giat: z.string(),
   kode_program: z.string(),
   kode_skpd: z.string(),
   kode_sub_giat: z.string(),
   kode_sub_skpd: z.string(),
   kode_urusan: z.string(),
   lokus_akun_teks: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_bl: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_blt: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_jenis_usul: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_standar_nfs: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_sub_giat: z.string(),
   nama_giat: z.string(),
   nama_program: z.string(),
   nama_sub_skpd: z.string(),
   nama_unit: z.string(),
   nama_skpd: z.string(),
   nama_bidang_urusan: z.string(),
   nama_urusan: z.string(),
   nama_sub_bl: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_usulan: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   pajak: z.number().nullish(),
   rkpd_murni: z.number().int(),
   rkpd_pak: z.number().int(),
   sat_1: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   sat_2: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   sat_3: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   sat_4: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   set_sisa_kontrak: z.number().int(),
   spek: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   ssh_locked: z.coerce.number().nullish(),
   tahun: z.number().int(),
   total_harga: z.number().nullish(),
   updated_user: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   vol_1: z
      .number()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   vol_2: z
      .number()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   vol_3: z
      .number()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   vol_4: z
      .number()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   volume: z
      .number()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   created_user: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   harga_satuan: z.number(),
   koefisien_murni: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   total_harga_murni: z.number().nullish(),
   volume_murni: z.number().nullish(),
   pajak_murni: z.number().nullish(),
   harga_satuan_murni: z.number().nullish(),
   nama_standar_harga: z
      .string()
      .nullish()
      .transform((v) => (v === '' ? null : v)),
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
   jadwal_anggaran_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
   jadwal_anggaran_murni_id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
      .nullish(),
   bl_sub_giat_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
})

export type RinciBlSubGiat = z.infer<typeof RinciBlSubGiatSchema>

export const RinciBlSubGiatUncheckedCreateInputSchema = z
   .object({
      id: z.string().optional(),
      id_akun: z.number().int(),
      id_daerah: z.number().int(),
      id_dana: z.number().int(),
      id_giat: z.number().int(),
      id_jadwal: z.number().int(),
      id_program: z.number().int(),
      id_rinci_sub_bl: z.number().int(),
      id_skpd: z.number().int(),
      id_standar_harga: z.number().int(),
      id_sub_bl: z.number().int(),
      id_sub_giat: z.number().int(),
      id_sub_skpd: z.number().int(),
      id_unik: z.string(),
      id_unit: z.number().int(),
      id_bl: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_blt: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_jadwal_murni: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_jenis_usul: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_ket_sub_bl: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_standar_nfs: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_subs_sub_bl: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_usulan: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      is_lokus_akun: z.number().int(),
      jenis_bl: z.string(),
      kode_akun: z.string(),
      kode_standar_harga: z.string(),
      kua_murni: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      kua_pak: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      kode_bidang_urusan: z.string(),
      kode_giat: z.string(),
      kode_program: z.string(),
      kode_skpd: z.string(),
      kode_sub_giat: z.string(),
      kode_sub_skpd: z.string(),
      kode_urusan: z.string(),
      lokus_akun_teks: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      nama_bl: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      nama_blt: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      nama_jenis_usul: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      nama_standar_nfs: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      nama_sub_bl: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      nama_usulan: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      pajak: z.number().optional().nullable(),
      rkpd_murni: z.number().int(),
      rkpd_pak: z.number().int(),
      sat_1: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      sat_2: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      sat_3: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      sat_4: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      set_sisa_kontrak: z.number().int(),
      spek: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      ssh_locked: z.number().int(),
      koefisien: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      tahun: z.number().int(),
      total_harga: z.number().optional().nullable(),
      updated_user: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      vol_1: z
         .number()
         .transform((v) => (v === 0 ? null : v))
         .optional()
         .nullable(),
      vol_2: z
         .number()
         .transform((v) => (v === 0 ? null : v))
         .optional()
         .nullable(),
      vol_3: z
         .number()
         .transform((v) => (v === 0 ? null : v))
         .optional()
         .nullable(),
      vol_4: z
         .number()
         .transform((v) => (v === 0 ? null : v))
         .optional()
         .nullable(),
      volume: z
         .number()
         .transform((v) => (v === 0 ? null : v))
         .optional()
         .nullable(),
      created_user: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      harga_satuan: z.number(),
      koefisien_murni: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      total_harga_murni: z.number().optional().nullable(),
      volume_murni: z.number().optional().nullable(),
      pajak_murni: z.number().optional().nullable(),
      harga_satuan_murni: z.number().optional().nullable(),
      nama_standar_harga: z.string(),
      jadwal_anggaran_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
      jadwal_anggaran_murni_id: z
         .string()
         .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
         .optional()
         .nullable(),
      bl_sub_giat_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
      nama_sub_giat: z.string(),
      nama_giat: z.string(),
      nama_program: z.string(),
      nama_sub_skpd: z.string(),
      nama_unit: z.string(),
      nama_skpd: z.string(),
      nama_bidang_urusan: z.string(),
      nama_urusan: z.string(),
   })
   .strip()

export type RinciBlSubGiatUncheckedCreateInput = z.infer<
   typeof RinciBlSubGiatUncheckedCreateInputSchema
>

/////////////////////////////////////////
// SUBS RINCI BL SUB GIAT SCHEMA
/////////////////////////////////////////

export const SubsRinciBlSubGiatSchema = z.object({
   id: z.string(),
   id_bl: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_daerah: z.number().int(),
   id_giat: z.number().int(),
   id_jenis_barjas: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_metode_barjas: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_program: z.number().int(),
   id_skpd: z.number().int(),
   id_sub_bl: z.number().int(),
   id_sub_giat: z.number().int(),
   id_sub_skpd: z.number().int(),
   id_subs_sub_bl: z.number().int(),
   id_unik: z.string(),
   id_unit: z.number().int(),
   is_paket: z.number().int(),
   nama_jenis_barjas: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_metode_barjas: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   subs_bl_teks: z.string(),
   tahun: z.number().int(),
   id_dana: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   created_by: z.string().nullish(),
   created_at: z.coerce.date(),
   updated_by: z.string().nullish(),
   updated_at: z.coerce.date(),
   bl_sub_giat_id: z.string().nullish(),
})

export type SubsRinciBlSubGiat = z.infer<typeof SubsRinciBlSubGiatSchema>

export const SubsRinciBlSubGiatUncheckedCreateInputSchema = z
   .object({
      id: z.string().optional(),
      id_bl: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_daerah: z.number().int(),
      id_giat: z.number().int(),
      id_jenis_barjas: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_metode_barjas: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_program: z.number().int(),
      id_skpd: z.number().int(),
      id_sub_bl: z.number().int(),
      id_sub_giat: z.number().int(),
      id_sub_skpd: z.number().int(),
      id_subs_sub_bl: z.number().int(),
      id_unik: z.string(),
      id_unit: z.number().int(),
      is_paket: z.number().int(),
      nama_jenis_barjas: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      nama_metode_barjas: z
         .string()
         .optional()
         .nullable()
         .transform((v) => (v === '' ? null : v)),
      subs_bl_teks: z.string(),
      tahun: z.number().int(),
      id_dana: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      bl_sub_giat_id: z.string().optional().nullable(),
   })
   .strip()

/////////////////////////////////////////
// KET RINCI BL SUB GIAT SCHEMA
/////////////////////////////////////////

export const KetRinciBlSubGiatSchema = z.object({
   id: z.string(),
   id_bl: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_daerah: z.number().int(),
   id_giat: z.number().int(),
   id_ket_sub_bl: z.number().int(),
   id_program: z.number().int(),
   id_skpd: z.number().int(),
   id_sub_bl: z.number().int(),
   id_sub_giat: z.number().int(),
   id_sub_skpd: z.number().int(),
   id_unik: z.string(),
   id_unit: z.number().int(),
   ket_bl_teks: z.string(),
   tahun: z.number().int(),
   created_by: z.string().nullish(),
   created_at: z.coerce.date(),
   updated_by: z.string().nullish(),
   updated_at: z.coerce.date(),
   bl_sub_giat_id: z.string().nullish(),
})

export type KetRinciBlSubGiat = z.infer<typeof KetRinciBlSubGiatSchema>

export const KetRinciBlSubGiatUncheckedCreateInputSchema = z
   .object({
      id: z.string().optional(),
      id_bl: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_daerah: z.number().int(),
      id_giat: z.number().int(),
      id_ket_sub_bl: z.number().int(),
      id_program: z.number().int(),
      id_skpd: z.number().int(),
      id_sub_bl: z.number().int(),
      id_sub_giat: z.number().int(),
      id_sub_skpd: z.number().int(),
      id_unik: z.string(),
      id_unit: z.number().int(),
      ket_bl_teks: z.string({ description: 'Keterangan Rincian' }),
      tahun: z.number().int(),
      bl_sub_giat_id: z.string().optional().nullable(),
   })
   .strip()
export type KetRinciBlSubGiatUncheckedCreateInput = z.infer<
   typeof KetRinciBlSubGiatUncheckedCreateInputSchema
>
/////////////////////////////////////////
// TAG BL SUB GIAT SCHEMA
/////////////////////////////////////////

export const TagBlSubGiatSchema = z.object({
   id: z.string(),
   created_user: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_bl: z.number().int(),
   id_daerah: z.number().int(),
   id_giat: z.number().int(),
   id_jadwal: z.number().int(),
   id_label_giat: z.number().int(),
   id_program: z.number().int(),
   id_skpd: z.number().int(),
   id_sub_bl: z.number().int(),
   id_sub_giat: z.number().int(),
   id_sub_skpd: z.number().int(),
   id_tag_bl: z.number().int(),
   id_unit: z.number().int(),
   nama_label_giat: z.string(),
   tahun: z.number().int(),
   updated_user: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   created_by: z.string().nullish(),
   created_at: z.coerce.date(),
   updated_by: z.string().nullish(),
   updated_at: z.coerce.date(),
   bl_sub_giat_id: z.string().nullish(),
   jadwal_anggaran_id: z.string(),
})
export type TagBlSubGiat = z.infer<typeof TagBlSubGiatSchema>

export const TagBlSubGiatUncheckedCreateInputSchema = z
   .object({
      id: z.string().optional(),
      created_user: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      id_bl: z.number().int(),
      id_daerah: z.number().int(),
      id_giat: z.number().int(),
      id_jadwal: z.number().int(),
      id_label_giat: z.number().int(),
      id_program: z.number().int(),
      id_skpd: z.number().int(),
      id_sub_bl: z.number().int(),
      id_sub_giat: z.number().int(),
      id_sub_skpd: z.number().int(),
      id_tag_bl: z.number().int(),
      id_unit: z.number().int(),
      nama_label_giat: z.string(),
      tahun: z.number().int(),
      updated_user: z
         .number()
         .int()
         .optional()
         .nullable()
         .transform((v) => (v === 0 ? null : v)),
      bl_sub_giat_id: z.string().optional().nullable(),
      jadwal_anggaran_id: z.string(),
   })
   .strip()

export type TagBlSubGiatUncheckedCreateInput = z.infer<
   typeof TagBlSubGiatUncheckedCreateInputSchema
>

export const BlSubGiatDeleteByListIdValidationSchema = z
   .object({
      jadwal_anggaran_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
      list_id: z.array(BlSubGiatSchema.shape.id).min(1),
      id_unit: BlSubGiatSchema.shape.id_unit,
      id_skpd: z.number().optional(),
      operation: z.enum(['in', 'notIn']),
   })
   .strip()

export const BlSubGiatAktifDeleteByListIdValidationSchema = z
   .object({
      jadwal_anggaran_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
      list_id: z.array(BlSubGiatAktifSchema.shape.id).min(1),
      id_unit: BlSubGiatAktifSchema.shape.id_unit,
      id_skpd: z.number().optional(),
      operation: z.enum(['in', 'notIn']),
   })
   .strip()

export const DanaBlSubGiatDeleteByListIdValidationSchema = z
   .object({
      jadwal_anggaran_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
      bl_sub_giat_id: z
         .string()
         .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
         .optional(),
      list_id_dana_sub_bl: z.array(DanaBlSubGiatSchema.shape.id_dana_sub_bl).min(1),
      id_unit: DanaBlSubGiatSchema.shape.id_unit,
      id_skpd: z.number().optional(),
      operation: z.enum(['in', 'notIn']),
   })
   .strip()

export const LabelBlSubGiatDeleteByListIdValidationSchema = z
   .object({
      jadwal_anggaran_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
      bl_sub_giat_id: z
         .string()
         .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
         .optional(),
      list_id_label_bl: z.array(LabelBlSubGiatSchema.shape.id_label_bl).min(1),
      id_unit: LabelBlSubGiatSchema.shape.id_unit,
      id_skpd: z.number().optional(),
      operation: z.enum(['in', 'notIn']),
   })
   .strip()

export const LokasiBlSubGiatDeleteByListIdValidationSchema = z
   .object({
      jadwal_anggaran_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
      bl_sub_giat_id: z
         .string()
         .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
         .optional(),
      list_id_detil_lokasi: z.array(LokasiBlSubGiatSchema.shape.id_detil_lokasi).min(1),
      id_unit: LokasiBlSubGiatSchema.shape.id_unit,
      id_skpd: z.number().optional(),
      operation: z.enum(['in', 'notIn']),
   })
   .strip()

export const OutputBlSubGiatDeleteByListIdValidationSchema = z
   .object({
      jadwal_anggaran_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
      bl_sub_giat_id: z
         .string()
         .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
         .optional(),
      list_id_output_bl: z.array(OutputBlSubGiatSchema.shape.id_output_bl).min(1),
      id_unit: OutputBlSubGiatSchema.shape.id_unit,
      id_skpd: z.number().optional(),
      operation: z.enum(['in', 'notIn']),
   })
   .strip()

export const RinciBlSubGiatDeleteByListIdValidationSchema = z
   .object({
      jadwal_anggaran_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
      bl_sub_giat_id: z
         .string()
         .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
         .optional(),
      list_id_unik_rinci_bl: z.array(RinciBlSubGiatSchema.shape.id_unik).min(1),
      id_unit: RinciBlSubGiatSchema.shape.id_unit,
      id_skpd: z.number().optional(),
      operation: z.enum(['in', 'notIn']),
   })
   .strip()

export const SubsRinciBlSubGiatDeleteByListIdValidationSchema = z
   .object({
      bl_sub_giat_id: z
         .string()
         .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
         .optional(),
      list_id_subs_sub_bl: z.array(SubsRinciBlSubGiatSchema.shape.id_subs_sub_bl).min(1),
      id_unit: SubsRinciBlSubGiatSchema.shape.id_unit,
      id_skpd: z.number().optional(),
      operation: z.enum(['in', 'notIn']),
   })
   .strip()

export const KetRinciBlSubGiatDeleteByListIdValidationSchema = z
   .object({
      bl_sub_giat_id: z
         .string()
         .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
         .optional(),
      list_id_ket_sub_bl: z.array(KetRinciBlSubGiatSchema.shape.id_ket_sub_bl).min(1),
      id_unit: KetRinciBlSubGiatSchema.shape.id_unit,
      id_skpd: z.number().optional(),
      operation: z.enum(['in', 'notIn']),
   })
   .strip()

export const TagBlSubGiatDeleteByListIdValidationSchema = z
   .object({
      jadwal_anggaran_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
      bl_sub_giat_id: z
         .string()
         .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
         .optional(),
      list_id_tag_bl: z.array(TagBlSubGiatSchema.shape.id_tag_bl).min(1),
      id_unit: TagBlSubGiatSchema.shape.id_unit,
      id_skpd: z.number().optional(),
      operation: z.enum(['in', 'notIn']),
   })
   .strip()

export const SubGiatPayloadSchema = z
   .object({
      payload: z
         .object({
            id_daerah: z.coerce.number(),
            tahun: z.coerce.number(),
            id_sub_bl: z.coerce.number(),
            is_anggaran: z.coerce.number(),
            id_unit: z.coerce.number(),
         })
         .strip(),
      id_bl: z.coerce.number(),
      id_sub_giat: z.coerce.number().optional(),
      id_unit: z.coerce.number().optional(),
      id_giat: z.coerce.number().optional(),
      id_program: z.coerce.number().optional(),
      id_skpd: z.coerce.number().optional(),
      id_sub_skpd: z.coerce.number().optional(),
      id_jadwal: z.coerce.number(),
      id_jadwal_murni: z.coerce.number().optional().nullable(),
      jadwal_anggaran_id: z.coerce.string(),
      kode_giat: z.coerce.string(),
      kode_sub_giat: z.coerce.string(),
      kode_program: z.coerce.string(),
      bl_giat_id: z.coerce.string(),
      bl_sub_giat_aktif_id: z.coerce.string(),
      jadwal_anggaran_murni_id: z.string().nullish(),
   })
   .strip()
