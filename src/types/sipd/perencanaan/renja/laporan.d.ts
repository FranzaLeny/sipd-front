interface ListDataLampiranLaporanSipdPayload {
   // POST https://sipd-ri.kemendagri.go.id/api/renja/renja_laporan/listDataLampiranLaporan
   id_daerah: number
   tahun: number
   id_skpd: number
   id_jadwal: number
   id_sub_tahap: number
   tahun_awal: number
   tahun_akhir: number
}

interface ListDataLampiranLaporanSipdResponse {
   status: boolean
   status_code: number
   data: ListDataLampiranLaporanSipd[]
   nama_sub_tahap: string
}

interface ListDataLampiranLaporanSipd {
   migrated_at: null
   id_sub_bl: number
   id_daerah: number
   tahun: number
   id_unit: number
   id_skpd: number
   created_user: number
   kode_skpd: string
   nama_skpd: string
   id_urusan: number
   kode_urusan: string
   nama_urusan: string
   id_bidang_urusan: number
   kode_bidang_urusan: string
   nama_bidang_urusan: string
   id_sub_skpd: number
   kode_sub_skpd: string
   nama_sub_skpd: string
   id_program: number
   kode_program: string
   nama_program: string
   id_giat: number
   kode_giat: string
   nama_giat: string
   id_sub_giat: number
   kode_sub_giat: string
   nama_sub_giat: string
   pagu: number
   pagu_indikatif: number
   pagu_n_depan: number
   kode_bl: string
   kode_sbl: string
   urusan_locked: number
   bidang_urusan_locked: number
   program_locked: number
   giat_locked: number
   sub_giat_locked: number
   kunci_bl: number
   kunci_bl_rinci: number
   id_output_bl: number
   satuan_output: string
   tolak_ukur_output: string
   target_teks_output: string
   satuan_capaian: string
   tolak_ukur_capaian: string
   target_teks_capaian: string
   satuan_sub: string
   tolok_ukur_sub: string
   target_sub_teks: string
   tolak_ukur_n: string
   target_teks_n: string
   kode_dana: null | string
   nama_dana: null | string
   lokasi_bl: string
   id_label_pusat: number
   label_pusat: null
   id_label_prov: number
   label_prov: null | string
   id_label_kokab: number
   label_kokab: null | string
   kelompok_sasaran: null | string
   target_akhir_program_renstra: null
   target_min_1_program_renstra: null
   target_n_program_renstra: null
   target_akhir_giat_renstra: null
   target_min_1_giat_renstra: null
   target_n_giat_renstra: null
   target_akhir_sub_giat_renstra: string
   target_min_1_sub_giat_renstra: string
   target_n_sub_giat_renstra: string
   total_pagu_indikatif_sub_skpd: number
   total_pagu_n_depan_sub_skpd: number
   total_pagu_indikatif_urusan: number
   total_pagu_n_depan_urusan: number
   total_pagu_indikatif_bidang_urusan: number
   total_pagu_n_depan_bidang_urusan: number
   total_pagu_indikatif_program: number
   total_pagu_n_depan_program: number
   total_pagu_indikatif_kegiatan: number
   total_pagu_n_depan_kegiatan: number
   total_pagu_indikatif: number
   total_pagu_n_depan: number
}
