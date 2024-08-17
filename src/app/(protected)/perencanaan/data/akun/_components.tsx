'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { HelperColumns } from '@components/table'
import { DiffForHumans } from '@components/ui/DiffForHumans'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import hasAccess from '@utils/chek-roles'
import { MoreVertical } from 'lucide-react'

const diffForHumans = (value?: string | number | Date | null) => {
   return <DiffForHumans value={value} />
}

export const ActionAkunTable = ({ roles }: { roles?: RoleUser[] }) => {
   const canSync = useMemo(() => {
      if (!!roles && roles?.length) {
         return hasAccess(['admin_perencanaan'], roles)
      }
      return false
   }, [roles])
   return canSync ? (
      <>
         <Button
            href='akun/add'
            prefetch={false}
            scroll={false}
            as={Link}>
            Baru
         </Button>
      </>
   ) : null
}

export default function rowActions(id: string) {
   // TODO chek akses

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
               href={`akun/${id}`}
               key='view'>
               Lihat
            </DropdownItem>
            <DropdownItem
               href={`akun/${id}/edit`}
               key='edit'>
               Ubah
            </DropdownItem>
            <DropdownItem
               href={`akun/${id}/delete`}
               key='delete'>
               Hapus
            </DropdownItem>
         </DropdownMenu>
      </Dropdown>
   )
}

const toBooleanText = (val: any) => (!!val ? 'Ya' : 'Tidak')

export const helperColumns: HelperColumns<Akun> = {
   id_akun: { key: 'id_akun', name: 'ID', hide: true, sortable: true },
   kode_akun: { key: 'kode_akun', name: 'Kode', sortable: true },
   nama_akun: { key: 'nama_akun', name: 'Nama akun', sortable: true },
   is_bl: {
      key: 'is_bl',
      name: 'Belanja',
      headerProps: { align: 'center' },
      cell: toBooleanText,
      sortable: true,
   },
   is_pendapatan: {
      key: 'is_pendapatan',
      name: 'Pendapatan',
      headerProps: { align: 'center' },
      cell: toBooleanText,
      sortable: true,
   },
   is_barjas: {
      key: 'is_barjas',
      name: 'Barang & Jasa',
      hide: true,
      headerProps: { align: 'center' },
      cell: toBooleanText,
      sortable: true,
   },
   is_gaji_asn: {
      key: 'is_gaji_asn',
      name: 'Gaji',
      hide: true,
      cell: toBooleanText,
      sortable: true,
   },
   tahun: {
      key: 'tahun',
      name: 'Tahun',
      hide: true,
      cell: (v) => v?.join(', '),
      sortable: false,
   },
   updated_at: {
      key: 'updated_at',
      hide: true,
      name: 'Terakhir diubah',
      headerProps: { align: 'center' },
      cell: diffForHumans,
   },
   aksi: {
      key: 'id',
      name: 'Aksi',
      headerProps: { align: 'center' },
      cell: rowActions,
   },
}
