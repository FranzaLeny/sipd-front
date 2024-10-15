import { useCallback } from 'react'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { TableIcon } from 'lucide-react'

import { type ColumnKeys } from './table-function'

type Columns = {
   uid: string | number
   name: string
}
interface ColumnsSelectorProps<T> {
   selectedKeys: ColumnKeys<T>
   onSelectionChange: (keys: any[]) => void
   columns: Columns[]
}

function ColumnsSelector<T>({ selectedKeys, onSelectionChange, columns }: ColumnsSelectorProps<T>) {
   const handleColumnsSelect = useCallback(
      (keys: any) => {
         if (keys !== 'all') {
            onSelectionChange(keys)
         }
      },
      [onSelectionChange]
   )
   return (
      <div className='flex justify-center'>
         <Dropdown>
            <DropdownTrigger>
               <Button
                  isIconOnly
                  variant='light'>
                  <TableIcon />
               </Button>
            </DropdownTrigger>
            <DropdownMenu
               disallowEmptySelection
               aria-label='Table Columns'
               closeOnSelect={false}
               selectedKeys={selectedKeys}
               selectionMode='multiple'
               onSelectionChange={handleColumnsSelect}>
               {columns.map((column) => (
                  <DropdownItem
                     key={column.uid}
                     className='capitalize'>
                     {column.name}
                  </DropdownItem>
               ))}
            </DropdownMenu>
         </Dropdown>
      </div>
   )
}

export default ColumnsSelector
