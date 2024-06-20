'use client'

import {
   Card,
   CardBody,
   CardFooter,
   CardHeader,
   cn,
   Divider,
   CardFooterProps as FormHeaderProps,
} from '@nextui-org/react'

export interface FormProps {
   children: React.ReactNode
   onSubmit: () => void
   buttonSubmit?: React.ReactNode
   buttonCancel?: React.ReactNode
   formHeaderProps?: FormHeaderProps
}

const CardForm = ({
   children,
   onSubmit,
   buttonSubmit,
   buttonCancel,
   formHeaderProps,
}: FormProps) => {
   return (
      <Card
         as='form'
         onSubmit={onSubmit}>
         <CardHeader
            {...formHeaderProps}
            className={cn('flex items-center justify-center font-bold', formHeaderProps?.className)}
         />
         <Divider />
         <CardBody className='flex flex-col gap-3 p-3 px-4 transition-all sm:px-6'>
            {children}
         </CardBody>
         <Divider />
         <CardFooter className='flex items-end justify-end gap-3 px-5'>
            {buttonCancel}
            {buttonSubmit}
         </CardFooter>
      </Card>
   )
}
export default CardForm
