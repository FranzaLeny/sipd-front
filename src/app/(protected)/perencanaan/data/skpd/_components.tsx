'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { HelperColumns } from '@components/table'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import hasAccess from '@utils/chek-roles'
import { MoreVertical } from 'lucide-react'

import { Skpd } from './page'

export const ActionSkpdTable = ({ roles }: { roles?: RoleUser[] }) => {
   const canSync = useMemo(() => {
      if (!!roles && roles?.length) {
         return hasAccess(['admin_perencanaan'], roles)
      }
      return false
   }, [roles])
   return canSync ? (
      <Button
         as={Link}
         prefetch={false}
         href='skpd/add'
         scroll={false}
         color='primary'>
         Tambah
      </Button>
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
         <DropdownMenu aria-label='Static Actions'>
            <DropdownItem
               as={Link}
               href={`skpd/${id}`}
               // @ts-expect-error
               scroll={false}
               prefetch={false}
               key='view'>
               Lihat
            </DropdownItem>
            <DropdownItem
               as={Link}
               href={`skpd/${id}/edit`}
               // @ts-expect-error
               scroll={false}
               prefetch={false}
               color='warning'
               key='edit'>
               Ubah
            </DropdownItem>
            <DropdownItem
               as={Link}
               href={`skpd/${id}/delete`}
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

// TODO DATA SKPD tambahkan aksi utnut taiap data
export const helperColumns: HelperColumns<Skpd> = {
   nama_skpd: {
      key: 'nama_skpd',
      name: 'Nama Skpd',
   },
   nama_kepala: {
      key: 'nama_kepala',
      name: 'Kepala',
      renderCell: (item) => (
         <div>
            <div>{item.nama_kepala}</div>
            <div>{item.pangkat_kepala}</div>
            <div>{item.nip_kepala}</div>
         </div>
      ),
   },
   nama_bendahara: {
      key: 'nama_bendahara',
      name: 'Bendahara',
      renderCell: (item) => (
         <div>
            <div>{item.nama_bendahara}</div>
            <div>{item.nip_bendahara}</div>
         </div>
      ),
   },
   status_kepala: {
      key: 'status_kepala',
      name: 'Status Kepala',
   },
   aksi: {
      key: 'id',
      name: 'Aksi',
      cell: rowActions,
   },
}
