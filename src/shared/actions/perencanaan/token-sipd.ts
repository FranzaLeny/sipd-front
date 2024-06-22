import { z } from '@zod'
import { MD5, SHA1 } from 'crypto-js'
import { decodeJwt } from 'jose'
import { ZodError } from 'zod'

type GenerateKeysSipdParams = {
   id_daerah: number
   id_level: number
   id_user: number
   userAgent: string
}

export function generateKeysSipd(params: GenerateKeysSipdParams) {
   const { id_daerah, id_level, id_user, userAgent } = params
   const user_agent = userAgent ?? navigator.userAgent
   const key = {
      sidx: encrypt(id_user.toString()),
      sidl: encrypt(id_level.toString()),
      sidd: encrypt(id_daerah.toString()),
      idd: encrypt(id_daerah.toString()),
   }
   const secret_key = encrypt(JSON.stringify(key))
   const token_key_1 =
      SHA1(MD5(user_agent).toString()).toString() + MD5('kdx' + id_daerah).toString()
   const token_key_2 = SHA1('T#2Kc&us' + MD5('mDx' + id_daerah).toString()).toString()
   return { secret_key, token_key_1, token_key_2 }
}

function generateRandomString(length: number) {
   let result = ''
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
   const charactersLength = characters.length

   for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
   }

   return result
}

function generateRandomNumber(maxValue: number) {
   return Math.floor(Math.random() * maxValue)
}

function encrypt(data: string) {
   return btoa(btoa(data))
}

export function generateApiKey(
   params: GenerateKeysSipdParams & { userAgent: string; tahun: number }
): string {
   const { id_daerah, id_level, id_user, userAgent, tahun } = params
   const keys = generateKeysSipd({ id_daerah, id_level, id_user, userAgent })
   const timestamp = Math.ceil(Date.now() / 1000) + 30
   const securityKey = [
      id_daerah,
      tahun,
      btoa(timestamp.toString()),
      generateRandomString(10),
      generateRandomNumber(1e5),
   ].join('|')

   const apiKey = JSON.stringify({
      token: generateRandomString(15),
      id_daerah,
      tahun,
      id_app: generateRandomNumber(1e5),
      is_app: 1,
      secret_key: keys.secret_key,
      security_key: securityKey,
      token_key_1: keys.token_key_1,
      token_key_2: keys.token_key_2,
   })

   return encrypt(apiKey)
}

const SipdSessionSchema = z
   .object({
      id_skpd: z.coerce.number(),
      id_user: z.coerce.number(),
      id_daerah: z.coerce.number(),
      id_unit: z.coerce.number(),
      id_level: z.coerce.number().default(0),
      id_prop: z.coerce.number(),
      is_prop: z.coerce.number(),
      tahun: z.coerce.number(),
      roles: z.array(z.string()).nullable().nullish().optional(),
   })
   .strip()

/**
 * Validates the SIPD session for a user.
 *
 * @param {Object} params - The parameters for the validation.
 * @param {User | null} params.user - The user object.
 * @throws {Error} Throws an error if the user is not authorized.
 * @return {SesionSipdValid} The validated SIPD session.
 */
export const validateSipdSession = (params: { user?: User | null } | null) => {
   if (!params || !('user' in params) || !params.user) {
      throw new Error('Unauthorized SIPD-RI')
   }
   const token = params.user.tokens?.find((t) => t.name === 'sipd_ri')?.token
   if (!token) {
      throw new Error('Unauthorized SIPD-RI')
   }

   try {
      const sipdData = decodeJwt(token)
      return SipdSessionSchema.parse({ ...params.user, ...sipdData })
   } catch (error) {
      if (error instanceof ZodError) {
         console.error('Validation error:', error.issues)
      }
      throw new Error('Unauthorized SIPD-RI')
   }
}

export const validateSipdPetaSession = (params: { user?: User | null } | null) => {
   if (!params || !('user' in params) || !params.user) {
      throw new Error('Unauthorized SIPD-PETA')
   }
   const token = params.user.tokens?.find((t) => t.name === 'sipd_peta')?.token
   if (!token) {
      throw new Error('Unauthorized SIPD-PETA')
   }

   try {
      const sipdData = decodeJwt(token)
      return SipdSessionSchema.parse({ ...params.user, ...sipdData })
   } catch (error) {
      if (error instanceof ZodError) {
         console.error('Validation error:', error.issues)
      }
      throw new Error('Unauthorized SIPD-PETA')
   }
}

export const reFillSesionSipd = (
   data: UserByTokenSipd & { id_daerah: number; tahun: number; token: string }
) => {
   const { skpdList, id_daerah, unit, id_prop, is_prop, tahun } = data
   const id_skpd = skpdList ? parseInt(skpdList.split('|')[0], 10) : 0
   const id_unit = unit || 0

   return {
      id_skpd,
      id_daerah,
      id_unit,
      id_prop,
      is_prop,
      tahun,
      roles: ['sipd_ri', 'perencanaan'] as RoleUser[],
   }
}

export type SesionSipdValid = z.infer<typeof SipdSessionSchema>
export type SesionSipd = ReturnType<typeof reFillSesionSipd>
