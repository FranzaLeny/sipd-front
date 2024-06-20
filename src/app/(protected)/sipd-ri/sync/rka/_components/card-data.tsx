'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Button, Card, CardBody, CardFooter, CardHeader, Skeleton } from '@nextui-org/react'
import { useLocale } from '@react-aria/i18n'
import { UseQueryResult } from '@tanstack/react-query'

type CardDataProps = {
   canPres: boolean
   hasAccess?: boolean
   results: UseQueryResult<number | string | { total: number } | any, Error>
   title?: string
   key_value?: string
   action_title?: string
   action_path?: string
}

export const CardData: React.FC<CardDataProps> = ({
   results,
   hasAccess = false,
   canPres,
   key_value,
   title = 'Data',
   action_title = 'Lihat',
   action_path = '#',
}) => {
   const { locale } = useLocale()
   const data = useMemo(() => {
      const isLoading = results.isFetching
      const isPressable = !results.isFetching && canPres
      const butonDisabled = results.isFetching || !canPres || !hasAccess
      let value = '...'
      if (results.isSuccess && results.data) {
         if (typeof results?.data === 'number') {
            value = results?.data.toLocaleString(locale)
         } else if (typeof results?.data?.totalCount === 'number') {
            value = results?.data?.totalCount.toLocaleString(locale)
         } else if (typeof results?.data === 'string') {
            value = results?.data
         } else if (results?.data?.total && typeof results.data?.total === 'number') {
            value = results?.data?.total.toLocaleString(locale)
         } else if (key_value && key_value in results.data) {
            const new_val = results.data[key_value]
            if (typeof new_val === 'number') {
               value = new_val.toLocaleString(locale)
            } else if (typeof new_val === 'boolean') {
               value = new_val ? 'OK' : '-'
            }
         } else if (Array.isArray(results.data) && results.data.length > 0) {
            value = results.data.length.toLocaleString(locale)
         }
      }
      const refetch = () => results.refetch()
      return { isLoading, isPressable, value, refetch, butonDisabled }
   }, [results, key_value, canPres, hasAccess, locale])

   return (
      <Skeleton
         className={`rounded-medium ${data.isLoading && 'opacity-50'}`}
         isLoaded={!data.isLoading}>
         <Card
            shadow='lg'
            onPress={data?.isPressable ? data?.refetch : undefined}
            isPressable={data?.isPressable}
            radius='md'>
            <CardHeader className='bg-secondary text-secondary-foreground text-small pb-0.5 pt-1'>
               {title}
            </CardHeader>
            <CardBody
               className={`${results?.isError ? 'text-danger' : results.isSuccess ? 'font-bold' : 'text-warning'} border-secondary mx-auto border pb-1 pt-0.5 text-center ${data?.value.length > 9 ? '' : 'text-xl'}`}>
               {results?.isError ? 'Error' : data.value}
            </CardBody>
            <CardFooter className='p-0'>
               <Button
                  isDisabled={data.butonDisabled}
                  as={Link}
                  isLoading={data.isLoading}
                  prefetch={false}
                  scroll={false}
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
