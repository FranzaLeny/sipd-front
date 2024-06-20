'use client'

import { Tooltip } from '@nextui-org/react'
import { useDateFormatter, useLocale } from '@react-aria/i18n'
import { intlFormatDistance } from 'date-fns/intlFormatDistance'

type DiffForHumansProps = {
   value?: string | number | Date | null
}

export const DiffForHumans = ({ value }: DiffForHumansProps) => {
   const { locale } = useLocale()
   let formater = useDateFormatter({
      dateStyle: 'full',
      timeStyle: 'full',
   })
   const content = value
      ? intlFormatDistance(value, new Date(), { locale, style: 'narrow', numeric: 'auto' })
      : ''
   const date = value ? formater.format(new Date(value)) : ''

   if (date && content) {
      return (
         <Tooltip
            size='sm'
            closeDelay={200}
            className=''
            classNames={{ content: 'max-w-52 ' }}
            content={date}>
            <div className='capitalize'>{content}</div>
         </Tooltip>
      )
   } else {
      return null
   }
}
