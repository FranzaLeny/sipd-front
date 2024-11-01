import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { getStandarHargaById } from '@actions/perencanaan/data/standar-harga'
import { DiffForHumans } from '@components/ui/DiffForHumans'
import { cn } from '@nextui-org/react'
import { numberToText, snakeToTileCase } from '@shared/utils'
import { kelompokToTipe } from '@shared/utils/standar-harga'

const DialogShow = dynamic(() => import('@components/modal/dialog-show'), { ssr: false })

interface Props {
   params: Params
}

interface Params {
   id: string
}

const getLabel = (key: keyof StandarHargaById) => {
   switch (key) {
      case 'nama_standar_harga':
         return 'Komponen'
      case 'kode_kel_standar_harga':
         return 'Kode Kel'
      case 'nama_kel_standar_harga':
         return 'Nama Kel'
      case 'tipe_standar_harga':
         return 'Tipe'
      case 'kode_standar_harga':
         return 'Kode'
      case 'creator':
         return 'Dibuat'
      case 'modifier':
         return 'Diubah'
      case 'is_locked':
         return 'Dikunci'
      case 'is_pdn':
         return 'Produk DN'
      case 'is_sipd':
         return 'SIPD-RI'
      default:
         return snakeToTileCase(key)
   }
}
const diffForHumans = (value?: string | number | Date | null) => {
   return <DiffForHumans value={value} />
}
const getValue = (key: keyof StandarHargaById, standar_harga: StandarHargaById) => {
   let value = standar_harga[key]
   if (typeof value === undefined) {
      return null
   }
   switch (key) {
      case 'akun':
         return (
            <ul>
               {standar_harga?.akun?.map((akun) => (
                  <li key={akun.kode_akun}>
                     <span className='font-semibold'>{akun.kode_akun} </span> {akun.nama_akun}
                  </li>
               ))}
            </ul>
         )
      case 'is_locked':
         return value ? 'Ya' : 'Tidak'
      case 'is_pdn':
         return value ? 'Ya' : 'Tidak'
      case 'is_sipd':
         return value ? 'Ya' : 'Tidak'
      case 'harga':
         return 'Rp' + numberToText(value as StandarHargaById['harga'], 2)
      case 'nilai_tkdn':
         return numberToText(value as StandarHargaById['nilai_tkdn'], 2) + ' %'
      case 'kelompok':
         return kelompokToTipe(value as StandarHargaById['kelompok'])
      case 'creator':
         value = value as StandarHargaById['creator']
         return (
            <>
               <p>{value?.nama}</p>
               <p>{diffForHumans(standar_harga.created_at)}</p>
            </>
         )
      case 'modifier':
         value = value as StandarHargaById['creator']
         return (
            <>
               <p>{value?.nama}</p>
               <p>{diffForHumans(standar_harga.updated_at)}</p>
            </>
         )

      default:
         return String(value)
   }
}

const ModalViewStandarHarga = async ({ params: { id } }: Props) => {
   const standar_harga = await getStandarHargaById(id, { with_akun: true }).catch((e) => {
      return notFound()
   })

   const visible = [
      'kelompok',
      'nama_standar_harga',
      'harga',
      'satuan',
      'spek',
      'tahun',
      'nama_kel_standar_harga',
      'kode_standar_harga',
      'kode_kel_standar_harga',
      'is_locked',
      'is_pdn',
      'nilai_tkdn',
      'tipe_standar_harga',
      'is_sipd',
      'creator',
      'modifier',
      'akun',
   ]

   const data = visible?.reduce(
      (prev, key: string) => {
         const label = getLabel(key as keyof typeof standar_harga)
         const value = getValue(key as keyof typeof standar_harga, standar_harga)
         return [...prev, { label, value, key }]
      },
      [] as { label: string; key: string; value: React.ReactNode }[]
   )

   return (
      <DialogShow
         size='2xl'
         header='Detail Standar Harga'>
         <table>
            <tbody>
               {data?.map(({ key, label, value }) => (
                  <tr key={key}>
                     <td className='w-fit'>{label}</td>
                     <td className='px-2'>:</td>
                     <td
                        className={cn(
                           key == 'tipe_standar_harga' &&
                              'italic line-through decoration-red-500 decoration-double decoration-2',
                           (key === 'kelompok' || key === 'nama_standar_harga') && 'font-semibold'
                        )}>
                        {value}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </DialogShow>
   )
}

export default ModalViewStandarHarga
