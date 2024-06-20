'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { JadwalAnggaran } from '@actions/perencanaan/rka/jadwal-anggaran'
import { JadwalAnggaranSearchParams } from '@components/perencanaan/jadwal-anggaran'
import { HelperColumns } from '@components/table'
import {
   Button,
   Dropdown,
   DropdownItem,
   DropdownMenu,
   DropdownSection,
   DropdownTrigger,
   Snippet,
} from '@nextui-org/react'
import hasAccess from '@utils/chek-roles'
import { sumBy } from 'lodash-es'
import { MoreVertical, Printer } from 'lucide-react'

interface Data {
   id: string
   id_sub_giat: number
   tahun: number
   id_sub_bl: number
   id_daerah: number
   kode_sbl: string
   id_unit: number
   bl_sub_giat: Blsubgiat[]
   nama_giat: string
   kode_sub_giat: string
   nama_program: string
   nama_sub_giat: string
   pagu: number
   pagu_giat: number
   pagu_murni: number | null
   pagu_indikatif: number
}

interface Blsubgiat {
   id: string
   dana_bl_sub_giat: Danablsubgiat[]
   rinci_bl_sub_giat: Rinciblsubgiat[]
}

interface Rinciblsubgiat {
   total_harga: number
}

interface Danablsubgiat {
   nama_dana: string
   pagu_dana: number
}

const getNamaSub = (data: Data) => {
   return `${data.kode_sub_giat} ${data.nama_sub_giat}`
}

function generateRupiah(nilai?: number | null) {
   const nilaiFormatted = (nilai || 0).toLocaleString('id-ID', {
      style: 'decimal',
      minimumFractionDigits: 0,
   })

   return (
      <Snippet
         classNames={{ pre: 'font-sans flex justify-between w-full whitespace-nowrap' }}
         radius='none'
         variant='flat'
         className='w-full bg-transparent  p-0'
         symbol='Rp. '
         tooltipProps={{ content: 'Salin' }}
         hideCopyButton={typeof nilai !== 'number'}
         codeString={nilai ? String(nilai) : '0'}>
         <span className='text-right'>{nilaiFormatted}</span>
      </Snippet>
   )
}

export default function rowActions(data: Data) {
   const id = data?.bl_sub_giat[0]?.id
   const canCopy = sumBy(data?.bl_sub_giat[0]?.rinci_bl_sub_giat, 'total_harga')
   const disabledKeys = canCopy ? [] : ['copy']
   // TODO AKSI RKA SUB GIAT tambah hak akses
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
            aria-label='Action Rka Sub Giat'
            disabledKeys={disabledKeys}>
            <DropdownSection title='Sub Kegiatan'>
               <DropdownItem
                  as={Link}
                  // @ts-expect-error
                  prefetch={false}
                  scroll={false}
                  href={`sub-giat/${id}`}
                  key='detail'>
                  Lihat Detail
               </DropdownItem>
               <DropdownItem
                  key='edit'
                  as={Link}
                  // @ts-expect-error
                  prefetch={false}
                  scroll={false}
                  href={`sub-giat/${id}/edit`}>
                  Ubah
               </DropdownItem>
               <DropdownItem
                  key='delete'
                  as={Link}
                  // @ts-expect-error
                  prefetch={false}
                  scroll={false}
                  href={`sub-giat/${id}/delete`}
                  className='text-danger'
                  color='danger'>
                  Hapus
               </DropdownItem>
            </DropdownSection>
            <DropdownSection title='Rincian Sub Kegiatan'>
               <DropdownItem
                  as={Link}
                  // @ts-expect-error
                  prefetch={false}
                  scroll={false}
                  href={`sub-giat/${id}/rinci`}
                  key='rinci'>
                  Rincian RKA
               </DropdownItem>
               <DropdownItem
                  as={Link}
                  // @ts-expect-error
                  prefetch={false}
                  scroll={false}
                  href={`laporan/rinci-bl?id=${id}`}
                  key='laporan'>
                  Laporan
               </DropdownItem>
               <DropdownItem
                  key='sync'
                  as={Link}
                  // @ts-expect-error
                  prefetch={false}
                  scroll={false}
                  href={`/sipd-ri/sync/rka/sub-giat/rinci?subGiat=${id}`}
                  className='text-danger'
                  color='danger'>
                  Singkron Rincian
               </DropdownItem>
               <DropdownItem
                  key='copy'
                  as={Link}
                  // @ts-expect-error
                  prefetch={false}
                  scroll={false}
                  href={`sub-giat/${id}/copy/rinci`}
                  className='text-danger'
                  color='danger'>
                  Salin Rincian
               </DropdownItem>
            </DropdownSection>
         </DropdownMenu>
      </Dropdown>
   )
}

export const helperColumnsPergeseran: HelperColumns<Data> = {
   nama: {
      key: 'kode_sub_giat',
      renderCell: getNamaSub,
      name: 'Nama Sub Kegiatan',
      cellProps: { className: 'w-1/2' },
      sortable: true,
   },
   pagu_murni: {
      key: 'pagu_murni',
      name: 'Sebelum Perubahan',
      headerProps: {
         align: 'end',
         className: 'text-center',
      },
      cell: generateRupiah,
      sortable: true,
   },
   pagu: {
      key: 'pagu',
      name: 'Setelah Perubahan',
      headerProps: {
         align: 'center',
         className: 'text-center',
      },
      cell: generateRupiah,
      sortable: true,
   },
   dana: {
      key: 'id',
      name: 'Sumber Dana',
      headerProps: {
         align: 'center',
         className: 'text-center',
      },
      hide: true,
      renderCell: (d) =>
         d.bl_sub_giat[0]?.dana_bl_sub_giat
            ?.map((d) => d.nama_dana + ' ' + d.pagu_dana?.toLocaleString())
            ?.join(','),
      sortable: false,
   },
   pagu_indikatif: {
      key: 'pagu_indikatif',
      name: 'Pagu Validasi',
      headerProps: {
         align: 'center',
         className: 'text-center',
      },
      cell: generateRupiah,
      sortable: true,
   },
   pagu_rinci: {
      key: 'bl_sub_giat',
      name: 'Pagu Rincian',
      headerProps: {
         align: 'center',
         className: 'text-center',
      },
      renderCell: (d) => generateRupiah(sumBy(d.bl_sub_giat[0]?.rinci_bl_sub_giat, 'total_harga')),
   },
   aksi: {
      key: 'id_sub_giat',
      name: 'Aksi',
      cellProps: { className: 'mx-auto' },
      renderCell: rowActions,
   },
}
export const helperColumns: HelperColumns<Data> = {
   nama: {
      key: 'kode_sub_giat',
      renderCell: getNamaSub,
      name: 'Nama Sub Kegiatan',
      sortable: true,
   },
   pagu: {
      key: 'pagu',
      name: 'Pagu',
      cellProps: { className: 'p-0' },
      cell: generateRupiah,
      sortable: true,
   },
   dana: {
      key: 'id',
      name: 'Sumber Dana',
      cellProps: { className: 'p-0' },
      hide: true,
      renderCell: (d) =>
         d.bl_sub_giat[0]?.dana_bl_sub_giat
            ?.map((d) => d.nama_dana + ' ' + d.pagu_dana?.toLocaleString())
            ?.join(','),
      sortable: false,
   },
   pagu_indikatif: {
      key: 'pagu_indikatif',
      name: 'Pagu Validasi',
      cellProps: { className: 'p-0' },
      cell: generateRupiah,
      sortable: true,
   },
   pagu_rinci: {
      key: 'bl_sub_giat',
      name: 'Pagu Rincian',
      cellProps: { className: 'p-0' },
      renderCell: (d) => generateRupiah(sumBy(d.bl_sub_giat[0]?.rinci_bl_sub_giat, 'total_harga')),
   },
   aksi: {
      key: 'id_sub_giat',
      name: 'Aksi',
      cellProps: { className: 'p-0' },
      renderCell: rowActions,
   },
}

export const ActionTableSubGiat: React.FC<{
   jadwal: JadwalAnggaran[]
   jadwal_selected: string
   idSkpd: number
   idUnit: number
   tahun: number
   roles?: RoleUser[]
}> = ({ jadwal, roles, jadwal_selected, idSkpd, tahun, idUnit }) => {
   const canSync = useMemo(() => hasAccess(['admin_perencanaan'], roles), [roles])
   const paramsFromObject = new URLSearchParams({
      jadwal_anggaran_id: jadwal_selected,
      tahun: tahun.toString(),
      id_unit: idUnit.toString(),
      id_skpd: idSkpd.toString(),
   })
   if (idSkpd !== idUnit) {
      paramsFromObject.append('id_skpd', idSkpd.toString())
   }
   return (
      <>
         <JadwalAnggaranSearchParams
            defaultSelected={jadwal_selected}
            data={jadwal}
         />
         {canSync ? (
            <Button
               as={Link}
               prefetch={false}
               scroll={false}
               href='sub-giat/add'
               color='primary'>
               Tambah
            </Button>
         ) : null}
         <Dropdown>
            <DropdownTrigger>
               <Button
                  endContent={<Printer />}
                  color='secondary'>
                  Cetak
               </Button>
            </DropdownTrigger>
            <DropdownMenu
               disabledKeys={['cetak_kover']}
               aria-label='Static Actions'>
               <DropdownItem
                  key='cetak_rekapan'
                  as={Link}
                  // @ts-expect-error
                  prefetch={false}
                  scroll={false}
                  href={`laporan/rekap-bl?${paramsFromObject.toString()}`}>
                  Cetak Rekapan Belanja
               </DropdownItem>
               <DropdownItem
                  // @ts-expect-error
                  prefetch={false}
                  scroll={false}
                  href={`laporan/pendapatan?${paramsFromObject.toString()}`}
                  color='secondary'
                  key='cetak_pendapatan'>
                  Cetak Pendapatan
               </DropdownItem>
               <DropdownItem
                  color='primary'
                  // @ts-expect-error
                  prefetch={false}
                  scroll={false}
                  href={`laporan/skpd?${paramsFromObject.toString()}`}
                  key='cetak_ringkasan'>
                  Cetak Ringkasan SKPD
               </DropdownItem>
               <DropdownItem
                  key='cetak_kover'
                  color='danger'>
                  Cetak Cover
               </DropdownItem>
            </DropdownMenu>
         </Dropdown>
      </>
   )
}
