import { titleCase } from '@utils'
import { borderAll, numStyle, textStyle } from '@utils/excel'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

function formatDefaultRka(ws: Excel.Worksheet) {
   // create array length 24
   const colss = new Array(24)
   const cols = [...colss].map((_, i) => ({ key: `bulan_${i + 1}`, style: numStyle }))
   console.log({ cols })

   ws.columns = [
      { key: 'kds', width: 16, style: textStyle },
      { key: 'ns', width: 40, style: textStyle },
      { key: 'kda', width: 16, style: textStyle },
      { key: 'nsa', width: 40, style: textStyle },
      ...cols,
   ]
   ws.views = [{ showGridLines: false }]
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

const downloadRak = async (rak: RakBlByJadwal[]) => {
   let namaFile = 'RAK'
   namaFile = namaFile?.replace(/[^\w.-]/g, ' ')?.replaceAll('.', '_')
   const sheet_name = 'RAK'

   const wb = new Excel.Workbook()
   const ws = wb.addWorksheet(sheet_name)
   formatDefaultRka(ws)
   // fillTableHead({ ws })
   const titles = Object.keys(rak[0])?.map((title) => titleCase(title, true))
   const starRow = ws.addRow(titles)
   for (const [index, rinci] of rak.entries()) {
      const row = ws.addRow(Object.values(rinci))
      borderAll({ row, ws })
   }
   const buf = await wb.xlsx.writeBuffer()
   saveAs(new Blob([buf]), `${namaFile.replace(/[^\w\s]|(?!\S)\s+/g, ' ')}.xlsx`)
}

export default downloadRak
