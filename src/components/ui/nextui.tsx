'use client'

import { extendVariants, Button as UiButton, Chip as UiChip } from '@nextui-org/react'

export const Chip = extendVariants(
   UiChip,
   {
      variants: {
         size: {
            xs: {
               base: 'px-0,5 py-0.5 min-w-12 h-6 text-tiny gap-1 rounded-none',
               content: 'px-0,5 py-0.5 min-w-12 h-6 text-tiny gap-1 rounded-none',
               avatar: 'px-0,5 py-0.5 min-w-12 h-6 text-tiny gap-1 rounded-none',
               closeButton: 'px-0,5 py-0.5 min-w-12 h-6 text-tiny gap-1 rounded-none',
               dot: 'px-0,5 py-0.5 min-w-12 h-6 text-tiny gap-1 rounded-none',
            },
         },
      },
   },
   { twMerge: true }
)

export const Button = extendVariants(UiButton, {
   variants: {
      size: {
         xs: 'px-2 min-w-12 h-6 text-tiny gap-1 rounded-small',
      },
   },
})
