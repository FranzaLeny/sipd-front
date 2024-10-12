import apiFetcher from '@custom-axios/api-fetcher'

export const syncRakBlSubGiat = async (data: RakUncheckedCreateInput[]) => {
   return await apiFetcher.put<ResponseApi>(`/api/keuangan/rak`, data)
}
export const syncRakBlSkpd = async (data: RakSkpdUncheckedCreateInput[]) => {
   return await apiFetcher.put<ResponseApi>(`/api/keuangan/rak/skpd`, data)
}

export const getRakBlByJadwal = async (params: GetRakByJadwalParams) => {
   return await apiFetcher
      .get<ResponseApi<RakBlByJadwal[]>>('/api/keuangan/rak/get-by-jadwal', {
         params,
      })
      ?.then((res) => res.data)
}

export const getRakSkpdBlBySkpd = async (params: {
   jadwal_anggaran_id: string
   id_skpd: number
}) => {
   return await apiFetcher
      .get<ResponseApi<RakSkpd>>('/api/keuangan/rak/skpd/get-by-jadwal', {
         params,
      })
      ?.then((res) => res.data)
}

export const syncRelalisasiRak = async (data: RealisasiRakInput[]) => {
   return await apiFetcher.patch<ResponseApi>('/api/keuangan/rak/realisasi', data)
}

// OTHER
