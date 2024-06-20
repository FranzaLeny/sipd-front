import { Checkbox, CheckboxProps } from '@nextui-org/react'
import { useFieldInfo, useTsController } from '@ts-react/form'
import { titleCase } from '@utils'

const BooleanInput = ({
   enumValues,
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
   const handleChange = (value: boolean) => {
      props.typeValue === 'number' ? onChange(value ? 1 : 0) : onChange(value)
   }

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
