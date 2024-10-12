export function toRoman(value: number | string) {
   let num = typeof value === 'string' ? parseInt(value) : value
   const romanNumerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']
   const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]

   return values.reduce((roman, value, i) => {
      while (num >= value) {
         roman += romanNumerals[i]
         num -= value
      }
      return roman
   }, '')
}

export const eselonToString = (eselon: number) => {
   if (eselon <= 5) {
      return `Eselon ${toRoman(eselon)}`
   } else {
      return 'Non Eselon'
   }
}
