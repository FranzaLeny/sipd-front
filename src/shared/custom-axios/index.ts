import Axios, { AxiosError, type AxiosInstance } from 'axios'

const axios: AxiosInstance = Axios.create({
   headers: {
      'Content-Type': 'application/json',
   },
   validateStatus: function (status) {
      return status >= 200 && status < 300 // default
   },
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

export default axios
