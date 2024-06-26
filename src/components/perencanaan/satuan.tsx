'use client'

import { forwardRef, useEffect, useMemo, useState } from 'react'
import { GetSatuanListParams } from '@actions/perencanaan/data/satuan'
import { Autocomplete, AutocompleteItem, AutocompleteProps } from '@nextui-org/react'
import { useFilter } from '@react-aria/i18n'
import { Satuan } from '@zod'
import { sortBy } from 'lodash-es'
import { useInfiniteScroll } from '@shared/hooks/use-infinite-scroll'

import { useSatuanList } from './use-satuan-list'

type FieldState = {
   selectedKey: React.Key | null
   inputValue: string
   items: Satuan[]
}
export interface SatuanSelectorProps
   extends Pick<
      AutocompleteProps,
      Exclude<
         keyof AutocompleteProps,
         'onChange' | 'children' | 'defaultItems' | 'items' | 'onValueChange'
      >
   > {
   onChange?: (value: Satuan | undefined) => void
   onValueChange?: (value: string | undefined) => void
   params?: GetSatuanListParams
   delayFetch?: number
}

export const SatuanSelector = forwardRef(
   (
      {
         onChange,
         params,
         delayFetch = 1000,
         onValueChange,
         onSelectionChange,
         onInputChange,
         selectedKey,
         ...props
      }: SatuanSelectorProps,
      ref?: React.Ref<HTMLInputElement>
   ) => {
      const [fieldState, setFieldState] = useState<FieldState>({
         selectedKey: '',
         inputValue: '',
         items: [],
      })
      const [isOpen, setIsOpen] = useState(false)
      const [defaultItems, setDefaultItems] = useState<Satuan[]>([])
      const { data, isFetching, status } = useSatuanList({ params })
      const allSatuan = useMemo(() => sortBy(data?.results, ['nama_satuan']) ?? [], [data?.results])
      const { startsWith, contains } = useFilter({ sensitivity: 'base' })

      useEffect(() => {
         if (allSatuan?.length) {
            setDefaultItems(allSatuan)
            setFieldState((prevState) => {
               return {
                  ...prevState,
                  items: allSatuan.slice(0, 10),
               }
            })
         }
      }, [allSatuan])

      const handleSelectionChange = (key: any) => {
         onSelectionChange && onSelectionChange(key)
         if (typeof key === 'string' && data?.results?.length) {
            let selectedItem = fieldState.items.find((option) => option.id === key)
            onValueChange && onValueChange(selectedItem?.nama_satuan)
            onChange && onChange(selectedItem)
            setFieldState((prevState) => {
               return {
                  ...prevState,
                  inputValue: selectedItem?.nama_satuan || '',
                  selectedKey: key,
               }
            })
         } else {
            onChange && onChange(undefined)
            onValueChange && onValueChange(undefined)
         }
      }

      const handleInputChange = (value: string) => {
         onInputChange && onInputChange(value)
         const filtered = allSatuan.filter((item) => contains(item.nama_satuan, value ?? ''))
         setDefaultItems(filtered)
         setFieldState((prevState) => ({
            inputValue: value,
            selectedKey: value === '' ? null : prevState.selectedKey,
            items: filtered.slice(0, 10),
         }))
      }
      const onLoadMore = () => {
         setFieldState((prevState) => ({
            ...prevState,
            items: defaultItems.slice(0, prevState?.items?.length + 9),
         }))
      }

      const [, scrollerRef] = useInfiniteScroll({
         hasMore: defaultItems.length > fieldState?.items?.length,
         isEnabled: isOpen,
         shouldUseLoader: false,
         onLoadMore,
      })

      return (
         <Autocomplete
            listboxProps={{ emptyContent: 'Tidak ada data satuan' }}
            onKeyDown={(e: any) => e.continuePropagation()}
            variant='bordered'
            aria-labelledby='Satuan'
            onOpenChange={setIsOpen}
            {...props}
            placeholder='Pilih Satuan...'
            items={fieldState.items}
            scrollRef={scrollerRef}
            onSelectionChange={handleSelectionChange}
            ref={ref}
            onInputChange={handleInputChange}
            isDisabled={props?.isDisabled || !data?.results}
            selectedKey={fieldState.selectedKey as any}
            isLoading={props?.isLoading || isFetching || status === 'pending'}>
            {({ nama_satuan, id }) => (
               <AutocompleteItem
                  className='data-[selected=true]:text-primary'
                  classNames={{ title: 'whitespace-normal' }}
                  key={id}>
                  {nama_satuan ?? '---'}
               </AutocompleteItem>
            )}
         </Autocomplete>
      )
   }
)

SatuanSelector.displayName = 'SatuanSelector'

export default SatuanSelector
