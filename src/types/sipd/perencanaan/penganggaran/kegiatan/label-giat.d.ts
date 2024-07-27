// '/api/master/label_giat/list

interface ListLabelBlGiatDaerahSipdPayload {
   tahun: number
   id_daerah: number
   length: number
   start: number
}

interface ListLabelBlGiatDaerahSipdResponse {
   status: boolean
   status_code: number
   data: any[]
}
