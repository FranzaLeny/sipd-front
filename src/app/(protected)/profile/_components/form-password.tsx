'use client'

import { updateUser } from '@actions/data/user'
import BooleanInput from '@components/form/boolean-input'
import { TextInput } from '@components/form/text-input'
import { Card, CardContent } from '@components/ui/card'
import { Button } from '@nextui-org/react'
import { createTsForm } from '@ts-react/form'
import { IUser, z } from '@zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useSession } from '@shared/hooks/use-session'

const mapping = [[z.string(), TextInput] as const, [z.boolean(), BooleanInput] as const] as const

export interface FormProps extends React.HTMLAttributes<HTMLDivElement> {}
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/
const usernameRegex = /^[a-zA-Z0-9_]{3,}$/
const Schema = z
   .object({
      username: z
         .string({ description: 'Nama Pengguna // Masukan username untuk login' })
         .min(3)
         .regex(usernameRegex, {
            message: `Minimal 3 karater dan Karakter-karakter yang diperbolehkan adalah huruf (besar atau kecil), angka, atau garis bawah "_"`,
         }),
      new_password: z
         .string({ description: 'Kata sandi baru // Masukan kata sandi baru' })
         .nullable()
         .optional(),
      confirm_password: z
         .string({
            description: 'Konfirm Kata sandi baru // Masukan ulang kata sandi baru',
         })
         .nullable()
         .optional(),
      password: z.string({ description: 'Kata sandi // Masukan kata sandi lama' }),
   })
   .superRefine((v, ctx) => {
      if (v.new_password || v.confirm_password) {
         if (v.new_password?.length && !passwordRegex.test(v.new_password)) {
            ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message:
                  'Mininimal 8 karakter dan harus ada 1 huruf besar, 1 huruf kecil, 1 angka dan 1 simbol',
               fatal: true,
               path: ['new_password'],
            })
            return z.NEVER
         }
         if (v.confirm_password !== v.new_password) {
            ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message: 'Tidak sama dengan kata sandi baru',
               fatal: true,
               path: ['confirm_password'],
            })
            return z.NEVER
         }
      }
   })

type ISchema = z.infer<typeof Schema>

const FormComponent = (props: FormProps) => (
   <CardContent
      as='form'
      {...props}
   />
)

const TsForm = createTsForm(mapping, { FormComponent })

const CardSecuriy = ({
   data,
   revalidateProfile,
}: {
   data: IUser
   revalidateProfile: () => Promise<void>
}) => {
   const { update, data: session } = useSession()

   const form = useForm<ISchema>({
      defaultValues: {
         username: data.username,
      },
   })

   const {
      formState: { isSubmitting },
      watch,
   } = form
   const canSubmit = !!watch('password')

   const onSubmit = async (value: ISchema) => {
      try {
         await updateUser(data?.id, value).then(async (res) => {
            if (res?.success) {
               toast.success(`${res?.message ?? 'Berhasil ubah data  data user'} ${data?.nama}`)

               if (res.data?.id === session?.user?.id) {
                  await update({ ...res?.data })
                  await revalidateProfile()
               }
            } else {
               toast.error(`${res?.message ?? 'Gagal ubah data user'} ${data?.nama}`, {
                  autoClose: 5000,
               })
            }
         })
      } catch (error: any) {
         toast.error(error?.message ?? 'Gagal ubah data user', { autoClose: 5000 })
      }
   }

   return (
      <Card className='w-full flex-1 py-3 md:py-4 lg:py-6'>
         <TsForm
            renderAfter={() => (
               <div className='mt-2 text-end md:mt-3'>
                  <Button
                     isDisabled={!canSubmit}
                     isLoading={isSubmitting}
                     color='primary'
                     type='submit'>
                     Simpan
                  </Button>
               </div>
            )}
            form={form}
            schema={Schema}
            props={{
               confirm_password: { type: 'password' },
               password: { type: 'password' },
               new_password: { type: 'password' },
            }}
            onSubmit={onSubmit}
         />
      </Card>
   )
}

export default CardSecuriy
