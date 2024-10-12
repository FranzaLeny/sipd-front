'use client'

export const TheadMurni = ({
   tahun,
   showKet = false,
   akun,
}: {
   tahun: number
   showKet: boolean
   akun: ListAkunBlLaporanBlSkpd[]
}) => {
   const akunLength = akun?.length
   return (
      <thead className='font-bold'>
         <tr>
            <th
               rowSpan={3}
               className='cell-print text-vertical'>
               Urusan
            </th>
            <th
               rowSpan={3}
               className='cell-print text-vertical'>
               Bidang Urusan
            </th>
            <th
               rowSpan={3}
               className='cell-print text-vertical'>
               Program
            </th>
            <th
               rowSpan={3}
               className='cell-print text-vertical'>
               Kegiatan
            </th>
            <th
               rowSpan={3}
               className='cell-print text-vertical'>
               Sub Kegiatan
            </th>
            <th
               rowSpan={3}
               className='cell-print'>
               Uraian
            </th>
            <th
               rowSpan={3}
               className='cell-print'>
               Sumber Dana
            </th>
            <th
               rowSpan={3}
               className='cell-print'>
               Lokasi
            </th>
            <th
               colSpan={akunLength + 3}
               className='cell-print'>
               JUMLAH
            </th>
            {showKet && (
               <th
                  rowSpan={3}
                  className='cell-print print:hidden'>
                  KET
               </th>
            )}
         </tr>
         <tr>
            <th
               rowSpan={2}
               className='cell-print whitespace-pre-wrap'>
               Tahun {tahun - 1}
            </th>
            <th
               colSpan={5}
               className='cell-print'>
               Tahun {tahun}
            </th>
            <th
               rowSpan={2}
               className='cell-print'>
               Tahun {tahun + 1}
            </th>
         </tr>
         <tr>
            {akun?.map((item) => (
               <th
                  key={item?.kode_akun}
                  className='cell-print'>
                  {item?.nama_akun}
               </th>
            ))}

            <th className='cell-print'>Jumlah</th>
         </tr>
      </thead>
   )
}

export const RenderRincianMurni = ({
   item,
   showKet = false,
   akun,
}: {
   item: ItemLaporanBlSkpd
   showKet: boolean
   akun: ListAkunBlLaporanBlSkpd['kode_akun'][]
}) => {
   const { belanja } = item
   const chek = belanja?.total_harga - (item?.pagu || 0)
   const kode = item.kode
   const isSkpd = item?.group === 'sub_skpd'
   const isSubGiat = item?.group === 'sub_giat'
   const isJumlah = item?.group === 'jumlah'
   return (
      <tr
         className={`break-inside-avoid ${!isSubGiat && 'font-bold'} ${(isSkpd || isJumlah) && 'bg-foreground/5'}`}>
         {!(isSkpd || isJumlah) && (
            <>
               <td className='cell-print text-center'>{kode[0]}</td>
               <td className='cell-print text-center'>{kode[1]}</td>
               <td className='cell-print text-center'>{kode[2]}</td>
               <td className='cell-print text-center'>{kode[3]}</td>
               <td className='cell-print text-center'>{kode[4]}</td>
            </>
         )}
         <td
            colSpan={isSubGiat ? 1 : isJumlah || isSkpd ? 8 : 3}
            className={`cell-print ${isJumlah ? 'text-center' : ''}`}>
            {item.uraian}
         </td>
         {isSubGiat && (
            <>
               <td className='cell-print'>{item.nama_dana}</td>
               <td className='cell-print'>{item.lokasi}</td>
            </>
         )}
         <td className='cell-print text-right'>{item.pagu_n_lalu?.toLocaleString('id')}</td>
         {[...akun, 'total_harga']?.map((key) => (
            <td
               key={key + 'murni'}
               className='cell-print text-right'>
               {belanja[key]?.toLocaleString('id')}
            </td>
         ))}
         <td className='cell-print text-right'>{item.pagu_n_depan?.toLocaleString('id')}</td>
         {showKet && (
            <td className='cell-print text-center print:hidden'>
               <div>{chek === 0 ? '✓' : 'Ada Selsish Pagu: ' + chek?.toLocaleString('id')}</div>
            </td>
         )}
      </tr>
   )
}

export const TheadPerubahan = ({
   tahun,
   showKet = false,
   akun,
}: {
   tahun: number
   showKet: boolean
   akun: ListAkunBlLaporanBlSkpd[]
}) => {
   const totalAkun = akun.length
   return (
      <thead className='font-bold'>
         <tr>
            <th
               rowSpan={4}
               className='cell-print text-vertical'>
               Urusan
            </th>
            <th
               rowSpan={4}
               className='cell-print text-vertical'>
               Bidang Urusan
            </th>
            <th
               rowSpan={4}
               className='cell-print text-vertical'>
               Program
            </th>
            <th
               rowSpan={4}
               className='cell-print text-vertical'>
               Kegiatan
            </th>
            <th
               rowSpan={4}
               className='cell-print text-vertical'>
               Sub Kegiatan
            </th>
            <th
               rowSpan={4}
               className='cell-print'>
               Uraian
            </th>
            <th
               rowSpan={4}
               className='cell-print'>
               Sumber Dana
            </th>
            <th
               rowSpan={4}
               className='cell-print'>
               Lokasi
            </th>
            <th
               colSpan={totalAkun * 2 + 5}
               className='cell-print'>
               JUMLAH
            </th>
            {showKet && (
               <th
                  rowSpan={4}
                  className='cell-print print:hidden'>
                  KET
               </th>
            )}
         </tr>
         <tr>
            <th
               rowSpan={3}
               className='cell-print whitespace-pre-wrap'>
               Tahun {tahun - 1}
            </th>
            <th
               colSpan={11}
               className='cell-print'>
               Tahun {tahun}
            </th>
            <th
               rowSpan={3}
               className='cell-print'>
               Tahun {tahun + 1}
            </th>
         </tr>
         <tr>
            <th
               colSpan={totalAkun + 1}
               className='cell-print'>
               Sebelum
            </th>
            <th
               colSpan={totalAkun + 1}
               className='cell-print'>
               Sesudah
            </th>
            <th
               rowSpan={2}
               className='cell-print'>
               <div>Bertambah</div>
               <div>(Berkurang)</div>
            </th>
         </tr>
         <tr>
            {akun.map((item) => (
               <th
                  key={item?.kode_akun + 'murni'}
                  className='cell-print'>
                  {item?.nama_akun}
               </th>
            ))}
            <th className='cell-print'>Jumlah</th>
            {akun.map((item) => (
               <th
                  key={item?.kode_akun}
                  className='cell-print'>
                  {item?.nama_akun}
               </th>
            ))}
            <th className='cell-print'>Jumlah</th>
         </tr>
      </thead>
   )
}

export const RenderRincianPerubahan = ({
   item,
   showKet = false,
   akun,
}: {
   item: ItemLaporanBlSkpd
   showKet: boolean
   akun: ListAkunBlLaporanBlSkpd['kode_akun'][]
}) => {
   const { belanja_murni, belanja, selisih } = item

   const chek = belanja?.total_harga - (item?.pagu || 0)
   const kode = item.kode
   const isSkpd = item?.group === 'sub_skpd'
   const isSubGiat = item?.group === 'sub_giat'
   const isJumlah = item?.group === 'jumlah'
   return (
      <tr
         className={`break-inside-avoid ${!isSubGiat && 'font-bold'} ${(isSkpd || isJumlah) && 'bg-foreground/5'}`}>
         {!(isSkpd || isJumlah) && (
            <>
               <td className='cell-print text-center'>{kode[0]}</td>
               <td className='cell-print text-center'>{kode[1]}</td>
               <td className='cell-print text-center'>{kode[2]}</td>
               <td className='cell-print text-center'>{kode[3]}</td>
               <td className='cell-print text-center'>{kode[4]}</td>
            </>
         )}
         <td
            colSpan={isSubGiat ? 1 : isJumlah || isSkpd ? 8 : 3}
            className={`cell-print ${isJumlah ? 'text-center' : ''}`}>
            {item.uraian}
         </td>
         {isSubGiat && (
            <>
               <td className='cell-print'>{item.nama_dana}</td>
               <td className='cell-print'>{item.lokasi}</td>
            </>
         )}
         <td className='cell-print text-right'>{item.pagu_n_lalu?.toLocaleString('id')}</td>
         {[...akun, 'total_harga']?.map((key) => (
            <td
               key={key + 'murni'}
               className='cell-print text-right'>
               {belanja_murni[key]?.toLocaleString('id')}
            </td>
         ))}
         {[...akun, 'total_harga']?.map((key) => (
            <td
               key={key + 'sesudah'}
               className='cell-print text-right'>
               {belanja[key]?.toLocaleString('id')}
            </td>
         ))}

         {selisih < 0 ? (
            <td className='cell-print text-danger text-right print:text-black'>
               (<span>{(-selisih).toLocaleString('id')}</span>)
            </td>
         ) : (
            <td className='cell-print text-right'>{selisih.toLocaleString('id')}</td>
         )}
         <td className='cell-print text-right'>{item.pagu_n_depan?.toLocaleString('id')}</td>
         {showKet && (
            <td className='cell-print text-center print:hidden'>
               <div>{chek === 0 ? '✓' : 'Ada Selsish Pagu: ' + chek?.toLocaleString('id')}</div>
            </td>
         )}
      </tr>
   )
}
