'use client'

import { forwardRef, useState } from 'react'
import { getDanaBlSubGiat, GetDanaListParams } from '@actions/perencanaan/rka/bl-sub-giat'
import { Autocomplete, AutocompleteItem, AutocompleteProps } from '@nextui-org/react'
import { useLocale } from '@react-aria/i18n'
import { useQuery } from '@tanstack/react-query'
import { DanaBlSubGiat } from '@zod'

export interface DanaSelectorProps
   extends Pick<
      AutocompleteProps,
      Exclude<
         keyof AutocompleteProps,
         'onChange' | 'children' | 'defaultItems' | 'items' | 'onSelectionChange'
      >
   > {
   onChange?: (danaBlSubGiat: DanaBlSubGiat | undefined) => void
   onValueChange?: (nama_dana: string | null) => void
   onSelectionChange?: (id_dana_sub_bl: number | null) => void
   params?: GetDanaListParams
   delayFetch?: number
}

export const DanaSelector = forwardRef(
   (
      {
         onChange,
         params,
         delayFetch = 1000,
         onValueChange,
         onSelectionChange,
         selectedKey,
         ...props
      }: DanaSelectorProps,
      ref?: React.Ref<HTMLInputElement>
   ) => {
      const [queryParams, setQueryParams] = useState({
         search: '',
         limit: 1000,
         ...params,
      })
      const { locale } = useLocale()
      const { data, isFetching, status } = useQuery({
         queryKey: ['bl_sub_giat_dana', { ...queryParams }] as [string, GetDanaListParams],
         queryFn: async ({ queryKey: [key, params] }) => {
            return await getDanaBlSubGiat(params)
         },
         placeholderData: (previousData) => previousData,
      })

      const options = data?.results
      const handleChange = (value?: any) => {
         if (typeof value === 'string') {
            const subs = options?.find((d) => d.id_dana_sub_bl?.toString() === value.toString())
            onSelectionChange && onSelectionChange(subs?.id_dana_sub_bl ?? null)
            onValueChange && onValueChange(subs?.nama_dana ?? null)
            onChange && onChange(subs)
         } else {
            onSelectionChange && onSelectionChange(null)
            onChange && onChange(value)
         }
      }
      return (
         <Autocomplete
            onKeyDown={(e: any) => e.continuePropagation()}
            popoverProps={{ isOpen: true, defaultOpen: true }}
            aria-labelledby='Sumber dana'
            placeholder='Pilih Sumber Dana...'
            variant='bordered'
            defaultItems={options || []}
            {...props}
            selectedKey={selectedKey ? selectedKey?.toString() : null}
            onSelectionChange={handleChange}
            defaultSelectedKey={props?.defaultSelectedKey?.toString()}
            ref={ref}
            isDisabled={props?.isDisabled || !options}
            isLoading={props?.isLoading || isFetching || status === 'pending'}>
            {({ nama_dana, id_dana_sub_bl, pagu_dana }) => (
               <AutocompleteItem
                  className='data-[selected=true]:text-primary'
                  classNames={{ title: 'whitespace-normal' }}
                  value={id_dana_sub_bl}
                  endContent={pagu_dana.toLocaleString(locale, {
                     style: 'currency',
                     currency: 'IDR',
                  })}
                  key={id_dana_sub_bl}>
                  {nama_dana ?? ''}
               </AutocompleteItem>
            )}
         </Autocomplete>
      )
   }
)

DanaSelector.displayName = 'DanaSelector'

export default DanaSelector
