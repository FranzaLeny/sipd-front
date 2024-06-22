import apiFetcher from '@custom-axios/api-fetcher'
import axios from '@custom-axios/peta-fetcher'
import {
   RakSkpd,
   RakSkpdUncheckedCreateInput,
   RakUncheckedCreateInput,
} from '@validations/keuangan/rak'

// SIPD PENATAUSAHAAN

interface ResponseGetBlSkpdPeta {
   id_skpd: number
   nama_skpd: string
   kode_skpd: string
   items: BlSubGiatSipdPeta[]
}

interface BlSubGiatSipdPeta {
   id_daerah: number
   tahun: number
   id_unit: number
   id_skpd: number
   kode_skpd: string
   nama_skpd: string
   id_sub_skpd: number
   kode_sub_skpd: string
   nama_sub_skpd: string
   id_urusan: number
   id_bidang_urusan: number
   kode_bidang_urusan: string
   nama_bidang_urusan: string
   id_program: number
   kode_program: string
   nama_program: string
   id_giat: number
   kode_giat: string
   nama_giat: string
   id_sub_giat: number
   kode_sub_giat: string
   nama_sub_giat: string
   nilai: number
   nilai_rak: number
   status: number
   rak_belum_sesuai: number
}

export const getBlSkpdSipdPeta = async (idSkpd: string | number) => {
   return await axios.get<ResponseGetBlSkpdPeta>(
      `referensi/strict/dpa/penarikan/belanja/skpd/${idSkpd}`
   )
}

export interface ParamsRakBlSkpdSipdPeta {
   id_unit: number
   id_skpd: number
   id_sub_skpd: number
   id_urusan: number
   id_bidang_urusan: number
   id_program: number
   id_giat: number
   id_sub_giat: number
}

export interface ResponseRakBlSubGiatSipdPeta {
   '1': number
   '2': number
   '3': number
   '4': number
   '5': number
   '6': number
   '7': number
   '8': number
   '9': number
   '10': number
   '11': number
   '12': number
   id_daerah: number
   tahun: number
   id_unit: number
   id_skpd: number
   kode_skpd: string
   nama_skpd: string
   id_sub_skpd: number
   kode_sub_skpd: string
   nama_sub_skpd: string
   id_urusan: number
   id_bidang_urusan: number
   kode_bidang_urusan: string
   nama_bidang_urusan: string
   id_program: number
   kode_program: string
   nama_program: string
   id_giat: number
   kode_giat: string
   nama_giat: string
   id_sub_giat: number
   kode_sub_giat: string
   nama_sub_giat: string
   id_akun: number
   kode_akun: string
   nama_akun: string
   nilai: number
   nilai_rak: number
   id_rak_belanja: number
   is_valid_skpd: number
   is_valid_sekda: number
   is_valid_bud: number
}

export const getRakBlSubGiatSipdPeta = async (params: ParamsRakBlSkpdSipdPeta) => {
   return await axios.get<ResponseRakBlSubGiatSipdPeta[]>(
      'referensi/strict/dpa/penarikan/belanja/sub-giat',
      { params }
   )
}

export interface ResponseLaporanRakBlSubGiatSipdPeta {
   nama_daerah: string
   kode_skpd: string
   nama_skpd: string
   tahun: number
   tanggal: string
   nama_ibukota: string
   nama_penandatangan: string
   nip_penandatangan: string
   items: LaporanRakBlSubGiatSipdPeta[]
}
interface LaporanRakBlSubGiatSipdPeta {
   kode_rekening: string
   uraian: string
   anggaran_tahun_ini: number
   total_rak: number
   bulan_1: number
   bulan_2: number
   bulan_3: number
   bulan_4: number
   bulan_5: number
   bulan_6: number
   bulan_7: number
   bulan_8: number
   bulan_9: number
   bulan_10: number
   bulan_11: number
   bulan_12: number
}

export const getLaporanRakBlSubGiatSipdPeta = async (params: ParamsRakBlSkpdSipdPeta) => {
   return await axios.get<ResponseLaporanRakBlSubGiatSipdPeta>(
      `referensi/strict/laporan/dpa/anggaran-kas/belanja/${params?.id_unit}`,
      { params }
   )
}

interface ResponseRakSpd {
   id_daerah: number
   tahun: number
   id_skpd: number
   kode_skpd: string
   nama_skpd: string
   nilai: number
   nilai_rak: number
   status: number
}
export const getRakSkpdSipdPeta = async (params: { page: number; limit: number }) => {
   return await axios.get<ResponseRakSpd[]>(`referensi/strict/dpa/penarikan/belanja`, { params })
}

interface ResponseRakSubGiatSipdPeta {
   id_skpd: number
   nama_skpd: string
   kode_skpd: string
   items: RakSubGiatSipdPeta[]
}

interface RakSubGiatSipdPeta {
   id_daerah: number
   tahun: number
   id_unit: number
   id_skpd: number
   kode_skpd: string
   nama_skpd: string
   id_sub_skpd: number
   kode_sub_skpd: string
   nama_sub_skpd: string
   id_urusan: number
   id_bidang_urusan: number
   kode_bidang_urusan: string
   nama_bidang_urusan: string
   id_program: number
   kode_program: string
   nama_program: string
   id_giat: number
   kode_giat: string
   nama_giat: string
   id_sub_giat: number
   kode_sub_giat: string
   nama_sub_giat: string
   nilai: number
   nilai_rak: number
   status: number
   rak_belum_sesuai: number
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

// LOKAL

export const syncRakBlSubGiat = async (data: RakUncheckedCreateInput[]) => {
   return await apiFetcher.put<ResponseApi>(`api/keuangan/rak`, data)
}
export const syncRakBlSkpd = async (data: RakSkpdUncheckedCreateInput[]) => {
   return await apiFetcher.put<ResponseApi>(`api/keuangan/rak/skpd`, data)
}

interface RakByJadwal {
   bulan_1: number
   bulan_2: number
   bulan_3: number
   bulan_4: number
   bulan_5: number
   bulan_6: number
   bulan_7: number
   bulan_8: number
   bulan_9: number
   bulan_10: number
   bulan_11: number
   bulan_12: number
   kode_sub_skpd: string
   kode_program: string
   kode_giat: string
   kode_sub_giat: string
   kode_akun: string
}

export const getRakBlByJadwal = async (
   params: Partial<ParamsRakBlSkpdSipdPeta> & { jadwal_anggaran_id: string }
) => {
   return await apiFetcher
      .get<ResponseApi<RakByJadwal[]>>('api/keuangan/rak/get-by-jadwal', {
         params,
      })
      ?.then((res) => res.data)
}

export const getRakSkpdBlBySkpd = async (params: {
   jadwal_anggaran_id: string
   id_skpd: number
}) => {
   return await apiFetcher
      .get<ResponseApi<RakSkpd>>('api/keuangan/rak/skpd/get-by-jadwal', {
         params,
      })
      ?.then((res) => res.data)
}

// OTHER
