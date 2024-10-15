'use client'

import { forwardRef, useEffect, useState } from 'react'
import { Input, Select, SelectItem, type InputProps, type Selection } from '@nextui-org/react'
import { KomponenTipeArraySchema, MaxBatchSchema } from '@zod'
import { fromZodError } from 'zod-validation-error'

export const TIPES: ('SSH' | 'HSPK' | 'ASB' | 'SBU')[] = ['ASB', 'HSPK', 'SBU', 'SSH']

export type Tipes = (typeof TIPES)[number]
type PropsSelectTipes = {
   defaultValue: Tipes[]
   onValueChange: (value: Tipes[]) => any
   onValidate: (value: boolean) => void
}

export const PilihTipes: React.FC<PropsSelectTipes> = ({
   defaultValue,
   onValidate,
   onValueChange,
}) => {
   const [value, setValue] = useState<Tipes[]>(defaultValue)
   const [error, setError] = useState<string | null>(null)
   useEffect(() => {
      if (value) {
         const valid = KomponenTipeArraySchema.safeParse(value)
         onValidate(valid.success)
         if (valid.success) {
            setError(null)
            onValueChange(valid.data)
         } else {
            const errorMessage = fromZodError(valid.error).toString()
            setError(errorMessage)
         }
      }
   }, [value, onValueChange, onValidate])

   const handleChange = (selected: Selection) => {
      if (selected === 'all') {
         setValue(TIPES)
      } else {
         let val: any = []
         selected.forEach((d) => val.push(d))
         setValue(val)
      }
   }
   return (
      <Select
         label='Tipe Standar Harga'
         selectionMode='multiple'
         labelPlacement='outside'
         variant='bordered'
         placeholder='Pilih Tipe Standar Harga'
         isRequired
         disallowEmptySelection
         isInvalid={!!error}
         errorMessage={error}
         onSelectionChange={handleChange}
         selectedKeys={value}>
         {TIPES.map((tipe) => (
            <SelectItem
               key={tipe}
               value={tipe}>
               {tipe}
            </SelectItem>
         ))}
      </Select>
   )
}

interface MaxDataInputProps
   extends Pick<
      InputProps,
      Exclude<
         keyof InputProps,
         'onChange' | 'children' | 'onValueChange' | 'defaultValue' | 'value' | 'ref'
      >
   > {
   defaultValue?: number
   onValueChange: (value: number) => void
   onValidate: (value: boolean) => void
}

export const MaxDataInput = forwardRef(
   (
      { defaultValue, onValueChange, onValidate, ...props }: MaxDataInputProps,
      ref?: React.Ref<HTMLInputElement>
   ) => {
      const [value, setValue] = useState(defaultValue ? defaultValue?.toString() : '100')
      const [error, setError] = useState<string | null>(null)
      useEffect(() => {
         if (value) {
            const valid = MaxBatchSchema.safeParse(value)
            onValidate(valid.success)
            if (valid.success) {
               setError(null)
               onValueChange(valid.data)
            } else {
               const errorMessage = fromZodError(valid.error).toString()
               setError(errorMessage)
            }
         }
      }, [value, onValueChange, onValidate])

      return (
         <Input
            variant='bordered'
            label='Jumlah data setiap request'
            type='number'
            min={1}
            isRequired
            value={value}
            {...props}
            ref={ref}
            isInvalid={props?.isInvalid || !!error}
            errorMessage={props?.errorMessage || error}
            onValueChange={setValue}
         />
      )
   }
)
MaxDataInput.displayName = 'MaxDataInput'
