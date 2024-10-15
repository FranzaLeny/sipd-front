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

export const ActionUserSipdPerencanaanTable = () => {
   const { hasAcces } = useSession(['super_admin', 'admin', 'admin_perencanaan'])
   return hasAcces ? (
      <Button
         as={Link}
         prefetch={false}
         scroll={false}
         href='user/add'
         color='primary'>
         Baru
      </Button>
   ) : null
}
interface User {
   id: string
   active: number
   id_daerah: number
   id_unit: number | null
   id_skpd: number | null
   is_locked: number
   jabatan: string
   nama: string
   nip: string
   user_id: string | null
   updated_at: Date
   created_at: Date
}
interface StaticData {
   id: string
   id_unit: number
   roles: RoleUser[]
}
const diffForHumans = (value?: string | number | Date | null) => {
   return <DiffForHumans value={value} />
}

const status = (active: number) => {
   return (
      <Chip
         size='sm'
         color={active ? 'success' : 'danger'}>
         {active ? 'Aktif' : 'Tidak aktif'}
      </Chip>
   )
}

export function RowActions(data: User) {
   // TODO lanjut DATA USER SIPD chek akses
   const { hasAcces } = useSession(['super_admin', 'admin'])
   const hasUser = !!data.user_id
   let disabledKeys: string[] = ['edit', 'delete', 'add-account']

   if (hasAcces && hasUser) {
      disabledKeys = ['delete', 'add-account']
   } else if (hasAcces) {
      disabledKeys = []
   }

   return (
      <Dropdown radius='sm'>
         <DropdownTrigger>
            <Button
               size='sm'
               isIconOnly
               variant='light'>
               <MoreVertical />
            </Button>
         </DropdownTrigger>
         <DropdownMenu
            // disabledKeys={disabledKeys}
            aria-label='Static Actions'>
            <DropdownItem
               color='success'
               href={`user/${data.id}/add-account`}
               key='add-account'>
               Buat Akun DLH
            </DropdownItem>
            <DropdownItem
               color='primary'
               href={`user/${data.id}`}
               key='view'>
               Lihat
            </DropdownItem>
            <DropdownItem
               color='secondary'
               href={`user/${data.id}/edit`}
               key='edit'>
               Ubah
            </DropdownItem>
            <DropdownItem
               color='danger'
               href={`user/${data.id}/delete`}
               key='delete'>
               Hapus
            </DropdownItem>
         </DropdownMenu>
      </Dropdown>
   )
}

export const helperColumns: HelperColumns<User> = {
   nama: {
      key: 'nama',
      sortable: true,
      name: 'Nama User',
   },
   nip: {
      key: 'nip',
      sortable: true,
      name: 'NIP',
      headerProps: { align: 'center' },
   },
   jabatan: {
      key: 'jabatan',
      sortable: true,
      name: 'Jabatan',
      headerProps: { align: 'center' },
      cellProps: { className: 'uppercase' },
   },
   id_skpd: {
      key: 'id_skpd',
      sortable: true,
      hide: true,
      name: 'SKPD',
      headerProps: { align: 'center' },
      cell: (v) => (v ? 'Ada' : 'Tidak Ada SKPD'),
   },
   unit: {
      key: 'id_unit',
      sortable: true,
      name: 'UNIT',
      hide: true,
      headerProps: { align: 'center' },
      cell: (v) => (v ? 'Ada' : 'Tidak Ada UNIT'),
   },
   created_at: {
      headerProps: { align: 'center' },
      key: 'created_at',
      name: 'Dibuat',
      cell: diffForHumans,
      hide: true,
   },
   updated_at: {
      headerProps: { align: 'center' },
      key: 'updated_at',
      name: 'Diubah',
      sortable: true,
      cell: diffForHumans,
      hide: true,
   },
   active: {
      key: 'active',
      name: 'Status',
      sortable: true,
      cell: status,
      hide: true,
      headerProps: { align: 'center' },
   },
   aksi: {
      key: 'id',
      headerProps: { align: 'center' },
      cellProps: { className: 'p-0' },
      name: 'Aksi',
      renderCell: (item) => <RowActions {...item} />,
   },
}
