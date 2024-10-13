'use server'

import http from 'http'
import https from 'https'
import axios from '@custom-axios/index'
import { decodeJwt } from 'jose'

const httpsAgent = new https.Agent({ keepAlive: true })
const httpAgent = new http.Agent({ keepAlive: true })
interface CredentialsSipdPeta {
   id_daerah: number
   id_role: number
   id_skpd: number
   id_pegawai: number
   password: string
   tahun: number
   username: string
   captcha_id: string
   captcha_solution: string
}
interface SessionSipdPeta {
   iss: string
   sub: string
   exp: number
   iat: number
   tahun: number
   id_user: number
   id_daerah: number
   kode_provinsi: string
   id_skpd: number
   id_role: number
   id_pegawai: number
   sub_domain_daerah: string
}
export const signInSipdPeta = async (credentials: CredentialsSipdPeta) => {
   return await axios
      .post<LoginSipdPetaResponse>(
         'https://service.sipd.kemendagri.go.id/auth/auth/login',
         credentials,
         {
            headers: {
               Origin: 'https://sipd.kemendagri.go.id',
            },
         }
      )
      .then(async (res) => {
         try {
            const decode = decodeJwt(res.token) as SessionSipdPeta
            const { exp, iat, ...account } = decode
            return { accountPeta: { account, token: res?.token } }
         } catch (error: any) {
            console.error(error?.message)
            throw { message: 'Proses extrak token gagal' }
         }
      })
      .catch((e: any) => {
         console.log('signInSipdPeta error', e?.request?.headers)
         return Promise.reject({ message: e?.message, error: e?.response?.data })
      })
}

export const preLoginSipdPeta = async (credentials: PreLoginSipdPetaPayload) => {
   return await axios
      .post<PreLoginSipdPetaResponse>(
         'https://service.sipd.kemendagri.go.id/auth/auth/pre-login',
         credentials,
         {
            headers: {
               Origin: 'https://sipd.kemendagri.go.id',
            },
            httpsAgent,
            httpAgent,
         }
      )
      .catch((e: any) => {
         console.log('preLoginSipdPeta error', e?.request?.headers)
         throw { message: e?.message, error: e?.response?.data }
      })
}
interface CaptchaSipdPeta {
   audio: string
   base64: string
   id: string
}

export const getCaptchaSipdPeta = async () => {
   return await axios
      .get<CaptchaSipdPeta>('https://service.sipd.kemendagri.go.id/auth/captcha/new', {
         headers: {
            Origin: 'https://sipd.kemendagri.go.id',
         },
         httpsAgent,
         httpAgent,
      })
      .catch((e: any) => {
         console.log('getCaptchaSipdPeta error', e?.request?.headers)
         throw { message: e?.message, error: e?.response?.data }
      })
}
