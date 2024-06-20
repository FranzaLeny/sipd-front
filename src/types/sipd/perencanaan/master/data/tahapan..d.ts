interface ListTahapanSipdPayload {
   id_daerah: number
   tahun: number
   length?: number
   start?: number
}
interface ListTahapanSipdResponse {
   status: boolean
   status_code: number
   data: ListTahapanSipd
}
interface ListTahapanSipd {
   recordsTotal: number
   recordsFiltered: number
   data: TahapanSipd[]
}

interface TahapanSipd {
   id_tahap: number
   nama_tahap: string
   status_tahap: string
   tipe_tahap: string
   urut_apbd: number
   is_locked: number
   set_nomor: number
   status_aktif: boolean
   set_perda: number
   set_perkada: number
}
