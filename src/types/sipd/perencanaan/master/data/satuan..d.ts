interface ListSatuanSipdPayload {
   length?: number
}

interface ListSatuanSipdResponse {
   status_code: number
   status: boolean
   message: string
   data: ListSatuanSipd
}

interface ListSatuanSipd {
   recordsTotal: number
   recordsFiltered: number
   data: SatuanSipd[]
}

interface SatuanSipd {
   id_satuan: number
   nama_satuan: string
   is_locked: number
}
