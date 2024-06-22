import manifest from '@constants/tpd.json'
import { borderAll, calcRowHeight, capitalizeFirstLetter, createExcelData } from '@utils/excel'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

interface SkpdSettings {
   nama_ibu_kota: string
   nomor_dpa: string
   tanggal: string
   nama_skpd: string
   kode_skpd: string
   nama_kepala_skpd: string
   nip_kepala_skpd: string
   nama_ppkd: string
   nip_ppkd: string
}

interface Rak {
   uraian: string
   januari: number
   februari: number
   maret: number
   april: number
   mei: number
   juni: number
   juli: number
   agustus: number
   september: number
   oktober: number
   november: number
   desember: number
   jumlah: number
}

interface RincianPergeseran {
   kode_rekening: string
   uraian: string
   sumber_dana: string
   lokasi: string
   t1: string
   sebelum_bel_operasi: number
   sebelum_bel_modal: number
   sebelum_bel_btt: number
   sebelum_bel_transfer: number
   sebelum_jumlah: number
   setelah_bel_operasi: number
   setelah_bel_modal: number
   setelah_bel_btt: number
   setelah_bel_transfer: number
   setelah_jumlah: number
   bertambah_berkurang: number
   t2: string
}

function formatDefaultRka(ws: Excel.Worksheet) {
   const style: Partial<Excel.Style> = {
      alignment: {
         vertical: 'middle',
         horizontal: 'left',
         wrapText: false,
         shrinkToFit: true,
         indent: 0.1,
      },
      font: { name: 'Arial', size: 10 },
      numFmt: '#,##0;[Red]-#,##0',
   }
   ws.columns = [
      { key: 'kd_u', width: 4, style: { ...style, numFmt: '@' } },
      { key: 'kd_bu', width: 4, style: { ...style, numFmt: '@' } },
      { key: 'kd_p', width: 4, style: { ...style, numFmt: '@' } },
      { key: 'kd_g', width: 5, style: { ...style, numFmt: '@' } },
      { key: 'kd_sg', width: 5, style: { ...style, numFmt: '@' } },
      {
         key: 'uraian',
         width: 30.71,
         style: {
            ...style,
            numFmt: '@',
            alignment: { ...style.alignment, wrapText: true, shrinkToFit: false },
         },
      },
      {
         key: 'dana',
         width: 20.71,
         style: {
            ...style,
            alignment: { ...style.alignment, wrapText: true, shrinkToFit: false },
            numFmt: '@',
         },
      },
      {
         key: 'lokasi',
         width: 20.71,
         style: {
            ...style,
            alignment: { ...style.alignment, wrapText: true, shrinkToFit: false },
            numFmt: '@',
         },
      },
      {
         key: '1_n',
         style: { ...style, alignment: { ...style.alignment, horizontal: 'right' } },
         width: 11,
      },
      {
         key: 'bo',
         width: 11,
         style: { ...style, alignment: { ...style.alignment, horizontal: 'right' } },
      },
      {
         key: 'bm',
         width: 11,
         style: { ...style, alignment: { ...style.alignment, horizontal: 'right' } },
      },
      {
         key: 'btt',
         width: 11,
         style: { ...style, alignment: { ...style.alignment, horizontal: 'right' } },
      },
      {
         key: 'bt',
         width: 11,
         style: { ...style, alignment: { ...style.alignment, horizontal: 'right' } },
      },
      {
         key: 'jumlah',
         width: 11,
         style: { ...style, alignment: { ...style.alignment, horizontal: 'right' } },
      },
      {
         key: '_bo',
         width: 11,
         style: { ...style, alignment: { ...style.alignment, horizontal: 'right' } },
      },
      {
         key: '_bm',
         width: 11,
         style: { ...style, alignment: { ...style.alignment, horizontal: 'right' } },
      },
      {
         key: '_btt',
         width: 11,
         style: { ...style, alignment: { ...style.alignment, horizontal: 'right' } },
      },
      {
         key: '_bt',
         width: 11,
         style: { ...style, alignment: { ...style.alignment, horizontal: 'right' } },
      },
      {
         key: '_jumlah',
         width: 11,
         style: { ...style, alignment: { ...style.alignment, horizontal: 'right' } },
      },
      {
         key: 'selisih',
         width: 11,
         style: { ...style, alignment: { ...style.alignment, horizontal: 'right' } },
      },
      {
         key: 'n_1',
         width: 11,
         style: { ...style, alignment: { ...style.alignment, horizontal: 'right' } },
      },
   ]
   ws.views = [{ showGridLines: false }]
}
type Params = {
   dokumen: {
      name: string
      title: string
      kode: string
      header: string
   }
   skpdSettings: SkpdSettings
   jabatanKepala: string
   pangkatKepala?: string
   rak: Rak[]
   items: RincianPergeseran[]
   tahun: number
   tapd?: Tapd[] | null
}
function numberToColumn(number: number) {
   let column = ''
   while (number > 0) {
      const remainder = (number - 1) % 26
      column = String.fromCharCode(65 + remainder) + column
      number = Math.floor((number - 1) / 26)
   }
   return column
}

function columnToNumber(column: string) {
   let number = 0
   const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
   for (let i = 0; i < column.length; i++) {
      const char = column.charAt(column.length - 1 - i).toUpperCase()
      const charValue = alphabet.indexOf(char) + 1
      number += charValue * Math.pow(26, i)
   }
   return number
}

const dowloadRkaBelanja = async (dpaRician: Params) => {
   const { dokumen, skpdSettings, items, rak, tahun, jabatanKepala, pangkatKepala, tapd } =
      dpaRician
   const isRancangan = dokumen?.kode?.startsWith('R')
   let namaFile =
      dokumen?.kode +
      '_' +
      skpdSettings?.kode_skpd?.substring(0, 7) +
      skpdSettings?.nama_skpd.substring(0, 100) +
      '_05_BELANJA'
   namaFile = namaFile?.replace(/[^\w.-]/g, ' ')?.replaceAll('.', '_')
   const sheet_name = 'BELANJA'
   let footer = skpdSettings.nama_skpd
   if (footer.length > 100) {
      footer = footer.substring(0, 100) + '...'
   }

   const generateSubTotal = (
      lengthKode: number,
      startIndex: number,
      nextRow: number,
      item: any[],
      isSkpd = false
   ) => {
      let data = item
      const lastIndex = items.findIndex(
         (d, i) =>
            i > startIndex &&
            ((isSkpd && d.kode_rekening.length === lengthKode) ||
               (!isSkpd && (d.kode_rekening.length <= lengthKode || d.kode_rekening.length === 22)))
      )
      const endRow = lastIndex === -1 ? lastRow : starRow + lastIndex
      for (let index = 9; index < 22; index++) {
         const column = numberToColumn(index)
         data[index - 1] = { formula: `=SUBTOTAL(9,${column}${nextRow}:${column}${endRow})` }
      }
      return data
   }

   const wb = new Excel.Workbook()
   const ws = wb.addWorksheet(sheet_name)
   formatDefaultRka(ws)
   fillDokJudul({ ws, dokumen, skpdSettings, tahun })
   fillTableHead({ ws })
   const starRow = ws.rowCount
   const lastRow = starRow + items.length
   for (const [index, rinci] of items.entries()) {
      const nextRow = starRow + index + 2
      const [korek, ...other] = Object.values(rinci)
      const isSubGiat = korek.length === 17
      const isSkpd = korek.length === 22
      const _kode = korek?.split('.')
      let item = [
         _kode[0],
         _kode[1] ?? undefined,
         _kode[2] ?? undefined,
         _kode[3] ? [_kode[3], _kode[4]].join('.') : undefined,
         _kode[5] ?? undefined,
         ...other,
      ]
      switch (korek.length) {
         case 22:
            item = [korek, undefined, undefined, undefined, undefined, ...other]
            item = generateSubTotal(22, index, nextRow, item, true)
            break
         case 12:
            item = generateSubTotal(12, index, nextRow, item)
            break
         case 7:
            item = generateSubTotal(7, index, nextRow, item)
            break
         case 4:
            item = generateSubTotal(4, index, nextRow, item)
            break
         case 1:
            item = generateSubTotal(1, index, nextRow, item)
            break
         default:
            item[8] = 0
            item[19] = {
               formula: `=${numberToColumn(19)}${starRow + index + 1}-${numberToColumn(14)}${starRow + index + 1}`,
            }
            item[20] = 0
            break
      }
      const row = ws.addRow(item)
      if (!isSubGiat) {
         ws.mergeCells(row.number, 6, row.number, 8)
         row.height = calcRowHeight({
            value: rinci?.uraian,
            width: 70 * 7,
            font: '10pt Arial',
            bold: true,
            min_height: 15,
         })
      }
      borderAll({ row, ws, bold: !isSubGiat })
      if (isSkpd) {
         ws.mergeCells(row.number, 1, row.number, 5)
         row.eachCell({ includeEmpty: true }, (cell) => {
            cell.style = {
               ...cell.style,
               fill: {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FDE9D9' },
               },
            }
         })
      }
   }
   fillRak({ jabatanKepala, rak, skpdSettings, ws, pangkatKepala, isRancangan })
   isRancangan && fillKeterangan({ ws })
   fillTapd({ ws, tapd })
   ws.headerFooter.oddFooter = `&L&\"Arial\"&9&I RKA-BELANJA SKPD &C&I&\"Arial\"&9 ${footer} &R&\"Arial\"&9&B &P`
   const buf = await wb.xlsx.writeBuffer()
   saveAs(new Blob([buf]), `${namaFile.replace(/[^\w\s]|(?!\S)\s+/g, ' ')}.xlsx`)
}

export default dowloadRkaBelanja

function fillDokJudul({
   ws,
   dokumen,
   skpdSettings,
   tahun,
}: {
   ws: Excel.Worksheet
   dokumen: Params['dokumen']
   skpdSettings: Params['skpdSettings']
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
               18: `FORMULIR
${dokumen.kode}-BELANJA
SKPD`,
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
   data_roganisasi[5] = skpdSettings.kode_skpd + '  ' + skpdSettings.nama_skpd
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
            d: { 1: 'KODE', 6: 'URAIAN', 7: 'SUMBER DANA', 8: 'LOKASI', 9: 'JUMLAH' },
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
               20: 'Bertambah / Berkurang',
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
         ws.mergeCells(row.number, 9, row.number, 21)
      } else if (i === 1) {
         ws.mergeCells(row.number, 10, row.number, 20)
      } else if (i === 2) {
         ws.mergeCells(row.number, 10, row.number, 14)
         ws.mergeCells(row.number, 15, row.number, 19)
      } else if (i === 3) {
         ws.mergeCells(row.number, 1, row.number - 3, 5)
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

   const row_column = ws.addRow(data_column, 'i+')
   ws.pageSetup = {
      fitToWidth: 1,
      fitToPage: true,
      fitToHeight: 0,
      orientation: 'landscape',
      showGridLines: false,
      margins: { left: 0.5, right: 0.5, top: 0.6, bottom: 0.6, header: 0.2, footer: 0.2 },
      printTitlesRow: `${row_th[0].number}:${row_column.number}`,
   }
   // const row_unit = ws.addRow([data[0].nama_skpd.toString()])
   // ws.mergeCells(row_unit.number, 1, row_unit.number, 15)
   // borderAll({ row: row_unit, ws, bold: true })
}

function fillRak({
   rak,
   skpdSettings,
   jabatanKepala,
   pangkatKepala,
   ws,
   isRancangan,
}: {
   rak: Params['rak']
   skpdSettings: Params['skpdSettings']
   jabatanKepala: string
   pangkatKepala?: string
   ws: Excel.Worksheet
   isRancangan: boolean
}) {
   let starRow = ws.addRow(undefined)
   const [pengeluaran] = rak
   const date = skpdSettings.tanggal ? new Date(skpdSettings.tanggal) : new Date()
   const tanggal = `${skpdSettings?.nama_ibu_kota}, ${date?.toLocaleDateString('ID', { dateStyle: 'long' })}`
   const data = Object.entries(pengeluaran).map(([key, value], index) => {
      const label =
         key === 'uraian'
            ? 'Rencana Realisasi Belanja per Bulan*) (Rp)'
            : capitalizeFirstLetter(key)
      const formula =
         key === 'jumlah'
            ? { formula: `=SUBTOTAL(9,F${starRow.number + 2}:F${starRow.number + index})` }
            : value
      const data = createExcelData({
         l: 21,
         d: {
            1: label,
            6: key === 'uraian' ? undefined : formula,
            16:
               index === 0
                  ? tanggal
                  : index === 1
                    ? jabatanKepala
                    : index === 4
                      ? skpdSettings?.nama_kepala_skpd
                      : index === 5
                        ? !!pangkatKepala
                           ? pangkatKepala
                           : 'NIP. ' + skpdSettings?.nip_kepala_skpd
                        : index === 6
                          ? !!pangkatKepala
                             ? 'NIP. ' + skpdSettings?.nip_kepala_skpd
                             : undefined
                          : !isRancangan
                            ? index === 8
                               ? 'Mengesahkan'
                               : index === 9
                                 ? 'PPKD'
                                 : index === 12
                                   ? skpdSettings?.nama_ppkd
                                   : index === 13
                                     ? 'NIP. ' + skpdSettings?.nip_ppkd
                                     : undefined
                            : undefined,
         },
      })
      return data
   })
   const rows = ws.addRows(data)
   rows.map((row, i) => {
      const isNama = i === 4 || i === 12
      i > 0
         ? ws.mergeCellsWithoutStyle(row.number, 1, row.number, 5)
         : ws.mergeCellsWithoutStyle(row.number, 1, row.number, 6)
      ws.mergeCellsWithoutStyle(row.number, 16, row.number, 21)
      row.eachCell({ includeEmpty: true }, (cell) => {
         const style = cell.style
         const col = parseFloat(cell.col)
         col === 16 &&
            (cell.style = {
               ...style,
               font: { ...style.font, bold: isNama, underline: isNama },
               alignment: { vertical: 'middle', horizontal: 'center' },
            })
         i == 0 &&
            col === 1 &&
            (cell.style = {
               ...style,
               font: { ...style.font, bold: true },
               alignment: { vertical: 'middle', horizontal: 'center' },
            })
         i !== 0 &&
            col === 6 &&
            (cell.style = {
               ...style,
               font: { ...style.font, bold: i === 13 },
               alignment: { vertical: 'middle', horizontal: 'right' },
               numFmt: '#,##0;[Red]-#,##0',
            })
         i === 13 &&
            col === 1 &&
            (cell.style = {
               ...style,
               font: { ...style.font, bold: true },
               alignment: { vertical: 'middle', horizontal: 'right' },
            })

         col < 7 &&
            (cell.border = {
               top: { style: 'thin' },
               left: { style: 'thin' },
               right: { style: 'thin' },
               bottom: { style: 'thin' },
            })
      })
   })
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
