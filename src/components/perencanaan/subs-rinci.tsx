'use client'

import { forwardRef, useState } from 'react'
import {
   getSubsRinciBlSubGiat,
   GetSubsRinciListParams,
} from '@actions/perencanaan/rka/bl-rinci-sub-giat'
import { Autocomplete, AutocompleteItem, AutocompleteProps } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { SubsRinciBlSubGiat } from '@zod'

export interface SubsRinciSelectorProps
   extends Pick<
      AutocompleteProps,
      Exclude<
         keyof AutocompleteProps,
         'onChange' | 'children' | 'defaultItems' | 'items' | 'onSelectionChange'
      >
   > {
   onChange?: (subs_bl: SubsRinciBlSubGiat | undefined) => void
   onValueChange?: (subs_bl_teks: string | null) => void
   onSelectionChange?: (id_subs_sub_bl: number | null) => void
   params?: GetSubsRinciListParams
   delayFetch?: number
}

export const SubsRinciSelector = forwardRef(
   (
      {
         onChange,
         params,
         delayFetch = 1000,
         onValueChange,
         onSelectionChange,
         selectedKey,
         ...props
      }: SubsRinciSelectorProps,
      ref?: React.Ref<HTMLInputElement>
   ) => {
      const [queryParams, setQueryParams] = useState({
         search: '',
         limit: 1000,
         ...params,
      })

      const { data, isFetching, status } = useQuery({
         queryKey: ['bl_sub_giat_rinci_subs', { ...queryParams }] as [
            string,
            GetSubsRinciListParams,
         ],
         queryFn: async ({ queryKey: [key, params] }) => {
            return await getSubsRinciBlSubGiat(params)
         },
         placeholderData: (previousData) => previousData,
      })

      const options = data?.results
      const handleChange = (value?: any) => {
         if (typeof value === 'string') {
            const subs = options?.find((d) => d.id_subs_sub_bl?.toString() === value.toString())
            onSelectionChange && onSelectionChange(subs?.id_subs_sub_bl as any)
            onValueChange && onValueChange(subs?.subs_bl_teks ?? '')
            onChange && onChange(subs)
         } else {
            onSelectionChange && onSelectionChange(undefined as any)
            onChange && onChange(value)
         }
      }
      return (
         <Autocomplete
            onKeyDown={(e: any) => e.continuePropagation()}
            popoverProps={{ isOpen: true, defaultOpen: true }}
            aria-labelledby='Kelompok rincian'
            placeholder='Pilih Kelompok rincian...'
            variant='bordered'
            onSelectionChange={handleChange}
            defaultItems={options || []}
            {...props}
            defaultSelectedKey={props?.defaultSelectedKey?.toString()}
            selectedKey={selectedKey ? selectedKey?.toString() : null}
            ref={ref}
            isDisabled={props?.isDisabled || !options}
            isLoading={props?.isLoading || isFetching || status === 'pending'}>
            {({ subs_bl_teks, id_subs_sub_bl }) => (
               <AutocompleteItem
                  className='data-[selected=true]:text-primary'
                  classNames={{ title: 'whitespace-normal' }}
                  value={id_subs_sub_bl}
                  startContent={id_subs_sub_bl}
                  key={id_subs_sub_bl}>
                  {subs_bl_teks ?? ''}
               </AutocompleteItem>
            )}
         </Autocomplete>
      )
   }
)

SubsRinciSelector.displayName = 'SubsRinciSelector'

export default SubsRinciSelector
