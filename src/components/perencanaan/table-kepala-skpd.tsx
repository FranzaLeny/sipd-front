'use client'

import { useEffect, useState } from 'react'
import { cn } from '@nextui-org/react'

interface Props {
   nama_ibu_kota?: string | null
   nama_kepala?: string | null
   nip_kepala?: string | null
   pangkat_kepala?: string | null
   nama_jabatan_kepala?: string | null
   className?: string
   classNameSpace?: string
}

export default function TableKepalaSkpd({
   nama_jabatan_kepala = 'Kepala Dinas',
   nama_kepala = 'Nama Kepala Dinas',
   nip_kepala = '00000000 000000 00 000',
   pangkat_kepala,
   nama_ibu_kota = 'Lewoleba',
   className = '',
   classNameSpace = '',
}: Props) {
   const dateValue =
      nama_ibu_kota + ', ' + new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })
   const [value, setvalue] = useState(dateValue)
   useEffect(() => {
      const savedValue = localStorage.getItem('tanggal_rka')
      if (savedValue) {
         setvalue(savedValue)
      }
   }, [])
   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setvalue(value)
      localStorage.setItem('tanggal_rka', value)
   }
   return (
      <table className={cn(`min-w-full break-inside-avoid text-center`, className)}>
         <tbody>
            <tr>
               <td className='w-1/2 px-5'></td>
               <td className='w-1/2 px-5 py-2 text-center leading-tight'>
                  <div>
                     <input
                        className='w-full bg-transparent text-center'
                        type='text'
                        onChange={handleDateChange}
                        value={value}
                     />
                  </div>
                  <div className='font-bold'>{nama_jabatan_kepala}</div>
                  <div className={cn('h-14', classNameSpace)}></div>
                  <div className='font-bold underline'>{nama_kepala}</div>
                  {pangkat_kepala && <div>{pangkat_kepala}</div>}
                  <div>Nip. {nip_kepala}</div>
               </td>
            </tr>
         </tbody>
      </table>
   )
}
