// https://sipd-ri.kemendagri.go.id/api/renja/pendapatan/listByIdUnit

interface ListPendapatanByUnitSipdPayload {
   id_daerah: number
   tahun: number
   id_unit: number
}
interface ListPendapatanSkpdSipdPayload {
   tahun: number
   id_daerah: number
   id_unit: number
   model?: 'skpd'
   'search[value]'?: string
   length?: number
   start?: number
   'order[0][column]'?: number
   'order[0][dir]'?: string
}
interface ListPendapatanByUnitSipdResponse {
   status: boolean
   status_code: number
   data: ListPendapatanByUnitSipd[]
}

interface ListPendapatanByUnitSipd {
   id_pendapatan: number
   id_unik: string
   tahun: number
   id_daerah: number
   id_unit: number
   id_akun: number
   uraian: string
   keterangan: string
   total: number
   koefisien: string
   volume: number
   kode_akun: string
   nama_akun: string
   is_locked: number
   murni: number
}

interface ListPendapatanSkpdSipdResponse {
   status: boolean
   status_code: number
   data: DataPendapatanSkpdSipd
}

interface DataPendapatanSkpdSipd {
   recordsTotal: number
   recordsFiltered: number
   data: PendapatanSkpdSipd[]
}

interface PendapatanSkpdSipd {
   id_skpd: number
   kode_skpd: string
   nama_skpd: string
   id_unit: number
   pendapatan: number
   murni: number
   skpd: string
}
