'use client'

import { useCallback, useEffect, useMemo } from 'react'
import Image from 'next/legacy/image'
import { useSearchParams } from 'next/navigation'
import { NumberInput, PasswordInput, TextInput } from '@components/form/text-input'
import { Card } from '@components/ui/card'
import { Button, CardBody, CardFooter, Select, Selection, SelectItem } from '@nextui-org/react'
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
         .max(new Date().getFullYear() + 1),
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
      if (data.username.endsWith('sipd') && !data.id_daerah) {
         ctx.addIssue({
            code: 'custom',
            path: ['id_daerah'],
            message: 'Daerah tidak boleh kosong jika menggunakan akun "sipd-ri"',
         })
      }
   })
type SignIn = z.infer<typeof SingInSchema>

// HACK refractor komponen

const FormLogin: React.FC<{
   listDaerah: { id_daerah: number; id_prop: number; id_kab_kota: number; nama_daerah: string }[]
}> = ({ listDaerah }) => {
   const param = useSearchParams()
   const error = param.get('error') || ''
   const callbackUrl = param.get('callbackUrl') || '/dashboard'
   const formDlh = useForm<SignIn>({
      defaultValues: { password: '', username: '', tahun: TAHUN, id_daerah: ID_DAERAH },
   })

   const {
      formState: { isSubmitting: isLoading, errors },
      watch,
      setValue,
      clearErrors,
   } = formDlh

   const isSipd = watch('username')?.endsWith('-sipd')
   const idDaerah = watch('id_daerah')
   const tahun = watch('tahun')
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
   const years = useMemo(() => {
      const startYear = 2024
      const currentYear = new Date().getFullYear()
      const endYear = currentYear + 1

      const YEARS: number[] = []
      for (let year = startYear; year <= endYear; year++) {
         YEARS.push(year)
      }
      return YEARS
   }, [])
   const handleIdDaerahChange = useCallback(
      (value: Selection) => {
         if (typeof value !== 'string' && Array.from(value)?.length) {
            const key = Array.from(value)
            const selectedIdDaerah = Number(key[0])
            if (!isNaN(selectedIdDaerah)) {
               clearErrors('id_daerah')
               setValue('id_daerah', selectedIdDaerah)
            } else {
               clearErrors('id_daerah')
               setValue('id_daerah', 0)
            }
         } else {
            clearErrors('id_daerah')
            setValue('id_daerah', undefined)
         }
      },
      [clearErrors, setValue]
   )
   const handleTahunChange = useCallback(
      (value: Selection) => {
         if (typeof value !== 'string' && Array.from(value)?.length) {
            const key = Array.from(value)
            const selectedTahun = Number(key[0])
            if (!isNaN(selectedTahun)) {
               clearErrors('tahun')
               setValue('tahun', selectedTahun)
            } else {
               clearErrors('tahun')
               setValue('tahun', 0)
            }
         } else {
            clearErrors('tahun')
            setValue('tahun', 0)
         }
      },
      [clearErrors, setValue]
   )

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
               <Image
                  objectFit='contain'
                  src='/images/logo_kab_lembata.png'
                  alt='logo'
                  layout='fill'
                  priority={false}
                  loading='eager'
               />
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
                        password: {
                           autoComplete: 'password',
                           label: 'Kata Sandi',
                        },
                     }}>
                     {({ password, username }) => (
                        <>
                           {username}
                           {password}
                           <Select
                              errorMessage={errors?.tahun?.message}
                              label='Tahun'
                              isInvalid={!!errors?.tahun}
                              variant='bordered'
                              required={true}
                              onSelectionChange={handleTahunChange}
                              defaultSelectedKeys={[TAHUN?.toString() ?? '']}
                              selectedKeys={[tahun?.toString() ?? '']}>
                              {years.map((year) => (
                                 <SelectItem
                                    key={year?.toString()}
                                    textValue={year?.toString()}>
                                    Tahun: {year}
                                 </SelectItem>
                              ))}
                           </Select>
                           {isSipd && (
                              <Select
                                 errorMessage={errors?.id_daerah?.message}
                                 label='Daerah'
                                 isInvalid={!!errors?.id_daerah}
                                 variant='bordered'
                                 required={isSipd}
                                 onSelectionChange={handleIdDaerahChange}
                                 defaultSelectedKeys={[ID_DAERAH?.toString() ?? '']}
                                 selectedKeys={[idDaerah?.toString() ?? '']}>
                                 {listDaerah.map((daerah) => (
                                    <SelectItem
                                       key={daerah.id_daerah}
                                       value={daerah.id_daerah}>
                                       {daerah.nama_daerah?.replace('Kab.', 'Kabupaten')}
                                    </SelectItem>
                                 ))}
                              </Select>
                           )}
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
