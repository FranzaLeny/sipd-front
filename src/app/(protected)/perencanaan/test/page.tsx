'use client'

import { validateRkpdSipd } from '@actions/perencanaan/rkpd/jadwal-rkpd'
import { Button } from '@nextui-org/react'
import { useSession } from '@shared/hooks/use-session'

export default function Page() {
   const session = useSession()
   const handle = async () => {
      // await validateRkpdSipd({ id_daerah: 424, id_unit: 1871, id_user: 36663, tahun: 2025 })
      //    .then((res) => {
      //       console.log({ res })
      //    })
      //    .catch((err) => {
      //       console.log({ err })
      //    })
   }
   return (
      <div className='w-fit border-collapse'>
         <Button onPress={handle}> TEST</Button>
      </div>
   )
}
