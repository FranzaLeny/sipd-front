'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { NumberInput, PasswordInput, TextInput } from '@components/form/text-input'
import Loading from '@components/ui/loading'
import axios from '@custom-axios/index'
import {
   Button,
   Card,
   CardBody,
   Modal,
   ModalBody,
   ModalContent,
   ModalFooter,
   ModalHeader,
} from '@nextui-org/react'
import { createTsForm, createUniqueFieldSchema } from '@ts-react/form'
import { decodeJwt } from 'jose'
import { z } from 'zod'
import { useSession } from '@shared/hooks/use-session'

const password = createUniqueFieldSchema(z.string({ description: 'Password' }).min(1), 'password')
const mapping = [
   [z.string(), TextInput] as const,
   [z.number(), NumberInput] as const,
   [password, PasswordInput] as const,
] as const

interface FormProps extends React.HTMLAttributes<HTMLFormElement> {}
const CardForm = (props: FormProps) => {
   return (
      <form
         className='flex flex-col gap-3'
         {...props}
      />
   )
}

interface SessionSipdPeta {
   iss: string
   sub: string
   exp: number
   iat: number
   tahun: number
   id_user: number
   id_daerah: number
   kode_provinsi: string
   id_skpd: number
   id_role: number
   id_pegawai: number
   sub_domain_daerah: string
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
      password: password,
   })
   .strict()
type SignIn = z.infer<typeof LoginSipdPeta>

const signInSipdPeta = async (credentials: LoginSipdPetaPayload) => {
   return await axios
      .post<LoginSipdPetaResponse>(
         'https://service.sipd.kemendagri.go.id/auth/auth/login',
         credentials
      )
      .then(async (res) => {
         try {
            const decode = decodeJwt(res.token) as SessionSipdPeta
            const { exp, iat, ...account } = decode
            return { accountPeta: { account, token: res?.token } }
         } catch (error: any) {
            console.error(error?.message)
            throw { message: 'Proses extrak token gagal' }
         }
      })
      .catch((e: any) => {
         return Promise.reject({ message: e?.message, error: e?.response?.data })
      })
}

const preLoginSipdPeta = async (credentials: PreLoginSipdPetaPayload) => {
   return await axios.post<PreLoginSipdPetaResponse>(
      'https://service.sipd.kemendagri.go.id/auth/auth/pre-login',
      credentials
   )
}

const LoginPetaSchema = LoginSipdPeta.extend({
   username: z.string().min(6, { message: 'Wajib diisi' }),
   id_daerah: z.coerce.number(),
   id_pegawai: z.coerce.number(),
   id_role: z.coerce.number(),
   id_skpd: z.coerce.number(),
}).strip()

export default function FormLoginPeta() {
   const [loginData, setLoginData] = useState<PreLoginSipdPetaPayload>()
   const [users, setUsers] = useState<PreLoginSipdPetaResponse>([])
   const [isLoading, setIsLoading] = useState(false)
   const [error, setError] = useState('')
   const { hasAcces, update } = useSession(['sipd_peta'])
   const router = useRouter()
   const handleLoginSipdPeta = useCallback(
      async (credentials: LoginSipdPetaPayload) => {
         setIsLoading(true)
         try {
            if (!credentials) {
               throw new Error('tidak ada users')
            }
            setLoginData(undefined)
            setUsers([])
            const validCredentials = LoginPetaSchema.parse(credentials)
            await signInSipdPeta(validCredentials)
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
         } catch (e) {
            setError('Terjadi kesalahan')
            setIsLoading(false)
         }
      },
      [router, update]
   )

   const handleClose = useCallback(() => {
      !isLoading && router.back()
   }, [router, isLoading])

   const handleSubmit = useCallback(
      async (data: SignIn) => {
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
                  if (users?.length === 1) {
                     return await handleLoginSipdPeta({ ...users?.[0], ...credentials })
                  } else if (users?.length) {
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
      },
      [handleLoginSipdPeta]
   )
   return (
      <>
         <Modal
            size='md'
            isOpen={!hasAcces}
            onClose={handleClose}>
            <ModalContent>
               {isLoading && <Loading className='fixed inset-0 z-[999] h-screen w-screen' />}
               <ModalHeader>SIPD Penatausahaan</ModalHeader>
               <ModalBody>
                  <p className='text-danger'>{error}</p>
                  {users?.length > 0 && !!loginData ? (
                     <>
                        {users?.map((user, i) => {
                           return (
                              <Card
                                 isPressable={!!loginData}
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
                        }}
                     />
                  )}
               </ModalBody>
               <ModalFooter>
                  {!!users?.length ? (
                     <p className=' p-4 text-center'>
                        Pilih Jabatan yang ingin dingunakan pada SIPD Penataushaan
                     </p>
                  ) : (
                     <Button
                        disabled={!!users?.length}
                        color='primary'
                        form='sipd-peta-login'
                        isLoading={isLoading}
                        type='submit'>
                        Masuk
                     </Button>
                  )}
               </ModalFooter>
            </ModalContent>
         </Modal>
      </>
   )
}
