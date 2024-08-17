'use client'

import { useCallback, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { getRakBlByJadwal, syncRelalisasiRak } from '@actions/penatausahaan/pengeluaran/rak'
import { getSpjFungsionalSipdPeta } from '@actions/penatausahaan/pengeluaran/spj'
import { getStatistikBlSkpdSipd } from '@actions/penatausahaan/pengeluaran/statistik'
import { getSumberDanaAkunRinciSubGiat } from '@actions/perencanaan/rka/bl-rinci-sub-giat'
import { getAllBlSubGiat } from '@actions/perencanaan/rka/bl-sub-giat'
import JadwalInput from '@components/perencanaan/jadwal-anggaran'
import {
   Autocomplete,
   AutocompleteItem,
   Button,
   cn,
   Input,
   Listbox,
   ListboxItem,
   Modal,
   ModalBody,
   ModalContent,
   ModalFooter,
   ModalHeader,
   Pagination,
   Popover,
   PopoverContent,
   PopoverTrigger,
   Select,
   Selection,
   SelectItem,
   Spinner,
   Table,
   TableBody,
   TableCell,
   TableColumn,
   TableHeader,
   TableRow,
   Textarea,
   useDisclosure,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { numberToRupiah } from '@utils'
import { RealisasiRakInputValidationSchema } from '@validations/keuangan/rak'
import { sortBy, uniqBy } from 'lodash-es'
import { Settings } from 'lucide-react'
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
   const [selectedJadwal, setSelectedJadwal] = useState<JadwalAnggaran>()
   const [jadwal, setJadwal] = useState('')
   const [rowsPerPage, setRowsPerPage] = useState(10)
   const [selectedColumns, setSelectedColumns] = useState<Selection>(
      new Set<keyof Pembukuan1SpjFungsionalSipdPeta>([
         'kode_akun',
         'nama_akun',
         'alokasi_anggaran',
         'jumlah_sd_saat_ini',
         'sisa_pagu_anggaran',
      ])
   )

   const { isOpen, onClose, onOpen } = useDisclosure()

   const currMonth = new Date().getMonth() + 1

   const { data: dataSpj, isFetching } = useQuery({
      queryKey: [{ bulan: month, type: 'SKPD' }, 'spj-fungsional-peta'] as [
         { type: string; bulan: string },
         ...any,
      ],
      queryFn: async ({ queryKey: [params] }) => await getSpjFungsionalSipdPeta(params),
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
            const canSyncNilaiRealisasi =
               month?.toString() === currMonth.toString() || month?.toString() === '12'
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
                     nilai_realisasi: canSyncNilaiRealisasi ? jumlah_sd_saat_ini : undefined,
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
   }, [month, rak, dataSpj?.pembukuan2, currMonth])

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

   const disabledMonts = useMemo(() => {
      return months.filter((d) => d.key > currMonth)?.map((d) => d.key?.toString())
   }, [currMonth])

   return (
      <>
         {!!selectedJadwal && !!dataSpj && (
            <ModalRealisasi
               action={updateRealiasasi}
               handleClose={onClose}
               isLoading={isLoading}
               isOpen={isOpen}
               tahun={tahun}
               jadwal={selectedJadwal?.nama_sub_tahap}
               bulan={namaBulan}
               namaSkpd={dataSpj?.nama_skpd}
            />
         )}
         <div className='content sticky left-0'>
            <JadwalInput
               selectedKey={jadwal}
               isDisabled={isFetching || isFetchingRak || isFetchingApbd || isLoading}
               onListJadwalChange={(d) => setJadwal(d[0]?.id)}
               onSelectionChange={setJadwal}
               onChange={setSelectedJadwal}
               params={{
                  id_daerah,
                  id_skpd,
                  tahun,
                  filter: 'has-bl-sub-giat',
                  // jadwal_penatausahaan: 'true',
               }}
            />
         </div>
         {!!dataSpj?.pembukuan1?.length && (
            <ChartRealisasi
               apbd={apbd}
               bulan={namaBulan}
               tahun={dataSpj?.tahun}
               items={dataSpj?.pembukuan1}
               skpd={dataSpj?.nama_skpd}
            />
         )}
         <TableSpj
            rowsPerPage={rowsPerPage}
            selectedColumns={selectedColumns}
            isFetching={isFetching}
            data={dataSpj?.pembukuan2 || []}
         />
         <div className='rounded-t-medium sticky bottom-0 z-10 mx-auto  flex w-fit items-center justify-center gap-2 p-2 backdrop-blur sm:gap-4'>
            <Autocomplete
               labelPlacement='outside-left'
               isLoading={isFetching || isFetchingRak || isFetchingApbd || isLoading}
               isDisabled={isFetching || isFetchingRak || isFetchingApbd || isLoading}
               listboxProps={{ emptyContent: 'Tidak ada data bulan' }}
               selectedKey={month?.toString() ?? ''}
               onSelectionChange={setMonth}
               disabledKeys={disabledMonts}
               defaultItems={months}
               aria-label='Bulan'
               placeholder='Cari bulan'>
               {(item) => (
                  <AutocompleteItem
                     textValue={`Bulan ${item.name}`}
                     key={item.key}>
                     {item.name}
                  </AutocompleteItem>
               )}
            </Autocomplete>
            <div className='flex gap-2'>
               <Button
                  color='primary'
                  isDisabled={isFetching || isFetchingRak || isFetchingApbd}
                  isLoading={isLoading}
                  onPress={exportExcel}>
                  Download
               </Button>
               <Button
                  color='secondary'
                  isDisabled={
                     isFetching ||
                     isFetchingRak ||
                     isFetchingApbd ||
                     isLoading ||
                     !(!!selectedJadwal && !!dataSpj)
                  }
                  onPress={onOpen}>
                  Singkron
               </Button>
               <TableSetings
                  dataLength={dataSpj?.pembukuan2?.length ?? 0}
                  rowsPerPage={rowsPerPage}
                  selectedColumns={selectedColumns}
                  setRowsPerPage={setRowsPerPage}
                  setSelectedColumns={setSelectedColumns}
               />
            </div>
         </div>
      </>
   )
}
const ModalRealisasi: React.FC<{
   isOpen: boolean
   isLoading: boolean
   handleClose: () => void
   action: () => void
   jadwal: string
   namaSkpd: string
   bulan: string
   tahun: number
}> = ({ handleClose, isOpen, action, isLoading, bulan, jadwal, namaSkpd, tahun }) => {
   return (
      <Modal
         isOpen={isOpen}
         onClose={handleClose}>
         <ModalContent>
            {(onClose) => (
               <>
                  <ModalHeader>
                     <div>Singkron Realisiasi {tahun}</div>
                  </ModalHeader>
                  <ModalBody>
                     <Input
                        variant='underlined'
                        label='Bulan'
                        value={bulan}
                        isReadOnly
                     />
                     <Textarea
                        minRows={1}
                        variant='underlined'
                        label='Jadwal'
                        value={jadwal}
                        isReadOnly
                     />
                     <Textarea
                        variant='underlined'
                        label='SKPD'
                        minRows={1}
                        value={namaSkpd}
                        isReadOnly
                     />
                  </ModalBody>
                  <ModalFooter>
                     <Button
                        disabled={isLoading}
                        color='danger'
                        onPress={onClose}>
                        Batal
                     </Button>
                     <Button
                        color='primary'
                        onPress={action}>
                        Simpan
                     </Button>
                  </ModalFooter>
               </>
            )}
         </ModalContent>
      </Modal>
   )
}

const COLUMNS: {
   key: keyof Pembukuan1SpjFungsionalSipdPeta
   label: string
   align?: 'start' | 'end'
}[] = [
   {
      key: 'kode_akun',
      label: 'KODE',
   },
   {
      key: 'nama_akun',
      label: 'Uraian',
   },
   {
      key: 'alokasi_anggaran',
      label: 'Anggaran',
      align: 'end',
   },
   {
      key: 'realisasi_gaji_bulan_sebelumnya',
      label: 'Realisasi Gaji Bulan Sebelumnya',
      align: 'end',
   },
   {
      key: 'realisasi_ls_selain_gaji_bulan_sebelumnya',
      label: 'Realisasi LS Bulan Sebelumnya',
      align: 'end',
   },
   {
      key: 'realisasi_up_gu_tu_bulan_sebelumnya',
      label: 'Realisasi UP/GU/TU Bulan Sebelumnya',
      align: 'end',
   },
   {
      key: 'realisasi_gaji_bulan_ini',
      label: 'Realisasi Gaji Bulan Ini',
      align: 'end',
   },
   {
      key: 'realisasi_ls_selain_gaji_bulan_ini',
      label: 'Realisasi LS Bulan Ini',
      align: 'end',
   },
   {
      key: 'realisasi_up_gu_tu_bulan_ini',
      label: 'Realisasi UP/GU/TU Bulan Ini',
      align: 'end',
   },
   {
      key: 'realisasi_gaji_sd_saat_ini',
      label: 'Realisasi Gaji',
      align: 'end',
   },
   {
      key: 'realisasi_ls_selain_gaji_sd_saat_ini',
      label: 'Realisasi LS',
      align: 'end',
   },
   {
      key: 'realisasi_up_gu_tu_sd_saat_ini',
      label: 'Realisasi UP/GU/TU',
      align: 'end',
   },
   {
      key: 'jumlah_sd_saat_ini',
      label: 'Total Realisasi',
      align: 'end',
   },
   {
      key: 'sisa_pagu_anggaran',
      label: 'Sisa Anggaran',
      align: 'end',
   },
]

function TableSpj({
   data,
   isFetching,
   rowsPerPage,
   selectedColumns,
}: {
   data: Pembukuan1SpjFungsionalSipdPeta[]
   isFetching: boolean

   rowsPerPage: number
   selectedColumns: Selection
}) {
   const [page, setPage] = useState(1)

   const alldata = sortBy(data, 'kode_unik')
   const pages = Math.ceil(alldata.length / rowsPerPage)

   const rows = useMemo(() => {
      const start = (page - 1) * rowsPerPage
      const end = start + rowsPerPage
      return alldata.slice(start, end)
   }, [page, alldata, rowsPerPage])

   const renderCell = useCallback((data: Pembukuan1SpjFungsionalSipdPeta, columnKey: React.Key) => {
      const cellValue = data[columnKey as keyof Pembukuan1SpjFungsionalSipdPeta]
      const currencyKeys: (keyof Pembukuan1SpjFungsionalSipdPeta)[] = [
         'alokasi_anggaran',
         'jumlah_sd_saat_ini',
         'realisasi_gaji_bulan_sebelumnya',
         'realisasi_gaji_bulan_ini',
         'realisasi_gaji_sd_saat_ini',
         'realisasi_ls_selain_gaji_bulan_sebelumnya',
         'realisasi_ls_selain_gaji_bulan_ini',
         'realisasi_ls_selain_gaji_sd_saat_ini',
         'realisasi_up_gu_tu_bulan_sebelumnya',
         'realisasi_up_gu_tu_bulan_ini',
         'realisasi_up_gu_tu_sd_saat_ini',
         'sisa_pagu_anggaran',
      ]
      if (currencyKeys.includes(columnKey as keyof Pembukuan1SpjFungsionalSipdPeta)) {
         return numberToRupiah(cellValue ?? 0)
      }
      return cellValue
   }, [])

   const columns = useMemo(() => {
      const selected = Array.from(selectedColumns)
      return COLUMNS.filter((x) => selected.includes(x.key))
   }, [selectedColumns])

   return (
      <>
         <Table
            isHeaderSticky
            isCompact
            isStriped
            selectionMode='single'
            classNames={{
               thead: 'top-navbar z-[1]',
               // base: ' bg-content1 shadow-small rounded-small static overflow-visible p-5 shadow-sm',
               wrapper: 'content z-0 size-fit min-w-full  overflow-visible p-5',
            }}
            // removeWrapper
            aria-label='tabel pembukuan 2'
            bottomContent={
               !!alldata?.length ? (
                  <div className='flex w-full justify-center'>
                     <Pagination
                        isCompact
                        showControls
                        showShadow
                        color='secondary'
                        page={page}
                        total={pages}
                        onChange={setPage}
                     />
                  </div>
               ) : undefined
            }>
            <TableHeader columns={columns}>
               {(column) => (
                  <TableColumn
                     align={column.align}
                     key={column.key}>
                     {column.label}
                  </TableColumn>
               )}
            </TableHeader>
            <TableBody
               isLoading={isFetching}
               loadingState={isFetching ? 'loading' : 'idle'}
               loadingContent={<Spinner label='Loading...' />}
               items={rows}>
               {(item) => {
                  const isSubTotal = item?.kode_unik?.length < 79
                  return (
                     <TableRow key={item.kode_unik}>
                        {(columnKey) => (
                           <TableCell
                              className={cn(
                                 isSubTotal && columnKey === 'kode_akun' && 'font-semibold'
                              )}>
                              {renderCell(item, columnKey)}
                           </TableCell>
                        )}
                     </TableRow>
                  )
               }}
            </TableBody>
         </Table>
      </>
   )
}
function TableSetings({
   rowsPerPage,
   dataLength,
   selectedColumns,
   setRowsPerPage,
   setSelectedColumns,
}: {
   rowsPerPage: number
   dataLength: number
   selectedColumns: Selection
   setRowsPerPage: (val: number) => void
   setSelectedColumns: (val: Selection) => void
}) {
   return (
      <Popover
         radius='sm'
         placement='bottom-end'>
         <PopoverTrigger>
            <Button
               aria-labelledby='table-settings'
               radius='full'
               isIconOnly>
               <Settings />
            </Button>
         </PopoverTrigger>
         <PopoverContent className='p-0'>
            {(titleProps) => (
               <div className='py-2'>
                  <h3
                     className='text-small px-4 font-bold'
                     {...titleProps}>
                     Popover Content
                  </h3>
                  <div>
                     <Select
                        size='sm'
                        label='Per Page'
                        variant='bordered'
                        selectedKeys={[rowsPerPage?.toString()]}
                        className='min-h-max rounded border px-2 py-1'
                        aria-labelledby='rowsPerPage'
                        onChange={(e) => setRowsPerPage(Number(e.target.value))}>
                        {[10, 15, 20, 25, 50, 100, dataLength].map((y) => (
                           <SelectItem
                              key={y?.toString()}
                              textValue={y.toString()}>
                              {y === dataLength ? 'Semua' : y}
                           </SelectItem>
                        ))}
                     </Select>
                  </div>
                  <div className='max-h-36 overflow-auto pt-2'>
                     <Listbox
                        items={COLUMNS}
                        selectionMode='multiple'
                        aria-label='Actions'
                        selectedKeys={selectedColumns}
                        onSelectionChange={setSelectedColumns}
                        disallowEmptySelection>
                        {(x) => (
                           <ListboxItem
                              textValue={x.key}
                              key={x.key}>
                              {x.label}
                           </ListboxItem>
                        )}
                     </Listbox>
                  </div>
               </div>
            )}
         </PopoverContent>
      </Popover>
   )
}
