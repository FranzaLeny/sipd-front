interface ListKecamatanByKabKotaSipdPayload {
   id_kab_kota: number
   tahun: number
   length?: number
}

interface ListKecamatanByKabKotaSipdResponse {
   status_code: number
   status: boolean
   message: string
   data: KecamatanByKabKotaSipd[]
}

interface KecamatanByKabKotaSipd {
   id_camat: number
   tahun: number
   id_prop: number
   id_kab_kota: number
   kode_camat: string
   camat_teks: string
   kode_ddn: string
   kode_ddn_2: string
   is_locked: number
}
