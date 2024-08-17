'use client'

import { useState } from 'react'
import {
   deleteKetRinciBlSubGiatByListId,
   getKetRinciBlSubGiatBySkpdSipd,
   syncKetRinciBlSubGiat,
} from '@actions/perencanaan/rka/bl-rinci-sub-giat'
import { validateSipdSession } from '@actions/perencanaan/token-sipd'
import DialogConfirm from '@components/modal/dialog-confirm'
import { MaxDataInput } from '@components/perencanaan/sync-input'
import { processChunks } from '@utils/hof'
import { KetRinciBlSubGiatUncheckedCreateInputSchema } from '@zod'
import { toast } from 'react-toastify'
import { useSession } from '@shared/hooks/use-session'

const ModalSingkronJadwal = () => {
   const [lengthData, setLengthData] = useState(100)
   const [isValid, setIsValid] = useState(true)
   const [isLoading, setIsLoading] = useState(false)
   const { data: session } = useSession()
   const action = async () => {
      setIsLoading(true)
      toast('Sedang mengambil data keetrangan rincian RKA dari sipd', {
         toastId: 'singkron_data',
         isLoading: true,
      })
      try {
         const { id_daerah, id_unit, tahun } = validateSipdSession(session)
         const keterangan = await getKetRinciBlSubGiatBySkpdSipd({ id_daerah, id_unit, tahun })
         if (!keterangan.data.length) {
            throw new Error('Tidak ada daka keterangan')
         }
         toast.update('singkron_data', {
            render: `Sedang Singkron data keterangan rincian rka`,
            progress: 0.1,
         })
         await processChunks({
            data: keterangan.data,
            action: syncKeteranganRinciSbl,
            max: lengthData,
            schema: KetRinciBlSubGiatUncheckedCreateInputSchema,
         })
         toast.update('singkron_data', {
            render: `Sedang Hapus data keterangan rincian rka yang tidak digunakan`,
            progress: 0.91,
         })
         await deleteKetRinciBlSubGiatByListId({
            id_unit,
            list_id_ket_sub_bl: keterangan.data?.map((d) => d.id_ket_sub_bl),
            operation: 'notIn',
         })
         toast.update('singkron_data', {
            render: `Berhasil singkron ${keterangan.recordsFilter} data keterangan rincian RKA`,
            isLoading: false,
            autoClose: 2000,
            type: 'success',
         })
         setIsLoading(false)
         return true
      } catch (error: any) {
         toast.update('singkron_data', {
            render: error?.message || 'Gagal singkron data keterangan rincian RKA',
            isLoading: false,
            autoClose: 2000,
            type: 'error',
         })
         setIsLoading(false)
         return false
      }
   }
   return (
      <DialogConfirm
         action={action}
         disabledSubmit={!isValid}
         data_key={['bl_sub_giat_rinci_ket', 'bl_sub_giat_rinci']}
         header='Singkron Keterangan Rincian Belanja Sub Kegiatan'>
         <p className='border-warning rounded-small border p-1 text-center'>
            PERHATIAN!! <span className='font-normal'>Proses tidak dapat dibatalkan.</span>
         </p>
         <p className='text-small'>
            Data Keterangan Rincian RKA akan diganti dengan data dari SIPD-RI. Apakah anda yakin?
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
export default ModalSingkronJadwal

async function syncKeteranganRinciSbl(
   keterangan: KetRinciBlSubGiatUncheckedCreateInput[],
   n: number,
   p: number,
   l: number
) {
   await syncKetRinciBlSubGiat(keterangan).catch((error) => {
      toast(error?.message ?? 'Gagal singkron data keterangan ke' + n, {
         autoClose: 3000,
         type: 'error',
         position: 'bottom-left',
      })
   })
   toast.update('singkron_data', {
      render: `Singkron data keterangan rincian ${n}/${l}`,
      progress: p * 0.8,
   })
}
