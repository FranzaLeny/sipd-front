'use client'

import { forwardRef } from 'react'
import { getAllBlSubGiat } from '@actions/perencanaan/rka/bl-sub-giat'
import { Autocomplete, AutocompleteItem, type AutocompleteProps } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { numberToRupiah } from '@utils'

// type BlSubGiat = AsyncReturnType<typeof getAllBlSubGiat>
type ParamsGetAllSubGiat = Parameters<typeof getAllBlSubGiat>[0]

export interface BlSubGiatSelectorProps {
   autocompleteProps?: Pick<
      AutocompleteProps,
      Exclude<
         keyof AutocompleteProps,
         'onChange' | 'children' | 'defaultItems' | 'items' | 'onSelectionChange' | 'selectedKey'
      >
   >
   onChange?: (blsubGiat?: BlSubGiat) => void
   onValueChange?: (nama: string | null) => void
   onSelectionChange?: (id: string | null) => void
   params: ParamsGetAllSubGiat
   fieldKey?: 'id' | 'kode_sbl' | 'kode_sub_giat'
   delayFetch?: number
   selectedKey?: string | null
}

const BlSubGiatSelector = forwardRef(
   (blSubGiatSelectorProps: BlSubGiatSelectorProps, ref?: React.Ref<HTMLInputElement>) => {
      const {
         onChange = () => {},
         params,
         fieldKey = 'id',
         onValueChange = () => {},
         onSelectionChange = () => {},
         selectedKey,
         autocompleteProps,
      } = blSubGiatSelectorProps
      const {
         data: options,
         isFetching,
         status,
      } = useQuery({
         queryKey: [{ ...params }, 'bl_sub_giat', 'jadwal_anggaran'] as [
            ParamsGetAllSubGiat,
            ...any,
         ],
         queryFn: async ({ queryKey: [params] }) => {
            return await getAllBlSubGiat(params)
         },
         placeholderData: (previousData) => previousData,
      })

      const handleChange = (value?: any) => {
         if (typeof value === 'string') {
            const subs = options?.find((d) => d[fieldKey] === value)
            onSelectionChange(subs ? subs[fieldKey] : null)
            onValueChange(subs?.nama_sub_giat ?? null)
            onChange(subs)
         } else {
            onSelectionChange(null)
            onChange(undefined)
         }
      }
      return (
         <Autocomplete
            listboxProps={{ emptyContent: 'Tidak ada data Sub Kegiatan' }}
            onKeyDown={(e: any) => e.continuePropagation()}
            popoverProps={{ isOpen: true, defaultOpen: true }}
            aria-labelledby='Sub Kegiatan'
            placeholder='Pilih Sub Kegiatan...'
            variant='bordered'
            defaultItems={options || []}
            {...autocompleteProps}
            selectedKey={selectedKey ? selectedKey?.toString() : null}
            onSelectionChange={handleChange}
            defaultSelectedKey={autocompleteProps?.defaultSelectedKey?.toString()}
            ref={ref}
            isDisabled={autocompleteProps?.isDisabled || !options}
            isLoading={autocompleteProps?.isLoading || isFetching || status === 'pending'}>
            {({ nama_sub_giat, nama_sub_skpd, nama_giat, nama_program, pagu = 0, ...rest }) => {
               return (
                  <AutocompleteItem
                     className='data-[selected=true]:text-primary'
                     classNames={{ title: 'whitespace-normal' }}
                     value={rest[fieldKey]}
                     textValue={nama_sub_giat}
                     key={rest[fieldKey]}>
                     <div>
                        <p>
                           {nama_sub_giat ?? ''} {numberToRupiah(pagu)}
                        </p>
                        <p className='text-xs italic text-opacity-75'>
                           Kegiatan {nama_giat}, {nama_program}, {nama_sub_skpd}
                        </p>
                     </div>
                  </AutocompleteItem>
               )
            }}
         </Autocomplete>
      )
   }
)

BlSubGiatSelector.displayName = 'BlSubGiatSelector'

export default BlSubGiatSelector
