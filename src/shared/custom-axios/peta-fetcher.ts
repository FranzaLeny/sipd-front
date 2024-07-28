import http from 'http'
import https from 'https'
import Axios, { AxiosError, AxiosInstance } from 'axios'

const axios: AxiosInstance = Axios.create({
   headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
   },
   validateStatus: function (status) {
      return status >= 200 && status < 300 // default
   },
   baseURL: process.env.NEXT_PUBLIC_API_SIPD_PETA_URL,
})

axios.interceptors.response.use(
   async (res) => res.data,
   (error) => {
      if (error instanceof AxiosError) {
         if (error?.response?.data?.message) {
            error.message = error?.response?.data?.message
         } else {
            error.message = 'Gagal: ' + error.message
         }
      }
      return Promise.reject(error)
   }
)

axios.interceptors.request.use(
   async (config) => {
      try {
         const token = await getToken()
         if (!token) {
            throw new Error('Token not found')
         }
         config.headers['Authorization'] = `Bearer ${token}`
         config.headers['Content-Type'] = 'application/json'
      } catch (error) {
         console.error(error)
         return Promise.reject({ message: 'Unauthenticated', error: 'Request to SIPD-KEU failed' })
      }
      config.httpsAgent = new https.Agent({ keepAlive: true })
      config.httpAgent = new http.Agent({ keepAlive: true })
      return config
   },
   (error) => Promise.reject(error)
)

export default axios

async function getToken(): Promise<string | undefined> {
   let user: Session['user'] | undefined
   if (typeof window === 'undefined') {
      const { getServerSession } = await import('@shared/server-actions/auth')
      user = (await getServerSession(['sipd_peta']))?.user
   } else {
      const sessionData = localStorage.getItem('x-sipd-ri')
      user = sessionData ? JSON.parse(sessionData) : undefined
   }
   const token = user?.tokens?.find((d) => d.name == 'sipd_peta')?.token

   return token
}
