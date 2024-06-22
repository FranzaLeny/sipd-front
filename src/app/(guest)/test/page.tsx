'use client'

import { useCallback, useState } from 'react'
import { Button } from '@nextui-org/react'

export default function Page() {
   const [jadwal, setJadwal] = useState<string>('')
   const handle = useCallback(async () => {}, [])
   return (
      <div className='w-fit border-collapse'>
         <Button onPress={handle}> TEST</Button>
      </div>
   )
}
