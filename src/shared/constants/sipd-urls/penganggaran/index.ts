import { TypePostSipdUrls } from '../types'
import * as kegiatan from './kegiatan'
import * as laporan from './laporan'
import * as pembiayaan from './pembiayaan'
import * as pendapatan from './pendapatan'
import * as rincian from './rincian'
import * as skpd from './skpd'
import * as subKegiatan from './sub-kegiatan'

export type TypesPost = skpd.TypesPost &
   kegiatan.TypesPost &
   rincian.TypesPost &
   kegiatan.TypesPost &
   subKegiatan.TypesPost &
   pendapatan.TypesPost &
   laporan.TypesPost &
   pembiayaan.TypesPost

export const postUrls: TypePostSipdUrls<TypesPost> = {
   ...skpd.postUrls,
   ...kegiatan.postUrls,
   ...rincian.postUrls,
   ...subKegiatan.postUrls,
   ...pendapatan.postUrls,
   ...laporan.postUrls,
   ...pembiayaan.postUrls,
}
