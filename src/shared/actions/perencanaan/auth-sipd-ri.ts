'use server'

import https from 'https'
import { generateApiKey, reFillSesionSipd } from '@actions/perencanaan/token-sipd'
import { decodeJwt } from 'jose'
import { Session } from 'next-auth'
import axios from '@shared/custom-axios'
import { signInToUserApiBySipdRi } from '@shared/server-actions/auth-api'

const signInToSipdRi = async (params: SingInToSipdParams) => {
   const { userAgent, ...formData } = params
   try {
      return await axios
         .post<{
            token: string
            refresh_token: string
         }>('/api/auth/auth/login', formData, {
            headers: {
               'User-Agent': userAgent,
               'Content-Type': 'multipart/form-data',
            },
            baseURL: process.env.NEXT_PUBLIC_API_SIPD_URL,
            httpsAgent: new https.Agent({
               rejectUnauthorized: false,
            }),
            withCredentials: false,
         })
         .then((res) => {
            return res
         })
   } catch (error: any) {
      console.error('signInToSipdRi', error?.message)
      throw new Error('Error from fetcher sipd')
   }
}

interface GetUserByTokenParam {
   id_daerah: number
   id_user: number
   id_level: number
   token: string
   userAgent: string
   tahun: number
}

const getUserByTokenFromSipd = async (params: GetUserByTokenParam, retry = 0, maxRetry = 10) => {
   try {
      const { id_daerah, id_user, token, userAgent } = params
      return await axios.get<UserByTokenSipd>('/api/master/user/getuserbytoken', {
         headers: {
            'User-Agent': userAgent,
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + token + '|' + id_daerah + '|' + id_user,
            'X-Api-Key': generateApiKey(params),
         },
         baseURL: process.env.NEXT_PUBLIC_API_SIPD_URL,
         httpsAgent: new https.Agent({
            rejectUnauthorized: false,
         }),

         withCredentials: false,
      })
   } catch (error: any) {
      if (retry <= 10) {
         console.error('getUserByTokenFromSipd retry', retry)
         return await getUserByTokenFromSipd(params, retry + 1, maxRetry)
      }
      console.error('getUserByTokenFromSipd', error?.message)
      throw new Error('Gagal mengambil data user dari sipd', { cause: 'fetcher' })
   }
}
const getSkpdUserFromSipd = async (
   params: GetUserByTokenParam & { id_skpd: number },
   retry = 0,
   maxRetry = 10
) => {
   try {
      const { id_daerah, id_user, token, userAgent, id_skpd, tahun } = params
      return await axios.get<SkpdViewSipdResponse>(
         `/api/master/skpd/view/${id_skpd}/${tahun}/${id_daerah}`,
         {
            headers: {
               'User-Agent': userAgent,
               'Content-Type': 'application/json',
               authorization: 'Bearer ' + token + '|' + id_daerah + '|' + id_user,
               'X-Api-Key': generateApiKey(params),
            },
            baseURL: process.env.NEXT_PUBLIC_API_SIPD_URL,
            httpsAgent: new https.Agent({
               rejectUnauthorized: false,
            }),
            withCredentials: false,
         }
      )
   } catch (error: any) {
      if (retry <= 10) {
         console.error('getSkpdUserFromSipd retry', retry)
         return await getSkpdUserFromSipd(params, retry + 1, maxRetry)
      }
      console.error('getSkpdUserFromSipd', error?.message)
      throw new Error('Gagal mengambil data skpd user dari sipd')
   }
}

type SingInToSipdParams = {
   username: string
   id_daerah: number
   password: string
   tahun: number
   userAgent: string
}

const signInUserToSipdRi = async (params: SingInToSipdParams): Promise<Session['user'] | null> => {
   try {
      const signInResult = await signInToSipdRi(params)
      const accessData = decodeJwt(signInResult.token) as {
         exp: number
         hashed: boolean
         id_daerah: number
         id_level: number
         id_user: number
      }
      if (signInResult.token && accessData) {
         const { id_daerah, id_level, id_user } = accessData
         const userData = await getUserByTokenFromSipd({
            id_daerah,
            id_level,
            id_user,
            tahun: params.tahun,
            token: signInResult.token,
            userAgent: params.userAgent,
         })

         const refilledSession = reFillSesionSipd({
            ...userData,
            tahun: params.tahun,
            id_daerah,
            ...signInResult,
         })

         let { id_prop, id_skpd, id_unit, is_prop } = refilledSession
         if (id_unit) {
            const dataSkpd = await getSkpdUserFromSipd({
               id_daerah,
               id_user,
               token: signInResult.token,
               userAgent: params.userAgent,
               id_skpd: id_unit,
               tahun: params.tahun,
               id_level,
            }).then((res) => res.data[0])
            dataSkpd && (id_skpd = dataSkpd.id_skpd)
            dataSkpd && (id_unit = dataSkpd.id_unit)
         }
         const localSignInResult = await signInToUserApiBySipdRi({
            id_prop,
            id_skpd,
            id_unit,
            is_prop,
            name: 'sipd_ri',
            token: signInResult.token,
            refresh_token: signInResult.refresh_token,
            user_agent: params.userAgent,
            username: params.username,
         })

         const { id, image, jabatan, nama, nip, roles, tokens } = localSignInResult.data
         const sessionUser: Session['user'] = {
            id,
            id_daerah,
            id_prop,
            id_skpd: id_skpd ?? refilledSession.id_skpd ?? 0,
            id_unit: id_unit ?? refilledSession.id_unit ?? 0,
            is_prop,
            nama,
            nip,
            roles: [...new Set<RoleUser>([...roles, 'sipd_ri'])],
            tahun: params.tahun,
            image,
            jabatan,
            tokens,
         }

         return sessionUser
      }
      return null
   } catch (error: any) {
      console.error('signInUserToSipdRi', error?.message)
      if (error?.cause === 'fetcher') {
         throw new Error(error?.message)
      }
      throw new Error('Gagal Login ke sipd')
   }
}

export { getUserByTokenFromSipd, signInUserToSipdRi }
