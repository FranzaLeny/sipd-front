import { signInUserToSipdRi } from '@actions/perencanaan/auth-sipd-ri'
import getAccess from '@utils/chek-roles'
import { z } from '@zod'
import { unionBy } from 'lodash-es'
import { getServerSession as _getServerSession, AuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { fromZodError } from 'zod-validation-error'

import { signInUserToApi } from './auth-api'

export const authOptions: AuthOptions = {
   secret: process.env.NEXTAUTH_SECRET ?? 'secret_key',
   providers: [
      CredentialsProvider({
         id: 'credentials',
         name: 'Credentials',
         credentials: {
            tahun: {
               label: 'Tahun',
               type: 'number',
               placeholder: '',
            },
            id_daerah: {
               label: 'Daerah',
               type: 'number',
               placeholder: '',
            },
            username: {
               label: 'Username',
               type: 'text',
               placeholder: '19xxxxx',
            },
            password: {
               label: 'Password',
               type: 'password',
               placeholder: '',
            },
         },
         async authorize(credentials, req) {
            const userAgent = req.headers?.['user-agent']
            const localSchema = z.object({
               username: z
                  .string()
                  .regex(/^(?!.*-sipd$).*$/, { message: 'tidak boleh diakhiri dengan "-sipd"' }),
               user_agent: z.string(),
               password: z.string(),
               tahun: z.coerce.number(),
            })
            const sipdSchema = z.object({
               username: z
                  .string()
                  .regex(/.*-sipd$/, { message: 'harus diakhiri dengan "-sipd"' })
                  .transform((value) => value.slice(0, -5)),
               userAgent: z.string(),
               password: z.string(),
               id_daerah: z.coerce.number(),
               tahun: z.coerce.number(),
            })
            // const credentialsSchema = sipdSchema
            const credentialsSchema = z.union([sipdSchema, localSchema])

            try {
               const validCredentials = credentialsSchema.parse({
                  ...credentials,
                  user_agent: userAgent,
                  userAgent,
               })
               const user =
                  'id_daerah' in validCredentials
                     ? await signInUserToSipdRi(validCredentials)
                     : await signInUserToApi(validCredentials)

               if (!user) {
                  throw new Error('User not tidak ditemukan')
               }

               return user
            } catch (error: any) {
               let message = error?.message
               if (error instanceof z.ZodError) {
                  message = fromZodError(error, {
                     prefix: null,
                     maxIssuesInMessage: 10,
                  })?.message?.replace(/\bat\b/g, 'pada')
               }
               console.error('loginerror', error?.message)
               throw new Error(message)
            }
         },
      }),
   ],
   session: {
      maxAge: 60 * 60 * 6 + 30,
   },

   callbacks: {
      async jwt({ token, user, session, account, trigger }) {
         if (trigger === 'update' && session) {
            for (const [key, value] of Object.entries(session)) {
               if (key === 'accountPeta' && !!token) {
                  let { roles = [], tokens = [] } = token as any
                  if (!!session[key]?.token && !!session[key]?.account) {
                     tokens.unshift({ name: 'sipd_peta', token: session[key]?.token })
                     roles = [...new Set([...roles, 'sipd_peta'])]
                     token.tokens = unionBy(tokens, 'name')
                     token.roles = roles
                     token.accountPeta = session[key]?.account
                  }
               } else {
                  token[key] = value
               }
            }
         }
         if (user) {
            return { ...user }
         }
         return token
      },
      async session({ session, token }) {
         const filteredToken = Object.entries(token)
            .filter(([key]) => !['iat', 'exp', 'jti'].includes(key))
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {} as User)
         return { ...session, user: filteredToken }
      },
   },

   pages: {
      signIn: '/login',
      error: '/login',
   },
   logger: {
      error(code: any, metadata: any) {
         console.error('--Error auth', code)
      },
      warn(code: any) {
         console.warn('--Warn auth', code)
      },
      debug(code: any, metadata: any) {
         console.debug('--Debug auth', code, metadata)
      },
   },
   cookies: {
      sessionToken: {
         name:
            process.env.NEXTAUTH_URL?.startsWith('https://') ?? !!process.env.VERCEL
               ? '__Secure-next-auth.session-token'
               : 'next-auth.session-token',
         options: {
            httpOnly: false,
            sameSite: 'lax',
            path: '/',
            secure: process.env.NEXTAUTH_URL?.startsWith('https://') ? true : false,
         },
      },
   },
}

type SessionResult =
   | {
        isAuthenticated: false
        hasAccess: false
        user?: undefined
        expires?: undefined
     }
   | {
        isAuthenticated: true
        hasAccess: true
        user: User
        expires: string
     }

export const getServerSession = async (requiredRoles?: RoleUser[]): Promise<SessionResult> => {
   const session = await _getServerSession(authOptions)
   if (!session?.user) {
      return { isAuthenticated: false, hasAccess: false }
   }
   const hasAccess = requiredRoles ? getAccess(requiredRoles, session.user.roles) : true
   return {
      ...session,
      isAuthenticated: true,
      hasAccess: hasAccess,
   } as SessionResult
}

export default authOptions
