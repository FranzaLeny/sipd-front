import type { TypeGetSipdUrls, TypePostSipdUrls } from '../types'
import * as lokasi from './lokasi'
import * as master from './master'

export type TypesPost = lokasi.TypesPost & master.TypesPost

export const postUrls: TypePostSipdUrls<TypesPost> = {
   ...lokasi.postUrls,
   ...master.postUrls,
}

export type TypesGet = master.TypesGet

export const getUrls: TypeGetSipdUrls<TypesGet> = {
   ...master.getUrls,
}
