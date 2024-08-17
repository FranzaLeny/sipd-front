// file bl-giat

interface SyncDetailGiatParams {
   payload: BlGiatSipdPayload
   id_bl: number
   id_jadwal: number
   jadwal_anggaran_id: string
   bl_giat_id: string
}

interface SyncDataGiatParams {
   payload: BlGiatSipdPayload
   bl_giat: Pick<
      BlGiatUncheckedCreateInput,
      Exclude<keyof BlGiatUncheckedCreateInput, keyof BlGiatSipd>
   >
}

// file bl-skpd

type GetBlSkpdParams = {
   id_daerah?: number
   tahun?: number
   id_skpd?: number
   id_unit?: number
   jadwal_anggaran_id?: string
}

type GetListBlSkpdParams = {
   limit?: number
   search?: string
   after?: string
} & GetBlSkpdParams

// file bl-rinci-sub-giat

interface GetListRinciParams {
   id_sub_bl?: number
   bl_sub_giat_id?: string
   jadwal_anggaran_id?: string
   id_daerah?: number
   tahun?: number
   id_skpd?: number
   id_sub_giat?: number
   id_unit?: number
}

interface GetKetRinciParams {
   id_sub_bl: number
   id_daerah?: number
   tahun?: number
   id_skpd?: number
   id_sub_giat?: number
   id_unit?: number
}

type GetListKetRinciParams = {
   limit?: number
   search?: string
   after?: string
} & GetKetRinciParams

interface GetSubsRinciBlSubGiatParams {
   id_sub_bl: number
   id_daerah?: number
   tahun?: number
   id_skpd?: number
   id_sub_giat?: number
   id_unit?: number
}

type GetListSubsRinciBlSubGiatParams = {
   limit?: number
   search?: string
   after?: string
} & GetSubsRinciParams

interface SumberDanaAkunRinciSubGiat {
   bl_sub_giat_id: string
   nama_dana: string
   kode_skpd: string
   kode_sub_skpd: string
   kode_program: string
   kode_giat: string
   kode_sub_giat: string
   kode_akun: string
   id_dana: number
   total_harga: number
   total_harga_murni: number
}

interface GetSumberDanAkunRinciSubGiatParams {
   jadwal_anggaran_id: string
   id_giat?: number
   id_program?: number
   id_skpd?: number
   id_sub_giat?: number
   id_sub_skpd?: number
   id_unit?: number
   id_bidang_urusan?: number
   id_urusan?: number
}

// file bl-sub-giat

type GetBlSubGiatParams = {
   tahun?: number
   id_daerah?: number
   id_skpd?: number
   id_unit: number
   jadwal_anggaran_id: string
}

type GetAllBlSubGiatParams =
   | GetBlSubGiatParams
   | (Partial<GetBlSubGiatParams> & {
        bl_sub_giat_id: string
     })

type GroupBlSubGiatAktifByGiatParams = {
   jadwal: {
      jadwal_anggaran_id: string
      id_jadwal: number
      id_jadwal_murni?: number
      nama_jadwal_murni?: string
      jadwal_anggaran_murni_id?: string
   }
   onlyPaguMurni: boolean
} & ListBlSubGiatAktifSipdPayload

interface RealisasiSubGiat {
   id: string
   id_skpd: number
   id_program: number
   id_giat: number
   kode_skpd: string
   kode_program: string
   kode_giat: string
   kode_sub_giat: string
   nama_skpd: string
   nama_program: string
   nama_giat: string
   sasaran: string
   nama_sub_giat: string
   pagu: number
   output: OutputRealisasiSubGiat[]
   output_giat: OutputgiatRealisasiSubGiat[]
   hasil: OutputRealisasiSubGiat[]
   capaian: OutputRealisasiSubGiat[]
   rak1: number
   rak2: number
   rak3: number
   rak4: number
   realisasi1: number
   realisasi2: number
   realisasi3: number
   realisasi4: number
}

interface OutputgiatRealisasiSubGiat {
   tolok_ukur: string
   satuan: string
   target_teks: string
}

interface OutputRealisasiSubGiat {
   target_teks: string
   satuan: string
   tolak_ukur: string
}

interface SubGiatWithRinciJadwal {
   id: string
   nama_jadwal_murni: string | null
   is_locked: number
   tahun: number
   is_perubahan: number
   nama_sub_tahap: string
   is_active: number
   waktu_selesai: Date
   jadwal_murni: {
      id: string
      nama_sub_tahap: string
   } | null
}

interface SubGiatWithRinciSubkegiatan {
   id: string
   kode_urusan: string
   nama_urusan: string
   kode_bidang_urusan: string
   nama_bidang_urusan: string
   kode_skpd: string
   nama_skpd: string
   kode_sub_skpd: string
   nama_sub_skpd: string
   kode_program: string
   nama_program: string
   kode_giat: string
   nama_giat: string
   kode_sub_giat: string
   nama_sub_giat: string
   waktu_akhir: number
   waktu_awal: number
   pagu_n_lalu: number
   pagu_indikatif: number
   pagu_n_depan: number
   pagu_murni: number
   tahun: number
   id_sub_bl: number
   dana_bl_sub_giat: SubGiatWithRinciDanablsubgiat[]
   lokasi_bl_sub_giat: SubGiatWithRinciLokasiblsubgiat[]
   output_bl_sub_giat: SubGiatWithRinciOutputblsubgiat[]
   tag_bl_sub_giat: any[]
   jadwal_anggaran_id: string
   jadwal_anggaran_murni_id: string
   id_skpd: number
   capaian_bl_giat: SubGiatWithRinciOutputblsubgiat[]
   hasil_bl_giat: SubGiatWithRinciOutputblsubgiat[]
   output_bl_giat: SubGiatWithRinciOutputblgiat[]
   sasaran: string
   pagu: number
   capaian_bl_giat_murni: SubGiatWithRinciOutputblsubgiat[]
   hasil_bl_giat_murni: SubGiatWithRinciOutputblsubgiat[]
   output_bl_giat_murni: SubGiatWithRinciOutputblgiat[]
   sasaran_murni: string
   output_bl_sub_giat_murni: SubGiatWithRinciOutputblsubgiat[]
   tag_bl_sub_giat_murni: any[]
}

interface SubGiatWithRinciOutputblgiat {
   id: string
   tolok_ukur: string
   target_teks: string
}

interface SubGiatWithRinciOutputblsubgiat {
   id: string
   tolak_ukur: string
   target_teks: string
}

interface SubGiatWithRinciLokasiblsubgiat {
   id: string
   kecamatan: {
      id: string
      id_camat: number
      camat_teks: string
   } | null
   lurah: {
      id: string
      id_lurah: number
      lurah_teks: string
   } | null
   kab_kota: {
      id: string
      nama_daerah: string
      id_daerah: number
      id_kab_kota: number
      id_prop: number
   } | null
}

interface SubGiatWithRinciDanablsubgiat {
   id: string
   nama_dana: string
   pagu_dana: number
   id_dana: number
}

interface SubGiatWithRinciRincian {
   id: string
   id_rinci_sub_bl: number
   kode_akun: string
   total_harga: number
   id_subs_sub_bl: number
   id_ket_sub_bl: number
   koefisien: string
   vol_1: number
   vol_2: null
   vol_3: null
   vol_4: null
   sat_1: string
   sat_2: null
   sat_3: null
   sat_4: null
   pajak: number
   harga_satuan: number
   spek: null | string
   id_standar_harga: number
   id_dana: number
   nama_standar_harga: string
   total_harga_murni: number
   koefisien_murni: string
   pajak_murni: null
   harga_satuan_murni: number
   volume_murni: null
   jadwal_anggaran_murni_id: string
   group_kode_1: string
   group_kode_2: string
   group_kode_3: string
   group_kode_4: string
   group_kode_5: string
   group_kode_6: string
   group_kode_7: string
   group_kode_8: string
   nama_dana: string
   nama_akun: string
   group_name_1: string
   group_name_2: string
   group_name_3: string
   group_name_4: string
   group_name_5: string
   group_name_6: string
   group_name_7: string
   group_name_8: string
   sort_order: string
   nama_ket_sub_bl: string
   nama_subs_sub_bl: string
   sat_1_murni: null
   sat_2_murni: null
   sat_3_murni: null
   sat_4_murni: null
   vol_1_murni: null
   vol_2_murni: null
   vol_3_murni: null
   vol_4_murni: null
}

interface SubGiatWithRinciSkpd {
   unit: Unit
   sub_skpd: Unit
   tapd: Tapd[]
}

interface SubGiatWithRinciUnit {
   id_unit: number
   tahun: number
   id_skpd: number
   kode_skpd: string
   kode_unit: string
   nama_skpd: string
   is_skpd: number
   nama_kepala: string
   nama_jabatan_kepala: string | null
   nip_kepala: string
   pangkat_kepala: string
}
interface SubGiatWithRinciTapd {
   id: string
   nip: string
   nama: string
   jabatan: string
}

interface SubGiatWithRinci {
   rincian: SubGiatWithRinciRincian[]
   sub_kegiatan: SubGiatWithRinciSubkegiatan
   jadwal: SubGiatWithRinciJadwal
   skpd: SubGiatWithRinciSkpd
}

// file jadwal-anggaran

type JadwalAnggaran = JadwalAnggaranZod & {
   tahapan: Tahapan
   jadwal_murni: {
      id: string
      id_jadwal: number
      nama_sub_tahap: string
   } | null
}
type JadwalAnggaranWithTahapan = Omit<JadwalAnggaran, 'jadwal_murni'>

type GetJadwalAnggaranParams = {
   id?: string
   id_daerah?: number
   id_jadwal?: number
   is_rinci_bl?: number
   is_lokal?: number
   tahun?: number
}

type CheckJadwalAnggaranAktifParams = JadwalAnggranCekAktifSipdPayload & {
   is_lokal?: number
   is_rinci_bl?: number
}

type GetJadwalAnggaranAktifParams = {
   id_daerah: number
   tahun: number
   id_jadwal?: number
   is_locked?: number
   is_rinci_bl?: number
   jadwal_penatausahaan?: number
   is_perubahan?: number
   is_lokal?: number
}

type GetAllJadwalAnggaranParams = {
   id_daerah: number
   tahun: number
   is_rinci_bl?: number
   is_lokal?: number
   id_jadwal?: number
   id_unit?: number
   id_sub_skpd?: number
   id_bidang_urusan?: number
   id_giat?: number
   id_program?: number
   id_skpd?: number
   id_sub_giat?: number
   id_urusan?: number
   is_perubahan?: number
   jadwal_penatausahaan?: 'true'
   filter?:
      | 'has-pendapatan'
      | 'has-bl-sub-giat'
      | 'has-rincian'
      | 'has-rak'
      | 'penatausahaan'
      | 'has-bl-skpd'
      | 'all'
}

// file laporan
interface SkpdLaporan {
   unit: UnitLaporan
   sub_skpd: UnitLaporan
   tapd: TapdLaporan[]
}

interface UnitLaporan {
   id_unit: number
   tahun: number
   id_skpd: number
   kode_skpd: string
   kode_unit: string
   nama_skpd: string
   is_skpd: number
   id_daerah: number
   is_prop: number
   nama_kepala: string
   singkatan_skpd: string | null
   nama_jabatan_kepala: string | null
   nip_kepala: string
   pangkat_kepala: string
}

interface TapdLaporan {
   id: string
   nip: string
   nama: string
   jabatan: string
}

interface JadwalLaporan {
   id: string
   nama_jadwal_murni: string | null
   is_locked: number
   tahun: number
   is_perubahan: number
   nama_sub_tahap: string
   is_active: number
   waktu_selesai: Date
   jadwal_murni: {
      id: string
      nama_sub_tahap: string
   } | null
}

interface SubGiatLaporanSbl {
   id: string
   kode_urusan: string
   nama_urusan: string
   kode_bidang_urusan: string
   nama_bidang_urusan: string
   kode_skpd: string
   nama_skpd: string
   kode_sub_skpd: string
   nama_sub_skpd: string
   kode_program: string
   nama_program: string
   kode_giat: string
   nama_giat: string
   kode_sub_giat: string
   nama_sub_giat: string
   waktu_akhir: number
   waktu_awal: number
   pagu_n_lalu: number
   pagu_indikatif: number
   pagu_n_depan: number
   pagu_murni: number
   tahun: number
   id_sub_bl: number
   dana_bl_sub_giat: DanaSblLaporanSbl[]
   lokasi_bl_sub_giat: LokasiSblLaporanSbl[]
   output_bl_sub_giat: OutputSblLaporanSbl[]
   tag_bl_sub_giat: any[]
   jadwal_anggaran_id: string
   jadwal_anggaran_murni_id: null
   id_skpd: number
   capaian_bl_giat: OutputSblLaporanSbl[]
   hasil_bl_giat: OutputSblLaporanSbl[]
   output_bl_giat: OutputSblLaporanSbl[]
   sasaran: string
   pagu: number
   capaian_bl_giat_murni: OutputSblLaporanSbl[]
   hasil_bl_giat_murni: OutputSblLaporanSbl[]
   output_bl_giat_murni: OutputSblLaporanSbl[]
   sasaran_murni: string
   output_bl_sub_giat_murni: OutputSblLaporanSbl[]
   tag_bl_sub_giat_murni: any[]
}

interface OutputSblLaporanSbl {
   id: string
   tolok_ukur: string
   target_teks: string
}

interface OutputSblLaporanSbl {
   id: string
   tolak_ukur: string
   target_teks: string
}

interface LokasiSblLaporanSbl {
   id: string
   kecamatan: {
      id: string
      id_camat: number
      camat_teks: string
   } | null
   lurah: {
      id: string
      id_lurah: number
      lurah_teks: string
   } | null
   kab_kota: {
      id: string
      id_daerah: number
      id_kab_kota: number
      id_prop: number
      nama_daerah: string
   } | null
}

interface DanaSblLaporanSbl {
   id: string
   nama_dana: string
   pagu_dana: number
   id_dana: number
}

interface ItemRincianLaporanSbl {
   no_urut: number
   uraian: string
   group: number
   total_murni: number
   total: number
   total_harga_murni: number
   total_harga: number
   rekening?: string[]
   kode?: string
   nama_dana?: string
   spek?: string
   koefisien?: string
   koefisien_murni?: string
   pajak?: number
   pajak_murni?: number
   harga_satuan?: number
   harga_satuan_murni?: number
   satuan?: string[]
   volume?: number[]
   selisih?: number
   volume_murni?: number[]
   satuan_murni?: string[]
   nilai_rak: number
   nilai_realisasi: number
   is_deleted: boolean
}

interface ItemLaporanRkaSKpd {
   total_harga: number
   total_harga_murni: number
   kode_akun: string
   nama_akun: string
}

interface ItemLaporanBlSkpd {
   kode: string[]
   uraian: string
   nama_dana: string
   lokasi: string
   pagu_n_lalu: number
   belanja: BlItemLaporanBlSkpd
   belanja_murni: BlMurniItemLaporanBlSkpd
   sellisih: number
   pagu_n_depan: number
   nomor_urut: number
   group: string
   noname: number
   noname_murni: number
   dana: string
   pagu: number
   pagu_murni: number
   level: number
   id_sub_bl: number
}

interface BlMurniItemLaporanBlSkpd {
   bo_murni: number
   btt_murni: number
   bt_murni: number
   bm_murni: number
   total_harga_murni: number
}

interface BlItemLaporanBlSkpd {
   bo: number
   btt: number
   bt: number
   bm: number
   total_harga: number
}

interface ItemLaporanPendapatan {
   kode: string
   uraian: string
   pendapatan: PendapatanItemLaporanPendapatan
   pendapatan_murni: PendapatanMurniLaporanItemPendapatan
   selisih: number
   nomor_urut: number
   is_rinci: boolean
   is_akun: boolean
   id_skpd: number
   is_skpd: boolean
   is_jumlah: boolean
   is_ket: boolean
   is_kel: boolean
}

interface PendapatanMurniLaporanItemPendapatan {
   satuan_murni: string
   harga: number
   total_harga_murni: number
   koefisien_murni?: string
}

interface PendapatanItemLaporanPendapatan {
   satuan: string
   harga: number
   total_harga: number
   koefisien?: string
}

interface GetLaporanSkpdParams {
   jadwal_anggaran_id: string
   id_skpd?: string | number
   id_unit: string | number
   tahun: string | number
}

// Rekapan Belanja masing- masing sub kegiatan
interface LaporanBlSubGiat {
   rincian: ItemRincianLaporanSbl[]
   sub_kegiatan: SubGiatLaporanSbl
   jadwal: JadwalLaporan
   skpd: SkpdLaporan
}

// Rekapan Belanja dan Pendapatan SKPD
interface LaporanBlSkpd {
   list_bl: ItemLaporanBlSkpd[]
   jadwal: JadwalLaporan
   skpd: SkpdLaporan
}

// Rekapan Belanja program kegiatan subkegiatan
interface LaporanSkpd {
   list_rekapan: ItemLaporanRkaSKpd[]
   jadwal: JadwalLaporan
   skpd: SkpdLaporan
}

// Rekapan Belanja dan Pendapatan SKPD
interface LaporanPendapatan {
   list_pendapatan: ItemLaporanPendapatan[]
   jadwal: JadwalLaporan
   skpd: SkpdLaporan
}

// Rrkapan Sumber Dana
i
interface SumberDanaLaporanRekapanSumberDana {
   group: string
   level: number
   uraian: string
   kode: string
   no_urut: number
   total_harga_murni: number
   total_harga: number
   pagu: number
   pagu_murni: number
   nilai_rak: number
   nilai_realisasi: number
   belanja: {
      total_harga: number
      total_harga_murni: number
      nilai_rak: number
      nilai_realisasi: number
      id_dana: number
      nama_dana: string
      pagu: number
   }[]
}

interface LaporanRekapanSumberDana {
   sumber_dana: SumberDanaLaporanRekapanSumberDana[]
   skpd: SkpdLaporan
   jadwal: {
      tahun: number
      is_perubahan: number
      nama_sub_tahap: string
   }
}

// file pendapatan

type GetPendapatanParams = {
   jadwal_anggaran_id: string
   tahun?: number
   id_skpd?: number
   id_unit?: number
}

type GetListPendapatanParams = {
   limit?: number
   search?: string
   after?: string
} & GetPendapatanParams
