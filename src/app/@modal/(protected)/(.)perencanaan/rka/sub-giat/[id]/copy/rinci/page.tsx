'use client'

import { useCallback, useRef, useState } from 'react'
import {
   getRinciSubGiatByBlSubgiatId,
   syncRinciBlSubGiat,
} from '@actions/perencanaan/rka/bl-rinci-sub-giat'
import { getBlSubGiatById } from '@actions/perencanaan/rka/bl-sub-giat'
import DialogConfirm from '@components/modal/dialog-confirm'
import JadwalInput from '@components/perencanaan/jadwal-anggaran'
import { MaxDataInput } from '@components/perencanaan/sync-input'
import { Checkbox } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { processChunks } from '@utils/hof'
import { BlSubGiat, RinciBlSubGiat, RinciBlSubGiatUncheckedCreateInputSchema } from '@zod'
import { toast } from 'react-toastify'

interface Props {
   params: Params
}

interface Params {
   id: string
}

const ModalSingkronJadwal = ({ params: { id } }: Props) => {
   const [lengthData, setLengthData] = useState(100)
   const [isValid, setIsValid] = useState(true)
   const [isLoading, setIsLoading] = useState(false)
   const [deleteVolume, setDeleteVolume] = useState(false)
   const [jadwal, setJadwal] = useState<{
      id: string
      id_jadwal: number
      is_active: boolean
      id_jadwal_murni: number
   }>()

   const jadwalInput = useRef<HTMLInputElement>(null)
   const { data } = useQuery({
      queryKey: [id, 'rinci_bl_sub_giat', 'perencanaan'],
      queryFn: async ({ queryKey: [subKegiatan] }) => {
         if (subKegiatan) {
            return await getRinciSubGiatByBlSubgiatId(subKegiatan)
         }
         return null
      },
   })
   const { data: currSubGiat } = useQuery({
      queryKey: [id, 'bl_sub_giat', 'perencanaan'],
      queryFn: async ({ queryKey: [subKegiatan] }) => {
         if (subKegiatan) {
            return await getBlSubGiatById(subKegiatan)
         }
         return null
      },
   })
   const { data: targetSubGiat } = useQuery({
      queryKey: [
         { jadwal_anggaran_id: jadwal?.id, id_unit: currSubGiat?.id_unit },
         currSubGiat?.id_unik,
         'bl_sub_giat',
         'perencanaan',
      ] as any,
      queryFn: async ({ queryKey: [uniq, idUnik] }) => {
         if (idUnik && uniq?.jadwal_anggaran_id && uniq?.id_unit) {
            return await getBlSubGiatById(idUnik, undefined, uniq)
         }
         return null
      },
   })
   const action = useCallback(async () => {
      setIsLoading(true)
      toast('Proses sedang berlangsung', { toastId: 'salin_data', isLoading: true })
      try {
         if (!data || !data?.length || !targetSubGiat || !currSubGiat) {
            throw new Error('Tak ada data rincian yang ingin disalin')
         }
         if (!isValid) {
            throw new Error('Maksimal data tidak valid')
         }

         return await singkronData({
            lengthData,
            targetSubgiat: targetSubGiat,
            data: data,
            deleteVolume,
         }).then((res) => {
            setIsLoading(false)
            return res
         })
      } catch (error: any) {
         toast.error(error?.message || 'Gagal singkron data rincian sub kegiatan')
         toast.done('salin_data')
         setIsLoading(false)
         return false
      }
   }, [lengthData, isValid, data, currSubGiat, targetSubGiat, deleteVolume])
   const disabledKeys = currSubGiat ? currSubGiat?.jadwal_anggaran_id ?? undefined : undefined
   return (
      <DialogConfirm
         action={action}
         data_key={['bl_sub_giat_rinci_ket', 'bl_sub_giat_rinci_subs', 'bl_sub_giat_rinci', 'rka']}
         header='Singkron Rincian Sub Kegiatan'>
         <p className='border-warning rounded-small border p-1 text-center'>
            PERHATIAN!! <span className='font-normal'>Proses tidak dapat dibatalkan.</span>
         </p>
         <p className='text-small'>
            Data Rincian RKA akan diganti dengan data dari SIPD-RI. Apakah anda yakin?
         </p>
         <JadwalInput
            isReadOnly={isLoading}
            fullWidth
            ref={jadwalInput}
            name='jadwal_murni'
            radius='sm'
            labelPlacement='inside'
            label='Jadwal'
            isInvalid={!jadwal}
            isRequired
            disabledKeys={disabledKeys}
            selectedKey={jadwal?.id}
            isClearable={true}
            onChange={setJadwal}
            inputMode='text'
            shouldCloseOnBlur
            allowsCustomValue={false}
         />
         <Checkbox
            isSelected={deleteVolume}
            onValueChange={setDeleteVolume}>
            Kosongkan Semua Volume
         </Checkbox>
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

const onError = (err: any, progress: number, n: number) => {
   toast.error(`${err?.message ?? 'Gagal singkron data'}  KE- ${n}`)
}

async function singkronData(params: {
   data: RinciBlSubGiat[]
   deleteVolume?: boolean
   targetSubgiat?: BlSubGiat
   lengthData: number
}) {
   const { targetSubgiat, data, lengthData, deleteVolume = false } = params

   const data_rinci = data?.map(
      ({ id, created_by, created_at, updated_at, updated_by, ...rinci }) => ({
         ...rinci,
         id_jadwal_murni: targetSubgiat?.id_jadwal_murni,
         jadwal_anggaran_id: targetSubgiat?.jadwal_anggaran_id,
         id_jadwal: targetSubgiat?.id_jadwal,
         jadwal_anggaran_murni_id: targetSubgiat?.jadwal_anggaran_murni_id,
         bl_sub_giat_id: targetSubgiat?.id,
         id_bl: targetSubgiat?.id_bl,
         id_sub_bl: targetSubgiat?.id_sub_bl,
         id_sub_giat: targetSubgiat?.id_sub_giat,
      })
   )
   data_rinci.forEach((rinci) => {
      if (rinci?.jadwal_anggaran_murni_id) {
         rinci.volume_murni = rinci.volume
         rinci.total_harga_murni = rinci.total_harga
         rinci.koefisien_murni = rinci.koefisien
         rinci.pajak_murni = rinci.pajak
         rinci.harga_satuan_murni = rinci.harga_satuan
      }
      if (deleteVolume) {
         rinci.vol_1 = null
         rinci.vol_2 = null
         rinci.vol_3 = null
         rinci.vol_4 = null
         rinci.sat_1 = null
         rinci.sat_2 = null
         rinci.sat_3 = null
         rinci.sat_4 = null
         rinci.harga_satuan = 0
         rinci.total_harga = 0
         rinci.koefisien = null
         rinci.pajak = 0
         rinci.volume = 0
      }
   })

   if (!data_rinci.length) {
      throw new Error('Tidak ada data rincian')
   }
   const onSuccess = (res: any, progress: number, n: number) => {
      toast.update('salin_data', {
         render: `${res?.data?.message ?? 'Berhasil singkron data'}  KE- ${n}`,
      })
   }
   await processChunks({
      data: data_rinci,
      action: syncRinciBlSubGiat,
      max: lengthData,
      schema: RinciBlSubGiatUncheckedCreateInputSchema,
      onSuccess,
      onError,
   })

   toast.success(`Berhasil singkron ${data.length} data rincian`)
   toast.done('salin_data')
   return true
}
