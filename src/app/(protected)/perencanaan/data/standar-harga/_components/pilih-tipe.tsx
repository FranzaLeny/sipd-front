import { Select, SelectItem, SelectProps } from '@nextui-org/react'

export const TIPES: ('SSH' | 'HSPK' | 'ASB' | 'SBU')[] = ['ASB', 'HSPK', 'SBU', 'SSH']

type PropsSelectTipe = Omit<SelectProps, 'children'>

const PilihTipe: React.FC<PropsSelectTipe> = ({ ...props }) => {
   return (
      <Select
         variant='bordered'
         title='Pilih Tipe Standar Harga'
         selectionMode='single'
         labelPlacement={'inside'}
         placeholder='Pilih Tipe Standar Harga'
         {...props}>
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

export default PilihTipe
