'use client'

import { useCallback } from 'react'
import { Checkbox, type CheckboxProps } from '@nextui-org/react'
import { useFieldInfo, useTsController } from '@ts-react/form'
import { snakeToTileCase } from '@utils'

export interface BooleanInputProps
   extends Pick<CheckboxProps, Exclude<keyof CheckboxProps, 'children'>> {
   hidden?: boolean
   label?: string
   errorMessage?: string
}

export const BooleanInput = (defaultProsp: BooleanInputProps) => {
   // @ts-expect-error
   const { control, enumValues, hidden, label, ...checkboxProps } = defaultProsp
   const { label: _label, zodType } = useFieldInfo()
   const {
      error,

      field: { onChange, value, name, onBlur, ref },
   } = useTsController<boolean | 0 | 1>()
   const handleChange = useCallback(
      (v: boolean) => {
         const { success, data } = zodType.safeParse(v)
         success ? onChange(data) : onChange(v)
      },
      [onChange, zodType]
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
         {label ?? _label ?? snakeToTileCase(name)}
      </Checkbox>
   )
}

export default BooleanInput
