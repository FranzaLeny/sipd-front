'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardBody } from '@nextui-org/react'

export default function Error({
   error,
   reset,
}: {
   error: Error & { digest?: string }
   reset: () => void
}) {
   const router = useRouter()
   const back = useCallback(() => {
      router.back()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   return (
      <div className='mx-auto size-full p-8'>
         <Card className='size-full min-h-full'>
            <CardBody className='size-full grow items-center justify-center space-y-7 p-8'>
               <h1 className='text-center text-4xl font-bold'>{error?.name}</h1>
               {process.env.NODE_ENV === 'production' ? (
                  <p className='text-content2-foreground'>Oops! Terjadi Kesalahan.</p>
               ) : (
                  <div className='space-y-3'>
                     <p className='text-content2-foreground'>Pesan: {error?.message}</p>
                     <p className='text-content2-foreground'>Digest: {error?.digest}</p>
                     <p className='text-content2-foreground'>Stack: {error?.stack}</p>
                     <p className='text-content2-foreground'>
                        Cause: {JSON.stringify(error?.cause)}
                     </p>
                  </div>
               )}
               <div className='flex gap-3'>
                  <Button
                     variant='solid'
                     color='primary'
                     onPress={back}>
                     Kembali
                  </Button>
                  <Button
                     variant='solid'
                     color='secondary'
                     onPress={() => reset()}>
                     Reset
                  </Button>
               </div>
            </CardBody>
         </Card>
      </div>
   )
}
