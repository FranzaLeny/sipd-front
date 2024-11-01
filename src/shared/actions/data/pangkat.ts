import axios from '@custom-axios/api-fetcher'

export async function getListPangkat(params: {
   limit?: number
   page?: number
   search?: string
   after?: string
   orderBy?: string | string[]
}) {
   return await axios
      .get<ResponseApi<CursorPaginate<Pangkat>>>(`/api/master/pangkat`, {
         params,
         paramsSerializer: {
            indexes: null, // by default: false
         },
      })
      .then((res) => res.data)
}
