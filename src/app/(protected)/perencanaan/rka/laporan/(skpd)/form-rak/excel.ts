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

function splitWithDot(input: string) {
   const parts = input.split('.')
   const newArray = new Array(6).fill(null)
   return newArray.map((_, index) => {
      // Jika bukan elemen terakhir, return nilainya dengan titik
      if (index < parts.length - 1) {
         return parts[index] + '.'
      }
      // Jika elemen terakhir, return nilainya saja
      return parts[index] ?? null
   })
}
function formatDokumen(ws: Excel.Worksheet) {
   const columnsBl = [...Array(12)]?.map((_, i) => {
      return {
         key: `bl_${i + 1}`,
         width: 10.29,
         style: numStyle,
      }
   })
   ws.columns = [
      { key: 'kode1', width: 3.29, style: textStyle },
      { key: 'kode2', width: 3.29, style: textStyle },
      { key: 'kode3', width: 3.59, style: textStyle },
      { key: 'kode4', width: 3.59, style: textStyle },
      { key: 'kode5', width: 3.59, style: textStyle },
      { key: 'kode6', width: 5.29, style: textStyle },
      { key: 'uraian', width: 40.29, style: textStyle },
      { key: 'pagu', width: 14.29, style: numStyle },
      { key: 'total', width: 14.29, style: numStyle },
      ...columnsBl,
   ]
   ws.views = [{ showGridLines: false }]
}

interface Props {
   sumberDana: SumberDanaLaporanRekapanSumberDana[]
   skpd: UnitLaporan
   tahun: number
   documentTitle: string
}

const dowloadFormRakExcel = async (data: LaporanFormRak) => {
   const wb = new Excel.Workbook()
   let namaFile = 'RAK-' + data?.skpd?.sub_skpd?.singkatan_skpd
   for await (const subGiat of data?.listBl) {
      await createSheet(subGiat, data?.jadwal?.tahun, data?.skpd?.sub_skpd, wb)
   }
   wb.creator = 'FXIL'
   const buf = await wb.xlsx.writeBuffer()
   saveAs(new Blob([buf]), `${namaFile.replace(/[^\w\s]|(?!\S)\s+/g, ' ')}.xlsx`)
}

const createSheet = async (
   data: LaporanFormRak['listBl'][number],
   tahun: number,
   skpd: UnitLaporan,
   wb: Excel.Workbook
) => {
   const singkatan = data?.nama_sub_giat
      ?.replace(/[^a-zA-Z]/g, ' ')
      ?.replaceAll('dan', '')
      ?.replaceAll('pada', '')
      .split(' ')
      ?.map((x) => x?.substring(0, 4))
      ?.join('')
   const sheet_name = data?.kode_sub_giat?.substring(5) + singkatan
   let footer = data?.kode_sub_giat + '-' + data?.nama_sub_giat
   if (footer.length > 100) {
      footer = footer.substring(0, 97) + '...'
   }

   const ws = wb.addWorksheet(sheet_name?.substring(0, 30))

   formatDokumen(ws)
   fillDokJudul({ ws, tahun })
   fillSubGiat({
      ws,
      data: {
         Urusan: data?.kode_bidang_urusan + ' ' + data?.nama_bidang_urusan,
         Bidang_Urusan: data?.kode_bidang_urusan + ' ' + data?.nama_bidang_urusan,
         SKPD: data?.kode_skpd + ' ' + data?.nama_skpd,
         Unit_SKPD: data?.kode_sub_skpd + ' ' + data?.nama_sub_skpd,
         Program: data?.kode_program + ' ' + data?.nama_program,
         Kegiatan: data?.kode_giat + ' ' + data?.nama_giat,
         Sub_Kegiatan: data?.kode_sub_giat + ' ' + data?.nama_sub_giat,
         Nilai_Anggaran: data?.pagu,
      },
   })

   const starRow = fillTableHead({ ws }) + 1
   const dataLength = data?.akun_bl?.length
   const lastRow = starRow + dataLength - 1
   function generateSubTotal({
      level,
      index,
      nextRow,
   }: {
      level: number
      index: number
      nextRow: number
   }) {
      const lastIndex = data?.akun_bl.findIndex((d, i) => i > index && d.level <= level)
      const endRow = lastIndex === -1 ? lastRow : starRow + lastIndex - 1
      let temp = []
      for (let i = 8; i <= 21; i++) {
         const col = numberToColumn(i)
         temp.push({ formula: `=SUBTOTAL(9,${col + nextRow}:${col + endRow})` })
      }
      return temp
   }
   data?.akun_bl?.map((d, i) => {
      const currRow = starRow + i
      const { kode_akun, nama_akun, total_harga, rak, is_group, level } = d
      const rowsData: any[] = [...splitWithDot(kode_akun), nama_akun]

      if (is_group) {
         const colRak = generateSubTotal({ index: i, level, nextRow: currRow + 1 })
         rowsData.push(...colRak)
      } else {
         const colRak = [
            total_harga,
            { formula: `=SUM(${numberToColumn(10)}${currRow}:${numberToColumn(21)}${currRow})` },
            rak?.realisasi_1 || 0,
            rak?.realisasi_2 || 0,
            rak?.realisasi_3 || 0,
            rak?.realisasi_4 || 0,
            rak?.realisasi_5 || 0,
            rak?.realisasi_6 || 0,
            rak?.realisasi_7 || 0,
            rak?.realisasi_8 || 0,
            rak?.realisasi_9 || 0,
            rak?.realisasi_10 || 0,
            rak?.realisasi_11 || 0,
            rak?.realisasi_12 || 0,
            rak?.nilai_rak || 0,
            rak?.nilai_realisasi || 0,
         ]
         rowsData.push(...colRak)
      }
      const row = ws.addRow(rowsData)
      borderAll({ row, ws, excludeColumns: [22, 23], bold: is_group })
      row.eachCell({ includeEmpty: true }, (cell, col) => {
         const cellAddress = cell.address
         if (col <= 6) {
            const style = ws.getCell(cellAddress).style
            ws.getCell(cellAddress).style = {
               ...style,
               border: {
                  top: { style: 'thin' },
                  left: col === 1 ? { style: 'thin' } : undefined,
                  bottom: { style: 'thin' },
                  right: col === 6 ? { style: 'thin' } : undefined,
               },
            }
         }
      })
      ws.addConditionalFormatting({
         ref: row.getCell(8).address,
         rules: [
            {
               type: 'cellIs',
               priority: 1,
               operator: 'lessThan',
               formulae: [total_harga],
               style: { fill: { pattern: 'solid', bgColor: { argb: 'CCC0DA' }, type: 'pattern' } },
            },
            {
               type: 'cellIs',
               priority: 2,
               operator: 'greaterThan',
               formulae: [total_harga],
               style: { fill: { pattern: 'solid', bgColor: { argb: 'B7DEE8' }, type: 'pattern' } },
            },
         ],
      })
      ws.addConditionalFormatting({
         ref: row.getCell(9).address,
         rules: [
            {
               type: 'cellIs',
               priority: 1,
               operator: 'lessThan',
               formulae: [`=${numberToColumn(8)}${currRow}`],
               style: { fill: { pattern: 'solid', bgColor: { argb: 'FFC7CE' }, type: 'pattern' } },
            },
            {
               type: 'cellIs',
               priority: 2,
               operator: 'greaterThan',
               formulae: [`=${numberToColumn(8)}${currRow}`],
               style: { fill: { pattern: 'solid', bgColor: { argb: 'FDE9D9' }, type: 'pattern' } },
            },
         ],
      })
   })
   const dataJumlah = createExcelData({
      c: true,
      l: 3,
      d: {
         1: createExcelData({
            l: 23,
            d: {
               1: 'JUMLAH ALOKASI KAS PER BULAN',
               8: {
                  formula: `=SUBTOTAL(9,${numberToColumn(8)}${starRow}:${numberToColumn(8)}${lastRow})`,
               },
               9: {
                  formula: `=SUBTOTAL(9,${numberToColumn(9)}${starRow}:${numberToColumn(9)}${lastRow})`,
               },
               10: {
                  formula: `=SUBTOTAL(9,${numberToColumn(10)}${starRow}:${numberToColumn(10)}${lastRow})`,
               },
               11: {
                  formula: `=SUBTOTAL(9,${numberToColumn(11)}${starRow}:${numberToColumn(11)}${lastRow})`,
               },
               12: {
                  formula: `=SUBTOTAL(9,${numberToColumn(12)}${starRow}:${numberToColumn(12)}${lastRow})`,
               },
               13: {
                  formula: `=SUBTOTAL(9,${numberToColumn(13)}${starRow}:${numberToColumn(13)}${lastRow})`,
               },
               14: {
                  formula: `=SUBTOTAL(9,${numberToColumn(14)}${starRow}:${numberToColumn(14)}${lastRow})`,
               },
               15: {
                  formula: `=SUBTOTAL(9,${numberToColumn(15)}${starRow}:${numberToColumn(15)}${lastRow})`,
               },
               16: {
                  formula: `=SUBTOTAL(9,${numberToColumn(16)}${starRow}:${numberToColumn(16)}${lastRow})`,
               },
               17: {
                  formula: `=SUBTOTAL(9,${numberToColumn(17)}${starRow}:${numberToColumn(17)}${lastRow})`,
               },
               18: {
                  formula: `=SUBTOTAL(9,${numberToColumn(18)}${starRow}:${numberToColumn(18)}${lastRow})`,
               },
               19: {
                  formula: `=SUBTOTAL(9,${numberToColumn(19)}${starRow}:${numberToColumn(19)}${lastRow})`,
               },
               20: {
                  formula: `=SUBTOTAL(9,${numberToColumn(20)}${starRow}:${numberToColumn(20)}${lastRow})`,
               },
               21: {
                  formula: `=SUBTOTAL(9,${numberToColumn(21)}${starRow}:${numberToColumn(21)}${lastRow})`,
               },
               22: {
                  formula: `=SUBTOTAL(9,${numberToColumn(22)}${starRow}:${numberToColumn(22)}${lastRow})`,
               },
               23: {
                  formula: `=SUBTOTAL(9,${numberToColumn(23)}${starRow}:${numberToColumn(23)}${lastRow})`,
               },
            },
         }),
         2: createExcelData({
            l: 21,
            d: {
               1: 'JUMLAH ALOKASI KAS BELANJA PER TRIWULAN',
               8: {
                  formula: `=SUBTOTAL(9,${numberToColumn(8)}${starRow}:${numberToColumn(8)}${lastRow})`,
               },
               9: {
                  formula: `=SUM(${numberToColumn(10)}${lastRow + 2}:${numberToColumn(21)}${lastRow + 2})`,
               },
               10: {
                  formula: `=SUM(${numberToColumn(10)}${lastRow + 1}:${numberToColumn(12)}${lastRow + 1})`,
               },
               13: {
                  formula: `=SUM(${numberToColumn(13)}${lastRow + 1}:${numberToColumn(15)}${lastRow + 1})`,
               },
               16: {
                  formula: `=SUM(${numberToColumn(16)}${lastRow + 1}:${numberToColumn(18)}${lastRow + 1})`,
               },
               19: {
                  formula: `=SUM(${numberToColumn(19)}${lastRow + 1}:${numberToColumn(21)}${lastRow + 1})`,
               },
            },
         }),
         3: createExcelData({
            l: 21,
            d: {
               1: 'JUMLAH ALOKASI KAS BELANJA PER SEMESTER',
               8: {
                  formula: `=SUBTOTAL(9,${numberToColumn(8)}${starRow}:${numberToColumn(8)}${lastRow})`,
               },
               9: {
                  formula: `=SUM(${numberToColumn(10)}${lastRow + 3}:${numberToColumn(21)}${lastRow + 3})`,
               },
               10: {
                  formula: `=SUM(${numberToColumn(10)}${lastRow + 1}:${numberToColumn(15)}${lastRow + 1})`,
               },
               16: {
                  formula: `=SUM(${numberToColumn(16)}${lastRow + 1}:${numberToColumn(21)}${lastRow + 1})`,
               },
            },
         }),
      },
   })
   const rowJumlah = ws.addRows(dataJumlah)
   rowJumlah.map((row, i) => {
      borderAll({ row, ws, bold: true, center: false, wrapText: [1], excludeColumns: [22, 23] })
      ws.mergeCellsWithoutStyle(row.number, 1, row.number, 7)
      if (i === 0) {
      } else if (i === 1) {
         ws.mergeCellsWithoutStyle(row.number, 10, row.number, 12)
         ws.mergeCellsWithoutStyle(row.number, 13, row.number, 15)
         ws.mergeCellsWithoutStyle(row.number, 16, row.number, 18)
         ws.mergeCellsWithoutStyle(row.number, 19, row.number, 21)
      } else if (i === 2) {
         ws.mergeCellsWithoutStyle(row.number, 10, row.number, 15)
         ws.mergeCellsWithoutStyle(row.number, 16, row.number, 21)
      }
   })
   const row = ws.addRow(undefined)
   row.height = 7

   const lasts = fillKepala({ ws, skpd })
   ws.pageSetup.printArea = `A1:U${lasts}`

   ws.headerFooter.oddFooter = `&L&\"Arial\"&9&I${footer}&R&\"Arial\"&9&B&P`
}

export default dowloadFormRakExcel

function fillSubGiat({
   ws,
   data,
}: {
   ws: Excel.Worksheet
   data: {
      Urusan: string
      Bidang_Urusan: string
      SKPD: string
      Unit_SKPD: string
      Program: string
      Kegiatan: string
      Sub_Kegiatan: string
      Nilai_Anggaran: number
   }
}): number {
   const length = Object.keys(data).length
   const data_judul = createExcelData({
      l: length,
      c: false,
      d: Object.keys(data).reduce(
         (prev, key: string, index) => ({
            [index]: createExcelData({
               l: 21,
               d: {
                  1: key?.replaceAll('_', ' '),
                  6: ':',
                  7: data[key as keyof typeof data],
               },
            }),
            ...prev,
         }),
         {}
      ),
   })
   const rows_judul = ws.addRows(data_judul)
   rows_judul.map((row, i) => {
      ws.mergeCellsWithoutStyle(row.number, 1, row.number, 5)
      ws.mergeCellsWithoutStyle(row.number, 7, row.number, 21)
      if (i === length - 1) {
         const cell = row.getCell(7)
         const style = cell.style
         cell.style = {
            ...numStyle,
            alignment: { ...style.alignment },
         }
      }
   })
   const row = ws.addRow(undefined)
   row.height = 7
   return row.number
}
function fillDokJudul({ ws, tahun }: { ws: Excel.Worksheet; tahun: number }): number {
   const data_judul = createExcelData({
      l: 3,
      c: false,
      d: {
         0: createExcelData({
            l: 21,
            d: {
               1: 'RENCANA ANGGARAN KAS',
               16: `FORMULIR\nRAK BELANJA`,
            },
         }),
         1: createExcelData({ l: 21, d: { 1: 'SATUAN KERJA PERANGKAT DAERAH' } }),
         2: createExcelData({
            l: 21,
            d: { 1: `Pemerintahan Kab. Lembata Tahun Anggaran ${tahun}` },
         }),
      },
   })
   const rows_judul = ws.addRows(data_judul)
   rows_judul.map((row) => {
      borderAll({ row, ws, bold: true, center: true, wrapText: true })
      ws.mergeCellsWithoutStyle(row.number, 1, row.number, 15)
   })
   ws.mergeCellsWithoutStyle(rows_judul[0].number, 16, rows_judul[rows_judul.length - 1].number, 21)
   const row = ws.addRow(undefined)
   row.height = 7
   return row.number
}

function fillTableHead({ ws }: { ws: Excel.Worksheet }): number {
   const data_judul = createExcelData({
      l: 3,
      c: false,
      d: {
         0: createExcelData({
            l: 21,
            d: {
               1: 'Kode Rekening',
               7: `Uraian`,
               8: `Pagu`,
               9: `Total Rak`,
               10: `Semester I`,
               16: `Semester II`,
            },
         }),
         1: createExcelData({
            l: 21,
            d: { 10: 'Triwulan I', 13: 'Triwulan II', 16: 'Triwulan III', 19: 'Triwulan IV' },
         }),
         2: createExcelData({
            l: 21,
            d: {
               10: 'Januari',
               11: 'Februari',
               12: 'Maret',
               13: 'April',
               14: 'Mei',
               15: 'Juni',
               16: 'Juli',
               17: 'Agustus',
               18: 'September',
               19: 'Oktober',
               20: 'November',
               21: 'Desember',
            },
         }),
      },
   })
   const row_th = ws.addRows(data_judul)
   let rowTh: [number, number] = [1, 1]
   row_th.map((row, i) => {
      borderAll({ row: row, ws, bold: true, center: true, wrapText: false })

      if (i === 0) {
         rowTh = [row.number, row.number]
         ws.mergeCellsWithoutStyle(row.number, 1, row.number + 2, 6)
         // ws.mergeCellsWithoutStyle(row.number, 6, row.number + 2, 6)
         ws.mergeCellsWithoutStyle(row.number, 7, row.number + 2, 7)
         ws.mergeCellsWithoutStyle(row.number, 8, row.number + 2, 8)
         ws.mergeCellsWithoutStyle(row.number, 9, row.number + 2, 9)
         ws.mergeCellsWithoutStyle(row.number, 10, row.number, 15)
         ws.mergeCellsWithoutStyle(row.number, 16, row.number, 21)
      } else if (i === 1) {
         ws.mergeCellsWithoutStyle(row.number, 10, row.number, 12)
         ws.mergeCellsWithoutStyle(row.number, 13, row.number, 15)
         ws.mergeCellsWithoutStyle(row.number, 16, row.number, 18)
         ws.mergeCellsWithoutStyle(row.number, 19, row.number, 21)
      } else {
         rowTh[1] = row.number
      }
   })

   ws.pageSetup = {
      fitToWidth: 1,
      fitToPage: true,
      fitToHeight: 0,
      orientation: 'landscape',
      blackAndWhite: true,
      showGridLines: false,
      paperSize: 9,
      margins: { left: 0.5, right: 0.5, top: 0.6, bottom: 0.6, header: 0.2, footer: 0.2 },
      printTitlesRow: `${rowTh[0]}:${rowTh[1]}`,
   }
   return rowTh[1]
}

function fillKepala({ ws, skpd }: { ws: Excel.Worksheet; skpd: Props['skpd'] }) {
   const data = createExcelData({
      l: !skpd?.pangkat_kepala ? 5 : 6,
      d: {
         1: createExcelData({
            l: 21,
            d: { 16: 'Lewoleba, __________________' },
         }),
         2: createExcelData({
            l: 21,
            d: { 16: skpd?.nama_jabatan_kepala },
         }),
         4: createExcelData({
            l: 21,
            d: { 16: skpd?.nama_kepala },
         }),
         5: createExcelData({
            l: 21,
            d: { 16: skpd?.pangkat_kepala ?? `NIP.${skpd.nip_kepala}` },
         }),
         6: !skpd?.pangkat_kepala
            ? undefined
            : createExcelData({
                 l: 21,
                 d: { 16: `NIP.${skpd.nip_kepala}` },
              }),
      },
      c: true,
   })
   const rows = ws.addRows(data)
   rows.map((row, i) => {
      ws.mergeCellsWithoutStyle(row.number, 16, row.number, 21)
      const cell = row.getCell(16)
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
