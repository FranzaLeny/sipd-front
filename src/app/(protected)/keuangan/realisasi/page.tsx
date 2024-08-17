'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { getRakBlByJadwal } from '@actions/penatausahaan/pengeluaran/rak'
import JadwalInput from '@components/perencanaan/jadwal-anggaran'
import { Button } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from '@shared/hooks/use-session'

import downloadRak from './export-excel'

export default function Page() {
   const [jadwal, setJadwal] = useState('')
   const { data } = useSession()
   const { id_daerah, id_skpd, tahun } = useMemo(() => {
      return {
         id_daerah: data?.user?.id_daerah || 0,
         tahun: data?.user?.tahun || 0,
         id_skpd: data?.user?.id_skpd || 0,
      }
   }, [data?.user])
   const { data: rak, isFetching: loadingRak } = useQuery({
      queryKey: [{ jadwal_anggaran_id: jadwal, id_skpd }, 'data_rak', 'jadwal_anggaran'] as [
         GetRakByJadwalParams,
         ...any,
      ],
      queryFn: ({ queryKey: [q] }) => getRakBlByJadwal(q),
      enabled: !!jadwal,
   })

   useEffect(() => {
      console.log({ rak })
   }, [rak])
   const handleDownload = useCallback(() => {
      if (rak?.length) {
         downloadRak(rak)
      }
   }, [rak])
   return (
      <div className='content space-y-5'>
         <JadwalInput
            selectedKey={jadwal ?? ''}
            params={{ filter: 'has-rak', id_skpd, tahun, id_daerah }}
            onSelectionChange={setJadwal}
         />
         <Button
            onPress={handleDownload}
            isDisabled={!rak?.length}>
            Dowbload
         </Button>
      </div>
   )
}
