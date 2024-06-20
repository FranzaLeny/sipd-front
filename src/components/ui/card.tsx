'use client'

import {
    CardBody,
    CardFooterProps,
    CardFooter as CardFooterUi,
    CardHeader as CardHeaderUi,
    CardProps,
    Card as CardUi,
    HTMLNextUIProps,
    cn,
} from '@nextui-org/react'
import { forwardRef } from 'react'

const Card = forwardRef<HTMLDivElement, CardProps>(({ ...props }, ref) => (
   <CardUi
      ref={ref}
      {...props}
   />
))
Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, HTMLNextUIProps>(({ className, ...props }, ref) => (
   <CardHeaderUi
      ref={ref}
      className={cn('flex flex-col gap-1.5 p-3 md:p-6 ', className)}
      {...props}
   />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
   ({ className, ...props }, ref) => (
      <h3
         ref={ref}
         className={cn('font-semibold leading-none tracking-tight', className)}
         {...props}
      />
   )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<
   HTMLParagraphElement,
   React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
   <p
      ref={ref}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
   />
))
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<HTMLDivElement, HTMLNextUIProps>(({ className, ...props }, ref) => (
   <CardBody
      ref={ref}
      className={cn('gap-3 p-3 md:px-6 ', className)}
      {...props}
   />
))
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({ className, ...props }, ref) => (
   <CardFooterUi
      ref={ref}
      className={cn('flex items-center p-3 md:p-6 ', className)}
      {...props}
   />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
