'use client'

import { useEffect, useRef, useState } from 'react'

export default function TanggalInput({
   defaultValue,
   kode,
}: {
   defaultValue?: string
   kode?: string
}) {
   const [value, setValue] = useState('')
   const [width, setWidth] = useState(0)
   const span = useRef<HTMLDivElement>(null)

   useEffect(() => {
      const currDate = new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })
      let tanggal = defaultValue
      if (typeof window !== 'undefined') {
         const tanggalLokal = localStorage.getItem(`tanggal_${kode}`)
         if (tanggalLokal) {
            tanggal = tanggalLokal
         }
      }
      setValue(tanggal ?? currDate)
   }, [kode, defaultValue])

   useEffect(() => {
      if (span?.current) {
         setWidth(span.current.offsetWidth)
      }
      if (value && typeof window !== 'undefined') {
         const tanggalLokal = localStorage.getItem(`tanggal_${kode}`)
         tanggalLokal !== value && localStorage.setItem(`tanggal_${kode}`, value)
      }
   }, [value, kode])

   return (
      <>
         <div
            id='hide'
            ref={span}
            className='absolute inset-0 -z-50 w-fit bg-transparent text-transparent print:hidden'>
            {value}
         </div>
         <input
            style={{ width }}
            className='inline-flex bg-transparent'
            type='text'
            name={kode ?? 'tanggal'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
         />
      </>
   )
}
