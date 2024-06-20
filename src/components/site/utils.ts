export function removeFromLast<T>(path: string, key: string): string | T {
   const i = path.lastIndexOf(key)

   return i === -1 ? path : path.substring(0, i)
}

export const getRoutePaths = (path: string, tag?: string) => {
   const pagePath = path ? removeFromLast<string>(path, '.') : path
   const pathname = pagePath

   return {
      pagePath,
      pathname,
   }
}
