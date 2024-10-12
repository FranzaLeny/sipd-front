'use server'

import axios from '@custom-axios/peta-fetcher'

// SIPD PENATAUSAHAAN

export const getBlSkpdSipdPeta = async (idSkpd: string | number) => {
   return await axios.get<ResponseGetBlSkpdPeta>(
      `referensi/strict/dpa/penarikan/belanja/skpd/${idSkpd}`
   )
}

export const getRakBlSubGiatSipdPeta = async (params: GetRakBlSubGiatSipdPetaParams) => {
   return await axios.get<RakBlSubGiatSipdPeta[]>(
      'referensi/strict/dpa/penarikan/belanja/sub-giat',
      { params }
   )
}

export const getLaporanRakBlSubGiatSipdPeta = async (params: GetRakBlSubGiatSipdPetaParams) => {
   return await axios.get<LaporanRakBlSubGiatSipdPeta>(
      `referensi/strict/laporan/dpa/anggaran-kas/belanja/${params?.id_unit}`,
      { params }
   )
}

export const getRakSkpdSipdPeta = async (params: { page: number; limit: number }) => {
   return await axios.get<ResponseRakSipdPeta[]>(`referensi/strict/dpa/penarikan/belanja`, {
      params,
   })
}

export const getRakSubGiatSipdPeta = async (skpd: number | string) => {
   return await axios.get<ResponseRakSubGiatSipdPeta>(
      `referensi/strict/dpa/penarikan/belanja/skpd/${skpd}`
   )
}

export const getRakSkpdSipdPetaBySkpd = async (idSkpd: number) => {
   const data = await getRakSkpdSipdPeta({ page: 1, limit: 100 })?.then((res) => {
      return res?.find((d) => d.id_skpd === idSkpd)
   })
   if (data) {
      return data
   } else {
      throw new Error('Data Rak SKPD tidak ditemukan')
   }
}
