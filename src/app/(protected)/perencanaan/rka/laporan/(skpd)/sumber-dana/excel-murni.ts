import {
   borderAll,
   createExcelData,
   fontStyle,
   numberToColumn,
   numStyle,
   textStyle,
} from '@utils/excel'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'
import { RekapanSumberDana } from '@/types/api/laporan'

function formatDokumen(ws: Excel.Worksheet, lengthBl: number) {
   const columnsBl =
      !!lengthBl && lengthBl > 0
         ? [...Array(lengthBl)]?.map((_, i) => {
              return {
                 key: `bl_${i + 1}`,
                 width: 10.29,
                 style: numStyle,
              }
           })
         : []
   ws.columns = [
      { key: 'kode', width: 20.29, style: textStyle },
      { key: 'uraian', width: 40.29, style: textStyle },
      { key: 'pagu', width: 40.29, style: numStyle },
      ...columnsBl,
      { key: 'total', width: 10.29, style: numStyle },
      { key: 'selisih', width: 10.29, style: numStyle },
      { key: 'ket', width: 10.29, style: numStyle },
      { key: 'rak', width: 10.29, style: numStyle },
      { key: 'realisasi', width: 10.29, style: numStyle },
   ]
   ws.views = [{ showGridLines: false }]
}

interface Props {
   sumberDana: RekapanSumberDana['sumber_dana']
   skpd: RekapanSumberDana['skpd']['unit']
   tahun: number
   documentTitle: string
}

const dowloadDanaExcel = async (data: Props) => {
   const wb = new Excel.Workbook()
   let namaFile = data?.documentTitle
   await createSheet(data, wb)
   wb.creator = 'FXIL'
   const buf = await wb.xlsx.writeBuffer()
   saveAs(new Blob([buf]), `${namaFile.replace(/[^\w\s]|(?!\S)\s+/g, ' ')}.xlsx`)
}

const createSheet = async (data: Props, wb: Excel.Workbook) => {
   const { documentTitle, skpd, sumberDana, tahun } = data
   const lengthBl = sumberDana[0]?.belanja?.length || 0
   const listDana = sumberDana[0]?.belanja?.map((b) => b?.nama_dana)
   const sheet_name = 'Rekap Dana'
   let footer = documentTitle
   if (footer.length > 100) {
      footer = footer.substring(0, 97) + '...'
   }
   function generateSubTotal({
      level,
      index,
      nextRow,
      col,
   }: {
      level: number
      index: number
      nextRow: number
      col: string
   }) {
      const lastIndex = sumberDana.findIndex((d, i) => i > index && d.level <= level)
      const endRow = lastIndex === -1 ? lastRow : starRow + lastIndex
      return `=SUBTOTAL(9,${col}${nextRow}:${col}${endRow})`
   }

   const ws = wb.addWorksheet(sheet_name?.substring(0, 30))

   formatDokumen(ws, lengthBl)
   // fillDokJudul({ ws, dokumen, tahun: subGiat?.tahun })
   const starRow = fillTableHead({ ws, listDana })
   let lastRow = starRow + sumberDana.length - 1
   for (let [index, rinci] of sumberDana.entries()) {
      const nextRow = starRow + index + 2
      const currRow = starRow + index + 1
      const { belanja, group, kode, pagu, uraian, total_harga, level, nilai_rak, nilai_realisasi } =
         rinci
      const isAkun = group === 'akun'
      const isTotal = group === 'jumlah'
      const colPagu = numberToColumn(3)
      const colStartBl = numberToColumn(4)
      const colLastBl = numberToColumn(3 + belanja.length)
      const colTotal = numberToColumn(4 + belanja.length)
      const colKet = numberToColumn(5 + belanja.length)
      const colRak = numberToColumn(7 + belanja.length)
      const colRealsasi = numberToColumn(8 + belanja.length)
      const total = isAkun
         ? `=SUM(${colStartBl}${currRow}:${colLastBl}${currRow})`
         : isTotal
           ? `=SUBTOTAL(9,${colTotal}${starRow + 1}:${colTotal}${lastRow})`
           : generateSubTotal({ level, index, nextRow, col: colTotal })
      const rak = isAkun
         ? nilai_rak
         : isTotal
           ? { formula: `=SUBTOTAL(9,${colRak}${starRow + 1}:${colRak}${lastRow})` }
           : { formula: generateSubTotal({ level, index, nextRow, col: colRak }) }
      const realisasi = isAkun
         ? nilai_realisasi
         : isTotal
           ? { formula: `=SUBTOTAL(9,${colRealsasi}${starRow + 1}:${colRealsasi}${lastRow})` }
           : { formula: generateSubTotal({ level, index, nextRow, col: colRealsasi }) }

      const ket = isAkun
         ? `=${colTotal}${currRow}-${colPagu}${currRow}`
         : isTotal
           ? `=SUBTOTAL(9,${colKet}${starRow + 1}:${colKet}${lastRow})`
           : generateSubTotal({ level, index, nextRow, col: colKet })
      const colBls = belanja.map((b, i) => {
         const col = numberToColumn(4 + i)
         if (isAkun) {
            return b?.total_harga || 0
         } else if (isTotal) {
            return { formula: `=SUBTOTAL(9,${col}${starRow + 1}:${col}${lastRow})` }
         } else {
            return {
               formula: generateSubTotal({ level, index, nextRow, col }),
            }
         }
      })

      const dataPagu = isAkun
         ? `=${pagu}`
         : isTotal
           ? `=SUBTOTAL(9,${colPagu}${starRow + 1}:${colPagu}${lastRow})`
           : generateSubTotal({ level, index, nextRow, col: colPagu })

      let item = [
         kode,
         uraian,
         { formula: dataPagu },
         ...colBls,
         { formula: total },
         { formula: ket },
         { formula: `${total_harga}-${colPagu}${currRow}` },
         rak,
         realisasi,
      ]
      const row = ws.addRow(item)
      if (!isAkun) {
         belanja.map((bl, i) => {
            ws.addConditionalFormatting({
               ref: row.getCell(4 + i).address,
               rules: [
                  {
                     type: 'cellIs',
                     priority: 1,
                     operator: 'lessThan',
                     formulae: [bl.pagu],
                     style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFE0D9' } },
                     },
                  },
                  {
                     type: 'cellIs',
                     priority: 2,
                     operator: 'greaterThan',
                     formulae: [bl.pagu],
                     style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: '00FFFF' } },
                     },
                  },
               ],
            })
         })
      }

      borderAll({ row, ws, bold: !isAkun })
      // row.eachCell({ includeEmpty: true }, (cell, col) => {
      //    if (col <= 6) {
      //       const cellAddress = cell.address
      //       const style = ws.getCell(cellAddress).style
      //       ws.getCell(cellAddress).style = {
      //          ...style,
      //          border: {
      //             top: { style: 'thin' },
      //             left: col === 1 ? { style: 'thin' } : undefined,
      //             bottom: { style: 'thin' },
      //             right: col === 6 ? { style: 'thin' } : undefined,
      //          },
      //       }
      //    }
      // })
   }
   const row = ws.addRow(undefined)
   row.height = 7
   fillKepala({ ws, skpd })
   ws.headerFooter.oddFooter = `&L&\"Arial\"&9&I${footer}&R&\"Arial\"&9&B&P`
   // const password = subGiat.kode_sub_giat.slice(-4)
   // await ws.protect(password, {
   //    insertRows: true,
   //    formatRows: true,
   //    formatColumns: true,
   //    formatCells: true,
   // })
}

export default dowloadDanaExcel

// function fillDokJudul({
//    ws,
//    dokumen,
//    tahun,
// }: {
//    ws: Excel.Worksheet
//    dokumen: Props['dokumen']
//    tahun: number
// }): number {
//    const data_judul = createExcelData({
//       l: 3,
//       c: false,
//       d: {
//          0: createExcelData({
//             l: 12,
//             d: {
//                1: dokumen?.title?.toLocaleUpperCase('ID'),
//                10: `FORMULIR\n${dokumen.kode}-RINCIAN BELANJA\nSKPD`,
//             },
//          }),
//          1: createExcelData({ l: 12, d: { 1: 'SATUAN KERJA PERANGKAT DAERAH' } }),
//          2: createExcelData({
//             l: 12,
//             d: { 1: `Pemerintahan Kab. Lembata Tahun Anggaran ${tahun}` },
//          }),
//       },
//    })
//    const rows_judul = ws.addRows(data_judul)
//    rows_judul.map((row) => {
//       borderAll({ row, ws, bold: true, center: true, wrapText: true })
//       ws.mergeCells(row.number, 1, row.number, 9)
//    })
//    ws.mergeCells(rows_judul[0].number, 10, rows_judul[rows_judul.length - 1].number, 12)
//    const row = ws.addRow(undefined)
//    row.height = 7
//    return row.number
// }

function fillTableHead({ ws, listDana }: { ws: Excel.Worksheet; listDana: string[] }): number {
   const row_th = ws.addRow([
      'Kode',
      'Uraian',
      'Pagu',
      ...listDana,
      'Total',
      'Selisih',
      'Ket',
      'Rak',
      'Realisasi',
   ])
   borderAll({ row: row_th, ws, bold: true, center: true, wrapText: true })

   ws.pageSetup = {
      fitToWidth: 1,
      fitToPage: true,
      fitToHeight: 0,
      orientation: 'portrait',
      blackAndWhite: true,
      showGridLines: false,
      paperSize: 9,
      margins: { left: 0.5, right: 0.5, top: 0.6, bottom: 0.6, header: 0.2, footer: 0.2 },
      printTitlesRow: `${row_th.number}:${row_th.number}`,
   }
   return row_th.number
}

function fillKepala({ ws, skpd }: { ws: Excel.Worksheet; skpd: Props['skpd'] }) {
   const data = createExcelData({
      l: !skpd?.pangkat_kepala ? 5 : 6,
      d: {
         1: createExcelData({
            l: 12,
            d: { 9: 'Lewoleba, __________________' },
         }),
         2: createExcelData({
            l: 12,
            d: { 9: skpd?.nama_jabatan_kepala },
         }),
         4: createExcelData({
            l: 12,
            d: { 9: skpd?.nama_kepala },
         }),
         5: createExcelData({
            l: 12,
            d: { 9: skpd?.pangkat_kepala ?? `NIP.${skpd.nip_kepala}` },
         }),
         6: !skpd?.pangkat_kepala
            ? undefined
            : createExcelData({
                 l: 12,
                 d: { 9: `NIP.${skpd.nip_kepala}` },
              }),
      },
      c: true,
   })
   const rows = ws.addRows(data)
   rows.map((row, i) => {
      ws.mergeCellsWithoutStyle(row.number, 9, row.number, 12)
      const cell = row.getCell(9)
      const style = cell.style
      cell.style = {
         ...textStyle,
         alignment: { ...style.alignment, horizontal: 'center', wrapText: true },
         font: {
            ...fontStyle,
            underline: i === 3,
            bold: i >= 1 && i <= 3,
         },
      }
      row.height = i === 2 ? 30 : 15
   })

   const row = ws.addRow(undefined)
   row.height = 7
   return row.number
}
