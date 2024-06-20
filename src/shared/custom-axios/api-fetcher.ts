import Axios, { AxiosError, AxiosInstance } from 'axios'
import Cookies from 'js-cookie'

const axios: AxiosInstance = Axios.create({
   headers: {
      'Content-Type': 'application/json',
   },
   validateStatus: function (status) {
      return status >= 200 && status < 300 // default
   },
})

axios.interceptors.response.use(
   (response) => response.data,
   (error: AxiosError<any>) => {
      error?.response?.data?.message &&
         (error.message = error?.response?.data?.message ?? `Gagal: ${error.message}`)
      return Promise.reject(error)
   }
)
// axios.interceptors.response.use(
//   (response) => response.data,
//   (error: AxiosError<any>) => {
//     const errorMessage = error?.response?.data?.message ?? `Gagal: ${error.message}`
//     return Promise.reject(new Error(errorMessage))
//   }
// )

axios.interceptors.request.use(
   async (config) => {
      let tokenValue = ''
      let baseURL = process.env.NEXT_PUBLIC_API_URL
      const port = process.env.NEXT_PUBLIC_API_PORT
      if (typeof navigator === 'undefined') {
         const { cookies, headers } = await import('next/headers')
         const cookiesValue = cookies()
         if (!baseURL && !!port) {
            const header = headers()
            const host = header.get('host')
            const proto = header.get('x-forwarded-proto')
            baseURL = `${proto}://${host}:${port}`
         }
         const token = cookiesValue.get('next-auth.session-token')?.value
         const tokenSeccure = cookiesValue.get('__Secure-next-auth.session-token')?.value
         tokenValue = tokenSeccure || token || ''
      } else {
         if (!baseURL && !!port) {
            const proto = location.protocol
            const host = location.host
            baseURL = `${proto}//${host}:${port}`
         }
         const tokenSeccure = Cookies.get('__Secure-next-auth.session-token')
         const token = Cookies.get('next-auth.session-token')
         tokenValue = tokenSeccure || token || ''
      }
      baseURL && (config.baseURL = baseURL)
      tokenValue && (config.headers['Authorization'] = `Bearer ${tokenValue}`)
      // config.url = config.url
      //   ?.replace('api-strict', 'services')
      //   .replace('api-rka', 'services/perencanaan/rka')
      //   .replace('api-data-ren', 'services/perencanaan/data')

      return config
   },
   (error) => {
      console.log({ error })
      return Promise.reject(error)
   }
)
export { axios, axios as default }
