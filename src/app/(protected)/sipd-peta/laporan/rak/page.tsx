'use client'

import { useCallback, useState } from 'react'
import { backUpRakBlSubGiatSipdPeta } from '@actions/penatausahaan/pengeluaran/rak'
import JadwalInput, { JadwalRakInput } from '@components/perencanaan/jadwal-anggaran'
// import { getAllBlSubGiatSipd } from '@actions/perencanaan/rka/bl-sub-giat'
import { Button } from '@nextui-org/react'
import { useSession } from '@shared/hooks/use-session'

export default function Page() {
   const [jadwal, setJadwal] = useState<string>('')
   const { data } = useSession(['sipd_peta'])
   const handle = useCallback(async () => {
      const res = await backUpRakBlSubGiatSipdPeta({
         id_daerah: 424,
         id_unit: 1871,
         tahun: 2024,
         jadwal_anggaran_id: jadwal,
      })
   }, [jadwal])
   return (
      <div className='w-fit border-collapse space-y-6'>
         <JadwalInput
            selectedKey={jadwal}
            onSelectionChange={setJadwal}
         />
         {!!data?.user?.accountPeta && (
            <JadwalRakInput
               selectedKey={jadwal}
               defaultParams={{
                  tahun: data.user?.tahun,
                  id_daerah: data?.user?.accountPeta?.id_daerah,
                  id_skpd: data?.user?.accountPeta?.id_skpd,
               }}
               onSelectionChange={setJadwal}
            />
         )}
         <Button onPress={handle}> Singkron</Button>
      </div>
   )
}
