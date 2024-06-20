'use client'

import { cn, TableCellProps, TableColumnProps, TableProps } from '@nextui-org/react'

type TableServerSideProps<T> = {
   tableUiProps?: TableUiProps
   tableActions?: React.ReactNode
   endpoint: string
   data_key: string
   searchParamsStatic?: { [k: string]: any }
   helperColumns: HelperColumns<T>
}

type HelperColumns<T> = Record<
   number | string,
   {
      name: string
      headerProps?: Omit<TableColumnProps<T>, 'children'> & { children?: React.ReactNode }
      cellProps?: Omit<TableCellProps, 'children'>
      hide?: boolean
      sortable?: boolean
      key: keyof T
      renderCell?: (item: T) => React.ReactNode
      cell?: (item: any) => React.ReactNode
   }
>

type Columns<T> = {
   sortable: boolean | undefined
   uid: string | number
   name: string
   renderCell?: (item: T) => React.ReactNode
   cell?: (item: any) => React.ReactNode
   key: keyof T
   headerProps: TableColumnProps<T>
   cellProps?: Omit<TableCellProps, 'children'>
}

type TableUiProps = Omit<
   Omit<Omit<Omit<TableProps, 'bottomContent'>, 'onSortChange'>, 'sortDescriptor'>,
   'children'
>

type IFormTable = {
   isCompact?: boolean
   isStriped?: boolean
   isHeaderSticky?: boolean
   color?: Colors
   selectionMode?: 'none' | 'single' | 'multiple'
}

type ColumnKey<T> = keyof HelperColumns<T>

type ColumnKeys<T> = Array<ColumnKey<T>>

interface BaseData extends Object {
   id: string
}

type SortBy<T> = {
   [K in keyof T]?: 'asc' | 'desc'
}

type GetDataParams<T> = [
   {
      limit: number
      cursor?: CursorPagination
      search: string
      sortBy?: SortBy<T>
   },
   ...any[],
]
const INITIAL_LIMIT = 10
const COLORS: Colors[] = ['default', 'danger', 'primary', 'secondary', 'success', 'warning']
const SELECTIONS: IFormTable['selectionMode'][] = ['none', 'single', 'multiple']

const generateTableUi = (defaultProps = {} as TableUiProps) => {
   let temp: TableProps = {
      radius: 'sm',
      'aria-label': 'Tabel',
      isHeaderSticky: true,
      removeWrapper: true,
      isCompact: true,
      isStriped: true,
      color: 'default',
      selectionMode: 'none',
   }
   const exceptKeys = ['bottomContent', 'onSortChange', 'sortDescriptor', 'children']
   Object.keys(defaultProps).map((key) => {
      if (!exceptKeys.includes(key)) {
         temp[key as keyof TableProps] = defaultProps[key as keyof TableUiProps]
      }
   })

   /* HACK "UBAH" "height-navbar" dan "z-index navbar" */
   let loadingWrapper = cn('z-[2]', temp.classNames?.loadingWrapper)
   let thead = cn(temp?.classNames?.thead, temp.isHeaderSticky && 'top-navbar z-[1]')
   let base = cn(
      temp?.classNames?.base,
      'block size-fit min-w-full',
      temp.removeWrapper &&
         'bg-content1 shadow-small rounded-small static overflow-visible p-5 shadow-sm'
   )
   let wrapper = cn(temp?.classNames?.wrapper, 'z-0 size-fit min-w-full  overflow-visible p-5')
   const th = cn(temp?.classNames?.thead, 'first-rounded-l-small last:rounded-r-small')
   const td = cn(temp?.classNames?.td, 'first:before:rounded-l-small last:before:rounded-r-small')
   temp.classNames = { ...temp?.classNames, thead, th, base, td, wrapper, loadingWrapper }
   return temp
}

const generateColumns = <T>(helperColumns: HelperColumns<T>) => {
   let initial_visible_column: ColumnKeys<T> = []
   const columns: Columns<T>[] = Object.keys(helperColumns).map((d: ColumnKey<T>) => {
      const {
         name,
         sortable,
         renderCell,
         hide,
         key,
         headerProps: hp,
         cellProps,
         cell,
      } = helperColumns[d]
      let headerProps = {
         ...hp,
         children: hp?.children ?? name,
      }
      if (!hide) {
         initial_visible_column.push(d)
      }

      return { sortable, uid: d, name, renderCell, key, headerProps, cellProps, cell }
   })
   return { initial_visible_column, columns }
}

const generateCellProps = <T>(helperColumns: HelperColumns<T>, item: T, columnKey: React.Key) => {
   const column = helperColumns[columnKey as ColumnKey<T>]
   const cellProps = column.cellProps
   const key = column.key
   const cellValue = item[key]
   if (typeof column.cell !== 'undefined') {
      return { ...cellProps, children: column.cell(cellValue) }
   }
   if (typeof column.renderCell !== 'undefined') {
      return { ...cellProps, children: column.renderCell(item) }
   }
   switch (typeof cellValue) {
      case 'string':
         return { ...cellProps, children: String(cellValue) }
      case 'undefined':
         return { ...cellProps, children: null }
      case 'number':
         return { ...cellProps, children: cellValue.toLocaleString() }
      case 'bigint':
         return { ...cellProps, children: cellValue.toLocaleString() }
      case 'boolean':
         return { ...cellProps, children: String(cellValue) }
      default:
         if (!!cellValue) {
            return { ...cellProps, children: JSON.stringify(cellValue) }
         } else {
            return { ...cellProps, children: null }
         }
   }
}

export { COLORS, INITIAL_LIMIT, SELECTIONS, generateCellProps, generateColumns, generateTableUi }

export type {
   BaseData,
   ColumnKey,
   ColumnKeys,
   Columns,
   GetDataParams,
   HelperColumns,
   IFormTable,
   SortBy,
   TableServerSideProps,
   TableUiProps,
}
