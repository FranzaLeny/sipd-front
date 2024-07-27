'use client'

import { useCallback } from 'react'
import { Metadata } from 'next'
import { mappingAkunStandarHarga, StandarHargaById } from '@actions/perencanaan/data/standar-harga'
import DialogConfirm from '@components/modal/dialog-confirm'
import { toast } from 'react-toastify'

export const metadata: Metadata = {
   title: 'Mapping Akun',
}

interface Props {
   standar_harga: StandarHargaById
}

const MappingAkun = ({ standar_harga }: Props) => {
   const action = useCallback(async () => {
      toast('Sedang mengambil data standar harga dari sipd', {
         toastId: 'singkron_data',
         isLoading: true,
      })
      try {
         const res = await mappingAkunStandarHarga({
            id: standar_harga.id,
            id_standar_harga: standar_harga.id_standar_harga,
            kelompok: standar_harga.kelompok,
            kode_standar_harga: standar_harga.kode_standar_harga,
            tahun: standar_harga.tahun,
            id_daerah: standar_harga.id_daerah,
         })
         toast.update('singkron_data', {
            render: res.data?.message ?? 'Berhasil mapping akun standar harga',
            isLoading: false,
            autoClose: 2000,
            type: res.success ? 'success' : 'error',
         })
         return !!res?.success
      } catch (error: any) {
         toast.update('singkron_data', {
            render: error?.message || 'Gagal mapping akun standar harga',
            isLoading: false,
            autoClose: 2000,
            type: 'error',
         })
         return false
      }
   }, [standar_harga])
   return (
      <DialogConfirm
         action={action}
         data_key={['data_standar_harga']}
         header='Singkron akun standar harga'>
         <p className='border-warning rounded-small border p-1 text-center'>
            PERHATIAN!! <span className='font-normal'>Proses tidak dapat dibatalkan.</span>
         </p>
         <p className='text-small'>
            Data Akun Standar Harga akan diganti dengan data dari SIPD-RI. Apakah anda yakin?
         </p>
      </DialogConfirm>
   )
}
export default MappingAkun
