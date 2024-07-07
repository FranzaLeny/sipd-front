interface ListTahapanPlanSipdPayload {
   // GET https://sipd-ri.kemendagri.go.id/api/master/tahapan/list/plan
}

interface ListTahapanPlanSipdResponse {
   status: boolean
   status_code: number
   data: ListTahapanPlanSipd[]
}

interface ListTahapanPlanSipd {
   id_tahap: number
   nama_tahap: string
}
