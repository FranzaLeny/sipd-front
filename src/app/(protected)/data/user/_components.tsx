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
import { titleCase } from '@utils'
import hasAccess from '@utils/chek-roles'
import { MoreVertical } from 'lucide-react'
import { useSession } from '@shared/hooks/use-session'

const diffForHumans = (value?: string | number | Date | null) => {
   return <DiffForHumans value={value} />
}

const roles = ({ roles }: IUser) => {
   return (
      <div className='flex max-w-xs flex-wrap gap-1'>
         {roles?.map((role) => {
            return (
               <Chip
                  color='primary'
                  size='sm'
                  key={role}>
                  {titleCase(role)}
               </Chip>
            )
         })}
      </div>
   )
}
export const ActionUserTable = () => {
   const { hasAcces } = useSession(['super_admin', 'admin', 'admin_perencanaan'])
   return hasAcces ? (
      <>
         <Button
            href='user/add'
            as={Link}
            prefetch={false}
            scroll={false}>
            Baru
         </Button>
      </>
   ) : null
}

export default function rowActions(id: string, user?: { id: string; roles: RoleUser[] }) {
   const canEdit = hasAccess(['super_admin'], user?.roles) || id === user?.id
   const disabledKeys = canEdit ? [] : ['edit', 'delete']
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
            aria-label='aksi'
            // disabledKeys={disabledKeys}
         >
            <DropdownItem
               href={`user/${id}`}
               key='view'>
               Lihat
            </DropdownItem>
            <DropdownItem
               href={`user/${id}/edit`}
               key='edit'>
               Ubah
            </DropdownItem>
            <DropdownItem
               href={`user/${id}/delete`}
               key='delete'>
               Hapus
            </DropdownItem>
         </DropdownMenu>
      </Dropdown>
   )
}

export const helperColumns: HelperColumns<IUser> = {
   nama: { key: 'nama', name: 'Nama', sortable: true },
   nip: { key: 'nip', name: 'NIP', sortable: true },
   jabatan: { key: 'jabatan', name: 'Jabatan', sortable: true },
   role: { key: 'roles', name: 'Roles', renderCell: roles },

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
