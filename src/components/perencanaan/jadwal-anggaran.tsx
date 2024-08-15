'use client'

import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
   getAllJadwalAnggaran,
   GetAllJadwalAnggaranParams,
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
   onListJadwalChange?: (listJadwal: JadwalAnggaran[]) => void
   onChange?: (jadwal?: JadwalAnggaran) => void
   onJadwalMurniChange?: (jadwal?: JadwalAnggaran) => void
   params?: Partial<GetAllJadwalAnggaranParams>
   keyByIdUnik?: boolean
   onSelectionChange?: (id: string) => void
}

export const JadwalInput = forwardRef((jadwalProps: Props, ref?: React.Ref<HTMLInputElement>) => {
   const {
      onChange,
      keyByIdUnik,
      onSelectionChange = () => {},
      onListJadwalChange = () => {},
      onJadwalMurniChange,
      params = { id_daerah: 0, tahun: 0 },
      selectedKey = '',
      ...props
   } = jadwalProps

   const { data: session, status } = useSession()
   const params_jadwal: GetAllJadwalAnggaranParams = useMemo(() => {
      if (!!session?.user && !(!!params?.id_daerah && !!params.tahun)) {
         const { id_daerah, tahun } = session?.user

         return {
            ...params,
            id_daerah: !!params?.id_daerah ? params?.id_daerah : id_daerah,
            tahun: !!params?.tahun ? params?.tahun : tahun,
         }
      } else {
         return { id_daerah: 0, tahun: 0, ...params }
      }
   }, [session?.user, params])

   const { data, isFetching } = useQuery({
      queryKey: [params_jadwal, 'jadwal_anggaran'] as [GetAllJadwalAnggaranParams, ...any],
      queryFn: async ({ queryKey: [params] }) => await getAllJadwalAnggaran(params),
      enabled: !!params_jadwal?.id_daerah && !!params_jadwal?.tahun,
   })

   useEffect(() => {
      !!data?.length && onListJadwalChange(data)
   }, [data, onListJadwalChange])

   const handleSelect = useCallback(
      (select: React.Key | null) => {
         onSelectionChange && onSelectionChange(select?.toString() ?? '')
         if (!!data?.length && !!select) {
            const jadwal = data?.find((d) => (keyByIdUnik ? d.id_unik === select : d.id === select))
            const jadwal_murni = data?.find((d) => d.id_unik === jadwal?.id_unik_murni)
            !!onChange && onChange(jadwal)
            !!onJadwalMurniChange && onJadwalMurniChange(jadwal_murni)
         } else {
            !!onJadwalMurniChange && onJadwalMurniChange(undefined)
            !!onChange && onChange(undefined)
         }
      },
      [onSelectionChange, data, keyByIdUnik, onChange, onJadwalMurniChange]
   )

   return (
      <Autocomplete
         label='Jadwal Anggaran'
         fullWidth
         listboxProps={{ emptyContent: 'Tidak ada data jadwal' }}
         variant='bordered'
         placeholder='Pilih Jadwal...'
         {...props}
         selectedKey={selectedKey}
         onSelectionChange={handleSelect}
         ref={ref}
         defaultItems={data || []}
         isDisabled={props?.isDisabled}
         isLoading={props?.isLoading || isFetching || status === 'loading'}>
         {({ is_locked, nama_sub_tahap, id, id_unik, is_lokal }) => (
            <AutocompleteItem
               className='data-[selected=true]:text-primary'
               classNames={{ title: 'whitespace-normal' }}
               endContent={is_locked === 3 ? 'Dihapus' : is_locked === 1 ? 'Dikunci' : 'Dibuka'}
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

export function TypeJadwal({ is_active, is_lokal }: { is_active?: number; is_lokal?: number }) {
   return (
      <div className='flex gap-4'>
         <Chip
            variant={!!is_active ? 'dot' : 'light'}
            color={!!is_active ? 'success' : 'default'}>
            {!!is_lokal ? 'LOKAL' : 'SIPD'}
         </Chip>
      </div>
   )
}

export const JadwalAnggaranSearchParams: React.FC<{
   data: JadwalAnggaran[]
   defaultSelected?: string
}> = ({ data, defaultSelected }) => {
   const searchParams = useSearchParams()
   const [selected, setSelected] = useState<Selection>(
      new Set([defaultSelected ? defaultSelected : data?.find((d) => !!d.is_active)?.id || ''])
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

interface JadwalAnggaranPreviewProps {
   isLocked?: number
   isActive?: number
   nama: string
   waktuSelesai: Date
}

export const JadwalAnggaranSelected: React.FunctionComponent<JadwalAnggaranPreviewProps> = ({
   isLocked = 1,
   nama = '',
   waktuSelesai = new Date(),
   isActive = 0,
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
            variant={!!isLocked ? 'light' : !!isActive ? 'dot' : 'light'}
            color={!!isLocked ? 'danger' : 'success'}>
            <p>{!!isLocked ? 'Jadwal Dikunci' : <Timer waktuSelesai={waktuSelesai} />}</p>
         </Chip>
      </Tooltip>
   )
}
