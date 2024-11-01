'use client'

import { forwardRef, useEffect, useState } from 'react'
import { getListPegawai } from '@actions/data/pegawai'
import { Autocomplete, AutocompleteItem, Button, type AutocompleteProps } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { debounce } from 'lodash-es'
import { ArrowDown } from 'lucide-react'

type GetListParams = Parameters<typeof getListPegawai>[0]

interface Props
   extends Pick<
      AutocompleteProps,
      Exclude<
         keyof AutocompleteProps,
         'children' | 'defaultItems' | 'items' | 'ref' | 'onValueChange' | 'onSelectionChange'
      >
   > {
   onValueChange?: (nama_pegawai: string | null) => void
   onSelectionChange?: (id_pegawai: string | null) => void
   onSelected?: (pegawai?: PegawaiWithPangkat) => void
   params?: GetListParams
   delayFetch?: number
}

export const PegawaiSelector = forwardRef(
   (
      {
         onSelected = () => {},
         params,
         delayFetch = 1000,
         onValueChange = () => {},
         selectedKey,
         onSelectionChange = () => {},
         ...props
      }: Props,
      ref?: React.Ref<HTMLInputElement>
   ) => {
      // const [selected, setSelected] = useState(selectedKey?.toString() || null)

      const [queryParams, setQueryParams] = useState({
         limit: 5,
         tahun: 0,
         ...params,
      })
      const [options, setOptions] = useState<PegawaiWithPangkat[]>([])
      const { data, isFetching, status, isFetched } = useQuery({
         queryKey: [{ ...queryParams }, 'data_pegawai'] as [GetListParams, string],
         queryFn: async ({ queryKey: [params] }) => {
            return await getListPegawai(params)
         },
         placeholderData: (previousData) => previousData,
      })

      useEffect(() => {
         setQueryParams({ tahun: 0, limit: 5, ...params })
      }, [params])

      useEffect(() => {
         if (data?.hasPreviousPage) {
            setOptions((old) => old.concat(data?.results || []))
         } else if (data?.results) {
            setOptions(data?.results)
         }
      }, [data])

      const handleInputChange = debounce((value: string) => {
         const pegawai = options?.find((d) => d.nama === value)
         if (pegawai) {
            return
         }
         setQueryParams(({ after, ...old }) => ({ ...old, search: value ?? undefined }))
      }, delayFetch)

      const handleSelected = (key: any) => {
         if (key && typeof key === 'string') {
            const pegawai = options?.find((d) => d.id === key)
            onSelected(pegawai)
            onValueChange(pegawai?.nama ?? null)
            onSelectionChange(pegawai?.id ?? null)
         } else {
            onValueChange(null)
            onSelected(undefined)
            onSelectionChange(null)
         }
      }
      const loadMoreHandle = () => {
         if (data?.hasNextPage) {
            setQueryParams((old) => ({ ...old, after: data?.endCursor! }))
         }
      }
      const bottomContent = (
         <Button
            tabIndex={1}
            variant='flat'
            disableAnimation
            isLoading={isFetching}
            disabled={!data?.hasNextPage}
            size='sm'
            endContent={<ArrowDown className='size-4' />}
            onPress={loadMoreHandle}>
            Lainnya
         </Button>
      )

      return (
         <Autocomplete
            onKeyDown={(e: any) => e.continuePropagation()}
            label='Pilih Pegawai'
            placeholder='Masukan nama pegawai...'
            variant='bordered'
            defaultFilter={() => true}
            defaultItems={[]}
            {...props}
            listboxProps={{
               emptyContent: 'Tidak ada data pegawai',
               ...props?.listboxProps,
               bottomContent: data?.hasNextPage ? bottomContent : undefined,
            }}
            onValueChange={handleInputChange}
            onSelectionChange={handleSelected}
            ref={ref}
            items={options || []}
            isDisabled={props?.isDisabled || !options}
            isLoading={props?.isLoading || isFetching || status === 'pending'}>
            {({ id, nama, eselon, jenis_pegawai }) => (
               <AutocompleteItem
                  className='data-[selected=true]:text-primary'
                  classNames={{ title: 'whitespace-normal' }}
                  value={nama}
                  textValue={nama}
                  key={id}>
                  <div>
                     <p>
                        {nama} ({jenis_pegawai}) {eselon}
                     </p>
                  </div>
               </AutocompleteItem>
            )}
         </Autocomplete>
      )
   }
)

PegawaiSelector.displayName = 'PegawaiSelector'

export default PegawaiSelector
