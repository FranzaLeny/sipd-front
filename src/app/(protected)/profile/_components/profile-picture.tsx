'use client'

import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { updateUser } from '@actions/data/user'
import axios from '@custom-axios/index'
import { Avatar, Button } from '@nextui-org/react'
import { toast } from 'react-toastify'
import { useSession } from '@shared/hooks/use-session'

const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpg', 'image/jpeg']
const MAX_IMAGE_SIZE = 10 //In MegaBytes

const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
   const result = sizeInBytes / (1024 * 1024)
   return +result.toFixed(decimalsNum)
}

export default function ProfilePicture({
   revalidateProfile,
}: {
   revalidateProfile: () => Promise<void>
}) {
   const { data, update } = useSession()
   const [loading, setLoading] = useState(false)
   const [selectedImage, setSelectedImage] = useState<File | null>()
   const [pictureUrl, setPictureUrl] = useState('')
   const imageChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
         setSelectedImage(e.target.files[0])
      }
   }
   const inputref = useRef<HTMLInputElement>(null)

   const selectPicture = () => {
      if (!!inputref) {
         inputref?.current?.click()
      }
   }
   useEffect(() => {
      if (selectedImage) {
         const url = URL.createObjectURL(selectedImage)
         setPictureUrl(url)
      } else if (data?.user) {
         const url = data?.user?.image ? `${data?.user?.image}?alt=media` : ''
         setPictureUrl(url)
      }
   }, [data?.user, selectedImage])

   const onSubmit = useCallback(async () => {
      if (!selectedImage) {
         return
      }
      setLoading((old) => !old)
      try {
         if (!data?.user?.id) {
            throw new Error('Harus Login')
         }
         const formData = new FormData()
         formData.append('file', selectedImage)
         const response = await axios.post<{
            success: boolean
            data?: { path: string }
            message: string
         }>('/api/upload', formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         })
         if (response.data?.path) {
            const url = response.data?.path.split('?')
            await updateUser(data?.user?.id, { image: url[0] }).then(async (res) => {
               toast.success('Berhasil ubah foto profile')
               if (res.data?.id === data?.user?.id) {
                  await update({ image: response.data?.path })
                  await revalidateProfile()
               }
            })
         }
      } catch (error: any) {
         toast.error(error?.message ?? 'Gagal ubah foto profile')
         console.error(error?.message)
      }
      setSelectedImage(null)
      setLoading((old) => !old)
   }, [data?.user?.id, update, selectedImage, revalidateProfile])

   return (
      <div className='relative size-44'>
         <Avatar
            as={'button'}
            onClick={selectPicture}
            size='lg'
            classNames={{
               base: 'w-44 h-44',
            }}
            alt='Profile Picture'
            showFallback
            src={pictureUrl}
         />
         <input
            accept='image/*'
            ref={inputref}
            type='file'
            className='hidden'
            onChange={imageChange}
         />
         <Button
            isLoading={loading}
            className='text-tiny absolute bottom-1 right-1/2 z-10 translate-x-1/2 opacity-75'
            variant='solid'
            color='primary'
            fullWidth
            radius='lg'
            onPress={!!selectedImage ? onSubmit : selectPicture}
            size='sm'>
            {!!selectedImage ? 'Simpan Foto' : 'Pilih Foto'}
         </Button>
      </div>
   )
}
