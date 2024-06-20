'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
   Button,
   Divider,
   Modal,
   ModalBody,
   ModalContent,
   ModalFooter,
   ModalHeader,
} from '@nextui-org/react'

const DialogCommingSoon: React.FC<{ title?: string }> = ({ title = 'ini' }) => {
   const pathname = usePathname()
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
         scrollBehavior='outside'
         placement='center'
         classNames={{ wrapper: 'pt-navbar' }}
         isOpen={isOpen}
         onClose={handleClose}>
         <ModalContent>
            {(onClose) => (
               <>
                  <ModalHeader className='flex flex-col gap-1 py-2'>{title}</ModalHeader>
                  <Divider />
                  <ModalBody className='gap-3'>
                     <p className='font-bold'>Opss...</p>
                     <p>Path: {pathname}</p>
                     <p>Masih dalam proses pengembangan mohon menunggu update selanjutnya</p>
                  </ModalBody>
                  <Divider />
                  <ModalFooter className='py-2'>
                     <Button
                        color='danger'
                        isDisabled={!open}
                        onPress={onClose}>
                        Kembali
                     </Button>
                  </ModalFooter>
               </>
            )}
         </ModalContent>
      </Modal>
   )
}

export default DialogCommingSoon
