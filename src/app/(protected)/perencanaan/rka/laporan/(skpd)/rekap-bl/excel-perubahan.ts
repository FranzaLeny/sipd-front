import manifest from '@constants/tpd.json'
import {
   borderAll,
   calcRowHeight,
   createExcelData,
   numberToColumn,
   numStyle,
   textStyle,
} from '@utils/excel'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

function formatDefaultRka(ws: Excel.Worksheet, listAkun: ListAkunBlLaporanBlSkpd[]) {
   const columnsAkun = listAkun?.map((akun) => ({
      key: akun?.kode_akun,
      style: numStyle,
      width: 11.71,
   }))
   const columnsAkunMurni = listAkun?.map((akun) => ({
      key: akun?.kode_akun + 'murni',
      style: numStyle,
      width: 11.71,
   }))
   ws.columns = [
      { key: 'kd_1', width: 4.29, style: textStyle },
      { key: 'kd_2', width: 4.29, style: textStyle },
      { key: 'kd_3', width: 4.29, style: textStyle },
      { key: 'kd_4', width: 5.29, style: textStyle },
      { key: 'kd_5', width: 5.29, style: textStyle },
      { key: 'uraian', width: 30.71, style: textStyle },
      { key: 'dana', width: 20.71, style: textStyle },
      { key: 'lokasi', width: 20.71, style: textStyle },
      { key: '1_n', width: 11.71, style: numStyle },
      ...columnsAkun,
      { key: 'jumlah_m', style: numStyle, width: 11.71 },
      ...columnsAkunMurni,
      { key: 'jumlah', style: numStyle, width: 11.71 },
      { key: 'selisih', style: numStyle, width: 11.71 },
      { key: 'n_1', style: numStyle, width: 11.71 },
      { key: 'kosong', style: numStyle, width: 11.71 },
      {
         key: 'sheet',
         style: {
            alignment: {
               vertical: 'middle',
               horizontal: 'left',
               wrapText: false,
               shrinkToFit: true,
               indent: 0.1,
            },
            font: { name: 'Arial', size: 10, bold: true },
         },
         width: 40.71,
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
   skpd: UnitLaporan
   tapd?: TapdLaporan[]
   items: ItemLaporanBlSkpd[]
   tahun: number
   listAkun: ListAkunBlLaporanBlSkpd[]
   isFormula: boolean
}

const dowloadRekapBlRkpa = async (data: Data) => {
   const { dokumen, items, skpd, tapd, tahun, isFormula, listAkun } = data
   const lAkun = listAkun?.length
   const lakun2 = lAkun * 2
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
      for (let i = 9; i <= 13 + lakun2; i++) {
         const column = numberToColumn(i)
         data.push({ formula: `=SUBTOTAL(9,${column}${nextRow}:${column}${endRow})` })
      }
      return data
   }

   const wb = new Excel.Workbook()
   const ws = wb.addWorksheet(sheet_name)
   formatDefaultRka(ws, listAkun)
   fillDokJudul({ ws, dokumen, tahun, skpd, lakun2 })
   const starRow = fillTableHead({ ws, listAkun })
   const lastRow = starRow + items.length - 1
   for (let [index, rinci] of items.entries()) {
      const nextRow = starRow + index + 2
      const currRow = starRow + index + 1
      const isRinci = rinci.group === 'sub_giat'
      const isSkpd = rinci?.group === 'sub_skpd'
      let {
         id_sub_bl,
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
         selisih,
      } = rinci
      const isTotal = group === 'jumlah'
      let rincian = listAkun?.map((akun) => belanja[akun?.kode_akun])
      const rincianMurni = listAkun?.map((akun) => belanja_murni[akun?.kode_akun])

      if (isTotal || isSkpd) {
         kode[0] = uraian
         uraian = ''
      }
      const item: any[] = [...kode, uraian, nama_dana, lokasi]
      if (isRinci) {
         const singkatan = uraian
            ?.replace(/[^a-zA-Z]/g, ' ')
            ?.replaceAll('dan', '')
            ?.replaceAll('pada', '')
            .split(' ')
            ?.map((x) => x?.substring(0, 4))
            ?.join('')
         const sheetName = (kode?.join('.')?.substring(5) + singkatan).substring(0, 30)
         const newItem = [
            pagu_n_lalu,
            ...rincianMurni,
            { formula: `=SUM(${numberToColumn(10)}${currRow}:${numberToColumn(13)}${currRow})` },
            ...rincian,
            { formula: `=SUM(${numberToColumn(15)}${currRow}:${numberToColumn(18)}${currRow})` },
            { formula: `=${numberToColumn(19)}${currRow}-${numberToColumn(14)}${currRow}` },
            pagu_n_depan,
            null,
            {
               formula: `=HYPERLINK("#_${id_sub_bl}.pagu","SHEET: ${sheetName}")`,
            },
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
      } else {
         ws.getCell(row?.number, 6).name = `rekap.${id_sub_bl}`
      }
      ws.addConditionalFormatting({
         ref: row.getCell(lAkun + 10).address,
         rules: [
            {
               type: 'cellIs',
               priority: 1,
               operator: 'lessThan',
               formulae: [pagu_murni],
               style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFE0D9' } } },
            },
            {
               type: 'cellIs',
               priority: 2,
               operator: 'greaterThan',
               formulae: [pagu_murni],
               style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: '00FFFF' } } },
            },
         ],
      })
      ws.addConditionalFormatting({
         ref: row.getCell(lakun2 + 11).address,
         rules: [
            {
               type: 'cellIs',
               priority: 1,
               operator: 'lessThan',
               formulae: [pagu],
               style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFE0D9' } } },
            },
            {
               type: 'cellIs',
               priority: 2,
               operator: 'greaterThan',
               formulae: [pagu],
               style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: '00FFFF' } } },
            },
         ],
      })
      ws.addConditionalFormatting({
         ref: row.getCell(lakun2 + 12).address,
         rules: [
            {
               type: 'cellIs',
               priority: 1,
               operator: 'lessThan',
               formulae: [selisih],
               style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFE0D9' } } },
            },
            {
               type: 'cellIs',
               priority: 2,
               operator: 'greaterThan',
               formulae: [selisih],
               style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: '00FFFF' } } },
            },
         ],
      })

      borderAll({ row, ws, bold: !isRinci, excludeColumns: [lakun2 + 14, lakun2 + 15] })
   }
   const row = ws.addRow(undefined)
   row.height = 7
   fillKepala({ ws, skpd, lakun2 })
   fillKeterangan({ ws, lakun2 })
   const endRow = fillTapd({ ws, tapd, lakun2 })
   ws.pageSetup.printArea = `A1:${numberToColumn(lakun2 + 13)}${endRow}`
   ws.headerFooter.oddFooter = `&L&\"Arial\"&9&I${footer}&R&\"Arial\"&9&B- &P -`

   const buf = await wb.xlsx.writeBuffer()
   saveAs(new Blob([buf]), `${namaFile.replace(/[^\w\s]|(?!\S)\s+/g, ' ')}.xlsx`)
}

export default dowloadRekapBlRkpa

function fillDokJudul({
   ws,
   dokumen,
   skpd,
   tahun,
   lakun2,
}: {
   ws: Excel.Worksheet
   dokumen: Data['dokumen']
   skpd: Data['skpd']
   tahun: number
   lakun2: number
}): void {
   const data_judul = createExcelData({
      l: 3,
      c: false,
      d: {
         0: createExcelData({
            l: 13 + lakun2,
            d: {
               1: dokumen?.title?.toLocaleUpperCase('ID'),
               [lakun2 + 10]: `FORMULIR\n${dokumen.kode}-BELANJA\nSKPD`,
            },
         }),
         1: createExcelData({ l: 13 + lakun2, d: { 1: 'SATUAN KERJA PERANGKAT DAERAH' } }),
         2: createExcelData({
            l: 13 + lakun2,
            d: { 1: `Pemerintahan Kab. Lembata Tahun Anggaran ${tahun}` },
         }),
      },
   })
   const rows_judul = ws.addRows(data_judul)
   rows_judul.map((row) => {
      borderAll({ row, ws, bold: true, center: true, wrapText: true })
      ws.mergeCells(row.number, 1, row.number, 9 + lakun2)
   })
   ws.mergeCells(
      rows_judul[0].number,
      10 + lakun2,
      rows_judul[rows_judul.length - 1].number,
      13 + lakun2
   )
   ws.addRow(undefined)
   const data_roganisasi = []
   data_roganisasi[1] = 'Organisasi'
   data_roganisasi[4] = ':'
   data_roganisasi[5] = skpd.kode_skpd + '  ' + skpd.nama_skpd
   const row_org = ws.addRow(data_roganisasi)
   ws.mergeCells(row_org.number, 1, row_org.number, 4)
   ws.mergeCells(row_org.number, 5, row_org.number, 13 + lakun2)
   const rowheader = ws.addRow([dokumen.header])
   ws.mergeCells(rowheader.number, 1, rowheader.number, 13 + lakun2)
   borderAll({ row: rowheader, ws, bold: true, center: true, wrapText: true })
}

function fillTableHead({
   ws,
   listAkun,
}: {
   ws: Excel.Worksheet
   listAkun: ListAkunBlLaporanBlSkpd[]
}) {
   const lAkun = listAkun?.length
   const arrBlank = Array.from({ length: lAkun }, (_, i) => i)
   const lAkun2 = lAkun * 2
   const data_th = createExcelData({
      l: 4,
      d: {
         0: createExcelData({
            l: lAkun2 + 13,
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
            l: lAkun2 + 13,
            d: {
               9: 'T-1',
               10: 'Tahun N',
               [lAkun2 + 13]: 'T+1',
            },
         }),
         2: createExcelData({
            l: lAkun2 + 13,
            d: {
               10: 'Sebelum',
               [lAkun + 11]: 'Setelah',
               [lAkun2 + 12]: 'Bertambah/\nBerkurang',
            },
         }),
         3: createExcelData({
            l: lAkun2 + 13,
            d: {
               ...listAkun?.reduce((prev, akun, i) => ({ ...prev, [10 + i]: akun?.nama_akun }), {}),
               [lAkun + 10]: 'Jumlah',
               ...listAkun?.reduce(
                  (prev, akun, i) => ({ ...prev, [11 + i + lAkun]: akun?.nama_akun }),
                  {}
               ),
               [lAkun2 + 11]: 'Jumlah',
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
         ws.mergeCells(row.number, 9, row.number, lAkun2 + 13)
      } else if (i === 1) {
         ws.mergeCells(row.number, 10, row.number, lAkun2 + 12)
      } else if (i === 2) {
         ws.mergeCells(row.number, 10, row.number, lAkun + 10)
         ws.mergeCells(row.number, lAkun + 11, row.number, lAkun + 11)
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
         ws.mergeCells(row.number, lAkun2 + 12, row.number - 1, lAkun2 + 12)
         ws.mergeCells(row.number, lAkun2 + 13, row.number - 2, lAkun2 + 13)
      }
   })
   const sumMurni = arrBlank.reduce((a: string, b) => (!!a ? a + '+' + (b + 10) : '10'), '')
   const sumPerubahan = arrBlank.reduce(
      (a: string, b) => (!!a ? a + '+' + (b + 11 + lAkun) : String(11 + lAkun)),
      ''
   )
   const data_column = Array.from({ length: lAkun2 + 13 }, (_, index) => {
      if (index === 9 + lAkun) {
         return `${index + 1}=(${sumMurni})`
      } else if (index === 10 + lAkun2) {
         return `${index + 1}=(${sumPerubahan})`
      } else if (index === 11 + lAkun2) {
         return `${index + 1}=(${11 + lAkun2}-${10 + lAkun})`
      } else {
         return String(index + 1)
      }
   })

   const row_column = ws.addRow(data_column)
   borderAll({ row: row_column, ws, center: true, wrapText: false, italic: true })
   ws.pageSetup = {
      fitToWidth: 1,
      paperSize: 9,
      fitToPage: true,
      fitToHeight: 0,
      orientation: 'landscape',
      blackAndWhite: true,
      showGridLines: false,
      margins: { left: 0.5, right: 0.5, top: 0.6, bottom: 0.6, header: 0.2, footer: 0.2 },
      printTitlesRow: `${row_th[0].number}:${row_column.number}`,
   }
   return row_column.number
}

function fillKepala({
   ws,
   skpd,
   lakun2,
}: {
   ws: Excel.Worksheet
   skpd: Data['skpd']
   lakun2: number
}) {
   const data = createExcelData({
      l: !skpd?.pangkat_kepala ? 5 : 6,
      d: {
         1: createExcelData({
            l: lakun2 + 13,
            d: { [lakun2 + 6]: 'Lewoleba, __________________' },
         }),
         2: createExcelData({
            l: lakun2 + 13,
            d: { [lakun2 + 6]: skpd?.nama_jabatan_kepala },
         }),
         4: createExcelData({
            l: lakun2 + 13,
            d: { [lakun2 + 6]: skpd?.nama_kepala },
         }),
         5: createExcelData({
            l: lakun2 + 13,
            d: { [lakun2 + 6]: skpd?.pangkat_kepala ?? `NIP.${skpd.nip_kepala}` },
         }),
         6: !skpd?.pangkat_kepala
            ? undefined
            : createExcelData({
                 l: lakun2 + 13,
                 d: { [lakun2 + 6]: `NIP.${skpd.nip_kepala}` },
              }),
      },
      c: true,
   })
   const rows = ws.addRows(data)
   rows.map((row, i) => {
      ws.mergeCellsWithoutStyle(row.number, lakun2 + 6, row.number, lakun2 + 13)
      const cell = row.getCell(lakun2 + 6)
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

function fillKeterangan({ ws, lakun2 }: { ws: Excel.Worksheet; lakun2: number }) {
   const data = createExcelData({
      l: 6,
      d: {
         1: createExcelData({
            l: lakun2 + 13,
            d: { 1: 'Pembahasan', 5: ':' },
         }),
         2: createExcelData({
            l: lakun2 + 13,
            d: { 1: 'Tanggal', 5: ':' },
         }),
         3: createExcelData({
            l: lakun2 + 13,
            d: { 1: 'Catatan', 5: ':' },
         }),
         4: createExcelData({
            l: lakun2 + 13,
            d: { 1: '1.' },
         }),
         5: createExcelData({
            l: lakun2 + 13,
            d: { 1: '2.' },
         }),
         6: createExcelData({
            l: lakun2 + 13,
            d: { 1: 'dst.' },
         }),
      },
      c: true,
   })
   const rows = ws.addRows(data)
   rows.map((row, i) => {
      if (i < 3) {
         ws.mergeCellsWithoutStyle(row.number, 1, row.number, 4)
         ws.mergeCellsWithoutStyle(row.number, 5, row.number, lakun2 + 13)
      } else {
         ws.mergeCellsWithoutStyle(row.number, 2, row.number, lakun2 + 13)
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
   lakun2,
}: {
   tapd?: Tapd[] | null
   ws: Excel.Worksheet
   lakun2: number
}) {
   const title = 'TIM ANGGARAN PEMERINTAH DAERAH'
   const rowTitile = ws.addRow([title])
   ws.mergeCellsWithoutStyle(rowTitile.number, 1, rowTitile.number, lakun2 + 13)
   borderAll({ row: rowTitile, ws, bold: true, center: true })
   const header = createExcelData({
      l: lakun2 + 13,
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
   ws.mergeCellsWithoutStyle(row.number, 9, row.number, lakun2 + 7)
   ws.mergeCellsWithoutStyle(row.number, lakun2 + 8, row.number, lakun2 + 13)
   borderAll({ row, ws, bold: true, center: true })
   let lastRow = row?.number
   tapd?.map((item, i) => {
      const data = createExcelData({
         l: lakun2 + 13,
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
      ws.mergeCellsWithoutStyle(row.number, 9, row.number, lakun2 + 7)
      ws.mergeCellsWithoutStyle(row.number, lakun2 + 8, row.number, lakun2 + 13)
      borderAll({ row, ws })
      row.eachCell((cell) => {
         const col = parseFloat(cell.col)
         col === 9 && (cell.style.alignment = { vertical: 'middle', horizontal: 'left' })
      })
      row.height = 20
      lastRow = row.number
   })
   return lastRow
}
