/**
 * Converts a string to proper case, where the first letter of each word is capitalized.
 * If the `forceLowerCase` parameter is true, the entire string is first converted to
 * lower case before capitalizing the first letter of each word.
 *
 * @param {string} text The string to be converted
 * @param {boolean} [forceLowerCase=false] Whether to convert the entire string to lower case before processing
 * @return {string} The converted string in proper case
 */
export const toProperCase = (text: string, forceLowerCase: boolean = false): string => {
   if (forceLowerCase) {
      return text.toLowerCase().replace(/\b\w/g, (match) => match.toUpperCase())
   } else {
      return text.replace(/\b\w/g, (match) => match.toUpperCase())
   }
}

/**
 * Converts a string from snake case to title case. If the second parameter is
 * true, the entire string is first converted to lower case before converting
 * to title case.
 *
 * @param {string} text The string to convert
 * @return {string} The converted string
 */

export const snakeToTileCase = (text: string): string =>
   text
      .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase())
      .replace(/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase())

/**
 * Returns a string with the first letter of each sentence capitalized. If
 * the second parameter is true, the entire string is first converted to
 * lower case before capitalizing the first letter of each sentence.
 *
 * @param {string} s The string to convert
 * @param {boolean} [forceLowerCase =false] Set to true to convert the entire string to
 * lower case before capitalizing the first letter of each sentence.
 * @return {string} The converted string
 */

export const toTitleCase = (text: string, forceLowerCase: boolean = false): string => {
   if (forceLowerCase) {
      return text.toLowerCase().replace(/(^|[.?!]\s+)([a-z])/g, (match) => match.toUpperCase())
   } else {
      return text.replace(/(^|[.?!]\s+)([a-z])/g, (match) => match.toUpperCase())
   }
}

export function toSlug(str: string) {
   str = str.toLowerCase().trim()
   str = str.replace(/\s+/g, '-')
   str = str.replace(/[^\w\-]+/g, '')
   return str
}

export function decryptBase64String(encodedString: string) {
   let reversedString = atob(encodedString)
   let reversedStringLength = reversedString.length - 1
   let decryptedString = ''

   while (reversedStringLength >= 0) {
      decryptedString += reversedString.charAt(reversedStringLength)
      reversedStringLength--
   }

   let finalDecodedString = atob(decryptedString)
   let finalStringLength = finalDecodedString.length - 1
   let parsedResult = ''

   while (finalStringLength >= 0) {
      parsedResult += finalDecodedString.charAt(finalStringLength)
      finalStringLength--
   }
   return parsedResult ? JSON.parse(parsedResult) : []
}

export function isNumber(str: string): boolean {
   const number = parseFloat(str)
   return !isNaN(number)
}

export function numberToMonth(angka: number) {
   const namaBulan = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
   ]

   // Mengonversi angka bulan menjadi nama bulan
   if (angka >= 1 && angka <= 12) {
      return namaBulan[angka - 1]
   } else {
      return 'Bulan tidak valid'
   }
}

export const numberToText = (
   v?: number | null,
   minimumFractionDigits = 0,
   useBracket = false,
   zero = '0'
) => {
   if (v) {
      const value = v.toFixed(minimumFractionDigits)
      const result = Number(value)
         .toLocaleString('id-ID', {
            style: 'decimal',
            // minimumFractionDigits: minimumFractionDigits,
         })
         .toString()
      if (useBracket && v < 0) {
         return '(' + result.replace('-', '') + ')'
      }
      return result
   }
   return zero
}

export const numberToRupiah = (
   v = 0 as number | string | null | undefined,
   minimumFractionDigits = 0
): string => {
   if (typeof v === 'number') {
      const value = v?.toFixed(minimumFractionDigits)
      return Number(value || 0)
         .toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits,
         })
         .toString()
         ?.replace(/\s/g, '')
   } else if (!!v) {
      const str = v.trim()
      // chek jika string tersebut hanya berisi angka
      if (str.match(/^\d+$/)) {
         return Number(v)
            .toLocaleString('id-ID', {
               style: 'currency',
               currency: 'IDR',
               minimumFractionDigits,
            })
            .toString()
            ?.replace(/\s/g, '')
      }
   }
   return v || '0'
}

export const splitKodeAkun = (kode_akun: string) => {
   const kode_akuns = kode_akun.split('.')
   return {
      kode_akun_1: kode_akuns.slice(0, 1).join('.'),
      kode_akun_2: kode_akuns.slice(0, 2).join('.'),
      kode_akun_3: kode_akuns.slice(0, 3).join('.'),
      kode_akun_4: kode_akuns.slice(0, 4).join('.'),
      kode_akun_5: kode_akuns.slice(0, 5).join('.'),
      kode_akun_6: kode_akuns.slice(0, 6).join('.'),
   }
}
