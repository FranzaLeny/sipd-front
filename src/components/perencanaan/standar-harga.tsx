'use client'

import { forwardRef, useEffect, useMemo, useState } from 'react'
import {
   getListStandarHarga,
   GetStandarHargaListParams,
} from '@actions/perencanaan/data/standar-harga'
import {
   Autocomplete,
   AutocompleteItem,
   AutocompleteProps,
   Button,
   Select,
   Selection,
   SelectItem,
   SelectProps,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { StandarHarga } from '@zod'
import { compact, debounce } from 'lodash-es'
import { ArrowDown } from 'lucide-react'

interface StandarHargaSelectorProps
   extends Pick<
      AutocompleteProps,
      Exclude<
         keyof AutocompleteProps,
         'onChange' | 'children' | 'defaultItems' | 'items' | 'ref' | 'onValueChange'
      >
   > {
   onChange?: (value: number | null) => void
   onValueChange?: (standarHarga?: StandarHarga) => void
   params?: GetStandarHargaListParams
   delayFetch?: number
   warningEmpties?: boolean
}

export const StandarHargaSelector = forwardRef(
   (
      {
         onChange,
         params,
         delayFetch = 1000,
         onValueChange,
         warningEmpties,
         onSelectionChange,
         selectedKey,
         defaultSelectedKey,
         ...props
      }: StandarHargaSelectorProps,
      ref?: React.Ref<HTMLInputElement>
   ) => {
      const [selected, setSelected] = useState(selectedKey?.toString() || null)
      const [queryParams, setQueryParams] = useState({
         search: '',
         limit: 5,
         tahun: 0,
         set_input: 1,
         set_kab_kota: 1,
         ...params,
      })
      useEffect(() => {
         setQueryParams(({ after, ...old }) => ({ ...old, ...params, search: '' }))
      }, [params])
      const [options, setOptions] = useState<StandarHarga[]>([])
      const { data, isFetching, status, isFetched } = useQuery({
         queryKey: [{ ...queryParams }, 'data_standar_harga'] as [
            GetStandarHargaListParams,
            string,
         ],
         queryFn: async ({ queryKey: [params] }) => {
            return await getListStandarHarga(params)
         },
         placeholderData: (previousData) => previousData,
      })

      useEffect(() => {
         if (data?.hasPreviousPage) {
            setOptions((old) => old.concat(data?.results || []))
         } else if (data?.results) {
            setOptions(data?.results ?? [])
         }
      }, [data])

      const handleInputChange = debounce((value) => {
         const standarHarga = options?.find((d) => d.id_standar_harga === Number(selected))
         if (standarHarga && standarHarga.nama_standar_harga == value) {
            return
         }
         setQueryParams(({ after, ...old }) => ({ ...old, search: value ?? '' }))
      }, delayFetch)
      const handleSelected = (key: any) => {
         onSelectionChange && onSelectionChange(key)
         if (key && typeof key === 'string' && options?.length) {
            setSelected(key)
            const standarHarga = options?.find((d) => d.id_standar_harga === Number(key))
            onChange && onChange(standarHarga?.id_standar_harga ?? null)
            onValueChange && onValueChange(standarHarga)
         } else {
            onValueChange && onValueChange(undefined)
            onChange && onChange(null)
            setSelected(null)
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
            allowsCustomValue
            label='Komponen'
            placeholder='Pilih Komponen...'
            variant={warningEmpties && !options?.length ? 'faded' : 'bordered'}
            defaultFilter={() => true}
            shouldCloseOnBlur={false}
            defaultItems={[]}
            {...props}
            selectedKey={selected}
            defaultSelectedKey={defaultSelectedKey?.toString()}
            listboxProps={{
               topContent: 'Pilih StandarHarga',
               bottomContent: data?.hasNextPage ? bottomContent : undefined,
               emptyContent: 'Tidak ada data standar harga',
            }}
            onInputChange={handleInputChange}
            onSelectionChange={handleSelected}
            ref={ref}
            items={options || []}
            isDisabled={props?.isDisabled || !options}
            isLoading={props?.isLoading || isFetching || status === 'pending'}>
            {({ id_standar_harga, harga, nama_standar_harga }) => (
               <AutocompleteItem
                  className='data-[selected=true]:text-primary'
                  classNames={{ title: 'whitespace-normal' }}
                  endContent={harga?.toLocaleString()}
                  value={id_standar_harga}
                  key={id_standar_harga}>
                  {nama_standar_harga ?? ''}
               </AutocompleteItem>
            )}
         </Autocomplete>
      )
   }
)

StandarHargaSelector.displayName = 'StandarHargaSelector'

export default StandarHargaSelector

export type Tipe = 'SSH' | 'HSPK' | 'ASB' | 'SBU'
export type Kelompok = 1 | 2 | 3 | 4
export interface KelompokStandarHarga {
   key: Kelompok
   label: Tipe
}

const KELOMPOK_SSH: KelompokStandarHarga[] = [
   { key: 1, label: 'SSH' },
   { key: 2, label: 'HSPK' },
   { key: 3, label: 'ASB' },
   { key: 4, label: 'SBU' },
]

type TipeStandarHargaSelectorProps = Pick<
   SelectProps<KelompokStandarHarga>,
   Exclude<
      keyof SelectProps<KelompokStandarHarga>,
      | 'children'
      | 'selectionMode'
      | 'defaultSelectedKeys'
      | 'items'
      | 'onSelect'
      | 'selectedKeys'
      | 'defaultSelectedKeys'
   >
> &
   (
      | {
           onInputChange?: (value?: Tipe[]) => void
           onChange?: (value?: KelompokStandarHarga) => void
           selectionMode: 'multiple'
           onValueChange?: (value?: KelompokStandarHarga[]) => void
        }
      | {
           onValueChange?: (value?: KelompokStandarHarga) => void
           onInputChange?: (value?: Tipe) => void
           selectionMode?: 'single'
        }
   ) & {
      selectedKeys?: (number | undefined | null)[] | null
      defaultSelectedKeys?: (number | undefined | null)[] | null
   }

export const TipeStandarHargaSelector: React.FC<TipeStandarHargaSelectorProps> = ({
   onSelectionChange,
   onValueChange,
   onInputChange,
   selectionMode,
   defaultSelectedKeys,
   selectedKeys,
   ...props
}) => {
   const [selected, setSelected] = useState<Selection>()
   const handleSelectionChange = (v: Selection) => {
      onSelectionChange && onSelectionChange(v)
      setSelected(v)
      if (selectionMode === 'multiple' && v === 'all') {
         onInputChange && onInputChange(KELOMPOK_SSH.map((d) => d.label))
         onValueChange && onValueChange(KELOMPOK_SSH)
         return
      } else if (v !== 'all') {
         const values = [...v]
         const selected = KELOMPOK_SSH.filter((d) => values.includes(d.label))
         if (selectionMode === 'multiple') {
            onInputChange && onInputChange(selected.map((d) => d.label))
            onValueChange && onValueChange(selected)
         } else {
            onInputChange && onInputChange(selected[0]?.label)
            onValueChange && onValueChange(selected[0])
         }
      }
   }
   const _defaultSelectedKeys = useMemo(
      () => (defaultSelectedKeys ? compact(defaultSelectedKeys)?.map((d) => d.toString()) : []),
      [defaultSelectedKeys]
   )
   useEffect(() => {
      if (selectedKeys && selectedKeys.length) {
         const selected = compact(selectedKeys)?.map((d) => d.toString())
         setSelected(new Set([...selected]))
      }
   }, [selectedKeys])

   return (
      <Select
         variant='bordered'
         label='Kelompok Standar Harga'
         placeholder='Pilih Tipe Standar Harga'
         {...props}
         items={KELOMPOK_SSH}
         defaultSelectedKeys={_defaultSelectedKeys}
         selectedKeys={selected}
         selectionMode={selectionMode}
         onSelectionChange={handleSelectionChange}>
         {(item) => (
            <SelectItem
               key={item?.label}
               value={item?.key}>
               {item?.label}
            </SelectItem>
         )}
      </Select>
   )
}
