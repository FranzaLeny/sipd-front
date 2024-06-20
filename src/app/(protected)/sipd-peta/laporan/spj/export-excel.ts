import { borderAll, createExcelData } from '@utils/excel'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'
import { sortBy } from 'lodash-es'

import { SpjFungsional } from './component'

type Params = SpjFungsional & { bulan: string }
function numberToColumn(number: number) {
   let column = ''
   while (number > 0) {
      const remainder = (number - 1) % 26
      column = String.fromCharCode(65 + remainder) + column
      number = Math.floor((number - 1) / 26)
   }
   return column
}

const dowloadExcelSpjFungsional = async (dpaRician: Params) => {
   const { pembukuan2, tahun, bulan = 'Bulan', kode_skpd, nama_skpd } = dpaRician
   const date = new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'short',
      timeStyle: 'short',
   }).format(new Date())
   let namaFile = `${date}-SPJ Fungsional ${bulan} ${tahun} ${nama_skpd}`

   const sheet_name = bulan
   let footer = `${kode_skpd}-${nama_skpd}`
   if (footer.length > 100) {
      footer = footer.substring(0, 100) + '...'
   }

   const wb = new Excel.Workbook()
   const ws = wb.addWorksheet(sheet_name)
   formatDefaultRka(ws)
   let currRow = fillTableHead({ ws })
   currRow = fillPembukuan2({ startRow: currRow, items: pembukuan2, ws })
   const buf = await wb.xlsx.writeBuffer()
   ws.headerFooter.oddFooter = `&L&\"Arial\"&9&I${footer}&R&\"Arial\"&9SPJ Fungsional ${bulan} ${tahun}| &B&P`
   const password = kode_skpd.slice(-4)
   await ws.protect(password, {
      insertRows: true,
      formatRows: true,
      formatColumns: true,
      formatCells: true,
   })
   saveAs(
      new Blob([buf]),
      `${namaFile
         .replace(/[^\w\s]|(?!\S)\s+/g, '_')
         ?.trim()
         ?.substring(0, 150)}.xlsx`
   )
}

export default dowloadExcelSpjFungsional

function formatDefaultRka(ws: Excel.Worksheet) {
   const style: Partial<Excel.Style> = {
      alignment: {
         vertical: 'middle',
         horizontal: 'right',
         wrapText: false,
         shrinkToFit: true,
         indent: 0.1,
      },
      font: { name: 'Arial', size: 10 },
      numFmt: '#,##0;[Red]-#,##0',
   }
   ws.columns = [
      {
         style: { ...style, numFmt: '@', alignment: { ...style.alignment, horizontal: 'left' } },
         key: '1_1',
         width: 2.57,
      },
      {
         style: { ...style, numFmt: '@', alignment: { ...style.alignment, horizontal: 'left' } },
         key: '1_2',
         width: 3.57,
      },
      {
         style: { ...style, numFmt: '@', alignment: { ...style.alignment, horizontal: 'left' } },
         key: '1_3',
         width: 3.57,
      },
      {
         style: { ...style, numFmt: '@', alignment: { ...style.alignment, horizontal: 'left' } },
         key: '1_4',
         width: 3.57,
      },
      {
         style: { ...style, numFmt: '@', alignment: { ...style.alignment, horizontal: 'left' } },
         key: '1_5',
         width: 3.57,
      },
      {
         style: { ...style, numFmt: '@', alignment: { ...style.alignment, horizontal: 'left' } },
         key: '1_6',
         width: 5.57,
      },
      {
         style: {
            ...style,
            numFmt: '@',
            alignment: {
               ...style.alignment,
               horizontal: 'left',
               wrapText: true,
               shrinkToFit: false,
            },
         },
         key: '2',
         width: 40.71,
      },
      {
         key: '3',
         width: 11.71,
         style,
      },
      {
         key: '4',
         width: 11.71,
         style,
      },
      {
         key: '5',
         width: 11.71,
         style,
      },
      {
         key: '6',
         width: 11.71,
         style,
      },
      {
         key: '7',
         width: 11.71,
         style,
      },
      {
         key: '8',
         width: 11.71,
         style,
      },
      {
         key: '9',
         width: 11.71,
         style,
      },
      {
         key: '10',
         width: 11.71,
         style,
      },
      {
         key: '11',
         width: 11.71,
         style,
      },
      {
         key: '12',
         width: 11.71,
         style,
      },
      {
         key: '13',
         width: 11.71,
         style,
      },
      {
         key: '14',
         width: 11.71,
         style,
      },
   ]
   ws.views = [
      {
         showGridLines: false,
      },
   ]
}

function fillTableHead({ ws }: { ws: Excel.Worksheet }) {
   const data_th = createExcelData({
      l: 3,
      c: false,
      d: {
         0: createExcelData({
            l: 19,
            d: {
               1: 'Kode Rekening',
               7: 'Uraian',
               8: 'Jumlah Anggaran',
               9: 'SPJ - LS Gaji',
               12: 'SPJ - LS Barang & Jasa',
               15: 'SPJ - UP/GU/TU',
               18: 'Jumlah SPJ (LS + UP/GU/TU) s.d Bulan ini',
               19: 'Sisa Pagu Anggaran',
            },
         }),
         1: createExcelData({
            l: 19,
            d: {
               9: 's.d. Bulan Lalu',
               10: 'Bulan Ini',
               11: 's.d. Bulan Ini',
               12: 's.d. Bulan Lalu',
               13: 'Bulan Ini',
               14: 's.d. Bulan Ini',
               15: 's.d. Bulan Lalu',
               16: 'Bulan Ini',
               17: 's.d. Bulan Ini',
            },
         }),
         2: createExcelData({
            l: 19,
            d: {
               1: '1',
               7: '2',
               8: '3',
               9: '4',
               10: '5',
               11: '6 = (4+5)',
               12: '7',
               13: '8',
               14: '9 = (7+8)',
               15: '10',
               16: '11',
               17: '12 = (10+11)',
               18: '13 = (6+9+12)',
               19: '14 = (3-13)',
            },
         }),
      },
   })
   const row_th = ws.addRows(data_th)
   row_th.map((row, i) => {
      borderAll({ row, ws, bold: true, center: true, wrapText: true })
      if (i === 0) {
         ws.mergeCellsWithoutStyle(row.number, 1, row.number + 1, 6)
         ws.mergeCellsWithoutStyle(row.number, 7, row.number + 1, 7)
         ws.mergeCellsWithoutStyle(row.number, 8, row.number + 1, 8)
         ws.mergeCellsWithoutStyle(row.number, 9, row.number, 11)
         ws.mergeCellsWithoutStyle(row.number, 12, row.number, 14)
         ws.mergeCellsWithoutStyle(row.number, 15, row.number, 17)
         ws.mergeCellsWithoutStyle(row.number, 18, row.number + 1, 18)
         ws.mergeCellsWithoutStyle(row.number, 19, row.number + 1, 19)
      } else if (i === 2) {
         ws.mergeCellsWithoutStyle(row.number, 1, row.number, 6)
      }
   })
   ws.pageSetup = {
      fitToWidth: 1,
      fitToPage: true,
      fitToHeight: 0,
      orientation: 'landscape',
      showGridLines: false,
      margins: { left: 0.5, right: 0.5, top: 0.6, bottom: 0.6, header: 0.2, footer: 0.2 },
      printTitlesRow: `${row_th[0].number}:${row_th[row_th.length - 1].number}`,
   }

   return row_th[row_th.length - 1].number
}
function fillPembukuan2(params: {
   ws: Excel.Worksheet
   startRow: number
   items: Params['pembukuan2']
}) {
   const { ws, startRow, items: xx } = params
   const items = sortBy(xx, 'kode_unik')
   const lastRow = startRow + items.length
   let level = -1
   let outlineLevel: Record<string, number> = {}

   const generateSubTotal = (
      numCol: number,
      lengthKode: number,
      index: number,
      currRow: number
   ) => {
      const lastIndex = items.findIndex((d, i) => i > index && d.kode_unik.length <= lengthKode)
      const endRow = lastIndex === -1 ? lastRow : startRow + lastIndex
      const column = numberToColumn(numCol)
      return { formula: `=SUBTOTAL(9,${column}${currRow + 1}:${column}${endRow})` }
   }
   for (const [index, rinci] of items.entries()) {
      const currRow = startRow + index + 1
      const korek = rinci.kode_unik
      const lengthKode = korek.length
      const lengtPart = korek.split('-').length
      const keyOutline = lengtPart + '-' + lengthKode
      if (typeof outlineLevel[keyOutline] !== 'number') {
         outlineLevel[keyOutline] = level
         level < 7 && (level += 1)
      }
      const isSubTotal = lengthKode < 79
      const kode = rinci?.kode_akun
         ?.split('.')
         ?.map((d: string) => (d?.trim() ? d?.trim() + '.' : null))
      const kode_akun = [...new Array(6)]?.map((_, i) => {
         if (index > 0) {
            return kode[i]
         } else if (i === 0) {
            return rinci?.nama_akun
         }
         return null
      })

      const data = [
         ...kode_akun,
         index > 0 ? rinci?.nama_akun : undefined,
         rinci?.alokasi_anggaran,
         rinci?.realisasi_gaji_bulan_sebelumnya,
         rinci?.realisasi_gaji_bulan_ini,
         isSubTotal
            ? generateSubTotal(11, lengthKode, index, currRow)
            : { formula: `=${numberToColumn(9)}${currRow}+${numberToColumn(10)}${currRow}` },
         rinci?.realisasi_ls_selain_gaji_bulan_sebelumnya,
         rinci?.realisasi_ls_selain_gaji_bulan_ini,
         isSubTotal
            ? generateSubTotal(14, lengthKode, index, currRow)
            : { formula: `=${numberToColumn(12)}${currRow}+${numberToColumn(13)}${currRow}` },
         rinci?.realisasi_up_gu_tu_bulan_sebelumnya,
         rinci?.realisasi_up_gu_tu_bulan_ini,
         isSubTotal
            ? generateSubTotal(17, lengthKode, index, currRow)
            : { formula: `=${numberToColumn(15)}${currRow}+${numberToColumn(16)}${currRow}` },
         isSubTotal
            ? generateSubTotal(18, lengthKode, index, currRow)
            : {
                 formula: `=${numberToColumn(11)}${currRow}+${numberToColumn(14)}${currRow}+${numberToColumn(17)}${currRow}`,
              },
         isSubTotal
            ? generateSubTotal(19, lengthKode, index, currRow)
            : { formula: `=${numberToColumn(8)}${currRow}-${numberToColumn(18)}${currRow}` },
      ]

      const row = ws.addRow(data)

      const cLevel = outlineLevel[keyOutline]
      cLevel >= 0 && (row.outlineLevel = cLevel)
      borderAll({ row, ws, bold: lengthKode < 79 })
      row.eachCell({ includeEmpty: true }, (cell, col) => {
         if (index > 0 && col <= 6) {
            cell.style = {
               ...cell.style,
               border: {
                  bottom: { style: 'thin' },
                  top: { style: 'thin' },
                  left: col === 1 ? { style: 'thin' } : undefined,
                  right: col === 6 ? { style: 'thin' } : undefined,
               },
               alignment: { ...cell.style.alignment, horizontal: 'center' },
            }
         }
      })
      if (index === 0) {
         ws.mergeCellsWithoutStyle(`A${currRow}:G${currRow}`)
      }
   }
   const total = [...new Array(19)]?.map((_, i) => {
      if (i === 0) {
         return 'JUMLAH'
      } else if (i >= 7) {
         return {
            formula: `=SUBTOTAL(9,${numberToColumn(i + 1)}${startRow + 1}:${numberToColumn(i + 1)}${lastRow})`,
         }
      }
      return null
   })

   const rowTotal = ws.addRow(total)
   borderAll({ row: rowTotal, ws, bold: true })
   ws.mergeCellsWithoutStyle(rowTotal.number, 1, rowTotal.number, 7)
   const rowDivider = ws.addRow(undefined)

   rowDivider.height = 7
   return rowDivider.number
}
