'use client'

import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
   AllJadwalAnggaranRakParams,
   getAllJadwalAnggaran,
   getAllJadwalAnggaranRak,
   GetJadwalAnggaranParams,
   JadwalAnggaran,
} from '@actions/perencanaan/rka/jadwal-anggaran'
import Timer from '@components/ui/timer'
import {
   Autocomplete,
   AutocompleteItem,
   AutocompleteProps,
   Button,
   Chip,
   Dropdown,
   DropdownItem,
   DropdownMenu,
   DropdownTrigger,
   Selection,
   Tooltip,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from '@shared/hooks/use-session'

interface Props
   extends Pick<
      AutocompleteProps,
      Exclude<
         keyof AutocompleteProps,
         'onChange' | 'children' | 'onSelectionChange' | 'defaultItems' | 'items' | 'ref'
      >
   > {
   onChange?: (jadwal?: JadwalAnggaran) => void
   onJadwalMurniChange?: (jadwal?: JadwalAnggaran) => void
   defaultParams?: GetJadwalAnggaranParams & {
      hasPendapatan?: 'true' | 'false'
      hasRincian?: 'true' | 'false'
      hasSubGiat?: 'true' | 'false'
      orderBy?: string[] | string
   }
   localOnly?: boolean
   sipdOnly?: boolean
   isLocked?: boolean
   keyByIdUnik?: boolean
   onSelectionChange?: (id: string) => void
}

export const JadwalInput = forwardRef((jadwalProps: Props, ref?: React.Ref<HTMLInputElement>) => {
   const {
      onChange,
      sipdOnly,
      localOnly,
      isLocked,
      keyByIdUnik,
      onSelectionChange = () => {},
      onJadwalMurniChange,
      defaultParams = {},
      selectedKey = '',
      ...props
   } = jadwalProps

   const { data: session, status } = useSession()
   const params_jadwal = useMemo(() => {
      if (session?.user) {
         const { id_daerah, tahun } = session.user
         return {
            id_daerah,
            tahun,
            orderBy: ['-is_active', '-id_jadwal', 'is_lokal', '-id'],
            ...defaultParams,
         }
      }
      return defaultParams
   }, [session?.user, defaultParams])

   const { data, isFetching } = useQuery({
      queryKey: [params_jadwal, 'jadwal_anggaran'],
      queryFn: async ({ queryKey: [params] }) => {
         if (params && typeof params === 'object') {
            return await getAllJadwalAnggaran(params).then((res) => {
               return res?.data
            })
         } else {
            return []
         }
      },
      enabled: status === 'authenticated',
   })
   const disabledKeys = useMemo(() => {
      const keys = props?.disabledKeys ? [...props?.disabledKeys] : []
      if (data?.length) {
         if (localOnly) {
            const _data = data.filter((d) => d?.is_lokal === true)
            _data.map((d) => {
               keyByIdUnik ? keys.push(d.id_unik) : keys.push(d.id)
            })
         }
         if (sipdOnly) {
            const _data = data.filter((d) => !d?.is_lokal === true)
            _data.map((d) => {
               keyByIdUnik ? keys.push(d.id_unik) : keys.push(d.id)
            })
         }
         if (isLocked) {
            const _data = data.filter((d) => !d.is_locked)
            _data.map((d) => {
               keyByIdUnik ? keys.push(d.id_unik) : keys.push(d.id)
            })
         }
      }
      return keys
   }, [localOnly, sipdOnly, isLocked, data, keyByIdUnik, props?.disabledKeys])
   const handleSelect = useCallback(
      (select: React.Key | null) => {
         onSelectionChange && onSelectionChange(select?.toString() ?? '')
         if (data?.length && select) {
            const jadwal = data?.find((d) => (keyByIdUnik ? d.id_unik === select : d.id === select))
            const jadwal_murni = data?.find((d) => d.id_unik === jadwal?.id_unik_murni)
            !!onChange && onChange(jadwal)
            !!onJadwalMurniChange && onJadwalMurniChange(jadwal_murni)
         } else {
            !!onJadwalMurniChange && onJadwalMurniChange(undefined)
            !!onChange && onChange(undefined)
         }
      },
      [onChange, data, keyByIdUnik, onJadwalMurniChange, onSelectionChange]
   )

   return (
      <Autocomplete
         radius='full'
         label='Jadwal :'
         placeholder='Pilih Jadwal Anggaran...'
         variant='bordered'
         labelPlacement='outside'
         {...props}
         selectedKey={selectedKey}
         onSelectionChange={handleSelect}
         ref={ref}
         defaultItems={data || []}
         disabledKeys={[...disabledKeys]}
         isDisabled={props?.isDisabled || !data?.length}
         isLoading={props?.isLoading || isFetching || status === 'loading'}>
         {({ is_locked, nama_sub_tahap, id, id_unik, is_lokal }) => (
            <AutocompleteItem
               className='data-[selected=true]:text-primary'
               classNames={{ title: 'whitespace-normal' }}
               endContent={is_locked ? '' : 'Masih Terbuka'}
               textValue={nama_sub_tahap}
               key={keyByIdUnik ? id_unik : id}>
               {nama_sub_tahap} {!is_lokal && <span className={`font-bold `}>(SIPD)</span>}
            </AutocompleteItem>
         )}
      </Autocomplete>
   )
})
JadwalInput.displayName = 'JadwalInput'
export default JadwalInput

interface JadwalRakInputProps
   extends Pick<
      AutocompleteProps,
      Exclude<
         keyof AutocompleteProps,
         'onChange' | 'children' | 'onSelectionChange' | 'defaultItems' | 'items' | 'ref'
      >
   > {
   onChange?: (jadwal?: JadwalAnggaran) => void
   onListJadwalChange?: (listJadwal: JadwalAnggaran[]) => void
   defaultParams: AllJadwalAnggaranRakParams
   onSelectionChange?: (id: string) => void
}
export const JadwalRakInput = forwardRef(
   (jadwalProps: JadwalRakInputProps, ref?: React.Ref<HTMLInputElement>) => {
      const {
         onChange,
         onSelectionChange = () => {},
         defaultParams,
         onListJadwalChange = () => {},
         selectedKey = '',
         ...props
      } = jadwalProps

      const { data, isFetching } = useQuery({
         queryKey: [defaultParams, 'jadwal_anggaran', 'jadwal_anggaran_rak'] as [
            AllJadwalAnggaranRakParams,
            string,
            string,
         ],
         queryFn: async ({ queryKey: [params] }) => {
            if (params && typeof params === 'object') {
               return await getAllJadwalAnggaranRak(params).then((res) => {
                  return res?.data
               })
            } else {
               return []
            }
         },
         enabled: !!defaultParams?.id_daerah && !!!!defaultParams?.tahun,
      })

      const handleSelect = useCallback(
         (select: React.Key | null) => {
            onSelectionChange && onSelectionChange(select?.toString() ?? '')
            if (data?.length && select) {
               const jadwal = data?.find((d) => d.id === select)
               !!onChange && onChange(jadwal)
            } else {
               !!onChange && onChange(undefined)
            }
         },
         [onChange, data, onSelectionChange]
      )

      useEffect(() => {
         onListJadwalChange(data ?? [])
      }, [data, onListJadwalChange])
      return (
         <Autocomplete
            label='Jadwal RAK :'
            placeholder='Pilih Jadwal RAK...'
            variant='bordered'
            {...props}
            selectedKey={selectedKey}
            onSelectionChange={handleSelect}
            ref={ref}
            defaultItems={data || []}
            isDisabled={props?.isDisabled || !data?.length}
            isLoading={props?.isLoading || isFetching}>
            {({ is_locked, nama_sub_tahap, id, id_unik, is_lokal }) => (
               <AutocompleteItem
                  className='data-[selected=true]:text-primary'
                  classNames={{ title: 'whitespace-normal' }}
                  endContent={is_locked ? '' : 'Masih Terbuka'}
                  textValue={nama_sub_tahap}
                  key={id}>
                  {nama_sub_tahap} {!is_lokal && <span className={`font-bold `}>(SIPD)</span>}
               </AutocompleteItem>
            )}
         </Autocomplete>
      )
   }
)
JadwalRakInput.displayName = 'JadwalRakInput'

export const JadwalAnggaranSearchParams: React.FC<{
   data: JadwalAnggaran[]
   defaultSelected?: string
}> = ({ data, defaultSelected }) => {
   const searchParams = useSearchParams()
   const [selected, setSelected] = useState<Selection>(
      new Set([defaultSelected ? defaultSelected : data?.find((d) => d.is_active)?.id || ''])
   )
   useEffect(() => {
      const id = searchParams.get('jadwal_anggaran_id')
      if (id) {
         setSelected(new Set([id]))
      } else if (defaultSelected) {
         setSelected(new Set([defaultSelected]))
      }
   }, [searchParams, defaultSelected])
   const createQueryString = useCallback(
      (name: string, value: string) => {
         const params = new URLSearchParams(searchParams.toString())
         params.set(name, value)

         return params.toString()
      },
      [searchParams]
   )

   return (
      <Dropdown classNames={{ content: 'max-h-64 overflow-auto max-w-xl' }}>
         <DropdownTrigger>
            <Button>Pilih Jadwal</Button>
         </DropdownTrigger>
         <DropdownMenu
            selectedKeys={selected}
            disabledKeys={selected}
            classNames={{ base: 'max-h-64 overflow-auto max-w-xl' }}
            items={data}
            aria-label='Tahun'
            selectionMode='single'>
            {({ id, is_lokal, nama_sub_tahap, is_active }) => (
               <DropdownItem
                  as={Link}
                  // @ts-expect-error
                  prefetch={false}
                  scroll={false}
                  endContent={
                     <TypeJadwal
                        is_lokal={is_lokal}
                        is_active={is_active}
                     />
                  }
                  href={`?${createQueryString('jadwal_anggaran_id', id)}`}
                  // textValue={id}
                  key={id}>
                  <div className='max-w-full whitespace-normal'>{nama_sub_tahap}</div>
               </DropdownItem>
            )}
         </DropdownMenu>
      </Dropdown>
   )
}

export function TypeJadwal({
   is_active,
   is_lokal,
}: {
   is_active?: boolean | null
   is_lokal?: boolean | null
}) {
   return (
      <div className='flex gap-4'>
         <Chip
            variant={is_active ? 'dot' : 'light'}
            color={is_active ? 'success' : 'default'}>
            {is_lokal ? 'LOKAL' : 'SIPD'}
         </Chip>
      </div>
   )
}

interface JadwalAnggaranPreviewProps {
   isLocked?: boolean | null | undefined
   isActive?: boolean | null | undefined
   nama: string
   waktuSelesai: Date
}

export const JadwalAnggaranSelected: React.FunctionComponent<JadwalAnggaranPreviewProps> = ({
   isLocked = true,
   nama = '',
   waktuSelesai = new Date(),
   isActive = false,
}) => {
   const [isOpen, setIsOpen] = useState(false)
   return (
      <Tooltip
         shouldCloseOnBlur
         isOpen={isOpen}
         isDismissable
         onOpenChange={(open) => setIsOpen(open)}
         placement='bottom'
         content={nama}>
         <Chip
            classNames={{ base: 'animate-pulse' }}
            onClick={() => setIsOpen(!isOpen)}
            variant={isLocked ? 'light' : isActive ? 'dot' : 'light'}
            color={isLocked ? 'danger' : 'success'}>
            <p>{isLocked ? 'Jadwal Dikunci' : <Timer waktuSelesai={waktuSelesai} />}</p>
         </Chip>
      </Tooltip>
   )
}
