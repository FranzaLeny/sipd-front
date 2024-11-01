'use client'

import { forwardRef } from 'react'
import { Autocomplete, AutocompleteItem, type AutocompleteProps } from '@nextui-org/react'
import { useFieldInfo, useTsController } from '@ts-react/form'

export interface EselonSelectorProps
   extends Pick<
      AutocompleteProps,
      Exclude<keyof AutocompleteProps, 'children' | 'defaultItems' | 'items' | 'ref'>
   > {}

export const EselonSelector = forwardRef(
   (props: EselonSelectorProps, ref?: React.Ref<HTMLInputElement>) => {
      const defaultItems = [
         { value: 6, label: 'Non Eselon' },
         { value: 4, label: 'Eselon IV' },
         { value: 3, label: 'Eselon III' },
         { value: 2, label: 'Eselon II' },
         { value: 1, label: 'Eselon I' },
      ]

      return (
         <Autocomplete
            label='Eselon'
            placeholder='Cari eselon...'
            variant='bordered'
            defaultItems={defaultItems}
            {...props}
            listboxProps={{
               emptyContent: 'Tidak ada eselon',
               ...props?.listboxProps,
            }}
            ref={ref}
            isDisabled={props?.isDisabled}>
            {({ value, label }) => (
               <AutocompleteItem
                  className='data-[selected=true]:text-primary'
                  classNames={{ title: 'whitespace-normal' }}
                  value={value}
                  key={value}>
                  {label}
               </AutocompleteItem>
            )}
         </Autocomplete>
      )
   }
)

EselonSelector.displayName = 'EselonSelector'

export default EselonSelector

export const EselonInput = (defaultProps: EselonSelectorProps) => {
   // @ts-expect-error
   const { control, enumValues, hidden, isClearable, ...props } = defaultProps
   const { zodType } = useFieldInfo()
   const {
      error,
      field: { onChange, value: fieldValue, name, onBlur, ref },
      formState: { isSubmitting },
      fieldState: { invalid },
   } = useTsController<string>()
   const handleChange = (v: any) => {
      const { data, success } = zodType.safeParse(v)
      success ? onChange(data) : onChange(v)
   }

   return (
      <EselonSelector
         {...props}
         isInvalid={invalid}
         errorMessage={error?.errorMessage}
         name={name}
         onBlur={onBlur}
         onSelectionChange={handleChange}
         // defaultSelectedKey='6'
         selectedKey={fieldValue?.toString()}
         isLoading={isSubmitting}
         ref={ref}
      />
   )
}
