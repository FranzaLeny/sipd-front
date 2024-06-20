export const metadata = {
   title: {
      default: 'Dashboard',
      template: `%s | DLH-Lembata`,
   },
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
   return <>{children}</>
}
