'use client'

import { ElementRef, forwardRef } from 'react'
import {
   cn,
   Modal,
   ModalBody,
   ModalContent,
   ModalFooter,
   ModalHeader,
   ModalProps,
   ModalSlots,
   SlotsToClasses,
   useDisclosure,
} from '@nextui-org/react'

export interface SheetProps extends Omit<ModalProps, 'placement'> {
   placement?: 'left' | 'right'
}

export const Sheet = forwardRef<ElementRef<typeof Modal>, SheetProps>(
   ({ placement = 'left', classNames, ...props }, ref) => {
      const extendedClassNames = {
         backdrop: cn(classNames?.backdrop),
         base: cn('!m-0 h-full !rounded-none', classNames?.base),
         body: cn(classNames?.body),
         closeButton: cn(classNames?.closeButton),
         footer: cn(classNames?.footer),
         header: cn(classNames?.header),
         wrapper: cn(
            placement == 'left' ? '!justify-start' : placement == 'right' ? 'justify-end' : '',
            'z-[999]',
            classNames?.wrapper
         ),
      } as SlotsToClasses<ModalSlots>

      return (
         <Modal
            ref={ref}
            classNames={extendedClassNames}
            {...props}
         />
      )
   }
)
Sheet.displayName = 'Sheet'

export const SheetBody = ModalBody

export const SheetContent = ModalContent

export const SheetFooter = ModalFooter

export const SheetHeader = ModalHeader

export { useDisclosure }
