'use client'

import {
   cn,
   ModalContentProps as FormContentProps,
   ModalFooterProps as FormFotterProps,
   ModalHeaderProps as FormHeaderProps,
   Modal,
   ModalContent,
   ModalFooter,
   ModalHeader,
   ModalProps,
} from '@nextui-org/react'

export interface FormProps {
   children: React.ReactNode
   onSubmit: () => void
   buttonSubmit?: React.ReactNode
   buttonCancel?: (onClose: () => void) => React.ReactNode
   formHeaderProps?: FormHeaderProps
   formFooterProps?: Omit<FormFotterProps, 'children'>
   formContenProps?: Omit<FormContentProps, 'children'>
}

export default function ModalForm({
   children,
   onSubmit,
   buttonSubmit,
   buttonCancel,
   formHeaderProps,
   formFooterProps,
   formContenProps,
   ...modalProps
}: FormProps & Omit<ModalProps, 'children'>) {
   return (
      <Modal
         scrollBehavior='outside'
         {...modalProps}>
         <ModalContent
            {...formContenProps}
            className={cn(
               'flex flex-col gap-2 p-3 px-5 transition-all',
               formContenProps?.className
            )}>
            {(onClose) => (
               <form onSubmit={onSubmit}>
                  <ModalHeader
                     {...formHeaderProps}
                     className={cn(
                        'flex items-center justify-center font-bold',
                        formHeaderProps?.className
                     )}
                  />
                  {children}
                  <ModalFooter
                     {...formFooterProps}
                     className={cn(
                        'flex items-center justify-end gap-3 px-0',
                        formFooterProps?.className
                     )}>
                     {buttonCancel && buttonCancel(onClose)}
                     {buttonSubmit}
                  </ModalFooter>
               </form>
            )}
         </ModalContent>
      </Modal>
   )
}
