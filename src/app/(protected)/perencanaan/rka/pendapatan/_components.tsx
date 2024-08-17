'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { JadwalAnggaranSearchParams } from '@components/perencanaan/jadwal-anggaran'
import { HelperColumns } from '@components/table'
import { DiffForHumans } from '@components/ui/DiffForHumans'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import hasAccess from '@utils/chek-roles'
import { MoreVertical } from 'lucide-react'

export const ActionTablePendapatan: React.FC<{
   jadwal: JadwalAnggaran[]
   roles?: RoleUser[]
   jadawal_anggaran_id?: string
   tahun: number
   id_skpd: number
   id_unit: number
}> = ({ jadwal, roles, id_skpd, jadawal_anggaran_id, tahun, id_unit }) => {
   const canSync = useMemo(() => hasAccess(['admin_perencanaan'], roles), [roles])
   return (
      <>
         <JadwalAnggaranSearchParams data={jadwal} />
         {canSync ? (
            <Button
               as={Link}
               prefetch={false}
               scroll={false}
               href={`laporan/pendapatan?jadwal_anggaran_id=${jadawal_anggaran_id}&tahun=${tahun}&id_skpd=${id_skpd}&id_unit=${id_unit}`}
               color='primary'>
               Cetak
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
               href={`pendapatan/${id}`}
               key='Lihat'>
               Lihat
            </DropdownItem>
            <DropdownItem
               href={`pendapatan/${id}/edit`}
               key='edit'
               color='warning'>
               Ubah
            </DropdownItem>
         </DropdownMenu>
      </Dropdown>
   )
}

export const helperColumns: HelperColumns<Pendapatan> = {
   nama_akun: { key: 'nama_akun', name: 'Nama Akun' },
   uraian: { key: 'uraian', name: 'Uraian' },
   pagu_murni: { key: 'volume', name: 'Volume' },
   koefisien: { key: 'koefisien', name: 'koefisien' },
   murni: { key: 'murni', name: 'Murni', sortable: true },
   total: { key: 'total', name: 'Total', sortable: true },
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
