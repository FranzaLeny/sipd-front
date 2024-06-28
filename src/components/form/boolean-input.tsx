import { useCallback } from 'react'
import { Checkbox, CheckboxProps } from '@nextui-org/react'
import { useFieldInfo, useTsController } from '@ts-react/form'
import { titleCase } from '@utils'

const BooleanInput = ({
   enumValues,
   typeValue,
   ...props
}: Omit<CheckboxProps, 'children'> & {
   label?: string
   typeValue?: 'boolean' | 'number'
   enumValues: any
}) => {
   const { label, placeholder, isNullable, isOptional, defaultValue } = useFieldInfo()
   const {
      error,
      field: { onChange, value, name },
   } = useTsController<boolean | 0 | 1>()
   const handleChange = useCallback(
      (v: boolean) => {
         typeValue === 'number' ? onChange(v ? 1 : 0) : onChange(v)
      },
      [onChange, typeValue]
   )

   return (
      <div className='flex flex-col gap-2'>
         <Checkbox
            color={props?.color}
            radius={props?.radius}
            size={props?.size}
            isDisabled={props?.isDisabled}
            isReadOnly={props?.isReadOnly}
            classNames={props?.classNames}
            defaultSelected={defaultValue ?? false}
            {...props}
            title={error?.errorMessage}
            isInvalid={!!error}
            name={name}
            id={name}
            isSelected={!!value}
            onValueChange={handleChange}>
            {label ?? props?.label ?? titleCase(name)}
         </Checkbox>
      </div>
   )
}

export default BooleanInput
