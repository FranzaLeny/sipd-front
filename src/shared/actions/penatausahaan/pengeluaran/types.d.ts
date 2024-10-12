interface RakBlByJadwal {
   id: string
   bulan_1: number
   bulan_2: number
   bulan_3: number
   bulan_4: number
   bulan_5: number
   bulan_6: number
   bulan_7: number
   bulan_8: number
   bulan_9: number
   bulan_10: number
   bulan_11: number
   bulan_12: number
   realisasi_1: number
   realisasi_2: number
   realisasi_3: number
   realisasi_4: number
   realisasi_5: number
   realisasi_6: number
   realisasi_7: number
   realisasi_8: number
   realisasi_9: number
   realisasi_10: number
   realisasi_11: number
   realisasi_12: number
   nilai: number
   nilai_rak: number
   kode_sub_skpd: string
   kode_program: string
   kode_giat: string
   kode_sub_giat: string
   kode_akun: string
   nama_sub_giat: string
   nama_akun: string
}

interface GetRakByJadwalParams {
   jadwal_anggaran_id: string
   id_bidang_urusan?: number
   id_giat?: number
   id_program?: number
   id_skpd?: number
   id_sub_giat?: number
   id_sub_skpd?: number
   id_unit?: number
   id_urusan?: number
}
