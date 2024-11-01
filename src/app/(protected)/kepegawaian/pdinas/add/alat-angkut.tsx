import { forwardRef } from 'react'
import { Autocomplete, AutocompleteItem, type AutocompleteProps } from '@nextui-org/autocomplete'

type Props = Pick<
   AutocompleteProps<{ value: string }>,
   Exclude<
      keyof AutocompleteProps<{ value: string }>,
      'ref' | 'children' | 'defaultItems' | 'items'
   >
>
export const AlatAngkut = forwardRef((props: Props, ref?: any) => {
   const options = [
      { value: 'Kendaraan Roda Dua' },
      { value: 'Kendaraan Roda Empat' },
      { value: 'Kapal Laut' },
      { value: 'Pesawat Terbang' },
      { value: 'Kapal Laut / Pesawat Terbang' },
      { value: 'Kendaraan Roda Empat / Kapal Laut' },
      { value: 'Kendaraan Roda Empat / Pesawat Terbang' },
      { value: 'Kendaraan Roda Empat / Pesawat Terbang / Kapal Laut' },
   ]

   return (
      <Autocomplete
         variant='bordered'
         label='Pilih Alat Angkut yang digunakan'
         allowsCustomValue
         {...props}
         ref={ref}
         defaultItems={options}>
         {({ value }) => <AutocompleteItem key={value}>{value}</AutocompleteItem>}
      </Autocomplete>
   )
})
AlatAngkut.displayName = 'AlatAngkut'
