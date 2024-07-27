'use client'

import { useCallback, useRef, useState } from 'react'
import {
   getListPendapatanByUnitSipd,
   getListPendapatanSkpdSipd,
   syncPendapatan,
} from '@actions/perencanaan/rka/pendapatan'
import { validateSipdSession } from '@actions/perencanaan/token-sipd'
import DialogConfirm from '@components/modal/dialog-confirm'
import JadwalInput from '@components/perencanaan/jadwal-anggaran'
import { MaxDataInput } from '@components/perencanaan/sync-input'
import { Checkbox } from '@nextui-org/react'
import { processChunks } from '@utils/hof'
import { PendapatanUncheckedCreateInput, PendapatanUncheckedCreateInputSchema } from '@zod'
import { toast } from 'react-toastify'
import { useSession } from '@shared/hooks/use-session'

async function singkronData(data: PendapatanUncheckedCreateInput[], n: number) {
   toast.update('singkron_data', {
      render: `Sedang Update data pendapatan skpd ke-${n}`,
   })
   await syncPendapatan(data)
      .then((res) => {
         toast(res.data?.message ?? 'Berhasil singkron data pendapatan skpd ' + ' ke-' + n, {
            autoClose: res.success ? 1000 : 3000,
            type: res.success ? 'success' : 'error',
            position: 'bottom-left',
         })
      })
      .catch((error: any) => [
         toast(error?.message ?? 'Gagal singkron data pendapatan skpd' + ' ke-' + n, {
            autoClose: 3000,
            type: 'error',
            position: 'bottom-left',
         }),
      ])
}

const ModalSingkronPendapatan = () => {
   const { data: session } = useSession()
   const [lengthData, setLengthData] = useState(100)
   const [jadwal, setJadwal] = useState<{ id: string; id_jadwal: number }>()
   const [jadwalMurni, setJadwalMurni] = useState<{ id: string }>()
   const [isValid, setIsValid] = useState(true)
   const [isLoading, setIsLoading] = useState(false)
   const maxInput = useRef<HTMLInputElement>(null)
   const jadwalInput = useRef<HTMLInputElement>(null)
   const [onlyPaguMurni, setOnlyPaguMurni] = useState(false)
   const action = useCallback(async () => {
      setIsLoading(true)
      toast('Sedang mengambil data pendapatan skpd dari sipd', {
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

         const { id_daerah, id_unit, tahun } = validateSipdSession(session)

         try {
            const listPendapatanSkpd = await getListPendapatanSkpdSipd({
               id_daerah,
               id_unit,
               tahun,
               length: 10000,
            })
            const pendSkpd = listPendapatanSkpd?.data?.map((item) => ({
               ...item,
            }))

            if (pendSkpd && pendSkpd.length > 0) {
               const data: PendapatanUncheckedCreateInput[] = []

               for await (const skpd of pendSkpd) {
                  const { id_unit, nama_skpd, id_skpd } = skpd
                  toast.update('singkron_data', {
                     render: `Sedang Chek pendapatan skpd ${nama_skpd}`,
                  })
                  await getListPendapatanByUnitSipd({
                     id_daerah,
                     id_unit,
                     tahun,
                  }).then((pend) => {
                     pend.map((item) => {
                        data.push({
                           ...item,
                           id_unit,
                           id_skpd,
                           volume: onlyPaguMurni ? (item?.murni ?? 0) : item.volume,
                           murni: onlyPaguMurni ? null : item.murni,
                           jadwal_anggaran_id: jadwal?.id,
                           id_jadwal: jadwal?.id_jadwal,
                           jadwal_anggaran_murni_id: jadwalMurni?.id,
                        })
                     })
                  })
               }
               await processChunks({
                  data,
                  action: singkronData,
                  max: lengthData,
                  schema: PendapatanUncheckedCreateInputSchema,
               })

               toast.update('singkron_data', {
                  render: `Selesai singkron ${pendSkpd.length} data pendapatan skpd anggaran`,
                  isLoading: false,
                  autoClose: 2000,
                  type: 'info',
               })
               setIsLoading(false)
               return true
            } else {
               toast.update('singkron_data', {
                  render: 'Gagal mengambil data pendapatan skpd dari sipd',
                  isLoading: false,
                  type: 'error',
                  autoClose: 2000,
               })
               setIsLoading(false)
               return false
            }
         } catch (error) {
            toast.update('singkron_data', {
               render: 'Gagal mengambil data pendapatan skpd dari sipd',
               isLoading: false,
               type: 'error',
               autoClose: 2000,
            })
            throw error
         }
      } catch (error: any) {
         toast.update('singkron_data', {
            render: error?.message || 'Gagal singkron data pendapatan skpd',
            isLoading: false,
            autoClose: 2000,
            type: 'error',
         })
         setIsLoading(false)
         return false
      }
   }, [session, isValid, lengthData, jadwal, jadwalMurni, onlyPaguMurni])

   return (
      <DialogConfirm
         size='xl'
         action={action}
         disabledSubmit={!isValid || !jadwal}
         data_key={['bl_pendapatan']}
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
            {!jadwalMurni && !!jadwal && (
               <div className=' mx-auto  p-3 text-center'>
                  <label className='border-danger flex gap-2 border px-5 py-2 text-sm'>
                     <span className='font-bold'>LUPA SINGKRON</span> data pada jadwal murni?
                     <Checkbox
                        onValueChange={setOnlyPaguMurni}
                        isDisabled={!!jadwalMurni || !jadwal}
                        isSelected={onlyPaguMurni}
                     />
                  </label>
               </div>
            )}
         </div>
      </DialogConfirm>
   )
}
export default ModalSingkronPendapatan
