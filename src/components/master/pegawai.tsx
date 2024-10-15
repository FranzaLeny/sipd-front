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
         | 'onChange'
         | 'children'
         | 'defaultItems'
         | 'items'
         | 'ref'
         | 'onValueChange'
         | 'onSelectionChange'
      >
   > {
   onValueChange?: (nama_pegawai: string | null) => void
   onSelectionChange?: (id_pegawai: string | null) => void
   onChange?: (pegawai?: PegawaiWithPangkat) => void
   params?: GetListParams
   delayFetch?: number
}

export const PegawaiSelector = forwardRef(
   (
      {
         onChange,
         params,
         delayFetch = 1000,
         onValueChange,
         selectedKey,
         onSelectionChange,
         ...props
      }: Props,
      ref?: React.Ref<HTMLInputElement>
   ) => {
      const [selected, setSelected] = useState(selectedKey?.toString() || null)

      const [queryParams, setQueryParams] = useState({
         search: '',
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
         setQueryParams({ tahun: 0, limit: 5, ...params, search: '' })
      }, [params])

      useEffect(() => {
         if (data?.hasPreviousPage) {
            setOptions((old) => old.concat(data?.results || []))
         } else if (data?.results) {
            setOptions(data?.results)
         }
      }, [data])

      const handleInputChange = debounce((value: string) => {
         const akun = options?.find((d) => d.nama === value)
         if (akun) {
            return
         }
         setQueryParams(({ after, ...old }) => ({ ...old, search: value ?? '' }))
      }, delayFetch)

      const handleSelected = (key: any) => {
         setSelected(key)
         if (key && typeof key === 'string') {
            const akun = options?.find((d) => d.id === key)
            onChange && onChange(akun)
            onValueChange && onValueChange(akun?.nama ?? null)
            onSelectionChange && onSelectionChange(akun?.id ?? null)
         } else {
            onValueChange && onValueChange(null)
            onChange && onChange(undefined)
            onSelectionChange && onSelectionChange(null)
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
            popoverProps={{ isOpen: true, defaultOpen: true }}
            // allowsCustomValue
            label='Pilih Pegawai'
            placeholder='Pilih Pegawai...'
            variant='bordered'
            defaultFilter={() => true}
            shouldCloseOnBlur={false}
            defaultItems={[]}
            {...props}
            defaultSelectedKey={props?.defaultSelectedKey?.toString()}
            listboxProps={{
               topContent: 'Pilih Pegawai',
               bottomContent: data?.hasNextPage ? bottomContent : undefined,
               emptyContent: 'Tidak ada data akun',
            }}
            selectedKey={selected}
            onInputChange={handleInputChange}
            onSelectionChange={handleSelected}
            ref={ref}
            items={options || []}
            isDisabled={props?.isDisabled || !options}
            isLoading={props?.isLoading || isFetching || status === 'pending'}>
            {({ id, nama, eselon, jenis_pegawai }) => (
               <AutocompleteItem
                  className='data-[selected=true]:text-primary'
                  classNames={{ title: 'whitespace-normal' }}
                  value={id}
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
