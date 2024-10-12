import axios from '@custom-axios/api-fetcher'
import { postToSipd } from '@custom-axios/sipd-fetcher'

export const getLaporanRkaSkpdSipd = async (payload: LaporanRkaSkpdSipdPayload) => {
   return await postToSipd('laporanRkaSkpd', {
      keys: ['id_daerah', 'tahun', 'id_jadwal', 'id_skpd', 'id_sub_skpd', 'is_anggaran'],
      params: payload,
   }).then((res) => res.data)
}

export const getLaporanRkaPerubahanSkpdSipd = async (
   payload: LaporanRkaPerubahanSkpdSipdPayload
) => {
   return await postToSipd('laporanRkaPerubahanSkpd', {
      keys: ['id_daerah', 'tahun', 'id_skpd', 'id_sub_skpd'],
      params: payload,
   }).then((res) => res.data)
}

export const getLaporanRkaPendapatanSkpdSipd = async (payload: LaporanRkaPendapatanSipdPayload) => {
   return await postToSipd('laporanRkaPendapatan', {
      keys: ['id_daerah', 'tahun', 'id_jadwal', 'id_skpd'],
      params: payload,
   }).then((res) => res.data)
}

export const getLaporanRkaPerubahnPendapatanSipd = async (
   payload: LaporanRkaPerubahanPendapatanSipdPayload
) => {
   return await postToSipd('laporanRkaPerubahanPendapatan', {
      keys: ['id_daerah', 'tahun', 'id_skpd', 'id_sub_skpd'],
      params: payload,
   }).then((res) => res.data)
}

export const getRkaRekapBelanjaSipd = async (payload: LaporanRkaRekapBlSipdPayload) => {
   return await postToSipd('laporanRkaRekapBelanja', {
      keys: ['id_daerah', 'tahun', 'id_jadwal', 'id_skpd', 'id_sub_skpd', 'is_anggaran'],
      params: payload,
   }).then((res) => res.data)
}

export const getLaporanRkaPerubahanRekapBelanjaSipd = async (
   payload: LaporanRkaPerubahanRekapBlSipdPayload
) => {
   return await postToSipd('laporanRkaPerubahanRekapBl', {
      keys: ['id_daerah', 'tahun', 'id_skpd', 'id_sub_skpd'],
      params: payload,
   }).then((res) => res.data)
}

export const getLaporanRkaSubGiatSipd = async (payload: LaporanRkaSubGiatSipdPayolad) => {
   return await postToSipd('laporanRkaSubGiat', {
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
export const getLaporanRkaPerubahanSubGiatSipd = async (
   payload: LaporanRkaPerubahanSubGiatSipdPayload
) => {
   return await postToSipd('laporanRkaPerubahanSubGiat', {
      keys: ['id_daerah', 'tahun', 'id_sub_bl', 'id_sub_giat', 'is_prop'],
      params: payload,
   })
      .then((res) => res.data)
      .catch(() => {
         throw new Error('Gagal mengambil data belanja sub kegiatan dari sipd')
      })
}

export const getLaporanRkaListRinciBlSubGiatSipd = async (
   payload: LaporanRkaListRinciBlSubGiatSipdPayload
) => {
   return await postToSipd('laporanRkaListRinciBlSubGiat', {
      keys: ['id_daerah', 'tahun', 'id_sub_bl', 'id_jadwal', 'id_sub_skpd', 'is_anggaran'],
      params: payload,
   })
      .then((res) => res.data)
      .catch(() => {
         throw new Error('Gagal mengambil data rka belanja sub kegiatan dari sipd')
      })
}
export const getLaporanRkaPerubahanListRinciBlSubGiatSipd = async (
   payload: LaporanRkaPerubahanListRinciBlSubGiatSipdPayload
) => {
   return await postToSipd('laporanRkaPerubahanListRinciBlSubGiat', {
      keys: ['id_daerah', 'tahun', 'id_sub_bl', 'id_sub_skpd', 'is_anggaran', 'id_unit'],
      params: payload,
   })
      .then((res) => res.data)
      .catch(() => {
         throw new Error('Gagal mengambil data rka belanja sub kegiatan dari sipd')
      })
}

export const getLaporanRkaSkpd = async (params: GetLaporanSkpdParams) => {
   const { data } = await axios.get<ResponseApi<LaporanSkpd>>('/api/perencanaan/rka/skpd/laporan', {
      params,
   })
   return data
}

export const getLaporanRkaRekapBelanja = async (params: GetLaporanSkpdParams) => {
   return await axios
      .get<ResponseApi<LaporanBlSkpd>>('/api/perencanaan/rka/skpd/laporan/rekap-belanja', {
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

export const getLaporanRkaSubGiat = async (id: string) => {
   return await axios
      .get<ResponseApi<LaporanBlSubGiat>>(`/api/perencanaan/rka/sub-giat/${id}/laporan`)
      .then((res) => res.data)
}

export const getLaporanRkaSumberDana = async (params: GetLaporanSkpdParams) => {
   return await axios
      .get<ResponseApi<LaporanRekapanSumberDana>>('/api/perencanaan/rka/skpd/laporan/sumber-dana', {
         params,
      })
      .then((res) => res.data)
}
export const getLaporanFormRak = async (params: GetLaporanSkpdParams) => {
   return await axios
      .get<ResponseApi<LaporanFormRak>>('/api/perencanaan/rka/skpd/laporan/form-rak', {
         params,
      })
      .then((res) => res.data)
}
