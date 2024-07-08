'use client'

import { useCallback, useRef, useState } from 'react'
import {
   deleteBlGiatByListId,
   deleteCapaianBlGiatByListId,
   deleteHasilBlGiatByListId,
   deleteOutputBlGiatByListId,
   getDetailGiatSipd,
   syncCapaianBlGiat,
   syncDataGiat,
   syncHasilBlGiat,
   syncOutputBlGiat,
} from '@actions/perencanaan/rka/bl-giat'
import {
   deleteBlSubGiatAktifByListId,
   deleteBlSubGiatByListId,
   deleteDanaBlSubGiatByListId,
   deleteLabelBlSubGiatByListId,
   deleteLokasiBlSubGiatByListId,
   deleteOutputBlSubGiatByListId,
   deleteTagBlSubGiatByListId,
   getAllBlSubGiatSkpdSipd,
   getDetailSubGiatSipd,
   groupBlSubGiatAktifByGiat,
   syncBlSubGiat,
   syncDanaBlSubGiat,
   syncLabelSubGiat,
   syncLokasiSubGiat,
   syncOutputSubGiat,
   syncSubBlAktif,
   syncTagSubGiat,
} from '@actions/perencanaan/rka/bl-sub-giat'
import { validateSipdSession } from '@actions/perencanaan/token-sipd'
import DialogConfirm from '@components/modal/dialog-confirm'
import JadwalInput from '@components/perencanaan/jadwal-anggaran'
import { Checkbox } from '@nextui-org/react'
import { processChunks } from '@utils/hof'
import {
   BlGiatPayloadSchema,
   CapaianBlGiatUncheckedCreateInput,
   DanaBlSubGiatUncheckedCreateInput,
   HasilBlGiatUncheckedCreateInput,
   LabelBlSubGiatUncheckedCreateInput,
   LokasiBlSubGiatUncheckedCreateInput,
   OutputBlGiatUncheckedCreateInput,
   OutputBlSubGiatUncheckedCreateInput,
   SubGiatPayloadSchema,
   TagBlSubGiatUncheckedCreateInput,
} from '@zod'
import { toast } from 'react-toastify'
import { useSession } from '@shared/hooks/use-session'

const DATA_KEY = [
   'bl_sub_giat_aktif',
   'bl_sub_giat',
   'bl_giat',
   'bl_giat_hasil',
   'bl_giat_output',
   'bl_giat_capaian',
   'bl_sub_giat_dana',
   'bl_sub_giat_output',
   'bl_sub_giat_tag',
   'bl_sub_giat_label',
   'bl_sub_giat_lokasi',
   'rka',
]
const ModalSingkronJadwal = () => {
   const { data: session } = useSession()
   const [jadwal, setJadwal] = useState<{ id: string; id_jadwal: number; is_active: number }>()
   const [onlyPaguMurni, setOnlyPaguMurni] = useState(false)
   const [jadwalMurni, setJadwalMurni] = useState<{
      id: string
      id_jadwal: number
      nama_sub_tahap: string
   }>()
   const [isLoading, setIsLoading] = useState(false)
   const jadwalInput = useRef<HTMLInputElement>(null)

   const action = useCallback(async () => {
      setIsLoading(true)
      try {
         if (!jadwal) {
            jadwalInput?.current?.focus()
            throw new Error('Jadwal singkron kosong')
         }
         const { id: jadwal_anggaran_id, id_jadwal } = jadwal
         const jadwal_anggaran_murni_id = jadwalMurni?.id
         const nama_jadwal_murni = jadwalMurni?.nama_sub_tahap
         const id_jadwal_murni = jadwalMurni?.id_jadwal
         const { roles, ...userSipd } = validateSipdSession(session)
         return await syncDataSubKegiatan({
            userSipd,
            onlyPaguMurni,
            jadwal: {
               jadwal_anggaran_id,
               id_jadwal,
               jadwal_anggaran_murni_id,
               nama_jadwal_murni,
               id_jadwal_murni,
            },
         }).then((res) => {
            setIsLoading(false)
            return res
         })
      } catch (error: any) {
         setIsLoading(false)
         console.error(error)
         toast.error(error?.message || 'Gagal singkron data sub kegiatan', {
            autoClose: 3000,
         })
         toast.done('singkron_data')
         return false
      }
   }, [session, jadwal, jadwalMurni, onlyPaguMurni])

   return (
      <DialogConfirm
         action={action}
         disabledSubmit={!jadwal}
         data_key={DATA_KEY}
         header='Singkron Sub Kegiatan aktif'>
         <JadwalInput
            isReadOnly={isLoading}
            fullWidth
            ref={jadwalInput}
            isInvalid={!jadwal}
            isRequired
            selectedKey={jadwal?.id}
            onJadwalMurniChange={(v) => {
               v && setOnlyPaguMurni(false)
               setJadwalMurni(v)
            }}
            isClearable={true}
            onChange={setJadwal}
            inputMode='text'
            shouldCloseOnBlur
            allowsCustomValue={false}
         />

         <p className='border-warning rounded-small border p-1 text-center'>
            PERHATIAN!! <span className='font-normal'>Proses tidak dapat dibatalkan.</span>
         </p>
         <p className='text-small'>
            Data Sumber Dana, Label, Output, Capaian, Hasil, Lokasi dan Belanja Sub Kegiatan Aktif
            (Selain Rincian), akan diganti dengan data dari SIPD-RI. Apakah anda yakin?
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
      </DialogConfirm>
   )
}
export default ModalSingkronJadwal

interface UserSipd {
   id_skpd: number
   id_user: number
   id_daerah: number
   id_unit: number
   id_level: number
   id_prop: number
   is_prop: number
   tahun: number
}

const handleOnError = (error: any) => {
   toast.error(error.message ?? 'Terjadi kesalahan')
}

async function syncDataSubKegiatan({
   userSipd,
   jadwal,
   onlyPaguMurni = false,
}: {
   userSipd: UserSipd
   onlyPaguMurni: boolean
   jadwal: {
      jadwal_anggaran_id: string
      id_jadwal: number
      jadwal_anggaran_murni_id?: string
      id_jadwal_murni?: number
      nama_jadwal_murni?: string
   }
}) {
   toast('Mohon tunggu', { toastId: 'singkron_data', isLoading: true, progress: 0 })
   const { id_daerah, is_prop, id_skpd, id_unit, tahun } = userSipd
   toast.update('singkron_data', {
      render: 'Chek jadwal aktif',
      progress: 0.001,
   })
   if (!jadwal?.jadwal_anggaran_id || !jadwal?.id_jadwal) {
      throw new Error('Data Jadwal Tidak Valid')
   }
   const list_id_sub_bl: string[] = []
   const list_id_sub_bl_aktif: string[] = []
   const list_id_bl: string[] = []

   const capaianBl: CapaianBlGiatUncheckedCreateInput[] = []
   const outputBl: OutputBlGiatUncheckedCreateInput[] = []
   const hasilBl: HasilBlGiatUncheckedCreateInput[] = []

   // syncCapaianBlGiat,
   // syncHasilBlGiat,
   // syncOutputBlGiat,

   const outputSbl: OutputBlSubGiatUncheckedCreateInput[] = []
   const danaSbl: DanaBlSubGiatUncheckedCreateInput[] = []
   const tagSbl: TagBlSubGiatUncheckedCreateInput[] = []
   const labelSbl: LabelBlSubGiatUncheckedCreateInput[] = []
   const lokasiSbl: LokasiBlSubGiatUncheckedCreateInput[] = []

   toast.update('singkron_data', {
      render: 'Ambil sub kegiatan aktif dari sipd',
      progress: 0.01,
   })
   const { groupedByGiat, totalSub } = await groupBlSubGiatAktifByGiat({
      id_daerah,
      id_unit,
      is_prop,
      tahun,
      jadwal,
      onlyPaguMurni,
   })

   const allSubGiatSkpd = await getAllBlSubGiatSkpdSipd({ id_daerah, id_skpd, id_unit, tahun })
   let start = 0.02
   const _progress = (0.75 - 0.02) / totalSub
   for await (const _data of Object.keys(groupedByGiat)) {
      const nama_giat = groupedByGiat[_data][0]?.nama_giat
      const payload_giat = BlGiatPayloadSchema.parse(groupedByGiat[_data][0])
      toast.update('singkron_data', {
         render: `Proses sinkron kegiatan ${nama_giat}`,
         progress: start + _progress / 5,
      })
      const { id_bl, id: bl_giat_id } = await syncDataGiat({
         payload: payload_giat,
         bl_giat: groupedByGiat[_data][0],
      })
      if (!bl_giat_id) {
         throw new Error('Data Kegiatan Tidak Valid')
      }
      list_id_bl.push(bl_giat_id)
      toast.update('singkron_data', {
         render: `Proses sinkron detail kegiatan ${nama_giat}`,
         progress: start + _progress / 4,
      })
      const onError = (err: any) => toast.error(err?.message || 'Error')
      await getDetailGiatSipd({
         payload: payload_giat,
         id_bl,
         bl_giat_id,
         ...jadwal,
      })
         .then(({ capaianGiat, hasilGiat, outputGiat }) => {
            capaianBl.push(...capaianGiat)
            outputBl.push(...outputGiat)
            hasilBl.push(...hasilGiat)
         })
         .catch(onError)
      for (let sbl of groupedByGiat[_data]) {
         const subGiat = allSubGiatSkpd?.find(
            (s) =>
               s.id_sub_skpd === sbl.id_sub_skpd &&
               s.id_sub_bl === sbl.id_sub_bl &&
               s.id_sub_giat === sbl.id_sub_giat
         )
         if (!subGiat) {
            throw new Error('Data Sub Kegiatan tidak ditemukan pada List Sub Kegiatan SKPD')
         }
         const nama_sub = sbl.nama_sub_giat
         toast.update('singkron_data', {
            render: `Proses singkron sub kegiatan ${nama_sub}`,
            progress: start + _progress / 3,
         })

         const { id: bl_sub_giat_aktif_id } = await syncSubBlAktif({ ...sbl, bl_giat_id })
         if (!bl_sub_giat_aktif_id) {
            throw new Error('Data Sub Kegiatan Aktif Tidak Valid')
         }
         list_id_sub_bl_aktif.push(bl_sub_giat_aktif_id)
         let payload = SubGiatPayloadSchema.parse({
            payload: { ...sbl, is_anggaran: 1 },
            ...sbl,
            bl_giat_id,
            id_bl,
            bl_sub_giat_aktif_id,
         })
         const { id: bl_sub_giat_id } = await syncBlSubGiat({
            ...payload,
            subGiat,
            staticData: onlyPaguMurni
               ? { pagu: sbl.pagu, pagu_indikatif: sbl.pagu_indikatif, pagu_murni: null }
               : { pagu_murni: sbl.pagu_murni },
         })
         if (!bl_sub_giat_id) {
            throw new Error('Data Sub Kegiatan Tidak Valid')
         }
         list_id_sub_bl.push(bl_sub_giat_id)
         toast.update('singkron_data', {
            render: `Proses singkron detail sub kegiatan ${nama_sub}`,
            progress: start + _progress / 2,
         })
         const { danaBlSubGiat, labelBlSubGiat, lokasiBlSubGiat, outputBlSubGiat, tagBlSubGiat } =
            await getDetailSubGiatSipd({ ...payload, bl_sub_giat_id })
         tagSbl.push(...tagBlSubGiat)
         danaSbl.push(...danaBlSubGiat)
         labelSbl.push(...labelBlSubGiat)
         lokasiSbl.push(...lokasiBlSubGiat)
         outputSbl.push(...outputBlSubGiat)

         start += _progress
      }
   }
   toast.update('singkron_data', {
      render: 'Sedang hapus data lama',
      progress: 0.76,
   })

   await processChunks({
      action: syncCapaianBlGiat,
      data: capaianBl,
      max: 500,
      onError: handleOnError,
   })
   await processChunks({
      action: syncOutputBlGiat,
      data: outputBl,
      max: 500,
      onError: handleOnError,
   })
   await processChunks({
      action: syncHasilBlGiat,
      data: hasilBl,
      max: 500,
      onError: handleOnError,
   })
   await processChunks({
      action: syncDanaBlSubGiat,
      data: danaSbl,
      max: 500,
      onError: handleOnError,
   })

   await processChunks({
      action: syncTagSubGiat,
      data: tagSbl,
      max: 500,
      onError: handleOnError,
   })
   await processChunks({
      action: syncLabelSubGiat,
      data: labelSbl,
      max: 500,
      onError: handleOnError,
   })
   await processChunks({
      action: syncLokasiSubGiat,
      data: lokasiSbl,
      max: 500,
      onError: handleOnError,
   })
   await processChunks({
      action: syncOutputSubGiat,
      data: outputSbl,
      max: 500,
      onError: handleOnError,
   })

   await deleteOldData({
      jadwal_anggaran_id: jadwal.jadwal_anggaran_id,
      id_unit,
      list_id_bl: [...new Set(list_id_bl)],
      list_id_sub_bl: [...new Set(list_id_sub_bl)],
      list_id_sub_bl_aktif: [...new Set(list_id_sub_bl_aktif)],
      list_id_capaian_bl: capaianBl.map(({ id_capaian_bl }) => id_capaian_bl),
      list_id_hasil_bl: hasilBl.map(({ id_hasil_bl }) => id_hasil_bl),
      list_id_output_giat: outputBl.map(({ id_output_giat }) => id_output_giat),
      list_id_output_bl: outputSbl.map(({ id_output_bl }) => id_output_bl),
      list_id_dana_sub_bl: danaSbl.map(({ id_dana_sub_bl }) => id_dana_sub_bl),
      list_id_label_bl: labelSbl.map(({ id_label_bl }) => id_label_bl),
      list_id_detil_lokasi: lokasiSbl.map(({ id_detil_lokasi }) => id_detil_lokasi),
      list_id_tag_bl: tagSbl.map(({ id_tag_bl }) => id_tag_bl),
   })
   toast.update('singkron_data', {
      render: 'Selesai singkron data sub kegiatan',
      progress: 0.999,
   })
   toast.done('singkron_data')
   return true
}

interface DeleteOldDataParams {
   id_unit: number
   jadwal_anggaran_id: string
   list_id_bl: string[]
   list_id_capaian_bl: number[]
   list_id_hasil_bl: number[]
   list_id_output_giat: number[]
   list_id_sub_bl_aktif: string[]
   list_id_sub_bl: string[]
   list_id_output_bl: number[]
   list_id_dana_sub_bl: number[]
   list_id_label_bl: number[]
   list_id_detil_lokasi: number[]
   list_id_tag_bl: number[]
}

async function deleteOldData(params: DeleteOldDataParams) {
   const {
      list_id_bl,
      list_id_capaian_bl,
      list_id_hasil_bl,
      list_id_output_giat,
      list_id_sub_bl_aktif,
      list_id_sub_bl,
      list_id_output_bl,
      list_id_dana_sub_bl,
      list_id_label_bl,
      list_id_detil_lokasi,
      list_id_tag_bl,
      ...other
   } = params
   const operation: 'notIn' = 'notIn'
   return await Promise.all([
      deleteBlGiatByListId({ ...other, list_id: list_id_bl, operation }),
      deleteCapaianBlGiatByListId({
         ...other,
         list_id_capaian_bl,
         operation,
      }),
      deleteHasilBlGiatByListId({
         ...other,
         list_id_hasil_bl,
         operation,
      }),
      deleteOutputBlGiatByListId({
         ...other,
         list_id_output_giat,
         operation,
      }),
      deleteBlSubGiatAktifByListId({
         ...other,
         list_id: list_id_sub_bl_aktif,
         operation,
      }),
      deleteBlSubGiatByListId({
         ...other,
         list_id: list_id_sub_bl,
         operation,
      }),
      deleteOutputBlSubGiatByListId({
         ...other,
         list_id_output_bl,
         operation,
      }),
      deleteDanaBlSubGiatByListId({
         ...other,
         list_id_dana_sub_bl,
         operation,
      }),
      deleteLabelBlSubGiatByListId({
         ...other,
         list_id_label_bl,
         operation,
      }),
      deleteLokasiBlSubGiatByListId({
         ...other,
         list_id_detil_lokasi,
         operation,
      }),
      deleteTagBlSubGiatByListId({
         ...other,
         list_id_tag_bl,
         operation,
      }),
   ])
}
