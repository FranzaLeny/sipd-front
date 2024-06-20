export const metadata = {
   title: {
      template: `Data | %s`,
   },
}
interface DataPerencanaanLayoutProps {
   children: React.ReactNode
}
export default async function DataPerencanaanLayout({ children }: DataPerencanaanLayoutProps) {
   return <>{children}</>
}
