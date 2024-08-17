// file SKPD

interface SkpdPeta {
   id_skpd: number
   kode_skpd: string
   nama_skpd: string
}

// file rak
interface ResponseGetBlSkpdPeta {
   id_skpd: number
   nama_skpd: string
   kode_skpd: string
   items: ItemBlSubGiatSipdPeta[]
}

interface ItemBlSubGiatSipdPeta {
   id_daerah: number
   tahun: number
   id_unit: number
   id_skpd: number
   kode_skpd: string
   nama_skpd: string
   id_sub_skpd: number
   kode_sub_skpd: string
   nama_sub_skpd: string
   id_urusan: number
   id_bidang_urusan: number
   kode_bidang_urusan: string
   nama_bidang_urusan: string
   id_program: number
   kode_program: string
   nama_program: string
   id_giat: number
   kode_giat: string
   nama_giat: string
   id_sub_giat: number
   kode_sub_giat: string
   nama_sub_giat: string
   nilai: number
   nilai_rak: number
   status: number
   rak_belum_sesuai: number
}

interface GetRakBlSubGiatSipdPetaParams {
   id_unit: number
   id_skpd: number
   id_sub_skpd: number
   id_urusan: number
   id_bidang_urusan: number
   id_program: number
   id_giat: number
   id_sub_giat: number
}

interface RakBlSubGiatSipdPeta {
   '1': number
   '2': number
   '3': number
   '4': number
   '5': number
   '6': number
   '7': number
   '8': number
   '9': number
   '10': number
   '11': number
   '12': number
   id_daerah: number
   tahun: number
   id_unit: number
   id_skpd: number
   kode_skpd: string
   nama_skpd: string
   id_sub_skpd: number
   kode_sub_skpd: string
   nama_sub_skpd: string
   id_urusan: number
   id_bidang_urusan: number
   kode_bidang_urusan: string
   nama_bidang_urusan: string
   id_program: number
   kode_program: string
   nama_program: string
   id_giat: number
   kode_giat: string
   nama_giat: string
   id_sub_giat: number
   kode_sub_giat: string
   nama_sub_giat: string
   id_akun: number
   kode_akun: string
   nama_akun: string
   nilai: number
   nilai_rak: number
   id_rak_belanja: number
   is_valid_skpd: number
   is_valid_sekda: number
   is_valid_bud: number
}

interface LaporanRakBlSubGiatSipdPeta {
   nama_daerah: string
   kode_skpd: string
   nama_skpd: string
   tahun: number
   tanggal: string
   nama_ibukota: string
   nama_penandatangan: string
   nip_penandatangan: string
   items: ItemLaporanRakBlSubGiatSipdPeta[]
}
interface ItemLaporanRakBlSubGiatSipdPeta {
   kode_rekening: string
   uraian: string
   anggaran_tahun_ini: number
   total_rak: number
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
}

interface ResponseRakSipdPeta {
   id_daerah: number
   tahun: number
   id_skpd: number
   kode_skpd: string
   nama_skpd: string
   nilai: number
   nilai_rak: number
   status: number
}

interface ResponseRakSubGiatSipdPeta {
   id_skpd: number
   nama_skpd: string
   kode_skpd: string
   items: RakSubGiatSipdPeta[]
}

interface RakSubGiatSipdPeta {
   id_daerah: number
   tahun: number
   id_unit: number
   id_skpd: number
   kode_skpd: string
   nama_skpd: string
   id_sub_skpd: number
   kode_sub_skpd: string
   nama_sub_skpd: string
   id_urusan: number
   id_bidang_urusan: number
   kode_bidang_urusan: string
   nama_bidang_urusan: string
   id_program: number
   kode_program: string
   nama_program: string
   id_giat: number
   kode_giat: string
   nama_giat: string
   id_sub_giat: number
   kode_sub_giat: string
   nama_sub_giat: string
   nilai: number
   nilai_rak: number
   status: number
   rak_belum_sesuai: number
}

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

// file spj

interface SpjFungsionalSipdPeta {
   nama_daerah: string
   nama_skpd: string
   kode_skpd: string
   tahun: number
   logo: string
   nama_pa_kpa: string
   nip_pa_kpa: string
   jabatan_pa_kpa: string
   nama_bp_bpp: string
   nip_bp_bpp: string
   jabatan_bp_bpp: string
   pembukuan1: Pembukuan1SpjFungsionalSipdPeta[]
   pembukuan2: Pembukuan1SpjFungsionalSipdPeta[]
   pembukuan3: Pembukuan3SpjFungsionalSipdPeta[]
   pembukuan4: Pembukuan4SpjFungsionalSipdPeta[]
   pembukuan5: Pembukuan5SpjFungsionalSipdPeta[]
   pembukuan6: Pembukuan3SpjFungsionalSipdPeta[]
   pembukuan7: Pembukuan4SpjFungsionalSipdPeta[]
   pembukuan8: Pembukuan5SpjFungsionalSipdPeta[]
   pembukuan9: Pembukuan3SpjFungsionalSipdPeta[]
   pembukuan10: Pembukuan10SpjFungsionalSipdPeta[]
   pembukuan11: Pembukuan3SpjFungsionalSipdPeta[]
}

interface Pembukuan10SpjFungsionalSipdPeta {
   urut: number
   jenis: string
   pengembalian_realisasi_gaji_bulan_sebelumnya: number
   pengembalian_realisasi_gaji_bulan_ini: number
   pengembalian_realisasi_gaji_sd_saat_ini: number
   pengembalian_realisasi_selain_gaji_bulan_sebelumnya: number
   pengembalian_realisasi_selain_gaji_bulan_ini: number
   pengembalian_realisasi_selain_gaji_sd_saat_ini: number
   pengembalian_realisasi_upgutu_bulan_sebelumnya: number
   pengembalian_realisasi_upgutu_bulan_ini: number
   pengembalian_realisasi_upgutu_sd_saat_ini: number
}

interface Pembukuan5SpjFungsionalSipdPeta {
   id_pajak_potongan: number
   nama_pajak_potongan: string
   realisasi_pajak_gaji_bulan_sebelumnya: number
   realisasi_pajak_gaji_bulan_ini: number
   realisasi_pajak_gaji_sd_saat_ini: number
   realisasi_pajak_selain_gaji_bulan_sebelumnya: number
   realisasi_pajak_selain_gaji_bulan_ini: number
   realisasi_pajak_selain_gaji_sd_saat_ini: number
   realisasi_pajak_upgutu_bulan_sebelumnya: number
   realisasi_pajak_upgutu_bulan_ini: number
   realisasi_pajak_upgutu_sd_saat_ini: number
}

interface Pembukuan4SpjFungsionalSipdPeta {
   id_pajak_potongan: number
   nama_pajak_potongan: string
   realisasi_potongan_gaji_bulan_sebelumnya: number
   realisasi_potongan_gaji_bulan_ini: number
   realisasi_potongan_gaji_sd_saat_ini: number
   realisasi_potongan_selain_gaji_bulan_sebelumnya: number
   realisasi_potongan_selain_gaji_bulan_ini: number
   realisasi_potongan_selain_gaji_sd_saat_ini: number
   realisasi_potongan_upgutu_bulan_sebelumnya: number
   realisasi_potongan_upgutu_bulan_ini: number
   realisasi_potongan_upgutu_sd_saat_ini: number
}

interface Pembukuan3SpjFungsionalSipdPeta {
   urut: number
   jenis: string
   realisasi_gaji_bulan_sebelumnya: number
   realisasi_gaji_bulan_ini: number
   realisasi_gaji_sd_saat_ini: number
   realisasi_ls_selain_gaji_bulan_sebelumnya: number
   realisasi_ls_selain_gaji_bulan_ini: number
   realisasi_ls_selain_gaji_sd_saat_ini: number
   realisasi_up_gu_tu_bulan_sebelumnya: number
   realisasi_up_gu_tu_bulan_ini: number
   realisasi_up_gu_tu_sd_saat_ini: number
}

interface Pembukuan1SpjFungsionalSipdPeta {
   kode_akun: string
   nama_akun: string
   alokasi_anggaran: number
   realisasi_gaji_bulan_sebelumnya: number
   realisasi_gaji_bulan_ini: number
   realisasi_gaji_sd_saat_ini: number
   realisasi_ls_selain_gaji_bulan_sebelumnya: number
   realisasi_ls_selain_gaji_bulan_ini: number
   realisasi_ls_selain_gaji_sd_saat_ini: number
   realisasi_up_gu_tu_bulan_sebelumnya: number
   realisasi_up_gu_tu_bulan_ini: number
   realisasi_up_gu_tu_sd_saat_ini: number
   jumlah_sd_saat_ini: number
   sisa_pagu_anggaran: number
   bku_jenis: number
   kode_unik: string
}

interface StatistikBelanjaSkpdSipdPeta {
   id_daerah: number
   tahun: number
   id_skpd: number
   kode_skpd: string
   nama_skpd: string
   anggaran: number
   realisasi_rencana: number
   realisasi_rill: number
}
