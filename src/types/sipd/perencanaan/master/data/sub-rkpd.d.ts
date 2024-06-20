interface ListSubRkpdSipdResponse {
   status: boolean
   status_code: number
   data: SubRkpdSipd[]
}

interface SubRkpdSipd {
   id_sub_rkpd: number
   sub_rkpd_teks: string
}
