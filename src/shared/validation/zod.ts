import i18next from 'i18next'
import { z } from 'zod'
import { zodI18nMap } from 'zod-i18n-map'

// Import your language translation files
import translation from './id.json'

i18next.init({
   lng: 'id',
   resources: {
      id: { zod: translation },
   },
})
z.setErrorMap(zodI18nMap)

// export configured zod instance

export const reqErr = {
   required_error: 'Harus diisi',
}

export const strErr = {
   required_error: 'Harus diisi',
   invalid_type_error: 'Harus berupa text',
}

export const numErr = {
   required_error: 'Harus diisi',
   invalid_type_error: 'Harus berupa angka',
}

export const MaxBatchSchema = z.coerce.number().min(1).max(2000).default(100)

export const KomponenTipeSchema = z.enum(['ASB', 'HSPK', 'SBU', 'SSH'])

export const KomponenTipeArraySchema = z.array(z.enum(['ASB', 'HSPK', 'SBU', 'SSH'])).min(1)

export * from './perencanaan/bl'
export * from './perencanaan/bl-giat'
export * from './perencanaan/bl-subgiat'
export * from './perencanaan/data-perencanaan'
export * from './perencanaan/pendapatan'
export * from './perencanaan/tapd'
export * from './user'
export { z }
