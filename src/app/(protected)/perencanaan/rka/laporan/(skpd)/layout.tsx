import { getServerSession } from '@shared/server-actions/auth'

import ParamSelector from './_components/param-selector'

export default async function Layout({ children }: { children: React.ReactNode }) {
   const { user } = await getServerSession()
   return (
      <>
         {!!user && (
            <ParamSelector
               tahun={user?.tahun || 2024}
               id_unit={user?.id_unit}
               id_daerah={user?.id_daerah}
            />
         )}
         {children}
      </>
   )
}
