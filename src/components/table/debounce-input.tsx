import { useEffect, useState } from 'react'
import { Input, InputProps } from '@nextui-org/react'

export interface DebouncedInputProps extends InputProps {
   debounce?: number
}
const DebouncedInput: React.FC<DebouncedInputProps> = ({
   defaultValue,
   onValueChange,
   debounce = 500,
   ...props
}) => {
   const [value, setValue] = useState('')
   useEffect(() => {
      if (defaultValue) {
         setValue(defaultValue)
      }
   }, [defaultValue])
   useEffect(() => {
      const timeout = setTimeout(() => {
         !!onValueChange && onValueChange(value)
      }, debounce)
      return () => clearTimeout(timeout)
   }, [value, onValueChange, debounce])
   return (
      <Input
         value={value}
         {...props}
         onValueChange={setValue}
      />
   )
}

export default DebouncedInput
