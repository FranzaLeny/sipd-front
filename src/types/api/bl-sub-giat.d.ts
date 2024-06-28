export interface ResponseGetSubGiatWithRinci {
   rincian: Rincian[]
   sub_kegiatan: Subkegiatan
   jadwal: Jadwal
   skpd: Skpd
}

interface Jadwal {
   nama_jadwal_murni: string | null
   is_locked: number
   is_perubahan: number
   nama_sub_tahap: string
   is_active: number
   waktu_selesai: Date
   jadwal_murni: {
      id: string
      nama_sub_tahap: string
   } | null
}

interface Subkegiatan {
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
   dana_bl_sub_giat: Danablsubgiat[]
   lokasi_bl_sub_giat: Lokasiblsubgiat[]
   output_bl_sub_giat: Outputblsubgiat[]
   tag_bl_sub_giat: any[]
   jadwal_anggaran_id: string
   jadwal_anggaran_murni_id: string
   id_skpd: number
   capaian_bl_giat: Outputblsubgiat[]
   hasil_bl_giat: Outputblsubgiat[]
   output_bl_giat: Outputblgiat[]
   sasaran: string
   pagu: number
   capaian_bl_giat_murni: any[]
   hasil_bl_giat_murni: any[]
   output_bl_giat_murni: any[]
   sasaran_murni: string
   output_bl_sub_giat_murni: any[]
   tag_bl_sub_giat_murni: any[]
}

interface Outputblgiat {
   id: string
   tolok_ukur: string
   target_teks: string
}

interface Outputblsubgiat {
   id: string
   tolak_ukur: string
   target_teks: string
}

interface Lokasiblsubgiat {
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

interface Danablsubgiat {
   id: string
   nama_dana: string
   pagu_dana: number
   id_dana: number
}

interface Rincian {
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

interface Skpd {
   unit: Unit
   sub_skpd: Unit
   tapd: Tapd[]
}

interface Unit {
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
interface Tapd {
   id: string
   nip: string
   nama: string
   jabatan: string
}
