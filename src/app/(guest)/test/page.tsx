'use client'

import { useCallback, useState } from 'react'
import { backUpRakBlSubGiatSipdPeta } from '@actions/penatausahaan/pengeluaran/rak'
import JadwalInput from '@components/perencanaan/jadwal-anggaran'
// import { getAllBlSubGiatSipd } from '@actions/perencanaan/rka/bl-sub-giat'
import { Button } from '@nextui-org/react'

export default function Page() {
   const [jadwal, setJadwal] = useState<string>('')
   const handle = useCallback(async () => {
      const res = await backUpRakBlSubGiatSipdPeta({
         id_daerah: 424,
         id_unit: 1871,
         tahun: 2024,
         jadwal_anggaran_id: jadwal,
      })
   }, [jadwal])
   return (
      <div className='w-fit border-collapse'>
         <JadwalInput onSelectionChange={setJadwal} />
         <Button onPress={handle}> Singkron</Button>
      </div>
   )
}
