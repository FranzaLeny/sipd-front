import axios from '@custom-axios/api-fetcher'

export const getUserSipdPerencanaan = async (params: GetListUserSipdPerencanaanParams) =>
   await axios
      .get<ResponseApi<CursorPaginate<UserSipdPerencanaan>>>(`/api/perencanaan/data/user`, {
         params,
      })
      .then((res) => res.data)
