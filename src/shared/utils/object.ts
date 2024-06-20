export const toArrayOfObject = <T extends Record<any, any>>(object: T) => {
   return Object.keys(object).map((key) => ({
      [key as keyof T]: object[key as keyof T],
   }))
}
export function isObjectEmpty(obj: any) {
   for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
         return false
      }
   }
   return true
}
