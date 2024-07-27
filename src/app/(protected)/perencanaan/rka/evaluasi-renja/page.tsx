'use client'

import { useMemo, useState } from 'react'
import { getRealisasiSubGiat } from '@actions/perencanaan/rka/bl-sub-giat'
import JadwalInput from '@components/perencanaan/jadwal-anggaran'
import { Button } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useSession } from '@shared/hooks/use-session'

import dowloadExcel from './export-excel'

export default function Page() {
   const { data: session } = useSession()
   const [jadwal, setJadwal] = useState<string>()
   const handleJadwalChange = (jadwal?: string) => {
      setJadwal(jadwal)
   }
   const query = useMemo(
      () => ({
         id_unit: session?.user?.id_unit || 0,
         jadwal_anggaran_id: jadwal || '',
         id_daerah: session?.user?.id_daerah || 0,
         id_skpd: session?.user?.id_skpd || undefined,
         tahun: session?.user?.tahun || undefined,
      }),
      [
         jadwal,
         session?.user?.id_daerah,
         session?.user?.id_skpd,
         session?.user?.id_unit,
         session?.user?.tahun,
      ]
   )
   const { data, isFetched, isFetching } = useQuery({
      queryKey: [query, 'realisasi_sub_giat', 'jadwal_anggaran'] as [typeof query, ...any],
      queryFn: async ({ queryKey: [query] }) => await getRealisasiSubGiat(query),
      enabled: !!query.jadwal_anggaran_id && !!query.id_unit && !!query.id_daerah,
   })
   const handleExportExcel = async () => {
      if (!data) {
         toast.error('Tidak ada data')
         return
      }
      await dowloadExcel(data)
   }
   return (
      <div className='content'>
         <JadwalInput
            selectedKey={jadwal}
            params={{
               tahun: session?.user?.tahun,
               id_daerah: session?.user?.id_daerah,
               filter: 'has-bl-sub-giat',
            }}
            onSelectionChange={handleJadwalChange}
            label='Pilih Jadwal Rincian Belanja'
         />
         <Button
            // isDisabled={!isFetched || !isFetching}
            isLoading={isFetching}
            onClick={handleExportExcel}>
            Excel
         </Button>
      </div>
   )
}
