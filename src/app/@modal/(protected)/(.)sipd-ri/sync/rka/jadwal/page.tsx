'use client'

import { useCallback, useState } from 'react'
import {
   getJadwalAnggaranAktifFromSipd,
   getJadwalAnggaranFromSipd,
   syncJadwalAnggaranSipd,
} from '@actions/perencanaan/rka/jadwal-anggaran'
import { validateSipdSession } from '@actions/perencanaan/token-sipd'
import DialogConfirm from '@components/modal/dialog-confirm'
import { MaxDataInput } from '@components/perencanaan/sync-input'
import { processChunks } from '@utils/hof'
import { JadwalAnggaranUncheckedCreateInputSchema } from '@zod'
import { toast } from 'react-toastify'
import { useSession } from '@shared/hooks/use-session'

async function singkronData(
   data: Zod.infer<typeof JadwalAnggaranUncheckedCreateInputSchema>[],
   n: number
) {
   toast.update('singkron_data', {
      render: `Sedang Update data jadwal ke-${n}`,
   })
   await syncJadwalAnggaranSipd(data)
      .then((res) => {
         toast(res.data?.message ?? 'Berhasil singkron data jadwal ' + ' ke-' + n, {
            autoClose: res.success ? 1000 : 3000,
            type: res.success ? 'success' : 'error',
            position: 'bottom-left',
         })
      })
      .catch((error: any) => [
         toast(error?.message ?? 'Gagal singkron data jadwal' + ' ke-' + n, {
            autoClose: 3000,
            type: 'error',
            position: 'bottom-left',
         }),
      ])
}

const ModalSingkronJadwal = () => {
   const { data: session } = useSession()
   const [lengthData, setLengthData] = useState(100)
   const [isValid, setIsValid] = useState(true)
   const [isLoading, setIsLoading] = useState(false)
   const action = useCallback(async () => {
      setIsLoading(true)
      toast('Sedang mengambil data jadwal dari sipd', { toastId: 'singkron_data', isLoading: true })
      try {
         const data = await processSync(isValid, session, lengthData)
         toast.update('singkron_data', {
            render: `Selesai singkron ${data.length} data jadwal anggaran`,
            isLoading: false,
            autoClose: 2000,
            type: 'info',
         })
         setIsLoading(false)
         return true
      } catch (error: any) {
         toast.update('singkron_data', {
            render: error?.message || 'Gagal singkron data jadwal',
            isLoading: false,
            autoClose: 2000,
            type: 'error',
         })
         setIsLoading(false)
         return false
      }
   }, [session, isValid, lengthData])

   return (
      <DialogConfirm
         action={action}
         disabledSubmit={!isValid}
         data_key={['jadwal_anggaran']}
         header='Singkron Jadwal Penganggaran'>
         <p className='border-warning rounded-small border p-1 text-center'>
            PERHATIAN!! <span className='font-semibold'>Proses membutuhkan waktu.</span>
         </p>
         <MaxDataInput
            isReadOnly={isLoading}
            defaultValue={lengthData}
            onValidate={setIsValid}
            onValueChange={setLengthData}
         />
         <p className='text-small'>
            Data Jadwal Pengaggaran Belanja akan diganti dengan data dari SIPD-RI. Apakah anda
            yakin?
         </p>
      </DialogConfirm>
   )
}
export default ModalSingkronJadwal

async function processSync(isValid: boolean, session: Session | null, lengthData: number) {
   if (!isValid) throw new Error('Maksimal data tidak valid')
   const { id_daerah, tahun } = validateSipdSession(session)
   const jadwalActive = await getJadwalAnggaranAktifFromSipd({
      id_daerah,
      tahun,
   })

   try {
      const jadwalData = await getJadwalAnggaranFromSipd({ id_daerah, tahun }).then((d) => {
         const chekJadwalAktif = d.some((jadwal) => jadwal.id_unik === jadwalActive[0].id_unik)
         if (!!jadwalActive?.length && !!jadwalActive[0]?.id_unik && !chekJadwalAktif) {
            return [...d, jadwalActive[0]]
         }
         return d
      })

      let processedData = jadwalData.map((jadwal) => {
         const isActive = jadwalActive.some((active) => active.id_jadwal === jadwal.id_jadwal)
         const murni =
            jadwal.is_perubahan && jadwal.id_jadwal_murni
               ? jadwalData.find((data) => data.id_jadwal === jadwal.id_jadwal_murni)
               : null

         return {
            ...jadwal,
            is_active: isActive ? 1 : 0,
            id_unik_murni: murni?.id_unik ?? null,
            nama_jadwal_murni: murni?.nama_sub_tahap ?? null,
            is_lokal: 0,
            waktu_mulai: new Date(jadwal.waktu_mulai.replace(' GMT', '')),
            waktu_selesai: new Date(jadwal.waktu_selesai.replace(' GMT', '')),
         }
      })

      if (processedData.length === 0) throw new Error('Tidak ada data jadwal anggaran')

      toast.update('singkron_data', {
         render: 'Sedang Update data jadwal',
      })

      await processChunks({
         data: processedData,
         action: singkronData,
         max: lengthData,
         schema: JadwalAnggaranUncheckedCreateInputSchema,
      })

      return processedData
   } catch (error) {
      throw new Error('Gagal mengambil data jadwal dari sipd')
   }
}
