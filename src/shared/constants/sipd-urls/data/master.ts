import { TypeGetSipdUrls, TypePostSipdUrls } from '../types'

const ID_DAERAH = Number(process.env.NEXT_PUBLIC_SIPD_ID_DAERAH || 0)
const ID_UNIT = Number(process.env.NEXT_PUBLIC_SIPD_ID_UNIT || 0)
const TAHUN = Number(process.env.NEXT_PUBLIC_SIPD_TAHUN || 0)

export type TypesPost = {
   listTahapan: {
      payload: ListTahapanSipdPayload
      response: ListTahapanSipdResponse
   }
   listBidangUrusan: {
      payload: ListBidangUrusanSipdPayload
      response: ListBidangUrusanSipdResponse
   }
   listNewSkpd: {
      payload: SkpdListSipdPayload
      response: SkpdListSipdResponse
   }
   listSkpd: {
      payload: SkpdListSipdPayload
      response: SkpdListSipdResponse
   }
   listAllSkpd: {
      payload: SkpdListAllSipdPayload
      response: SkpdListAllSipdResponse
   }
   akun: {
      payload: ListAkunSipdPayload
      response: ListAkunSipdResponse
   }
   listSumberDana: {
      payload: ListSumberDanaSipdPayload
      response: ListSumberDanaSipdResponse
   }
   listSatuan: {
      payload: ListSatuanSipdPayload
      response: ListSatuanSipdResponse
   }
   listStandarHarga: {
      payload: ListStandarHargaSipdPayload
      response: ListStandarHargaSipdResponse
   }
   listAkunStandarHarga: {
      payload: ListAkunStandarHargaSipdPayload
      response: ListAkunStandarHargaSipdResponse
   }
   listStandarHargaByTipeAkun: {
      payload: ListStandarHargaByTipeAkunSipdPayload
      response: ListStandarHargaByTipeAkunSipdResponse
   }
   listStandarHargaByAkun: {
      payload: ListStandarHargaByAkunSipdPayload
      response: ListStandarHargaByAkunSipdResponse
   }
   standarHargaExportExcel: {
      payload: StandarHargaExportExcelSipdPayload
      response: StandarHargaExportExcelSipdResponse
   }
}

export const postUrls: TypePostSipdUrls<TypesPost> = {
   //Master
   listTahapan: {
      url: '/api/master/tahapan/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         length: 10,
         start: 0,
      },
   },
   listBidangUrusan: {
      url: '/api/master/bidang_urusan/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         length: 10,
         start: 0,
      },
   },
   akun: {
      url: '/api/master/akun/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         length: 10,
         start: 0,
      },
   },
   listSumberDana: {
      url: '/api/master/sumber_dana/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         length: 10,
         start: 0,
      },
   },
   listSatuan: {
      url: '/api/master/satuan/list',
      defaultPayload: {
         length: 1000,
      },
   },
   listStandarHarga: {
      url: '/api/master/d_komponen/listAll', // '/api/master/d_komponen/listAll
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         length: 10,
         start: 0,
         kelompok: 1,
         tipe: 'SSH',
      },
   },
   listAkunStandarHarga: {
      url: '/api/master/d_komponen/listRekening', // '/api/master/d_komponen/listAll
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
      },
   },
   listStandarHargaByTipeAkun: {
      url: '/api/master/d_komponen/list_komponen_for_akun',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         tipe: 'SSH',
      },
   },
   listStandarHargaByAkun: {
      url: '/api/master/d_komponen/find_komponen_for_akun',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         'search[value]': '',
         length: 1000,
      },
   },
   standarHargaExportExcel: {
      url: '/api/master/d_komponen/export_excel',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         tipe: 'SSH',
         kelompok: 1,
      },
   },
   listSkpd: {
      url: '/api/master/skpd/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         length: 100000,
         start: 0,
      },
   },
   listNewSkpd: {
      url: '/api/master/skpd/listNew',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         length: 100000,
         start: 0,
      },
   },
   listAllSkpd: {
      url: '/api/master/skpd/listAll',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
}

export type TypesGet = {
   viewSkpd: {
      payload: SkpdViewSipdPayload
      response: SkpdViewSipdResponse
   }
   listSubRkpd: {
      payload: { tahun?: number }
      response: ListSubRkpdSipdResponse
   }
   listTahapanPlan: {
      payload: ListTahapanPlanSipdPayload
      response: ListTahapanPlanSipdResponse
   }
}

export const getUrls: TypeGetSipdUrls<TypesGet> = {
   // https://sipd-ri.kemendagri.go.id/api/master/skpd/view/ID_UNIT/TAHUN/ID_DAERAH
   viewSkpd: {
      url: '/api/master/skpd/view',
      key_for_params: ['id_skpd', 'tahun', 'id_daerah'],
      defaultPayload: {
         id_skpd: ID_UNIT,
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
      },
   },
   listSubRkpd: {
      url: '/api/master/sub_rkpd/listall',
      defaultPayload: {},
   },
   listTahapanPlan: {
      url: '/api/master/tahapan/list/plan',
      defaultPayload: {},
   },
}
