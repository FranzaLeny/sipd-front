'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Loading from '@components/ui/loading'
import {
   cn,
   Table,
   TableBody,
   TableCell,
   TableColumn,
   TableHeader,
   TableRow,
   useDisclosure,
   type SortDescriptor,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import axios from '@shared/custom-axios/api-fetcher'

import BottomTable from './bottom-table'
import ColumnsSelector from './columns-selector'
import GlobalSearch from './global-search'
import {
   generateCellProps,
   generateColumns,
   generateTableUi,
   INITIAL_LIMIT,
   type BaseData,
   type IFormTable,
   type TableServerSideProps,
} from './table-function'
import TableSettings, { TableSettingToggle } from './table-settings'

export type Params = {
   after?: string //after
   before?: string //before
   orderBy?: string
   search?: string
   limit: number
}

const ErrorGetData = dynamic(() => import('./error-get-data'), { ssr: false })

export default function TableServerSide<T extends BaseData>(props: TableServerSideProps<T>) {
   const {
      helperColumns,
      tableUiProps,
      tableActions,
      endpoint,
      data_key = [],
      searchParamsStatic,
   } = props

   const { columns, initial_visible_column } = generateColumns(helperColumns)
   const [page, setPage] = useState(0)
   const [listCursor, setListCursor] = useState<string[]>([])

   const INITIAL_UI = generateTableUi(tableUiProps)
   const { isOpen, onOpen, onOpenChange } = useDisclosure()
   const [visibleColumns, setVisibleColumns] = useState(initial_visible_column)
   const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>()
   const { color, isCompact, isStriped, isHeaderSticky, selectionMode } = INITIAL_UI
   const [tableProps, setTableProps] = useState<IFormTable>({
      color,
      isCompact,
      isStriped,
      isHeaderSticky,
      selectionMode,
   })
   const [params, setParams] = useState<Params>({
      limit: searchParamsStatic?.limit ?? INITIAL_LIMIT,
      ...searchParamsStatic,
   })

   const reset = useCallback(() => {
      setPage(0)
      setListCursor([])
   }, [])

   useEffect(() => {
      setPage(0)
      setListCursor([])
      setParams(({ after, before, ...old }) => ({
         ...old,
         ...searchParamsStatic,
         limit: old.limit,
      }))
   }, [searchParamsStatic])

   const { data, isFetching, status, error } = useQuery({
      queryKey: [endpoint, params, ...data_key] as [string, Params, ...string[]],
      queryFn: async ({ queryKey: [url, params] }) =>
         await axios
            .get<ResponseApi<CursorPaginate<T>>>(url, { params: { ...params } })
            .then((res) => res.data),
      refetchOnMount: true,
      placeholderData: (previousData) => previousData,
   })

   const { items, meta } = useMemo(() => {
      let items: T[] = []
      let meta: CursorPaginationMeta | undefined = undefined
      if (data) {
         const { results, ...other } = data
         items = results
         meta = other
      }
      return { items, meta }
   }, [data])

   const headerColumns = useMemo(() => {
      return columns.filter((column) => Array.from(visibleColumns).includes(column.uid))
   }, [visibleColumns, columns])

   const prevPage = meta?.hasPreviousPage && meta?.startCursor
   const nextPage = meta?.hasNextPage && meta?.endCursor
   const handlePageChange = useMemo(() => {
      return {
         prevPage: !!prevPage
            ? () => {
                 setParams((old) => ({ ...old, after: listCursor[page - 2] }))
                 setPage((old) => old - 1)
              }
            : undefined,
         nextPage: !!nextPage
            ? () => {
                 const has_cursor = listCursor[page]
                 !has_cursor && setListCursor((old) => [...old, nextPage])
                 setParams((old) => ({ ...old, after: nextPage }))
                 setPage((old) => old + 1)
              }
            : undefined,
      }
   }, [nextPage, page, listCursor, prevPage])

   const cellProps = useCallback(
      (item: T, columnKey: React.Key) => {
         return <TableCell {...generateCellProps(helperColumns, item, columnKey)} />
      },
      [helperColumns]
   )

   const handleSearchChange = useCallback(
      (value?: string) => {
         reset()
         if (value) {
            setParams(({ after, before, ...old }) => ({ ...old, search: value }))
         } else {
            setParams(({ after, before, ...old }) => ({ ...old }))
         }
      },
      [reset]
   )

   const handleSortChange = useCallback(
      (sortBy: SortDescriptor) => {
         reset()
         const column_sort = columns.find((d) => d.uid === sortBy?.column)
         if (
            sortDescriptor?.column === sortBy?.column &&
            sortDescriptor?.direction === 'descending' &&
            sortBy?.direction === 'ascending'
         ) {
            setParams(({ after, before, orderBy, ...old }) => old)
            setSortDescriptor(undefined)
         } else {
            !!sortBy &&
               !!column_sort &&
               setParams(({ after, before, ...old }) => ({
                  ...old,
                  orderBy:
                     sortBy?.direction === 'descending'
                        ? `-${column_sort?.key.toString()}`
                        : (column_sort?.key as string),
               }))
            setSortDescriptor(sortBy)
         }
      },
      [columns, reset, sortDescriptor]
   )

   const handleLimitChange = useCallback(
      (val: number) => {
         reset()
         setParams(({ after, before, ...old }) => ({ ...old, limit: val }))
      },
      [reset]
   )

   return (
      <>
         <div className='content sticky inset-x-0 mb-1 min-w-full'>
            <div className='bg-content1 shadow-small text-content1-foreground rounded-small mb-1 flex w-full flex-wrap items-center justify-around gap-2 p-2 sm:flex-row sm:justify-between'>
               <div className='flex w-full flex-1 grow gap-2 lg:w-fit'>
                  <TableSettingToggle onOpen={onOpen} />
                  <GlobalSearch handleChange={handleSearchChange} />
                  <ColumnsSelector
                     columns={columns}
                     onSelectionChange={setVisibleColumns}
                     selectedKeys={visibleColumns}
                  />
               </div>
               <div className='flex flex-wrap items-center justify-center gap-2'>
                  {tableActions}
               </div>
            </div>
         </div>
         <div className='content relative size-fit min-w-full'>
            <Table
               {...INITIAL_UI}
               {...tableProps}
               sortDescriptor={sortDescriptor}
               onSortChange={handleSortChange}>
               <TableHeader columns={headerColumns}>
                  {(column) => (
                     <TableColumn
                        key={column.uid}
                        allowsSorting={column.sortable}
                        aria-sort='none'
                        {...column.headerProps}
                        className={cn(
                           'text-small text-default-700 sort-table relative whitespace-normal',
                           column.headerProps.className
                        )}
                     />
                  )}
               </TableHeader>
               <TableBody
                  isLoading={isFetching}
                  loadingContent={<Loading />}
                  loadingState={
                     status === 'error'
                        ? 'error'
                        : status == 'success'
                          ? 'idle'
                          : status === 'pending'
                            ? 'loading'
                            : undefined
                  }
                  emptyContent={
                     status == 'error' && !!error ? (
                        <ErrorGetData message={error?.message} />
                     ) : isFetching ? (
                        'Mohon tunggu'
                     ) : (
                        'Tidak ada data'
                     )
                  }
                  items={items}>
                  {(item) => (
                     <TableRow
                        className='relative z-0'
                        key={String(item.id)}>
                        {(columnKey) => cellProps(item, columnKey)}
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>
         {!!items?.length && (
            <BottomTable
               {...{
                  defaultValue: params?.limit,
                  handleLimitChange,
                  handlePageChange,
                  isLoading: isFetching,
               }}
            />
         )}
         {isOpen && (
            <TableSettings
               isOpen={isOpen}
               onOpenChange={onOpenChange}
               tableProps={tableProps}
               setTableProps={setTableProps}
            />
         )}
      </>
   )
}
