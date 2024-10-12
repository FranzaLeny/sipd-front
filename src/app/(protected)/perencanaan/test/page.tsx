'use client'

import { useCallback } from 'react'
import {
   deleteRinciBlSubGiatBySkpdSipd,
   getListRinciBlSubGiatBySkpdSipd,
} from '@actions/perencanaan/rka/bl-rinci-sub-giat'
import { Button } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useSession } from '@shared/hooks/use-session'

export default function Page() {
   const session = useSession(['sipd_ri'])
   const { data, isFetching, refetch } = useQuery({
      queryKey: ['test'],
      queryFn: () => {
         return getListRinciBlSubGiatBySkpdSipd({ id_daerah: 424, id_skpd: 1871, tahun: 2025 })
      },
      placeholderData: (pref) => pref,
   })
   // useEffect(() => {
   //    if (session?.data?.user?.id) {
   //       console.log(session?.data?.user?.id)

   //       getListRinciBlSubGiatBySkpdSipd({ id_daerah: 424, id_skpd: 1871, tahun: 2024 }).then(
   //          (data) => setData(data)
   //       )
   //    }
   // }, [session?.data?.user?.id])

   const deleteData = useCallback(
      async (item: RinciBlSubGiatSipd) => {
         const newDatas = data

         if (!item?.id_rinci_sub_bl || !item?.id_daerah || !item?.id_skpd) {
            toast.error('Data tidak dapat di hapus')
         } else {
            const newData = newDatas?.filter(
               (d) =>
                  d.id_sub_bl === item.id_sub_bl &&
                  d.id_giat === item.id_giat &&
                  d.id_sub_giat === item.id_sub_giat &&
                  d.id_program === item.id_program &&
                  d.id_skpd === item.id_skpd
            )
            if (!newData?.length) {
               toast.error('Data sudah dihapus semua')
               return
            }
            for await (const element of newData) {
               if (
                  element?.id_daerah === 424 &&
                  element?.id_skpd === 1871 &&
                  element?.tahun === 2025
               ) {
                  const payload: DeleteRinciBlSubGiatSipdPayload = {
                     id_rinci_sub_bl: element?.id_rinci_sub_bl,
                     id_daerah: 424,
                     tahun: 2025,
                     id_daerah_log: 424,
                     id_user_log: 35709,
                     aktivitas: 'delete',
                     kunci_bl_rinci: 3,
                  }
                  await deleteRinciBlSubGiatBySkpdSipd(payload)
                     .then((res) => {
                        toast.success(res?.message ?? 'Berhasil', { autoClose: 500 })
                     })
                     .catch((err) => {
                        toast.error(element?.nama_standar_harga + ' ' + 'GAGAL DIHAPUS')
                     })
               } else {
                  toast.info('Data tidak terhapus')
               }
            }
            refetch()
            toast.info('selesai')
         }
      },
      [data, refetch]
   )
   return (
      <div className='content'>
         <div className='space-y-2'>
            {data?.map((d) => (
               <div
                  className='intem-center flex justify-between border p-2'
                  key={d.id_rinci_sub_bl}>
                  <div className='flex-1'>
                     <p className='text-sm'>
                        {d.id_rinci_sub_bl} || {d.nama_skpd}
                     </p>
                     <p>
                        {d.nama_program} || {d.nama_giat} || {d.nama_sub_giat}
                     </p>
                     <div>
                        {d.nama_akun} || {d.nama_standar_harga} ||{d.id_daerah} || {d.id_skpd}
                     </div>
                  </div>
                  <div className='flex-none'>
                     <Button
                        color='danger'
                        onPress={() => deleteData(d)}>
                        HAPUS
                     </Button>
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}
