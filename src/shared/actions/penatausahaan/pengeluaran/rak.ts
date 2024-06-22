import { getBlSubGiatByJadwalUnit } from '@actions/perencanaan/rka/bl-sub-giat'
import apiFetcher from '@custom-axios/api-fetcher'
import axios from '@custom-axios/peta-fetcher'
import {
   RakSkpd,
   RakUncheckedCreateInput,
   RakUncheckedCreateInputSchema,
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

interface ParamsRakBlSkpdSipdPeta {
   id_unit: number
   id_skpd: number
   id_sub_skpd: number
   id_urusan: number
   id_bidang_urusan: number
   id_program: number
   id_giat: number
   id_sub_giat: number
}

interface ResponseRakBlSubGiatSipdPeta {
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
interface ResponseLaporanRakBlSubGiatSipdPeta {
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
export const getRakSkpSipdPeta = async (params: { page: number; limit: number }) => {
   return await axios.get<ResponseRakSpd[]>(`referensi/strict/dpa/penarikan/belanja`, { params })
}

export const getRakSkpdSipdPetaBySkpd = async (idSkpd: number) => {
   const data = await getRakSkpSipdPeta({ page: 1, limit: 100 })?.then((res) => {
      console.log({ res })

      return res?.find((d) => d.id_skpd === idSkpd)
   })
   console.log({ data })

   if (data) {
      return data
   } else {
      throw new Error('Data Rak SKPD tidak ditemukan')
   }
}

// LOKAL

export const syncLaporanRakBlSubGiatSipdPeta = async (data: RakUncheckedCreateInput[]) => {
   return await apiFetcher.put<ResponseLaporanRakBlSubGiatSipdPeta>(`api/keuangan/rak`, data)
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

type BackUpRakBlSubGiatSipdPetaParams = {
   tahun?: number
   id_daerah?: number
   id_skpd?: number
   id_unit: number
   jadwal_anggaran_id: string
}

export const backUpRakBlSubGiatSipdPeta = async (params: BackUpRakBlSubGiatSipdPetaParams) => {
   try {
      const data: RakUncheckedCreateInput[] = []
      const subGiats = await getBlSubGiatByJadwalUnit(params)
      for await (const sbl of subGiats) {
         const {
            id: bl_sub_giat_id,
            bl_sub_giat_aktif_id,
            jadwal_anggaran_id,
            jadwal_anggaran_murni_id,
            id_bidang_urusan,
            id_giat,
            id_program,
            id_skpd,
            id_sub_giat,
            id_sub_skpd,
            id_unit,
            id_urusan,
         } = sbl
         const laporan = await getRakBlSubGiatSipdPeta({
            id_bidang_urusan,
            id_giat,
            id_program,
            id_skpd,
            id_sub_giat,
            id_sub_skpd,
            id_unit,
            id_urusan,
         }).then((res) =>
            res?.map((d) => {
               const temp = Object.keys(d)?.reduce((acc: any, curr) => {
                  if (isNaN(Number(curr))) {
                     acc[curr] = d[curr as keyof ResponseRakBlSubGiatSipdPeta]
                  } else {
                     acc[`bulan_${curr}`] = d[curr as keyof ResponseRakBlSubGiatSipdPeta]
                  }
                  return acc
               }, {})
               data.push({
                  ...temp,
                  bl_sub_giat_aktif_id,
                  jadwal_anggaran_id,
                  jadwal_anggaran_murni_id,
                  bl_sub_giat_id,
               })
            })
         )
         if (!laporan.length) continue
      }
      const validaData = RakUncheckedCreateInputSchema.array().min(1).parse(data)
      const result = await syncLaporanRakBlSubGiatSipdPeta(validaData)
      console.log(result)
   } catch (error: any) {
      throw new Error(error?.message ?? 'Gagal back up data rak')
   }
}
