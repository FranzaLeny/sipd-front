import axios from '@custom-axios/api-fetcher'

async function getRoles(params: { limit: number; page: number; search?: string }) {
   return await axios.get<ResponseApi<CursorPaginate<Role>>>(`/api/master/role`, { params })
}

export { getRoles }
