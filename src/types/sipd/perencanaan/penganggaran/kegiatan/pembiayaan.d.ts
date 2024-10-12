interface ListUnitPembiayaanSipdPayload {
   id_daerah: number
   tahun: number
   tipe_pembiayaan: 'pengeluaran' | 'penerimaan'
   model?: 'skpd'
   id_unit: number
}

interface ListUnitPembiayaanSipdResponse {
   status: boolean
   status_code: number
   data: PembiayaanUnit[]
}

interface PembiayaanUnit {
   id_daerah: number
   id_unit: number
   id_skpd: number
   kode_skpd: string
   nama_skpd: string
   nilai: number
   murni: number
   skpd: string
}

// https://sipd-ri.kemendagri.go.id/api/renja/pembiayaan/view

interface PembiayaanSipdPayload {
   id_daerah: number
   tahun: number
   id_pembiayaan: number
}

interface PembiayaanSipdResponse {
   status: boolean
   status_code: number
   data: PembiayaanSipd[]
}

interface PembiayaanSipd {
   id: string
   id_pembiayaan: number
   id_unik: string
   tahun: number
   id_daerah: number
   id_unit: number
   id_akun: number
   id_jadwal: number
   id_jadwal_murni: number
   uraian: string
   keterangan: string
   total: number
   koefisien: string
   volume: number
   satuan: string
   skpd_koordinator: number
   urusan_koordinator: number
   program_koordinator: number
   created_user: number
   created_at: string
   updated_user: number
   updated_at: string
   rkpd_murni: number
   rkpd_pak: number
   nama_daerah: string
   nama_unit: string
   nama_akun: string
   nama_jadwal_murni: null
   kode_daerah: string
   kode_unit: string
   kode_akun: string
   kua_murni?: string | null
   kua_pak?: string | null
}
