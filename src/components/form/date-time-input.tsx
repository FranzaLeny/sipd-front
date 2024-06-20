import { useCallback, useMemo } from 'react'
import { DateValue, getLocalTimeZone, parseAbsoluteToLocal } from '@internationalized/date'
import { Button, DatePicker, DatePickerProps } from '@nextui-org/react'
import { useFieldInfo, useTsController } from '@ts-react/form'
import { titleCase } from '@utils'
import { Eye } from 'lucide-react'

export type Props = Omit<Omit<Omit<DatePickerProps, 'onValueChange'>, 'defaultValue'>, 'value'> & {
   isClearable?: boolean
}
const DateInput = ({ isClearable, ...inputProps }: Props) => {
   const { label, defaultValue } = useFieldInfo()
   const {
      error,
      field: { onChange, value: fieldValue, name },
      formState: { isSubmitting },
      fieldState: { invalid },
   } = useTsController<Date | null>()

   const handleChange = useCallback(
      (val?: DateValue | null | undefined | any) => {
         onChange && onChange(val?.toDate(getLocalTimeZone()) ?? null)
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
   const labelPlacement = inputProps?.labelPlacement ?? 'inside'
   const props: DatePickerProps = {
      'aria-labelledby': name,
      variant: 'bordered',
      defaultValue: defaultValue ?? '',
      ...inputProps,
      errorMessage: error?.errorMessage ?? inputProps?.errorMessage,
      labelPlacement,
      onChange: handleChange,
      label: inputProps?.label ?? label ?? titleCase(name),
      isReadOnly: inputProps?.isReadOnly || isSubmitting,
      isInvalid: invalid || inputProps?.isInvalid,
      name,
      value,
      timeInputProps: { label: 'Waktu', ...inputProps.timeInputProps, lang: 'id' },
      startContent:
         inputProps?.startContent ?? isClearable ? (
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
   return (
      <DatePicker
         key={name}
         id={name}
         {...props}
      />
   )
}

export default DateInput
