'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import {
   getRakBlSubGiatSipdPeta,
   getRakSkpdSipdPeta,
   ResponseRakBlSubGiatSipdPeta,
   syncRakBlSkpd,
   syncRakBlSubGiat,
} from '@actions/penatausahaan/pengeluaran/rak'
import { getBlSubGiatByJadwalUnit } from '@actions/perencanaan/rka/bl-sub-giat'
import { validateSipdPetaSession } from '@actions/perencanaan/token-sipd'
import DialogConfirm from '@components/modal/dialog-confirm'
import { JadwalAnggaranPetaInput } from '@components/perencanaan/jadwal-anggaran'
import { MaxDataInput } from '@components/perencanaan/sync-input'
import { processChunks } from '@utils/hof'
import {
   RakSkpdUncheckedCreateInput,
   RakSkpdUncheckedCreateInputSchema,
   RakUncheckedCreateInput,
   RakUncheckedCreateInputSchema,
} from '@validations/keuangan/rak'
import { toast } from 'react-toastify'
import { useSession } from '@shared/hooks/use-session'

const ModalSingkron = () => {
   const { data: session } = useSession(['admin', 'super_admin', 'sipd_peta'])
   const [lengthData, setLengthData] = useState(100)
   const [jadwal, setJadwal] = useState<{
      id: string
      id_jadwal: number
      jadwal_murni: { id: string } | null
   }>()
   const [isValid, setIsValid] = useState(true)
   const [isLoading, setIsLoading] = useState(false)

   const maxInput = useRef<HTMLInputElement>(null)
   const jadwalInput = useRef<HTMLInputElement>(null)

   const action = useCallback(async () => {
      setIsLoading(true)
      toast('Sedang mengambil data jadwal dari sipd', { toastId: 'singkron_data', isLoading: true })
      try {
         if (!isValid) {
            throw new Error('Maksimal data tidak valid')
         }

         if (!jadwal) {
            jadwalInput?.current?.focus()
            throw new Error('Jadwal singkron kosong')
         }

         const { id_daerah, tahun, id_skpd, id_unit } = validateSipdPetaSession(session)
         const { dataRakSbl, dataRakSkpd } = await _getRakBlSkpdSipdPeta({
            id_skpd,
            id_unit,
            jadwal_anggaran_id: jadwal?.id,
            id_daerah,
            jadwal_anggaran_murni_id: jadwal?.jadwal_murni?.id,
            tahun,
         })
         await processChunks({
            data: dataRakSbl,
            action: syncRakBlSubGiat,
            max: lengthData,
            schema: RakUncheckedCreateInputSchema,
         })
         await processChunks({
            data: dataRakSkpd,
            action: syncRakBlSkpd,
            max: lengthData,
            schema: RakSkpdUncheckedCreateInputSchema,
         })
         setIsLoading(false)
         toast.update('singkron_data', {
            render: `Selesai singkron data jadwal anggaran penatausahaan`,
            isLoading: false,
            autoClose: 2000,
            type: 'info',
         })
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
   }, [session, jadwal, isValid, lengthData])

   const { id_daerah, tahun } = useMemo(() => {
      const id_daerah = session?.user?.accountPeta?.id_daerah || 0
      const tahun = session?.user?.tahun || 0
      return { id_daerah, tahun }
   }, [session?.user])

   return (
      <DialogConfirm
         action={action}
         disabledSubmit={!session?.user?.accountPeta}
         data_key={['rak', 'rak_skpd', 'penatausahan']}
         header='Singkron Jadwal Anggaran Penatausahaan'>
         <MaxDataInput
            isReadOnly={isLoading}
            ref={maxInput}
            defaultValue={lengthData}
            onValidate={setIsValid}
            onValueChange={setLengthData}
            autoFocus
            label='Per Request'
         />
         <JadwalAnggaranPetaInput
            defaultParams={{ id_daerah, tahun }}
            fullWidth
            isReadOnly={isLoading}
            ref={jadwalInput}
            isInvalid={!jadwalInput}
            isRequired
            selectedKey={jadwal?.id}
            isClearable={true}
            onChange={setJadwal}
         />
         <p className='border-warning rounded-small border p-1 text-center'>
            PERHATIAN!! <span className='font-semibold'>Proses membutuhkan waktu.</span>
         </p>
         <p className='text-small'>
            Data Jadwal Anggara Penatausahaan akan diganti dengan data dari SIPD-Penatausahaan.
            Apakah anda yakin?
         </p>
      </DialogConfirm>
   )
}

export default ModalSingkron

type BackUpRakBlSubGiatSipdPetaParams = {
   tahun?: number
   id_daerah?: number
   id_skpd: number
   id_unit: number
   jadwal_anggaran_id: string
   jadwal_anggaran_murni_id?: string
}

const _getRakBlSkpdSipdPeta = async (params: BackUpRakBlSubGiatSipdPetaParams) => {
   try {
      const { jadwal_anggaran_id, jadwal_anggaran_murni_id } = params
      toast.update('singkron_data', {
         render: `Sedang Mengambil Rak SKPD`,
      })
      const rakSkpd = await getRakSkpdSipdPeta({ page: 1, limit: 100 })
      const dataRakSkpd: RakSkpdUncheckedCreateInput[] = []
      const dataRakSbl: RakUncheckedCreateInput[] = []

      for await (const rak of rakSkpd) {
         const dataRak = {
            ...rak,
            jadwal_anggaran_id,
            jadwal_anggaran_murni_id: jadwal_anggaran_murni_id || null,
         }
         dataRakSkpd.push(dataRak)
         await _getRakBlSubGiatSipdPeta({
            ...params,
            id_daerah: rak.id_daerah,
            id_skpd: rak.id_skpd,
            tahun: rak.tahun,
         }).then((r) => dataRakSbl.push(...r))
      }
      return { dataRakSkpd, dataRakSbl }
   } catch (error: any) {
      throw new Error(error?.message ?? 'Gagal back up data rak')
   }
}

const _getRakBlSubGiatSipdPeta = async (params: BackUpRakBlSubGiatSipdPetaParams) => {
   try {
      const data: RakUncheckedCreateInput[] = []
      toast.update('singkron_data', {
         render: `Sedang Mengambil Sub Kegiatan`,
      })
      const subGiats = await getBlSubGiatByJadwalUnit(params)
      for await (const sbl of subGiats) {
         const {
            id: bl_sub_giat_id,
            bl_sub_giat_aktif_id,
            jadwal_anggaran_id,
            jadwal_anggaran_murni_id,
            id_bidang_urusan,
            id_giat,
            id_program,
            id_skpd,
            id_sub_giat,
            id_sub_skpd,
            id_unit,
            id_urusan,
            nama_sub_giat,
            nama_sub_skpd,
         } = sbl
         toast.update('singkron_data', {
            render: (
               <div>
                  <p>Cek data Sub Kegiatan:</p>
                  <p>{nama_sub_giat}</p>
                  <p>{nama_sub_skpd}</p>
               </div>
            ),
         })
         await getRakBlSubGiatSipdPeta({
            id_bidang_urusan,
            id_giat,
            id_program,
            id_skpd,
            id_sub_giat,
            id_sub_skpd,
            id_unit,
            id_urusan,
         }).then((res) =>
            res?.map((d) => {
               const temp = Object.keys(d)?.reduce((acc: any, curr) => {
                  if (isNaN(Number(curr))) {
                     acc[curr] = d[curr as keyof ResponseRakBlSubGiatSipdPeta]
                  } else {
                     acc[`bulan_${curr}`] = d[curr as keyof ResponseRakBlSubGiatSipdPeta]
                  }
                  return acc
               }, {})
               data.push({
                  ...temp,
                  bl_sub_giat_aktif_id,
                  jadwal_anggaran_id,
                  jadwal_anggaran_murni_id,
                  bl_sub_giat_id,
               })
            })
         )
      }
      return data
   } catch (error: any) {
      throw new Error(error?.message ?? 'Gagal back up data rak')
   }
}
