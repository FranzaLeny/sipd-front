import axios from '@custom-axios/api-fetcher'
import { TapdAnggaran, TapdAnggaranUncheckedCreateInput, TapdAnggaranWithRelations } from '@zod'

export type GetTapdAnggaranListParams = {
   limit?: number
   search?: string
   after?: string
} & Partial<TapdAnggaran>

export const getTapdAnggaranList = async (params: GetTapdAnggaranListParams) => {
   return await axios
      .get<ResponseApi<CursorPaginate<TapdAnggaran>>>(`api/master/tapd`, {
         params,
      })
      .then((res) => res.data)
}
export const getTapdAnggaran = async (id: String) => {
   return await axios.get<ResponseApi<TapdAnggaranWithRelations>>(`api/master/tapd/${id}`)
}
export const findTapdAnggaran = async (params: {
   id_unit: number | string
   id_daerah: number | string
   tahun: number | string
}) => {
   return await axios
      .get<ResponseApi<TapdAnggaranWithRelations>>(`api/master/tapd/by-unit`, {
         params,
      })
      .then((res) => res.data)
}

export const addTapdAnggaran = async (data: TapdAnggaranUncheckedCreateInput) => {
   return await axios.post<ResponseApi>('api/master/tapd', data)
}
export const updateTapdAnggaran = async (id: string, data: TapdAnggaranUncheckedCreateInput) => {
   return await axios.patch<ResponseApi>(`api/master/tapd/${id}`, data)
}
export const deleteTapdAnggaran = async (id: string) => {
   return await axios.delete<ResponseApi>(`api/master/tapd/${id}`)
}
