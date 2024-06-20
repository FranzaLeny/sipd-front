import { useCallback } from 'react'
import { SearchIcon } from 'lucide-react'

import DebouncedInput from './debounce-input'

type GlobalSearchProps = {
   handleChange: (value: string) => void
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ handleChange }) => {
   const handleSearchChange = useCallback(
      (value?: string) => {
         if (value) {
            handleChange(value)
         } else {
            handleChange('')
         }
      },
      [handleChange]
   )
   return (
      <DebouncedInput
         isClearable
         aria-label='Cari'
         fullWidth
         maxLength={50}
         labelPlacement='outside'
         variant='bordered'
         className='w-full flex-1 sm:max-w-lg'
         placeholder='Cari...'
         startContent={<SearchIcon className='h-8' />}
         onValueChange={handleSearchChange}
      />
   )
}

export default GlobalSearch
