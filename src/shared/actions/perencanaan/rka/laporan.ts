import axios from '@custom-axios/api-fetcher'
import { postToSipd } from '@custom-axios/sipd-fetcher'

export const getRkaRekapBlSipd = async (payload: RkaBlSkpdSipdPayload) => {
   return await postToSipd('rkaRekapitulasiBelanjaSkpd', {
      keys: ['id_daerah', 'tahun', 'id_jadwal', 'id_skpd', 'id_sub_skpd', 'is_anggaran'],
      params: payload,
   }).then((res) => res.data)
}

export const getRkaBlPergeseranSubGiatSipd = async (payload: RkaBlPergeseranSkpdSipdPayload) => {
   return await postToSipd('rkaRekapitulasiBelanjaSkpdPergeseran', {
      keys: ['id_daerah', 'tahun', 'id_skpd', 'id_sub_skpd'],
      params: payload,
   }).then((res) => res.data)
}

export const getRkaSkpdSipd = async (payload: RkaBlSkpdSipdPayload) => {
   return await postToSipd('rkaBelanjaSkpd', {
      keys: ['id_daerah', 'tahun', 'id_jadwal', 'id_skpd', 'id_sub_skpd', 'is_anggaran'],
      params: payload,
   }).then((res) => res.data)
}

export const getRkaPergeseranSkpdSipd = async (payload: RkaPergeseranSkpdSipdPayload) => {
   return await postToSipd('rkaBelanjaSkpdPergeseran', {
      keys: ['id_daerah', 'tahun', 'id_skpd', 'id_sub_skpd'],
      params: payload,
   }).then((res) => res.data)
}

export const getRkaPendapatanSkpdSipd = async (payload: RkaPendapatanSkpdSipdPayload) => {
   return await postToSipd('rkaPendapatanSkpd', {
      keys: ['id_daerah', 'tahun', 'id_jadwal', 'id_skpd'],
      params: payload,
   }).then((res) => res.data)
}

export const getRkaPendapatanPergeseranSkpdSipd = async (
   payload: RkaPendapatanPergeseranSkpdSipdPayload
) => {
   return await postToSipd('rkaPendapatanSkpdPergeseran', {
      keys: ['id_daerah', 'tahun', 'id_skpd', 'id_sub_skpd'],
      params: payload,
   }).then((res) => res.data)
}

export const getListSubGiatRkaSipd = async (payload: ListSubGiatRkaSipdPayolad) => {
   return await postToSipd('listDataLampiranRKA', {
      keys: [
         'id_daerah',
         'tahun',
         'id_sub_bl',
         'id_jadwal',
         'id_sub_giat',
         'is_prop',
         'is_anggaran',
      ],
      params: payload,
   })
      .then((res) => res.data)
      .catch(() => {
         throw new Error('Gagal mengambil data belanja sub kegiatan dari sipd')
      })
}
export const getListSubGiatRkaPergeseranSipd = async (
   payload: ListDataLampiranRKAPergeseranPayload
) => {
   return await postToSipd('listDataLampiranRKAPergeseran', {
      keys: ['id_daerah', 'tahun', 'id_sub_bl', 'id_sub_giat', 'is_prop'],
      params: payload,
   })
      .then((res) => res.data)
      .catch(() => {
         throw new Error('Gagal mengambil data belanja sub kegiatan dari sipd')
      })
}

export const getRkaBlSubGiatSipd = async (payload: RkaSubGiatSipdPayload) => {
   return await postToSipd('listDataRincianBelanjaSubKegiatan', {
      keys: ['id_daerah', 'tahun', 'id_sub_bl', 'id_jadwal', 'id_sub_skpd', 'is_anggaran'],
      params: payload,
   })
      .then((res) => res.data)
      .catch(() => {
         throw new Error('Gagal mengambil data rka belanja sub kegiatan dari sipd')
      })
}
export const getRkaBlSubGiatPergeseranSipd = async (payload: RkaSubGiatPergeseranSipdPayload) => {
   return await postToSipd('listDataRincianBelanjaSubKegiatanPergeseran', {
      keys: ['id_daerah', 'tahun', 'id_sub_bl', 'id_sub_skpd', 'is_anggaran', 'id_unit'],
      params: payload,
   })
      .then((res) => res.data)
      .catch(() => {
         throw new Error('Gagal mengambil data rka belanja sub kegiatan dari sipd')
      })
}

export const getLaporanSkpd = async (params: GetLaporanSkpdParams) => {
   const { data } = await axios.get<ResponseApi<LaporanSkpd>>('/api/perencanaan/rka/skpd/laporan', {
      params,
   })
   return data
}

export const getLaporanBelanjaSkpd = async (params: GetLaporanSkpdParams) => {
   return await axios
      .get<ResponseApi<LaporanBlSkpd>>('/api/perencanaan/rka/skpd/laporan/belanja', {
         params,
      })
      .then((res) => res.data)
}

export const getLaporanPendapatanSkpd = async (params: GetLaporanSkpdParams) => {
   return await axios
      .get<
         ResponseApi<LaporanPendapatan>
      >('/api/perencanaan/rka/skpd/laporan/pendapatan', { params })
      .then((res) => res.data)
}

export const getLaporanSubGiat = async (id: string) => {
   return await axios
      .get<ResponseApi<LaporanBlSubGiat>>(`/api/perencanaan/rka/sub-giat/${id}/laporan`)
      .then((res) => res.data)
}

export const getLaporanSumberDana = async (params: GetLaporanSkpdParams) => {
   return await axios
      .get<ResponseApi<LaporanRekapanSumberDana>>('/api/perencanaan/rka/skpd/laporan/sumber-dana', {
         params,
      })
      .then((res) => res.data)
}
