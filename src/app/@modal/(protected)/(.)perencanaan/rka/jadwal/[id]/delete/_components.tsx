'use client'

import { deleteJadwalAnggaran } from '@actions/perencanaan/rka/jadwal-anggaran'
import DialogConfirm from '@components/modal/dialog-confirm'
import hasAccess from '@utils/chek-roles'
import { JadwalAnggaranSchema } from '@zod'
import { toast } from 'react-toastify'

const Schema = JadwalAnggaranSchema.pick({
   id: true,
   nama_sub_tahap: true,
   is_lokal: true,
   is_locked: true,
   id_daerah: true,
})

type Props = {
   jadwal: Zod.infer<typeof Schema>
   user: User
}

const ModalDelete = (props: Props) => {
   const { jadwal, user } = props
   const deleteJadwal = async () => {
      try {
         const { id, nama_sub_tahap } = Schema.parse(jadwal)
         return await deleteJadwalAnggaran(id).then((res) => {
            if (res?.success) {
               toast.success(res?.message + ' ' + res?.data?.nama_sub_tahap)
               return true
            } else {
               toast.error(res?.message + ' ' + nama_sub_tahap, { autoClose: 5000 })
               return false
            }
         })
      } catch (error: any) {
         toast.error(error?.message)
         return false
      }
   }
   const canDelete =
      hasAccess(['admin_perencanaan'], user?.roles) ||
      (!!jadwal &&
         !!user &&
         jadwal.id_daerah === user.id_daerah &&
         !!jadwal.is_lokal &&
         !!!jadwal.is_locked)
   return (
      <DialogConfirm
         action={canDelete ? deleteJadwal : undefined}
         disabledSubmit={!canDelete}
         data_key={['jadwal_anggaran']}
         header='Hapus data jadwal'>
         {canDelete ? (
            <>
               <p className='border-warning rounded-small border p-1 text-center'>
                  PERHATIAN!!{' '}
                  <span className='text-xs'>Data yang dihapus tidak dapat dikembalikan</span>
               </p>
               <p className='text-small'>
                  Jadwal {jadwal.nama_sub_tahap} akan dihapus!!! Apakah anda yakin?
               </p>
            </>
         ) : (
            <>
               <p className='px-3 pt-2 text-center'>
                  Jadwal {jadwal.nama_sub_tahap} tidak dapat dihapus
                  <span className='text-danger text-small text-center font-bold'>
                     {' '}
                     Hubungi admin jika harus dihapus!!
                  </span>
               </p>
            </>
         )}
      </DialogConfirm>
   )
}

export default ModalDelete
