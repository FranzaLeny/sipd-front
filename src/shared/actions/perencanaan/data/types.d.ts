type GetAkunParams = {
   id_akun: number
   is_bagi_hasil: number
   is_bankeu_khusus: number
   id_daerah?: number
   id_jns_dana?: number
   id_unik?: string
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
   is_tkdn: number
   set_input: number
   set_kab_kota: number
   set_prov: number
   tahun: number
   set_lokus?: string
}

type GetListAkunParams = {
   tahun: number
   limit?: number
   search?: string
   after?: string
} & Omit<Partial<GetAkunParams>, 'tahun'>

type GetListSatuanParams = {
   limit?: number
   search?: string
   after?: string
} & Partial<Satuan>

type GetSkpdParams = {
   tahun?: number
   id_daerah?: number
   id_skpd?: number
   id_unit?: number
}

type GetSkpdListParams = {
   limit?: number
   search?: string
   after?: string
} & GetSkpdParams

type SkpdTapdAnggaranBySkpd = {
   skpd: Skpd & { tahun: number }
   sub_skpd: Skpd & { tahun: number }
   tapd: AnggotaTapd[] | null
}

type GetListStandarHargaParams = {
   tahun: number
   limit?: number
   search?: string
   after?: string
} & StandarHargaQuery

type StandarHargaById = {
   akun: {
      kode_akun: string
      nama_akun: string
   }[]
   creator?: Creator
   modifier?: Creator
} & StandarHarga

type GetListSumberDanaParams = { tahun?: number; set_prov?: number; set_kab_kota?: number }

type GetListUserSipdPerencanaanParams = {
   page?: number
   limit?: number
   search?: string
   after?: string
   id_daerah: number
} & Partial<UserSipdPerencanaan>
