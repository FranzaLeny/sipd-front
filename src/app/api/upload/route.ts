import { Readable } from 'stream'
import { NextRequest, NextResponse } from 'next/server'
import { getDownloadURL } from 'firebase-admin/storage'
import sharp from 'sharp'
import { getServerSession } from '@shared/server-actions/auth'
import { storage } from '@shared/server-actions/firebase'

export async function POST(req: NextRequest) {
   try {
      const formData = await req.formData()
      const { user: session } = await getServerSession()
      const file = formData.get('file') as Blob | null
      if (!file || !session) {
         return NextResponse.json({ error: 'File blob is required.' }, { status: 400 })
      }
      const buffer = Buffer.from(await file.arrayBuffer())
      const pngBuffer = await sharp(buffer)
         .resize({ withoutEnlargement: true, width: 300, withoutReduction: false })
         .png() // Konversi ke format PNG
         .toBuffer()
      const stream = Readable.from(pngBuffer)
      const nama_file = `images/profile/${session.id}.png`
      const destination = storage.bucket().file(nama_file, {})
      const uploadPromise = new Promise(function (resolve, reject) {
         const writeStream = destination.createWriteStream()
         writeStream.on('error', (error) => {
            reject(error)
         })
         writeStream.on('finish', () => {
            resolve('uploaded')
         })
         stream.pipe(writeStream)
      })
      await uploadPromise
      const path = await getDownloadURL(destination)
      return NextResponse.json(
         { success: true, data: { path }, message: 'berhasil upluoad file' },
         { status: 201 }
      )
   } catch (error: any) {
      return NextResponse.json(
         { success: false, message: error?.message ?? 'Error' },
         { status: 500 }
      )
   }
}
