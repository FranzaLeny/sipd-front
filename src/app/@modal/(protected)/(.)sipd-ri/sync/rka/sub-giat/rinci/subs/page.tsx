'use client'

import { useState } from 'react'
import {
   deleteSubsRinciBlSubGiatByListId,
   getSubsRinciBlSubGiatBySkpdSipd,
   syncSubsRinciBlSubGiat,
} from '@actions/perencanaan/rka/bl-rinci-sub-giat'
import { validateSipdSession } from '@actions/perencanaan/token-sipd'
import DialogConfirm from '@components/modal/dialog-confirm'
import { MaxDataInput } from '@components/perencanaan/sync-input'
import { processChunks } from '@utils/hof'
import { SubsRinciBlSubGiatUncheckedCreateInputSchema } from '@zod'
import { toast } from 'react-toastify'
import { useSession } from '@shared/hooks/use-session'

const ModalSingkronKelompokRinciSbl = () => {
   const [lengthData, setLengthData] = useState(100)
   const [isValid, setIsValid] = useState(true)
   const [isLoading, setIsLoading] = useState(false)
   const { data: session } = useSession()
   const action = async () => {
      setIsLoading(true)
      toast('Sedang mengambil data kelompok rincian RKA dari sipd', {
         toastId: 'singkron_data',
         isLoading: true,
         progress: 0,
      })
      try {
         const { id_daerah, tahun, id_skpd, id_unit } = validateSipdSession(session)
         const kelompok = await getSubsRinciBlSubGiatBySkpdSipd({ id_daerah, id_unit, tahun })
         if (!kelompok.data.length) {
            throw new Error('Tidak ada daka kelompok')
         }
         toast.update('singkron_data', {
            render: `Proses singkron data kelompok`,
            progress: 0.1,
         })
         await processChunks({
            data: kelompok.data,
            action: syncKelompokRinciSbl,
            max: lengthData,
            schema: SubsRinciBlSubGiatUncheckedCreateInputSchema,
         })
         toast.update('singkron_data', {
            render: `Sedang Hapus data kelompok rincian rka yang tidak digunakan`,
            progress: 0.91,
         })
         await deleteSubsRinciBlSubGiatByListId({
            list_id_subs_sub_bl: kelompok.data?.map((d) => d.id_subs_sub_bl),
            operation: 'notIn',
            id_unit,
         })
         toast.success(`Berhasil singkron ${kelompok.recordsFilter} data kelompok rincian RKA`)
         toast.done('singkron_data')
         setIsLoading(false)
         return true
      } catch (error: any) {
         toast.error(error?.message || 'Gagal singkron data kelompok rincian RKA')
         toast.done('singkron_data')
         setIsLoading(false)
         return false
      }
   }
   return (
      <DialogConfirm
         action={action}
         disabledSubmit={!isValid}
         data_key={['bl_sub_giat_rinci_subs', 'bl_sub_giat_rinci']}
         header='Singkron Kelompok Rincian Belanja Sub Kegiatan'>
         <p className='border-warning rounded-small border p-1 text-center'>
            PERHATIAN!! <span className='font-normal'>Proses tidak dapat dibatalkan.</span>
         </p>
         <p className='text-small'>
            Data Kelompok Rincian RKA akan diganti dengan data dari SIPD-RI. Apakah anda yakin?
         </p>
         <MaxDataInput
            isReadOnly={isLoading}
            defaultValue={lengthData}
            onValidate={setIsValid}
            onValueChange={setLengthData}
         />
      </DialogConfirm>
   )
}
export default ModalSingkronKelompokRinciSbl

async function syncKelompokRinciSbl(
   kelompok: SubsRinciBlSubGiatUncheckedCreateInput[],
   n: number,
   p: number,
   l: number
) {
   await syncSubsRinciBlSubGiat(kelompok).catch((error) => {
      toast(error?.message ?? 'Gagal singkron data kelompok ', {
         autoClose: 3000,
         type: 'error',
         position: 'bottom-left',
      })
   })
   toast.update('singkron_data', {
      render: `Singkron data kelompok rincian ${n}/${l}`,
      progress: p * 0.8,
   })
}
