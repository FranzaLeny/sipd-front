interface _SkpdLaporan {
   unit: _UnitLaporan
   sub_skpd: _UnitLaporan
   tapd: _TapdLaporan[]
}

interface _UnitLaporan {
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

interface _TapdLaporan {
   id: string
   nip: string
   nama: string
   jabatan: string
}

interface _JadwalLaporan {
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

interface _SubkegiatanLaporanBlSubGiat {
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
   dana_bl_sub_giat: _DanablsubgiatLaporanBlSubGiat[]
   lokasi_bl_sub_giat: _LokasiblsubgiatLaporanBlSubGiat[]
   output_bl_sub_giat: _OutputblsubgiatLaporanBlSubGiat[]
   tag_bl_sub_giat: any[]
   jadwal_anggaran_id: string
   jadwal_anggaran_murni_id: null
   id_skpd: number
   capaian_bl_giat: _OutputblsubgiatLaporanBlSubGiat[]
   hasil_bl_giat: _OutputblsubgiatLaporanBlSubGiat[]
   output_bl_giat: _OutputblgiatLaporanBlSubGiat[]
   sasaran: string
   pagu: number
   capaian_bl_giat_murni: _OutputblsubgiatLaporanBlSubGiat[]
   hasil_bl_giat_murni: _OutputblsubgiatLaporanBlSubGiat[]
   output_bl_giat_murni: _OutputblgiatLaporanBlSubGiat[]
   sasaran_murni: string
   output_bl_sub_giat_murni: _OutputblsubgiatLaporanBlSubGiat[]
   tag_bl_sub_giat_murni: any[]
}

interface _OutputblgiatLaporanBlSubGiat {
   id: string
   tolok_ukur: string
   target_teks: string
}

interface _OutputblsubgiatLaporanBlSubGiat {
   id: string
   tolak_ukur: string
   target_teks: string
}

interface _LokasiblsubgiatLaporanBlSubGiat {
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

interface _DanablsubgiatLaporanBlSubGiat {
   id: string
   nama_dana: string
   pagu_dana: number
   id_dana: number
}

interface _ItemRincianLaporanBlSubGiat {
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
}

interface _ItemLaporanRkaSKpd {
   total_harga: number
   total_harga_murni: number
   kode_akun: string
   nama_akun: string
}

interface _ItemLaporanBelanja {
   kode: string[]
   uraian: string
   nama_dana: string
   lokasi: string
   pagu_n_lalu: number
   belanja: _BelanjaLaporan
   belanja_murni: _BelanjamurniLaporan
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

interface _BelanjamurniLaporan {
   bo_murni: number
   btt_murni: number
   bt_murni: number
   bm_murni: number
   total_harga_murni: number
}

interface _BelanjaLaporan {
   bo: number
   btt: number
   bt: number
   bm: number
   total_harga: number
}

interface _ListpendapatanLaporan {
   kode: string
   uraian: string
   pendapatan: _PendapatanLaporan
   pendapatan_murni: _PendapatanmurniLaporan
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

interface _PendapatanmurniLaporan {
   satuan_murni: string
   harga: number
   total_harga_murni: number
   koefisien_murni?: string
}

interface _PendapatanLaporan {
   satuan: string
   harga: number
   total_harga: number
   koefisien?: string
}

export interface GetLaporanRkaSkpdParams {
   jadwal_anggaran_id: string
   id_skpd?: string | number
   id_unit: string | number
   tahun: string | number
}

// Rekapan Belanja masing- masing sub kegiatan
export interface LaporanBlSubGiat {
   rincian: _ItemRincianLaporanBlSubGiat[]
   sub_kegiatan: _SubkegiatanLaporanBlSubGiat
   jadwal: _JadwalLaporan
   skpd: _SkpdLaporan
}

// Rekapan Belanja dan Pendapatan SKPD
export interface LaporanBelanjaSkpd {
   list_bl: _ItemLaporanBelanja[]
   jadwal: _JadwalLaporan
   skpd: _SkpdLaporan
}

// Rekapan Belanja program kegiatan subkegiatan
export interface LaporanSkpd {
   list_rekapan: _ItemLaporanRkaSKpd[]
   jadwal: _JadwalLaporan
   skpd: _SkpdLaporan
}

// Rekapan Belanja dan Pendapatan SKPD
export interface LaporanPendapatan {
   list_pendapatan: _ListpendapatanLaporan[]
   jadwal: _JadwalLaporan
   skpd: _SkpdLaporan
}

// Rrkapan Sumber Dana

export interface RekapanSumberDana {
   sumber_dana: {
      group: string
      level: number
      uraian: string
      kode: string
      no_urut: number
      total_harga_murni: number
      total_harga: number
      pagu: number
      pagu_murni: number
      belanja: {
         total_harga: number
         total_harga_murni: number
         id_dana: number
         nama_dana: string
         pagu: number
      }[]
   }[]
   skpd: _SkpdLaporan
   jadwal: {
      tahun: number
      is_perubahan: number
      nama_sub_tahap: string
   }
}
