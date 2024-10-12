'use server'

import axios from '@custom-axios/peta-fetcher'

interface UserPeta {
   id_user: number
   id_daerah: number
   nip_user: string
   nama_user: string
   id_pang_gol: number
   nik_user: string
   npwp_user: string
   alamat: string
   lahir_user: string
}

export const getUserProfileFromSipd = async ({ id_user }: { id_user: number | string }) => {
   return await axios.get<UserPeta>(`/auth/strict/user-manager/${id_user}`)
}
