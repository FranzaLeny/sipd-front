'use client'

import { forwardRef, useEffect, useState } from 'react'
import { getListAkun } from '@actions/perencanaan/data/akun'
import { Autocomplete, AutocompleteItem, Button, type AutocompleteProps } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { debounce } from 'lodash-es'
import { ArrowDown } from 'lucide-react'

type GetListAkunParams = Parameters<typeof getListAkun>[0]

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
   onValueChange?: (nama_akun: string | null) => void
   onSelectionChange?: (id_akun: number | null) => void
   onChange?: (akun?: Akun) => void
   params?: GetListAkunParams
   delayFetch?: number
   refetchOnInput?: boolean
}

export const AkunSelector = forwardRef(
   (
      {
         onChange,
         params,
         delayFetch = 1000,
         onValueChange,
         selectedKey,
         onSelectionChange,
         refetchOnInput = true,
         ...props
      }: Props,
      ref?: React.Ref<HTMLInputElement>
   ) => {
      const [queryParams, setQueryParams] = useState({
         limit: 5,
         tahun: 0,
         ...params,
      })
      const [options, setOptions] = useState<Akun[]>([])
      const { data, isFetching, status } = useQuery({
         queryKey: [{ ...queryParams }, 'data_akun'] as [GetListAkunParams, string],
         queryFn: async ({ queryKey: [params] }) => {
            return await getListAkun(params)
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
         if (refetchOnInput) {
            const akun = options?.find((d) => d.nama_akun === value)
            if (akun) {
               return
            }
            setQueryParams(({ after, ...old }) => ({ ...old, search: value ?? undefined }))
         }
      }, delayFetch)

      const handleSelected = (key: any) => {
         if (key && typeof key === 'string') {
            const akun = options?.find((d) => d.id_akun === Number(key))
            onChange && onChange(akun)
            onValueChange && onValueChange(akun?.nama_akun ?? null)
            onSelectionChange && onSelectionChange(akun?.id_akun ?? null)
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
            popoverProps={{ isOpen: true, defaultOpen: true }}
            // allowsCustomValue
            label='Akun Belanja'
            variant='bordered'
            defaultFilter={() => true}
            shouldCloseOnBlur={false}
            defaultItems={[]}
            {...props}
            defaultSelectedKey={props?.defaultSelectedKey?.toString()}
            listboxProps={{
               ...props?.listboxProps,
               bottomContent: data?.hasNextPage ? bottomContent : undefined,
               emptyContent: 'Tidak ada data akun',
            }}
            selectedKey={selectedKey?.toString()}
            onInputChange={handleInputChange}
            onSelectionChange={handleSelected}
            ref={ref}
            items={options || []}
            isDisabled={props?.isDisabled || !options}
            isLoading={props?.isLoading || isFetching || status === 'pending'}>
            {({ id_akun, kode_akun, nama_akun }) => (
               <AutocompleteItem
                  className='data-[selected=true]:text-primary'
                  classNames={{ title: 'whitespace-normal' }}
                  startContent={kode_akun}
                  value={id_akun}
                  key={id_akun}>
                  {nama_akun ?? ''}
               </AutocompleteItem>
            )}
         </Autocomplete>
      )
   }
)

AkunSelector.displayName = 'AkunSelector'

export default AkunSelector

export interface ObjectBl {
   akun: Partial<
      Pick<
         GetListAkunParams,
         | 'is_gaji_asn'
         | 'is_barjas'
         | 'is_bunga'
         | 'is_subsidi'
         | 'is_hibah_brg'
         | 'is_bagi_hasil'
         | 'is_bankeu_khusus'
         | 'is_btt'
         | 'is_bos'
         | 'is_hibah_uang'
         | 'is_sosial_uang'
         | 'is_bankeu_umum'
         | 'set_lokus'
         | 'is_sosial_brg'
         | 'is_modal_tanah'
      >
   >
   label: string
   value:
      | 'BTL-GAJI'
      | 'BARJAS-MODAL'
      | 'BUNGA'
      | 'SUBSIDI'
      | 'HIBAH-BRG'
      | 'HIBAH'
      | 'BANSOS-BRG'
      | 'BANSOS'
      | 'BAGI-HASIL'
      | 'BANKEU'
      | 'BANKEU-KHUSUS'
      | 'BTT'
      | 'BOS'
      | 'BLUD'
      | 'TANAH'
   fields?: string[]
}
export const LIST_OBJECT_BL: ObjectBl[] = [
   {
      value: 'BTL-GAJI',
      label: 'Belanja Gaji dan Tunjangan ASN',
      akun: { is_gaji_asn: 1 },
      fields: [],
   },
   {
      value: 'BARJAS-MODAL',
      label: 'Belanja Barang Jasa dan Modal',
      akun: { is_barjas: 1 },
      fields: ['komponen'],
   },
   {
      value: 'BUNGA',
      label: 'Belanja Bunga',
      fields: ['penerima'],
      akun: { is_bunga: 1 },
   },
   {
      value: 'SUBSIDI',
      label: 'Belanja Subsidi',
      fields: ['penerima'],
      akun: { is_subsidi: 1 },
   },
   {
      value: 'HIBAH-BRG',
      label: 'Belanja Hibah (Barang / Jasa)',
      fields: ['selectPenerima', 'lokasi', 'komponen'],
      akun: { is_hibah_brg: 1 },
   },
   {
      value: 'HIBAH',
      label: 'Belanja Hibah (Uang)',
      fields: ['selectPenerima', 'lokasi'],
      akun: { is_hibah_uang: 1 },
   },
   {
      value: 'BANSOS-BRG',
      label: 'Belanja Bantuan Sosial (Barang / Jasa)',
      fields: ['selectPenerima', 'komponen'],
      akun: { is_sosial_brg: 1 },
   },
   {
      value: 'BANSOS',
      label: 'Belanja Bantuan Sosial (Uang)',
      fields: ['selectPenerima'],
      akun: { is_sosial_uang: 1 },
   },
   {
      value: 'BAGI-HASIL',
      label: 'Belanja Bagi Hasil',
      fields: ['lokasi'],
      akun: { is_bagi_hasil: 1 },
   },
   {
      value: 'BANKEU',
      label: 'Belanja Bantuan Keangan Umum',
      fields: [],
      akun: { is_bankeu_umum: 1 },
   },
   {
      value: 'BANKEU-KHUSUS',
      label: 'Belanja Bantuan Keuangan Khusus',
      fields: [],
      akun: { is_bankeu_khusus: 1 },
   },
   {
      value: 'BTT',
      label: 'Belanja Tidak Terduga (BTT)',
      fields: [''],
      akun: { is_btt: 1 },
   },
   {
      value: 'BOS',
      label: 'Dana Bos (BOS Pusat)',
      fields: ['selectPenerima'],
      akun: { is_bos: 1 },
   },
   {
      value: 'BLUD',
      label: 'Belanja Operasional (BLUD)',
      fields: [],
      akun: { set_lokus: 'blud' },
   },
   {
      value: 'TANAH',
      label: 'Belanja Pembebasan Tanah / Lahan',
      fields: [],
      akun: { is_modal_tanah: 1 },
   },
]

type ObjekBlProps = Pick<
   AutocompleteProps<ObjectBl>,
   Exclude<
      keyof AutocompleteProps<ObjectBl>,
      'children' | 'defaultItems' | 'onSelectionChange' | 'onChange'
   >
> & {
   onValueChange?: (value?: string | null) => void
   onChange?: (value?: ObjectBl) => void
   onSelectionChange?: (value?: string | null) => void
}

export const ObjekBlSelector: React.FC<ObjekBlProps> = ({
   onSelectionChange,
   onValueChange,
   onSelect,
   onChange,
   selectedKey,
   ...props
}) => {
   const [selected, setSelected] = useState(selectedKey?.toString() || null)
   const handleSelectionChange = (value: any) => {
      setSelected(value)
      const _selected = LIST_OBJECT_BL.find((d) => d.value === value)
      if (_selected) {
         onChange && onChange(_selected)
         onValueChange && onValueChange(_selected?.label ?? null)
         onSelectionChange && onSelectionChange(_selected?.value)
      } else {
         onChange && onChange(undefined)
         onValueChange && onValueChange(null)
         onSelectionChange && onSelectionChange(undefined)
      }
   }

   return (
      <Autocomplete
         listboxProps={{ emptyContent: 'Tidak ada data' }}
         variant='bordered'
         aria-labelledby='Object Belanja'
         placeholder='Pilih Jenis Belanja...'
         {...props}
         selectedKey={selected}
         defaultItems={LIST_OBJECT_BL}
         onSelectionChange={handleSelectionChange}>
         {(item) => (
            <AutocompleteItem
               key={item?.value}
               value={item?.value}>
               {item?.label}
            </AutocompleteItem>
         )}
      </Autocomplete>
   )
}
