'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@react-aria/i18n'
import { intlDurationFormat } from '@utils/intlDurationFormat'
import { intervalToDuration } from 'date-fns/intervalToDuration'

interface TimerProps {
   waktuSelesai: string | Date
}

const Timer: React.FC<TimerProps> = ({ waktuSelesai }) => {
   const [duration, setDuration] = useState('')
   const { locale } = useLocale()
   useEffect(() => {
      const intervalId = setInterval(() => {
         const times = intervalToDuration({
            start: new Date(),
            end: waktuSelesai,
         })
         const durationText = intlDurationFormat(times, locale)
         if (!durationText || durationText.startsWith('-')) {
            setDuration('Selesai')
            clearInterval(intervalId)
         } else {
            setDuration(durationText)
         }
      }, 1000)

      return () => {
         clearInterval(intervalId)
      }
   }, [waktuSelesai, locale])

   return <>{duration}</>
}

export default Timer
