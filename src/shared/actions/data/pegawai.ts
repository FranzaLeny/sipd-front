import axios from '@custom-axios/api-fetcher'

export async function getListPegawai(params: {
   lim?: number
   page?: number
   search?: string
   after?: string
   orderBy?: string | string[]
}) {
   return await axios
      .get<ResponseApi<CursorPaginate<PegawaiWithPangkat>>>(`/api/master/pegawai`, {
         params,
         paramsSerializer: {
            indexes: null, // by default: false
         },
      })
      .then((res) => res.data)
}
