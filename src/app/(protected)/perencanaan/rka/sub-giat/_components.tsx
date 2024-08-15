'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { getBlSkpdByIdSkpd } from '@actions/perencanaan/rka/bl-skpd'
import { JadwalAnggaran } from '@actions/perencanaan/rka/jadwal-anggaran'
import { JadwalAnggaranSearchParams } from '@components/perencanaan/jadwal-anggaran'
import { HelperColumns } from '@components/table'
import {
   Accordion,
   AccordionItem,
   Button,
   Dropdown,
   DropdownItem,
   DropdownMenu,
   DropdownSection,
   DropdownTrigger,
   Snippet,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
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
   kode_program: string
   kode_giat: string
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
   bl_sub_giat_murni: { pagu: number }
}

interface Rinciblsubgiat {
   total_harga: number
}

interface Danablsubgiat {
   nama_dana: string
   pagu_dana: number
}

const generateName = (data: Data, key1: keyof Data, key2: keyof Data) => {
   return `${data[key1]} ${data.nama_sub_giat}`
}

function generateRupiah(nilai?: number | null) {
   const nilaiFormatted = (nilai || 0).toLocaleString('id-ID', {
      style: 'decimal',
      minimumFractionDigits: 0,
   })

   return (
      <>
         <Snippet
            classNames={{
               pre: 'font-sans text-right flex justify-end w-full whitespace-nowrap',
               content: 'text-right',
               copyButton: 'min-w-6 h-7 w-6',
            }}
            radius='none'
            variant='flat'
            className='w-full gap-0 bg-transparent p-0'
            hideSymbol
            tooltipProps={{ content: 'Salin' }}
            hideCopyButton={typeof nilai !== 'number'}
            codeString={nilai ? String(nilai) : '0'}>
            <span className='text-right'>{nilaiFormatted}</span>
         </Snippet>
      </>
   )
}

export default function rowActions(data: Data) {
   const id = data?.bl_sub_giat[0]?.id
   const canCopy = data?.bl_sub_giat[0]?.rinci_bl_sub_giat?.length > 0

   const disabledKeys = !!canCopy ? [] : ['copy']
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
                  href={`sub-giat/${id}`}
                  key='detail'>
                  Lihat Detail
               </DropdownItem>
               <DropdownItem
                  key='edit'
                  href={`sub-giat/${id}/edit`}>
                  Ubah
               </DropdownItem>
               <DropdownItem
                  key='delete'
                  href={`sub-giat/${id}/delete`}
                  className='text-danger'
                  color='danger'>
                  Hapus
               </DropdownItem>
            </DropdownSection>
            <DropdownSection title='Rincian Sub Kegiatan'>
               <DropdownItem
                  href={`rinci?id=${id}`}
                  key='rinci'>
                  Rincian RKA
               </DropdownItem>
               <DropdownItem
                  href={`laporan/rinci-bl?id=${id}`}
                  key='laporan'>
                  Laporan
               </DropdownItem>
               <DropdownItem
                  key='sync'
                  href={`/sipd-ri/sync/rka/sub-giat/rinci?subGiat=${id}`}
                  className='text-danger'
                  color='danger'>
                  Singkron Rincian
               </DropdownItem>
               <DropdownItem
                  key='copy'
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

const helperColumns1: HelperColumns<Data> = {
   kode_program: {
      key: 'kode_program',
      renderCell: (data) => generateName(data, 'kode_program', 'nama_program'),
      name: 'Program',
      sortable: true,
      hide: true,
   },
   kode_giat: {
      key: 'kode_giat',
      renderCell: (data) => generateName(data, 'kode_giat', 'nama_giat'),
      name: 'Kegiatan',
      sortable: true,
      hide: true,
   },
   kode_sub_giat: {
      key: 'kode_sub_giat',
      renderCell: (data) => generateName(data, 'kode_sub_giat', 'nama_sub_giat'),
      name: 'Sub Kegiatan',
      sortable: true,
   },
}

const helperColumns2: HelperColumns<Data> = {
   pagu: {
      key: 'pagu',
      name: 'Pagu',
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

export const helperColumnsPergeseran: HelperColumns<Data> = {
   ...helperColumns1,
   pagu_sebelum: {
      key: 'pagu_murni',
      name: 'Murni',
      headerProps: {
         align: 'end',
         className: 'text-center',
      },
      renderCell: (data) => generateRupiah(data?.bl_sub_giat[0]?.bl_sub_giat_murni?.pagu ?? 0),
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
   ...helperColumns2,
}
export const helperColumns: HelperColumns<Data> = {
   ...helperColumns1,
   ...helperColumns2,
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
                  href={`laporan/rekap-bl?${paramsFromObject.toString()}`}>
                  Cetak Rekapan Belanja
               </DropdownItem>
               <DropdownItem
                  href={`laporan/pendapatan?${paramsFromObject.toString()}`}
                  color='secondary'
                  key='cetak_pendapatan'>
                  Cetak Pendapatan
               </DropdownItem>
               <DropdownItem
                  color='primary'
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
export function PaguSkpd(params: { id_skpd: number; jadwal_anggaran_id: string }) {
   const { data, isFetching } = useQuery({
      queryKey: [params, 'bl_skpd', 'bl_sub_giat', 'bl_sub_giat_rinci'] as [
         typeof params,
         ...string[],
      ],
      queryFn: ({ queryKey: [query] }) => getBlSkpdByIdSkpd(query),
   })

   return (
      <div className='content sticky inset-x-0 pb-3'>
         <Accordion
            itemClasses={{ trigger: 'py-2' }}
            defaultExpandedKeys={['skpd']}
            isCompact
            variant='shadow'>
            <AccordionItem
               classNames={{
                  trigger: 'py-2',
                  title: 'truncate font-semibold',
                  content: 'max-w-full overflow-auto pb-3 flex items-center justify-center',
               }}
               key='skpd'
               aria-label='Pagu SKPD'
               title={data?.nama_skpd ?? 'SKPD'}>
               <table className='pagu-skpd border-separate border-spacing-x-2'>
                  <thead>
                     <tr>
                        <th>Batasan Pagu</th>
                        <th>Pagu Validasai</th>
                        <th>Pagu Rincian</th>
                        <th>Realisasi</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr>
                        <td>{isFetching ? '...' : generateRupiah(data?.set_pagu_skpd)}</td>
                        <td>{isFetching ? '...' : generateRupiah(data?.set_pagu_giat)}</td>
                        <td>{isFetching ? '...' : generateRupiah(data?.rinci_giat)}</td>
                        <td>{isFetching ? '...' : generateRupiah(data?.realisasi)}</td>
                     </tr>
                  </tbody>
               </table>
            </AccordionItem>
         </Accordion>
      </div>
   )
}
