import apiFetcher from '@custom-axios/api-fetcher'

export const syncAkunBelanja = async (data: AkunBelanjaUncheckedCreateInput[]) => {
   return await apiFetcher.put<ResponseApi>(`/api/keuangan/akun-belanja`, data)
}

export const getAkunBelanja = async (params: GetRakByJadwalParams) => {
   return await apiFetcher
      .get<ResponseApi<AkunBelanja[]>>('/api/keuangan/akun-belanja', {
         params,
      })
      ?.then((res) => res.data)
}
