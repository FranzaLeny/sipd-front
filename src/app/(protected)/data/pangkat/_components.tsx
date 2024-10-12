'use client'

import Link from 'next/link'
import { HelperColumns } from '@components/table'
import { DiffForHumans } from '@components/ui/DiffForHumans'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { MoreVertical } from 'lucide-react'
import { useSession } from '@shared/hooks/use-session'

const diffForHumans = (value?: string | number | Date | null) => {
   return <DiffForHumans value={value} />
}

export const ActionPangkatTable = () => {
   const { hasAcces } = useSession(['super_admin'])
   return hasAcces ? (
      <>
         <Button
            href='pangkat/add'
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
               href={`pangkat/${id}`}
               key='view'>
               Lihat
            </DropdownItem>
            <DropdownItem
               href={`pangkat/${id}/edit`}
               key='edit'>
               Ubah
            </DropdownItem>
            <DropdownItem
               href={`pangkat/${id}/delete`}
               key='delete'>
               Hapus
            </DropdownItem>
         </DropdownMenu>
      </Dropdown>
   )
}

export const helperColumns: HelperColumns<Pangkat> = {
   nama: {
      key: 'pangkat',
      name: 'Pangkat',
      sortable: true,
   },
   golongan: {
      key: 'golongan',
      name: 'Golongan',
      sortable: true,
   },
   ruang: {
      key: 'ruang',
      name: 'Ruang',
      sortable: true,
   },

   kode: {
      key: 'kode',
      hide: true,
      name: 'Kode',
   },
   aksi: {
      key: 'id',
      name: 'Aksi',
      headerProps: { className: 'text-center' },
      cellProps: { className: 'text-center' },
      cell: rowActions,
   },
}
