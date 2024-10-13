import http from 'http'
import https from 'https'
import axios from '@custom-axios/index'
import { decodeJwt } from 'jose'

const AXIOS_OPTIONS = {
   httpsAgent: new https.Agent({ keepAlive: true }),
   httpAgent: new http.Agent({ keepAlive: true }),
   baseURL: process.env.NEXT_PUBLIC_API_SIPD_PETA_URL,
}
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
      .post<LoginSipdPetaResponse>('auth/auth/login', credentials, AXIOS_OPTIONS)
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
         console.error('signInSipdPeta error', e?.request?.headers)
         return Promise.reject({ message: e?.message, error: e?.response?.data })
      })
}

export const preLoginSipdPeta = async (credentials: PreLoginSipdPetaPayload) => {
   return await axios
      .post<PreLoginSipdPetaResponse>('auth/auth/pre-login', credentials, AXIOS_OPTIONS)
      .catch((e: any) => {
         console.error('preLoginSipdPeta error', e?.request?.headers)
         throw { message: e?.message, error: e?.response?.data }
      })
}
interface CaptchaSipdPeta {
   audio: string
   base64: string
   id: string
}

export const getCaptchaSipdPeta = async () => {
   return await axios.get<CaptchaSipdPeta>('auth/captcha/new', AXIOS_OPTIONS).catch((e: any) => {
      console.error('getCaptchaSipdPeta error', e?.request?.headers)
      throw { message: e?.message, error: e?.response?.data }
   })
}
