import Excel from 'exceljs'

export function createExcelData<T>({
   l,
   d,
   c = true,
}: {
   l: number
   d: { [x: number]: T }
   c?: boolean
}) {
   return Array.from({ length: l }, (_, i) => {
      const col = c ? i + 1 : i
      if (col in d) {
         return d[col]
      }
      return null
   })
}

export function borderAll(params: {
   row: Excel.Row
   ws: Excel.Worksheet
   bold?: boolean | number[]
   center?: boolean | number[]
   wrapText?: boolean | number[]
   italic?: boolean | number[]
   fontSize?: number
   excludeColumns?: number[]
}) {
   const { row, ws, bold, center, wrapText, fontSize, italic, excludeColumns } = params

   row.eachCell({ includeEmpty: true }, (singleCell, col) => {
      if (excludeColumns?.includes(col)) {
         return
      }
      const cellAddress = singleCell.address
      const style = ws.getCell(cellAddress).style
      ws.getCell(cellAddress).style = {
         ...style,
         border: {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
         },
         font: {
            ...style.font,
            bold:
               typeof bold === 'boolean'
                  ? bold
                  : typeof bold === 'object'
                    ? bold?.includes(col)
                    : style.font?.bold,
            size: fontSize ?? style.font?.size,
            italic:
               typeof italic === 'boolean'
                  ? italic
                  : typeof italic === 'object'
                    ? italic?.includes(col)
                    : style.font?.italic,
         },
         alignment: {
            ...style.alignment,
            wrapText:
               typeof wrapText === 'boolean'
                  ? wrapText
                  : typeof wrapText === 'object'
                    ? wrapText?.includes(col)
                    : style.alignment?.wrapText,
            horizontal:
               typeof center === 'boolean' && center
                  ? 'center'
                  : typeof center === 'object' && center?.includes(col)
                    ? 'center'
                    : style.alignment?.horizontal,
            vertical:
               typeof center === 'boolean' && center
                  ? 'middle'
                  : typeof center === 'object' && center?.includes(col)
                    ? 'middle'
                    : style.alignment?.vertical,
         },
      }
   })
}

export const calcRowHeight = ({
   value: v = '',
   width,
   bold,
   min_height = 15,
   font,
}: {
   font?: string
   value?: any
   width: number
   bold?: boolean
   min_height?: number
}): number => {
   const value = String(v) ?? ''
   const row_height = min_height ?? 15
   const has_n = value.split('\n')
   if (has_n && has_n.length > 1) {
      return has_n.reduce((p: number, c: string) => {
         const nums = calcRowHeight({ width, value: c, bold, font })
         return p + nums
      }, 0)
   }
   const lines = getWidthOfString({ text: value, font, bold, width })
   const height = lines * row_height
   return height
}
// utils.ts
type A = {
   text: string
   font?: string
   bold?: boolean
   italic?: boolean
   width: number
}

/**
 * Menghitung lebar teks dalam konteks penggunaan canvas.
 * @param {Object} params - Parameter untuk fungsi ini.
 * @param {string} params.text - Teks yang ingin diukur.
 * @param {string} [params.font='12pt Arial'] - Font yang digunakan.
 * @param {boolean} [params.bold=false] - Apakah teks harus dicetak tebal.
 * @param {boolean} [params.italic=false] - Apakah teks harus dicetak miring.
 * @param {number} [params.width] - Lebar maksimum teks sebelum teks harus dibungkus.
 * @returns {number} - Lebar teks atau jumlah baris teks jika `maxWidth` diberikan.
 */
export function getWidthOfString({
   text,
   font,
   bold = false,
   italic = false,
   width: maxWidth,
}: A): number {
   const canvas = document.createElement('canvas')
   const context = canvas.getContext('2d')
   if (!context) return 0 // Return 0 if getContext is not supported
   let fontStyle = ''
   if (bold) fontStyle += 'bold '
   if (italic) fontStyle += 'italic '
   context.font = fontStyle + (font || '12pt Arial') // Menggabungkan tebal dan italic dengan font

   let width = context.measureText(text).width
   if (maxWidth && width > maxWidth) {
      // Menghitung tinggi teks
      const words = text.split(' ')
      let line = ''
      let lines = 1
      for (let n = 0; n < words.length; n++) {
         let testLine = line + words[n] + ' '
         let testWidth = context.measureText(testLine).width
         if (testWidth > maxWidth) {
            line = words[n] + ' '
            lines++
         } else {
            line = testLine
         }
      }

      return lines
   } else {
      return 1
   }
}

export function capitalizeFirstLetter(text: string) {
   return text.charAt(0).toUpperCase() + text.slice(1)
}

export function numberToColumn(number: number) {
   let column = ''
   while (number > 0) {
      const remainder = (number - 1) % 26
      column = String.fromCharCode(65 + remainder) + column
      number = Math.floor((number - 1) / 26)
   }
   return column
}

export const fontStyle = { name: 'Arial', size: 10 }

export const numStyle: Partial<Excel.Style> = {
   alignment: {
      vertical: 'middle',
      horizontal: 'right',
      wrapText: false,
      shrinkToFit: true,
      indent: 0.1,
   },
   font: fontStyle,
   numFmt: '#,##0;[Red](#,##0);"-";@',
}

export const textStyle: Partial<Excel.Style> = {
   alignment: {
      vertical: 'middle',
      horizontal: 'left',
      wrapText: true,
      shrinkToFit: false,
      indent: 0.1,
   },
   font: fontStyle,
   numFmt: '@',
}

export const percentStyle: Partial<Excel.Style> = {
   ...numStyle,
   numFmt: '0%;-0%;"-";@',
}
