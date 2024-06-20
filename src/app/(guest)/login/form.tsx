'use client'

import { useEffect } from 'react'
import Image from 'next/legacy/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { NumberInput, PasswordInput, TextInput } from '@components/form/text-input'
import { Card } from '@components/ui/card'
import { Button, CardBody, CardFooter } from '@nextui-org/react'
import { createTsForm, createUniqueFieldSchema } from '@ts-react/form'
import { z } from '@zod'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'

const ID_DAERAH = Number(process.env.NEXT_PUBLIC_SIPD_ID_DAERAH || 0)
const TAHUN = Number(process.env.NEXT_PUBLIC_SIPD_TAHUN || 0)
const password = createUniqueFieldSchema(z.string().min(1), 'password')
const mapping = [
   [z.string(), TextInput] as const,
   [z.number(), NumberInput] as const,
   [password, PasswordInput] as const,
] as const

export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {}

const CardForm = (props: FormProps) => {
   return (
      <form
         id='sign-in'
         className='flex flex-col gap-3'
         {...props}
      />
   )
}

const TsForm = createTsForm(mapping, { FormComponent: CardForm })

const SingInSchema = z
   .object({
      tahun: z
         .number({
            description: 'Tahun ',
         })
         .min(2024)
         .max(new Date().getFullYear() + 1)
         .default(2024),
      username: z
         .string({
            description: 'Nama Pengguna ',
         })
         .min(1),
      id_daerah: z
         .number({
            description: 'Id Daerah // Lembata: 424',
         })
         .default(424)
         .nullable()
         .optional(),
      password: password,
   })
   .strict()
   .superRefine((data, ctx) => {
      if (data.username.startsWith('sipd:') && !data.id_daerah) {
         ctx.addIssue({
            code: 'custom',
            path: ['id_daerah'],
            message: 'Id Daerah tidak boleh kosong jika menggunakan akun "sipd-ri"',
         })
      }
   })
type SignIn = z.infer<typeof SingInSchema>

// HACK refractor komponen

const FormLogin: React.FC<{}> = ({}) => {
   const param = useSearchParams()
   const error = param.get('error') || ''
   const callbackUrl = param.get('callbackUrl') || '/dashboard'
   const formDlh = useForm<SignIn>({
      defaultValues: { password: '', username: '', tahun: TAHUN, id_daerah: ID_DAERAH },
   })

   const {
      formState: { isSubmitting: isLoading },
      watch,
      setValue,
      clearErrors,
   } = formDlh

   const isSipd = watch('username')?.endsWith('-sipd')
   useEffect(() => {
      if (isSipd) {
         clearErrors('id_daerah')
         setValue('id_daerah', ID_DAERAH)
      } else {
         clearErrors('id_daerah')
         setValue('id_daerah', undefined)
      }
   }, [setValue, clearErrors, isSipd])

   const signInHandler = async (data: SignIn) => {
      await signIn('credentials', {
         redirect: true,
         callbackUrl,
         ...data,
      })
   }

   const errorComponent = () => (
      <div className='text-center'>
         <p>
            Format Username SIPD-RI{' '}
            <span className='font-bold'>
               <span className='text-danger'>username</span>-sipd
            </span>
         </p>
         {!!error && <p className='text-danger px-4 py-1 text-sm'>{error}</p>}
      </div>
   )

   return (
      <div className='pt-navbar flex w-full items-center justify-center pb-6'>
         <div className='w-11/12 space-y-2 md:w-1/2 lg:w-2/5'>
            <div className='relative mx-auto h-24 w-1/3 text-center'>
               <Link href={'/'}>
                  <Image
                     objectFit='contain'
                     src='/images/logo_kab_lembata.png'
                     alt='logo'
                     layout='fill'
                     priority={false}
                     loading='eager'
                  />
               </Link>
            </div>

            <Card className='p-4 sm:p-6'>
               <CardBody>
                  <TsForm
                     form={formDlh}
                     renderBefore={errorComponent}
                     schema={SingInSchema}
                     onSubmit={signInHandler}
                     props={{
                        username: { isClearable: true },
                        tahun: {
                           isRequired: true,
                           numberFormatOptions: {
                              useGrouping: false,
                           },
                        },
                        password: {
                           autoComplete: 'password',
                           label: 'Kata Sandi',
                        },
                        id_daerah: {
                           autoComplete: 'id_daerah',
                           label: 'Id Daerah',
                        },
                     }}>
                     {({ password, tahun, username, id_daerah }) => (
                        <>
                           {username}
                           {password}
                           {tahun}
                           {isSipd ? id_daerah : null}
                        </>
                     )}
                  </TsForm>
               </CardBody>
               <CardFooter>
                  <Button
                     form='sign-in'
                     isLoading={isLoading}
                     type='submit'
                     size='lg'
                     color='primary'
                     variant='shadow'
                     fullWidth>
                     Masuk
                  </Button>
               </CardFooter>
            </Card>
         </div>
      </div>
   )
}

export default FormLogin
