'use client'

import Link from 'next/link'
import { HelperColumns } from '@components/table'
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

export const ActionSatuanTable = () => {
   const { hasAcces } = useSession(['super_admin', 'admin', 'admin_perencanaan'])
   return hasAcces ? (
      <Button
         as={Link}
         href='satuan/add'
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
const status = (locked = 0) => {
   return (
      <Chip
         size='sm'
         className='select-none'
         color={!!locked ? 'danger' : 'success'}>
         {!!locked ? 'Dikunci' : 'Aktif'}
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
               href={`satuan/${id}`}
               key='view'>
               Lihat
            </DropdownItem>
            <DropdownItem
               href={`satuan/${id}/edit`}
               key='edit'>
               Ubah
            </DropdownItem>
            <DropdownItem
               href={`satuan/${id}/delete`}
               key='delete'>
               Hapus
            </DropdownItem>
         </DropdownMenu>
      </Dropdown>
   )
}

export const helperColumns: HelperColumns<Satuan> = {
   nama_tahap: {
      key: 'nama_satuan',
      name: 'Nama Satuan',
      sortable: true,
   },
   status: {
      key: 'is_locked',
      name: 'Kunci',
      sortable: true,
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
      headerProps: { align: 'center' },
      cellProps: { className: 'p-0' },
      cell: rowActions,
   },
}
