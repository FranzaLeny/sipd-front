'use client'

import { useCallback, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
   deleteRinciBlSubGiatByListId,
   getKetRinciBlSubGiatByIdsSipd,
   getListRinciBlSubGiatBySkpdSipd,
   getListRinciBlSubGiatSipd,
   getSubsRinciBlSubGiatByIdsSipd,
   syncKetRinciBlSubGiat,
   syncRinciBlSubGiat,
   syncSubsRinciBlSubGiat,
} from '@actions/perencanaan/rka/bl-rinci-sub-giat'
import { getAllSubBlAktif } from '@actions/perencanaan/rka/bl-sub-giat'
import { validateSipdSession } from '@actions/perencanaan/token-sipd'
import DialogConfirm from '@components/modal/dialog-confirm'
import JadwalInput from '@components/perencanaan/jadwal-anggaran'
import { MaxDataInput } from '@components/perencanaan/sync-input'
import { Checkbox } from '@nextui-org/react'
import { processChunks } from '@utils/hof'
import {
   KetRinciBlSubGiatUncheckedCreateInputSchema,
   RinciBlSubGiatUncheckedCreateInput,
   RinciBlSubGiatUncheckedCreateInputSchema,
   SubsRinciBlSubGiatUncheckedCreateInputSchema,
} from '@zod'
import { uniq } from 'lodash-es'
import { toast } from 'react-toastify'
import { useSession } from '@shared/hooks/use-session'

const ModalSingkronJadwal = () => {
   const searchParams = useSearchParams()
   const { data: session } = useSession()
   const [lengthData, setLengthData] = useState(100)
   const [isValid, setIsValid] = useState(true)
   const [isLoading, setIsLoading] = useState(false)
   const [jadwal, setJadwal] = useState<{
      id: string
      id_jadwal: number
      is_active: boolean
      id_jadwal_murni: number
   }>()
   const [jadwalMurni, setJadwalMurni] = useState<{ id: string }>()
   const [onlyPaguMurni, setOnlyPaguMurni] = useState(false)
   const jadwalInput = useRef<HTMLInputElement>(null)
   const subKegiatan = searchParams.get('subKegiatan') || undefined
   const action = useCallback(async () => {
      setIsLoading(true)
      toast('Sedang mengambil data rincian dari sipd', {
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
         const { id: jadwal_anggaran_id, id_jadwal, id_jadwal_murni } = jadwal
         const jadwal_anggaran_murni_id = jadwalMurni?.id
         const { id_daerah, id_skpd, id_unit, tahun } = validateSipdSession(session)
         return await singkronData({
            lengthData,
            id_daerah,
            id_skpd,
            id_unit,
            tahun,
            id_jadwal_murni,
            jadwal_anggaran_murni_id,
            jadwal_anggaran_id,
            id_jadwal,
            onlyPaguMurni,
            bl_sub_giat_id: subKegiatan,
         }).then((res) => {
            setIsLoading(false)
            return res
         })
      } catch (error: any) {
         toast.error(error?.message || 'Gagal singkron data rincian sub kegiatan')
         toast.done('singkron_data')
         setIsLoading(false)
         return false
      }
   }, [lengthData, session, isValid, jadwal, jadwalMurni, subKegiatan, onlyPaguMurni])

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
            selectedKey={jadwal?.id}
            onJadwalMurniChange={setJadwalMurni}
            isClearable={true}
            onChange={setJadwal}
            inputMode='text'
            shouldCloseOnBlur
            allowsCustomValue={false}
         />
         <MaxDataInput
            isReadOnly={isLoading}
            defaultValue={lengthData}
            onValidate={setIsValid}
            onValueChange={setLengthData}
         />
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
      </DialogConfirm>
   )
}
export default ModalSingkronJadwal

const onError = (err: any, progress: number, n: number) => {
   toast.error(`${err?.message ?? 'Gagal singkron data'}  KE- ${n}`)
}

async function singkronData(params: {
   lengthData: number
   id_daerah: number
   id_skpd: number
   id_unit: number
   tahun: number
   id_jadwal_murni: number
   id_jadwal: number
   jadwal_anggaran_id: string
   jadwal_anggaran_murni_id?: string
   bl_sub_giat_id?: string
   onlyPaguMurni?: boolean
}) {
   const {
      id_daerah,
      id_skpd,
      id_unit,
      lengthData,
      tahun,
      id_jadwal_murni,
      jadwal_anggaran_id,
      id_jadwal,
      jadwal_anggaran_murni_id,
      bl_sub_giat_id,
      onlyPaguMurni = false,
   } = params
   toast.update('singkron_data', {
      render: 'Chek jadwal aktif',
   })

   toast.update('singkron_data', {
      render: 'Ambil semuan data rincian dari sipd',
   })

   const data_rinci = await getListRinciBlSubGiatBySkpdSipd({ id_daerah, id_skpd, tahun }).catch(
      () => {
         throw new Error('Gagal mengambil data rincian dari sipd')
      }
   )

   if (!data_rinci.length) {
      throw new Error('Tidak ada data rincian')
   }
   const __id_subs_sub_bl_list = uniq(data_rinci.map((d) => d.id_subs_sub_bl))
   toast.update('singkron_data', {
      render: 'Ambil data kelompok rincian dari sipd',
   })
   const kelompok = await getSubsRinciBlSubGiatByIdsSipd({
      id_daerah,
      tahun,
      __id_subs_sub_bl_list,
   })

   toast.update('singkron_data', {
      render: 'Singkron kelompok data rincian dari sipd',
   })
   await processChunks({
      data: kelompok,
      action: singkronKelompok,
      max: lengthData,
      onError,
      schema: SubsRinciBlSubGiatUncheckedCreateInputSchema,
   })
   const __id_ket_sub_bl_list = uniq(data_rinci.map((d) => d.id_ket_sub_bl))
   toast.update('singkron_data', {
      render: 'Ambil data keterangan rincian dari sipd',
   })
   const keterangan = await getKetRinciBlSubGiatByIdsSipd({
      id_daerah,
      tahun,
      __id_ket_sub_bl_list,
   })
   toast.update('singkron_data', {
      render: 'Simpan data keterangan rincian dari sipd',
   })
   await processChunks({
      data: keterangan,
      action: singkronKeterangan,
      max: lengthData,
      onError,
      schema: KetRinciBlSubGiatUncheckedCreateInputSchema,
   })
   toast.update('singkron_data', {
      render: 'Ambil data sub kegiatan aktif',
      progress: 0.001,
   })
   const sub_giat_aktif = await getAllSubBlAktif({ id_unit, jadwal_anggaran_id }).then((res) => {
      let list = res.map((d) => {
         const { bl_sub_giat, ...other } = d
         return { ...other, bl_sub_giat_id: bl_sub_giat[0].id }
      })
      if (bl_sub_giat_id) {
         return list.filter((item) => item.bl_sub_giat_id === bl_sub_giat_id)
      }
      return list
   })
   const _all_rinci: RinciBlSubGiatUncheckedCreateInput[] = []
   let start = 0.1
   const _progress = 0.4 / sub_giat_aktif.length
   for await (const sub_giat of sub_giat_aktif) {
      const { id_sub_bl, bl_sub_giat_id: currId } = sub_giat

      const rinci = await getListRinciBlSubGiatSipd({
         id_daerah,
         id_sub_bl,
         id_unit,
         tahun,
         is_anggaran: 1,
      }).then((x) => {
         if (onlyPaguMurni) {
            return x?.filter((d) => !!d.koefisien_murni && !!d.total_harga_murni)
         }
         return x
      })
      toast.update('singkron_data', {
         render: `Chek data rincian sub kegiatan ${sub_giat.nama_sub_giat} dari sipd`,
         progress: _progress + start,
      })
      const data_murni = !jadwal_anggaran_murni_id
         ? {
              koefisien_murni: null,
              total_harga_murni: null,
              volume_murni: null,
              pajak_murni: null,
              harga_satuan_murni: null,
              jadwal_anggaran_murni_id: null,
           }
         : { jadwal_anggaran_murni_id }
      rinci?.map((r) => {
         const old = data_rinci.find((d) => d.id_rinci_sub_bl === r.id_rinci_sub_bl)
         if (!old) {
            return
         }
         let staticData: any = {}
         const { koefisien_murni } = r

         if (koefisien_murni && onlyPaguMurni) {
            const arr = koefisien_murni.split(' x ')
            let totalVolume = 0
            let pajak = 0
            staticData = arr
               .map((koef, i) => {
                  const [vol, ...satuan] = koef.split(' ')
                  if (!isNaN(Number(vol))) {
                     totalVolume = totalVolume ? totalVolume * Number(vol) : Number(vol)
                     return { [`vol_${i + 1}`]: Number(vol), [`sat_${i + 1}`]: satuan.join(' ') }
                  } else {
                     return { [`vol_${i + 1}`]: null, [`sat_${i + 1}`]: null }
                  }
               })
               .reduce(
                  (a, b) => (!!b ? { ...a, ...b } : a),
                  {} as Record<string, number | string | null>
               )
            const chekTotal = totalVolume * (r.harga_satuan_murni || 0)
            if (chekTotal < (r.total_harga_murni || 0)) {
               const selisih = (r.total_harga_murni || 0) - (chekTotal || 0)
               const percent = Math.round((selisih / chekTotal) * 100)
               if (percent === 11) {
                  pajak = 11
               }
            }
            staticData.total_harga = r.total_harga_murni || 0
            staticData.pajak = pajak
            staticData.koefisien = koefisien_murni
            staticData.volume = totalVolume
            staticData.harga_satuan = r.harga_satuan_murni
         }
         const ssh_locked = Number(r?.ssh_locked)
         _all_rinci.push({
            ...r,
            ...old,
            kode_bidang_urusan: sub_giat.kode_bidang_urusan,
            kode_program: sub_giat.kode_program,
            kode_giat: sub_giat.kode_giat,
            kode_sub_giat: sub_giat.kode_sub_giat,
            kode_urusan: sub_giat.kode_urusan,
            kode_skpd: sub_giat.kode_skpd,
            kode_sub_skpd: sub_giat.kode_sub_skpd,
            nama_sub_giat: sub_giat.nama_sub_giat,
            nama_bidang_urusan: sub_giat.nama_bidang_urusan,
            nama_urusan: sub_giat.nama_urusan,
            nama_program: sub_giat.nama_program,
            nama_giat: sub_giat.nama_giat,
            nama_skpd: sub_giat.nama_skpd,
            nama_sub_skpd: sub_giat.nama_sub_skpd,
            jadwal_anggaran_id,
            id_jadwal,
            ssh_locked: isNaN(ssh_locked) ? 0 : ssh_locked,
            vol_1: old?.vol_1 ?? null,
            vol_2: old?.vol_2 ?? null,
            vol_3: old?.vol_3 ?? null,
            vol_4: old?.vol_4 ?? null,
            sat_1: old?.sat_1 ?? null,
            sat_2: old?.sat_2 ?? null,
            sat_3: old?.sat_3 ?? null,
            sat_4: old?.sat_4 ?? null,
            volume: old?.volume ?? 0,
            bl_sub_giat_id: sub_giat.bl_sub_giat_id,
            id_jadwal_murni: old?.id_jadwal_murni ?? id_jadwal_murni,
            ...data_murni,
            ...staticData,
         })
      })

      start += _progress
   }
   const onSuccess = (res: any, progress: number, n: number) => {
      toast.update('singkron_data', {
         render: `${res?.data?.message ?? 'Berhasil singkron data'}  KE- ${n}`,
         progress: start + 0.4 * progress,
      })
   }

   await processChunks({
      data: _all_rinci,
      action: syncRinciBlSubGiat,
      max: lengthData,
      schema: RinciBlSubGiatUncheckedCreateInputSchema,
      onSuccess,
      onError,
   })
   await deleteRinciBlSubGiatByListId({
      id_unit,
      jadwal_anggaran_id,
      bl_sub_giat_id,
      list_id_unik_rinci_bl: _all_rinci?.map((d) => d.id_unik),
      operation: 'notIn',
   })
   toast.success(`Berhasil singkron ${_all_rinci.length} data rincian`)
   toast.done('singkron_data')
   return true
}

async function singkronKeterangan(
   ket: Zod.infer<typeof KetRinciBlSubGiatUncheckedCreateInputSchema>[],
   n: number
) {
   toast.update('singkron_data', {
      render: `Sedang Update data keterangan rincian rka ke-${n}`,
   })
   await syncKetRinciBlSubGiat(ket).then((res) => {
      toast(res?.message ?? 'Berhasil singkron data keterangan ' + ' ke-' + n, {
         autoClose: res.success ? 1000 : 3000,
         type: res.success ? 'success' : 'error',
         position: 'bottom-left',
      })
   })
}

async function singkronKelompok(
   kelompok: Zod.infer<typeof SubsRinciBlSubGiatUncheckedCreateInputSchema>[],
   n: number
) {
   toast.update('singkron_data', {
      render: `Sedang Update data kelompok rincian ke-${n}`,
   })
   syncSubsRinciBlSubGiat(kelompok).then((res) => {
      toast(res?.message ?? 'Berhasil singkron data kelompok ' + ' ke-' + n, {
         autoClose: res.success ? 1000 : 3000,
         type: res.success ? 'success' : 'error',
         position: 'bottom-left',
      })
   })
}
