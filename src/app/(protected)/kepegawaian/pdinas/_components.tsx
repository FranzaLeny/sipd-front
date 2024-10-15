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

export const ActionPDinasTable = () => {
   const { hasAcces } = useSession(['super_admin'])
   return hasAcces ? (
      <>
         <Button
            href='pdinas/add'
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
               href={`pegawai/${id}`}
               key='view'>
               Lihat
            </DropdownItem>
            <DropdownItem
               href={`pegawai/${id}/edit`}
               key='edit'>
               Ubah
            </DropdownItem>
            <DropdownItem
               href={`pegawai/${id}/delete`}
               key='delete'>
               Hapus
            </DropdownItem>
         </DropdownMenu>
      </Dropdown>
   )
}

export const helperColumns: HelperColumns<PDinas> = {
   maksud_pd: {
      key: 'maksud_pd',
      name: 'Maksud',
      sortable: true,
   },
   tanggal_spd: {
      key: 'tanggal_spd',
      name: 'SPD',
      sortable: true,
   },
   tanggal_spt: {
      key: 'tanggal_spt',
      name: 'SPT',
      sortable: true,
   },

   aksi: {
      key: 'id',
      name: 'Aksi',
      headerProps: { className: 'text-center' },
      cellProps: { className: 'text-center' },
      cell: rowActions,
   },
}
