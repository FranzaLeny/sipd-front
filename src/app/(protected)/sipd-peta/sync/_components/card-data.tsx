'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Button, Card, CardBody, CardFooter, CardHeader, Skeleton } from '@nextui-org/react'
import { useLocale } from '@react-aria/i18n'
import { UseQueryResult } from '@tanstack/react-query'

// type CardDataProps = {
//   canPres: boolean
//   hasAccess?: boolean
//   results: UseQueryResult<number, Error>
//   title?: string
//   action_title?: string
//   action_path?: string
// }

type CardDataProps<T> = {
   canPres: boolean
   hasAccess?: boolean
   results: UseQueryResult<
      | number
      | string
      | { total: number }
      | { totalCount: number }
      | { recordsTotal: number }
      | any[]
      | T
      // | Error
   >
   title?: string
   key_value?: keyof T
   action_title?: string
   action_path?: string
}
export function CardData<T extends Object>({
   results,
   canPres,
   hasAccess = false,
   title = 'Data',
   action_title = 'Lihat',
   action_path = '#',
   key_value,
}: CardDataProps<T>) {
   const { locale } = useLocale()
   const data = useMemo(() => {
      const isLoading = results.isFetching
      const isPressable = !results.isFetching && canPres
      const butonDisabled = results.isFetching || !canPres || results.isError || !hasAccess

      const value = results.isSuccess
         ? typeof results.data === 'number'
            ? results.data.toLocaleString(locale)
            : typeof results.data === 'string'
              ? results.data
              : 'totalCount' in results.data
                ? results?.data?.totalCount?.toLocaleString(locale)
                : 'total' in results.data
                  ? results?.data?.total?.toLocaleString(locale)
                  : 'recordsTotal' in results.data
                    ? results?.data?.recordsTotal?.toLocaleString(locale)
                    : Array.isArray(results?.data)
                      ? results?.data?.length
                      : typeof results?.data === 'object' &&
                          !!key_value &&
                          key_value in results?.data &&
                          typeof results?.data[key_value as keyof T] === 'number'
                        ? (results?.data[key_value as keyof T] as number)?.toLocaleString(locale)
                        : '...'
         : '...'
      const refetch = () => results.refetch()
      return { isLoading, isPressable, value, refetch, butonDisabled }
   }, [results, canPres, hasAccess, locale, key_value])

   return (
      <Skeleton
         className={`rounded-medium ${data?.isLoading && 'opacity-50'}`}
         isLoaded={!data?.isLoading}>
         <Card
            shadow='lg'
            onPress={data?.isPressable ? data?.refetch : undefined}
            isPressable={data?.isPressable}
            radius='md'>
            <CardHeader className='bg-secondary text-secondary-foreground text-small pb-0.5 pt-1'>
               {title}
            </CardHeader>
            <CardBody
               className={`${results?.isError ? 'text-danger' : results?.isSuccess ? 'font-bold' : 'text-warning'} border-secondary mx-auto border pb-1 pt-0.5 text-center text-xl`}>
               {results?.isError ? 'Error' : data.value}
            </CardBody>
            <CardFooter className='p-0'>
               <Button
                  isDisabled={data?.butonDisabled}
                  as={Link}
                  prefetch={false}
                  scroll={false}
                  isLoading={data?.isLoading}
                  fullWidth
                  radius='none'
                  size='sm'
                  color='primary'
                  href={action_path}>
                  {action_title}
               </Button>
            </CardFooter>
         </Card>
      </Skeleton>
   )
}

export default CardData
