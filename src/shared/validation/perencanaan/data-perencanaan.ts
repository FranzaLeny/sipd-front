import { z } from '../zod'

export const AkunSchema = z.object({
   id: z.string(),
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
   is_bagi_hasil: z
      .number()
      .int()
      .transform((v) => (!!v ? v : 0)),
   is_bankeu_khusus: z
      .number()
      .int()
      .transform((v) => (!!v ? v : 0)),
   is_bankeu_umum: z
      .number()
      .int()
      .transform((v) => (!!v ? v : 0)),
   is_barjas: z
      .number()
      .int()
      .transform((v) => (!!v ? v : 0)),
   is_bl: z
      .number()
      .int()
      .transform((v) => (!!v ? v : 0)),
   is_bos: z
      .number()
      .int()
      .transform((v) => (!!v ? v : 0)),
   is_btt: z
      .number()
      .int()
      .transform((v) => (!!v ? v : 0)),
   is_bunga: z
      .number()
      .int()
      .transform((v) => (!!v ? v : 0)),
   is_gaji_asn: z
      .number()
      .int()
      .transform((v) => (!!v ? v : 0)),
   is_hibah_brg: z
      .number()
      .int()
      .transform((v) => (!!v ? v : 0)),
   is_hibah_uang: z
      .number()
      .int()
      .transform((v) => (!!v ? v : 0)),
   is_locked: z
      .number()
      .int()
      .transform((v) => (!!v ? v : 0)),
   is_modal_tanah: z
      .number()
      .int()
      .transform((v) => (!!v ? v : 0)),
   is_pembiayaan: z
      .number()
      .int()
      .transform((v) => (!!v ? v : 0)),
   is_pendapatan: z
      .number()
      .int()
      .transform((v) => (!!v ? v : 0)),
   is_sosial_brg: z
      .number()
      .int()
      .transform((v) => (!!v ? v : 0)),
   is_sosial_uang: z
      .number()
      .int()
      .transform((v) => (!!v ? v : 0)),
   is_subsidi: z
      .number()
      .int()
      .transform((v) => (!!v ? v : 0)),
   is_tkdn: z
      .number()
      .int()
      .transform((v) => (!!v ? v : 0)),
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
   nama_akun: z.string(),
   set_input: z
      .number()
      .int()
      .transform((v) => (!!v ? v : 0)),
   set_kab_kota: z
      .number()
      .int()
      .transform((v) => (!!v ? v : 0)),
   set_lokus: z
      .string()
      .transform((v) => (v === '' ? null : v))
      .nullish(),
   set_prov: z
      .number()
      .int()
      .transform((v) => (!!v ? v : 0)),
   tahun: z.number().int(),
   created_by: z.string().nullish(),
   created_at: z.coerce.date(),
   updated_at: z.coerce.date(),
   updated_by: z.string().nullish(),
})
export type Akun = z.infer<typeof AkunSchema>

export const AkunUncheckedCreateInputSchema = z
   .object({
      id: z.string().optional(),
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
         .nullish()
         .transform((v) => (!!v ? v : 0)),
      is_bankeu_khusus: z
         .number()
         .int()
         .nullish()
         .transform((v) => (!!v ? v : 0)),
      is_bankeu_umum: z
         .number()
         .int()
         .nullish()
         .transform((v) => (!!v ? v : 0)),
      is_barjas: z
         .number()
         .int()
         .nullish()
         .transform((v) => (!!v ? v : 0)),
      is_bl: z
         .number()
         .int()
         .nullish()
         .transform((v) => (!!v ? v : 0)),
      is_bos: z
         .number()
         .int()
         .nullish()
         .transform((v) => (!!v ? v : 0)),
      is_btt: z
         .number()
         .int()
         .nullish()
         .transform((v) => (!!v ? v : 0)),
      is_bunga: z
         .number()
         .int()
         .nullish()
         .transform((v) => (!!v ? v : 0)),
      is_gaji_asn: z
         .number()
         .int()
         .nullish()
         .transform((v) => (!!v ? v : 0)),
      is_hibah_brg: z
         .number()
         .int()
         .nullish()
         .transform((v) => (!!v ? v : 0)),
      is_hibah_uang: z
         .number()
         .int()
         .nullish()
         .transform((v) => (!!v ? v : 0)),
      is_locked: z
         .number()
         .int()
         .nullish()
         .transform((v) => (!!v ? v : 0)),
      is_modal_tanah: z
         .number()
         .int()
         .nullish()
         .transform((v) => (!!v ? v : 0)),
      is_pembiayaan: z
         .number()
         .int()
         .nullish()
         .transform((v) => (!!v ? v : 0)),
      is_pendapatan: z
         .number()
         .int()
         .nullish()
         .transform((v) => (!!v ? v : 0)),
      is_sosial_brg: z
         .number()
         .int()
         .nullish()
         .transform((v) => (!!v ? v : 0)),
      is_sosial_uang: z
         .number()
         .int()
         .nullish()
         .transform((v) => (!!v ? v : 0)),
      is_subsidi: z
         .number()
         .int()
         .nullish()
         .transform((v) => (!!v ? v : 0)),
      is_tkdn: z
         .number()
         .int()
         .nullish()
         .transform((v) => (!!v ? v : 0)),
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
         .nullable()
         .transform((v) => (!!v ? v : 0)),
      mulai_tahun: z.number().int().optional().nullable(),
      nama_akun: z.string(),
      set_input: z
         .number()
         .int()
         .nullish()
         .transform((v) => (!!v ? v : 0)),
      set_kab_kota: z
         .number()
         .int()
         .nullish()
         .transform((v) => (!!v ? v : 0)),
      set_lokus: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      set_prov: z
         .number()
         .int()
         .nullish()
         .transform((v) => (!!v ? v : 0)),
      tahun: z.number().int(),
   })
   .strip()
export type AkunUncheckedCreateInput = z.infer<typeof AkunUncheckedCreateInputSchema>
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
   nama_bendahara: z.string().nullish(),
   nama_kepala: z.string(),
   nama_skpd: z.string(),
   nip_bendahara: z.string().nullish(),
   nip_kepala: z.string(),
   pangkat_kepala: z.string(),
   set_input: z.number().int(),
   status_kepala: z.string(),
   tahun: z.number().int(),
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
export type Skpd = z.infer<typeof SkpdSchema>

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
      nip_bendahara: z
         .string()
         .transform((v) => (v === '' ? null : v))
         .optional()
         .nullable(),
      nip_kepala: z.string(),
      pangkat_kepala: z.string(),
      set_input: z.number().int(),
      status_kepala: z.string(),
      tahun: z.number().int(),
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

export type SkpdUncheckedCreateInput = Zod.infer<typeof SkpdUncheckedCreateInputSchema>

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
   is_sipd: z.boolean(),
   id_akun: z.number().int().array(),
   created_by: z.string().nullish(),
   created_at: z.coerce.date(),
   updated_by: z.string().nullish(),
   updated_at: z.coerce.date(),
})
export type StandarHarga = z.infer<typeof StandarHargaSchema>

export const StandarHargaQuerySchema = z.object({
   id_akun: z
      .union([z.coerce.number(), z.literal('{"isEmpty":true}'), z.literal('{"isEmpty":false}')])
      .optional(),
   is_pdn: z.coerce.number().optional(),
   tahun: z.coerce.number().optional(),
   id_daerah: z.coerce.number().optional(),
   kelompok: z.coerce.number().optional(),
   is_sipd: z
      .string()
      .transform((v) => !!v && (v === 'true' || v === '1'))
      .optional(),
   id_kel_standar_harga: z.coerce.number().optional(),
})

export type StandarHargaQuery = z.infer<typeof StandarHargaQuerySchema>

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
      is_sipd: z.boolean().optional().nullable(),
      id_akun: z.number().int().array().optional(),
   })
   .strip()

export const TahapanSchema = z.object({
   id: z.string(),
   id_tahap: z.number().int(),
   is_active: z.boolean().nullish(),
   is_locked: z.number().int(),
   nama_tahap: z.string(),
   set_nomor: z.number().int(),
   set_perda: z.number().int(),
   set_perkada: z.number().int(),
   status_aktif: z.boolean(),
   status_tahap: z.string(),
   tipe_tahap: z.string(),
   urut_apbd: z.number().int(),
   created_by: z.string().nullish(),
   created_at: z.coerce.date(),
   updated_by: z.string().nullish(),
   updated_at: z.coerce.date(),
})
export type Tahapan = z.infer<typeof TahapanSchema>

export const TahapanUncheckedCreateInputSchema = z
   .object({
      id: z.string().optional(),
      id_tahap: z.number().int(),
      is_active: z.boolean().optional().nullable(),
      is_locked: z.number().int(),
      nama_tahap: z.string(),
      set_nomor: z.number().int(),
      set_perda: z.number().int(),
      set_perkada: z.number().int(),
      status_aktif: z.boolean(),
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

export type UserSipdPerencanaan = z.infer<typeof UserSipdPerencanaanSchema>
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

export type Satuan = z.infer<typeof SatuanSchema>

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

export type KabKota = z.infer<typeof KabKotaSchema>

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

export type Kecamatan = z.infer<typeof KecamatanSchema>

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

export type DesaKel = z.infer<typeof DesaKelSchema>
