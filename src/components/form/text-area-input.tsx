'use client'

import { useCallback } from 'react'
import { cn, Textarea, TextAreaProps } from '@nextui-org/react'
import { useFieldInfo, useTsController } from '@ts-react/form'
import { titleCase } from '@shared/utils'

export interface TextAreaInputProps
   extends Pick<
      TextAreaProps,
      Exclude<keyof TextAreaProps, 'errorMessage' | 'onValueChange' | 'defaultValue'>
   > {
   hidden?: boolean
   errorMessage?: string
}

export const TextAreaInput = (defaultProps: TextAreaInputProps) => {
   // @ts-expect-error
   const { control, enumValues, hidden, ...inputProps } = defaultProps
   const { label, placeholder, defaultValue, isNullable, isOptional } = useFieldInfo()

   const {
      error,
      field: { onChange, value: fieldValue, name, ref, onBlur },
      formState: { isSubmitting },
      fieldState: { invalid },
   } = useTsController<string | null | undefined>()
   const handleChange = useCallback(
      (val: string) => {
         onChange(val ? val : isNullable ? null : undefined)
      },
      [onChange, isNullable]
   )

   const labelPlacement = inputProps?.labelPlacement ?? 'inside'
   const props: TextAreaProps = {
      'aria-labelledby': name,
      variant: 'bordered',
      autoComplete: name,
      key: name,
      id: name,
      defaultValue: defaultValue ?? '',
      ref,
      onBlur,
      ...inputProps,
      errorMessage: error?.errorMessage,
      labelPlacement,
      onValueChange: handleChange,
      className: cn(hidden && 'hidden', inputProps?.className),
      label: inputProps?.label ?? label ?? titleCase(name),
      placeholder: inputProps?.placeholder ?? placeholder,
      isReadOnly: inputProps?.isReadOnly || isSubmitting,
      isInvalid: invalid || inputProps?.isInvalid,
      value: fieldValue ?? '',
   }
   return <Textarea {...props} />
}
