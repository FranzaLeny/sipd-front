'use client'

import { useCallback, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { Autocomplete, AutocompleteItem, Button } from '@nextui-org/react'
import { toast } from 'react-toastify'
import { useSipdPetaFetcher } from '@shared/hooks/use-sipd-peta-fetcher'

import dowloadExcelSpjFungsional from './export-excel'

const ChartRealisasi = dynamic(() => import('./chart-realisasi'), {
   loading: () => <p>Loading</p>,
   ssr: false,
})

export interface SpjFungsional {
   nama_daerah: string
   nama_skpd: string
   kode_skpd: string
   tahun: number
   logo: string
   nama_pa_kpa: string
   nip_pa_kpa: string
   jabatan_pa_kpa: string
   nama_bp_bpp: string
   nip_bp_bpp: string
   jabatan_bp_bpp: string
   pembukuan1: Pembukuan1[]
   pembukuan2: Pembukuan1[]
   pembukuan3: Pembukuan3[]
   pembukuan4: Pembukuan4[]
   pembukuan5: Pembukuan5[]
   pembukuan6: Pembukuan3[]
   pembukuan7: Pembukuan4[]
   pembukuan8: Pembukuan5[]
   pembukuan9: Pembukuan3[]
   pembukuan10: Pembukuan10[]
   pembukuan11: Pembukuan3[]
}

interface Pembukuan10 {
   urut: number
   jenis: string
   pengembalian_realisasi_gaji_bulan_sebelumnya: number
   pengembalian_realisasi_gaji_bulan_ini: number
   pengembalian_realisasi_gaji_sd_saat_ini: number
   pengembalian_realisasi_selain_gaji_bulan_sebelumnya: number
   pengembalian_realisasi_selain_gaji_bulan_ini: number
   pengembalian_realisasi_selain_gaji_sd_saat_ini: number
   pengembalian_realisasi_upgutu_bulan_sebelumnya: number
   pengembalian_realisasi_upgutu_bulan_ini: number
   pengembalian_realisasi_upgutu_sd_saat_ini: number
}

interface Pembukuan5 {
   id_pajak_potongan: number
   nama_pajak_potongan: string
   realisasi_pajak_gaji_bulan_sebelumnya: number
   realisasi_pajak_gaji_bulan_ini: number
   realisasi_pajak_gaji_sd_saat_ini: number
   realisasi_pajak_selain_gaji_bulan_sebelumnya: number
   realisasi_pajak_selain_gaji_bulan_ini: number
   realisasi_pajak_selain_gaji_sd_saat_ini: number
   realisasi_pajak_upgutu_bulan_sebelumnya: number
   realisasi_pajak_upgutu_bulan_ini: number
   realisasi_pajak_upgutu_sd_saat_ini: number
}

interface Pembukuan4 {
   id_pajak_potongan: number
   nama_pajak_potongan: string
   realisasi_potongan_gaji_bulan_sebelumnya: number
   realisasi_potongan_gaji_bulan_ini: number
   realisasi_potongan_gaji_sd_saat_ini: number
   realisasi_potongan_selain_gaji_bulan_sebelumnya: number
   realisasi_potongan_selain_gaji_bulan_ini: number
   realisasi_potongan_selain_gaji_sd_saat_ini: number
   realisasi_potongan_upgutu_bulan_sebelumnya: number
   realisasi_potongan_upgutu_bulan_ini: number
   realisasi_potongan_upgutu_sd_saat_ini: number
}

interface Pembukuan3 {
   urut: number
   jenis: string
   realisasi_gaji_bulan_sebelumnya: number
   realisasi_gaji_bulan_ini: number
   realisasi_gaji_sd_saat_ini: number
   realisasi_ls_selain_gaji_bulan_sebelumnya: number
   realisasi_ls_selain_gaji_bulan_ini: number
   realisasi_ls_selain_gaji_sd_saat_ini: number
   realisasi_up_gu_tu_bulan_sebelumnya: number
   realisasi_up_gu_tu_bulan_ini: number
   realisasi_up_gu_tu_sd_saat_ini: number
}

interface Pembukuan1 {
   kode_akun: string
   nama_akun: string
   alokasi_anggaran: number
   realisasi_gaji_bulan_sebelumnya: number
   realisasi_gaji_bulan_ini: number
   realisasi_gaji_sd_saat_ini: number
   realisasi_ls_selain_gaji_bulan_sebelumnya: number
   realisasi_ls_selain_gaji_bulan_ini: number
   realisasi_ls_selain_gaji_sd_saat_ini: number
   realisasi_up_gu_tu_bulan_sebelumnya: number
   realisasi_up_gu_tu_bulan_ini: number
   realisasi_up_gu_tu_sd_saat_ini: number
   jumlah_sd_saat_ini: number
   sisa_pagu_anggaran: number
   bku_jenis: number
   kode_unik: string
}

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

export interface Apbd {
   id_daerah: number
   tahun: number
   id_skpd: number
   kode_skpd: string
   nama_skpd: string
   anggaran: number
   realisasi_rencana: number
   realisasi_rill: number
}

export default function Component({ bulan, token }: { token: string; bulan: string }) {
   const currMonth = new Date().getMonth() + 1
   const [month, setMonth] = useState<string | number | null>(bulan)
   const { data: dataSpj, isFetching } = useSipdPetaFetcher<SpjFungsional>({
      token,
      url: `
        https://service.sipd.kemendagri.go.id/pengeluaran/strict/lpj/adm-fungs/0?type=SKPD&bulan=${month}`,
      enabled: !!token && !!month,
   })
   const { data: apbd } = useSipdPetaFetcher<Apbd[]>({
      token,
      url: `
        https://service.sipd.kemendagri.go.id/pengeluaran/strict/dashboard/statistik-belanja`,
      enabled: !!token,
   })

   const namaBulan = useMemo(() => {
      return months?.find((item) => item.key == month)?.name || 'Bulan'
   }, [month])

   const handle = useCallback(() => {
      try {
         if (!!dataSpj && !!namaBulan) {
            dowloadExcelSpjFungsional({ ...dataSpj, bulan: namaBulan })
         } else {
            throw new Error('Data SPJ Fungsional tidak ditemukan')
         }
      } catch (error: any) {
         toast.error(error?.message ?? 'Gagal download excel SPJ fungsional', { autoClose: 5000 })
      }
   }, [dataSpj, namaBulan])

   return (
      <div className='content relative z-0 space-y-3'>
         <div className='bg-content1 flex items-center gap-4 rounded p-4'>
            <div className='w-full flex-1'>
               <Autocomplete
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
