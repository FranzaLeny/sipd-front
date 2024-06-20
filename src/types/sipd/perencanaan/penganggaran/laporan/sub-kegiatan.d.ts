type ListSubGiatRkaSipdPayolad = {
   tahun: number
   id_daerah: number
   is_prop: number
   id_sub_bl: number
   id_sub_giat: number
   is_anggaran?: number
   id_jadwal?: number
}
interface ListSubGiatRkaResponse {
   status: boolean
   status_code: number
   data: SubGiatRkaSipd[]
}

interface SubGiatRkaSipd {
   kode_urusan: string
   nama_urusan: string
   kode_bidang_urusan: string
   nama_bidang_urusan: string
   kode_skpd: string
   nama_skpd: string
   kode_sub_skpd?: string | null
   nama_sub_skpd?: string | null
   kode_program: string
   nama_program: string
   kode_giat: string
   nama_giat: string
   kode_sub_giat: string
   spm_teks?: string | null
   layanan_teks?: string | null
   nama_sub_giat: string
   nama_dana?: string | null
   nama_kab_kota: string
   nama_kecamatan: string
   nama_kelurahan: string
   waktu_mulai: string
   waktu_akhir: string
   sasaran: string
   pagu: number
   pagu_n_lalu: number
   pagu_n_depan: number
   pagu_indikatif: number
   tolak_ukur_capaian: string
   target_kinerja_capaian: string
   tolak_ukur_keluaran: string
   target_kinerja_keluaran: string
   tolak_ukur_hasil: string
   target_kinerja_hasil: string
   grand_total?: number | null
   lokasi_bl: string
}

interface ListDataLampiranRKAPergeseranPayload {
   tahun: number
   id_daerah: number
   is_prop: number
   id_sub_bl: number
   id_sub_giat: number
}
interface ListDataLampiranRKAPergeseranResponse {
   status: boolean
   status_code: number
   data: ListDataLampiranRKAPergeseran[]
}

interface ListDataLampiranRKAPergeseran {
   urut: number
   colom_1: string
   colom_2: string
   colom_3: string
   colom_4: string
   colom_5: string
   colom_6: string
   colom_7: string
   colom_8: string
   colom_9: string
   colom_10: string
   colom_11: string
   colom_12: string
}
