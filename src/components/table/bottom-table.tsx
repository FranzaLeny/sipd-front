import { useMemo } from 'react'
import { Button, ButtonGroup, Select, SelectItem } from '@nextui-org/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const PER_PAGES = [5, 10, 15, 25, 50, 100]

type BottomTableProps = {
   handleLimitChange: (n: number) => void
   handlePageChange: {
      prevPage: (() => void) | undefined
      nextPage: (() => void) | undefined
   }
   defaultValue: number
   isLoading: boolean
}

const BottomTable: React.FC<BottomTableProps> = ({
   handleLimitChange,
   handlePageChange,
   defaultValue,
   isLoading,
}) => {
   const listPerPage = [...new Set([defaultValue, ...PER_PAGES])]?.sort((a, b) => a - b)
   const perPageSelector = useMemo(() => {
      return (
         <div className='w-fit'>
            <Select
               isDisabled={isLoading}
               radius='none'
               size='sm'
               name='perpage'
               color='primary'
               variant='bordered'
               aria-label='Per halaman'
               labelPlacement='outside-left'
               disallowEmptySelection
               classNames={{
                  innerWrapper: 'w-10',
                  listboxWrapper: 'w-18 p-px',
                  label: 'whitespace-nowrap',
                  trigger: 'text-foreground border-primary ',
                  value: 'text-foreground ',
               }}
               popoverProps={{
                  size: 'lg',
                  triggerType: 'dialog',
                  className: 'w-18 p-px',
               }}
               defaultSelectedKeys={[String(defaultValue)]}
               selectedKeys={[String(defaultValue)]}
               fullWidth={false}
               onChange={(e) =>
                  Number(e.target.value) > 0 && handleLimitChange(Number(e.target.value))
               }>
               {listPerPage.map((n) => (
                  <SelectItem
                     key={n}
                     value={String(n)}>
                     {String(n)}
                  </SelectItem>
               ))}
            </Select>
         </div>
      )
   }, [handleLimitChange, defaultValue, isLoading, listPerPage])
   const next = useMemo(() => {
      return (
         <Button
            isDisabled={!!!handlePageChange?.nextPage || isLoading}
            title='berikutnya'
            variant='solid'
            color='primary'
            onPress={handlePageChange?.nextPage}>
            <ArrowRight />
         </Button>
      )
   }, [handlePageChange, isLoading])
   const prev = useMemo(() => {
      return (
         <Button
            isDisabled={!!!handlePageChange?.prevPage || isLoading}
            title='sebelumnya'
            color='primary'
            variant='solid'
            onPress={handlePageChange?.prevPage}>
            <ArrowLeft />
         </Button>
      )
   }, [handlePageChange, isLoading])
   return (
      <div className='sticky bottom-2 left-1/2 mx-auto my-2 -translate-x-1/2 rounded-full backdrop-blur'>
         <ButtonGroup
            radius='full'
            size='sm'>
            {prev}
            {perPageSelector}
            {next}
         </ButtonGroup>
      </div>
   )
}

export default BottomTable
