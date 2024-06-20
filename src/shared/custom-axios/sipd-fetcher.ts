import {
   GetUrlKey,
   listSipdGet,
   listSipdPost,
   Payload,
   PayloadGet,
   PayloadResponseGetSipd,
   PayloadResponsePostSipd,
   PostUrlKey,
} from '@actions/perencanaan/sipd-perencanaan-urls'
import { generateApiKey } from '@actions/perencanaan/token-sipd'
import Axios, { AxiosError, AxiosInstance } from 'axios'
import { decodeJwt } from 'jose'

const axios: AxiosInstance = Axios.create({
   headers: {
      'Content-Type': 'multipart/form-data',
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

axios.interceptors.request.use(
   async (config) => {
      try {
         const session = await getSession()
         const userAgent = getUserAgent()
         setRequestAgent(config, userAgent)
         const apiDetails = getApiDetails(session)

         if (!apiDetails.token) {
            throw new Error('Token not found')
         }

         setHeaders(config, apiDetails)
         config.baseURL = process.env.NEXT_PUBLIC_API_SIPD_URL
      } catch (error) {
         console.error(error)
         return Promise.reject({ message: 'Unauthenticated', error: 'Request to SIPD-RI failed' })
      }

      return config
   },
   (error) => Promise.reject(error)
)

async function getSession(): Promise<User | undefined> {
   if (typeof window === 'undefined') {
      const { getServerSession } = await import('@shared/server-actions/auth')
      return (await getServerSession(['sipd_ri'])).user
   } else {
      const sessionData = localStorage.getItem('x-sipd-ri')
      return sessionData ? JSON.parse(sessionData) : undefined
   }
}

function getUserAgent(): string {
   if (typeof window === 'undefined') {
      const { headers } = require('next/headers')
      return headers().get('User-Agent') || ''
   } else {
      return navigator.userAgent
   }
}

function setRequestAgent(config: any, userAgent: string) {
   if (typeof window === 'undefined') {
      const https = require('https')
      config.headers['User-Agent'] = userAgent
      config.httpsAgent = new https.Agent({
         rejectUnauthorized: false,
      })
   }
}

function getApiDetails(session: SessionUser | undefined) {
   if (!session) {
      return { token: '', apikey: '' }
   }
   const token = session?.tokens?.find((t) => t?.name === 'sipd_ri')?.token ?? ''
   const user: any = token ? decodeJwt(token) : null
   const apikey = user
      ? generateApiKey({
           id_daerah: user?.id_daerah,
           id_level: user?.id_level,
           id_user: user?.id_user,
           userAgent: getUserAgent(),
           tahun: session?.tahun,
        })
      : ''

   return { token, apikey }
}

function setHeaders(config: any, apiDetails: { token: string; apikey: string }) {
   config.headers['X-Access-Token'] = apiDetails.token
   config.headers['X-Api-Key'] = apiDetails.apikey
   config.headers['Content-Type'] = 'multipart/form-data'
}
async function getFromSipd<T extends GetUrlKey>(
   route: T,
   {
      params,
   }: {
      params: PayloadGet<T>
   }
): Promise<PayloadResponseGetSipd[T]['response']> {
   try {
      const routeConfig = listSipdGet[route]
      const defaultPayload = routeConfig.defaultPayload
      const parameterKeys = routeConfig.key_for_params || []
      let routeUrl = routeConfig.url

      for (const key of parameterKeys) {
         const value = params[key] !== undefined ? params[key] : defaultPayload[key]
         routeUrl += `/${value}`
      }

      return await axios.get<PayloadResponseGetSipd[T]['response']>(routeUrl)
   } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error fetching data from SIPD')
   }
}

async function postToSipd<T extends PostUrlKey>(
   route: T,
   {
      params,
      keys: inputKeys,
   }: {
      params: Payload<T>
      keys: Array<keyof Payload<T>>
   },
   maxRetry = 5,
   retry = 1
): Promise<PayloadResponsePostSipd[T]['response']> {
   const uniqueKeys = [...new Set(inputKeys)]
   const formData = new FormData()
   let endpoint = listSipdPost[route].url
   const { defaultPayload, urlParam } = listSipdPost[route]
   const payload: Payload<T> = {}

   const populatePayloadAndReturnString = (key: keyof Payload<T>): string => {
      const valueFromParams = params[key]
      const value: any = valueFromParams !== undefined ? valueFromParams : defaultPayload[key]
      payload[key] = value
      return typeof value === 'object' ? JSON.stringify(value) : String(value)
   }

   if (urlParam?.length) {
      urlParam.forEach((key) => {
         const value = populatePayloadAndReturnString(key)
         endpoint += `/${value}`
      })
   }

   uniqueKeys.forEach((key) => {
      const value = populatePayloadAndReturnString(key)
      if (value !== 'undefined') {
         formData.append(key.toString(), value)
      }
   })

   try {
      return await axios.post<PayloadResponsePostSipd[T]['response']>(endpoint, formData)
   } catch (error: any) {
      if (maxRetry && retry < maxRetry) {
         await delay(retry * 100)
         console.error('Percobaan ke...' + (retry + 1) + '/' + maxRetry)
         return await postToSipd(route, { params, keys: uniqueKeys }, maxRetry, ++retry)
      }
      throw new Error(error?.message ?? 'Error')
   }
}

export { axios as fetcher, getFromSipd, postToSipd }

function delay(ms: number) {
   return new Promise((resolve) => setTimeout(resolve, ms))
}
