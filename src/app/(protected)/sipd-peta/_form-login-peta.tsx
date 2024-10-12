'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCaptchaSipdPeta, preLoginSipdPeta, signInSipdPeta } from '@actions/penatausahaan/auth'
import { TextInput } from '@components/form/text-input'
import Loading from '@components/ui/loading'
import {
   Button,
   Card,
   CardBody,
   Image,
   Input,
   Modal,
   ModalBody,
   ModalContent,
   ModalFooter,
   ModalHeader,
} from '@nextui-org/react'
import { createTsForm } from '@ts-react/form'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { useSession } from '@shared/hooks/use-session'

const mapping = [[z.string(), TextInput] as const, [z.number(), TextInput] as const] as const

interface FormProps extends React.HTMLAttributes<HTMLFormElement> {}
const CardForm = (props: FormProps) => {
   return (
      <form
         className='flex flex-col gap-3'
         {...props}
      />
   )
}

const TsForm = createTsForm(mapping, { FormComponent: CardForm })
const LoginSipdPeta = z
   .object({
      tahun: z
         .number({
            description: 'Tahun ',
         })
         .min(2024)
         .max(new Date().getFullYear() + 1)
         .default(2024),
      username: z
         .string()
         .regex(/^(?=.*-peta$).{6,}$/, { message: 'harus diakhiri dengan "-peta"' })
         .min(6, { message: 'Wajib diisi' }),
      password: z.string({ description: 'Password' }).trim().min(1),
   })
   .strict()
type SignIn = z.infer<typeof LoginSipdPeta>

interface CaptchaSipdPeta {
   audio: string
   base64: string
   id: string
}

const LoginPetaSchema = LoginSipdPeta.extend({
   username: z.string().min(6, { message: 'Wajib diisi' }),
   id_daerah: z.coerce.number(),
   id_pegawai: z.coerce.number(),
   id_role: z.coerce.number(),
   id_skpd: z.coerce.number(),
   captcha_id: z.string().trim().min(1, { message: 'Captcha masih kosong' }),
   captcha_solution: z.string().length(6, { message: 'Captcha Harus 6 Karakter' }),
}).strip()

export default function FormLoginPeta() {
   const [loginData, setLoginData] = useState<PreLoginSipdPetaPayload>()
   const [users, setUsers] = useState<PreLoginSipdPetaResponse>([])
   const [captcha, setCaptcha] = useState<CaptchaSipdPeta>()
   const [captaSolution, setCaptaSolution] = useState('')
   const [isLoading, setIsLoading] = useState(false)
   const [error, setError] = useState('')
   const { hasAcces, update } = useSession(['sipd_peta'])
   const router = useRouter()
   const handleLoginSipdPeta = useCallback(
      async (credentials: LoginSipdPetaPayload) => {
         setIsLoading(true)
         try {
            if (!credentials) {
               throw new Error('Tidak ada users')
            }
            const validCredentials = LoginPetaSchema.safeParse({
               ...credentials,
               captcha_solution: captaSolution,
               captcha_id: captcha?.id,
            })
            if (validCredentials.error) {
               const message = fromZodError(validCredentials.error, {
                  includePath: false,
                  prefix: 'Data tidak valid',
               })
                  .toString()
                  ?.replaceAll(' at ', ' pada ')
               throw new Error(message)
            }
            setLoginData(undefined)
            setUsers([])
            await signInSipdPeta(validCredentials.data)
               .then(async (data) => {
                  await update(data)
               })
               .catch((e: any) => {
                  if (typeof e?.message === 'string') {
                     setError(e?.message)
                  }
                  throw new Error('Terjadi kesalahan')
               })
            router.refresh()
            setIsLoading(false)
         } catch (e: any) {
            setError(e?.message ?? 'Terjadi kesalahan')
            setIsLoading(false)
         }
      },
      [router, update, captcha, captaSolution]
   )

   const handleClose = useCallback(() => {
      !isLoading && router.back()
   }, [router, isLoading])

   const handleSubmit = useCallback(async (data: SignIn) => {
      setError('')
      setIsLoading(true)
      try {
         const credentials = {
            ...data,
            username: data?.username?.slice(0, -5),
         }
         setLoginData(credentials)
         return await preLoginSipdPeta(credentials)
            .then(async (users) => {
               // if (users?.length === 1) {
               //    return await handleLoginSipdPeta({ ...users?.[0], ...credentials })
               // } else
               await getCaptchaSipdPeta().then((captcha) => {
                  setCaptcha(captcha)
               })
               if (users?.length) {
                  setUsers(users)
                  setIsLoading(false)
               } else {
                  setError('Gagal Login')
                  throw new Error('Gagal Login ke sipd-ri')
               }
            })
            .catch((e: any) => {
               if (typeof e?.message === 'string') {
                  setError(e?.message)
               }
               throw new Error('Gagal Login ke sipd-ri')
            })
      } catch (error) {
         setIsLoading(false)
      }
   }, [])
   return (
      <>
         <Modal
            size='2xl'
            isOpen={!hasAcces}
            onClose={handleClose}>
            <ModalContent>
               {isLoading && <Loading className='fixed inset-0 z-[999] h-screen w-screen' />}
               <ModalHeader>SIPD Penatausahaan</ModalHeader>
               <ModalBody>
                  <p className='text-danger'>{error}</p>
                  {users?.length > 0 && !!loginData ? (
                     <>
                        <div className='light flex flex-col items-center gap-3 bg-white p-3 text-black'>
                           {/* <div className='relative mx-auto h-24 w-1/3 text-center'> */}
                           {captcha?.base64 && (
                              <Image
                                 height={300}
                                 alt='captcha'
                                 src={`data:image/jpeg;base64,${captcha?.base64}`}
                              />
                           )}
                           {/* </div> */}
                           <Input
                              variant='bordered'
                              label='Masukan Captcha di atas'
                              value={captaSolution ?? ''}
                              onValueChange={setCaptaSolution}
                           />
                        </div>
                        {users?.map((user, i) => {
                           return (
                              <Card
                                 isPressable={!!loginData && captaSolution?.length === 6}
                                 onPress={() => handleLoginSipdPeta({ ...loginData, ...user })}
                                 key={user.id_role + '-' + i}>
                                 <CardBody>
                                    <div>{user.nama_role}</div>
                                    <div>{user.nama_skpd}</div>
                                 </CardBody>
                              </Card>
                           )
                        })}
                     </>
                  ) : (
                     <TsForm
                        formProps={{ id: 'sipd-peta-login' }}
                        defaultValues={{ tahun: new Date().getFullYear() }}
                        onSubmit={handleSubmit}
                        schema={LoginSipdPeta}
                        props={{
                           username: { description: 'Contoh username: 2024XXXXXXXXXX00001-peta' },
                           password: { type: 'password' },
                           tahun: { type: 'number' },
                        }}
                     />
                  )}
               </ModalBody>
               {!users?.length && (
                  <ModalFooter>
                     <Button
                        disabled={!!users?.length}
                        color='primary'
                        form='sipd-peta-login'
                        isLoading={isLoading}
                        type='submit'>
                        Masuk
                     </Button>
                  </ModalFooter>
               )}
            </ModalContent>
         </Modal>
      </>
   )
}
