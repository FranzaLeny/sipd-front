'use client'

import { Accordion, AccordionItem, cn } from '@nextui-org/react'

import RkaPergeseranBelanjaSkpd from './belanja'
import RingkasanPerubahanPendapatanSkpd from './pendapatan'
import RingkasanPerubahanRincianBelanjaSubGiat from './rincian-belanja'
import RingkasanPerubahanSkpd from './ringkasan'

export default function Template({ skpd }: { skpd: SkpdTapdAnggaranBySkpd }) {
   return (
      <Accordion
         motionProps={{
            className: '!flex flex-1 flex-col max-h-full max-w-full overflow-hidden',
         }}
         itemClasses={{
            base: cn([
               'top-navbar flex max-h-[calc(100dvh-var(--height-navbar)-12px)] max-w-full flex-col overflow-hidden',
            ]),
            content: cn('relative flex max-h-full max-w-full flex-col overflow-auto pb-4'),
            heading: cn('flex-none'),
         }}
         variant='splitted'>
         <AccordionItem
            key='rekapitulasi'
            aria-label='Rekapitulasi'
            title='Rekapitulasi SKPD'>
            <RingkasanPerubahanSkpd skpd={skpd} />
         </AccordionItem>
         <AccordionItem
            key='pendapatan'
            aria-label='Pendapatan SKPD'
            title='Pendapatan SKPD'>
            <RingkasanPerubahanPendapatanSkpd skpd={skpd} />
         </AccordionItem>
         <AccordionItem
            key='belanja'
            aria-label='Belanja SKPD'
            title='Belanja SKPD'>
            <RkaPergeseranBelanjaSkpd skpd={skpd} />
         </AccordionItem>
         <AccordionItem
            key='rincian-belanja'
            aria-label='Rincian Belanja SKPD'
            title='Rincian Belanja SKPD'>
            <RingkasanPerubahanRincianBelanjaSubGiat skpd={skpd} />
         </AccordionItem>
      </Accordion>
   )
}
