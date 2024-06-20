'use client'

// import { getAllBlSubGiatSipd } from '@actions/perencanaan/rka/bl-sub-giat'
import { Button } from '@nextui-org/react'

export default function Page() {
   const handle = async () => {
      // const res = await getAllBlSubGiatSipd({
      //    id_daerah: 424,
      //    id_skpd: 1871,
      //    tahun: 2024,
      // })
      // console.log({ res })
   }
   return (
      <div className='w-fit border-collapse'>
         Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quaerat, vero? Temporibus
         blanditiis officiis enim earum eaque eveniet, ex nam, doloribus praesentium libero totam
         optio repellendus omnis sapiente voluptatem veritatis. Exercitationem.
         <Button onPress={handle}> Pdf</Button>
      </div>
   )
}
