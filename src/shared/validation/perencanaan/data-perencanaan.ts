import { z } from '../zod'

export const AkunSchema = z.object({
   id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
   id_akun: z.number().int(),
   id_daerah: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_jns_dana: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_unik: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   is_bagi_hasil: z.number().int(),
   is_bankeu_khusus: z.number().int(),
   is_bankeu_umum: z.number().int(),
   is_barjas: z.number().int(),
   is_bl: z.number().int(),
   is_bos: z.number().int(),
   is_btt: z.number().int(),
   is_bunga: z.number().int(),
   is_gaji_asn: z.number().int(),
   is_hibah_brg: z.number().int(),
   is_hibah_uang: z.number().int(),
   is_locked: z.number().int(),
   is_modal_tanah: z.number().int(),
   is_pembiayaan: z.number().int(),
   is_pendapatan: z.number().int(),
   is_sosial_brg: z.number().int(),
   is_sosial_uang: z.number().int(),
   is_subsidi: z.number().int(),
   is_tkdn: z.number().int(),
   ket_akun: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   kode_akun: z.string(),
   kode_akun_lama: z
      .string()
      .transform((v) => (v === '' || v === '0' ? null : v))
      .nullish(),
   kode_akun_revisi: z
      .string()
      .transform((v) => (v === '' || v === '0' ? null : v))
      .nullish(),
   kunci_tahun: z.number().int().nullish(),
   level: z.number().int(),
   mulai_tahun: z.number().int().nullish(),
   nama_akun: z.string().trim().min(1),
   set_input: z.number().int(),
   set_kab_kota: z.number().int(),
   set_lokus: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   set_prov: z.number().int(),
   tahun: z.number().int().array(),
   created_by: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
      .nullish(),
   created_at: z.coerce.date(),
   updated_at: z.coerce.date(),
   updated_by: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
      .nullish(),
})

export const AkunUncheckedCreateInputSchema = z
   .object({
      id_akun: z.number().int(),
      id_daerah: z
         .number()
         .int()
         .transform((v) => (v === 0 ? null : v))
         .optional()
         .nullable(),
      id_jns_dana: z
         .number()
         .int()
         .transform((v) => (v === 0 ? null : v))
         .optional()
         .nullable(),
      id_unik: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      is_bagi_hasil: z
         .number()
         .int()
         .optional()
         .nullable()
         .default(0)
         .transform((v) => (v === null ? 0 : v)),
      is_bankeu_khusus: z
         .number()
         .int()
         .optional()
         .nullable()
         .default(0)
         .transform((v) => (v === null ? 0 : v)),
      is_bankeu_umum: z
         .number()
         .int()
         .optional()
         .nullable()
         .default(0)
         .transform((v) => (v === null ? 0 : v)),
      is_barjas: z
         .number()
         .int()
         .optional()
         .nullable()
         .default(0)
         .transform((v) => (v === null ? 0 : v)),
      is_bl: z
         .number()
         .int()
         .optional()
         .nullable()
         .default(0)
         .transform((v) => (v === null ? 0 : v)),
      is_bos: z
         .number()
         .int()
         .optional()
         .nullable()
         .default(0)
         .transform((v) => (v === null ? 0 : v)),
      is_btt: z
         .number()
         .int()
         .optional()
         .nullable()
         .default(0)
         .transform((v) => (v === null ? 0 : v)),
      is_bunga: z
         .number()
         .int()
         .optional()
         .nullable()
         .default(0)
         .transform((v) => (v === null ? 0 : v)),
      is_gaji_asn: z
         .number()
         .int()
         .optional()
         .nullable()
         .default(0)
         .transform((v) => (v === null ? 0 : v)),
      is_hibah_brg: z
         .number()
         .int()
         .optional()
         .nullable()
         .default(0)
         .transform((v) => (v === null ? 0 : v)),
      is_hibah_uang: z
         .number()
         .int()
         .optional()
         .nullable()
         .default(0)
         .transform((v) => (v === null ? 0 : v)),
      is_locked: z
         .number()
         .int()
         .optional()
         .nullable()
         .default(0)
         .transform((v) => (v === null ? 0 : v)),
      is_modal_tanah: z
         .number()
         .int()
         .optional()
         .nullable()
         .default(0)
         .transform((v) => (v === null ? 0 : v)),
      is_pembiayaan: z
         .number()
         .int()
         .optional()
         .nullable()
         .default(0)
         .transform((v) => (v === null ? 0 : v)),
      is_pendapatan: z
         .number()
         .int()
         .optional()
         .nullable()
         .default(0)
         .transform((v) => (v === null ? 0 : v)),
      is_sosial_brg: z
         .number()
         .int()
         .optional()
         .nullable()
         .default(0)
         .transform((v) => (v === null ? 0 : v)),
      is_sosial_uang: z
         .number()
         .int()
         .optional()
         .nullable()
         .default(0)
         .transform((v) => (v === null ? 0 : v)),
      is_subsidi: z
         .number()
         .int()
         .optional()
         .nullable()
         .default(0)
         .transform((v) => (v === null ? 0 : v)),
      is_tkdn: z
         .number()
         .int()
         .optional()
         .nullable()
         .default(0)
         .transform((v) => (v === null ? 0 : v)),
      ket_akun: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      kode_akun: z.string(),
      kode_akun_lama: z
         .string()
         .transform((v) => (v === '' || v === '0' ? null : v))
         .optional()
         .nullable(),
      kode_akun_revisi: z
         .string()
         .transform((v) => (v === '' || v === '0' ? null : v))
         .optional()
         .nullable(),
      kunci_tahun: z.number().int().optional().nullable(),
      level: z
         .number()
         .int()
         .optional()
         .nullable()
         .default(0)
         .transform((v) => (v === null ? 0 : v)),
      mulai_tahun: z.number().int().optional().nullable(),
      nama_akun: z.string().trim().min(1),
      set_input: z.number().int(),
      set_kab_kota: z
         .number()
         .int()
         .optional()
         .nullable()
         .default(0)
         .transform((v) => (v === null ? 0 : v)),
      set_lokus: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      set_prov: z
         .number()
         .int()
         .optional()
         .nullable()
         .default(0)
         .transform((v) => (v === null ? 0 : v)),
      tahun: z.number().int().array().optional(),
      sync_at: z.number(),
   })
   .strip()

export const AkunDeleteOldParamsSchema = z.object({
   sync_at: z.number().int().min(1),
   tahun: z.number().int().min(2024),
   id_daerah: z.number().int(),
   total_data: z.number().int(),
})

export const SkpdSchema = z.object({
   id: z.string(),
   id_unik: z.string(),
   id_daerah: z.number().int(),
   id_kecamatan: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_skpd: z.number().int(),
   id_strategi: z.number().int(),
   id_unit: z.number().int(),
   is_prop: z.number().int(),
   is_dpa_khusus: z.number().int(),
   is_locked: z.number().int(),
   is_pendapatan: z.number().int(),
   is_ppkd: z.number().int(),
   is_skpd: z.number().int(),
   kode_skpd: z.string(),
   kode_skpd_lama: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   kode_unit: z.string(),
   komisi: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   nama_jabatan_kepala: z.string().nullish(),
   singkatan_skpd: z.string().nullish(),
   nama_bendahara: z.string().nullish(),
   nama_kepala: z.string(),
   nama_skpd: z.string(),
   nip_bendahara: z.string().nullish(),
   nip_kepala: z.string(),
   pangkat_kepala: z.string(),
   set_input: z.number().int(),
   status_kepala: z.string(),
   tahun: z.number().int().array(),
   kode_opd: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   id_bidang_urusan_1: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_bidang_urusan_2: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_bidang_urusan_3: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   created_ip: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   created_user: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   updated_ip: z
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
})

export const SkpdUncheckedCreateInputSchema = z
   .object({
      id: z.string().optional(),
      id_unik: z.string(),
      id_daerah: z.number().int(),
      id_kecamatan: z
         .number()
         .int()
         .transform((v) => (v === 0 ? null : v))
         .optional()
         .nullable(),
      id_skpd: z.number().int(),
      id_strategi: z.number().int(),
      id_unit: z.number().int(),
      is_prop: z.number().int(),
      is_dpa_khusus: z.number().int(),
      is_locked: z.number().int(),
      is_pendapatan: z.number().int(),
      is_ppkd: z.number().int(),
      is_skpd: z.number().int(),
      kode_skpd: z.string(),
      kode_skpd_lama: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      kode_unit: z.string(),
      komisi: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      nama_bendahara: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      jabatan_kepala: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      nama_kepala: z.string(),
      nama_skpd: z.string(),
      nama_jabatan_kepala: z.string().optional().nullable(),
      singkatan_skpd: z.string().optional().nullable(),
      nip_bendahara: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      nip_kepala: z.string(),
      pangkat_kepala: z.string(),
      set_input: z.number().int(),
      status_kepala: z.string(),
      tahun: z.number().int().array().min(1),
      kode_opd: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      id_bidang_urusan_1: z
         .number()
         .int()
         .transform((v) => (v === 0 ? null : v))
         .optional()
         .nullable(),
      id_bidang_urusan_2: z
         .number()
         .int()
         .transform((v) => (v === 0 ? null : v))
         .optional()
         .nullable(),
      id_bidang_urusan_3: z
         .number()
         .int()
         .transform((v) => (v === 0 ? null : v))
         .optional()
         .nullable(),
      created_ip: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      created_user: z
         .number()
         .int()
         .transform((v) => (v === 0 ? null : v))
         .optional()
         .nullable(),
      updated_ip: z
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
   })
   .strip()

export const StandarHargaSchema = z.object({
   id: z.string(),
   harga: z.number(),
   id_daerah: z.number().int(),
   id_kel_standar_harga: z.number().int(),
   id_standar_harga: z.number().int(),
   id_unik: z.string(),
   is_locked: z.number().int(),
   is_pdn: z.number().int().nullish(),
   kelompok: z.number().int(),
   kode_kel_standar_harga: z.string(),
   kode_standar_harga: z.string(),
   nama_kel_standar_harga: z.string(),
   nama_standar_harga: z.string(),
   nilai_tkdn: z.number().nullish(),
   satuan: z.string(),
   spek: z.string().nullish(),
   tahun: z.number().int(),
   tipe_standar_harga: z.string(),
   is_sipd: z.coerce.number().int(),
   id_akun: z.number().int().array(),
   created_by: z.string().nullish(),
   created_at: z.coerce.date(),
   updated_by: z.string().nullish(),
   updated_at: z.coerce.date(),
   sync_at: z.coerce.number().int(),
})

export const StandarHargaQuerySchema = z.object({
   id_akun: z
      .union([z.coerce.number(), z.literal('{"isEmpty":true}'), z.literal('{"isEmpty":false}')])
      .optional(),
   is_pdn: z.coerce.number().optional(),
   tahun: z.coerce.number().optional(),
   id_daerah: z.coerce.number().optional(),
   kelompok: z.coerce.number().optional(),
   is_sipd: z.coerce.number().optional(),
   id_kel_standar_harga: z.coerce.number().optional(),
})

export const StandarHargaUncheckedCreateInputSchema = z
   .object({
      id: z.string().optional(),
      harga: z.number(),
      id_daerah: z.number().int(),
      id_kel_standar_harga: z.number().int(),
      id_standar_harga: z.number().int(),
      id_unik: z.string(),
      is_locked: z.number().int(),
      is_pdn: z.number().int().optional().nullable(),
      kelompok: z.number().int(),
      kode_kel_standar_harga: z.string(),
      kode_standar_harga: z.string(),
      nama_kel_standar_harga: z.string(),
      nama_standar_harga: z.string(),
      nilai_tkdn: z.number().optional().nullable(),
      satuan: z.string(),
      spek: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      tahun: z.number().int(),
      tipe_standar_harga: z.string(),
      is_sipd: z.coerce.number().nullable().optional(),
      id_akun: z.number().int().array().optional(),
      sync_at: z.coerce.number().int(),
   })
   .strip()

export const StandarHargaDeleteOldParamsSchema = z.object({
   sync_at: z.number().int().min(1),
   tahun: z.number().int().min(2024),
   id_daerah: z.number().int(),
   kelompok: z.number().max(5).min(1),
   total_data: z.number().int(),
})

export const TahapanSchema = z.object({
   id: z.string(),
   id_tahap: z.number().int(),
   is_active: z.coerce.number().int().max(1).optional().default(0),
   is_locked: z.number().int(),
   nama_tahap: z.string(),
   set_nomor: z.number().int(),
   set_perda: z.number().int(),
   set_perkada: z.number().int(),
   status_aktif: z.coerce.number().int().max(1).optional().default(1),
   status_tahap: z.string(),
   tipe_tahap: z.string(),
   urut_apbd: z.number().int(),
   created_by: z.string().nullish(),
   created_at: z.coerce.date(),
   updated_by: z.string().nullish(),
   updated_at: z.coerce.date(),
})

export const TahapanUncheckedCreateInputSchema = z
   .object({
      id: z.string().optional(),
      id_tahap: z.number().int(),
      is_active: z.coerce.number().int().max(1).optional().default(1),
      is_locked: z.number().int(),
      nama_tahap: z.string(),
      set_nomor: z.number().int(),
      set_perda: z.number().int(),
      set_perkada: z.number().int(),
      status_aktif: z.coerce.number().int().max(1).optional().default(0),
      status_tahap: z.string(),
      tipe_tahap: z.string(),
      urut_apbd: z.number().int(),
   })
   .strip()

export const UserSipdPerencanaanSchema = z.object({
   id: z.string(),
   id_user: z.number().int(),
   username: z.string(),
   accAsmas: z.number().int(),
   accBankeu: z.number().int(),
   accDisposisi: z.number().int(),
   accGiat: z.number().int(),
   accHibban: z.number().int(),
   accInput: z.number().int(),
   accJadwal: z.number().int(),
   accKunci: z.number().int(),
   accMaster: z.number().int(),
   accMonitor: z.number().int(),
   accSpv: z.number().int(),
   accUnit: z.number().int(),
   accUsulan: z.number().int(),
   accasmas: z.number().int().nullish(),
   accbankeu: z.number().int().nullish(),
   accdisposisi: z.number().int().nullish(),
   accgiat: z.number().int().nullish(),
   acchibah: z.number().int().nullish(),
   accinput: z.number().int().nullish(),
   accjadwal: z.number().int().nullish(),
   acckunci: z.number().int().nullish(),
   accmaster: z.number().int().nullish(),
   accmonitor: z.number().int().nullish(),
   accspv: z.number().int().nullish(),
   accunit: z.number().int().nullish(),
   accusulan: z.number().int().nullish(),
   active: z.number().int(),
   akses_user: z.string(),
   id_daerah: z.number().int(),
   id_level: z.number().int(),
   id_profil: z.number().int(),
   id_unit: z.number().int().nullish(),
   is_locked: z.number().int(),
   jabatan: z.string(),
   jabatan_user: z.string().nullish(),
   kunci_akb: z.number().int().nullish(),
   kunci_anggaran: z.number().int().nullish(),
   login_name: z.string(),
   loginname: z.string().nullish(),
   nama: z.string(),
   nama_daerah: z.string(),
   nama_user: z.string(),
   nip: z.string(),
   picture: z.string().nullish(),
   updated_at: z.coerce.date(),
   created_at: z.coerce.date(),
   user_id: z.string().nullish(),
})

export const IdsAkunStandarHargaSchema = z
   .object({
      id_standar_harga: z.number(),
      id_akun: z.array(z.number()),
   })
   .strip()

/////////////////////////////////////////
// SATUAN SCHEMA
/////////////////////////////////////////

export const SatuanSchema = z.object({
   id: z.string(),
   id_satuan: z.number().int(),
   is_locked: z.number().int(),
   nama_satuan: z.string(),
   created_by: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
      .nullish(),
   created_at: z.coerce.date(),
   updated_at: z.coerce.date(),
   updated_by: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
      .nullish(),
})

export const SatuanUncheckedCreateInputSchema = z
   .object({
      id: z.string().optional(),
      id_satuan: z.number().int(),
      is_locked: z.number().int(),
      nama_satuan: z.string(),
   })
   .strip()

export const KabKotaSchema = z.object({
   id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
   id_daerah: z.number().int(),
   id_kab_kota: z.number().int(),
   id_prop: z.number().int(),
   kode_ddn: z.string(),
   kode_ddn_2: z.string(),
   logo: z.string(),
   nama_daerah: z.string(),
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

export const KecamatanSchema = z.object({
   id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
   camat_teks: z.string(),
   id_camat: z.number().int(),
   id_kab_kota: z.number().int(),
   id_prop: z.number().int(),
   is_locked: z.number().int(),
   kode_camat: z.string(),
   kode_ddn: z.string(),
   kode_ddn_2: z.string(),
   tahun: z.number().int(),
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

export const DesaKelSchema = z.object({
   id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
   id_camat: z.number().int(),
   id_kab_kota: z.number().int(),
   id_lurah: z.number().int(),
   id_prop: z.number().int(),
   is_desa: z.number().int(),
   is_locked: z.number().int(),
   kode_ddn: z.string(),
   kode_ddn_2: z.string(),
   kode_lurah: z.string(),
   lurah_teks: z.string(),
   tahun: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
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

export const SumberDanaSchema = z.object({
   id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
   id_daerah: z.number().int(),
   id_dana: z.number().int(),
   id_jns_dana: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_type_dana: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   id_unik: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   is_locked: z.number().int(),
   kode_dana: z.string(),
   kunci_tahun: z.number().int().nullish(),
   level: z.number().int().nullish(),
   mulai_tahun: z.number().int().nullish(),
   nama_dana: z.string(),
   nama_dana_lama: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   set_input: z.number().int(),
   set_kab_kota: z.number().int(),
   set_prov: z.number().int(),
   status_aktif: z.coerce.number().int().max(1),
   tahun: z.number().int().array(),
   created_ip: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   created_user: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   updated_ip: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   updated_user: z
      .number()
      .int()
      .transform((v) => (v === 0 ? null : v))
      .nullish(),
   created_by: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
      .nullish(),
   created_at: z.coerce.date(),
   updated_at: z.coerce.date(),
   updated_by: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
      .nullish(),
   sync_at: z.coerce.number().int(),
})

export const SumberDanaUncheckedCreateInputSchema = z
   .object({
      id: z
         .string()
         .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
         .optional(),
      id_daerah: z.number().int(),
      id_dana: z.number().int(),
      id_jns_dana: z
         .number()
         .int()
         .transform((v) => (v === 0 ? null : v))
         .optional()
         .nullable(),
      id_type_dana: z
         .number()
         .int()
         .transform((v) => (v === 0 ? null : v))
         .optional()
         .nullable(),
      id_unik: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      is_locked: z.number().int(),
      kode_dana: z.string(),
      kunci_tahun: z.number().int().optional().nullable(),
      level: z.number().int().optional().nullable(),
      mulai_tahun: z.number().int().optional().nullable(),
      nama_dana: z.string(),
      nama_dana_lama: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      set_input: z.number().int(),
      set_kab_kota: z.number().int(),
      set_prov: z.number().int(),
      status_aktif: z.coerce.number().int().max(1).optional(),
      tahun: z
         .union([z.number().int(), z.array(z.number().int())])
         .transform((v) => (Array.isArray(v) ? v : [v])),
      created_ip: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      created_user: z
         .number()
         .int()
         .transform((v) => (v === 0 ? null : v))
         .optional()
         .nullable(),
      updated_ip: z
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
      sync_at: z.coerce.number().int(),
   })
   .strip()

export const SumberDanaDeleteOldParamsSchema = z.object({
   sync_at: z.number().int().min(1),
   tahun: z.number().int().min(2024),
   id_daerah: z.number().int(),
})

declare global {
   type Akun = z.infer<typeof AkunSchema>
   type AkunUncheckedCreateInput = z.infer<typeof AkunUncheckedCreateInputSchema>
   type Skpd = z.infer<typeof SkpdSchema>
   type SkpdUncheckedCreateInput = z.infer<typeof SkpdUncheckedCreateInputSchema>
   type StandarHarga = z.infer<typeof StandarHargaSchema>
   type StandarHargaQuery = z.infer<typeof StandarHargaQuerySchema>
   type StandarHargaUncheckedCreateInput = z.infer<typeof StandarHargaUncheckedCreateInputSchema>
   type Tahapan = z.infer<typeof TahapanSchema>
   type TahapanUncheckedCreateInput = z.infer<typeof TahapanUncheckedCreateInputSchema>
   type UserSipdPerencanaan = z.infer<typeof UserSipdPerencanaanSchema>
   type IdsAkunStandarHarga = z.infer<typeof IdsAkunStandarHargaSchema>
   type Satuan = z.infer<typeof SatuanSchema>
   type SatuanUncheckedCreateInput = z.infer<typeof SatuanUncheckedCreateInputSchema>
   type KabKota = z.infer<typeof KabKotaSchema>
   type Kecamatan = z.infer<typeof KecamatanSchema>
   type DesaKel = z.infer<typeof DesaKelSchema>
   type SumberDana = z.infer<typeof SumberDanaSchema>
   type SumberDanaUncheckedCreateInput = z.infer<typeof SumberDanaUncheckedCreateInputSchema>
   type SumberDanaDeleteOldParams = z.infer<typeof SumberDanaDeleteOldParamsSchema>
   type AkunDeleteOldParams = z.infer<typeof AkunDeleteOldParamsSchema>
   type StandarHargaDeleteOldParams = z.infer<typeof StandarHargaDeleteOldParamsSchema>
}
