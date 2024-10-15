'use client'

import { useCallback, useMemo } from 'react'
import hasAccess from '@utils/chek-roles'
import { useSession as useSessionNext, type UseSessionOptions } from 'next-auth/react'

export function useSession(
   requerdRoles: RoleUser[] = [],
   options: UseSessionOptions<boolean> | undefined = undefined
) {
   const session = useSessionNext()
   const getAccess = useCallback(
      (accesRoles: RoleUser[]) =>
         !!session?.data?.user?.roles?.length && hasAccess(accesRoles, session?.data?.user?.roles),
      [session.data?.user?.roles]
   )
   const hasAcces = useMemo(() => getAccess(requerdRoles), [requerdRoles, getAccess])
   return { ...session, hasAcces, getAccess }
}
