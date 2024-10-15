'use client'

import { useCallback, useState } from 'react'
import {
   Button,
   Dropdown,
   DropdownItem,
   DropdownMenu,
   DropdownTrigger,
   type Selection,
} from '@nextui-org/react'
import Docxtemplater from 'docxtemplater'
import { saveAs } from 'file-saver'
import { Settings } from 'lucide-react'
import PizZip from 'pizzip'
import { useSession } from '@shared/hooks/use-session'

let PizZipUtils: {
   getBinaryContent: (url: string, callback: (err: Error, data: string) => void) => void
} | null = null
if (typeof window !== 'undefined') {
   import('pizzip/utils/index.js').then(function (r: any) {
      PizZipUtils = r
   })
}

function loadFile(url: string, callback: (err: Error, data: string) => void) {
   PizZipUtils?.getBinaryContent(url, callback)
}

const DOKUMEN = [
   {
      kode: 'RDPPA',
      title: 'Rancangan Dokumen Pelaksanaan dan Perubahan Anggaran',
   },
   {
      kode: 'DPPA',
      title: 'Dokumen Pelaksanaan dan Perubahan Anggaran',
   },
   {
      title: 'Rencana Kerja dan Anggaran',
      kode: 'RKA',
   },
   {
      title: 'Rancangan Dokumen Pelaksanaan Anggaran',
      kode: 'RDPA',
   },
   {
      title: 'Rencana Kerja dan Perubahan Anggaran',
      kode: 'RKPA',
   },
]

const generateDocument = (docType: (typeof DOKUMEN)[number], tahun = 2024, pageSize = 'a4') => {
   const ulrA4 = '/tmp/cover/cover_a4_rka.docx'
   loadFile('/tmp/cover/cover_a4_rka.docx', function (error: any, content) {
      if (error) {
         throw error
      }
      const zip = new PizZip(content)
      const doc = new Docxtemplater(zip, {
         linebreaks: true,
         paragraphLoop: true,
      })
      doc.render({
         ...docType,
         tahun,
         skpd: 'DINAS LINGKUNGAN HIDUP',
      })
      const blob = doc.getZip().generate({
         type: 'blob',
         mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })
      // Output the document using Data-URI
      saveAs(blob, 'output.docx')
   })
}

export default function Home() {
   const session = useSession()
   const [jenisDoc, setJenisDoc] = useState<(typeof DOKUMEN)[number]>()
   const handleDockChange = (key: Selection) => {
      const keys = Array.from(key)
      console.log(key)
      if (typeof keys[0] === 'string') {
         const dok = DOKUMEN.find((d) => d.kode === keys[0])
         setJenisDoc(dok)
      }
   }

   const handleGenerateDoc = useCallback(() => {
      jenisDoc && generateDocument(jenisDoc, session?.data?.user?.tahun)
   }, [jenisDoc, session])

   return (
      <main>
         <div>
            <div>
               <Dropdown>
                  <DropdownTrigger>
                     <Button
                        variant='shadow'
                        color='secondary'
                        className='sm:rounded-medium min-w-10 rounded-full px-2 capitalize backdrop-blur-sm sm:min-w-20'
                        startContent={<Settings className='size-5' />}>
                        <span className='hidden sm:inline-flex'>
                           {jenisDoc?.title || 'Pilih Jenis Dokumen'}
                        </span>
                     </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                     selectionMode='single'
                     items={DOKUMEN}
                     onSelectionChange={handleDockChange}
                     selectedKeys={jenisDoc?.kode}
                     disabledKeys={jenisDoc?.kode}
                     aria-label='Jenis Dokumen'>
                     {(item) => <DropdownItem key={item.kode}>{item.title}</DropdownItem>}
                  </DropdownMenu>
               </Dropdown>
            </div>
            <Button onClick={handleGenerateDoc}>Generate document</Button>
         </div>
      </main>
   )
}
