export type Duration = {
   years: number
   months: number
   days: number
   hours: number
   minutes: number
   seconds: number
}

export function intlDurationFormat(duration: Partial<Duration>, locale = 'en-US'): string {
   let startText = ''
   const formater = new Intl.DisplayNames(locale, {
      style: 'short',
      localeMatcher: 'best fit',
      type: 'dateTimeField',
   })
   const formatter = (value: number, unit: string) => {
      try {
         if (unit.endsWith('s')) {
            unit = unit.slice(0, -1)
         }
         return [value, formater.of(unit)].join(' ')
      } catch (error) {
         return [value, unit].join(' ')
      }
   }
   const results = Object.entries(duration)
      .filter(([_, value]) => value !== undefined)
      .map(([unit, value]) => {
         if (value < 0) {
            startText = '- '
         }
         return formatter(Math.abs(value), unit)
      })

   return startText + results.join(' ')
}
