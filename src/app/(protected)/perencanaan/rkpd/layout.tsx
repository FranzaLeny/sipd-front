export const metadata = {
   title: {
      default: 'RKPD',
      template: `%s | RKPD`,
   },
   keywords: ['rkpd'],
}
interface PerencanaanLayoutProps {
   children: React.ReactNode
}
export default async function PerencanaanLayout({ children }: PerencanaanLayoutProps) {
   return <>{children}</>
}
