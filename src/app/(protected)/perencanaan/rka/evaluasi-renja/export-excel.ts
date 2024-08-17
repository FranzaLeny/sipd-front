import { numStyle, percentStyle, textStyle } from '@utils/excel'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'
import { groupBy, sumBy } from 'lodash-es'

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
   ]
   ws.views = [{ showGridLines: false }]
}

const dowloadExcel = async (data: RealisasiSubGiat[]) => {
   const wb = new Excel.Workbook()
   let namaFile = 'REALISASI'
   const ws = wb.addWorksheet('Sheets')
   const groupProgram = groupBy(data, 'kode_program')
   let header = [
      'Kode',
      undefined,
      undefined,
      undefined,
      undefined,
      'Uraian',
      'Output',
      'Sasaran',
      'Satuan',
      'Target Renstra',
      'Pagu Renstra',
      'Target',
      'Pagu',
      'Rak 1',
      'Rak 2',
      'Rak 3',
      'Rak 4',
      'Realisasi 1',
      'Realisasi 2',
      'Realisasi 3',
      'Realisasi 4',
   ]
   ws.addRow(header)
   for (const [_, sbls] of Object.entries(groupProgram)) {
      const { capaian, nama_program, kode_program } = sbls[0]
      const pagu = sumBy(sbls, 'pagu')
      const _kode_program = kode_program?.split('.') || []
      const kode = [...Array(5)]?.map((_, i) => _kode_program[i])
      const rak = {
         rak1: sumBy(sbls, 'rak1'),
         rak2: sumBy(sbls, 'rak2'),
         rak3: sumBy(sbls, 'rak3'),
         rak4: sumBy(sbls, 'rak4'),
         realisasi1: sumBy(sbls, 'realisasi1'),
         realisasi2: sumBy(sbls, 'realisasi2'),
         realisasi3: sumBy(sbls, 'realisasi3'),
         realisasi4: sumBy(sbls, 'realisasi4'),
      }
      const rowsProg = capaian?.map((c, i) => {
         const kd = i === 0 ? kode : [...Array(5)]
         const _data = {
            uraian: i === 0 ? nama_program : null,
            output: c?.tolak_ukur,
            sasaran: null,
            satuan: c?.satuan,
            target_renstra: c.target_teks?.replace(` ${c.satuan}`, ''),
            pagu_renstra: 0,
            target: c.target_teks?.replace(` ${c.satuan}`, ''),
            pagu: i === 0 ? pagu : 0,
            rak1: i === 0 ? rak.rak1 : 0,
            rak2: i === 0 ? rak.rak2 : 0,
            rak3: i === 0 ? rak.rak3 : 0,
            rak4: i === 0 ? rak.rak4 : 0,
            realisasi1: i === 0 ? rak.realisasi1 : 0,
            realisasi2: i === 0 ? rak.realisasi2 : 0,
            realisasi3: i === 0 ? rak.realisasi3 : 0,
            realisasi4: i === 0 ? rak.realisasi4 : 0,
         }
         return [...kd, ...Object.values(_data)]
      })
      ws.addRows(rowsProg)

      const groupGiat = groupBy(sbls, 'kode_giat')
      for (const [__, sbls] of Object.entries(groupGiat)) {
         const { hasil, nama_giat, kode_giat, kode_program } = sbls[0]
         const _kode_giat = [..._kode_program, kode_giat.substring((kode_program?.length || 0) + 1)]
         const kode = [...Array(5)]?.map((_, i) => _kode_giat[i]) || []
         const pagu = sumBy(sbls, 'pagu')
         const rak = {
            rak1: sumBy(sbls, 'rak1'),
            rak2: sumBy(sbls, 'rak2'),
            rak3: sumBy(sbls, 'rak3'),
            rak4: sumBy(sbls, 'rak4'),
            realisasi1: sumBy(sbls, 'realisasi1'),
            realisasi2: sumBy(sbls, 'realisasi2'),
            realisasi3: sumBy(sbls, 'realisasi3'),
            realisasi4: sumBy(sbls, 'realisasi4'),
         }

         const rowsGiat = hasil?.map((c, i) => {
            const kd = i === 0 ? kode : [...Array(5)]
            const _data = {
               uraian: i === 0 ? nama_giat : null,
               output: c?.tolak_ukur,
               sasaran: null,
               satuan: c?.satuan,
               target_renstra: c.target_teks?.replace(` ${c.satuan}`, ''),
               pagu_renstra: 0,
               target: c.target_teks?.replace(` ${c.satuan}`, ''),
               pagu: i === 0 ? pagu : 0,
               rak1: i === 0 ? rak.rak1 : 0,
               rak2: i === 0 ? rak.rak2 : 0,
               rak3: i === 0 ? rak.rak3 : 0,
               rak4: i === 0 ? rak.rak4 : 0,
               realisasi1: i === 0 ? rak.realisasi1 : 0,
               realisasi2: i === 0 ? rak.realisasi2 : 0,
               realisasi3: i === 0 ? rak.realisasi3 : 0,
               realisasi4: i === 0 ? rak.realisasi4 : 0,
            }
            return [...kd, ...Object.values(_data)]
         })
         ws.addRows(rowsGiat)
         for (const sbl of sbls) {
            const {
               nama_sub_giat,
               pagu,
               output,
               kode_sub_giat,
               sasaran,
               rak1,
               rak2,
               rak3,
               rak4,
               realisasi1,
               realisasi2,
               realisasi3,
               realisasi4,
            } = sbl
            const _kode_sbl = [..._kode_giat, kode_sub_giat.substring((kode_giat?.length || 0) + 1)]
            const kode = [...Array(5)]?.map((_, i) => _kode_sbl[i]) || []
            const rowsSbl = output?.map((c, i) => {
               const kd = i === 0 ? kode : [...Array(5)]
               const _data = {
                  uraian: i === 0 ? nama_sub_giat : null,
                  output: c?.tolak_ukur,
                  sasaran: i === 0 ? sasaran : null,
                  satuan: c?.satuan,
                  target_renstra: c.target_teks?.replace(` ${c.satuan}`, ''),
                  pagu_renstra: 0,
                  target: c.target_teks?.replace(` ${c.satuan}`, ''),
                  pagu: i === 0 ? pagu : 0,
                  rak1: i === 0 ? rak1 : 0,
                  rak2: i === 0 ? rak2 : 0,
                  rak3: i === 0 ? rak3 : 0,
                  rak4: i === 0 ? rak4 : 0,
                  realisasi1: i === 0 ? realisasi1 : 0,
                  realisasi2: i === 0 ? realisasi2 : 0,
                  realisasi3: i === 0 ? realisasi3 : 0,
                  realisasi4: i === 0 ? realisasi4 : 0,
               }
               return [...kd, ...Object.values(_data)]
            })
            ws.addRows(rowsSbl)
         }
      }
   }
   wb.creator = 'FXIL'
   const buf = await wb.xlsx.writeBuffer()
   saveAs(new Blob([buf]), `${namaFile.replace(/[^\w\s]|(?!\S)\s+/g, ' ')}.xlsx`)
}

export default dowloadExcel
