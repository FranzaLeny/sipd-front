'use client'

import { useCallback, useMemo } from 'react'
import { getLocalTimeZone, parseAbsoluteToLocal, type DateValue } from '@internationalized/date'
import { Button, cn, DatePicker, type DatePickerProps } from '@nextui-org/react'
import { useFieldInfo, useTsController } from '@ts-react/form'
import { titleCase } from '@utils'
import { Eye } from 'lucide-react'

export interface DateInputProps
   extends Pick<
      DatePickerProps,
      Exclude<keyof DatePickerProps, 'onValueChange' | 'defaultValue' | 'value'>
   > {
   hidden?: boolean
   numberFormatOptions?: Intl.NumberFormatOptions
   errorMessage?: string
   isClearable?: boolean
}

export const DateInput = (defaultProps: DateInputProps) => {
   // @ts-expect-error
   const { control, enumValues, hidden, isClearable, ...datePickerProps } = defaultProps
   const { label, defaultValue } = useFieldInfo()
   const {
      error,
      field: { onChange, value: fieldValue, name, onBlur, ref },
      formState: { isSubmitting },
      fieldState: { invalid },
   } = useTsController<Date | null>()

   const handleChange = useCallback(
      (val?: DateValue | null | undefined | any) => {
         onChange && onChange(val.toDate(getLocalTimeZone()) ?? null)
      },
      [onChange]
   )

   const value: DateValue | null | any = useMemo(() => {
      return typeof fieldValue === 'string'
         ? parseAbsoluteToLocal(fieldValue)
         : fieldValue instanceof Date
           ? parseAbsoluteToLocal(fieldValue.toISOString())
           : null
   }, [fieldValue])
   const labelPlacement = datePickerProps?.labelPlacement ?? 'inside'
   const props: DatePickerProps = {
      'aria-labelledby': name,
      variant: 'bordered',
      defaultValue: defaultValue ?? '',
      onBlur,
      ref,
      ...datePickerProps,
      errorMessage: error?.errorMessage ?? datePickerProps?.errorMessage,
      labelPlacement,
      onChange: handleChange,
      label: datePickerProps?.label ?? label ?? titleCase(name),
      isReadOnly: datePickerProps?.isReadOnly || isSubmitting,
      isInvalid: invalid || datePickerProps?.isInvalid,
      value,
      className: cn(hidden && 'hidden', datePickerProps?.className),
      timeInputProps: { label: 'Waktu', ...datePickerProps?.timeInputProps, lang: 'id' },
      startContent:
         (datePickerProps?.startContent ?? isClearable) ? (
            <Button
               className='-ml-2'
               radius='full'
               size='sm'
               onPress={() => handleChange()}
               isIconOnly>
               <Eye className='size-6' />
            </Button>
         ) : undefined,
   }
   return <DatePicker {...props} />
}

export default DateInput
