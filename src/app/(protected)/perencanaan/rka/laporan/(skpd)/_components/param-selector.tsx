'use client'

import { useCallback } from 'react'
import type { Route } from 'next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import JadwalInput from '@components/perencanaan/jadwal-anggaran'
import { SkpdSelect } from '@components/perencanaan/skpd'
import { toast } from 'react-toastify'

export default function ParamSelector({
   tahun,
   id_unit,
   id_daerah,
}: {
   tahun: string | number
   id_unit?: number
   id_daerah?: number
}) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const defaultJadwal = searchParams.get('jadwal_anggaran_id') ?? undefined
   const defaultTahun = searchParams.get('tahun') ?? tahun?.toString() ?? undefined
   const defaultSkpd = searchParams.get('id_skpd') ?? undefined
   const defaultUnit = searchParams.get('id_unit') ?? id_unit?.toString() ?? undefined
   const isPendapatan = pathname.endsWith('pendapatan')
   const handleParamsChange = useCallback(
      (params?: { jadwal_anggara_id?: string; id_unit?: number; id_skpd?: number }) => {
         if (!!!params) {
            toast.error('Parameter tidak ditemukan')
            return
         }

         const { id_skpd, id_unit, jadwal_anggara_id } = params
         const paramsFromObject = new URLSearchParams({})
         if (!!defaultTahun) {
            paramsFromObject.set('tahun', defaultTahun?.toString())
         }
         if (!!jadwal_anggara_id || !!defaultJadwal) {
            paramsFromObject.set(
               'jadwal_anggaran_id',
               jadwal_anggara_id?.toString() ?? defaultJadwal ?? ''
            )
         }
         if (!!id_unit || !!defaultUnit) {
            paramsFromObject.set('id_unit', id_unit?.toString() ?? defaultUnit?.toString() ?? '')
         }
         if (!!id_skpd) {
            id_skpd !== id_unit && paramsFromObject.set('id_skpd', id_skpd.toString())
         } else if (!!defaultSkpd && defaultSkpd !== defaultUnit) {
            paramsFromObject.set('id_skpd', defaultSkpd)
         }
         router.replace((pathname + '?' + paramsFromObject) as Route, { scroll: false })
      },
      [defaultJadwal, defaultSkpd, defaultTahun, defaultUnit, pathname, router]
   )

   return (
      <div className='content sticky left-0 '>
         <div className='bg-content1 rounded-medium flex min-w-full flex-col gap-4 p-2 shadow sm:p-4'>
            <SkpdSelect
               selectionKey='id_skpd'
               isInvalid={!defaultUnit}
               selectedKey={defaultSkpd ?? defaultUnit}
               params={{ id_unit: Number(defaultUnit ?? 0), tahun: Number(tahun ?? 0) }}
               onSkpdChange={handleParamsChange}
               labelPlacement='inside'
               label='Pilih Skpd'
               radius='md'
            />
            <JadwalInput
               selectedKey={defaultJadwal}
               onSelectionChange={(jadwal_anggara_id) => handleParamsChange({ jadwal_anggara_id })}
               label={`Pilih Jadwal ${isPendapatan ? 'Pendapatan' : 'Rincian Belanja'}`}
               isInvalid={!defaultJadwal}
               params={{
                  tahun: Number(tahun ?? 0),
                  id_daerah: Number(id_daerah ?? 0),
                  filter: isPendapatan ? 'has-pendapatan' : 'has-rincian',
               }}
            />
         </div>
      </div>
   )
}
