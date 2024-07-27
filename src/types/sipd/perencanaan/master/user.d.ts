// POST /api/master/user/view
interface ViewUserSipdPayload {
   id_daerah: number
   id_user: number
}
interface ViewUserSipdResponse {
   status: boolean
   status_code: number
   data: UserViewSipd
}

interface UserViewSipd {
   id_user: number
   id_daerah: number
   nip: string
   nama_user: string
   jabatan: string
   id_profil: number
   login_name: string
   id_level: number
   akses_user: string
   picture?: any
   accInput: number
   accKunci: number
   accGiat: number
   accUnit: number
   accJadwal: number
   accMaster: number
   accSpv: number
   accUsulan: number
   accAsmas: number
   accBankeu: number
   accHibban: number
   accDisposisi: number
   accMonitor: number
}
// GET /api/master/user/getuserbytoken
interface UserByTokenSipd {
   address: Address
   authToken?: any
   communication: Communication
   companyName: string
   doubleJob: number
   email: string
   emailSettings: EmailSettings
   firstname: string
   fullname: string
   id_prop: number
   id: number
   is_prop: number
   kode_skpd: string
   language: string
   lastname: string
   nama_daerah: string
   occupation: string
   phone: string
   pic: string
   profile: number
   refreshToken: string
   roles: number
   securityRole: string
   setwRoles: boolean
   skpd: string
   skpdList: string
   socialNetworks: SocialNetworks
   timeZone: string
   unit: number
   updatesFromKeenthemes: UpdatesFromKeenthemes
   username: string
   website: string
}

interface SocialNetworks {
   facebook: string
   instagram: string
   linkedIn: string
   twitter: string
}

interface UpdatesFromKeenthemes {
   newsAboutKeenthemesProductsAndFeatureUpdates: boolean
   newsAboutMetronicOnPartnerProductsAndOtherServices: boolean
   thingsYouMissedSindeYouLastLoggedIntoKeen: boolean
   tipsOnGettingMoreOutOfKeen: boolean
   tipsOnMetronicBusinessProducts: boolean
}

interface EmailSettings {
   activityRelatesEmail: ActivityRelatesEmail
   emailNotification: boolean
   sendCopyToPersonalEmail: boolean
}

interface ActivityRelatesEmail {
   memberRegistration: boolean
   newMembershipApproval: boolean
   someoneAddsYouAsAsAConnection: boolean
   uponNewOrder: boolean
   youAreSentADirectMessage: boolean
   youHaveNewNotifications: boolean
}

interface Communication {
   email: boolean
   phone: boolean
   sms: boolean
}

interface Address {
   addressLine: string
   city: string
   postCode: string
   state: string
}
