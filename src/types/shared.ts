import type { DynamicOptionsLoadingProps } from 'next/dynamic'
import type {
   SesionSipd as SesSipd,
   SesionSipdValid as SipdSessionValid,
} from '@actions/perencanaan/token-sipd'
import type { Session as AuthSession, User as AuthUser } from 'next-auth'

declare global {
   type ComponentLoader = (loadingProps: DynamicOptionsLoadingProps) => JSX.Element
   type User = AuthUser
   type Session = AuthSession
   type SesionSipd = SesSipd
   type SesionSipdValid = SipdSessionValid
   type Token = { name: string; token: string }
   type RoleUser =
      | 'super_admin'
      | 'sipd_ri'
      | 'perencanaan'
      | 'sipd_peta'
      | 'penatausahaan'
      | 'admin_perencanaan'
      | 'admin'
      | 'guest'
   type SessionUser = SesSipd & {
      id: string
      nama: string
      jabatan?: string
      nip: string | null
      roles: RoleUser[]
      tokens?: Token[]
      accountPeta?: {
         id_user: number
         id_daerah: number
         kode_provinsi: string
         id_skpd: number
         id_role: number
         id_pegawai: number
         sub_domain_daerah: string
      }
   }
   type UserWithoutToken = Omit<SessionUser, 'tokens'>
   type UserWithoutRoles = Omit<SessionUser, 'roles'>
}
