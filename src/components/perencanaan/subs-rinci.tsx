'use client'

import { forwardRef } from 'react'
import { getSubsRinciBlSubGiat } from '@actions/perencanaan/rka/bl-rinci-sub-giat'
import { Autocomplete, AutocompleteItem, type AutocompleteProps } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'

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
   params?: GetListSubsRinciBlSubGiatParams
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
      const { data, isFetching, status } = useQuery({
         queryKey: [{ limit: 1000, ...params }, 'bl_sub_giat_rinci_subs'] as [
            GetListSubsRinciBlSubGiatParams,
            string,
         ],
         queryFn: async ({ queryKey: [params] }) => {
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
            listboxProps={{ emptyContent: 'Tidak ada data kelompok rincian' }}
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
