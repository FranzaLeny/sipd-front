import * as data from './data'
import * as penganggaran from './penganggaran'
import * as rkpd from './rkpd'
import { TypeGetSipdUrls, TypePostSipdUrls } from './types'

export type UrlGetKeys = keyof PayloadResponseGetSipd
export type UrlPostKeys = keyof PayloadResponsePostSipd
export type DefaultPayloadGet<T extends keyof PayloadResponseGetSipd> = Partial<{
   [K in keyof PayloadResponseGetSipd[T]['payload']]: PayloadResponseGetSipd[T]['payload'][K]
}>
export type DefaultPayload<T extends keyof PayloadResponsePostSipd> = Partial<{
   [K in keyof PayloadResponsePostSipd[T]['payload']]: PayloadResponsePostSipd[T]['payload'][K]
}>
export type Payload<T extends keyof PayloadResponsePostSipd> = PayloadResponsePostSipd[T]['payload']

export type PayloadGet<T extends keyof PayloadResponseGetSipd> =
   PayloadResponseGetSipd[T]['payload']

export type PayloadResponsePostSipd = data.TypesPost & penganggaran.TypesPost & rkpd.TypesPost

export type PayloadResponseGetSipd = data.TypesGet

export const listSipdPost: TypePostSipdUrls<PayloadResponsePostSipd> = {
   ...data.postUrls,
   ...penganggaran.postUrls,
   ...rkpd.postUrls,
}

export const listSipdGet: TypeGetSipdUrls<PayloadResponseGetSipd> = {
   ...data.getUrls,
}
