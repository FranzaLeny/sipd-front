'use client'

import Link from 'next/link'
import { type HelperColumns } from '@components/table'
import { DiffForHumans } from '@components/ui/DiffForHumans'
import {
   Button,
   Chip,
   Dropdown,
   DropdownItem,
   DropdownMenu,
   DropdownTrigger,
} from '@nextui-org/react'
import { MoreVertical } from 'lucide-react'
import { useSession } from '@shared/hooks/use-session'
import { snakeToTileCase } from '@shared/utils'

export const ActionTahapanTable = () => {
   const { hasAcces } = useSession(['super_admin', 'admin', 'admin_perencanaan'])
   return hasAcces ? (
      <Button
         as={Link}
         href='tahapan/add'
         prefetch={false}
         scroll={false}
         color='primary'>
         Baru
      </Button>
   ) : null
}
const diffForHumans = (value?: string | number | Date | null) => {
   return <DiffForHumans value={value} />
}

const status = (status_aktif: boolean) => {
   return (
      <Chip
         size='sm'
         isDisabled={!status_aktif}
         color={status_aktif ? 'primary' : 'default'}>
         {status_aktif ? 'Aktif' : 'Tidak aktif'}
      </Chip>
   )
}

export default function rowActions(id: string) {
   // TODO cek akses
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
         <DropdownMenu aria-label='Actions'>
            <DropdownItem
               href={`tahapan/${id}`}
               key='view'>
               Lihat
            </DropdownItem>
            <DropdownItem
               href={`tahapan/${id}/edit`}
               key='edit'>
               Ubah
            </DropdownItem>
            <DropdownItem
               href={`tahapan/${id}/delete`}
               key='delete'>
               Hapus
            </DropdownItem>
         </DropdownMenu>
      </Dropdown>
   )
}

export const helperColumns: HelperColumns<Tahapan> = {
   nama_tahap: {
      key: 'nama_tahap',
      name: 'Nama Tahapan',
   },
   status_tahap: {
      key: 'status_tahap',
      name: 'Jenis Tahapan',
      cell: (v) => snakeToTileCase(v),
   },
   status_aktif: {
      key: 'status_aktif',
      name: 'Status',
      headerProps: { align: 'center' },
      cell: status,
   },
   created_at: {
      headerProps: { align: 'center' },
      key: 'created_at',
      name: 'Dibuat',
      hide: true,
      cell: diffForHumans,
   },
   updated_at: {
      headerProps: { align: 'center' },
      key: 'updated_at',
      name: 'Diubah',
      cell: diffForHumans,
   },
   aksi: {
      key: 'id',
      name: 'Aksi',
      hide: true,
      headerProps: { align: 'center' },
      cellProps: { className: 'p-0' },
      cell: rowActions,
   },
}
