interface ListProvinsiSipdPayload {
   tipe?: string
}

interface ListProvinsiSipdResponse {
   status_code: number
   status: boolean
   message: string
   data: ProvinsiSipd[]
}

interface ProvinsiSipd {
   id_daerah: number
   nama_daerah: string
   kode_ddn: string
}
