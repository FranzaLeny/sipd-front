type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
   ? U
   : any

type Creator = {
   nama: string
   jabatan?: string
}
type CursorPagination = {
   after?: string
   before?: string
}

type QueryPagination<T> = Omit<Omit<Omit<Omit<T, 'include'>, 'cursor'>, 'take'>, 'skip'> & {
   select: { id: true }
}

type CursorPaginationMeta = {
   hasPreviousPage: boolean
   hasNextPage: boolean
   startCursor: string | null
   endCursor: string | null
}
type CursorPaginate<T = any> = CursorPaginationMeta & {
   results: T[]
}

interface Paginate<T = any> {
   results: T[]
   isFirstPage: boolean
   isLastPage: boolean
   currentPage: number
   previousPage?: number
   nextPage?: number
   pageCount: number
   totalCount: number
}
type Colors = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | undefined
type FC<T> = (props: T) => JSX.Element | null
