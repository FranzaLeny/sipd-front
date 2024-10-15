'use client'

import { useCallback } from 'react'
import { cn, Radio, RadioGroup, type RadioGroupProps } from '@nextui-org/react'
import { useFieldInfo, useTsController } from '@ts-react/form'
import { titleCase } from '@utils'

export interface RadioGroupInputProps
   extends Pick<RadioGroupProps, Exclude<keyof RadioGroupProps, 'children'>> {
   hidden?: boolean
   errorMessage?: string
   typeValue?: 'number' | 'default'
   options?: { value: string; label: string }[]
}

const RadioGroupInput = (defaultProps: RadioGroupInputProps) => {
   // @ts-expect-error
   const { control, enumValues, hidden, typeValue, options, ...radiogroupProps } = defaultProps
   const { label, isNullable, isOptional, defaultValue } = useFieldInfo()
   const {
      error,
      field: { onChange, value, name, onBlur, ref },
   } = useTsController<any>()
   const handleChange = useCallback(
      (v: string) => {
         !!v ? (typeValue === 'number' ? onChange(parseInt(v)) : onChange(v)) : onChange(null)
      },
      [onChange, typeValue]
   )

   return (
      <RadioGroup
         color={radiogroupProps?.color}
         size={radiogroupProps?.size}
         aria-labelledby={name}
         id={name}
         label={radiogroupProps?.label ?? label ?? titleCase(name)}
         isRequired={!(isNullable && isOptional)}
         onBlur={onBlur}
         ref={ref}
         {...radiogroupProps}
         className={cn(hidden && 'hidden', radiogroupProps?.className)}
         value={value?.toString() ?? ''}
         errorMessage={error?.errorMessage}
         isInvalid={!!error}
         onValueChange={handleChange}>
         {options?.map((d) => (
            <Radio
               key={d.value}
               value={d.value}>
               {d.label}
            </Radio>
         ))}
      </RadioGroup>
   )
}

export default RadioGroupInput
