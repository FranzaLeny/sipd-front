'use client'

import { useCallback } from 'react'
import { Checkbox, type CheckboxProps } from '@nextui-org/react'
import { useFieldInfo, useTsController } from '@ts-react/form'
import { titleCase } from '@utils'

export interface BooleanInputProps
   extends Pick<CheckboxProps, Exclude<keyof CheckboxProps, 'children'>> {
   hidden?: boolean
   label?: string
   typeValue?: 'boolean' | 'number' | 'string'
   errorMessage?: string
}

export const BooleanInput = (defaultProsp: BooleanInputProps) => {
   // @ts-expect-error
   const { control, enumValues, hidden, typeValue, label, ...checkboxProps } = defaultProsp
   const { label: _label } = useFieldInfo()
   const {
      error,
      field: { onChange, value, name, onBlur, ref },
   } = useTsController<boolean | 0 | 1>()
   const handleChange = useCallback(
      (v: boolean) => {
         typeValue === 'number' ? onChange(!!v ? 1 : 0) : onChange(v)
      },
      [onChange, typeValue]
   )
   return (
      <Checkbox
         aria-labelledby={name}
         color={checkboxProps?.color}
         radius={checkboxProps?.radius}
         size={checkboxProps?.size}
         isDisabled={checkboxProps?.isDisabled}
         isReadOnly={checkboxProps?.isReadOnly}
         classNames={checkboxProps?.classNames}
         onBlur={onBlur}
         id={name}
         ref={ref}
         {...checkboxProps}
         title={error?.errorMessage}
         isInvalid={!!error}
         isSelected={!!value}
         onValueChange={handleChange}>
         {label ?? _label ?? titleCase(name)}
      </Checkbox>
   )
}

export default BooleanInput
