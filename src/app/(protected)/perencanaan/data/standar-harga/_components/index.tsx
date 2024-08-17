'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { HelperColumns } from '@components/table'
import { DiffForHumans } from '@components/ui/DiffForHumans'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import hasAccess from '@utils/chek-roles'
import { MoreVertical, PlusCircle } from 'lucide-react'
import { numberToText } from '@shared/utils'
import { kelompokToTipe } from '@shared/utils/standar-harga'

import PilihTipe, { TIPES } from './pilih-tipe'

export const ActionStandarHargaTable = ({ roles }: { roles?: RoleUser[] }) => {
   const searchParams = useSearchParams()
   const _tipe = searchParams.get('tipe')?.toUpperCase() || 'SSH'
   const id_akun = searchParams.get('id_akun')
   const tipe = TIPES.includes(_tipe as (typeof TIPES)[number]) ? _tipe : 'SSH'

   const router = useRouter()
   const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const searchParams = new URLSearchParams()
      searchParams.append('tipe', e?.target?.value?.toLocaleLowerCase())
      id_akun && searchParams.append('id_akun', id_akun)
      router.replace(`standar-harga?${searchParams}`)
   }
   const canAdd = useMemo(() => {
      if (!!roles && roles?.length) {
         return hasAccess(['admin_perencanaan', 'admin'], roles)
      }
      return false
   }, [roles])
   return (
      <>
         <PilihTipe
            aria-label='Tipe'
            disallowEmptySelection
            selectedKeys={[tipe]}
            onChange={handleSelectionChange}
            labelPlacement='outside-left'
            placeholder='Pilih Tipe'
            className='w-28'
            fullWidth={false}
         />
         {canAdd && (
            <Button
               as={Link}
               prefetch={false}
               scroll={false}
               href='standar-harga/add'
               title='Tabah Standar Harga'
               color='primary'>
               Baru
               <PlusCircle />
            </Button>
         )}
      </>
   )
}

export default function rowActions(data: StandarHarga) {
   let disabledKeys: Iterable<string> = new Set([])
   // if (data.is_sipd) {
   //   disabledKeys = new Set(['delete', 'edit'])
   // } else {
   //   disabledKeys = new Set(['mapping'])
   // }
   return (
      <Dropdown>
         <DropdownTrigger>
            <Button
               size='sm'
               isIconOnly
               variant='light'>
               <MoreVertical />
            </Button>
         </DropdownTrigger>
         <DropdownMenu
            disabledKeys={disabledKeys}
            aria-label='Static Actions'>
            <DropdownItem
               href={`/sipd-ri/sync/data/standar-harga/${data.id}`}
               key='Singkron'>
               Maping Akun
            </DropdownItem>
            <DropdownItem
               href={`standar-harga/${data.id}`}
               key='view'>
               Lihat
            </DropdownItem>
            <DropdownItem
               href={`standar-harga/${data.id}/edit`}
               key='edit'>
               Ubah
            </DropdownItem>
            <DropdownItem
               href={`standar-harga/${data.id}/delete`}
               key='delete'>
               Hapus
            </DropdownItem>
         </DropdownMenu>
      </Dropdown>
   )
}
const diffForHumans = (value?: string | number | Date | null) => {
   return <DiffForHumans value={value} />
}
export const helperColumns: HelperColumns<StandarHarga> = {
   kode_standar_harga: {
      key: 'kode_standar_harga',
      sortable: true,
      name: 'Kode',
      hide: true,
   },
   nama_standar_harga: {
      key: 'nama_standar_harga',
      name: 'Nama Standar Harga',
   },
   spek: {
      key: 'spek',
      name: 'Spek',
   },
   kelompok: {
      key: 'kelompok',
      name: 'Kelompok',
      sortable: true,
      headerProps: { align: 'center' },
      cell: kelompokToTipe,
   },
   satuan: {
      key: 'satuan',
      name: 'Satuan',
   },
   harga: {
      key: 'harga',
      sortable: true,
      name: 'Harga',
      headerProps: { align: 'end' },
      cell: numberToText,
   },
   nilai_tkdn: {
      key: 'nilai_tkdn',
      sortable: true,
      name: 'TKDN',
      headerProps: { align: 'end' },
      cell: (n) => numberToText(n, 2) + ' %',
   },
   created_at: {
      key: 'created_at',
      sortable: true,
      name: 'Dibuat',
      hide: true,
      headerProps: { align: 'center' },
      cell: diffForHumans,
   },
   updated_at: {
      key: 'updated_at',
      sortable: true,
      name: 'Diubah',
      hide: true,
      headerProps: { align: 'center' },
      cell: diffForHumans,
   },
   aksi: {
      key: 'id',
      name: 'Aksi',
      headerProps: { align: 'center' },
      cellProps: { className: 'p-0' },
      renderCell: rowActions,
   },
}
