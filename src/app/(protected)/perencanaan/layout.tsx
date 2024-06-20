import ErrorPage from '@components/ui/error'
import { getServerSession } from '@shared/server-actions/auth'

export const metadata = {
   title: {
      default: 'Perencanaan',
      template: `%s | Perencanaan`,
   },
   keywords: ['perencanaan', 'sipd', 'dlh', 'sipd-dlh', 'lembata'],
}
interface PerencanaanLayoutProps {
   children: React.ReactNode
}
export default async function PerencanaanLayout({ children }: PerencanaanLayoutProps) {
   const { hasAccess } = await getServerSession([
      'super_admin',
      'admin',
      'perencanaan',
      'admin_perencanaan',
   ])
   if (hasAccess) {
      return <>{children}</>
   } else {
      return <ErrorPage code={403} />
   }
}
