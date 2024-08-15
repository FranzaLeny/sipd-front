'use client'

import { forwardRef, useEffect, useState } from 'react'
import {
   getUserSipdPerencanaan,
   GetUserSipdPerencanaanListParams,
} from '@actions/perencanaan/data/user'
import { Autocomplete, AutocompleteItem, AutocompleteProps, Button } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { UserSipdPerencanaan } from '@zod'
import { debounce } from 'lodash-es'
import { ArrowDown } from 'lucide-react'

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
   onValueChange?: (nama: string | null) => void
   onSelectionChange?: (id: string | null) => void
   onChange?: (user?: UserSipdPerencanaan) => void
   params?: GetUserSipdPerencanaanListParams
   delayFetch?: number
}

export const UserSipdPerencanaanSelector = forwardRef(
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
      ref: any
   ) => {
      const [selected, setSelected] = useState(selectedKey?.toString() || null)

      const [queryParams, setQueryParams] = useState({
         search: '',
         tahun: 0,
         ...params,
      })
      const [options, setOptions] = useState<UserSipdPerencanaan[]>([])
      const { data, isFetching, status, isFetched } = useQuery({
         queryKey: [{ ...queryParams }, 'data_user_sipd_perencanaan'] as [
            GetUserSipdPerencanaanListParams,
            ...string[],
         ],
         queryFn: async ({ queryKey: [params] }) => {
            return await getUserSipdPerencanaan(params)
         },
         placeholderData: (previousData) => previousData,
      })
      useEffect(() => {
         setQueryParams({ tahun: 0, limit: 10, ...params, search: '' })
      }, [params])
      useEffect(() => {
         if (data?.hasPreviousPage) {
            setOptions((old) => old.concat(data?.results || []))
         } else if (data?.results) {
            setOptions(data?.results)
         }
      }, [data])

      const handleInputChange = debounce((value: string) => {
         const user = options?.find((d) => d.nama === value)
         if (user) {
            return
         }
         setQueryParams(({ after, ...old }) => ({ ...old, search: value ?? '' }))
      }, delayFetch)

      const handleSelected = (key: any) => {
         setSelected(key)
         if (key && typeof key === 'string') {
            const user = options?.find((d) => d.id === key)
            onChange && onChange(user)
            onValueChange && onValueChange(user?.nama ?? null)
            onSelectionChange && onSelectionChange(user?.id ?? null)
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
            // onKeyDown={(e: any) => e.continuePropagation()}
            aria-labelledby='user-perencanaan'
            placeholder='Pilih User SIPD Perencanaan...'
            variant='bordered'
            defaultFilter={() => true}
            defaultItems={[]}
            inputProps={{ name: 'user-perencanaan' }}
            {...props}
            // inputProps={{ ref }}
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
            onInputChange={handleInputChange}
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
