'use client'

import { useCallback, useRef, useState } from 'react'
import { getListBlSkpdSipd, syncBlListSkpd } from '@actions/perencanaan/rka/bl-skpd'
import { validateSipdSession } from '@actions/perencanaan/token-sipd'
import DialogConfirm from '@components/modal/dialog-confirm'
import JadwalInput from '@components/perencanaan/jadwal-anggaran'
import { MaxDataInput } from '@components/perencanaan/sync-input'
import { processChunks } from '@utils/hof'
import { BlSkpdUncheckedCreateInputSchema } from '@zod'
import { toast } from 'react-toastify'
import { useSession } from '@shared/hooks/use-session'

async function singkronData(data: Zod.infer<typeof BlSkpdUncheckedCreateInputSchema>[], n: number) {
   toast.update('singkron_data', {
      render: `Sedang Update data belanja skpd ke-${n}`,
   })
   await syncBlListSkpd(data)
      .then((res) => {
         toast(res.data?.message ?? 'Berhasil singkron data belanja skpd ' + ' ke-' + n, {
            autoClose: res.success ? 1000 : 3000,
            type: res.success ? 'success' : 'error',
            position: 'bottom-left',
         })
      })
      .catch((error: any) => [
         toast(error?.message ?? 'Gagal singkron data belanja skpd' + ' ke-' + n, {
            autoClose: 3000,
            type: 'error',
            position: 'bottom-left',
         }),
      ])
}

const ModalSingkronJadwal = () => {
   const { data: session } = useSession()
   const [lengthData, setLengthData] = useState(100)
   const [jadwal, setJadwal] = useState<{ id: string; id_jadwal: number }>()
   const [jadwalMurni, setJadwalMurni] = useState<{ id: string }>()
   const [isValid, setIsValid] = useState(true)
   const [isLoading, setIsLoading] = useState(false)
   const maxInput = useRef<HTMLInputElement>(null)
   const jadwalInput = useRef<HTMLInputElement>(null)

   const action = useCallback(async () => {
      setIsLoading(true)
      toast('Sedang mengambil data belanja skpd dari sipd', {
         toastId: 'singkron_data',
         isLoading: true,
      })
      try {
         if (!isValid) {
            throw new Error('Maksimal data tidak valid')
         }

         if (!jadwal) {
            jadwalInput?.current?.focus()
            throw new Error('Jadwal singkron kosong')
         }

         const { id_daerah, id_level, id_user, id_unit, tahun } = validateSipdSession(session)

         try {
            const listBlSkpd = await getListBlSkpdSipd({
               id_daerah,
               id_level,
               id_unit,
               id_user,
               tahun,
               is_anggaran: 1,
            })
            const data = listBlSkpd?.data?.map((item) => ({
               ...item,
               jadwal_anggaran_id: jadwal?.id,
               id_jadwal: jadwal?.id_jadwal,
               jadwal_anggaran_murni_id: jadwalMurni?.id,
            }))
            if (data && data.length > 0) {
               toast.update('singkron_data', {
                  render: 'Sedang Update data belanja skpd',
               })

               await processChunks({
                  data,
                  action: singkronData,
                  max: lengthData,
                  schema: BlSkpdUncheckedCreateInputSchema,
               })

               toast.update('singkron_data', {
                  render: `Selesai singkron ${data.length} data belanja skpd anggaran`,
                  isLoading: false,
                  autoClose: 2000,
                  type: 'info',
               })
               setIsLoading(false)
               return true
            }
            setIsLoading(false)
            return false
         } catch (error) {
            toast.update('singkron_data', {
               render: 'Gagal mengambil data belanja skpd dari sipd',
               isLoading: false,
               type: 'error',
               autoClose: 2000,
            })
            throw error
         }
      } catch (error: any) {
         toast.update('singkron_data', {
            render: error?.message || 'Gagal singkron data belanja skpd',
            isLoading: false,
            autoClose: 2000,
            type: 'error',
         })
         setIsLoading(false)
         return false
      }
   }, [session, isValid, lengthData, jadwal, jadwalMurni])

   return (
      <DialogConfirm
         size='xl'
         action={action}
         disabledSubmit={!isValid || !jadwal}
         data_key={['bl_skpd']}
         header='Singkron Belanja SKPD'>
         <div className='flex flex-col gap-3'>
            <MaxDataInput
               isReadOnly={isLoading}
               ref={maxInput}
               defaultValue={lengthData}
               onValidate={setIsValid}
               onValueChange={setLengthData}
               autoFocus
               label='Per Request'
            />
            <JadwalInput
               isReadOnly={isLoading}
               ref={jadwalInput}
               isInvalid={!jadwalInput}
               isRequired
               selectedKey={jadwal?.id}
               onJadwalMurniChange={setJadwalMurni}
               isClearable={true}
               onChange={setJadwal}
               inputMode='text'
               shouldCloseOnBlur
               allowsCustomValue={false}
            />
            <div className='border-warning rounded-small border p-1 text-center'>
               <p>
                  CATATAN!! <span className='font-semibold'>Proses membutuhkan waktu.</span>
               </p>
               <p>
                  Jika memilih salin data maka data akan disingkron dengan jadwal singkron bukan
                  dengan jadwal SIPD
               </p>
            </div>
            <p className='text-small'>
               Data Belanja SKPD akan diganti dengan data dari SIPD-RI. Apakah anda yakin?
            </p>
         </div>
      </DialogConfirm>
   )
}
export default ModalSingkronJadwal
