'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
   Button,
   cn,
   Divider,
   Modal,
   ModalBody,
   ModalBodyProps,
   ModalContent,
   ModalFooter,
   ModalHeader,
   ModalHeaderProps,
   ModalProps,
} from '@nextui-org/react'

type DialogShowProps = {
   header?: React.ReactNode
   headerProps?: Omit<ModalHeaderProps, 'children'>
   children?: React.ReactNode
   bodyProps?: Omit<ModalBodyProps, 'children'>
   cancelTitle?: string
} & Props

type Props = Omit<Omit<Omit<ModalProps, 'children'>, 'onClose'>, 'isOpen'>

const DialogShow: React.FC<DialogShowProps> = ({
   header,
   children,
   bodyProps,
   headerProps,
   cancelTitle,
   scrollBehavior,
   placement,
   ...props
}) => {
   const [isOpen, setIsOpen] = useState(false)
   const router = useRouter()
   useEffect(() => {
      setIsOpen(true)
      return () => {
         setIsOpen(false)
      }
   }, [])
   const handleClose = useCallback(() => {
      router.back()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])
   return (
      <Modal
         scrollBehavior={scrollBehavior}
         placement={placement}
         classNames={{
            wrapper: placement === 'top' && 'pt-navbar',
            base: scrollBehavior === 'inside' && 'max-h-[calc(100%_-_8rem)]',
         }}
         {...props}
         isOpen={isOpen}
         onClose={handleClose}>
         <ModalContent>
            {(onClose) => (
               <>
                  <ModalHeader
                     {...headerProps}
                     className={cn('flex flex-col gap-1 py-2', headerProps?.className)}>
                     {header ? header : 'Konfirmasi'}
                  </ModalHeader>
                  <Divider />
                  <ModalBody className={cn('gap-2', bodyProps?.className)}>
                     {children ?? <></>}
                  </ModalBody>
                  <Divider />
                  <ModalFooter className='py-2'>
                     <Button
                        color='danger'
                        onPress={onClose}>
                        {cancelTitle ?? 'Tutup'}
                     </Button>
                  </ModalFooter>
               </>
            )}
         </ModalContent>
      </Modal>
   )
}

export default DialogShow
