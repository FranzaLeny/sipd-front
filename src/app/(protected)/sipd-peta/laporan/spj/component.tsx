'use client'

import { useCallback, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { getRakBlByJadwal } from '@actions/penatausahaan/pengeluaran/rak'
import { getSpjFungsional } from '@actions/penatausahaan/pengeluaran/spj'
import { getStatistikBlSkpdSipd } from '@actions/penatausahaan/pengeluaran/statistik'
import { getSumberDanaAkunRinciSubGiat } from '@actions/perencanaan/rka/bl-rinci-sub-giat'
import JadwalInput from '@components/perencanaan/jadwal-anggaran'
import { Autocomplete, AutocompleteItem, Button } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { uniqBy } from 'lodash-es'
import { toast } from 'react-toastify'

import dowloadExcelSpjFungsional from './export-excel'

const ChartRealisasi = dynamic(() => import('./chart-realisasi'), {
   loading: () => <p>Loading</p>,
   ssr: false,
})

const months = [
   { key: 1, name: 'Januari' },
   { key: 2, name: 'Februari' },
   { key: 3, name: 'Maret' },
   { key: 4, name: 'April' },
   { key: 5, name: 'Mei' },
   { key: 6, name: 'Juni' },
   { key: 7, name: 'Juli' },
   { key: 8, name: 'Agustus' },
   { key: 9, name: 'September' },
   { key: 10, name: 'Oktober' },
   { key: 11, name: 'November' },
   { key: 12, name: 'Desember' },
]

export default function Component({
   bulan,
   id_daerah,
   id_skpd,
   tahun,
}: {
   bulan: string
   id_daerah: number
   id_skpd: number
   tahun: number
}) {
   const [month, setMonth] = useState<string | number | null>(bulan)
   const [jadwal, setJadwal] = useState('')

   const currMonth = new Date().getMonth() + 1
   const { data: dataSpj, isFetching } = useQuery({
      queryKey: [{ bulan: month, type: 'SKPD' }, 'spj-fungsional'] as [
         { type: string; bulan: string },
         ...any,
      ],
      queryFn: async ({ queryKey: [params] }) => await getSpjFungsional(params),
   })

   const { data: apbd } = useQuery({
      queryKey: ['statistik-belanja'],
      queryFn: async () => await getStatistikBlSkpdSipd(),
   })
   const { data: rak } = useQuery({
      queryKey: [{ jadwal_anggaran_id: jadwal, id_skpd }, 'rak'] as [
         { jadwal_anggaran_id: string; id_skpd: number },
         ...any,
      ],
      queryFn: async ({ queryKey: [params] }) => await getRakBlByJadwal(params),
      enabled: !!jadwal,
   })

   const { data: sumberDana } = useQuery({
      queryKey: [{ jadwal_anggaran_id: jadwal, id_skpd, id_daerah, tahun }, 'dana_akun_rinci'] as [
         {
            jadwal_anggaran_id: string
            id_giat?: number
            id_program?: number
            id_skpd?: number
            id_sub_giat?: number
            id_sub_skpd?: number
            id_unit?: number
            id_bidang_urusan?: number
            tahun?: number
            id_daerah?: number
            id_urusan?: number
         },
         ...any,
      ],
      queryFn: ({ queryKey: [q] }) => getSumberDanaAkunRinciSubGiat(q),
      enabled: !!jadwal && !!id_skpd && !!id_daerah && !!tahun,
   })

   const namaBulan = useMemo(() => {
      return months?.find((item) => item.key == month)?.name || 'Bulan'
   }, [month])

   const handle = useCallback(() => {
      try {
         if (!!dataSpj && !!namaBulan) {
            const dana = uniqBy(sumberDana, 'id_dana')
            const pembukuan2 = dataSpj?.pembukuan2?.map((d) => {
               const kode = d?.kode_unik?.split('-')
               if (kode?.length === 5) {
                  const [kode_sub_skpd, kode_program, kode_giat, kode_sub_giat, kode_akun] = kode
                  const itemRak = rak?.find(
                     (item) =>
                        d.kode_akun === item?.kode_akun &&
                        item?.kode_giat === kode_giat &&
                        item?.kode_sub_giat === kode_sub_giat &&
                        item?.kode_program === kode_program &&
                        item?.kode_sub_skpd === kode_sub_skpd &&
                        item?.kode_akun === kode_akun
                  )
                  const dana = sumberDana?.filter(
                     (item) =>
                        d.kode_akun === item?.kode_akun &&
                        item?.kode_sub_giat === kode_sub_giat &&
                        item?.kode_sub_skpd === kode_sub_skpd &&
                        item?.kode_akun === kode_akun
                  )
                  const namaDana = dana?.map(
                     (dn) => dn.nama_dana + ': ' + (dn?.total_harga || 0).toLocaleString('id-ID')
                  )
                  const idDana = dana?.map((dn) => dn.id_dana)
                  if (!!itemRak) {
                     const dataRak = Object.entries(itemRak).reduce(
                        (acc, [key, value]) => {
                           if (key?.startsWith('bulan_')) {
                              const [_, _bulan] = key.split('_')
                              const numBulan = Number(_bulan)
                              const bln = Number(month)
                              acc.total += value
                              !!bln && numBulan <= bln && (acc.bulan_sd_sekarang += value)
                              !!bln && numBulan == bln && (acc.bulan_ini = value)
                              !!bln && numBulan <= 6
                                 ? (acc.semester_1 += value)
                                 : (acc.semester_2 += value)
                           }
                           return acc
                        },
                        {
                           bulan_sd_sekarang: 0,
                           bulan_ini: 0,
                           semester_1: 0,
                           semester_2: 0,
                           total: 0,
                        }
                     )
                     return {
                        ...d,
                        rak: dataRak,
                        nama_dana: namaDana?.join(', '),
                        id_dana: idDana?.join(';'),
                     }
                  }
                  return { ...d, nama_dana: namaDana?.join(', '), id_dana: idDana?.join(';') }
               }
               return d
            })
            dowloadExcelSpjFungsional({ ...dataSpj, dana, pembukuan2, bulan: namaBulan })
         } else {
            throw new Error('Data SPJ Fungsional tidak ditemukan')
         }
      } catch (error: any) {
         toast.error(error?.message ?? 'Gagal download excel SPJ fungsional', { autoClose: 5000 })
      }
   }, [dataSpj, namaBulan, rak, month, sumberDana])

   return (
      <div className='content relative z-0 space-y-3'>
         <div className='bg-content1 flex items-center gap-4 rounded p-4'>
            <div className='flex w-full flex-1 flex-col gap-2 sm:flex-row'>
               <Autocomplete
                  listboxProps={{ emptyContent: 'Tidak ada data bulan' }}
                  selectedKey={month?.toString() ?? ''}
                  onSelectionChange={setMonth}
                  fullWidth
                  defaultItems={months}
                  label='Pilih Bulan'
                  placeholder='Cari bulan'>
                  {(item) => (
                     <AutocompleteItem
                        isDisabled={item.key > currMonth}
                        key={item.key}>
                        {item.name}
                     </AutocompleteItem>
                  )}
               </Autocomplete>
               <JadwalInput
                  selectedKey={jadwal}
                  onListJadwalChange={(d) => setJadwal(d[0]?.id)}
                  onSelectionChange={setJadwal}
                  params={{
                     id_daerah,
                     id_skpd,
                     tahun,
                     filter: 'has-bl-sub-giat',
                     jadwal_penatausahaan: 'true',
                  }}
               />
            </div>

            <Button
               color='primary'
               isLoading={isFetching}
               onPress={handle}>
               Download
            </Button>
         </div>
         <div className='bg-content1 flex flex-col rounded p-4'>
            {!!dataSpj?.pembukuan1?.length ? (
               <>
                  <div>
                     <ChartRealisasi
                        apbd={apbd}
                        bulan={namaBulan}
                        tahun={dataSpj?.tahun}
                        items={dataSpj?.pembukuan1}
                        skpd={dataSpj?.nama_skpd}
                     />
                  </div>
               </>
            ) : (
               <p>Data pembukuan1 tidak ditemukan</p>
            )}
         </div>
      </div>
   )
}
