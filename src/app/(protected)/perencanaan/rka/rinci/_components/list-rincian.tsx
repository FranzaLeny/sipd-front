import { Fragment } from 'react'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { compact } from 'lodash-es'
import { numberToText } from '@shared/utils'

import { RincianGrouped } from './template'

function RiciaActions({ id }: { id: string }) {
   return (
      <Dropdown
         size='sm'
         placement='bottom-end'>
         <DropdownTrigger>
            <Button
               className='print:hidden'
               size='sm'
               variant='bordered'>
               Pilihan
            </Button>
         </DropdownTrigger>
         <DropdownMenu aria-label='Static Actions'>
            <DropdownItem
               key='new'
               href={`rinci/${id}`}>
               Lihat
            </DropdownItem>
            <DropdownItem key='copy'>Copy link</DropdownItem>
            <DropdownItem key='edit'>Edit file</DropdownItem>
            <DropdownItem
               key='delete'
               className='text-danger'
               color='danger'>
               Delete file
            </DropdownItem>
         </DropdownMenu>
      </Dropdown>
   )
}
type PropsTrRinci = {
   data: SubGiatWithRinci['rincian'][number]
   isPerubahan: boolean
   canEdit: boolean
}

const TrRinci = ({ data, isPerubahan, canEdit = false }: PropsTrRinci) => {
   let koefisien = data.koefisien
   const decimal = koefisien?.match(/\d+\.\d+/g)
   if (decimal) {
      decimal.map((d) => {
         const val = numberToText(Number(d))
         koefisien = koefisien?.replace(d, val)
      })
   }
   let koefisien_murni = data.koefisien_murni
   if (koefisien_murni) {
      koefisien_murni = koefisien_murni
         .split(' x ')
         .map((koef) => {
            const value = koef.split(' ')
            return value[0]
         })
         .join(' x ')
   }
   const satuan = compact([data.sat_1, data.sat_2, data.sat_3, data.sat_4])?.join(' x ')
   const volume = compact([data.vol_1, data.vol_2, data.vol_3, data.vol_4])?.join(' x ')
   const volume_murni = isPerubahan
      ? compact([data.vol_1_murni, data.vol_2_murni, data.vol_3_murni, data.vol_4_murni])?.join(
           ' x '
        )
      : null

   const satuan_murni = isPerubahan
      ? compact([data.sat_1_murni, data.sat_2_murni, data.sat_3_murni, data.sat_4_murni])?.join(
           ' x '
        )
      : null
   const different = isPerubahan ? data.total_harga - (data.total_harga_murni || 0) : 0
   const totalVariationText = isPerubahan ? numberToText(different, 0, true) : null
   return (
      <tr className='print:break-inside-avoid'>
         <td className='cell-print w-0 text-center'>{canEdit && <RiciaActions id={data?.id} />}</td>
         <td className='cell-print'>
            <div>{data.nama_standar_harga ? data.nama_standar_harga : data.nama_akun}</div>
            {data.nama_standar_harga && (
               <div className='italic'>Spesifikasi: {data.spek ?? '-'}</div>
            )}
         </td>
         {isPerubahan ? (
            <>
               <td className='cell-print w-0'>
                  {!!volume_murni ? volume_murni : koefisien_murni || '-'}
               </td>
               <td className={`cell-print w-0 max-w-fit text-right`}>
                  {!!data.harga_satuan_murni ? numberToText(data.harga_satuan_murni) : '-'}
               </td>
               <td className='cell-print w-0'>{satuan_murni || '-'}</td>
               <td className={`cell-print w-0 max-w-fit text-right`}>
                  {!!data.pajak_murni
                     ? numberToText(((data.pajak_murni || 0) * data.harga_satuan_murni || 0) / 100)
                     : '-'}
               </td>
               <td className='cell-print w-0 max-w-fit text-right'>
                  {!!data.total_harga_murni ? numberToText(data.total_harga_murni) : '-'}
               </td>
            </>
         ) : null}
         <td className='cell-print w-0'>{volume || '-'}</td>
         <td className={`cell-print w-0 max-w-fit text-right`}>
            {!!volume ? numberToText(data.harga_satuan) : '-'}
         </td>
         <td className='cell-print w-0 max-w-fit'>{!!volume ? satuan : '-'}</td>
         <td className={`cell-print w-0 max-w-fit text-right`}>
            {!!volume && !!data.pajak ? numberToText((data.pajak * data.harga_satuan) / 100) : '-'}
         </td>
         <td className={`cell-print w-0 max-w-fit text-right`}>{numberToText(data.total_harga)}</td>
         {isPerubahan ? (
            <>
               <td
                  className={`cell-print w-0 max-w-fit text-right print:bg-transparent ${different < 0 ? 'bg-yellow-500/10' : 'bg-green-500/10'}`}>
                  {totalVariationText}
               </td>
            </>
         ) : null}
      </tr>
   )
}

const TrSubTotal = ({
   data,
   isPerubahan,
   printPreview,
}: {
   data: {
      kode: string | null | number
      name: string
      total: number
      dana?: string
      isKet?: boolean
      total_murni: number
   }
   isPerubahan?: boolean
   printPreview: boolean
}) => {
   const { kode, name, total, dana, isKet, total_murni } = data
   const isAkun = !dana && !isKet
   const displayKode = isAkun ? kode : ''
   const totalText = numberToText(total)
   const totalMurniText = isPerubahan ? numberToText(total_murni) : null
   const different = isPerubahan ? total - total_murni : 0
   const totalVariationText = isPerubahan ? numberToText(different, 0, true) : null

   return (
      <tr
         className={`group print:break-inside-avoid ${!printPreview && 'hidden print:table-row'} font-semibold`}>
         <td className='cell-print max-w-fit'>{displayKode}</td>
         <td
            colSpan={5}
            className='cell-print'>
            {dana ? (
               <div className='flex'>
                  <div className='flex w-5 flex-none items-start justify-between'>
                     <div>[</div>
                     <div>#</div>
                     <div>]</div>
                  </div>
                  <div className='flex-1 pl-0.5'>
                     <div>{name}</div>
                     <div className='text-xs italic'>{dana}</div>
                  </div>
               </div>
            ) : isKet ? (
               <div className='flex items-center'>
                  <div className='flex w-5 flex-none items-start justify-between'>
                     <div>[</div>
                     <div>-</div>
                     <div>]</div>
                  </div>
                  <div className='flex-1 pl-0.5'>{name}</div>
               </div>
            ) : (
               name
            )}
         </td>

         {isPerubahan && (
            <>
               <td className={`cell-print max-w-fit text-right`}>{totalMurniText}</td>
               <td
                  colSpan={4}
                  className='cell-print text-right'></td>
            </>
         )}
         <td className={`cell-print max-w-fit text-right`}>{totalText}</td>
         {isPerubahan && (
            <td
               className={`cell-print max-w-fit text-right print:bg-transparent ${different < 0 ? 'bg-yellow-500/10' : 'bg-green-500/10'}`}>
               {totalVariationText}
            </td>
         )}
      </tr>
   )
}

const ListRincian = ({
   data,
   isPerubahan,
   printPreview,
   canEdit = false,
}: {
   data: RincianGrouped[]
   isPerubahan: boolean
   printPreview: boolean
   canEdit: boolean
}) => {
   const renderItems = (dataList: RincianGrouped['list'], isPerubahan: boolean) => {
      return dataList.map((data, index) =>
         'name' in data ? (
            <Fragment key={index + '-' + data.kode}>
               <TrSubTotal
                  data={data}
                  isPerubahan={isPerubahan}
                  printPreview={printPreview}
               />

               {renderItems(data.list as RincianGrouped[], isPerubahan)}
            </Fragment>
         ) : (
            <TrRinci
               key={data.id_rinci_sub_bl}
               data={data}
               canEdit={canEdit}
               isPerubahan={isPerubahan}
            />
         )
      )
   }

   return renderItems(data, isPerubahan)
}

export default ListRincian
