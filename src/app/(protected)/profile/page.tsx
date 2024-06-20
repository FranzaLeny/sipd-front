import { revalidatePath } from 'next/cache'
import { getProfile } from '@actions/data/user'
import ErrorPage from '@components/ui/error'

import ProfilePicture from './_components/profile-picture'
import Template from './_components/template'

const getData = async () => {
   try {
      return await getProfile().then((d) => d.data)
   } catch (error) {
      return null
   }
}
const revalidateProfile = async () => {
   'use server'
   return revalidatePath('/profile')
}
export default async function Page() {
   const data = await getData()
   if (!data) {
      return <ErrorPage code={404} />
   }

   return (
      <>
         <div
            className={`content flex h-56 items-end justify-end bg-[url('https://source.unsplash.com/random/600x200?nature')] bg-cover bg-center pt-6 font-sans  leading-normal antialiased md:bg-[url('https://source.unsplash.com/random/700x200?nature-dark')] lg:bg-[url('https://source.unsplash.com/random/1000x200?light-nature')] dark:lg:bg-[url('https://source.unsplash.com/random/1000x200?dark-nature')]`}>
            <ProfilePicture revalidateProfile={revalidateProfile} />
         </div>
         <Template
            user={data}
            revalidateProfile={revalidateProfile}
         />
      </>
   )
}
