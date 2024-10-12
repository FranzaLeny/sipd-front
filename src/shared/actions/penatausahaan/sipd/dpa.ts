'use server'

import axios from '@custom-axios/peta-fetcher'

export const getDpaSkpdFromSipd = async ({
   id_skpd,
   id_jadwal,
}: {
   id_skpd: number | string
   id_jadwal: number | string
}) => {
   return await axios.get<DpaSkpdPergeseranPeta | DpaSkpdPeta>(
      `referensi/strict/laporan/dpa/dpa/skpd/${id_skpd}/${id_jadwal}`
   )
}
export const getDpaBelanjaSkpdFromSipdPeta = async ({
   id_skpd,
   id_jadwal,
}: {
   id_skpd: number | string
   id_jadwal: number | string
}) => {
   return await axios.get<DpaBelanjaSkpdFromSipdPeta>(
      `referensi/strict/laporan/dpa/dpa/belanja/${id_skpd}/${id_jadwal}`
   )
}

export const getDpaPendapatanSkpdFromSipdPeta = async ({
   id_skpd,
   id_jadwal,
}: {
   id_skpd: number | string
   id_jadwal: number | string
}) => {
   return await axios.get<DpaPendapatanSkpdFromSipdPeta>(
      `referensi/strict/laporan/dpa/dpa/pendapatan/${id_skpd}/${id_jadwal}`
   )
}

export const getDpaBelanjaSubGiatFromSipdPeta = async ({
   id_skpd,
}: {
   id_skpd: number | string
}) => {
   return await axios.get<DpaBelanjaSubGiatFromSipdPeta>(
      `referensi/strict/dpa/penarikan/belanja/skpd/${id_skpd}`
   )
}

export const getRinciDpaBelanjaSubGiatFromSipdPeta = async (
   params: RinciDpaBelanjaSubGiatFromSipdPetaParams
) => {
   return await axios.get<RinciDpaBelanjaSubGiatFromSipdPeta>(
      `referensi/strict/laporan/dpa/dpa/rincian-belanja/${params.id_skpd}`,
      { params }
   )
}
