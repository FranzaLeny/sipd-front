interface ListRinciBlSubGiatSipdPayload {
   tahun: number
   id_daerah: number
}
interface ListRinciBlSubGiatBySkpdSipdPayload {
   tahun: number
   id_daerah: number
   id_skpd: number
}
interface ListRinciBlSubGiatBySkpdSipdResponse {
   status: boolean
   status_kode: number
   data: RinciBlSubGiatSipd[]
}

interface ListRinciBlSubGiatSipdResponse {
   status: boolean
   status_kode: number
   data: RinciBlSubGiatSipd[]
}

interface RinciBlSubGiatSipdPayload {
   tahun: number
   id_daerah: number
   id_sub_bl: number
   id_rinci_sub_bl: number
}
interface RinciBlSubGiatSipdResponse {
   status: boolean
   status_code: number
   data: RinciBlSubGiatSipd[]
}

interface RinciBlSubGiatSipd {
   id_rinci_sub_bl: number
   id_unik: string
   tahun: number
   id_daerah: number
   id_unit: number
   id_bl: number
   id_sub_bl: number
   id_subs_sub_bl: number
   id_ket_sub_bl: number
   id_akun: number
   id_standar_harga: number
   id_standar_nfs: number
   pajak: number
   volume: number
   harga_satuan: number
   koefisien: string
   total_harga: number
   vol_1: number
   sat_1: string
   vol_2: number
   sat_2: string
   vol_3: number
   sat_3: string
   vol_4: number
   sat_4: string
   created_user: number
   created_at: string
   updated_user: number
   updated_at: string
   id_jadwal_murni: number
   is_lokus_akun: number
   lokus_akun_teks?: any
   jenis_bl: string
   id_blt: number
   id_usulan: number
   id_jenis_usul: number
   id_skpd: number
   id_sub_skpd: number
   id_program: number
   id_giat: number
   id_sub_giat: number
   rkpd_murni: number
   rkpd_pak: number
   set_sisa_kontrak: number
   nama_daerah: string
   nama_unit: string
   nama_bl?: any
   nama_sub_bl?: any
   nama_subs_sub_bl?: any
   nama_ket_sub_bl?: any
   nama_akun: string
   nama_standar_harga: string
   nama_standar_nfs: string
   nama_jadwal_murni: string
   nama_blt: string
   nama_usulan: string
   nama_jenis_usul: string
   nama_skpd: string
   nama_sub_skpd: string
   nama_program: string
   nama_giat: string
   nama_sub_giat: string
   kode_daerah?: any
   kode_unit?: any
   kode_akun: string
   kode_standar_harga: string
   kode_skpd?: any
   kode_sub_skpd?: any
   kode_program?: any
   kode_giat?: any
   kode_sub_giat?: any
   kua_murni?: any
   kua_pak?: any
   id_dana: number
   id_jadwal?: any
}

interface ListRinciBlSubGiatBySubBlSipdPayload {
   tahun: number
   id_daerah: number
   id_sub_bl: number
   is_anggaran?: number
   id_unit: number
   id_jadwal?: number
}

interface ListRinciBlSubGiatBySubBlSipdResponse {
   status: boolean
   status_code: number
   data: RinciBlSubGiatBySubBlSipd[]
}

interface RinciBlSubGiatBySubBlSipd {
   id_rinci_sub_bl: number
   id_subs_sub_bl: number
   id_ket_sub_bl: number
   id_sub_bl: number
   tahun: number
   id_daerah: number
   id_standar_harga: number
   kode_standar_harga: string
   koefisien: string
   harga_satuan: number
   total_harga: number
   id_akun: number
   kode_akun: string
   nama_akun: string
   nama_standar_harga: string
   spek: string
   akun_locked?: any
   ssh_locked: string
   penerima_bantuan?: any
   total_harga_murni?: number
   koefisien_murni?: string
   harga_satuan_murni?: number
}

interface DeleteRinciBlSubGiatSipdPayload {
   id_rinci_sub_bl: number
   id_daerah: number
   tahun: number
   id_daerah_log: number
   id_user_log: number
   aktivitas?: 'delete'
   kunci_bl_rinci?: 3
}

interface DeleteRinciBlSubGiatSipdResponse {
   status: boolean
   status_code: number
   message: string
}
