import ErrorPage from '@components/ui/error'
import { getServerSession } from '@shared/server-actions/auth'

export const metadata = {
   title: {
      template: `SIPD | %s`,
   },
   keywords: ['perencanaan', 'sipd', 'dlh', 'sipd-dlh', 'lembata'],
}
interface SipdRiLayoutProps {
   children: React.ReactNode
}
export default async function SipdRiLayout({ children }: SipdRiLayoutProps) {
   const { hasAccess } = await getServerSession([
      'super_admin',
      'admin',
      'perencanaan',
      'admin_perencanaan',
      // 'sipd_ri',
   ])
   if (!hasAccess) return <ErrorPage code={403} />

   return <>{children}</>
}
