'use client'

import Link from 'next/link'
import { type HelperColumns } from '@components/table'
import { DiffForHumans } from '@components/ui/DiffForHumans'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { MoreVertical } from 'lucide-react'
import { useSession } from '@shared/hooks/use-session'

const diffForHumans = (value?: string | number | Date | null) => {
   return <DiffForHumans value={value} />
}

export const ActionTapdAnggaranTable = () => {
   const { hasAcces } = useSession(['super_admin', 'admin', 'admin_perencanaan'])
   return hasAcces ? (
      <>
         <Button
            href='tapd/add'
            as={Link}
            prefetch={false}
            scroll={false}>
            Baru
         </Button>
      </>
   ) : null
}

export default function rowActions(id: string) {
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
            // disabledKeys={!canSync ? ['sinkron-standar-harga'] : undefined}
            aria-label='Static Actions'>
            <DropdownItem
               href={`tapd/${id}`}
               key='view'>
               Lihat
            </DropdownItem>
            <DropdownItem
               href={`tapd/${id}/edit`}
               key='edit'>
               Ubah
            </DropdownItem>
            <DropdownItem
               href={`tapd/${id}/delete`}
               key='delete'>
               Hapus
            </DropdownItem>
         </DropdownMenu>
      </Dropdown>
   )
}

export const helperColumns: HelperColumns<TapdAnggaranWithRelations> = {
   nama: {
      key: 'nama',
      name: 'Kelompok TAPD',
      sortable: true,
   },

   created_at: {
      key: 'created_at',
      hide: true,
      name: 'Terakhir diubah',
      headerProps: { className: 'text-center' },
      cellProps: { className: 'text-center' },
      cell: diffForHumans,
   },

   updated_at: {
      key: 'updated_at',
      hide: true,
      name: 'Terakhir diubah',
      headerProps: { className: 'text-center' },
      cellProps: { className: 'text-center' },
      cell: diffForHumans,
   },
   aksi: {
      key: 'id',
      name: 'Aksi',
      headerProps: { className: 'text-center' },
      cellProps: { className: 'text-center' },
      cell: rowActions,
   },
}
