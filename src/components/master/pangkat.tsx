'use client'

import { forwardRef } from 'react'
import { getListPangkat } from '@actions/data/pangkat'
import { Autocomplete, AutocompleteItem, type AutocompleteProps } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'

type GetListParams = Parameters<typeof getListPangkat>[0]

interface Props
   extends Pick<
      AutocompleteProps,
      Exclude<
         keyof AutocompleteProps,
         'children' | 'defaultItems' | 'items' | 'ref' | 'onSelectionChange'
      >
   > {
   onValueChange?: (nama_pegawai: string | null) => void
   onSelectionChange?: (id_pegawai: string | null) => void
   onSelected?: (pegawai?: Pangkat) => void
   params?: GetListParams
}

export const PangkatSelector = forwardRef(
   (
      {
         onSelected = () => {},
         params = { limit: 100 },
         onValueChange = () => {},
         selectedKey,
         onSelectionChange = () => {},
         ...props
      }: Props,
      ref?: React.Ref<HTMLInputElement>
   ) => {
      const { data, isFetching, status, isFetched } = useQuery({
         queryKey: [{ ...params }, 'data_pangkat'] as [GetListParams, string],
         queryFn: ({ queryKey: [params] }) => getListPangkat(params),
         placeholderData: (previousData) => previousData,
      })

      const handleSelected = (key: any) => {
         if (key && typeof key === 'string') {
            const pangkat = data?.results?.find((d) => d.kode === key)
            onSelected(pangkat)
            onValueChange(pangkat?.pangkat ?? null)
            onSelectionChange(pangkat?.kode ?? null)
         } else {
            onValueChange(null)
            onSelected(undefined)
            onSelectionChange(null)
         }
      }
      return (
         <Autocomplete
            label='Pangkat Golongan'
            placeholder='Cari pangkat golongan...'
            variant='bordered'
            {...props}
            listboxProps={{
               emptyContent: 'Tidak ada data pegawai',
               ...props?.listboxProps,
            }}
            onSelectionChange={handleSelected}
            ref={ref}
            defaultItems={data?.results || []}
            isDisabled={props?.isDisabled}
            isLoading={props?.isLoading || isFetching || status === 'pending'}>
            {({ kode, pangkat, golongan, ruang }) => (
               <AutocompleteItem
                  className='data-[selected=true]:text-primary'
                  classNames={{ title: 'whitespace-normal' }}
                  value={kode}
                  // value={`${pangkat}/${golongan}.${ruang}`}
                  textValue={`${pangkat}/${golongan}.${ruang}`}
                  key={kode}>
                  <div>
                     <p>
                        {pangkat}/{golongan}.{ruang}
                     </p>
                  </div>
               </AutocompleteItem>
            )}
         </Autocomplete>
      )
   }
)

PangkatSelector.displayName = 'PangkatSelector'

export default PangkatSelector
