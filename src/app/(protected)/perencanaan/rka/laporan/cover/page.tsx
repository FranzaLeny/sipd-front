'use client'

import Docxtemplater from 'docxtemplater'
import { saveAs } from 'file-saver'
import PizZip from 'pizzip'

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
      title: 'Rancangan Dokumen Pelaksanaan Perubahan Anggaran',
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

const generateDocument = () => {
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
         ...DOKUMEN[0],
         tahun: 2024,
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
   return (
      <main>
         <div>
            <div>
               <h1> Test Docxtemplater</h1>
            </div>
            <button onClick={generateDocument}>Generate document</button>
            <p>Click the button above to generate a document using NextJS</p>
            <p>
               You can edit the data in your code in this example. In your app, the data would come
               from your database for example.
            </p>
         </div>
      </main>
   )
}
