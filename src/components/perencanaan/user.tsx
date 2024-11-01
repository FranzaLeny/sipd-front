'use client'

import { forwardRef, useEffect, useState } from 'react'
import { getUserSipdPerencanaan } from '@actions/perencanaan/data/user'
import { Autocomplete, AutocompleteItem, Button, type AutocompleteProps } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { debounce } from 'lodash-es'
import { ArrowDown } from 'lucide-react'

interface Props {
   autocompleteProps?: Pick<
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
   >
   onValueChange?: (nama: string | null) => void
   onSelectionChange?: (id: string | null) => void
   onChange?: (user?: UserSipdPerencanaan) => void
   params?: GetListUserSipdPerencanaanParams
   delayFetch?: number
}

export const UserSipdPerencanaanSelector = forwardRef(
   (
      {
         onChange = () => {},
         // onInputChange = () => {},
         params,
         delayFetch = 1000,
         onValueChange = () => {},
         onSelectionChange = () => {},
         autocompleteProps: { selectedKey, ...props } = {},
      }: Props,
      ref: any
   ) => {
      const [selected, setSelected] = useState(selectedKey?.toString() || null)

      const [queryParams, setQueryParams] = useState({
         tahun: 0,
         ...params,
      })
      const [options, setOptions] = useState<UserSipdPerencanaan[]>([])
      const { data, isFetching, status } = useQuery({
         queryKey: [{ ...queryParams }, 'data_user_sipd_perencanaan'] as [
            GetListUserSipdPerencanaanParams,
            ...string[],
         ],
         queryFn: async ({ queryKey: [params] }) => {
            return await getUserSipdPerencanaan(params)
         },
         placeholderData: (previousData) => previousData,
      })
      useEffect(() => {
         setQueryParams({ tahun: 0, limit: 10, ...params })
      }, [params])
      useEffect(() => {
         if (data?.hasPreviousPage) {
            setOptions((old) => old.concat(data?.results || []))
         } else if (data?.results) {
            setOptions(data?.results)
         }
      }, [data])

      const debounceValueChange = debounce((value: string) => {
         const user = options?.find((d) => d.nama === value)
         if (user) {
            return
         }
         setQueryParams(({ after, ...old }) => ({ ...old, search: value ?? undefined }))
      }, delayFetch)

      const handleSelected = (key: any) => {
         setSelected(key)
         if (key && typeof key === 'string') {
            const user = options?.find((d) => d.id === key)
            onChange(user)
            onValueChange(user?.nama ?? null)
            onSelectionChange(user?.id ?? null)
         } else {
            onValueChange(null)
            onChange(undefined)
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
            aria-labelledby='user-perencanaan'
            placeholder='Pilih User SIPD Perencanaan...'
            variant='bordered'
            defaultFilter={() => true}
            defaultItems={[]}
            inputProps={{ name: 'user-perencanaan' }}
            {...props}
            defaultSelectedKey={props?.defaultSelectedKey?.toString()}
            listboxProps={{
               ...props.listboxProps,
               bottomContent: data?.hasNextPage ? bottomContent : undefined,
               emptyContent: 'Tidak ada data',
            }}
            scrollShadowProps={{
               ...props.scrollShadowProps,
               hideScrollBar: false,
            }}
            ref={ref}
            selectedKey={selected}
            // onInputChange={handleInputChange}
            onValueChange={debounceValueChange}
            onSelectionChange={handleSelected}
            items={options || []}
            isDisabled={props?.isDisabled || !options}
            isLoading={props?.isLoading || isFetching || status === 'pending'}>
            {({ id, nama, nip }) => (
               <AutocompleteItem
                  className='data-[selected=true]:text-primary'
                  classNames={{ title: 'whitespace-normal' }}
                  value={nip}
                  key={id}>
                  {nama ?? ''}
               </AutocompleteItem>
            )}
         </Autocomplete>
      )
   }
)
UserSipdPerencanaanSelector.displayName = 'UserSipdPerencanaanSelector'
export default UserSipdPerencanaanSelector
