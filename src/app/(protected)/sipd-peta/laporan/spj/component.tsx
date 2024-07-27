'use client'

import { useCallback, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { getRakBlByJadwal, syncRelalisasiRak } from '@actions/penatausahaan/pengeluaran/rak'
import { getSpjFungsional } from '@actions/penatausahaan/pengeluaran/spj'
import { getStatistikBlSkpdSipd } from '@actions/penatausahaan/pengeluaran/statistik'
import { getSumberDanaAkunRinciSubGiat } from '@actions/perencanaan/rka/bl-rinci-sub-giat'
import { getAllBlSubGiat } from '@actions/perencanaan/rka/bl-sub-giat'
import JadwalInput from '@components/perencanaan/jadwal-anggaran'
import { Autocomplete, AutocompleteItem, Button } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { RealisasiRakInput, RealisasiRakInputValidationSchema } from '@validations/keuangan/rak'
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
   const [isLoading, setIsLoading] = useState(false)
   const [jadwal, setJadwal] = useState('')

   const currMonth = new Date().getMonth() + 1
   const { data: dataSpj, isFetching } = useQuery({
      queryKey: [{ bulan: month, type: 'SKPD' }, 'spj-fungsional-peta'] as [
         { type: string; bulan: string },
         ...any,
      ],
      queryFn: async ({ queryKey: [params] }) => await getSpjFungsional(params),
   })

   const { data: apbd, isFetching: isFetchingApbd } = useQuery({
      queryKey: ['statistik-belanja-peta'],
      queryFn: async () => await getStatistikBlSkpdSipd(),
   })

   const { data: rak, isFetching: isFetchingRak } = useQuery({
      queryKey: [{ jadwal_anggaran_id: jadwal, id_skpd }, 'data_rak', 'jadwal_anggaran'] as [
         { jadwal_anggaran_id: string; id_skpd: number },
         ...any,
      ],
      queryFn: async ({ queryKey: [params] }) => await getRakBlByJadwal(params),
      enabled: !!jadwal,
   })

   const namaBulan = useMemo(() => {
      return months?.find((item) => item.key == month)?.name || 'Bulan'
   }, [month])

   const updateRealiasasi = useCallback(async () => {
      setIsLoading(true)
      try {
         if (!!month && !!rak?.length && !!dataSpj?.pembukuan2?.length) {
            const currMonth = new Date().getMonth() + 1
            const dataRealiasasi = dataSpj?.pembukuan2?.filter((realisasi) => {
               const kode = realisasi?.kode_unik?.split('-')
               const [kode_sub_skpd, kode_program, kode_giat, kode_sub_giat, kode_akun] = kode
               return !!kode_akun && kode_akun?.length === 17
            })
            const key = `realisasi_${month}`
            let data: RealisasiRakInput[] = []
            dataRealiasasi?.map((realisasi) => {
               const kode = realisasi?.kode_unik?.split('-')
               const [kode_sub_skpd, kode_program, kode_giat, kode_sub_giat, kode_akun] = kode
               const {
                  realisasi_gaji_bulan_ini,
                  realisasi_ls_selain_gaji_bulan_ini,
                  realisasi_up_gu_tu_bulan_ini,
                  jumlah_sd_saat_ini,
               } = realisasi
               const id = rak?.find(
                  (ren) =>
                     ren?.kode_akun === kode_akun &&
                     ren?.nilai_rak === realisasi?.alokasi_anggaran &&
                     ren?.kode_akun === realisasi.kode_akun &&
                     ren?.kode_sub_giat === kode_sub_giat &&
                     ren?.kode_giat === kode_giat &&
                     ren?.kode_program === kode_program &&
                     ren?.kode_sub_skpd === kode_sub_skpd
               )?.id
               if (id) {
                  data.push({
                     id,
                     nilai_realisasi: jumlah_sd_saat_ini,
                     [key]:
                        realisasi_gaji_bulan_ini +
                        realisasi_ls_selain_gaji_bulan_ini +
                        realisasi_up_gu_tu_bulan_ini,
                  })
               } else {
               }
            })
            const validData = RealisasiRakInputValidationSchema.array().parse(data)
            const results = await syncRelalisasiRak(validData)
            toast(
               <div>
                  <p className='font-bold'>Beshasil</p>
                  <p>{results?.message}</p>
               </div>
            )
         } else {
            toast.error('Data belum lengkap pastikan semua data sudah tersedia')
         }
      } catch (error: any) {
         toast.error(
            <div>
               <p className='font-bold'>Error</p>
               <p>{error?.message}</p>
            </div>
         )
      }
      setIsLoading(false)
   }, [month, rak, dataSpj?.pembukuan2])

   const exportExcel = useCallback(async () => {
      try {
         if (!!dataSpj && !!namaBulan && !!jadwal) {
            const listSubGiat = await getAllBlSubGiat({
               id_unit: id_skpd,
               jadwal_anggaran_id: jadwal,
               id_daerah: id_daerah,
            })
            const listDana = await getSumberDanaAkunRinciSubGiat({
               id_unit: id_skpd,
               jadwal_anggaran_id: jadwal,
            })
            const dana = uniqBy(listDana, 'id_dana')
            const pembukuan2 = dataSpj?.pembukuan2?.map((d) => {
               const kode = d?.kode_unik?.split('-')
               if (kode?.length === 5) {
                  const [kode_sub_skpd, kode_program, kode_giat, kode_sub_giat, kode_akun] = kode
                  const subGiat = listSubGiat?.find(
                     (sbl) =>
                        sbl?.kode_sub_skpd === kode_sub_skpd &&
                        sbl?.kode_program === kode_program &&
                        sbl?.kode_giat === kode_giat &&
                        sbl?.kode_sub_giat === kode_sub_giat
                  )

                  const itemRak = rak?.find(
                     (rak) =>
                        d.kode_akun === rak?.kode_akun &&
                        rak?.kode_giat === kode_giat &&
                        rak?.kode_sub_giat === kode_sub_giat &&
                        rak?.kode_program === kode_program &&
                        rak?.kode_sub_skpd === kode_sub_skpd &&
                        rak?.kode_akun === kode_akun
                  )

                  const dana = listDana?.filter(
                     (item) =>
                        d.kode_akun === item?.kode_akun &&
                        item?.bl_sub_giat_id === subGiat?.id &&
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
   }, [dataSpj, namaBulan, rak, month, jadwal, id_skpd, id_daerah])

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
               <div>
                  <Button
                     color='primary'
                     isLoading={isFetching || isFetchingRak || isFetchingApbd || isLoading}
                     onPress={exportExcel}>
                     Download Excel
                  </Button>
                  <Button
                     color='secondary'
                     isLoading={isFetching || isFetchingRak || isFetchingApbd || isLoading}
                     onPress={updateRealiasasi}>
                     Back Up
                  </Button>
               </div>
            </div>
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
