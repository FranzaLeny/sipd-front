export default function hasAccess(
   accesRoles: string[] = [],
   userRoles: string[] | null = []
): boolean {
   return !!userRoles?.some((role) => accesRoles.includes(role))
}
