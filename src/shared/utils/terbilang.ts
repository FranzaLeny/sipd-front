function _terbilang(convertNumber: number) {
   const words = [
      '',
      'Satu',
      'Dua',
      'Tiga',
      'Empat',
      'Lima',
      'Enam',
      'Tujuh',
      'Delapan',
      'Sembilan',
      'Sepuluh',
      'Sebelas',
   ]

   const convert = (n: number): string => {
      if (n < 12) {
         return words[n]
      } else if (n < 20) {
         return words[n - 10] + ' Belas'
      } else if (n < 100) {
         const primary = Math.floor(n / 10)
         const start = primary
         const end = n % 10
         return words[start] + ' Puluh ' + words[end]
      } else if (n < 200) {
         return 'Seratus ' + convert(n - 100)
      } else if (n < 1000) {
         const primary = Math.floor(n / 100)
         const start = primary
         const end = n % 100
         return words[start] + ' Ratus ' + convert(end)
      } else if (n < 10000) {
         const primary = Math.floor(n / 1000)
         const start = primary
         const end = n % 1000
         return words[start] + ' Ribu ' + convert(end)
      } else if (n < 1000000) {
         const primary = Math.floor(n / 1000)
         const start = primary
         const end = n % 1000
         return convert(start) + ' Ribu ' + convert(end)
      } else if (n < 1000000000) {
         const primary = Math.floor(n / 1000000)
         const start = primary
         const end = n % 1000000
         return convert(start) + ' Juta ' + convert(end)
      } else if (n < 1000000000000) {
         const primary = Math.floor(n / 1000000000)
         const start = primary
         const end = n % 1000000000
         return convert(start) + ' Milyar ' + convert(end)
      } else {
         return String(n)
      }
   }

   return convert(convertNumber)
}

function terbilang(value: number) {
   //   const isNegative = value < 0
   //   const absoluteValue = Math.abs(value)
   //   const stringValue = String(absoluteValue)

   //   const [integerPart, decimalPart = ''] = stringValue.split('.')

   //   const terbilangInteger = _terbilang(Number(integerPart))

   //   let terbilangDecimal = ''
   //   if (decimalPart.length > 0) {
   //     terbilangDecimal = decimalPart
   //       .split('')
   //       .map((digit) => (Number(digit) > 0 ? _terbilang(Number(digit)) : 'Nol'))
   //       .join(' ')
   //   }

   //   let result = terbilangInteger.replace(/\s{2,}/g, ' ').trim()
   //   if (terbilangDecimal.length > 0) {
   //     result += ' Koma ' + terbilangDecimal
   //   }

   //   if (isNegative) {
   //     result = 'Minus ' + result
   //   }

   //   return result
   return _terbilang(value)
      .replace(/\s{2,}/g, ' ')
      .trim()
}

export default terbilang
