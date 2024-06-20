// https://service.sipd.kemendagri.go.id/referensi/strict/laporan/dpa/dpa/rincian-belanja/1864?id_unit=1864&id_skpd=1864&id_sub_skpd=1864&id_urusan=11&id_bidang_urusan=202&id_program=1186&id_giat=8709&id_sub_giat=20294&id_jadwal_sipd=496
interface RincianDppaSipdPetaResponse {
   id_jadwal_sipd: number
   id_tahap: number
   nomor_dpa: string
   tanggal_dpa: string
   nama_pa: string
   nip_pa: string
   tanun: number
   nama_daerah: string
   nama_ibukota: string
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
   nama_dana: string
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
   tolok_ukur_capaian: string
   target_kinerja_capaian: string
   tolok_ukuran_keluaran: string
   target_kinerja_keluaran: string
   tolok_ukur_hasil: string
   target_kinerja_hasi: string
   total: number
   nama_ppkd: string
   nip_ppkd: string
   item: ItemRakRincianDppaSipdPeta[]
   rak: RakRincianDppaSipdPeta
}

interface RakRincianDppaSipdPeta {
   uraian: string
   januari: number
   februari: number
   maret: number
   april: number
   mei: number
   juni: number
   juli: number
   agustus: number
   september: number
   oktober: number
   november: number
   desember: number
   jumlah: number
}

interface ItemRakRincianDppaSipdPeta {
   kode_akun: string
   uraian: string
   koefisien: string
   satuan: string
   harga_satuan: number
   pajak: number
   nilai: number
   sebelum_koefisien: string
   sebelum_satuan: string
   sebelum_harga_satuan: number
   sebelum_pajak: number
   sebelum_nilai: number
   setelah_koefisien: string
   setelah_satuan: string
   setelah_harga_satuan: number
   setelah_pajak: number
   setelah_nilai: number
   bertambah_berkurang: number
}
