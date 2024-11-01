import { useMemo } from 'react'
import { getJadwalAnggaranAktif } from '@actions/perencanaan/rka/jadwal-anggaran'
import AkunSelector from '@components/perencanaan/akun'
import BlSubGiatSelector from '@components/perencanaan/bl-sub-giat'
import { useQuery } from '@tanstack/react-query'
import { useController, type Control } from 'react-hook-form'
import { useSession } from '@shared/hooks/use-session'

import type { PDinasInput } from './componet-form'

export const PendanaanPerjalananDinas = ({ control }: { control: Control<PDinasInput> }) => {
   const { data: session } = useSession()
   const user = useMemo(() => {
      if (!!session?.user) {
         const { id_daerah, tahun, id_unit, id_skpd } = session.user
         return { id_daerah, tahun, id_unit, id_skpd }
      }
   }, [session?.user])
   const { data: jadwal } = useQuery({
      queryKey: [{ tahun: user?.tahun, id_daerah: user?.id_daerah }, 'jadwal_anggaran'] as [
         GetJadwalAnggaranAktifParams,
         any,
      ],
      queryFn: ({ queryKey: [q] }) => getJadwalAnggaranAktif(q)?.then((d) => d.data),
      enabled: !!user,
   })

   const kodeSbl = useController({ name: 'kode_sbl', control })
   const namaSubGiat = useController({ name: 'nama_sub_giat', control })
   const kodeSubGiat = useController({ name: 'kode_sub_giat', control })
   const idSubBL = useController({ name: 'id_sub_bl', control })
   const unit = useController({ name: 'unit_kerja', control })

   const kodeAkun = useController({ name: 'kode_akun', control })
   const idAkun = useController({ name: 'id_akun', control })
   const namaAkun = useController({ name: 'nama_akun', control })

   const handleSubGiatSelect = (blsubGiat?: BlSubGiat) => {
      kodeSbl?.field?.onChange(blsubGiat?.kode_sbl)
      kodeSubGiat?.field?.onChange(blsubGiat?.kode_sub_giat)
      namaSubGiat?.field?.onChange(blsubGiat?.nama_sub_giat)
      idSubBL?.field?.onChange(blsubGiat?.id_sub_bl)
      unit?.field?.onChange(
         blsubGiat?.nama_sub_skpd ?? blsubGiat?.nama_skpd ?? blsubGiat?.nama_unit
      )
   }

   const handleAkunSelect = (akun?: Akun) => {
      kodeAkun?.field?.onChange(akun?.kode_akun)
      idAkun?.field?.onChange(akun?.id_akun)
      namaAkun?.field?.onChange(akun?.nama_akun)
   }
   const sblError =
      kodeSbl?.fieldState?.invalid ||
      namaSubGiat?.fieldState?.invalid ||
      idSubBL?.fieldState?.invalid ||
      unit?.fieldState?.invalid
   const akunError =
      kodeAkun?.fieldState?.invalid || idAkun?.fieldState?.invalid || namaAkun?.fieldState?.invalid
   return (
      <>
         {!!user && !!jadwal && (
            <>
               <BlSubGiatSelector
                  onChange={handleSubGiatSelect}
                  onBlur={kodeAkun?.field?.onBlur}
                  fieldKey='kode_sbl'
                  isRequired
                  ref={kodeAkun?.field?.ref}
                  errorMessage='Sub Kegiatan tidak seusai'
                  isInvalid={sblError}
                  // selectedKey={kodeSbl?.field?.value}
                  params={{ ...user, jadwal_anggaran_id: jadwal?.id!, hasPagu: 1 }}
               />
               <AkunSelector
                  isRequired
                  onChange={handleAkunSelect}
                  // selectedKey={idAkun?.field?.value}
                  isInvalid={akunError}
                  errorMessage='Akun tidak sesuai'
                  params={{ is_pdinas: 1, tahun: user?.tahun }}
               />
            </>
         )}
      </>
   )
}
