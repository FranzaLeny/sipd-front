export const metadata = {
   title: {
      default: 'Data',
      template: `%s | Data`,
   },
   keywords: ['Data'],
}
interface DataLayoutProps {
   children: React.ReactNode
}
export default async function DataLayout({ children }: DataLayoutProps) {
   return <>{children}</>
}
