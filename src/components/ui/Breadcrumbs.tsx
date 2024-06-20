'use client'

import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/react'

type Props = {
   path?: string
   title: string
}

export default function Breadcrumb({ paths }: { paths: Props[] }) {
   const items = paths?.reduce((old: Props[], v: Props, i) => {
      const path = old[i - 1]?.path && v.path ? old[i - 1]?.path + v.path : v.path
      return [...old, { ...v, path }]
   }, [])
   return (
      <div className='content sticky left-0 py-2'>
         <Breadcrumbs
            maxItems={5}
            itemsBeforeCollapse={2}
            itemsAfterCollapse={2}
            size='md'>
            {items?.map((item, i) => (
               <BreadcrumbItem
                  classNames={{ item: !item?.path && 'cursor-auto' }}
                  href={item?.path ?? undefined}
                  key={item?.title + i}>
                  {item.title}
               </BreadcrumbItem>
            ))}
         </Breadcrumbs>
      </div>
   )
}
