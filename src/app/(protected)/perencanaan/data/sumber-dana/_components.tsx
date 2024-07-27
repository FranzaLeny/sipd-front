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
import { SumberDana } from '@zod'
import { MoreVertical } from 'lucide-react'
import { useSession } from '@shared/hooks/use-session'

export const ActionSumberDanaTable = () => {
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
               as={Link}
               href={`satuan/${id}`}
               // @ts-expect-error
               prefetch={false}
               scroll={false}
               key='view'>
               Lihat
            </DropdownItem>
            <DropdownItem
               as={Link}
               href={`satuan/${id}/edit`}
               // @ts-expect-error
               prefetch={false}
               scroll={false}
               key='edit'>
               Ubah
            </DropdownItem>
            <DropdownItem
               as={Link}
               href={`satuan/${id}/delete`}
               // @ts-expect-error
               prefetch={false}
               scroll={false}
               key='delete'>
               Hapus
            </DropdownItem>
         </DropdownMenu>
      </Dropdown>
   )
}

export const helperColumns: HelperColumns<SumberDana> = {
   kode_dana: {
      key: 'kode_dana',
      name: 'Kode',
      sortable: true,
   },
   nama_dana: {
      key: 'nama_dana',
      name: 'Nama Dana',
      sortable: true,
   },
   status: {
      key: 'is_locked',
      name: 'Kunci',
      sortable: true,
      headerProps: { align: 'center' },
      cell: status,
   },
   nama_dana_lama: {
      key: 'nama_dana_lama',
      name: 'Nama Dana Lama',
      sortable: true,
      hide: true,
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
