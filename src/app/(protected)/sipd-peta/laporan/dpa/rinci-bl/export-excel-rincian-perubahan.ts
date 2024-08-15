import manifest from '@constants/tpd.json'
import {
   borderAll,
   calcRowHeight,
   capitalizeFirstLetter,
   createExcelData,
   numStyle,
   percentStyle,
   textStyle,
} from '@utils/excel'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

import { DpaRinciSubGiat } from './component'

type Params = {
   dokumen: {
      name: string
      title: string
      kode: string
      header: string
   }
   data: DpaRinciSubGiat
   jabatanKepala: string
   pangkatKepala?: string
   tapd?: Tapd[]
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

const dowloadExcelRincianBelanja = async (dpaRician: Params) => {
   const { dokumen, data, jabatanKepala, pangkatKepala, tapd = manifest?.data_tapd } = dpaRician
   const isRancangan = dokumen?.kode?.startsWith('R')
   let namaFile =
      dokumen?.kode +
      '_' +
      data?.kode_sub_giat +
      data?.nama_sub_giat.substring(0, 100) +
      '_05_BELANJA'
   namaFile = namaFile?.replace(/[^\w.-]/g, ' ')?.replaceAll('.', '_')

   const singkatan = data?.nama_sub_giat
      ?.replace(/[^a-zA-Z]/g, ' ')
      ?.replaceAll('dan', '')
      ?.replaceAll('pada', '')
      .split(' ')
      ?.map((x) => x?.substring(0, 4))
      ?.join('')
   const sheet_name = data?.kode_sub_giat?.substring(5) + singkatan
   let footer = data.nama_sub_giat
   if (footer.length > 100) {
      footer = footer.substring(0, 100) + '...'
   }
   const { item: items, rak, ...subGiat } = data

   const wb = new Excel.Workbook()
   const ws = wb.addWorksheet(sheet_name?.substring(0, 30))
   formatDefaultRka(ws)
   let currRow = fillDokJudul({ ws, dokumen, subGiat })
   currRow = fillTableHead({ ws })
   currRow = fillRinci({ currRow, items, ws })
   currRow = fillRak({
      jabatanKepala,
      startRow: currRow,
      rak,
      skpdSettings: {
         ibuKota: data.nama_ibukota,
         namaKepalaSkpd: data.nama_pa,
         nipKepalaSkpd: data.nip_pa,
         namaPpkd: data.nama_ppkd,
         nipPpkd: data.nip_ppkd,
         tanggal: data.tanggal_dpa,
      },
      ws,
      pangkatKepala,
      isRancangan,
   })
   currRow = isRancangan ? fillKeterangan({ ws }) : currRow
   currRow = fillTapd({ ws, tapd })
   ws.headerFooter.oddFooter = `&L&\"Arial\"&9&I ${dokumen.kode}-RINCIAN BELANJA &C&I&\"Arial\"&9 ${footer} &R&\"Arial\"&9&B &P`
   const buf = await wb.xlsx.writeBuffer()
   saveAs(new Blob([buf]), `${namaFile.replace(/[^\w\s]|(?!\S)\s+/g, ' ')}.xlsx`)
}

export default dowloadExcelRincianBelanja

function formatDefaultRka(ws: Excel.Worksheet) {
   ws.columns = [
      { key: 'kd_1', width: 4, style: textStyle },
      { key: 'kd_2', width: 4, style: textStyle },
      { key: 'kd_3', width: 4, style: textStyle },
      { key: 'kd_4', width: 4, style: textStyle },
      { key: 'kd_5', width: 4, style: textStyle },
      { key: 'kd_6', width: 5, style: textStyle },
      { key: 'uraian', width: 30.71, style: textStyle },
      { key: 'volume', width: 11.71, style: numStyle },
      { key: 'satuan', width: 11.71, style: textStyle },
      { key: 'harga', width: 11.71, style: numStyle },
      { key: 'pajak', width: 11.71, style: percentStyle },
      { key: 'jumlah', width: 11.71, style: numStyle },
      { key: '_volume', width: 11.71, style: numStyle },
      { key: '_satuan', width: 11.71, style: textStyle },
      { key: '_harga', width: 11.71, style: numStyle },
      { key: '_pajak', width: 11.71, style: percentStyle },
      { key: '_jumlah', width: 11.71, style: numStyle },
      { key: 'selisih', width: 11.71, style: numStyle },
   ]
   ws.views = [
      {
         showGridLines: false,
      },
   ]
}

function fillDokJudul({
   ws,
   dokumen,
   subGiat,
}: {
   ws: Excel.Worksheet
   dokumen: Params['dokumen']
   subGiat: Pick<Params['data'], Exclude<keyof Params['data'], 'rak' | 'item'>>
}) {
   const [dpaKode] = subGiat?.nomor_dpa?.split('/')

   // Judul Dokumen
   const data_judul = createExcelData({
      l: 3,
      c: false,
      d: {
         0: createExcelData({
            l: 18,
            d: {
               1: dokumen?.title?.toLocaleUpperCase('ID'),
               15: `FORMULIR\n${dokumen.kode}-BELANJA\nSKPD`,
            },
         }),
         1: createExcelData({ l: 18, d: { 1: 'SATUAN KERJA PERANGKAT DAERAH' } }),
         2: createExcelData({
            l: 18,
            d: { 1: `Pemerintahan Kab. Lembata Tahun Anggaran ${subGiat?.tanun}` },
         }),
      },
   })
   const rows_judul = ws.addRows(data_judul)
   rows_judul.map((row) => {
      borderAll({ row, ws, bold: true, center: true, wrapText: true })
      ws.mergeCellsWithoutStyle(row.number, 1, row.number, 14)
   })
   ws.mergeCellsWithoutStyle(rows_judul[0].number, 15, rows_judul[rows_judul.length - 1].number, 18)
   let rowDivider = ws.addRow(undefined)
   rowDivider.height = 7
   const data_roganisasi = createExcelData({
      l: 10,
      c: false,
      d: {
         0: createExcelData({
            l: 18,
            d: {
               1: 'Nomor',
               7: subGiat?.nomor_dpa?.replace(dpaKode, dokumen?.kode),
            },
         }),
         1: createExcelData({
            l: 18,
            d: {
               1: 'Urusan Pemerintahan',
               7: subGiat?.kode_urusan + ' ' + subGiat?.nama_urusan,
            },
         }),
         2: createExcelData({
            l: 18,
            d: {
               1: 'Bidang Urusan',
               7: subGiat?.kode_bidang_urusan + ' ' + subGiat?.nama_bidang_urusan,
            },
         }),
         3: createExcelData({
            l: 18,
            d: {
               1: 'Program',
               7: subGiat?.kode_program + ' ' + subGiat?.nama_program,
            },
         }),
         4: createExcelData({
            l: 18,
            d: {
               1: 'Kegiatan',
               7: subGiat?.kode_giat + ' ' + subGiat?.nama_giat,
            },
         }),
         5: createExcelData({
            l: 18,
            d: {
               1: 'Organisasi',
               7: subGiat?.kode_skpd + ' ' + subGiat?.nama_skpd,
            },
         }),
         6: createExcelData({
            l: 18,
            d: {
               1: 'Unit',
               7: subGiat?.kode_sub_skpd + ' ' + subGiat?.nama_sub_skpd,
            },
         }),
         7: createExcelData({
            l: 18,
            d: {
               1: `Alokasi Tahun ${subGiat?.tanun - 1}`,
               7: subGiat?.pagu_n_lalu,
            },
         }),
         8: createExcelData({
            l: 18,
            d: {
               1: `Alokasi Tahun ${subGiat?.tanun}`,
               7: subGiat?.pagu,
            },
         }),
         9: createExcelData({
            l: 18,
            d: {
               1: `Alokasi Tahun ${subGiat?.tanun + 1}`,
               7: subGiat?.pagu_n_depan,
            },
         }),
      },
   })

   const row_org = ws.addRows(data_roganisasi)
   row_org?.map((row, i) => {
      ws.mergeCellsWithoutStyle(row.number, 1, row.number, 6)
      ws.mergeCellsWithoutStyle(row.number, 7, row.number, 18)
      row.height = calcRowHeight({
         value: row.getCell(7).value,
         width: 191 * 7,
         font: '10pt Arial',
         bold: true,
         min_height: 15,
      })
      const labelCell = row.getCell(1)
      labelCell.style = {
         ...labelCell.style,
         numFmt: '@* \\:',
      }
      if (i >= 7) {
         const cell = row.getCell(7)
         cell.style = {
            ...cell.style,
            numFmt: '#,##0;[Red]-#,##0;"-";@',
         }
      }
   })

   // Indikator Kinerja
   rowDivider = ws.addRow(undefined)
   rowDivider.height = 7
   const rowHeader = ws.addRow(['Indikator dan Tolak Ukur Kinerja Kegiatan'])
   ws.mergeCellsWithoutStyle(rowHeader.number, 1, rowHeader.number, 18)
   borderAll({ ws, row: rowHeader, bold: true, center: true })
   const dataIndikator: any[] = createExcelData({
      l: 2,
      c: false,
      d: {
         0: createExcelData({
            l: 18,
            d: {
               1: 'Indikator',
               7: 'Sebelum',
               12: 'Setelah',
            },
         }),
         1: createExcelData({
            l: 18,
            d: {
               7: 'Tolak Ukur Kerja',
               10: 'Target Kinerja',
               12: 'Tolak Ukur Kerja',
               17: 'Target Kinerja',
            },
         }),
      },
   })
   const capaian = subGiat?.tolok_ukur_capaian?.split('\n')
   const targetCapaian = subGiat?.target_kinerja_capaian?.split('\n')
   capaian?.map((d, i) => {
      dataIndikator.push(
         createExcelData({
            l: 18,
            d: {
               1: i === 0 ? 'Capaian Kegiatan' : undefined,
               7: d,
               10: targetCapaian[i],
               12: d,
               17: targetCapaian[i],
            },
         })
      )
   })
   const otherIndikator = createExcelData({
      l: 3,
      c: false,
      d: {
         0: createExcelData({
            l: 18,
            d: {
               1: 'Masukan',
               7: 'Dana Yang Dibutuhkan',
               10: subGiat?.pagu,
               12: 'Dana Yang Dibutuhkan',
               17: subGiat?.pagu,
            },
         }),
         1: createExcelData({
            l: 18,
            d: {
               1: 'Keluaran',
               7: subGiat?.tolok_ukuran_keluaran,
               10: subGiat?.target_kinerja_keluaran,
               12: subGiat?.tolok_ukuran_keluaran,
               17: subGiat?.target_kinerja_keluaran,
            },
         }),
         2: createExcelData({
            l: 18,
            d: {
               1: 'Keluaran',
               7: subGiat?.tolok_ukur_hasil,
               10: subGiat?.target_kinerja_hasi,
               12: subGiat?.tolok_ukur_hasil,
               17: subGiat?.target_kinerja_hasi,
            },
         }),
      },
   })
   dataIndikator.push(...otherIndikator)
   const rowIndikator = ws.addRows(dataIndikator)
   rowIndikator?.map((row, i) => {
      if (i === 0) {
         i === 0 && ws.mergeCellsWithoutStyle(row.number, 7, row.number, 11)
         i === 0 && ws.mergeCellsWithoutStyle(row.number, 12, row.number, 18)
      } else {
         i === 1
            ? ws.mergeCellsWithoutStyle(row.number - 1, 1, row.number, 6)
            : ws.mergeCellsWithoutStyle(row.number, 1, row.number, 6)
         ws.mergeCellsWithoutStyle(row.number, 7, row.number, 9)
         ws.mergeCellsWithoutStyle(row.number, 10, row.number, 11)
         ws.mergeCellsWithoutStyle(row.number, 12, row.number, 16)
         ws.mergeCellsWithoutStyle(row.number, 17, row.number, 18)
         row.eachCell({ includeEmpty: true }, (renderCell) => {
            renderCell.alignment = {
               vertical: 'middle',
               horizontal: 'left',
               wrapText: true,
               shrinkToFit: false,
            }
         })
      }

      row.height = calcRowHeight({
         value: row.getCell(7).value,
         width: 52 * 7,
         font: '10pt Arial',
         bold: false,
         min_height: 15,
      })
      borderAll({ row, ws, bold: i <= 1, center: i <= 1 })
   })

   //Sub Kegiatan
   rowDivider = ws.addRow(undefined)
   rowDivider.height = 7
   const dataSubGiat = createExcelData({
      l: 6,
      c: false,
      d: {
         0: createExcelData({
            l: 18,
            d: {
               1: 'Sub Kegiatan',
               7: subGiat?.kode_sub_giat + ' ' + subGiat?.nama_sub_giat,
            },
         }),
         1: createExcelData({
            l: 18,
            d: {
               1: 'Sumber Pendanaan',
               7: subGiat.nama_dana,
            },
         }),
         2: createExcelData({
            l: 18,
            d: {
               1: 'Lokasi',
               7: `${subGiat?.nama_kab_kota}, ${subGiat?.nama_kecamatan}, ${subGiat?.nama_kelurahan}`,
            },
         }),
         3: createExcelData({
            l: 18,
            d: {
               1: 'Waktu',
               7: `Mulai ${subGiat?.waktu_mulai} sampai ${subGiat?.waktu_akhir}`,
            },
         }),
         4: createExcelData({
            l: 18,
            d: {
               1: 'Sub Kegiatan',
               7: subGiat?.sasaran,
            },
         }),
         5: createExcelData({
            l: 18,
            d: {
               1: 'Keterangan',
               7: '-',
            },
         }),
      },
   })

   const rowSbg = ws.addRows(dataSubGiat)
   rowSbg?.map((row, i) => {
      ws.mergeCellsWithoutStyle(row.number, 1, row.number, 6)
      ws.mergeCellsWithoutStyle(row.number, 7, row.number, 18)
      row.height = calcRowHeight({
         value: row.getCell(7).value,
         width: 191 * 7,
         font: '10pt Arial',
         bold: true,
         min_height: 15,
      })
      const labelCell = row.getCell(1)
      labelCell.style = {
         ...labelCell.style,
         numFmt: '@* \\:',
      }
   })
   rowDivider = ws.addRow(undefined)
   rowDivider.height = 7
   return rowDivider.number
}

function fillTableHead({ ws }: { ws: Excel.Worksheet }) {
   const data_th = createExcelData({
      l: 3,
      c: false,
      d: {
         0: createExcelData({
            l: 18,
            d: {
               1: 'Kode Rekening',
               7: 'Uraian',
               8: 'Rincian Perhitungan',
               18: 'Bertambah/\n(Berkurang)\n(Rp)',
            },
         }),
         1: createExcelData({
            l: 18,
            d: {
               8: 'Sebelum',
               13: 'Setelah',
            },
         }),
         2: createExcelData({
            l: 18,
            d: {
               8: 'Koefisien/\nVolume',
               9: 'Satuan',
               10: 'Harga',
               11: 'PPN',
               12: 'Jumlah',
               13: 'Koefisien/\nVolume',
               14: 'Satuan',
               15: 'Harga',
               16: 'PPN',
               17: 'Jumlah',
            },
         }),
      },
   })
   const row_th = ws.addRows(data_th)
   row_th.map((row, i) => {
      borderAll({ row, ws, bold: true, center: true, wrapText: true })
      if (i === 0) {
         ws.mergeCellsWithoutStyle(row.number, 8, row.number, 17)
      } else if (i === 1) {
         ws.mergeCellsWithoutStyle(row.number, 8, row.number, 12)
         ws.mergeCellsWithoutStyle(row.number, 13, row.number, 17)
      } else if (i === 2) {
         ws.mergeCellsWithoutStyle(row.number - 2, 1, row.number, 6)
         ws.mergeCellsWithoutStyle(row.number - 2, 7, row.number, 7)
         ws.mergeCellsWithoutStyle(row.number - 2, 18, row.number, 18)
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
function fillRinci(params: {
   ws: Excel.Worksheet
   currRow: number
   items: Params['data']['item']
}) {
   const { ws, currRow, items } = params

   const lastRow = currRow + items.length
   const generateSubTotal = (
      lengthKode: number,
      startIndex: number,
      nextRow: number,
      item: any[]
   ) => {
      let data = item
      const lastIndex = items.findIndex(
         (d, i) => i > startIndex && !!d.kode_akun.length && d.kode_akun.length <= lengthKode
      )
      const endRow = lastIndex === -1 ? lastRow : currRow + lastIndex
      for (let index = 7; index < 18; index++) {
         const column = numberToColumn(index + 1)
         if (index === 11 || index >= 16) {
            data[index] = { formula: `=SUBTOTAL(9,${column}${nextRow}:${column}${endRow})` }
         } else {
            data[index] = undefined
         }
      }
      return data
   }
   const generateSubTotalKel = (
      uraian: string | null,
      startIndex: number,
      nextRow: number,
      item: any[]
   ) => {
      let data = item
      const isKet = uraian?.startsWith('[ - ]')
      const isKel = uraian?.startsWith('[ # ]')
      if (!isKet && !isKel) {
         if (data[7]) {
            const koefisien = data[7]
               ?.split('x')
               ?.map((koef: string) => {
                  const [num] = koef?.trim()?.split(' ')
                  return num
               })
               .join('*')
            data[7] = { formula: `=${koefisien}` }
         } else {
            data[7] = undefined
         }
         if (data[12]) {
            const koefisien = data[12]
               ?.split('x')
               ?.map((koef: string) => {
                  const [num] = koef?.trim()?.split(' ')
                  return num
               })
               .join('*')
            data[12] = { formula: `=${koefisien}` }
         } else {
            data[12] = undefined
         }
         data[11] = {
            formula: `=H${nextRow - 1}*J${nextRow - 1}+H${nextRow - 1}*J${nextRow - 1}*K${nextRow - 1}`,
         }
         data[16] = {
            formula: `=M${nextRow - 1}*O${nextRow - 1}+M${nextRow - 1}*O${nextRow - 1}*P${nextRow - 1}`,
         }
         data[17] = { formula: `=Q${nextRow - 1}-Q${nextRow - 1}` }
         data[10] = data[10] / 100
         data[15] = data[15] / 100
         return data
      }
      const lastIndex = items.findIndex((d, i) => {
         const criteria1 = d.uraian.startsWith('[ # ]')
         const criteria2 = d.uraian.startsWith('[ - ]')
         const criteria = isKel ? criteria1 : criteria2 || criteria1
         return i > startIndex && (!!d.kode_akun.length || criteria)
      })
      const endRow = lastIndex === -1 ? lastRow : currRow + lastIndex
      for (let index = 7; index < 18; index++) {
         const column = numberToColumn(index + 1)
         if (index === 11 || index >= 16) {
            data[index] = { formula: `=SUBTOTAL(9,${column}${nextRow}:${column}${endRow})` }
         } else {
            data[index] = undefined
         }
      }
      return data
   }
   for (const [index, rinci] of items.entries()) {
      rinci.uraian = rinci.uraian?.replaceAll('/n ', '\n')
      const nextRow = currRow + index + 2
      const {
         kode_akun: korek,
         koefisien,
         satuan,
         harga_satuan,
         pajak,
         nilai,
         ...perubahan
      } = rinci
      const other = Object.values(perubahan)
      const isRinci = !rinci?.kode_akun && !rinci?.uraian?.startsWith('[')
      const _kode = korek?.split('.')
      let item = [
         _kode[0] ?? undefined,
         _kode[1] ?? undefined,
         _kode[2] ?? undefined,
         _kode[3] ?? undefined,
         _kode[4] ?? undefined,
         _kode[5] ?? undefined,
         ...other,
      ]
      switch (korek.length) {
         case 17:
            item = generateSubTotal(22, index, nextRow, item)
            break
         case 12:
            item = generateSubTotal(12, index, nextRow, item)
            break
         case 9:
            item = generateSubTotal(7, index, nextRow, item)
            break
         case 6:
            item = generateSubTotal(4, index, nextRow, item)
            break
         case 3:
            item = generateSubTotal(3, index, nextRow, item)
            break
         case 1:
            item = generateSubTotal(1, index, nextRow, item)
            break
         default:
            item = generateSubTotalKel(rinci?.uraian, index, nextRow, item)
            break
      }
      const row = ws.addRow(item)
      borderAll({ row, ws, bold: !isRinci })
      if (!isRinci) {
         ws.mergeCellsWithoutStyle(row.number, 7, row.number, 11)
         ws.mergeCellsWithoutStyle(row.number, 13, row.number, 16)
         row.height = calcRowHeight({
            value: rinci?.uraian,
            width: 74 * 7,
            font: '10pt Arial',
            bold: true,
            min_height: 15,
         })
      }
      if (!korek) {
         ws.mergeCellsWithoutStyle(row.number, 1, row.number, 6)
      } else {
         row.eachCell({ includeEmpty: true }, (cell) => {
            const col = parseFloat(cell.col)
            if (col <= 6) {
               cell.border = {
                  top: { style: 'thin' },
                  bottom: { style: 'thin' },
                  left: col == 1 ? { style: 'thin' } : undefined,
                  right: col == 6 ? { style: 'thin' } : undefined,
               }
            }
         })
      }
   }
   const rowDivider = ws.addRow(undefined)
   rowDivider.height = 7
   return rowDivider.number
}

function fillRak({
   startRow,
   rak,
   skpdSettings,
   jabatanKepala,
   pangkatKepala,
   ws,
   isRancangan,
}: {
   rak: Params['data']['rak']
   skpdSettings: {
      tanggal?: string
      ibuKota?: string
      namaKepalaSkpd?: string
      nipKepalaSkpd?: string
      namaPpkd?: string
      nipPpkd?: string
   }
   jabatanKepala: string
   pangkatKepala?: string
   ws: Excel.Worksheet
   isRancangan: boolean
   startRow: number
}) {
   const date = skpdSettings.tanggal ? new Date(skpdSettings.tanggal) : new Date()
   const tanggal = `${skpdSettings?.ibuKota}, ${date?.toLocaleDateString('ID', { dateStyle: 'long' })}`
   const data = Object.entries(rak).map(([key, value], index) => {
      const label =
         key === 'uraian'
            ? 'Rencana Realisasi Belanja per Bulan*) (Rp)'
            : capitalizeFirstLetter(key)
      const formula =
         key === 'jumlah'
            ? { formula: `=SUBTOTAL(9,G${startRow + 2}:G${startRow + index})` }
            : value
      const data = createExcelData({
         l: 18,
         d: {
            1: label,
            7: key === 'uraian' ? undefined : formula,
            13:
               index === 0
                  ? tanggal
                  : index === 1
                    ? jabatanKepala
                    : index === 4
                      ? skpdSettings?.namaKepalaSkpd
                      : index === 5
                        ? !!pangkatKepala
                           ? pangkatKepala
                           : 'NIP. ' + skpdSettings?.nipKepalaSkpd
                        : index === 6
                          ? !!pangkatKepala
                             ? 'NIP. ' + skpdSettings?.nipKepalaSkpd
                             : undefined
                          : !isRancangan
                            ? index === 8
                               ? 'Mengesahkan'
                               : index === 9
                                 ? 'PPKD'
                                 : index === 12
                                   ? skpdSettings?.namaPpkd
                                   : index === 13
                                     ? 'NIP. ' + skpdSettings?.nipPpkd
                                     : undefined
                            : undefined,
         },
      })
      return data
   })
   const rows = ws.addRows(data)
   rows.map((row, i) => {
      const isNama = i === 4 || i === 12
      if (i > 0) {
         ws.mergeCellsWithoutStyle(row.number, 1, row.number, 6)
      } else {
         ws.mergeCellsWithoutStyle(row.number, 1, row.number, 7)
      }

      ws.mergeCellsWithoutStyle(row.number, 13, row.number, 18)
      row.eachCell({ includeEmpty: true }, (cell) => {
         const style = cell.style
         const col = parseFloat(cell.col)
         col === 13 &&
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
            col === 7 &&
            (cell.style = {
               ...style,
               font: { ...style.font, bold: i === 13 },
               alignment: { vertical: 'middle', horizontal: 'right' },
               numFmt: '#,##0;[Red]-#,##0;"-";@',
            })
         i === 13 &&
            col === 1 &&
            (cell.style = {
               ...style,
               font: { ...style.font, bold: true },
               alignment: { vertical: 'middle', horizontal: 'right' },
            })

         col < 8 &&
            (cell.border = {
               top: { style: 'thin' },
               left: { style: 'thin' },
               right: { style: 'thin' },
               bottom: { style: 'thin' },
            })
      })
   })
   let rowDivider = ws.addRow(undefined)
   rowDivider.height = 7
   return rowDivider.number
}

function fillKeterangan({ ws }: { ws: Excel.Worksheet }) {
   const data = createExcelData({
      l: 6,
      c: false,
      d: {
         0: createExcelData({
            l: 18,
            d: { 1: 'Pembahasan', 5: ':' },
         }),
         1: createExcelData({
            l: 18,
            d: { 1: 'Tanggal', 5: ':' },
         }),
         2: createExcelData({
            l: 18,
            d: { 1: 'Catatan', 5: ':' },
         }),
         3: createExcelData({
            l: 18,
            d: { 1: '1.' },
         }),
         4: createExcelData({
            l: 18,
            d: { 1: '2.' },
         }),
         5: createExcelData({
            l: 18,
            d: { 1: 'dst.' },
         }),
      },
   })
   const rows = ws.addRows(data)
   rows.map((row, i) => {
      if (i < 3) {
         ws.mergeCellsWithoutStyle(row.number, 1, row.number, 4)
         ws.mergeCellsWithoutStyle(row.number, 5, row.number, 18)
      } else {
         ws.mergeCellsWithoutStyle(row.number, 2, row.number, 18)
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
   const rowDivider = ws.addRow(undefined)
   rowDivider.height = 7
   return rowDivider.number
}

export type Tapd = {
   nama: string
   jabatan: string
   nip: string
   id: string
}

function fillTapd({ tapd, ws }: { tapd: Tapd[]; ws: Excel.Worksheet }) {
   const title = 'TIM ANGGARAN PEMERINTAH DAERAH'
   const rowTitile = ws.addRow([title])
   ws.mergeCellsWithoutStyle(rowTitile.number, 1, rowTitile.number, 18)
   borderAll({ row: rowTitile, ws, bold: true, center: true })
   const header = createExcelData({
      l: 18,
      d: {
         1: 'NO.',
         3: 'NAMA',
         8: 'NIP',
         13: 'JABATAN',
         16: 'Tanda Tangan',
      },
   })
   const row = ws.addRow(header)
   row.height = 20
   ws.mergeCellsWithoutStyle(row.number, 1, row.number, 2)
   ws.mergeCellsWithoutStyle(row.number, 3, row.number, 7)
   ws.mergeCellsWithoutStyle(row.number, 8, row.number, 12)
   ws.mergeCellsWithoutStyle(row.number, 13, row.number, 15)
   ws.mergeCellsWithoutStyle(row.number, 16, row.number, 18)
   borderAll({ row, ws, bold: true, center: true })
   tapd.map((item, i) => {
      const data = createExcelData({
         l: 18,
         d: {
            1: i + 1 + '.',
            3: item.nama,
            8: item.nip,
            13: item.jabatan,
         },
      })
      const row = ws.addRow(data)
      ws.mergeCellsWithoutStyle(row.number, 1, row.number, 2)
      ws.mergeCellsWithoutStyle(row.number, 3, row.number, 7)
      ws.mergeCellsWithoutStyle(row.number, 8, row.number, 12)
      ws.mergeCellsWithoutStyle(row.number, 13, row.number, 15)
      ws.mergeCellsWithoutStyle(row.number, 16, row.number, 18)
      borderAll({ row, ws })
      row.eachCell((cell) => {
         const col = parseFloat(cell.col)
         col === 1
            ? (cell.style.alignment = { vertical: 'middle', horizontal: 'center' })
            : (cell.style.alignment = { vertical: 'middle', horizontal: 'left' })
      })
      row.height = 20
   })
   const rowDivider = ws.addRow(undefined)
   return rowDivider.number
}
