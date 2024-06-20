//POST https://service.sipd.kemendagri.go.id/auth/auth/pre-login

type PreLoginSipdPetaPayload = {
   password: string
   tahun: number
   username: string
}

type PreLoginSipdPetaResponse = PreLoginSipdPeta[]
interface PreLoginSipdPeta {
   id_pegawai: number
   id_user: number
   id_daerah: number
   id_skpd: number
   kode_skpd: string
   nama_skpd: string
   id_role: number
   nama_role: string
}
//POST https://service.sipd.kemendagri.go.id/auth/auth/login
type LoginSipdPetaPayload = PreLoginSipdPetaPayload & {
   id_daerah: number
   id_role: number
   id_skpd: number
   id_pegawai: number
}

interface LoginSipdPetaResponse {
   token: string
   refresh_token: string
}
