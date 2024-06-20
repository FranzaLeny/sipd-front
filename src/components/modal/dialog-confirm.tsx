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
import { useRefetchQueries } from '@shared/hooks/use-refetch-queries'
import { revalidateRoot } from '@shared/server-actions/revalidate'

type DialogConfirmProps<T> = Omit<Omit<ModalProps, 'isOpen'>, 'onClose'> & {
   data_key?: string[]
   header?: React.ReactNode
   headerProps?: Omit<ModalHeaderProps, 'children'>
   children?: React.ReactNode
   bodyProps?: Omit<ModalBodyProps, 'children'>
   submitTitle?: string
   disabledSubmit?: boolean
   revalidate?: boolean
   action?: () => Promise<boolean>
}
export default function DialogConfirm<T>({
   disabledSubmit,
   header,
   children,
   data_key,
   action,
   bodyProps,
   headerProps,
   submitTitle,
   revalidate,
   scrollBehavior = 'inside',
   placement = 'center',
   ...props
}: DialogConfirmProps<T>) {
   const [isOpen, setIsOpen] = useState(false)
   const [loading, setLoading] = useState(false)
   const router = useRouter()
   const { refetchQueries } = useRefetchQueries()
   useEffect(() => {
      setIsOpen(true)
      return () => {
         setIsOpen(false)
         setLoading(false)
      }
   }, [])

   const handleClose = useCallback(() => {
      !loading && router.back()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [loading])
   const handleSubmit = async () => {
      if (!action) {
         return
      }
      console.time('singkron data')
      setLoading(true)
      try {
         const res = await action()
         setLoading(false)
         if (typeof res === 'boolean' && res) {
            !!data_key && refetchQueries(data_key)
            !!revalidate && (await revalidateRoot())
            handleClose()
         }
      } catch (e: any) {
         console.error(e?.message)
      }
      setLoading(false)
      console.timeEnd('singkron data')
   }

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
                  <ModalBody className={cn('gap-2', bodyProps?.className)}>{children}</ModalBody>
                  <Divider />
                  <ModalFooter className='py-2'>
                     <Button
                        disabled={loading || !open}
                        color='danger'
                        type='button'
                        onPress={onClose}>
                        Tutup
                     </Button>
                     {!!action && !disabledSubmit && (
                        <Button
                           type='submit'
                           isDisabled={disabledSubmit || !open}
                           isLoading={loading}
                           color='primary'
                           onPress={handleSubmit}>
                           {submitTitle ?? 'YA'}
                        </Button>
                     )}
                  </ModalFooter>
               </>
            )}
         </ModalContent>
      </Modal>
   )
}
