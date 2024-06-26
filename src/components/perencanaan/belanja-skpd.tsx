'use client'

import { forwardRef, useEffect, useMemo, useState } from 'react'
import { getBlSkpdList, GetBlSkpdListParams } from '@actions/perencanaan/rka/bl-skpd'
import {
   Autocomplete,
   AutocompleteItem,
   AutocompleteProps,
   Chip,
   Input,
   Select,
   Selection,
   SelectItem,
   SelectProps,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { BlSkpd } from '@zod'

export interface BlSkpdSelectorProps
   extends Pick<
      AutocompleteProps,
      Exclude<
         keyof AutocompleteProps,
         'onChange' | 'children' | 'defaultItems' | 'items' | 'onSelectionChange' | 'selectionMode'
      >
   > {
   onChange?: (skpd: BlSkpd | undefined) => void
   onValueChange?: (nama_skpd?: string | null) => void
   onSelectionChange?: (id_skpd?: string | null) => void
   params?: GetBlSkpdListParams
   delayFetch?: number
}

export const BlSkpdSelector = forwardRef(
   (
      {
         onChange,
         params,
         delayFetch = 1000,
         onValueChange,
         onSelectionChange,
         selectedKey,
         ...props
      }: BlSkpdSelectorProps,
      ref?: React.Ref<HTMLInputElement>
   ) => {
      const [queryParams, setQueryParams] = useState({
         search: '',
         limit: 1000,
         ...params,
      })

      const { data, isFetching, status } = useQuery({
         queryKey: ['bl_skpd', { ...queryParams }] as [string, GetBlSkpdListParams],
         queryFn: async ({ queryKey: [key, params] }) => {
            return await getBlSkpdList(params)
         },
         placeholderData: (previousData) => previousData,
      })

      const options = data?.results
      const handleChange = (value?: any) => {
         if (typeof value === 'string') {
            const skpd = options?.find((d) => d.id === value)
            onSelectionChange && onSelectionChange(skpd?.id)
            onValueChange && onValueChange(skpd?.nama_skpd ?? '')
            onChange && onChange(skpd)
         } else {
            onSelectionChange && onSelectionChange(undefined as any)
            onChange && onChange(value)
         }
      }
      return (
         <Autocomplete
            listboxProps={{ emptyContent: 'Tidak ada data SKPD' }}
            onKeyDown={(e: any) => e.continuePropagation()}
            popoverProps={{ isOpen: true, defaultOpen: true }}
            aria-labelledby='SKPD'
            placeholder='Pilih SKPD...'
            variant='bordered'
            onSelectionChange={handleChange}
            defaultItems={options || []}
            {...props}
            defaultSelectedKey={props?.defaultSelectedKey?.toString()}
            selectedKey={selectedKey ? selectedKey?.toString() : null}
            ref={ref}
            isDisabled={props?.isDisabled || !options}
            isLoading={props?.isLoading || isFetching || status === 'pending'}>
            {({ nama_skpd, id }) => (
               <AutocompleteItem
                  className='data-[selected=true]:text-primary'
                  classNames={{ title: 'whitespace-normal' }}
                  value={id}
                  key={id}>
                  {nama_skpd ?? ''}
               </AutocompleteItem>
            )}
         </Autocomplete>
      )
   }
)

BlSkpdSelector.displayName = 'BlSkpdSelector'

export default BlSkpdSelector

export interface BlSkpdSelectorMultipleProps
   extends Pick<
      SelectProps,
      Exclude<
         keyof SelectProps,
         'onChange' | 'children' | 'defaultItems' | 'items' | 'onSelectionChange'
      >
   > {
   onChange?: (skpd: BlSkpd[]) => void
   onSelectionChange?: (listIdSkpd: string[]) => void
   isClearable?: boolean
   params?: GetBlSkpdListParams
   delayFetch?: number
}

export const BlSkpdSelectorMultiple = forwardRef(
   (
      {
         onChange,
         params,
         delayFetch = 1000,
         onSelectionChange,
         isClearable = true,
         ...props
      }: BlSkpdSelectorMultipleProps,
      ref?: React.Ref<HTMLSelectElement>
   ) => {
      const [queryParams] = useState({
         search: '',
         limit: 1000,
         ...params,
      })
      const [list, setList] = useState<(BlSkpd & { hidden: boolean })[]>([])
      const [search, setSearch] = useState('')
      const { data, isFetching, status } = useQuery({
         queryKey: ['bl_skpd', { limit: 1000, ...params }] as [string, GetBlSkpdListParams],
         queryFn: async ({ queryKey: [_, params] }) => {
            return await getBlSkpdList(params)
         },
         placeholderData: (previousData) => previousData,
         enabled: !props?.isDisabled,
      })
      const items = useMemo(() => data?.results ?? [], [data?.results])
      useEffect(() => {
         setList(items?.map((d) => ({ ...d, hidden: false })))
      }, [items])
      const options = data?.results
      const handleChange = (value?: Selection) => {
         if (typeof value === 'object') {
            const ids = [...value]
            const skpd = options?.filter((d) => ids.includes(d.id)) ?? []
            onSelectionChange && onSelectionChange(skpd?.map((d) => d.id))
            onChange && onChange(skpd)
         } else {
            onSelectionChange && onSelectionChange([])
            onChange && onChange([])
         }
      }

      const handleSearch = (value: string) => {
         setSearch(value)
         const newList = items?.map((data) => ({
            ...data,
            hidden: !data?.nama_skpd?.toLowerCase().includes(value.toLowerCase()),
         }))

         setList(newList)
      }
      const handleClear = (
         data: { key?: string | number | bigint }[],
         key: string | number | bigint
      ) => {
         const newList: any = data
            ?.filter((d) => d?.key && d?.key !== key && typeof key === 'string')
            ?.map((d) => d.key)
         handleChange(new Set([...newList]))
      }

      const bottomContent = (
         <Input
            value={search}
            size='sm'
            variant='bordered'
            label='Cari ...'
            isClearable
            onValueChange={handleSearch}
         />
      )
      return (
         <Select
            aria-labelledby='SKPD'
            placeholder='Pilih SKPD...'
            variant='bordered'
            {...props}
            isMultiline
            onSelectionChange={handleChange}
            showScrollIndicators={false}
            selectionMode='multiple'
            classNames={{
               listboxWrapper: 'overflow-y-hidden max-h-fit h-fit',
               value: 'capitalize ',
            }}
            listboxProps={{
               bottomContent,
               classNames: {
                  list: 'flex-1 h-full !overflow-y-auto',
                  base: 'h-fit max-h-64  overflow-y-hidden flex flex-col',
               },
            }}
            items={list}
            ref={ref}
            isDisabled={props?.isDisabled || !options}
            renderValue={(items) => {
               return (
                  <div className='flex flex-wrap gap-2'>
                     {items.map(({ data, key, props, textValue, rendered, type }) =>
                        key && data ? (
                           <Chip
                              onClose={isClearable ? () => handleClear(items, key) : undefined}
                              classNames={{ content: 'capitaliza' }}
                              key={key}>
                              {data?.nama_skpd?.toLocaleLowerCase()}
                           </Chip>
                        ) : (
                           rendered
                        )
                     )}
                  </div>
               )
            }}
            isLoading={props?.isLoading || isFetching}>
            {({ nama_skpd, id, hidden }) => (
               <SelectItem
                  className={`data-[selected=true]:border-b ${hidden ? 'hidden' : ''}`}
                  variant='bordered'
                  classNames={{ title: 'whitespace-normal capitalize' }}
                  value={id}
                  key={id}>
                  {nama_skpd?.toLocaleLowerCase() ?? ''}
               </SelectItem>
            )}
         </Select>
      )
   }
)

BlSkpdSelectorMultiple.displayName = 'BlSkpdSelectorMultiple'
