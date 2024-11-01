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
export async function addPegawai(data: PegawaiUncheckedCreateInput) {
   return await axios.post<ResponseApi<PegawaiWithPangkat>>(`/api/master/pegawai`, data)
}

export async function getPegawai(id: string) {
   return await axios.get<ResponseApi<PegawaiWithPangkat>>(`/api/master/pegawai/${id}`)
}

export async function deletePegawai(id: string) {
   return await axios.delete<ResponseApi<PegawaiWithPangkat>>(`/api/master/pegawai/${id}`)
}
