'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

export const revalidateRoot = async () => {
   const res = revalidatePath('/', 'layout')
   return Promise.resolve(res)
}

export async function revalidate(path: string) {
   const res = revalidateTag(path)
   return Promise.resolve(res)
}

export async function clearCookies() {
   const cookieStore = cookies()
   cookieStore.getAll().map((cookie) => cookies().set(cookie.name, cookie.value, { maxAge: 0 }))
   return Promise.resolve()
}
