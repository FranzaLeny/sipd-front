// API POST TO SIPD
export type Payload<T extends keyof PayloadResponsePostSipd> = PayloadResponsePostSipd[T]['payload']
export type Response<T extends keyof PayloadResponsePostSipd> =
   PayloadResponsePostSipd[T]['response']

export type DefaultPayload<T extends keyof PayloadResponsePostSipd> = Partial<{
   [K in keyof PayloadResponsePostSipd[T]['payload']]: PayloadResponsePostSipd[T]['payload'][K]
}>

export type ListSipdPost = {
   [K in keyof PayloadResponsePostSipd]: {
      url: string
      defaultPayload: DefaultPayload<K>
      urlParam?: Array<keyof Payload<K>>
   }
}

export type PostUrlKey = keyof PayloadResponsePostSipd
// DEFAULT_VALUE=

const ID_DAERAH = Number(process.env.NEXT_PUBLIC_SIPD_ID_DAERAH || 0)
const ID_UNIT = Number(process.env.NEXT_PUBLIC_SIPD_ID_UNIT || 0)
const TAHUN = Number(process.env.NEXT_PUBLIC_SIPD_TAHUN || 0)

export type PayloadResponsePostSipd = {
   // Master
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

   // RENJA
   listJadwalRenja: {
      payload: ListJadwalAnggranSipdPayload
      response: ListJadwalAnggranSipdResponse
   }
   jadwalRenjaAktif: {
      payload: JadwalAnggranCekAktifSipdPayload & { is_anggaran?: 0 }
      response: JadwalAnggranCekAktifSipdResponse
   }
   listDataLampiranLaporan: {
      payload: ListDataLampiranLaporanSipdPayload
      response: ListDataLampiranLaporanSipdResponse
   }

   //Penganggaran
   listSetupUnit: {
      payload: ListSetupUnitSipdPayload
      response: ListSetupUnitSipdResponse
   }
   listJadwalAnggaran: {
      payload: ListJadwalAnggranSipdPayload
      response: ListJadwalAnggranSipdResponse
   }
   jadwalAnggaranAktif: {
      payload: JadwalAnggranCekAktifSipdPayload
      response: JadwalAnggranCekAktifSipdResponse
   }
   listBelanjaSkpd: {
      payload: ListBelanjaSkpdSipdPayload
      response: ListBelanjaSkpdSipdResponse
   }
   listBlSubGiatAktif: {
      payload: ListBlSubGiatAktifSipdPayload
      response: ListBlSubGiatAktifSipdResponse
   }
   listBlGiatSkpd: {
      payload: ListBySkpdPayload
      response: BlGiatDaerahSipdResponse
   }
   blGiat: {
      payload: BlGiatSipdPayload
      response: BlGiatSipdResponse
   }
   listCapaianBlGiatByGiat: {
      payload: ListCapaianBlGiatByGiatSipdPayload
      response: ListCapaianBlGiatByGiatSipdResponse
   }
   listCapaianBlGiatDaerah: {
      payload: ListBySkpdPayload
      response: ListCapaianBlGiatByGiatSipdResponse
   }
   listOutputBlGiatByGiat: {
      payload: ListOutputBlGiatByGiatSipdPayload
      response: ListOutputBlGiatByGiatSipdResponse
   }
   listOutputBlGiatDaerah: {
      payload: ListBySkpdPayload
      response: ListOutputBlGiatByGiatSipdResponse
   }
   listHasilBlGiatByGiat: {
      payload: ListHasilBlGiatByGiatSipdPayload
      response: ListHasilBlGiatByGiatSipdResponse
   }
   listHasilBlGiatDaerah: {
      payload: ListBySkpdPayload
      response: ListHasilBlGiatByGiatSipdResponse
   }
   listLabelBlGiatDaerah: {
      payload: ListLabelBlGiatDaerahSipdPayload
      response: ListLabelBlGiatDaerahSipdResponse
   }
   listBlSubGiatBySubSkpd: {
      payload: ListBlSubGiatBySubSkpdSipdPayload
      response: BlSubGiatSipdResponse
   }
   blSubGiat: {
      payload: BlSubGiatSipdPayload
      response: BlSubGiatSipdResponse
   }
   blSubGiatBySkpd: {
      payload: BlSubGiatBySkpdSipdPayload
      response: BlSubGiatBySkpdSipdResponse
   }
   listDanaBlSubGiat: {
      payload: ListDanaBlSubGiatSipdPayload
      response: ListDanaBlSubGiatSipdResponse
   }
   listLabelBlSubGiat: {
      payload: ListLabelBlSubGiatSipdPayload
      response: ListLabelBlSubGiatSipdResponse
   }
   listLokasiBlSubGiat: {
      payload: ListLokasiBlSubGiatSipdPayload
      response: ListLokasiBlSubGiatSipdResponse
   }
   listOutputBlSubGiat: {
      payload: ListOutputBlSubGiatSipdPayload
      response: ListOutputBlSubGiatSipdResponsed
   }
   listTagBlSubGiat: {
      payload: ListTagBlSubGiatSipdPayload
      response: ListTagBlSubGiatSipdResponse
   }
   // Rincian
   listRinciBlSubGiat: {
      payload: ListRinciBlSubGiatSipdPayload
      response: ListRinciBlSubGiatSipdResponse
   }
   listRinciBlSubGiatBySkpd: {
      payload: ListRinciBlSubGiatBySkpdSipdPayload
      response: ListRinciBlSubGiatBySkpdSipdResponse
   }
   listRinciBlSubGiatBySbl: {
      payload: ListRinciBlSubGiatBySubBlSipdPayload
      response: ListRinciBlSubGiatBySubBlSipdResponse
   }
   listSubsRinciBlSubGiat: {
      payload: ListSubsRinciBlSubGiatSipdPayload
      response: ListSubsRinciBlSubGiatSipdResponse
   }
   viewRinciBlSubGiat: {
      payload: RinciBlSubGiatSipdPayload
      response: RinciBlSubGiatSipdResponse
   }
   listSubsRinciBlSubGiatByIdSbl: {
      payload: ListSubsRinciBlSubGiatByIdSblSipdPayload
      response: ListSubsRinciBlSubGiatByIdSblSipdResponse
   }
   subsRinciBlSubGiat: {
      payload: SubsRinciBlSubGiatSipdPayload
      response: SubsRinciBlSubGiatSipdResponse
   }
   listSubsRinciBlSubGiatByIdList: {
      payload: ListSubsRinciBlSubGiatByIdListSipdPayload
      response: ListSubsRinciBlSubGiatByIdListSipdResponse
   }
   listKetRinciBlSubGiatBySbl: {
      payload: ListKetRinciBlSubGiatBySblSipdPayload
      response: ListKetRinciBlSubGiatBySblSipdResponse
   }
   listKetRinciBlSubGiatByDaerah: {
      payload: ListKetRinciBlSubGiatByDaerahSipdPayload
      response: ListKetRinciBlSubGiatByDaerahSipdResponse
   }

   listKetRinciBlSubGiatByIdList: {
      payload: ListKetRinciBlSubGiatByIdListSipdPayload
      response: ListKetRinciBlSubGiatByIdListSipdResponse
   }

   addKetRinciBlSubGiat: {
      payload: AddKetRinciBlSubGiatSipdPayload
      response: AddKetRinciBlSubGiatSipdResponse
   }
   listPendapatan: {
      payload: ListPendapatanSkpdSipdPayload
      response: ListPendapatanSkpdSipdResponse
   }
   listPendapatanByUnit: {
      payload: ListPendapatanByUnitSipdPayload
      response: ListPendapatanByUnitSipdResponse
   }
   listDataLampiranRKA: {
      payload: ListSubGiatRkaSipdPayolad
      response: ListSubGiatRkaResponse
   }
   listDataRincianBelanjaSubKegiatan: {
      payload: RkaSubGiatSipdPayload
      response: RkaSubGiatSipdResponse
   }
   rkaRekapitulasiBelanjaSkpd: {
      payload: RkaBlSkpdSipdPayload
      response: RkaBlSkpdSipdResponse
   }
   rkaBelanjaSkpd: {
      payload: RkaSkpdSipdPayload
      response: RkaSkpdSipdResponse
   }
   rkaPendapatanSkpd: {
      payload: RkaPendapatanSkpdSipdPayload
      response: RkaPendapatanSkpdSipdResponse
   }
   // Laporan Perubahan
   rkaBelanjaSkpdPergeseran: {
      payload: RkaPergeseranSkpdSipdPayload
      response: RkaPergeseranSkpdSipdResponse
   }
   rkaPendapatanSkpdPergeseran: {
      payload: RkaPendapatanPergeseranSkpdSipdPayload
      response: RkaPendapatanPergeseranSkpdSipdResponse
   }
   rkaRekapitulasiBelanjaSkpdPergeseran: {
      payload: RkaBlPergeseranSkpdSipdPayload
      response: RkaBlPergeseranSkpdSipdResponse
   }
   listDataLampiranRKAPergeseran: {
      payload: ListDataLampiranRKAPergeseranPayload
      response: ListDataLampiranRKAPergeseranResponse
   }
   listDataRincianBelanjaSubKegiatanPergeseran: {
      payload: RkaSubGiatPergeseranSipdPayload
      response: RkaSubGiatPergeseranSipdResponse
   }
}

export const listSipdPost: ListSipdPost = {
   //Master
   listTahapan: {
      url: 'api/master/tahapan/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         length: 10,
         start: 0,
      },
   },
   listBidangUrusan: {
      url: 'api/master/bidang_urusan/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         length: 10,
         start: 0,
      },
   },
   akun: {
      url: 'api/master/akun/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         length: 10,
         start: 0,
      },
   },
   listSumberDana: {
      url: 'api/master/sumber_dana/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         length: 10,
         start: 0,
      },
   },
   listSatuan: {
      url: 'api/master/satuan/list',
      defaultPayload: {
         length: 1000,
      },
   },
   listStandarHarga: {
      url: 'api/master/d_komponen/listAll', // 'api/master/d_komponen/listAll
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
      url: 'api/master/d_komponen/listRekening', // 'api/master/d_komponen/listAll
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
      },
   },
   listStandarHargaByTipeAkun: {
      url: 'api/master/d_komponen/list_komponen_for_akun',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         tipe: 'SSH',
      },
   },
   listStandarHargaByAkun: {
      url: 'api/master/d_komponen/find_komponen_for_akun',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         'search[value]': '',
         length: 1000,
      },
   },
   standarHargaExportExcel: {
      url: 'api/master/d_komponen/export_excel',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         tipe: 'SSH',
         kelompok: 1,
      },
   },
   listSkpd: {
      url: 'api/master/skpd/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         length: 100000,
         start: 0,
      },
   },
   listNewSkpd: {
      url: 'api/master/skpd/listNew',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         length: 100000,
         start: 0,
      },
   },
   listAllSkpd: {
      url: 'api/master/skpd/listAll',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   // LOKASI
   listProvinsi: {
      url: 'api/master/provinsi/findlistpusat',
      defaultPayload: {
         tipe: 'prov',
      },
   },
   listKabKotaByProv: {
      url: 'api/master/kabkot/findlist',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
      },
   },
   listKecamatanByKabKota: {
      url: 'api/master/kecamatan/list_by_kotkab_and_tahun',
      defaultPayload: {
         tahun: TAHUN,
         length: 10000,
      },
   },
   listDesaKelurahanByKecamatan: {
      url: 'api/master/kelurahan/list_by_kecamatan_and_tahun',
      defaultPayload: {
         tahun: TAHUN,
         length: 10000,
      },
   },

   //RENJA
   listJadwalRenja: {
      url: 'api/jadwal/renja_jadwal/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },

   jadwalRenjaAktif: {
      url: 'api/jadwal/renja_jadwal/cek_aktif',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         is_anggaran: 0,
      },
   },
   // Laporan
   listDataLampiranLaporan: {
      url: 'api/renja/renja_laporan/listDataLampiranLaporan',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   // RKA
   // Penganggaran
   listSetupUnit: {
      url: 'api/renja/setup_unit/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   listJadwalAnggaran: {
      url: 'api/jadwal/anggaran_jadwal/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   jadwalAnggaranAktif: {
      url: 'api/jadwal/anggaran_jadwal/cek_aktif',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         is_anggaran: 1,
      },
   },
   listBelanjaSkpd: {
      url: 'api/renja/sub_bl/list_skpd',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         id_unit: ID_UNIT,
         id_level: 5,
         search: '',
         limit: 1000,
         offset: 0,
      },
   },
   listBlSubGiatAktif: {
      url: 'api/renja/sub_bl/list_belanja_by_tahun_daerah_unit',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         id_unit: ID_UNIT,
         is_prop: 0,
      },
   },
   listBlSubGiatBySubSkpd: {
      url: 'api/renja/sub_bl/list_by_sub_skpd',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         id_skpd: ID_UNIT,
         id_sub_skpd: ID_UNIT,
      },
   },
   blGiat: {
      url: 'api/renja/bl/load_data',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   listBlGiatSkpd: {
      url: 'api/renja/bl/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         id_skpd: ID_UNIT,
         id_unit: ID_UNIT,
      },
   },
   listCapaianBlGiatByGiat: {
      url: 'api/renja/capaian_bl/load_data',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   listCapaianBlGiatDaerah: {
      url: 'api/renja/capaian_bl/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         id_skpd: ID_UNIT,
         id_unit: ID_UNIT,
      },
   },
   listOutputBlGiatByGiat: {
      url: 'api/renja/output_giat/load_data',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   listOutputBlGiatDaerah: {
      url: 'api/renja/output_giat/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         id_skpd: ID_UNIT,
         id_unit: ID_UNIT,
      },
   },
   listHasilBlGiatByGiat: {
      url: 'api/renja/hasil_bl/load_data',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   listHasilBlGiatDaerah: {
      url: 'api/renja/hasil_bl/listAll',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         id_skpd: ID_UNIT,
         id_unit: ID_UNIT,
      },
   },
   listLabelBlGiatDaerah: {
      url: 'api/master/label_prov/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         start: 0,
         length: 1000,
         tahun: TAHUN,
      },
   },
   blSubGiat: {
      url: 'api/renja/sub_bl/view',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
      urlParam: ['id_sub_bl'],
   },
   blSubGiatBySkpd: {
      url: 'api/renja/sub_bl/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         id_unit: ID_UNIT,
         id_skpd: ID_UNIT,
      },
   },
   listDanaBlSubGiat: {
      url: 'api/renja/dana_sub_bl/get_by_id_sub_bl',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   listLabelBlSubGiat: {
      url: 'api/renja/label_bl/get_by_id_sub_bl',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   listLokasiBlSubGiat: {
      url: 'api/renja/detil_lokasi_bl/get_by_id_sub_bl',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   listOutputBlSubGiat: {
      url: 'api/renja/output_bl/get_by_id_sub_bl',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   listTagBlSubGiat: {
      url: 'api/renja/tag_bl/get_by_id_sub_bl',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   // Rinci
   listRinciBlSubGiatBySkpd: {
      url: 'api/renja/rinci_sub_bl/list_by_id_skpd',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         id_skpd: ID_UNIT,
      },
   },
   listRinciBlSubGiat: {
      url: 'api/renja/rinci_sub_bl/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   listRinciBlSubGiatBySbl: {
      url: 'api/renja/rinci_sub_bl/get_by_id_sub_bl',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   viewRinciBlSubGiat: {
      url: 'api/renja/rinci_sub_bl/view',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
      urlParam: ['id_rinci_sub_bl'],
   },
   // subs rinci
   listSubsRinciBlSubGiatByIdSbl: {
      url: 'api/renja/subs_sub_bl/find_by_id_sub_bl',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         is_paket: 2,
      },
   },
   listSubsRinciBlSubGiat: {
      url: 'api/renja/subs_sub_bl/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   listSubsRinciBlSubGiatByIdList: {
      url: 'api/renja/subs_sub_bl/find_by_id_list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   subsRinciBlSubGiat: {
      url: 'api/renja/subs_sub_bl/view',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
      urlParam: ['id_subs_sub_bl'],
   },
   // ket rinci
   listKetRinciBlSubGiatBySbl: {
      url: 'api/renja/ket_sub_bl/find',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         id_unit: ID_UNIT,
         id_sub_giat: 18497,
         kondisi_rincian: true,
         length: 100000,
      },
   },
   listKetRinciBlSubGiatByDaerah: {
      url: 'api/renja/ket_sub_bl/list',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         id_unit: ID_UNIT,
      },
   },

   listKetRinciBlSubGiatByIdList: {
      url: 'api/renja/ket_sub_bl/find_by_id_list',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
      },
   },
   addKetRinciBlSubGiat: {
      url: 'api/renja/ket_sub_bl/add',
      defaultPayload: {
         id_daerah: ID_DAERAH,
      },
   },
   listPendapatan: {
      url: 'api/renja/pendapatan/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         id_unit: ID_UNIT,
         model: 'skpd',
         length: 100000,
         start: 0,
         tahun: TAHUN,
         'order[0][column]': 0,
         'order[0][dir]': '',
      },
   },
   listPendapatanByUnit: {
      url: 'api/renja/pendapatan/listByIdUnit',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         id_unit: ID_UNIT,
      },
   },
   // Laporran
   listDataLampiranRKA: {
      url: 'api/renja/renja_laporan/listDataLampiranRKA',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         is_prop: 0,
         id_sub_giat: 18508,
      },
   },
   listDataRincianBelanjaSubKegiatan: {
      url: 'api/renja/renja_laporan/listDataRincianBelanjaSubKegiatan',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         id_unit: ID_UNIT,
         id_sub_skpd: ID_UNIT,
      },
   },
   rkaRekapitulasiBelanjaSkpd: {
      url: 'api/renja/laporan/rkaRekapitulasiBelanjaSkpd',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         id_skpd: ID_UNIT,
      },
   },
   rkaBelanjaSkpd: {
      url: 'api/renja/laporan/rkaBelanjaSkpd',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         id_skpd: ID_UNIT,
      },
   },
   rkaPendapatanSkpd: {
      url: 'api/renja/laporan/rkaPendapatanSkpd',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         id_skpd: ID_UNIT,
      },
   },
   // Laporan Perubahan
   rkaBelanjaSkpdPergeseran: {
      url: 'api/renja/laporan/rkaBelanjaSkpdPergeseran',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         id_skpd: ID_UNIT,
      },
   },
   rkaPendapatanSkpdPergeseran: {
      url: 'api/renja/laporan/rkaPendapatanSkpdPergeseran',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         id_skpd: ID_UNIT,
      },
   },
   rkaRekapitulasiBelanjaSkpdPergeseran: {
      url: 'api/renja/laporan/rkaRekapitulasiBelanjaSkpdPergeseran',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         id_skpd: ID_UNIT,
      },
   },
   listDataLampiranRKAPergeseran: {
      url: 'api/renja/renja_laporan/listDataLampiranRKAPergeseran',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
      },
   },
   listDataRincianBelanjaSubKegiatanPergeseran: {
      url: 'api/renja/renja_laporan/listDataRincianBelanjaSubKegiatanPergeseran',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
      },
   },
}

// API GET FROM SIPD

//TODO URL SIPD-RI GET api/master/label_prov/view/70/TAHUN/418
//TODO URL SIPD-RI GET api/master/label_kokab/view/678/TAHUN/ID_DAERAH

export type PayloadGet<T extends keyof PayloadResponseGetSipd> =
   PayloadResponseGetSipd[T]['payload']

export type ResponseGet<T extends keyof PayloadResponseGetSipd> =
   PayloadResponseGetSipd[T]['response']

export type DefaultPayloadGet<T extends keyof PayloadResponseGetSipd> = Partial<{
   [K in keyof PayloadResponseGetSipd[T]['payload']]: PayloadResponseGetSipd[T]['payload'][K]
}>
export type GetUrlKey = keyof PayloadResponseGetSipd
export type ListSipdGet = {
   [K in keyof PayloadResponseGetSipd]: {
      url: string
      key_for_params?: Array<keyof PayloadGet<K>> //untuk atur urutan dalam url params
      defaultPayload: DefaultPayloadGet<K>
   }
}
export type PayloadResponseGetSipd = {
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

export const listSipdGet: ListSipdGet = {
   // https://sipd-ri.kemendagri.go.id/api/master/skpd/view/ID_UNIT/TAHUN/ID_DAERAH
   viewSkpd: {
      url: 'api/master/skpd/view',
      key_for_params: ['id_skpd', 'tahun', 'id_daerah'],
      defaultPayload: {
         id_skpd: ID_UNIT,
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
      },
   },
   listSubRkpd: {
      url: 'api/master/sub_rkpd/listall',
      defaultPayload: {},
   },
   listTahapanPlan: {
      url: 'api/master/tahapan/list/plan',
      defaultPayload: {},
   },
}
