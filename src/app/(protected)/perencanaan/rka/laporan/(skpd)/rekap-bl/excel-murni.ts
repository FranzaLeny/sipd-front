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
   const colomsAkun = listAkun?.map((akun) => ({
      key: akun?.kode_akun,
      style: numStyle,
      width: 11.71,
   }))
   ws.columns = [
      { key: 'kd_1', width: 2.71, style: textStyle },
      { key: 'kd_2', width: 3.71, style: textStyle },
      { key: 'kd_3', width: 3.71, style: textStyle },
      { key: 'kd_4', width: 4.71, style: textStyle },
      { key: 'kd_5', width: 5.71, style: textStyle },
      { key: 'uraian', width: 30.71, style: textStyle },
      { key: 'dana', width: 15.71, style: textStyle },
      { key: 'lokasi', width: 8.71, style: textStyle },
      { key: '1_n', width: 3.71, style: numStyle },
      ...colomsAkun,
      { key: 'jumlah', style: numStyle, width: 11.71 },
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

const dowloadRekapBlRka = async (data: Data) => {
   const { dokumen, items, skpd, tapd, tahun, listAkun, isFormula } = data
   const akunLength = listAkun?.length
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
      if (items?.length) {
         for (let i = 9; i <= akunLength + 11; i++) {
            const column = numberToColumn(i)
            data.push({ formula: `=SUBTOTAL(9,${column}${nextRow}:${column}${endRow})` })
         }
      }

      return data
   }

   const wb = new Excel.Workbook()
   const ws = wb.addWorksheet(sheet_name)
   formatDefaultRka(ws, listAkun)
   fillDokJudul({ ws, dokumen, tahun, skpd, akunLength })
   const starRow = fillTableHead({ ws, listAkun })
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
         level,
         lokasi,
         pagu_n_lalu,
         pagu_n_depan,
         kode,
         pagu,
         id_sub_bl,
      } = rinci
      const isTotal = group === 'jumlah'
      let rincian = listAkun?.map((akun) => belanja[akun?.kode_akun])
      if (isFormula) {
         rincian = listAkun?.map((akun) => ({
            formula: `=IFERROR(_${id_sub_bl}.${akun?.kode_akun},0)`,
         }))
      }

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
            ...rincian,
            {
               formula: `=SUM(${numberToColumn(10)}${currRow}:${numberToColumn(10 + akunLength - 1)}${currRow})`,
            },
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
               width: 70 * 7.16,
               font: '10pt Arial',
               bold: true,
               min_height: 15,
            })
         } else {
            ws.mergeCellsWithoutStyle(row.number, 6, row.number, 8)
            row.height = calcRowHeight({
               value: uraian,
               width: 48 * 7.16,
               font: '10pt Arial',
               bold: true,
               min_height: 15,
            })
         }
      } else {
         ws.getCell(row?.number, 6).name = `rekap.${id_sub_bl}`
      }

      ws.addConditionalFormatting({
         ref: row.getCell(10 + akunLength).address,
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

      borderAll({ row, ws, bold: !isRinci, excludeColumns: [12 + akunLength, 13 + akunLength] })
   }
   const row = ws.addRow(undefined)
   row.height = 7
   fillKepala({ ws, skpd, akunLength })
   fillKeterangan({ ws, akunLength })
   const endRow = fillTapd({ ws, tapd, akunLength })
   ws.headerFooter.oddFooter = `&L&\"Arial\"&9&I${footer}&R&\"Arial\"&9&B- &P -`
   ws.pageSetup.printArea = `A1:${numberToColumn(akunLength + 11)}${endRow}`
   const buf = await wb.xlsx.writeBuffer()
   saveAs(new Blob([buf]), `${namaFile.replace(/[^\w\s]|(?!\S)\s+/g, ' ')}.xlsx`)
}

export default dowloadRekapBlRka

function fillDokJudul({
   ws,
   dokumen,
   skpd,
   tahun,
   akunLength,
}: {
   ws: Excel.Worksheet
   dokumen: Data['dokumen']
   skpd: Data['skpd']
   tahun: number
   akunLength: number
}): number {
   const data_judul = createExcelData({
      l: 3,
      c: false,
      d: {
         0: createExcelData({
            l: 15,
            d: {
               1: dokumen?.title?.toLocaleUpperCase('ID'),
               12: `FORMULIR\n${dokumen.kode}-BELANJA\nSKPD`,
            },
         }),
         1: createExcelData({ l: 15, d: { 1: 'SATUAN KERJA PERANGKAT DAERAH' } }),
         2: createExcelData({
            l: 15,
            d: { 1: `Pemerintahan Kab. Lembata Tahun Anggaran ${tahun}` },
         }),
      },
   })
   const rows_judul = ws.addRows(data_judul)
   rows_judul.map((row) => {
      borderAll({ row, ws, bold: true, center: true, wrapText: true })
      ws.mergeCells(row.number, 1, row.number, 7 + akunLength)
   })
   ws.mergeCells(
      rows_judul[0].number,
      akunLength + 8,
      rows_judul[rows_judul.length - 1].number,
      akunLength + 11
   )
   ws.addRow(undefined)
   const data_roganisasi = []
   data_roganisasi[1] = 'Organisasi'
   data_roganisasi[4] = ':'
   data_roganisasi[5] = skpd.kode_skpd + '  ' + skpd.nama_skpd
   const row_org = ws.addRow(data_roganisasi)
   ws.mergeCells(row_org.number, 1, row_org.number, 4)
   ws.mergeCells(row_org.number, 5, row_org.number, akunLength + 11)
   const rowheader = ws.addRow([dokumen.header])
   ws.mergeCells(rowheader.number, 1, rowheader.number, akunLength + 11)
   borderAll({ row: rowheader, ws, bold: true, center: true, wrapText: true })
   return rowheader?.number
}

function fillTableHead({
   ws,
   listAkun,
}: {
   ws: Excel.Worksheet
   listAkun: ListAkunBlLaporanBlSkpd[]
}) {
   const akunLength = listAkun?.length
   const data_th = createExcelData({
      l: 3,
      d: {
         0: createExcelData({
            l: 11 + akunLength,
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
            l: 11 + akunLength,
            d: {
               9: 'T-1',
               10: 'Tahun N',
               15: 'T+1',
            },
         }),
         2: createExcelData({
            l: 11 + akunLength,
            d: {
               ...listAkun?.reduce(
                  (prev, curr, i) => {
                     return { [10 + i]: curr?.nama_akun, ...prev }
                  },
                  {} as Record<number, string>
               ),
               [10 + akunLength]: 'Jumlah',
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
         ws.mergeCells(row.number, 1, row.number + 2, 1)
         ws.mergeCells(row.number, 2, row.number + 2, 2)
         ws.mergeCells(row.number, 3, row.number + 2, 3)
         ws.mergeCells(row.number, 4, row.number + 2, 4)
         ws.mergeCells(row.number, 5, row.number + 2, 5)
         ws.mergeCells(row.number, 9, row.number, akunLength + 11)
      } else if (i === 1) {
         ws.mergeCells(row.number, 10, row.number, akunLength + 10)
      } else if (i === 2) {
         ws.mergeCells(row.number, 6, row.number - 2, 6)
         ws.mergeCells(row.number, 7, row.number - 2, 7)
         ws.mergeCells(row.number, 8, row.number - 2, 8)
         ws.mergeCells(row.number, 9, row.number - 1, 9)
         ws.mergeCells(row.number, akunLength + 11, row.number - 1, akunLength + 11)
      }
   })
   const sumMurni = listAkun.reduce((a: string, _, b) => (!!a ? a + '+' + (b + 10) : '10'), '')
   const data_column = Array.from({ length: akunLength + 11 }, (_, index) => {
      if (index === akunLength + 9) {
         return `${index + 1}=(${sumMurni})`
      } else {
         return String(index + 1)
      }
   })

   const row_column = ws.addRow(data_column)
   borderAll({ row: row_column, ws, center: true, wrapText: false, italic: true })
   ws.pageSetup = {
      paperSize: 9,
      fitToWidth: 1,
      fitToPage: true,
      fitToHeight: 0,
      orientation: 'portrait',
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
   akunLength,
}: {
   ws: Excel.Worksheet
   skpd: Data['skpd']
   akunLength: number
}) {
   const data = createExcelData({
      l: !skpd?.pangkat_kepala ? 5 : 6,
      d: {
         1: createExcelData({
            l: akunLength + 11,
            d: { [akunLength + 7]: 'Lewoleba, __________________' },
         }),
         2: createExcelData({
            l: akunLength + 11,
            d: { [akunLength + 7]: skpd?.nama_jabatan_kepala },
         }),
         4: createExcelData({
            l: akunLength + 11,
            d: { [akunLength + 7]: skpd?.nama_kepala },
         }),
         5: createExcelData({
            l: akunLength + 11,
            d: { [akunLength + 7]: skpd?.pangkat_kepala ?? `NIP.${skpd.nip_kepala}` },
         }),
         6: !skpd?.pangkat_kepala
            ? undefined
            : createExcelData({
                 l: akunLength + 11,
                 d: { 11: `NIP.${skpd.nip_kepala}` },
              }),
      },
      c: true,
   })
   const rows = ws.addRows(data)
   rows.map((row, i) => {
      ws.mergeCellsWithoutStyle(row.number, akunLength + 7, row.number, akunLength + 11)
      const cell = row.getCell(akunLength + 7)
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

function fillKeterangan({ ws, akunLength }: { ws: Excel.Worksheet; akunLength: number }) {
   const data = createExcelData({
      l: 6,
      d: {
         1: createExcelData({
            l: akunLength + 11,
            d: { 1: 'Pembahasan', 5: ':' },
         }),
         2: createExcelData({
            l: akunLength + 11,
            d: { 1: 'Tanggal', 5: ':' },
         }),
         3: createExcelData({
            l: akunLength + 11,
            d: { 1: 'Catatan', 5: ':' },
         }),
         4: createExcelData({
            l: akunLength + 11,
            d: { 1: '1.' },
         }),
         5: createExcelData({
            l: akunLength + 11,
            d: { 1: '2.' },
         }),
         6: createExcelData({
            l: akunLength + 11,
            d: { 1: 'dst.' },
         }),
      },
      c: true,
   })
   const rows = ws.addRows(data)
   rows.map((row, i) => {
      if (i < 3) {
         ws.mergeCellsWithoutStyle(row.number, 1, row.number, 4)
         ws.mergeCellsWithoutStyle(row.number, 5, row.number, akunLength + 11)
      } else {
         ws.mergeCellsWithoutStyle(row.number, 1, row.number, 2)
         ws.mergeCellsWithoutStyle(row.number, 3, row.number, akunLength + 11)
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
   akunLength,
}: {
   tapd?: Tapd[] | null
   ws: Excel.Worksheet
   akunLength: number
}) {
   const title = 'TIM ANGGARAN PEMERINTAH DAERAH'
   const rowTitile = ws.addRow([title])
   ws.mergeCellsWithoutStyle(rowTitile.number, 1, rowTitile.number, akunLength + 11)
   borderAll({ row: rowTitile, ws, bold: true, center: true })
   const header = createExcelData({
      l: akunLength + 11,
      d: {
         1: 'NO.',
         3: 'NAMA',
         7: 'NIP',
         9: 'JABATAN',
         13: 'Tanda Tangan',
      },
   })
   const row = ws.addRow(header)
   row.height = 20
   ws.mergeCellsWithoutStyle(row.number, 1, row.number, 2)
   ws.mergeCellsWithoutStyle(row.number, 3, row.number, 6)
   ws.mergeCellsWithoutStyle(row.number, 7, row.number, 8)
   ws.mergeCellsWithoutStyle(row.number, 9, row.number, 12)
   ws.mergeCellsWithoutStyle(row.number, 13, row.number, akunLength + 11)
   borderAll({ row, ws, bold: true, center: true })
   let lastRow = row?.number
   tapd?.map((item, i) => {
      const data = createExcelData({
         l: 15,
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
      ws.mergeCellsWithoutStyle(row.number, 9, row.number, 12)
      ws.mergeCellsWithoutStyle(row.number, 13, row.number, akunLength + 11)
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
