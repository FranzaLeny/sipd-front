'use client'

import { useEffect, useState } from 'react'
import {
   Button,
   cn,
   Divider,
   Modal,
   ModalBody,
   ModalContent,
   ModalFooter,
   ModalHeader,
   type ButtonProps,
   type ModalBodyProps,
   type ModalHeaderProps,
   type ModalProps,
} from '@nextui-org/react'

type DialogFormProps = Omit<Omit<ModalProps, 'isOpen'>, 'onCflose'> & {
   headerProps?: ModalHeaderProps
   isOpen?: boolean
   children?: React.ReactNode
   contentProps?: Omit<ModalBodyProps, 'children'>
   submitButtonProps?: ButtonProps
   cancelButtonProps?: ButtonProps
   modalTitle?: string
}
export default function DialogForm({
   children,
   contentProps,
   headerProps,
   submitButtonProps,
   cancelButtonProps,
   modalTitle,
   ...props
}: DialogFormProps) {
   const [isOpen, setIsOpen] = useState(false)

   useEffect(() => {
      setIsOpen(true)
      return () => {
         setIsOpen(false)
      }
   }, [])

   const sumbitChildren = submitButtonProps?.children ?? 'Simpan'
   const cancleChildren = cancelButtonProps?.children ?? 'Batal'
   const headerChildren = headerProps?.children ?? modalTitle ?? 'Judul'
   return (
      <Modal
         isOpen={isOpen}
         {...props}
         scrollBehavior={'inside'}
         placement={'center'}
         classNames={{
            wrapper: 'p-2',
            base: cn('max-h-full', 'my-0 sm:my-0', 'mx-0 sm:mx-0'),
         }}>
         <ModalContent>
            {(onClose) => (
               <>
                  <ModalHeader
                     {...headerProps}
                     className={cn('flex flex-col gap-1 py-2', headerProps?.className)}>
                     {headerChildren}
                  </ModalHeader>
                  <Divider />
                  <ModalBody className={cn('gap-2', contentProps?.className)}>{children}</ModalBody>
                  <Divider />
                  <ModalFooter className='py-2'>
                     <Button
                        type='button'
                        color='danger'
                        isDisabled={submitButtonProps?.isLoading}
                        onPress={onClose}
                        title='Batal'
                        {...cancelButtonProps}>
                        {cancleChildren}
                     </Button>
                     <Button
                        type='submit'
                        title='Simpan'
                        {...submitButtonProps}
                        color='primary'>
                        {sumbitChildren}
                     </Button>
                  </ModalFooter>
               </>
            )}
         </ModalContent>
      </Modal>
   )
}
