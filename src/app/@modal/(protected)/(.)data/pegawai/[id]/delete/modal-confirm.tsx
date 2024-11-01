'use client'

import { deletePegawai } from '@actions/data/pegawai'
import DialogConfirm from '@components/modal/dialog-confirm'
import { toast } from 'react-toastify'

type Props = {
   nama?: string
   id?: string
}

const ModalDeletePegawai = ({ pegawai }: { pegawai: Props }) => {
   const handleDelete = async () => {
      if (pegawai?.id) {
         return await deletePegawai(pegawai?.id)
            .then((res) => {
               toast(res?.message ?? 'Data pegawai berhasil dihapus', {
                  type: res?.success ? 'success' : 'error',
               })
               return true
            })
            .catch((e) => {
               toast.error(e?.message ?? 'Gagal hapus data pegawai')
               return false
            })
      } else {
         toast.error('Data pegawai tidak dapat dihapus')
         return false
      }
   }
   return (
      <DialogConfirm
         placement='top'
         title='Hapus Data Pegawai'
         data_key={['data_pegawai']}
         disabledSubmit={!!!pegawai.id}
         action={handleDelete}>
         {!!pegawai?.nama ? (
            <div>
               Apakah anda yakin ingin menghapus data{' '}
               <span className='font-bold'>{pegawai?.nama}</span>?
            </div>
         ) : (
            <div>Data pegaiwai ini tidak ditemukan</div>
         )}
      </DialogConfirm>
   )
}

export default ModalDeletePegawai
