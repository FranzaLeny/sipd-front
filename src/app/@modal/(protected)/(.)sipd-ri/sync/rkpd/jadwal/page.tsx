'use client'

import { useCallback, useState } from 'react'
import { syncJadwalAnggaranSipd } from '@actions/perencanaan/rka/jadwal-anggaran'
import {
   getJadwaRkpdAktifFromSipd,
   getJadwaRkpdFromSipd,
} from '@actions/perencanaan/rkpd/jadwal-rkpd'
import { validateSipdSession } from '@actions/perencanaan/token-sipd'
import DialogConfirm from '@components/modal/dialog-confirm'
import { MaxDataInput } from '@components/perencanaan/sync-input'
import { processChunks } from '@utils/hof'
import { JadwalAnggaranUncheckedCreateInputSchema } from '@zod'
import { toast, ToastContent } from 'react-toastify'
import { useSession } from '@shared/hooks/use-session'

async function singkronData(data: JadwalAnggaranUncheckedCreateInput[], n: number) {
   toast.update('singkron_data', {
      render: (
         <div>
            <p className='font-bold'>Mohon tunggu</p>
            <p>`Sedang simpan data jadwal ke-{n}</p>
         </div>
      ),
      isLoading: true,
   })

   await syncJadwalAnggaranSipd(data).catch((error: any) => {
      toast.error(
         <div>
            <p className='font-bold'>Gagal</p>
            <p>{error?.message ?? 'Gagal singkron data jadwal' + ' ke-' + n}</p>
         </div>
      )
   })
}

const ModalSingkronJadwal = () => {
   const { data: session } = useSession()
   const [lengthData, setLengthData] = useState(100)
   const [isValid, setIsValid] = useState(true)
   const [isLoading, setIsLoading] = useState(false)
   const action = useCallback(async () => {
      setIsLoading(true)
      toast(
         <div>
            <p className='font-bold'>Mohon tunggu...</p>
            <p>Sedang mengambil data jadwal dari sipd</p>
         </div>,
         {
            toastId: 'singkron_data',
            isLoading: true,
         }
      )
      try {
         const data = await processSync(isValid, session, lengthData)
         const content = (
            <div>
               <p className='font-bold'>Berhasil</p>
               <p>Selesai singkron {data.length} data jadwal anggaran</p>
            </div>
         )
         toast.update('singkron_data', {
            render: content,
            isLoading: false,
            autoClose: 2000,
            type: 'success',
         })
         setIsLoading(false)
         return true
      } catch (error: any) {
         const errMsg = error?.message || 'Gagal singkron data akun'
         if (typeof errMsg === 'string') {
            let message: ToastContent = errMsg
            const messages = errMsg?.split?.('\n')
            if (messages?.length > 1) {
               message = (
                  <div>
                     {messages?.map((msg, i) => (
                        <p
                           key={i}
                           className={`${i === 0 ? 'font-bold' : 'italic'}`}>
                           {msg}
                        </p>
                     ))}
                  </div>
               )
            } else {
               message = (
                  <div>
                     <p className='font-bold'>Terjadi Kesalahan</p>
                     <p>{message}</p>
                  </div>
               )
            }
            toast.update('singkron_data', {
               render: message,
               isLoading: false,
               autoClose: 2000,
               type: 'error',
            })
         }
         setIsLoading(false)
         return false
      }
   }, [session, isValid, lengthData])

   return (
      <DialogConfirm
         action={action}
         disabledSubmit={!isValid}
         data_key={['jadwal_rkpd', 'rkpd']}
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
   const jadwalActive = await getJadwaRkpdAktifFromSipd({
      id_daerah,
      tahun,
   })

   try {
      const jadwalData = await getJadwaRkpdFromSipd({ id_daerah, tahun })
      const processedData = jadwalData.map((jadwal) => {
         const isActive = jadwalActive.some((active) => active.id_jadwal === jadwal.id_jadwal)
         const murni =
            jadwal.is_perubahan && jadwal.id_jadwal_murni
               ? jadwalData.find((data) => data.id_jadwal === jadwal.id_jadwal_murni)
               : null
         console.log('jadwal', jadwal?.geser_khusus)

         return {
            ...jadwal,
            is_active: isActive ? 1 : 0,
            geser_khusus: jadwal?.geser_khusus ? 1 : 0,
            id_unik_murni: murni?.id_unik ?? null,
            nama_jadwal_murni: murni?.nama_sub_tahap ?? null,
            is_lokal: 0,
            waktu_mulai: new Date(jadwal.waktu_mulai.replace(' GMT', '')),
            waktu_selesai: new Date(jadwal.waktu_selesai.replace(' GMT', '')),
         }
      })

      if (processedData.length === 0) throw new Error('Tidak ada data jadwal anggaran')
      const content = (
         <div>
            <p className='font-bold'>Mohon tunggu</p>
            <p>Sedang proses data jadwal</p>
         </div>
      )
      toast.update('singkron_data', {
         render: content,
      })
      await processChunks({
         data: processedData,
         action: singkronData,
         max: lengthData,
         schema: JadwalAnggaranUncheckedCreateInputSchema,
      })

      return processedData
   } catch (error) {
      console.log({ error })

      throw new Error('Gagal mengambil data jadwal dari sipd')
   }
}
