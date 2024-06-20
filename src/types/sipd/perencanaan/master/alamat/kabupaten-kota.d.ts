interface ListKabKotaByProvSipdPayload {
   tahun: number
   id_daerah: number
}

interface ListKabKotaByProvSipdResponse {
   status_code: number
   status: boolean
   message: string
   data: KabKotaSipd[]
}

interface KabKotaSipd {
   id_daerah: number
   kode_ddn: string
   kode_ddn_2: string
   nama_daerah: string
   logo: string
}
