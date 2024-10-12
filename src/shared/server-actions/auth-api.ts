'use server'

import { headers } from 'next/headers'
import { Session } from 'next-auth'
import axios from '@shared/custom-axios'

type UserDlh = {
   tokens?: {
      user_agent: string
      token: string
      name: string
      refresh_token: string | null
   }[]
   id: string
   id_daerah: number
   id_unit: number
   id_skpd: number
   id_sub_skpd: number
   id_prop: number
   is_prop: number
   jabatan: string
   nama: string
   nama_daerah: string
   nip: string | null
   roles: RoleUser[]
   image: string | null
}

type ApiSignIn = {
   user_agent: string
   password: string
   username: string
}

async function signInToApi(data: ApiSignIn) {
   const getHeader = headers()
   const port = process.env.NEXT_PUBLIC_API_PORT
   let baseURL = process.env.NEXT_PUBLIC_API_URL
   if (!baseURL && !!port) {
      const proto = getHeader.get('x-forwarded-proto') ?? ''
      const host = getHeader.get('X-Forwarded-Host') ?? ''
      const hostname = host?.split(':')[0]
      baseURL = `${proto}://${hostname}:${port}`
   }

   return await axios.post<ResponseApi<UserDlh>>('/api/auth/sign-in', data, {
      baseURL,
   })
}
export async function getDaerahLogin() {
   const getHeader = headers()
   const port = process.env.NEXT_PUBLIC_API_PORT
   let baseURL = process.env.NEXT_PUBLIC_API_URL
   if (!baseURL && !!port) {
      const proto = getHeader.get('x-forwarded-proto') ?? ''
      const host = getHeader.get('X-Forwarded-Host') ?? ''
      const hostname = host?.split(':')[0]
      baseURL = `${proto}://${hostname}:${port}`
   }

   return await axios
      .get<
         ResponseApi<
            {
               id_daerah: number
               id_prop: number
               id_kab_kota: number
               nama_daerah: string
            }[]
         >
      >('/api/auth/daerah', {
         baseURL,
      })
      .then((res) => res.data)
}

const signInUserToApi = async (
   params: ApiSignIn & { tahun: number }
): Promise<Session['user'] | null> => {
   try {
      const { tahun, ...signInParams } = params
      const response = await signInToApi(signInParams)
      const userData = response.data
      if (userData?.tokens?.some((token) => token.name === 'sipd_ri')) {
         userData.roles = Array.from(new Set([...userData.roles, 'sipd_ri']))
      }
      return { ...userData, tahun: tahun ?? 0 }
   } catch (error: any) {
      console.error('signInUserToApi', error?.message)
      throw new Error('Gagal sigin user ke api', { cause: 'fetcher' })
   }
}

interface UserLokal {
   id: string
   jabatan: string
   nama: string
   nama_daerah: string
   roles: RoleUser[]
   nip: string | null
   image: string | null
   id_skpd: number
   id_unit: number
   tokens: {
      token: string
      name: string
   }[]
}

async function signInToUserApiBySipdRi(data: {
   user_agent: string
   name: string
   token: string
   refresh_token: string
   username: string
   id_skpd?: number
   id_unit?: number
   id_prop: number
   is_prop: number
}) {
   let baseURL = process.env.NEXT_PUBLIC_API_URL
   const port = process.env.NEXT_PUBLIC_API_PORT
   if (!baseURL && !!port) {
      const getHeader = headers()
      const proto = getHeader.get('x-forwarded-proto') ?? ''
      const host = getHeader.get('X-Forwarded-Host') ?? ''
      const hostname = host?.split(':')[0]
      baseURL = `${proto}://${hostname}:${port}`
   }
   return await axios
      .post<ResponseApi<UserLokal>>('/api/auth/sign-in-by-sipd-ri', data, {
         baseURL,
      })
      .catch((error) => {
         console.log('error', error)

         console.error('signInToUserApiBySipdRi', error?.message)
         throw new Error('Gagal sigin user ke api menggunakan akun-sipd ri', { cause: 'fetcher' })
      })
}

export { signInToUserApiBySipdRi, signInUserToApi }
