import axios from '@custom-axios/api-fetcher'
import { UserSipdPerencanaan } from '@zod'

export type GetUserSipdPerencanaanListParams = {
   page?: number
   limit?: number
   search?: string
   after?: string
   id_daerah: number
} & Partial<UserSipdPerencanaan>

const getUserSipdPerencanaan = async (params: GetUserSipdPerencanaanListParams) =>
   await axios
      .get<ResponseApi<CursorPaginate<UserSipdPerencanaan>>>(`api/perencanaan/master/user`, {
         params,
      })
      .then((res) => res.data)

export { getUserSipdPerencanaan }
