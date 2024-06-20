interface ListAkunSipdPayload {
   tahun: number
   id_daerah: number
   length?: number
   start?: number
   deleted_data?: boolean
}
interface ListAkunSipdResponse {
   status: boolean
   status_code: number
   data: ListAkunSipd
}

interface ListAkunSipd {
   recordsTotal: number
   recordsFiltered: number
   data: AkunSipd[]
}

interface AkunSipd {
   created_at?: any
   created_ip?: any
   created_user: number
   id_akun: number
   id_daerah: number
   id_jns_dana?: any
   id_unik?: string
   is_bagi_hasil: number
   is_bankeu_khusus: number
   is_bankeu_umum: number
   is_barjas: number
   is_bl: number
   is_bos: number
   is_btt: number
   is_bunga: number
   is_gaji_asn: number
   is_hibah_brg: number
   is_hibah_uang: number
   is_locked: number
   is_modal_tanah: number
   is_pembiayaan: number
   is_pendapatan: number
   is_sosial_brg: number
   is_sosial_uang: number
   is_subsidi: number
   is_tkdn?: any
   ket_akun?: any
   kode_akun_lama?: any
   kode_akun_revisi?: any
   kode_akun: string
   kunci_tahun?: any
   level: number
   mulai_tahun?: any
   nama_akun: string
   set_input: number
   set_kab_kota: number
   set_lokus?: string
   set_prov: number
   tahun: number
   updated_at?: any
   updated_ip?: any
   updated_user: number
}
