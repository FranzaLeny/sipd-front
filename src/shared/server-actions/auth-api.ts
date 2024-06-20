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
      baseURL = `${proto}://${host}:${port}`
   }

   return await axios.post<ResponseApi<UserDlh>>('api/auth/sign-in', data, {
      baseURL,
   })
}

const signInUserToApi = async (
   params: ApiSignIn & { tahun: number }
): Promise<Session['user'] | null> => {
   const { tahun, ...signInParams } = params
   try {
      const response = await signInToApi(signInParams)
      const userData = response.data

      // Add 'sipd_ri' role if user has a token with the name 'sipd_ri'
      if (userData?.tokens?.some((token) => token.name === 'sipd_ri')) {
         userData.roles = Array.from(new Set([...userData.roles, 'sipd_ri']))
      }

      return { ...userData, tahun: tahun ?? 0 }
   } catch {
      // It's best practice to handle errors in a higher-level function
      return null
   }
}

interface UserLokal {
   id: string
   jabatan: string
   nama: string
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
      baseURL = `${proto}://${host}:${port}`
   }
   return await axios
      .post<ResponseApi<UserLokal>>('api/sipd-ri/sign-in', data, {
         baseURL,
      })
      .catch((error) => {
         console.error(error)
         throw new Error('Gagal sigin user ke api menggunakan akun-sipd ri  ' + error?.message)
      })
}

export { signInToUserApiBySipdRi, signInUserToApi }
