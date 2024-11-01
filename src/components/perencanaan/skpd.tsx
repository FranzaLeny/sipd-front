'use client'

import { forwardRef, useEffect, useMemo, useState } from 'react'
import { getAllSkpd } from '@actions/perencanaan/data/skpd'
import {
   Autocomplete,
   AutocompleteItem,
   Chip,
   Input,
   Select,
   SelectItem,
   type AutocompleteProps,
   type Selection,
   type SelectProps,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { toProperCase } from '@utils'

type GetAllSkpdParams = Parameters<typeof getAllSkpd>

export interface SkpdMultipleSelectProps {
   selectProps?: Pick<
      SelectProps,
      Exclude<
         keyof SelectProps,
         'onChange' | 'children' | 'defaultItems' | 'items' | 'onSelectionChange'
      >
   >
   onChange?: (skpd: Skpd[]) => void
   onSelectionChange?: (listIdSkpd: string[]) => void
   isClearable?: boolean
   params?: GetAllSkpdParams[number]
   delayFetch?: number
}

export const SkpdMultipleSelect = forwardRef(
   (
      {
         onChange,
         params,
         onSelectionChange,
         isClearable = true,
         selectProps,
      }: SkpdMultipleSelectProps,
      ref?: React.Ref<HTMLSelectElement>
   ) => {
      const [list, setList] = useState<(Skpd & { hidden: boolean })[]>([])
      const [search, setSearch] = useState('')
      const { data, isFetching } = useQuery({
         queryKey: [params, 'data_skpd', 'all_skpd'] as [GetAllSkpdParams[0], ...any],
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
            {...selectProps}
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
            isDisabled={selectProps?.isDisabled || !options}
            renderValue={(items) => {
               return (
                  <div className='flex flex-wrap gap-2'>
                     {items?.map(({ data, key, props, textValue, rendered, type }) =>
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
            isLoading={selectProps?.isLoading || isFetching}>
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
         'children' | 'defaultItems' | 'items' | 'ref' | 'onSelectionChange'
      >
   > {
   onSkpdChange?: (skpd?: Skpd) => void
   params?: GetAllSkpdParams[0]
   selectionKey?: 'id' | 'id_skpd'
   onSelectionChange?: (id?: string) => void
}

export const SkpdSelect = forwardRef(
   (
      {
         onSkpdChange = () => {},
         params,
         onSelectionChange = () => {},
         selectionKey = 'id',
         isClearable = true,
         ...props
      }: SkpdSelectProps,
      ref?: React.Ref<HTMLInputElement>
   ) => {
      const [list, setList] = useState<(Skpd & { hidden: boolean })[]>([])

      const { data, isFetching } = useQuery({
         queryKey: [params, 'data_skpd', 'all_skpd'] as [GetAllSkpdParams[0], ...any],
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
            onSelectionChange(skpd?.id)
            onSkpdChange(skpd)
         } else {
            onSelectionChange(undefined)
            onSkpdChange(undefined)
         }
      }

      return (
         <Autocomplete
            listboxProps={{ emptyContent: 'Tidak ada data SKPD' }}
            aria-labelledby='SKPD'
            placeholder='Pilih SKPD...'
            variant='bordered'
            {...props}
            selectedKey={props?.selectedKey?.toString()}
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
                  textValue={toProperCase(nama_skpd, true)}
                  key={selectionKey === 'id_skpd' ? id_skpd : id}>
                  {nama_skpd}
               </AutocompleteItem>
            )}
         </Autocomplete>
      )
   }
)

SkpdSelect.displayName = 'SkpdSelect'
