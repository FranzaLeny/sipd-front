export function snakeToProperCase(snakeCaseString: string) {
   const words = snakeCaseString.split('_')
   const properCaseWords = words.map((word) => {
      const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      return capitalizedWord
   })
   const properCaseString = properCaseWords.join(' ')
   return properCaseString
}

export function propperCase(snakeCaseString: string) {
   const words = snakeCaseString.split(' ')
   const properCaseWords = words.map((word) => {
      const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      return capitalizedWord
   })
   const properCaseString = properCaseWords.join(' ')
   return properCaseString
}

export const titleCase = (s: string, f = false) =>
   s
      .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase())
      .replace(/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase())

export const toTitleCase = (s: string, f = false) => {
   if (f) {
      return s.toLowerCase().replace(/(^|[.?!]\s+)([a-z])/g, (match) => match.toUpperCase())
   } else {
      return s.replace(/(^|[.?!]\s+)([a-z])/g, (match) => match.toUpperCase())
   }
}

export function slug(str: string) {
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
