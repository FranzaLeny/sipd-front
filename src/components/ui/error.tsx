'use client'

import { useRouter } from 'next/navigation'
import { Button, Modal, ModalBody, ModalContent } from '@nextui-org/react'

const ERRORS = [
   {
      code: 400,
      title: 'Bad Request',
      description: 'Permintaan tidak valid.',
   },
   {
      code: 401,
      title: 'Unauthorized',
      description: 'Akses ditolak karena belum otentikasi (Harus Login).',
   },
   {
      code: 403,
      title: 'Forbidden',
      description: 'Akses ditolak karena tidak ada izin.',
   },
   {
      code: 404,
      title: 'Not Found',
      description: 'Data tidak ditemukan.',
   },
   {
      code: 405,
      title: 'Method Not Allowed',
      description: 'Metode HTTP tidak diizinkan untuk sumber daya ini.',
   },
   {
      code: 409,
      title: 'Conflict',
      description: 'Ada konflik dalam permintaan.',
   },
   {
      code: 422,
      title: 'Unprocessable Entity',
      description: 'Data tidak dapat diproses karena masalah format atau konten.',
   },
   {
      code: 500,
      title: 'Internal Server Error',
      description: 'Terjadi kesalahan pada server.',
   },
   {
      code: 502,
      title: 'Bad Gateway',
      description: 'Terjadi kesalahan saat mencoba menghubungi server lain.',
   },
   {
      code: 503,
      title: 'Service Unavailable',
      description: 'Server sedang sibuk atau tidak tersedia.',
   },
   {
      code: 504,
      title: 'Gateway Timeout',
      description: 'Server tidak memberikan respons dalam waktu yang diharapkan.',
   },
]

const ErrorPage: React.FC<{ title?: string; code?: number; description?: string }> = (
   props = {
      title: 'Internal Server Error',
      code: 500,
   }
) => {
   const error = ERRORS.find((d) => d.code === props.code) ?? props
   const router = useRouter()
   return (
      <div>
         <Modal
            size='full'
            placement='center'
            isOpen={true}
            onClose={() => router.back()}>
            <ModalContent>
               {(onClose) => (
                  <ModalBody className='items-center justify-center'>
                     <h1 className='from-secondary to-danger animate-bounce bg-gradient-to-tl bg-clip-text p-6 text-center text-8xl font-extrabold tracking-widest text-transparent'>
                        {error.code}
                     </h1>
                     <p className='text-center text-3xl'>{error.title}</p>
                     <p className='text-content2-foreground'>{error.description}</p>
                     {process.env.NODE_ENV === 'development' && props?.description && (
                        <p className='text-content2-foreground'>{props?.description}</p>
                     )}
                     <div className='w-max'>
                        <Button
                           onPress={onClose}
                           fullWidth
                           color='secondary'
                           variant='solid'
                           size='lg'>
                           KEMBALI
                        </Button>
                     </div>
                  </ModalBody>
               )}
            </ModalContent>
         </Modal>
      </div>
   )
}

export default ErrorPage
