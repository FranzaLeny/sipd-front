'use client'

import { useCallback, useMemo, useState } from 'react'
import { cn, Input, type InputProps } from '@nextui-org/react'
import { useLocale } from '@react-aria/i18n'
import { useFieldInfo, useTsController } from '@ts-react/form'
import { Eye, EyeOff } from 'lucide-react'
import { ZodNumber } from 'zod'
import { snakeToTileCase } from '@shared/utils'

const parseNumber = (value: string, decimalSeparator: string): number | null => {
   const cleanedString = value
      ?.split(decimalSeparator)
      .map((part) => part.replace(/[^\d]/g, ''))
      .join('.')
   return cleanedString ? parseFloat(cleanedString) : null
}

const parseLocaleString = (
   value: unknown,
   locale: Intl.LocalesArgument = 'id-ID',
   options: Intl.NumberFormatOptions = { style: 'decimal' }
): string => {
   return typeof value === 'number'
      ? value.toLocaleString(locale, { minimumFractionDigits: 0, ...options })
      : ''
}

function formatNumberStrig(
   inputString: string | number,
   locale: Intl.LocalesArgument,
   options: Intl.NumberFormatOptions,
   decimalSeparator: string
) {
   const parts = inputString
      .toLocaleString(locale)
      .split(decimalSeparator)
      .map((part) => part.replace(/[^\d]/g, ''))
   const firstPart = parseLocaleString(Number(parts[0]), locale, options)
   if (parts?.length > 1) {
      const restPart = parts.slice(1).join('')
      return [firstPart, restPart].join(decimalSeparator)
   }
   return firstPart
}

export interface TextInputProps
   extends Pick<
      InputProps,
      Exclude<keyof InputProps, 'errorMessage' | 'onValueChange' | 'value' | 'defaultValue'>
   > {
   hidden?: boolean
   numberFormatOptions?: Intl.NumberFormatOptions
   errorMessage?: string
}

export const TextInput = (defaultProps: TextInputProps) => {
   // @ts-expect-error
   const { numberFormatOptions, control, enumValues, hidden, ...inputProps } = defaultProps
   const [type, setType] = useState(inputProps?.type ?? 'text')
   const [value, setValue] = useState('')
   const {
      label,
      placeholder,
      defaultValue,
      isNullable,
      isOptional,
      zodType,
      type: types,
   } = useFieldInfo()
   const { locale } = useLocale()

   const decimalSeparator = useMemo(() => {
      const numberFormat = new Intl.NumberFormat(locale, numberFormatOptions)
      const parts = numberFormat.formatToParts(1234.56)
      const decimal = parts.find((p) => p.type === 'decimal')?.value || ''
      return decimal
   }, [numberFormatOptions, locale])

   const {
      error,
      field: { onChange, value: fieldValue, name = '', ref, onBlur },
      formState: { isSubmitting },
      fieldState: { invalid },
   } = useTsController<string | number | null | undefined>()

   const isNumber = useMemo(() => {
      return types === 'number' || zodType instanceof ZodNumber
   }, [types, zodType])

   const labelField = useMemo(() => {
      const index = name.match(/\[(\d+)\]/)
      if (index) {
         const indexNumber = parseInt(index[1])
         return `${label ?? snakeToTileCase(name?.replace(/\[\d+\]/, ''))} ${indexNumber + 1}`
      }
      return label ?? snakeToTileCase(name)
   }, [name, label])
   const handleChange = useCallback(
      (val: string) => {
         setValue(val)
         if (isNumber) {
            const _val = parseNumber(val, decimalSeparator)
            onChange(_val)
         } else {
            setValue(val)
            onChange(val ? val : isNullable ? null : undefined)
         }
      },
      [onChange, decimalSeparator, isNullable, isNumber]
   )
   const passwordToggle = () => {
      if (inputProps?.type === 'password' && !inputProps?.isClearable) {
         const toggleVisibility = () => setType((old) => (old === 'text' ? 'password' : 'text'))
         return (
            <button
               className='focus:outline-none'
               type='button'
               onClick={toggleVisibility}>
               {type === 'password' ? (
                  <Eye className='text-default-400 pointer-events-none text-2xl' />
               ) : (
                  <EyeOff className='text-default-400 pointer-events-none text-2xl' />
               )}
            </button>
         )
      }
   }

   const _value = useMemo(() => {
      if (fieldValue === undefined || fieldValue === null) {
         return ''
      }
      if (isNumber && !!numberFormatOptions) {
         const stringValue = formatNumberStrig(value, locale, numberFormatOptions, decimalSeparator)
         const numberValue = parseNumber(value, decimalSeparator)
         if (stringValue === value || fieldValue === numberValue) {
            return stringValue
         }
         return formatNumberStrig(fieldValue, locale, numberFormatOptions, decimalSeparator)
      }
      return fieldValue.toString()
   }, [fieldValue, value, locale, isNumber, decimalSeparator, numberFormatOptions])

   const isRequired = !(isNullable && isOptional)
   const labelPlacement = inputProps?.labelPlacement ?? 'inside'
   const props: InputProps = {
      'aria-labelledby': name,
      variant: 'bordered',
      autoComplete: name?.replace(/\[\d+\]/, ''),
      id: name,
      isRequired,
      defaultValue: defaultValue ?? '',
      ref,
      onBlur,
      ...inputProps,
      errorMessage: error?.errorMessage,
      labelPlacement,
      className: cn(hidden && 'hidden', inputProps?.className),
      onValueChange: handleChange,
      label: inputProps?.label ?? labelField,
      placeholder: inputProps?.placeholder ?? placeholder,
      isReadOnly: inputProps?.isReadOnly || isSubmitting,
      isInvalid: invalid || inputProps?.isInvalid,
      value: _value,
      type: type !== 'password' ? 'text' : type,
      isClearable:
         (inputProps?.isClearable ??
         (inputProps?.isReadOnly || inputProps?.type === 'password' || !!inputProps?.endContent))
            ? false
            : true,
      endContent: inputProps?.endContent ?? passwordToggle(),
   }
   return <Input {...props} />
}

export default TextInput
