'use client'

import { Button } from '@nextui-org/react'

import dowloadFormRakExcel from './excel'

export default function Rak({ data }: { data: LaporanFormRak }) {
   const handleExport = () => {
      dowloadFormRakExcel(data)
   }
   console.log({ data })

   return (
      <div className='content flex items-center justify-center py-10'>
         <Button
            size='lg'
            onPress={handleExport}>
            Download Form RAK
         </Button>
      </div>
   )
}
