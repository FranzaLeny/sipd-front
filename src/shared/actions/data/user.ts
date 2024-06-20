// API

import axios from '@custom-axios/api-fetcher'
import { IUser } from '@zod'

async function getProfile() {
   return await axios.get<ResponseApi<IUser>>(`api/auth/me`)
}

async function getUser(id: string) {
   return await axios.get<ResponseApi<IUser>>(`api/master/user/${id}`)
}

async function addUserByAkunSipdRi(params: { id_user_sipd: string }) {
   return await axios.post<ResponseApi<IUser>>(`api/master/user`, {}, { params })
}
async function deleteUser(id: string) {
   return await axios.delete<ResponseApi<IUser>>(`api/master/user/${id}`)
}

async function updateUser(id: string, data: Partial<IUser>) {
   return await axios.patch<ResponseApi<IUser>>(`api/master/user/${id}`, data)
}

export { addUserByAkunSipdRi, deleteUser, getProfile, getUser, updateUser }
