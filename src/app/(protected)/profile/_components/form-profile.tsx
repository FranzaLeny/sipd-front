'use client'

import { useCallback } from 'react'
import { updateUser } from '@actions/data/user'
import { TextInput } from '@components/form/text-input'
import { Card, CardContent } from '@components/ui/card'
import { Button } from '@nextui-org/react'
import { createTsForm } from '@ts-react/form'
import { UserSchema, z } from '@zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useSession } from '@shared/hooks/use-session'

const mapping = [[z.string(), TextInput] as const] as const

export interface FormProps extends React.HTMLAttributes<HTMLDivElement> {}

const Schema = UserSchema.pick({
   nama: true,
   jabatan: true,
   nip: true,
})
type ISchema = z.infer<typeof Schema>

const FormComponent = (props: FormProps) => (
   <CardContent
      as='form'
      {...props}
   />
)

const TsForm = createTsForm(mapping, { FormComponent })

const CardProfile = ({
   data,
   revalidateProfile,
}: {
   data: IUser
   revalidateProfile: () => Promise<void>
}) => {
   const { data: session, update } = useSession()
   const form = useForm<ISchema>({
      defaultValues: {
         jabatan: data.jabatan,
         nama: data.nama,
         nip: data.nip,
      },
   })

   const {
      formState: { isSubmitting },
   } = form

   const onSubmit = useCallback(
      async (value: ISchema) => {
         try {
            await updateUser(data?.id, value).then(async (res) => {
               if (res?.success) {
                  toast.success(
                     `${res?.message ?? 'Berhasil simpan data  data user'} ${value?.nama}`
                  )
                  if (res.data?.id === session?.user?.id) {
                     await update({ ...res.data })
                     await revalidateProfile()
                  }
               } else {
                  toast.error(`${res?.message ?? 'Gagal simpan data user'} ${value?.nama}`, {
                     autoClose: 5000,
                  })
               }
            })
         } catch (error: any) {
            toast.error(error?.message ?? 'Gagal simpan data user', { autoClose: 5000 })
         }
      },
      [session, update, data, revalidateProfile]
   )

   return (
      <Card className='w-full flex-1 py-3 md:py-4 lg:py-6'>
         <TsForm
            form={form}
            schema={Schema}
            renderAfter={() => (
               <Button
                  isLoading={isSubmitting}
                  className='mt-2 md:mt-3'
                  color='primary'
                  type='submit'>
                  Simpan
               </Button>
            )}
            onSubmit={onSubmit}
         />
      </Card>
   )
}

export default CardProfile
