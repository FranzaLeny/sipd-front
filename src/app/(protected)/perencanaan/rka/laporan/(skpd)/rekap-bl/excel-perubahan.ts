import { LaporanBelanjaSkpd } from '@/types/api/laporan'
import manifest from '@constants/tpd.json'
import { borderAll, calcRowHeight, createExcelData, numberToColumn } from '@utils/excel'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

function formatDefaultRka(ws: Excel.Worksheet) {
   const font = { name: 'Arial', size: 10 }
   const textStyle: Partial<Excel.Style> = {
      alignment: {
         vertical: 'middle',
         horizontal: 'left',
         wrapText: true,
         shrinkToFit: false,
         indent: 0.1,
      },
      font,
      numFmt: '@',
   }
   const numStyle: Partial<Excel.Style> = {
      alignment: {
         vertical: 'middle',
         horizontal: 'right',
         wrapText: false,
         shrinkToFit: true,
         indent: 0.1,
      },
      font,
      numFmt: '#,##0;(#,##0)',
   }
   const percentStyle: Partial<Excel.Style> = {
      ...numStyle,
      numFmt: '0%',
   }
   ws.columns = [
      { key: 'kd_1', width: 4.29, style: textStyle },
      { key: 'kd_2', width: 4.29, style: textStyle },
      { key: 'kd_3', width: 4.29, style: textStyle },
      { key: 'kd_4', width: 5.29, style: textStyle },
      { key: 'kd_5', width: 5.29, style: textStyle },
      {
         key: 'uraian',
         width: 30.71,
         style: textStyle,
      },
      {
         key: 'dana',
         width: 20.71,
         style: textStyle,
      },
      {
         key: 'lokasi',
         width: 20.71,
         style: textStyle,
      },
      {
         key: '1_n',
         width: 11.71,
         style: numStyle,
      },
      {
         key: 'bo_m',
         style: numStyle,
         width: 11.71,
      },
      {
         key: 'bm_m',
         style: numStyle,
         width: 11.71,
      },
      {
         key: 'btt_m',
         style: numStyle,
         width: 11.71,
      },
      {
         key: 'bt_m',
         style: numStyle,
         width: 11.71,
      },
      {
         key: 'jumlah_m',
         style: numStyle,
         width: 11.71,
      },
      {
         key: 'bo',
         style: numStyle,
         width: 11.71,
      },
      {
         key: 'bm',
         style: numStyle,
         width: 11.71,
      },
      {
         key: 'btt',
         style: numStyle,
         width: 11.71,
      },
      {
         key: 'bt',
         style: numStyle,
         width: 11.71,
      },
      {
         key: 'jumlah',
         style: numStyle,
         width: 11.71,
      },
      {
         key: 'selisih',
         style: numStyle,
         width: 11.71,
      },
      {
         key: 'n_1',
         style: numStyle,
         width: 11.71,
      },
   ]
   ws.views = [{ showGridLines: false }]
}

type Data = {
   dokumen: {
      name: string
      title: string
      kode: string
      header: string
   }
   skpd: LaporanBelanjaSkpd['skpd']['sub_skpd']
   tapd: LaporanBelanjaSkpd['skpd']['tapd'] | undefined
   items: LaporanBelanjaSkpd['list_bl']
   tahun: number
}

const dowloadRekapBlRkpa = async (data: Data) => {
   const { dokumen, items, skpd, tapd, tahun } = data
   const title = dokumen.kode + '_' + skpd?.kode_skpd?.substring(0, 6) + '_' + skpd?.nama_skpd
   const namaFile = title?.substring(0, 120)?.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_') + '_05_BELANJA'
   const sheet_name = 'BELANJA_' + skpd?.kode_skpd?.substring(0, 6)
   let footer = dokumen?.kode + ' || ' + skpd?.kode_skpd + ' - ' + skpd?.nama_skpd
   if (footer.length > 150) {
      footer = footer.substring(0, 150) + '...'
   }
   const generateSubTotal = (level: number, index: number, nextRow: number) => {
      const lastIndex = items.findIndex((d, i) => i > index && d.level <= level)
      const endRow = lastIndex === -1 ? lastRow : starRow + lastIndex
      let data: { formula: string }[] = []
      for (let i = 9; i < 22; i++) {
         const column = numberToColumn(i)
         data.push({ formula: `=SUBTOTAL(9,${column}${nextRow}:${column}${endRow})` })
      }
      return data
   }

   const wb = new Excel.Workbook()
   const ws = wb.addWorksheet(sheet_name)
   formatDefaultRka(ws)
   fillDokJudul({ ws, dokumen, tahun, skpd })
   const starRow = fillTableHead({ ws })
   const lastRow = starRow + items.length - 1
   for (let [index, rinci] of items.entries()) {
      const nextRow = starRow + index + 2
      const currRow = starRow + index + 1
      const isRinci = rinci.group === 'sub_giat'
      const isSkpd = rinci?.group === 'sub_skpd'
      let {
         group,
         uraian,
         nama_dana,
         belanja,
         belanja_murni,
         level,
         lokasi,
         pagu_n_lalu,
         pagu_n_depan,
         kode,
         pagu,
         pagu_murni,
      } = rinci
      const isTotal = group === 'jumlah'
      const rincian = Object.values(belanja)
      const rincianMurni = Object.values(belanja_murni)

      if (isTotal || isSkpd) {
         kode[0] = uraian
         uraian = ''
      }
      const item: any[] = [...kode, uraian, nama_dana, lokasi]
      if (isRinci) {
         rincian.pop()
         rincianMurni.pop()
         const newItem = [
            pagu_n_lalu,
            ...rincianMurni,
            { formula: `=SUM(${numberToColumn(10)}${currRow}:${numberToColumn(13)}${currRow})` },
            ...rincian,
            { formula: `=SUM(${numberToColumn(15)}${currRow}:${numberToColumn(18)}${currRow})` },
            { formula: `=${numberToColumn(19)}${currRow}-${numberToColumn(14)}${currRow}` },
            pagu_n_depan,
         ]
         item.push(...newItem)
      } else {
         const newItem = generateSubTotal(
            level,
            isTotal ? 0 : index,
            isTotal ? starRow + 1 : nextRow
         )
         item.push(...newItem)
      }
      const row = ws.addRow(item)

      if (!isRinci) {
         if (isTotal || isSkpd) {
            ws.mergeCellsWithoutStyle(row.number, 1, row.number, 8)
            row.height = calcRowHeight({
               value: uraian,
               width: 92 * 7.16,
               font: '10pt Arial',
               bold: true,
               min_height: 15,
            })
         } else {
            ws.mergeCellsWithoutStyle(row.number, 6, row.number, 8)
            row.height = calcRowHeight({
               value: uraian,
               width: 70 * 7.16,
               font: '10pt Arial',
               bold: true,
               min_height: 15,
            })
         }
      }
      ws.addConditionalFormatting({
         ref: row.getCell(14).address,
         rules: [
            {
               type: 'cellIs',
               priority: 1,
               operator: 'lessThan',
               formulae: [pagu_murni - 0.5],
               style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFE0D9' } } },
            },
            {
               type: 'cellIs',
               priority: 2,
               operator: 'greaterThan',
               formulae: [pagu_murni + 0.5],
               style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: '00FFFF' } } },
            },
         ],
      })
      ws.addConditionalFormatting({
         ref: row.getCell(19).address,
         rules: [
            {
               type: 'cellIs',
               priority: 1,
               operator: 'lessThan',
               formulae: [pagu - 0.5],
               style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFE0D9' } } },
            },
            {
               type: 'cellIs',
               priority: 2,
               operator: 'greaterThan',
               formulae: [pagu + 0.5],
               style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: '00FFFF' } } },
            },
         ],
      })
      ws.addConditionalFormatting({
         ref: row.getCell(20).address,
         rules: [
            {
               type: 'cellIs',
               priority: 1,
               operator: 'lessThan',
               formulae: [0],
               style: { font: { color: { argb: 'C00000' } } },
            },
            {
               type: 'cellIs',
               priority: 2,
               operator: 'greaterThan',
               formulae: [0],
               style: { font: { color: { argb: '0000CC' } } },
            },
         ],
      })

      borderAll({ row, ws, bold: !isRinci })
   }
   const row = ws.addRow(undefined)
   row.height = 7
   fillKepala({ ws, skpd })
   fillKeterangan({ ws })
   fillTapd({ ws, tapd })
   ws.headerFooter.oddFooter = `&L&\"Arial\"&9&I${footer}&R&\"Arial\"&9&B- &P -`
   const password = skpd?.kode_skpd?.slice(-4)
   await ws.protect(password, {
      insertRows: true,
      formatRows: true,
      formatColumns: true,
      formatCells: true,
   })
   const buf = await wb.xlsx.writeBuffer()
   saveAs(new Blob([buf]), `${namaFile.replace(/[^\w\s]|(?!\S)\s+/g, ' ')}.xlsx`)
}

export default dowloadRekapBlRkpa

function fillDokJudul({
   ws,
   dokumen,
   skpd,
   tahun,
}: {
   ws: Excel.Worksheet
   dokumen: Data['dokumen']
   skpd: Data['skpd']
   tahun: number
}): void {
   const data_judul = createExcelData({
      l: 3,
      c: false,
      d: {
         0: createExcelData({
            l: 21,
            d: {
               1: dokumen?.title?.toLocaleUpperCase('ID'),
               18: `FORMULIR\n${dokumen.kode}-BELANJA\nSKPD`,
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
      ws.mergeCells(row.number, 1, row.number, 17)
   })
   ws.mergeCells(rows_judul[0].number, 18, rows_judul[rows_judul.length - 1].number, 21)
   ws.addRow(undefined)
   const data_roganisasi = []
   data_roganisasi[1] = 'Organisasi'
   data_roganisasi[4] = ':'
   data_roganisasi[5] = skpd.kode_skpd + '  ' + skpd.nama_skpd
   const row_org = ws.addRow(data_roganisasi)
   ws.mergeCells(row_org.number, 1, row_org.number, 4)
   ws.mergeCells(row_org.number, 5, row_org.number, 21)
   const rowheader = ws.addRow([dokumen.header])
   ws.mergeCells(rowheader.number, 1, rowheader.number, 21)
   borderAll({ row: rowheader, ws, bold: true, center: true, wrapText: true })
}

function fillTableHead({ ws }: { ws: Excel.Worksheet }) {
   const data_th = createExcelData({
      l: 4,
      d: {
         0: createExcelData({
            l: 21,
            d: {
               1: 'Urusan',
               2: 'Bidang Urusuan',
               3: 'Program',
               4: 'Kegiatan',
               5: 'Sub Kegiatan',
               6: 'URAIAN',
               7: 'SUMBER DANA',
               8: 'LOKASI',
               9: 'JUMLAH',
            },
         }),
         1: createExcelData({
            l: 21,
            d: {
               9: 'T-1',
               10: 'Tahun N',
               21: 'T+1',
            },
         }),
         2: createExcelData({
            l: 21,
            d: {
               10: 'Sebelum',
               15: 'Setelah',
               20: 'Bertambah/\nBerkurang',
            },
         }),
         3: createExcelData({
            l: 21,
            d: {
               10: 'Belanja Operasi',
               11: 'Belanja Modal',
               12: 'Belanja Tak Terduga',
               13: 'Belanja Transfer',
               14: 'Jumlah',
               15: 'Belanja Operasi',
               16: 'Belanja Modal',
               17: 'Belanja Tak Terduga',
               18: 'Belanja Transfer',
               19: 'Jumlah',
            },
         }),
      },
      c: false,
   })
   ws.addRow(undefined)
   const row_th = ws.addRows(data_th)
   row_th.map((row, i) => {
      borderAll({ row, ws, bold: true, center: true, wrapText: true })
      if (i === 0) {
         row.eachCell({ includeEmpty: true }, (cell, col) => {
            if (col <= 5) {
               cell.style = {
                  ...cell.style,
                  alignment: { ...cell?.style?.alignment, textRotation: 90, wrapText: true },
               }
            }
         })
         ws.mergeCells(row.number, 9, row.number, 21)
      } else if (i === 1) {
         ws.mergeCells(row.number, 10, row.number, 20)
      } else if (i === 2) {
         ws.mergeCells(row.number, 10, row.number, 14)
         ws.mergeCells(row.number, 15, row.number, 19)
      } else if (i === 3) {
         ws.mergeCells(row.number, 1, row.number - 3, 1)
         ws.mergeCells(row.number, 2, row.number - 3, 2)
         ws.mergeCells(row.number, 3, row.number - 3, 3)
         ws.mergeCells(row.number, 4, row.number - 3, 4)
         ws.mergeCells(row.number, 5, row.number - 3, 5)
         ws.mergeCells(row.number, 6, row.number - 3, 6)
         ws.mergeCells(row.number, 7, row.number - 3, 7)
         ws.mergeCells(row.number, 8, row.number - 3, 8)
         ws.mergeCells(row.number, 9, row.number - 2, 9)
         ws.mergeCells(row.number, 20, row.number - 1, 20)
         ws.mergeCells(row.number, 21, row.number - 2, 21)
      }
   })
   const data_column = Array.from({ length: 21 }, (_, index) => {
      if (index === 13) {
         return `${index + 1}=(10+11+12+13)`
      } else if (index === 18) {
         return `${index + 1}=(15+16+17+18)`
      } else if (index === 19) {
         return `${index + 1}=(19-14)`
      } else {
         return String(index + 1)
      }
   })

   const row_column = ws.addRow(data_column)
   borderAll({ row: row_column, ws, center: true, wrapText: false, italic: true })
   ws.pageSetup = {
      fitToWidth: 1,
      fitToPage: true,
      fitToHeight: 0,
      orientation: 'landscape',
      showGridLines: false,
      margins: { left: 0.5, right: 0.5, top: 0.6, bottom: 0.6, header: 0.2, footer: 0.2 },
      printTitlesRow: `${row_th[0].number}:${row_column.number}`,
   }
   return row_column.number
}

function fillKepala({ ws, skpd }: { ws: Excel.Worksheet; skpd: Data['skpd'] }) {
   const data = createExcelData({
      l: !skpd?.pangkat_kepala ? 5 : 6,
      d: {
         1: createExcelData({
            l: 21,
            d: { 14: 'Lewoleba, __________________' },
         }),
         2: createExcelData({
            l: 21,
            d: { 14: skpd?.nama_jabatan_kepala },
         }),
         4: createExcelData({
            l: 21,
            d: { 14: skpd?.nama_kepala },
         }),
         5: createExcelData({
            l: 21,
            d: { 14: skpd?.pangkat_kepala ?? `NIP.${skpd.nip_kepala}` },
         }),
         6: !skpd?.pangkat_kepala
            ? undefined
            : createExcelData({
                 l: 21,
                 d: { 14: `NIP.${skpd.nip_kepala}` },
              }),
      },
      c: true,
   })
   const rows = ws.addRows(data)
   rows.map((row, i) => {
      ws.mergeCellsWithoutStyle(row.number, 14, row.number, 21)
      const cell = row.getCell(14)
      const style = cell.style
      cell.style = {
         ...style,
         numFmt: '@',
         alignment: { ...style.alignment, horizontal: 'center', wrapText: true },
         font: {
            ...style.font,
            underline: i === 3,
            size: 12,
            bold: i >= 1 && i <= 3,
         },
      }
      row.height = i === 2 ? 30 : 18
   })

   const row = ws.addRow(undefined)
   row.height = 7
   return row.number
}

function fillKeterangan({ ws }: { ws: Excel.Worksheet }) {
   const data = createExcelData({
      l: 6,
      d: {
         1: createExcelData({
            l: 21,
            d: { 1: 'Pembahasan', 5: ':' },
         }),
         2: createExcelData({
            l: 21,
            d: { 1: 'Tanggal', 5: ':' },
         }),
         3: createExcelData({
            l: 21,
            d: { 1: 'Catatan', 5: ':' },
         }),
         4: createExcelData({
            l: 21,
            d: { 1: '1.' },
         }),
         5: createExcelData({
            l: 21,
            d: { 1: '2.' },
         }),
         6: createExcelData({
            l: 21,
            d: { 1: 'dst.' },
         }),
      },
      c: true,
   })
   const rows = ws.addRows(data)
   rows.map((row, i) => {
      if (i < 3) {
         ws.mergeCellsWithoutStyle(row.number, 1, row.number, 4)
         ws.mergeCellsWithoutStyle(row.number, 5, row.number, 21)
      } else {
         ws.mergeCellsWithoutStyle(row.number, 2, row.number, 21)
      }
      row.eachCell({ includeEmpty: true }, (cell) => {
         cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
            bottom: { style: 'thin' },
         }
      })
   })
}

export type Tapd = {
   nama: string
   jabatan: string
   nip: string
   id: string
}

function fillTapd({
   tapd = manifest?.data_tapd,
   ws,
}: {
   tapd?: Tapd[] | null
   ws: Excel.Worksheet
}) {
   const title = 'TIM ANGGARAN PEMERINTAH DAERAH'
   const rowTitile = ws.addRow([title])
   ws.mergeCellsWithoutStyle(rowTitile.number, 1, rowTitile.number, 21)
   borderAll({ row: rowTitile, ws, bold: true, center: true })
   const header = createExcelData({
      l: 21,
      d: {
         1: 'NO.',
         3: 'NAMA',
         7: 'NIP',
         9: 'JABATAN',
         16: 'Tanda Tangan',
      },
   })
   const row = ws.addRow(header)
   row.height = 20
   ws.mergeCellsWithoutStyle(row.number, 1, row.number, 2)
   ws.mergeCellsWithoutStyle(row.number, 3, row.number, 6)
   ws.mergeCellsWithoutStyle(row.number, 7, row.number, 8)
   ws.mergeCellsWithoutStyle(row.number, 9, row.number, 15)
   ws.mergeCellsWithoutStyle(row.number, 16, row.number, 21)
   borderAll({ row, ws, bold: true, center: true })
   tapd?.map((item, i) => {
      const data = createExcelData({
         l: 21,
         d: {
            1: i + 1 + '.',
            3: item.nama,
            7: item.nip,
            9: item.jabatan,
         },
      })
      const row = ws.addRow(data)
      ws.mergeCellsWithoutStyle(row.number, 1, row.number, 2)
      ws.mergeCellsWithoutStyle(row.number, 3, row.number, 6)
      ws.mergeCellsWithoutStyle(row.number, 7, row.number, 8)
      ws.mergeCellsWithoutStyle(row.number, 9, row.number, 15)
      ws.mergeCellsWithoutStyle(row.number, 16, row.number, 21)
      borderAll({ row, ws })
      row.eachCell((cell) => {
         const col = parseFloat(cell.col)
         col === 9 && (cell.style.alignment = { vertical: 'middle', horizontal: 'left' })
      })
      row.height = 20
   })
}
