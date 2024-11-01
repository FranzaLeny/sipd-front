'use client'

import Link from 'next/link'
import { type HelperColumns } from '@components/table'
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

export const ActionPegawaiTable = () => {
   const { hasAcces } = useSession(['super_admin'])
   return hasAcces ? (
      <>
         <Button
            href='pegawai/add'
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

const ESLON = { 6: 'Non Eselon', 4: 'Eselon IV', 3: 'Eselon III', 2: 'Eselon II', 1: 'Eselon I' }

export const helperColumns: HelperColumns<DataPegawai> = {
   nama: {
      key: 'nama',
      name: 'Nama',
      sortable: true,
   },
   nip: {
      key: 'nip',
      name: 'NIP',
      sortable: true,
   },
   pangkat_gol: {
      key: 'pangkat_gol',
      name: 'Pangkat/Golongan',
      renderCell: (pegawai) =>
         pegawai?.pangkat
            ? `${pegawai?.pangkat?.pangkat}/${pegawai?.pangkat?.golongan}.${pegawai?.pangkat?.ruang}`
            : null,
      sortable: true,
   },
   jabatan: {
      key: 'jabatan',
      name: 'Jabatan',
      sortable: true,
   },
   eselon: {
      key: 'eselon',
      name: 'Eselon',
      sortable: true,
      hide: true,
      cell: (i) => ESLON[i as keyof typeof ESLON],
   },
   jenis_pegawai: {
      key: 'jenis_pegawai',
      name: 'Jenis Pegawai',
      sortable: true,
   },
   jenis_kelamin: {
      key: 'jenis_kelamin',
      name: 'JK',
      sortable: true,
      hide: true,
      // cell: (jk: string) => (jk == 'L' ? 'Laki - Laki' : 'Perempuan'),
   },
   tanggal_asn: {
      key: 'tanggal_asn',
      name: 'TMT',
      sortable: true,
      hide: true,
      cell: (date?: string) =>
         !!date ? new Date(date)?.toLocaleDateString('id-ID', { dateStyle: 'medium' }) : null,
   },
   tanggal_lahir: {
      key: 'tanggal_lahir',
      name: 'Tanggal Lahir',
      sortable: true,
      hide: true,
      cell: (date?: string) =>
         !!date ? new Date(date)?.toLocaleDateString('id-ID', { dateStyle: 'medium' }) : null,
   },
   locked: {
      key: 'locked',
      name: 'Status',
      sortable: true,
      cell: (locked?: string) =>
         !!locked ? (
            <Chip
               size='sm'
               color='danger'>
               Non Aktif
            </Chip>
         ) : (
            <Chip
               size='sm'
               color='primary'>
               Aktif
            </Chip>
         ),
   },
   aksi: {
      key: 'id',
      name: 'Aksi',
      headerProps: { className: 'text-center' },
      cellProps: { className: 'text-center' },
      cell: rowActions,
   },
}
