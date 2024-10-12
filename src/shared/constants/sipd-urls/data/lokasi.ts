import type { TypePostSipdUrls } from '../types'

const ID_DAERAH = Number(process.env.NEXT_PUBLIC_SIPD_ID_DAERAH || 0)
const ID_UNIT = Number(process.env.NEXT_PUBLIC_SIPD_ID_UNIT || 0)
const TAHUN = Number(process.env.NEXT_PUBLIC_SIPD_TAHUN || 0)

export type TypesPost = {
   // LOKASI
   listProvinsi: {
      payload: ListProvinsiSipdPayload
      response: ListProvinsiSipdResponse
   }
   listKabKotaByProv: {
      payload: ListKabKotaByProvSipdPayload
      response: ListKabKotaByProvSipdResponse
   }
   listKecamatanByKabKota: {
      payload: ListKecamatanByKabKotaSipdPayload
      response: ListKecamatanByKabKotaSipdResponse
   }
   listDesaKelurahanByKecamatan: {
      payload: ListKelurahanByKecamatanSipdPayload
      response: ListKelurahanByKecamatanSipdResponse
   }
}

export const postUrls: TypePostSipdUrls<TypesPost> = {
   // LOKASI
   listProvinsi: {
      url: '/api/master/provinsi/findlistpusat',
      defaultPayload: {
         tipe: 'prov',
      },
   },
   listKabKotaByProv: {
      url: '/api/master/kabkot/findlist',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
      },
   },
   listKecamatanByKabKota: {
      url: '/api/master/kecamatan/list_by_kotkab_and_tahun',
      defaultPayload: {
         tahun: TAHUN,
         length: 10000,
      },
   },
   listDesaKelurahanByKecamatan: {
      url: '/api/master/kelurahan/list_by_kecamatan_and_tahun',
      defaultPayload: {
         tahun: TAHUN,
         length: 10000,
      },
   },
}
