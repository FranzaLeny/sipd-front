import { getServerSession } from '@shared/server-actions/auth'

import FormLoginPeta from './_form-login-peta'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export default async function Layout({ children }: { children: React.ReactNode }) {
   const { hasAccess } = await getServerSession(['sipd_peta'])
   return <>{!hasAccess ? <FormLoginPeta /> : children}</>
}
