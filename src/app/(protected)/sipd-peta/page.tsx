'use client'

import { useSession } from '@shared/hooks/use-session'
import { useSipdPetaFetcher } from '@shared/hooks/use-sipd-peta-fetcher'

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

export default function Page() {
   const session = useSession(['sipd_peta'])
   const id_user = session?.data?.user?.accountPeta?.id_user
   const token = session?.data?.user?.tokens?.find((d) => d.name == 'sipd_peta')?.name
   const { data } = useSipdPetaFetcher<UserPeta>({
      token,
      url: 'https://service.sipd.kemendagri.go.id/auth/strict/user-manager/' + id_user,
      enabled: !!token && !!id_user,
   })
   return (
      <div className='content'>
         Selamat datang <span className='font-bold'>{data?.nama_user}</span> di halaman SIPD
         Penatausahaan
      </div>
   )
}
