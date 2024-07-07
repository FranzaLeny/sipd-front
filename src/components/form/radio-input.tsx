import { useCallback } from 'react'
import { Radio, RadioGroup, RadioGroupProps } from '@nextui-org/react'
import { useFieldInfo, useTsController } from '@ts-react/form'
import { titleCase } from '@utils'

const RadioGroupInput = ({
   options,
   typeValue = 'default',
   ...props
}: Omit<RadioGroupProps, 'children'> & {
   typeValue?: 'number' | 'default'
   options: { value: string; label: string }[]
}) => {
   const { label, isNullable, isOptional, defaultValue } = useFieldInfo()
   const {
      error,
      field: { onChange, value, name },
   } = useTsController<any>()
   const handleChange = useCallback(
      (v: string) => {
         !!v ? (typeValue === 'number' ? onChange(parseInt(v)) : onChange(v)) : onChange(null)
      },
      [onChange, typeValue]
   )

   return (
      <RadioGroup
         color={props?.color}
         size={props?.size}
         aria-labelledby='name'
         label={props?.label ?? label ?? titleCase(name)}
         isRequired={!(isNullable && isOptional)}
         {...props}
         value={value?.toString() ?? ''}
         errorMessage={error?.errorMessage}
         isInvalid={!!error}
         name={name}
         id={name}
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
