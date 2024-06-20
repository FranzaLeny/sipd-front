// https://sipd-ri.kemendagri.go.id/api/renja/renja_laporan/listDataRincianBelanjaSubKegiatan
type RkaSubGiatSipdPayload = {
   tahun: number
   id_daerah: number
   id_unit: number
   id_sub_skpd: number
   id_sub_bl: number
   is_anggaran?: number
   id_jadwal?: number
}
interface RkaSubGiatSipdResponse {
   status: boolean
   status_code: number
   data: ItemRkaSubGiatSipd[]
   data_setup_tapd: any[]
}

interface ItemRkaSubGiatSipd {
   id_rinci_sub_bl: number
   tahun: number
   id_daerah: number
   id_sub_skpd: number
   id_sub_bl: number
   id_akun: number
   kode_akun_1: string
   nama_akun_1: string
   kode_akun_2: string
   nama_akun_2: string
   kode_akun_3: string
   nama_akun_3: string
   kode_akun_4: string
   nama_akun_4: string
   kode_akun_5: string
   nama_akun_5: string
   kode_akun: string
   nama_akun: string
   jenis_bl: string
   lokus_akun?: any
   alamat_teks?: any
   lokus_akun_teks?: string | null
   total_harga: number
   subs_bl_teks: string
   ket_bl_teks: string
   id_standar_harga: number
   nama_standar_harga?: string | null
   koefisien: string
   satuan: string
   harga_satuan: number
   pajak: number
   harga_akun: number
   harga_akun_sum: number
   total_subs_sub_bl: number
   total_ket_sub_bl: number
   total_akun: number
   total_akun_1: number
   total_akun_2: number
   total_akun_3: number
   total_akun_4: number
   total_akun_5: number
   nama_dana?: string | null
   spek?: string | null
}

interface RkaSubGiatPergeseranSipdPayload {
   tahun: number
   id_daerah: number
   id_unit: number
   id_sub_skpd: number
   id_sub_bl: number
   is_anggaran: number
}
interface RkaSubGiatPergeseranSipdResponse {
   status: boolean
   status_code: number
   data: RkaSubGiatPergeseranSipd[]
   data_setup_tapd: any[]
}

interface RkaSubGiatPergeseranSipd {
   kode_rekening: string
   uraian: string
   koefisien_murni: string
   satuan_murni: string
   harga_murni: number
   ppn_murni: number
   rincian_murni: number
   koefisien_geser: string
   satuan_geser: string
   harga_geser: number
   ppn_geser: number
   rincian_geser: number
   selisih: number
}
