'use client'

import { forwardRef, useEffect, useMemo, useState } from 'react'
import { getAllSkpd, SkpdParams } from '@actions/perencanaan/data/skpd'
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
import { Skpd } from '@zod'

export interface SkpdMultipleSelectProps
   extends Pick<
      SelectProps,
      Exclude<
         keyof SelectProps,
         'onChange' | 'children' | 'defaultItems' | 'items' | 'onSelectionChange'
      >
   > {
   onChange?: (skpd: Skpd[]) => void
   onSelectionChange?: (listIdSkpd: string[]) => void
   isClearable?: boolean
   params?: SkpdParams
   delayFetch?: number
}

export const SkpdMultipleSelect = forwardRef(
   (
      {
         onChange,
         params,
         delayFetch = 1000,
         onSelectionChange,
         isClearable = true,
         ...props
      }: SkpdMultipleSelectProps,
      ref?: React.Ref<HTMLSelectElement>
   ) => {
      const [list, setList] = useState<(Skpd & { hidden: boolean })[]>([])
      const [search, setSearch] = useState('')
      const { data, isFetching } = useQuery({
         queryKey: [params, 'skpd', 'all_skpd'] as [SkpdParams, ...any],
         queryFn: async ({ queryKey: [params] }) => {
            return await getAllSkpd(params)
         },
         placeholderData: (previousData) => previousData,
      })
      const items = useMemo(() => data ?? [], [data])
      useEffect(() => {
         setList(items?.map((d) => ({ ...d, hidden: false })))
      }, [items])
      const options = data

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

      const topContent = (
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
               topContent,
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

SkpdMultipleSelect.displayName = 'SkpdMultipleSelect'

interface SkpdSelectProps
   extends Pick<
      AutocompleteProps,
      Exclude<
         keyof AutocompleteProps,
         'onChange' | 'children' | 'defaultItems' | 'items' | 'ref' | 'onSelectionChange'
      >
   > {
   onChange?: (skpd?: Skpd) => void
   params?: SkpdParams
   selectionKey?: 'id' | 'id_skpd'
   onSelectionChange?: (id?: string) => void
}

export const SkpdSelect = forwardRef(
   (
      {
         onChange,
         params,
         onSelectionChange,
         selectionKey = 'id',
         isClearable = true,
         ...props
      }: SkpdSelectProps,
      ref?: React.Ref<HTMLInputElement>
   ) => {
      const [list, setList] = useState<(Skpd & { hidden: boolean })[]>([])

      const { data, isFetching } = useQuery({
         queryKey: [params, 'skpd', 'all_skpd'] as [SkpdParams, ...any],
         queryFn: async ({ queryKey: [params] }) => {
            return await getAllSkpd(params)
         },
         placeholderData: (previousData) => previousData,
         enabled: !props?.isDisabled,
      })

      const items = useMemo(() => data ?? [], [data])
      useEffect(() => {
         setList(items?.map((d) => ({ ...d, hidden: false })))
      }, [items])
      const options = data

      const handleChange = (value?: React.Key | null) => {
         if (typeof value === 'string') {
            const skpd = options?.find((d) => d[selectionKey].toString() === value)
            skpd && onSelectionChange && onSelectionChange(skpd?.id)
            skpd && onChange && onChange(skpd)
         } else {
            onSelectionChange && onSelectionChange(undefined)
            onChange && onChange(undefined)
         }
      }

      return (
         <Autocomplete
            listboxProps={{ emptyContent: 'Tidak ada data SKPD' }}
            aria-labelledby='SKPD'
            placeholder='Pilih SKPD...'
            variant='bordered'
            {...props}
            onSelectionChange={handleChange}
            showScrollIndicators={false}
            defaultItems={list}
            ref={ref}
            isDisabled={props?.isDisabled || !options}
            isLoading={props?.isLoading || isFetching}>
            {({ nama_skpd, id, id_skpd, hidden }) => (
               <AutocompleteItem
                  className={`data-[selected=true]:border-b ${hidden ? 'hidden' : ''}`}
                  variant='bordered'
                  classNames={{ title: 'whitespace-normal capitalize' }}
                  value={id}
                  key={selectionKey === 'id_skpd' ? id_skpd : id}>
                  {nama_skpd}
               </AutocompleteItem>
            )}
         </Autocomplete>
      )
   }
)

SkpdSelect.displayName = 'SkpdSelect'
