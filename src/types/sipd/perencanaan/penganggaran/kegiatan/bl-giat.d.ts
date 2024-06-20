interface ListBySkpdPayload {
   tahun: number
   id_daerah: number
   id_unit: number
   id_skpd: number
}

interface BlGiatSipdPayload {
   tahun: number
   id_daerah: number
   id_program: number
   id_giat: number
   id_unit: number
   id_skpd: number
   id_sub_skpd: number
}
interface BlGiatSipdResponse {
   status: boolean
   status_code: number
   data: BlGiatSipd
}
interface BlGiatDaerahSipdResponse {
   status: boolean
   status_code: number
   data: BlGiatSipd[]
}
interface BlGiatSipd {
   id_bl: number
   tahun: number
   id_daerah: number
   id_unit: number
   id_skpd: number
   id_sub_skpd: number
   id_program: number
   id_giat: number
   sasaran: string
}
