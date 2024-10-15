'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { JadwalAnggaranSearchParams } from '@components/perencanaan/jadwal-anggaran'
import { type HelperColumns } from '@components/table'
import { DiffForHumans } from '@components/ui/DiffForHumans'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import hasAccess from '@utils/chek-roles'
import { MoreVertical } from 'lucide-react'

export const ActionTableBlSkpd: React.FC<{ jadwal: JadwalAnggaran[]; roles?: RoleUser[] }> = ({
   jadwal,
   roles,
}) => {
   const canSync = useMemo(() => hasAccess(['admin_perencanaan'], roles), [roles])
   return (
      <>
         <JadwalAnggaranSearchParams data={jadwal} />
         {canSync ? (
            <Button
               as={Link}
               prefetch={false}
               scroll={false}
               href='skp/add'
               color='primary'>
               Baru
            </Button>
         ) : null}
      </>
   )
}

const diffForHumans = (value?: string | number | Date | null) => {
   return <DiffForHumans value={value} />
}

export default function rowActions(id: string) {
   // TODO tambah hak akses RKA SKPD
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
         <DropdownMenu aria-label='Static Actions'>
            <DropdownItem
               href={`skpd/${id}`}
               key='Lihat'>
               Lihat
            </DropdownItem>
            <DropdownItem
               href={`skpd/${id}/edit`}
               key='edit'
               color='warning'>
               Ubah
            </DropdownItem>
         </DropdownMenu>
      </Dropdown>
   )
}

export const helperColumns: HelperColumns<BlSkpd> = {
   kode_skpd: { key: 'kode_skpd', name: 'Kode Skpd', hide: true },
   nama_skpd: { key: 'nama_skpd', name: 'Nama Skpd' },
   pagu_murni: { key: 'pagu_murni', name: 'Pagu Murni', hide: true },
   set_pagu_skpd: {
      key: 'set_pagu_skpd',
      sortable: true,
      name: 'Pagu Skpd',
      cellProps: { className: 'text-end' },
   },
   set_pagu_giat: {
      key: 'set_pagu_giat',
      name: 'Pagu Sub Kegiatan',
      hide: true,
      sortable: true,
      cellProps: { className: 'text-end' },
   },
   rinci_giat: {
      key: 'rinci_giat',
      name: 'Pagu Rincian',
      sortable: true,
      cellProps: { className: 'text-end' },
   },
   total_giat: { key: 'total_giat', name: 'Sub Kegiatan', sortable: true },
   belanja_terbuka: { key: 'belanja_terbuka', name: 'Buka Sub', sortable: true, hide: true },
   rincian_terbuka: { key: 'rincian_terbuka', name: 'Buka Rincian', sortable: true, hide: true },

   created_at: {
      key: 'created_at',
      name: 'Dibuat',
      cell: diffForHumans,
      headerProps: { className: 'text-center' },
      cellProps: { className: 'text-center p-0' },
      hide: true,
   },
   updated_at: {
      key: 'updated_at',
      name: 'Diubah',
      cell: diffForHumans,
      headerProps: { className: 'text-center' },
      cellProps: { className: 'text-center p-0' },
      hide: true,
   },
   aksi: {
      key: 'id',
      name: 'Aksi',
      cell: rowActions,
      headerProps: { className: 'text-center' },
      cellProps: { className: 'text-center p-0' },
   },
}
