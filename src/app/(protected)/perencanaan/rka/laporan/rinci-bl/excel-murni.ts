import manifest from '@constants/tpd.json'
import { numberToMonth } from '@utils'
import {
   borderAll,
   calcRowHeight,
   createExcelData,
   numStyle,
   percentStyle,
   textStyle,
} from '@utils/excel'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

function formatDefaultRka(ws: Excel.Worksheet) {
   ws.columns = [
      { key: 'kd_1', width: 2.29, style: textStyle },
      { key: 'kd_2', width: 2.29, style: textStyle },
      { key: 'kd_3', width: 3.29, style: textStyle },
      { key: 'kd_4', width: 3.29, style: textStyle },
      { key: 'kd_5', width: 3.29, style: textStyle },
      { key: 'kd_6', width: 5.29, style: textStyle },
      { key: 'uraian', width: 30.71, style: textStyle },
      { key: 'volume', width: 9.71, style: numStyle },
      { key: 'harga', width: 11.71, style: numStyle },
      { key: 'satuan', width: 10.71, style: textStyle },
      { key: 'pajak', style: percentStyle, width: 5.71 },
      { key: 'jumlah', style: numStyle, width: 11.71 },
      { key: 'rak', style: numStyle, width: 11.71 },
      { key: 'realisasi', style: numStyle, width: 11.71 },
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
   items: ItemRincianLaporanSbl[]
   subGiat: SubGiatLaporanSbl
}

const dowloadRkaRinciBl = async (data: Data[]) => {
   const wb = new Excel.Workbook()
   let namaFile = 'RKA'
   for await (const item of data) {
      namaFile = await createSheet(item, wb)
   }
   wb.creator = 'FXIL'
   const buf = await wb.xlsx.writeBuffer()
   saveAs(new Blob([buf]), `${namaFile.replace(/[^\w\s]|(?!\S)\s+/g, ' ')}.xlsx`)
}

type KodeAkuns =
   | 'bo'
   | 'bo.bp'
   | 'bo.bbj'
   | 'bo.bb'
   | 'bo.bsub'
   | 'bo.bh'
   | 'bo.bsos'
   | 'bm'
   | 'bm.bt'
   | 'bm.bpm'
   | 'bm.bbg'
   | 'btt'
   | 'bt'
   | 'bt.bbh'
   | 'bt.bbk'

const listJenisBl: Record<string, KodeAkuns> = {
   '5.1': 'bo',
   '5.1.01': 'bo.bp',
   '5.1.02': 'bo.bbj',
   '5.1.03': 'bo.bb',
   '5.1.04': 'bo.bsub',
   '5.1.05': 'bo.bh',
   '5.1.06': 'bo.bsos',
   '5.2': 'bm',
   '5.2.01': 'bm.bt',
   '5.2.02': 'bm.bpm',
   '5.2.03': 'bm.bbg',
   '5.3': 'btt',
   '5.4': 'bt',
   '5.4.01': 'bt.bbh',
   '5.4.02': 'bt.bbk',
}

const createSheet = async (data: Data, wb: Excel.Workbook) => {
   const { dokumen, items, skpd, tapd, subGiat } = data
   const kodeGiat = subGiat?.kode_giat?.split('.').map((x) => +x.trim())

   let namaFile =
      dokumen?.kode + '_' + subGiat?.kode_sub_giat + subGiat?.nama_sub_giat.substring(0, 100)
   namaFile = namaFile?.replace(/[^\w.-]/g, ' ')?.replaceAll('.', '_')
   const singkatan = subGiat?.nama_sub_giat
      ?.replace(/[^a-zA-Z]/g, ' ')
      ?.replaceAll('dan', '')
      ?.replaceAll('pada', '')
      .split(' ')
      ?.map((x) => x?.substring(0, 4))
      ?.join('')
   const sheet_name = subGiat?.kode_sub_giat?.substring(5) + singkatan
   let footer = subGiat?.kode_sub_giat + '-' + subGiat?.nama_sub_giat
   if (footer.length > 100) {
      footer = footer.substring(0, 97) + '...'
   }
   const generateSubTotal = (group: number, index: number, nextRow: number) => {
      const lastIndex = items.findIndex((d, i) => i > index && d.group <= group)
      const endRow = lastIndex === -1 ? lastRow : starRow + lastIndex
      return `=SUBTOTAL(9,L${nextRow}:L${endRow})`
   }

   const lastKodeGiat = kodeGiat[kodeGiat.length - 1] || 1
   // chek kode giat ganjil atau genap
   const isOdd = lastKodeGiat % 2 === 1
   const isEmptyData = items?.length === 1
   const ws = wb.addWorksheet(sheet_name?.substring(0, 30), {
      properties: { tabColor: { argb: isEmptyData ? '000000' : isOdd ? '3FDFFF' : 'B3FFB3' } },
   })
   const idUnikSbl = '_' + subGiat?.id_sub_bl + '.'
   formatDefaultRka(ws)
   fillDokJudul({ ws, dokumen, tahun: subGiat?.tahun })
   fillDataKegiatan({ ws, subGiat, idUnikSbl })
   fillIndikatorKegiatan({ ws, subGiat, idUnikSbl })
   fillDataSubKegiatan({ ws, subGiat })
   const starRow = fillTableHead({ ws })
   let lastRow = starRow + items.length - 1
   for (let [index, rinci] of items.entries()) {
      const nextRow = starRow + index + 2
      const currRow = starRow + index + 1
      const isRinci = rinci.group === 9
      const {
         group,
         pajak,
         uraian,
         volume,
         nama_dana,
         rekening,
         spek,
         satuan,
         harga_satuan,
         kode,
         nilai_rak,
         nilai_realisasi,
      } = rinci
      const isTotal = group === 10
      const _uraian =
         isRinci && !!spek
            ? `${uraian}\nSpesifikasi: ${spek}`
            : group === 8
              ? `[-] ${uraian}`
              : group === 7
                ? `[#] ${uraian}\nSumber dana: ${nama_dana}`
                : uraian
      const rek = rekening?.reduce((a, b, i) => ({ ...a, [i + 1]: i === 5 ? b : b + '.' }), {})
      const total = isRinci
         ? `=ROUND(H${currRow}*I${currRow}+H${currRow}*I${currRow}*K${currRow},0)`
         : isTotal
           ? '=SUBTOTAL(9,L' + (starRow + 1) + ':L' + lastRow + ')'
           : generateSubTotal(group, index, nextRow)
      let item = createExcelData({
         l: 14,
         d: {
            ...rek,
            7: _uraian,
            8: isRinci ? { formula: `=${volume?.join('*')}` } : undefined,
            9: harga_satuan,
            10: isRinci ? satuan?.join(' ') : undefined,
            11: isRinci ? { formula: `${pajak || 0}/100` } : undefined,
            12: { formula: total },
            13: nilai_rak ?? null,
            14: nilai_realisasi ?? null,
         },
      })

      const row = ws.addRow(item)
      if (!isRinci) {
         ws.mergeCells(row.number, 7, row.number, 11)
         row.height = calcRowHeight({
            value: _uraian,
            width: 65 * 7.166,
            font: '10pt Arial',
            bold: true,
            min_height: 15,
         })
      }
      if (isTotal) {
         ws.getCell(row?.number, 12).name = idUnikSbl + 'jml'
         ws.getCell(row?.number, 13).name = idUnikSbl + 'rak'
         ws.getCell(row?.number, 14).name = idUnikSbl + 'real'
      }
      if (!!kode && !!listJenisBl[kode]) {
         const cell = row.number
         ws.getCell(`L${cell}`).name = idUnikSbl + listJenisBl[kode]
         ws.getCell(cell, 13).name = idUnikSbl + listJenisBl[kode] + '.rak'
         ws.getCell(cell, 14).name = idUnikSbl + listJenisBl[kode] + '.real'
      }
      borderAll({ row, ws, bold: !isRinci, excludeColumns: [13, 14] })
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
   }
   const alokasiAddr = ws.getCell(1, 30).value?.toString()
   const paguAddr = ws.getCell(2, 30).value?.toString()
   alokasiAddr && (ws.getCell(alokasiAddr).value = { formula: `=${idUnikSbl}jml` })
   paguAddr && (ws.getCell(paguAddr).value = { formula: `=${idUnikSbl}jml` })
   const row = ws.addRow(undefined)
   row.height = 7
   fillKepala({ ws, skpd })
   fillKeterangan({ ws })
   lastRow = fillTapd({ ws, tapd })
   ws.pageSetup.printArea = `A1:L${lastRow + 2}`
   ws.headerFooter.oddFooter = `&L&\"Arial\"&9&I${footer}&R&\"Arial\"&9${dokumen?.kode}| &B&P`
   return namaFile
}

export default dowloadRkaRinciBl

function fillDokJudul({
   ws,
   dokumen,
   tahun,
}: {
   ws: Excel.Worksheet
   dokumen: Data['dokumen']
   tahun: number
}): number {
   const data_judul = createExcelData({
      l: 3,
      c: false,
      d: {
         0: createExcelData({
            l: 12,
            d: {
               1: dokumen?.title?.toLocaleUpperCase('ID'),
               10: `FORMULIR\n${dokumen.kode}-RINCIAN BELANJA\nSKPD`,
            },
         }),
         1: createExcelData({ l: 12, d: { 1: 'SATUAN KERJA PERANGKAT DAERAH' } }),
         2: createExcelData({
            l: 12,
            d: { 1: `Pemerintahan Kab. Lembata Tahun Anggaran ${tahun}` },
         }),
      },
   })
   const rows_judul = ws.addRows(data_judul)
   rows_judul.map((row) => {
      borderAll({ row, ws, bold: true, center: true, wrapText: true })
      ws.mergeCells(row.number, 1, row.number, 9)
   })
   ws.mergeCells(rows_judul[0].number, 10, rows_judul[rows_judul.length - 1].number, 12)
   const row = ws.addRow(undefined)
   row.height = 7
   return row.number
}

function fillDataKegiatan({
   ws,
   subGiat,
   idUnikSbl,
}: {
   ws: Excel.Worksheet
   subGiat: SubGiatLaporanSbl
   idUnikSbl: string
}): number {
   const giat = [
      createExcelData({
         l: 12,
         d: {
            1: 'Urusan Pemerintahan',
            7: subGiat.kode_urusan + ' ' + subGiat.nama_urusan,
         },
      }),
      createExcelData({
         l: 12,
         d: {
            1: 'Bidang Urusan',
            7: subGiat.kode_bidang_urusan + ' ' + subGiat.nama_bidang_urusan,
         },
      }),
      createExcelData({
         l: 12,
         d: {
            1: 'Organisasi',
            7: subGiat.kode_skpd + ' ' + subGiat.nama_skpd,
         },
      }),
      createExcelData({
         l: 12,
         d: {
            1: 'Unit',
            7: subGiat.kode_sub_skpd + ' ' + subGiat.nama_sub_skpd,
         },
      }),
      createExcelData({
         l: 12,
         d: {
            1: 'Program',
            7: subGiat.kode_program + ' ' + subGiat.nama_program,
         },
      }),
      createExcelData({
         l: 12,
         d: {
            1: 'Kegiatan',
            7: subGiat.kode_giat + ' ' + subGiat.nama_giat,
         },
      }),
      createExcelData({
         l: 12,
         d: {
            1: `Alokasi ${subGiat.tahun - 1}`,
            7: subGiat.pagu_n_lalu,
         },
      }),
      createExcelData({
         l: 12,
         d: {
            1: `Alokasi ${subGiat.tahun}`,
            7: subGiat.pagu,
         },
      }),
      createExcelData({
         l: 12,
         d: {
            1: `Alokasi ${subGiat.tahun + 1}`,
            7: subGiat.pagu_n_depan,
         },
      }),
   ]
   const rows = ws.addRows(giat)
   rows.map((row, i) => {
      const value = row.getCell(7).value
      row.height = calcRowHeight({
         value: value,
         width: 76 * 7.16,
         font: '10pt Arial',
         bold: true,
         min_height: 15,
      })
      row.eachCell({ includeEmpty: true }, (cell, i) => {
         if (i === 1) {
            const style = cell.style
            cell.style = {
               ...style,
               numFmt: '@* :',
               alignment: { ...style.alignment, wrapText: false, shrinkToFit: true },
            }
         } else if (i === 7) {
            const style = cell.style
            cell.style = {
               ...style,
               numFmt: '#,##0;-#,##0',
            }
         }
      })
      ws.mergeCellsWithoutStyle(row.number, 1, row.number, 6)
      ws.mergeCellsWithoutStyle(row.number, 7, row.number, 12)
      if (i === 7) {
         ws.getCell(row.number - 1, 7).name = idUnikSbl + 'tahun.' + (subGiat.tahun - 1)
         ws.getCell(row.number, 7).name = idUnikSbl + 'tahun.' + subGiat.tahun
         ws.getCell(row.number + 1, 7).name = idUnikSbl + 'tahun.' + (subGiat.tahun + 1)
         ws.getCell(1, 30).value = row.getCell(7).address
      }
   })
   const row = ws.addRow(undefined)
   row.height = 7
   return row.number
}

function fillIndikatorKegiatan({
   ws,
   subGiat,
   idUnikSbl,
}: {
   ws: Excel.Worksheet
   subGiat: SubGiatLaporanSbl
   idUnikSbl: string
}): number {
   const capaian = subGiat.capaian_bl_giat?.map((c, i) => {
      return createExcelData({
         l: 12,
         d: { 1: i === 0 ? 'Capaian Program' : undefined, 7: c.tolak_ukur, 11: c.target_teks },
      })
   })
   const keluaran = subGiat.output_bl_giat?.map((k, i) => {
      return createExcelData({
         l: 12,
         d: {
            1: i === 0 ? 'Keluaran Kegiatan' : undefined,
            7: k.tolok_ukur,
            11: k.target_teks,
         },
      })
   })
   const hasil = subGiat.hasil_bl_giat?.map((h, i) => {
      return createExcelData({
         l: 12,
         d: {
            1: i === 0 ? 'Hasil Kegiatan' : undefined,
            7: h.tolak_ukur,
            11: h.target_teks,
         },
      })
   })
   const output = subGiat.output_bl_sub_giat?.map((h, i) => {
      return createExcelData({
         l: 12,
         d: {
            1: i === 0 ? 'Keluaran Sub Kegiatan' : undefined,
            7: h.tolak_ukur,
            11: h.target_teks,
         },
      })
   })
   const indikator = [
      createExcelData({
         l: 12,
         d: {
            1: 'Indikator',
            7: 'Tolok Ukur Kinerja',
            11: 'Target Kinerja',
         },
      }),
      ...capaian,
      createExcelData({
         l: 12,
         d: {
            1: 'Masukan',
            7: 'Dana yang dibutuhkan',
            11: subGiat.pagu,
         },
      }),
      ...keluaran,
      ...hasil,
      ...output,
   ]
   const rows = ws.addRows(indikator)
   rows.map((row, i) => {
      ws.mergeCellsWithoutStyle(row.number, 1, row.number, 6)
      ws.mergeCellsWithoutStyle(row.number, 7, row.number, 10)
      ws.mergeCellsWithoutStyle(row.number, 11, row.number, 12)
      borderAll({ row, ws, center: i == 0, bold: i == 0 })
      row.eachCell({ includeEmpty: true }, (cell, y) => {
         if (y === 11 && i > 0) {
            const style = cell.style
            cell.style = {
               ...style,
               numFmt: i === capaian?.length + 1 ? numStyle?.numFmt : textStyle?.numFmt,
               alignment: {
                  ...style.alignment,
                  horizontal: 'center',
                  wrapText: i !== 2,
                  shrinkToFit: i === 2,
               },
            }
         }
      })
      const value = row.getCell(7).value
      row.height = calcRowHeight({
         value: value,
         width: 60 * 7.16,
         font: '10pt Arial',
         bold: true,
         min_height: 15,
      })
      if (i === capaian?.length + 1) {
         ws.getCell(row.number, 11).name = idUnikSbl + 'pagu'
         ws.getCell(2, 30).value = row.getCell(11).address
      }
   })

   const row = ws.addRow(undefined)
   row.height = 7
   return row.number
}

function fillDataSubKegiatan({
   ws,
   subGiat,
}: {
   ws: Excel.Worksheet
   subGiat: SubGiatLaporanSbl
}): number {
   const giat = [
      createExcelData({
         l: 12,
         d: {
            1: 'Sub Kegiatan',
            7: subGiat.kode_sub_giat + ' ' + subGiat.nama_sub_giat,
         },
      }),
      createExcelData({
         l: 12,
         d: {
            1: 'Sumber Dana',
            7: subGiat.dana_bl_sub_giat?.map((d) => d.nama_dana).join('\n'),
         },
      }),
      createExcelData({
         l: 12,
         d: {
            1: `Lokasi`,
            7: subGiat.lokasi_bl_sub_giat
               ?.map((l) =>
                  [
                     l.kab_kota?.nama_daerah ?? 'Semua Kab/Kota',
                     l.kecamatan?.camat_teks ?? 'Semua Kecamatan',
                     l.lurah?.lurah_teks ?? 'Semua Kelurahan',
                  ].join(', ')
               )
               .join(', '),
         },
      }),
      createExcelData({
         l: 12,
         d: {
            1: `Waktu Pelaksanaan`,
            7: numberToMonth(subGiat.waktu_awal) + ' s/d ' + numberToMonth(subGiat.waktu_akhir),
         },
      }),
      createExcelData({
         l: 12,
         d: {
            1: `Kelompok Sasaran`,
            7: subGiat.sasaran,
         },
      }),
      createExcelData({
         l: 12,
         d: {
            1: `Keterangan`,
            7: subGiat.tag_bl_sub_giat?.map((t) => t.nama_label_giat).join('\n'),
         },
      }),
   ]
   const rows = ws.addRows(giat)
   rows.map((row) => {
      const value = row.getCell(7).value
      row.height = calcRowHeight({
         value: value,
         width: 76 * 7.16,
         font: '10pt Arial',
         bold: true,
         min_height: 15,
      })
      row.eachCell({ includeEmpty: true }, (cell, i) => {
         if (i === 1) {
            const style = cell.style
            cell.style = {
               ...style,
               numFmt: '@* :',
               alignment: { ...style.alignment, wrapText: false, shrinkToFit: true },
            }
         } else if (i === 7) {
            const style = cell.style
            cell.style = {
               ...style,
               numFmt: '#,##0;-#,##0',
            }
         }
      })
      ws.mergeCellsWithoutStyle(row.number, 1, row.number, 6)
      ws.mergeCellsWithoutStyle(row.number, 7, row.number, 12)
   })

   const row = ws.addRow(undefined)
   row.height = 7
   return row.number
}

function fillTableHead({ ws }: { ws: Excel.Worksheet }): number {
   const data_th = createExcelData({
      l: 2,
      c: false,
      d: {
         0: createExcelData({
            l: 14,
            d: {
               1: 'Kode Rekening',
               7: 'Uraian',
               8: 'Rincian Perhitungan',
               12: 'Jumlah\n(Rp)',
               13: 'RAK\n(Rp)',
               14: 'Realisasi\n(Rp)',
            },
         }),
         1: createExcelData({
            l: 12,
            d: {
               8: 'Koefisien',
               9: 'Satuan',
               10: 'Harga',
               11: 'PPN',
            },
         }),
      },
   })
   const row_th = ws.addRows(data_th)
   row_th.map((row, i) => {
      borderAll({ row, ws, bold: true, center: true, wrapText: true, excludeColumns: [13, 14] })
      if (i === 0) {
         ws.mergeCellsWithoutStyle(row.number, 1, row.number + 1, 6)
         ws.mergeCellsWithoutStyle(row.number, 7, row.number + 1, 7)
         ws.mergeCellsWithoutStyle(row.number, 8, row.number, 11)
         ws.mergeCellsWithoutStyle(row.number, 12, row.number + 1, 12)
         ws.mergeCells(row.number, 13, row.number + 1, 13)
         ws.mergeCells(row.number, 14, row.number + 1, 14)
      }
   })
   ws.pageSetup = {
      fitToWidth: 1,
      fitToPage: true,
      fitToHeight: 0,
      orientation: 'portrait',
      blackAndWhite: true,
      showGridLines: false,
      paperSize: 9,
      margins: { left: 0.5, right: 0.5, top: 0.6, bottom: 0.6, header: 0.2, footer: 0.2 },
      printTitlesRow: `${row_th[0].number}:${row_th[row_th.length - 1].number}`,
   }
   return row_th[row_th.length - 1].number
}

function fillKepala({ ws, skpd }: { ws: Excel.Worksheet; skpd: UnitLaporan }) {
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
         ...style,
         numFmt: '@',
         alignment: { ...style.alignment, horizontal: 'center', wrapText: true },
         font: {
            ...style.font,
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

function fillKeterangan({ ws }: { ws: Excel.Worksheet }) {
   const data = createExcelData({
      l: 6,
      d: {
         1: createExcelData({
            l: 12,
            d: { 1: 'Pembahasan', 7: ':' },
         }),
         2: createExcelData({
            l: 12,
            d: { 1: 'Tanggal', 7: ':' },
         }),
         3: createExcelData({
            l: 12,
            d: { 1: 'Catatan', 7: ':' },
         }),
         4: createExcelData({
            l: 12,
            d: { 1: '1.' },
         }),
         5: createExcelData({
            l: 12,
            d: { 1: '2.' },
         }),
         6: createExcelData({
            l: 12,
            d: { 1: 'dst.' },
         }),
      },
      c: true,
   })
   const rows = ws.addRows(data)
   rows.map((row, i) => {
      if (i < 3) {
         ws.mergeCellsWithoutStyle(row.number, 1, row.number, 6)
         ws.mergeCellsWithoutStyle(row.number, 7, row.number, 12)
      } else {
         ws.mergeCellsWithoutStyle(row.number, 1, row.number, 2)
         ws.mergeCellsWithoutStyle(row.number, 3, row.number, 12)
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
   const row = ws.addRow(undefined)
   row.height = 7
   return row.number
}

function fillTapd({
   tapd = manifest?.data_tapd,
   ws,
}: {
   tapd?: TapdLaporan[] | null
   ws: Excel.Worksheet
}): number {
   if (!tapd) return 0
   const title = 'TIM ANGGARAN PEMERINTAH DAERAH'
   const rowTitile = ws.addRow([title])
   ws.mergeCellsWithoutStyle(rowTitile.number, 1, rowTitile.number, 12)
   borderAll({ row: rowTitile, ws, bold: true, center: true })
   const header = createExcelData({
      l: 12,
      d: {
         1: 'NO.',
         3: 'NAMA',
         8: 'NIP',
         10: 'JABATAN',
         11: 'Tanda Tangan',
      },
   })
   const row = ws.addRow(header)
   row.height = 20
   ws.mergeCellsWithoutStyle(row.number, 1, row.number, 2)
   ws.mergeCellsWithoutStyle(row.number, 3, row.number, 7)
   ws.mergeCellsWithoutStyle(row.number, 8, row.number, 9)
   ws.mergeCellsWithoutStyle(row.number, 11, row.number, 12)
   borderAll({ row, ws, bold: true, center: true, wrapText: true })
   const rows = tapd.map((item, i) => {
      const data = createExcelData({
         l: 12,
         d: {
            1: i + 1 + '.',
            3: item.nama,
            8: item.nip,
            10: item.jabatan,
         },
      })
      const row = ws.addRow(data)
      ws.mergeCellsWithoutStyle(row.number, 1, row.number, 2)
      ws.mergeCellsWithoutStyle(row.number, 3, row.number, 7)
      ws.mergeCellsWithoutStyle(row.number, 8, row.number, 9)
      ws.mergeCellsWithoutStyle(row.number, 11, row.number, 12)
      borderAll({ row, ws })
      row.eachCell({ includeEmpty: true }, (cell) => {
         const style = cell.style
         cell.style = {
            ...style,
            alignment: { horizontal: 'left', vertical: 'middle' },
            numFmt: '@',
         }
      })
      row.height = 20
      return row.number
   })
   return Math.max(...rows)
}
