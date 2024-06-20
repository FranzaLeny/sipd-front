interface ListKelurahanByKecamatanSipdPayload {
   id_camat: number
   tahun: number
   length?: number
}

interface ListKelurahanByKecamatanSipdResponse {
   status_code: number
   status: boolean
   message: string
   data: KelurahanByKecamatan[]
}

interface KelurahanByKecamatan {
   id_lurah: number
   tahun: number
   id_prop: number
   id_kab_kota: number
   id_camat: number
   kode_lurah: string
   lurah_teks: string
   kode_ddn: string
   kode_ddn_2: string
   is_desa: number
   is_locked: number
}
