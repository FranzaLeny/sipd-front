import manifest from '@constants/tpd.json'
import { borderAll, calcRowHeight, createExcelData, textStyle } from '@utils/excel'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

function formatDefaultRka(ws: Excel.Worksheet) {
   ws.columns = [
      { key: 'kd_1', width: 4.71, style: textStyle },
      { key: 'kd_2', width: 4.71, style: textStyle },
      { key: 'kd_3', width: 4.71, style: textStyle },
      { key: 'uraian', width: 30.71, style: textStyle },
      { key: 'uraian2', width: 30.71, style: textStyle },
      { key: 'jumlah', width: 16.71, style: textStyle },
      { key: 'jumlah2', width: 16.71, style: textStyle },
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
   items: ItemLaporanRkaSKpd[]
   tahun: number
}

const downloadBlRka = async (data: Data) => {
   const { dokumen, items, skpd, tapd, tahun } = data
   const title = dokumen.kode + '_' + skpd?.kode_skpd?.substring(0, 6) + '_' + skpd?.nama_skpd
   const namaFile = title?.substring(0, 120)?.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_') + '_03_SKPD'
   const sheet_name = 'SKPD_' + skpd?.kode_skpd?.substring(0, 6)
   let footer = dokumen?.kode + ' || ' + skpd?.kode_skpd + ' - ' + skpd?.nama_skpd
   if (footer.length > 150) {
      footer = footer.substring(0, 150) + '...'
   }
   // const generateSubTotal = (level: number, index: number, nextRow: number) => {
   //    const lastIndex = items.findIndex((d, i) => i > index && d.level <= level)
   //    const endRow = lastIndex === -1 ? lastRow : starRow + lastIndex
   //    let data: { formula: string }[] = []
   //    for (let i = 9; i <= 15; i++) {
   //       const column = numberToColumn(i)
   //       data.push({ formula: `=SUBTOTAL(9,${column}${nextRow}:${column}${endRow})` })
   //    }
   //    return data
   // }

   const wb = new Excel.Workbook()
   const ws = wb.addWorksheet(sheet_name)
   formatDefaultRka(ws)
   fillDokJudul({ ws, dokumen, tahun, skpd })
   const starRow = fillTableHead({ ws })
   const lastRow = starRow + items.length - 1
   for (let [index, rinci] of items.entries()) {
      const { kode, nama_akun, total_harga } = rinci
      const isJumlah = rinci?.kode_akun?.endsWith('.X')
      const isRinci = rinci?.kode_akun?.split('.').length === 3
      const akun = isJumlah ? [nama_akun, null, null, null] : [...kode, nama_akun]
      const rowData: any[] = [...akun, null, total_harga, null]
      const row = ws.addRow(rowData)
      isJumlah
         ? ws.mergeCellsWithoutStyle(row.number, 1, row.number, 5)
         : ws.mergeCellsWithoutStyle(row.number, 4, row.number, 5)
      ws.mergeCellsWithoutStyle(row.number, 6, row.number, 7)
      row.height = calcRowHeight({
         value: nama_akun,
         width: 60 * 7.16,
         font: '10pt Arial',
         bold: true,
         min_height: 15,
      })
      borderAll({ row, ws, bold: !isRinci })
   }
   const row = ws.addRow(undefined)
   row.height = 7
   fillKepala({ ws, skpd })
   fillKeterangan({ ws })
   fillTapd({ ws, tapd })
   ws.headerFooter.oddFooter = `&L&\"Arial\"&9&I${footer}&R&\"Arial\"&9&B- &P -`

   const buf = await wb.xlsx.writeBuffer()
   saveAs(new Blob([buf]), `${namaFile.replace(/[^\w\s]|(?!\S)\s+/g, ' ')}.xlsx`)
}

export default downloadBlRka

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
            l: 7,
            d: {
               1: dokumen?.title?.toLocaleUpperCase('ID'),
               6: `FORMULIR\n${dokumen.kode}-BELANJA\nSKPD`,
            },
         }),
         1: createExcelData({ l: 7, d: { 1: 'SATUAN KERJA PERANGKAT DAERAH' } }),
         2: createExcelData({
            l: 7,
            d: { 1: `Pemerintahan Kab. Lembata Tahun Anggaran ${tahun}` },
         }),
      },
   })
   const rows_judul = ws.addRows(data_judul)
   rows_judul.map((row) => {
      borderAll({ row, ws, bold: true, center: true, wrapText: true })
      ws.mergeCellsWithoutStyle(row.number, 1, row.number, 5)
   })
   ws.mergeCellsWithoutStyle(rows_judul[0].number, 6, rows_judul[rows_judul.length - 1].number, 7)
   ws.addRow(undefined)
   const data_roganisasi = []
   data_roganisasi[1] = 'Organisasi :'
   data_roganisasi[4] = skpd.kode_skpd + '  ' + skpd.nama_skpd
   const row_org = ws.addRow(data_roganisasi)
   ws.mergeCellsWithoutStyle(row_org.number, 1, row_org.number, 3)
   ws.mergeCellsWithoutStyle(row_org.number, 4, row_org.number, 7)
   const rowheader = ws.addRow([dokumen.header])
   ws.mergeCellsWithoutStyle(rowheader.number, 1, rowheader.number, 7)
   borderAll({ row: rowheader, ws, bold: true, center: true, wrapText: true })
}

function fillTableHead({ ws }: { ws: Excel.Worksheet }) {
   const data_th = ['Kode Rekening', null, null, 'Uraian', null, 'Jumlah (Rp)', null]
   ws.addRow(undefined)
   const rowTh = ws.addRow(data_th)
   ws.mergeCellsWithoutStyle(rowTh.number, 1, rowTh.number, 3)
   ws.mergeCellsWithoutStyle(rowTh.number, 4, rowTh.number, 5)
   ws.mergeCellsWithoutStyle(rowTh.number, 6, rowTh.number, 7)

   borderAll({ row: rowTh, ws, bold: true, center: true, wrapText: true })

   ws.pageSetup = {
      paperSize: 9,
      fitToWidth: 1,
      fitToPage: true,
      fitToHeight: 0,
      orientation: 'portrait',
      showGridLines: false,
      margins: { left: 0.5, right: 0.5, top: 0.6, bottom: 0.6, header: 0.2, footer: 0.2 },
      printTitlesRow: `${rowTh.number}:${rowTh.number}`,
   }
   ws.getCell('F1').name = 'RINGKASAN_SKPD'
   return rowTh.number
}

function fillKepala({ ws, skpd }: { ws: Excel.Worksheet; skpd: Data['skpd'] }) {
   const data = createExcelData({
      l: !skpd?.pangkat_kepala ? 5 : 6,
      d: {
         1: createExcelData({
            l: 7,
            d: { 6: 'Lewoleba, __________________' },
         }),
         2: createExcelData({
            l: 7,
            d: { 6: skpd?.nama_jabatan_kepala },
         }),
         4: createExcelData({
            l: 7,
            d: { 6: skpd?.nama_kepala },
         }),
         5: createExcelData({
            l: 7,
            d: { 6: skpd?.pangkat_kepala ?? `NIP.${skpd.nip_kepala}` },
         }),
         6: !skpd?.pangkat_kepala
            ? undefined
            : createExcelData({
                 l: 7,
                 d: { 6: `NIP.${skpd.nip_kepala}` },
              }),
      },
      c: true,
   })
   const rows = ws.addRows(data)
   rows.map((row, i) => {
      ws.mergeCellsWithoutStyle(row.number, 6, row.number, 7)
      const cell = row.getCell(6)
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
            l: 7,
            d: { 1: 'Pembahasan', 4: ':' },
         }),
         2: createExcelData({
            l: 7,
            d: { 1: 'Tanggal', 4: ':' },
         }),
         3: createExcelData({
            l: 7,
            d: { 1: 'Catatan', 4: ':' },
         }),
         4: createExcelData({
            l: 7,
            d: { 1: '1.' },
         }),
         5: createExcelData({
            l: 7,
            d: { 1: '2.' },
         }),
         6: createExcelData({
            l: 7,
            d: { 1: 'dst.' },
         }),
      },
      c: true,
   })
   const rows = ws.addRows(data)
   rows.map((row, i) => {
      if (i < 3) {
         ws.mergeCellsWithoutStyle(row.number, 1, row.number, 3)
         ws.mergeCellsWithoutStyle(row.number, 4, row.number, 7)
      } else {
         ws.mergeCellsWithoutStyle(row.number, 2, row.number, 7)
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
   ws.mergeCellsWithoutStyle(rowTitile.number, 1, rowTitile.number, 7)
   borderAll({ row: rowTitile, ws, bold: true, center: true })
   const header = createExcelData({
      l: 7,
      d: {
         1: 'NO.',
         2: 'NAMA',
         5: 'NIP',
         6: 'JABATAN',
         7: 'Tanda Tangan',
      },
   })
   const row = ws.addRow(header)
   row.height = 20
   ws.mergeCellsWithoutStyle(row.number, 2, row.number, 4)
   borderAll({ row, ws, bold: true, center: true })
   tapd?.map((item, i) => {
      const data = createExcelData({
         l: 7,
         d: {
            1: i + 1 + '.',
            2: item.nama,
            5: item.nip,
            6: item.jabatan,
         },
      })
      const row = ws.addRow(data)
      ws.mergeCellsWithoutStyle(row.number, 2, row.number, 4)
      borderAll({ row, ws })
      row.eachCell((cell) => {
         const col = parseFloat(cell.col)
         col === 6 && (cell.style.alignment = { vertical: 'middle', horizontal: 'left' })
      })
      row.height = 20
   })
}
