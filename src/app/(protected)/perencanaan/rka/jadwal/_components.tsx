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
import { useDateFormatter } from '@react-aria/i18n'
import { Copy, Edit, MoreVertical } from 'lucide-react'
import { useSession } from '@shared/hooks/use-session'

export const ActionTableJadwalAnggaran = () => {
   const { hasAcces } = useSession(['super_admin', 'admin', 'admin_perencanaan'])

   return hasAcces ? (
      <>
         <Button
            as={Link}
            href='jadwal/add'
            prefetch={false}
            scroll={false}
            color='primary'>
            Baru
         </Button>
      </>
   ) : null
}

const diffForHumans = (value?: string | number | Date | null) => {
   return <DiffForHumans value={value} />
}

const chekStatus = (data: JadwalAnggaranWithTahapan) => {
   let status = ''
   let isActive = !!data.is_active
   const end = new Date(data.waktu_selesai)
   const now = new Date()
   const locked = data.is_locked !== 0
   const selisihMilidetik: number = now.getTime() - end.getTime()
   if (selisihMilidetik > 0) {
      data.is_locked === 1
         ? (status = 'Selesai dan Dikunci')
         : data.is_locked === 3
           ? (status = 'Selesai dan dihapus')
           : (status = 'Selesai')
   } else if (locked) {
      status = 'Dikunci'
   } else {
      status = 'Berjalan'
   }
   return (
      <div className='flex w-full items-center justify-center'>
         <Chip
            size='sm'
            color={status === 'Berjalan' ? 'success' : isActive ? 'primary' : 'default'}>
            {status}
         </Chip>
      </div>
   )
}

export function RowActions({ id, is_lokal, created_by, updated_by }: JadwalAnggaranWithTahapan) {
   const { data: session, getAccess } = useSession()
   const isSuperAdmin = getAccess(['admin_perencanaan'])
   const isAdmin =
      getAccess(['admin']) &&
      session?.user?.id &&
      (created_by === session?.user?.id || updated_by === session?.user?.id)

   const chekAcces = () => {
      const keys: string[] = []
      if (!(isSuperAdmin || isAdmin)) {
         keys.push('edit')
         keys.push('aktif')
         keys.push('copy')
         keys.push('delete')
      }
      if (is_lokal === 1) {
         keys.push('copy')
         keys.push('delete')
      }

      return [...new Set(keys)]
   }
   return (
      <Dropdown
         radius='sm'
         placement='bottom-end'
         className='w-fit min-w-0'>
         <DropdownTrigger>
            <Button
               size='sm'
               isIconOnly
               variant='light'>
               <MoreVertical />
            </Button>
         </DropdownTrigger>
         <DropdownMenu
            disabledKeys={chekAcces()}
            className='w-fit min-w-0'
            aria-label='Static Actions'>
            <DropdownItem
               key='copy'
               color='success'
               endContent={<Copy className='size-4' />}
               href={`jadwal/${id}/copy`}>
               Salin
            </DropdownItem>
            <DropdownItem
               key='edit'
               href={`jadwal/${id}/edit`}
               color='warning'
               endContent={<Edit className='size-4' />}>
               Ubah
            </DropdownItem>
            <DropdownItem
               key='delete'
               href={`jadwal/${id}/delete`}
               color='warning'
               endContent={<Edit className='size-4' />}>
               Hapus
            </DropdownItem>
         </DropdownMenu>
      </Dropdown>
   )
}
const DateTime = ({ date }: { date: Date }) => {
   const formater = useDateFormatter({
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
      // timeStyle: 'long',
   })
   const dateFormated = formater.format(date)
   return dateFormated
}
const dateTime = (value: any) => {
   const date = value ? new Date(value) : ''

   return date ? <DateTime date={date} /> : null
}
export const helperColumns: HelperColumns<JadwalAnggaran> = {
   id_jadwal: { key: 'id_jadwal', name: 'ID', hide: true, sortable: true },
   nama_sub_tahap: { key: 'nama_sub_tahap', name: 'Jadwal Anggaran', sortable: true },
   jadwal_penatausahaan: {
      key: 'jadwal_penatausahaan',
      name: 'Jadwal Penatausahaan',
      sortable: true,
      hide: true,
   },
   nama_tahap: {
      key: 'id_tahap',
      name: 'Nama Tahap',
      renderCell: (d) => d.tahapan?.nama_tahap,
      hide: true,
   },

   status: {
      key: 'is_active',
      name: 'Status',
      renderCell: chekStatus,
      sortable: true,
      cellProps: { className: 'text-center' },
      headerProps: { className: 'text-center' },
   },
   mulai: {
      key: 'waktu_mulai',
      name: 'Mulai',
      cell: dateTime,
   },
   selesai: {
      key: 'waktu_selesai',
      name: 'Selesai',
      cell: dateTime,
   },
   created_at: {
      key: 'created_at',
      hide: true,
      name: 'Dibuat',
      headerProps: { className: 'text-center' },
      cellProps: { className: 'text-center' },
      cell: diffForHumans,
   },
   updated_at: {
      key: 'updated_at',
      hide: true,
      name: 'Diubah',
      headerProps: { className: 'text-center' },
      cellProps: { className: 'text-center' },
      cell: diffForHumans,
   },
   aksi: {
      key: 'id',
      name: 'Aksi',
      renderCell: (item) => <RowActions {...item} />,
      headerProps: { className: 'text-center' },
      cellProps: { className: 'text-center p-0' },
   },
}
