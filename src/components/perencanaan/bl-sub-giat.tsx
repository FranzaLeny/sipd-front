'use client'

import { forwardRef } from 'react'
import { getAllBlSubGiat } from '@actions/perencanaan/rka/bl-sub-giat'
import { Autocomplete, AutocompleteItem, AutocompleteProps } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { numberToRupiah } from '@utils'

type BlSubGiat = AsyncReturnType<typeof getAllBlSubGiat>
type ParamsGetAllSubGiat = Parameters<typeof getAllBlSubGiat>[0]

export interface BlSubGiatSelectorProps
   extends Pick<
      AutocompleteProps,
      Exclude<
         keyof AutocompleteProps,
         'onChange' | 'children' | 'defaultItems' | 'items' | 'onSelectionChange'
      >
   > {
   onChange?: (blsubGiat: BlSubGiat[number] | null) => void
   onValueChange?: (nama: string | null) => void
   onSelectionChange?: (id: string | null) => void
   params: ParamsGetAllSubGiat
   delayFetch?: number
}

const BlSubGiatSelector = forwardRef(
   (
      {
         onChange = () => {},
         params,
         onValueChange = () => {},
         onSelectionChange = () => {},
         selectedKey,
         ...props
      }: BlSubGiatSelectorProps,
      ref?: React.Ref<HTMLInputElement>
   ) => {
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
            const subs = options?.find((d) => d.id === value)
            onSelectionChange(subs?.id ?? null)
            onValueChange(subs?.nama_sub_giat ?? null)
            onChange(subs ?? null)
         } else {
            onSelectionChange(null)
            onChange(null)
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
            {...props}
            selectedKey={selectedKey ? selectedKey?.toString() : null}
            onSelectionChange={handleChange}
            defaultSelectedKey={props?.defaultSelectedKey?.toString()}
            ref={ref}
            isDisabled={props?.isDisabled || !options}
            isLoading={props?.isLoading || isFetching || status === 'pending'}>
            {({ id, nama_sub_giat, nama_sub_skpd, nama_giat, nama_program, pagu = 0 }) => {
               return (
                  <AutocompleteItem
                     className='data-[selected=true]:text-primary'
                     classNames={{ title: 'whitespace-normal' }}
                     value={id}
                     textValue={nama_sub_giat}
                     key={id}>
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
