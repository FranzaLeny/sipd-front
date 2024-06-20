import { cn } from '@nextui-org/react'
import * as React from 'react'

export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {}

const Form = React.forwardRef<HTMLFormElement, React.HTMLAttributes<HTMLFormElement>>(
   ({ className, ...props }, ref) => (
      <form
         ref={ref}
         className={cn('bg-content1 text-content1-foreground rounded-xl border shadow', className)}
         {...props}
      />
   )
)
Form.displayName = 'Form'

export interface FormHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormHeader = React.forwardRef<HTMLDivElement, FormHeaderProps>(
   ({ className, ...props }, ref) => (
      <div
         ref={ref}
         className={cn('flex flex-col space-y-1.5 p-6', className)}
         {...props}
      />
   )
)
FormHeader.displayName = 'FormHeader'

export interface FormTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const FormTitle = React.forwardRef<HTMLParagraphElement, FormTitleProps>(
   ({ className, ...props }, ref) => (
      <h3
         ref={ref}
         className={cn('font-semibold leading-none tracking-tight', className)}
         {...props}
      />
   )
)
FormTitle.displayName = 'FormTitle'

export interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormDescription = React.forwardRef<HTMLParagraphElement, FormContentProps>(
   ({ className, ...props }, ref) => (
      <p
         ref={ref}
         className={cn('text-muted-foreground text-sm', className)}
         {...props}
      />
   )
)
FormDescription.displayName = 'FormDescription'

export interface FormContentProps extends React.HTMLAttributes<HTMLDivElement> {}
const FormContent = React.forwardRef<HTMLDivElement, FormContentProps>(
   ({ className, ...props }, ref) => (
      <div
         ref={ref}
         className={cn('p-6 pt-0', className)}
         {...props}
      />
   )
)
FormContent.displayName = 'FormContent'

export interface FormFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
const FormFooter = React.forwardRef<HTMLDivElement, FormFooterProps>(
   ({ className, ...props }, ref) => (
      <div
         ref={ref}
         className={cn('flex items-center p-6 pt-0', className)}
         {...props}
      />
   )
)
FormFooter.displayName = 'FormFooter'

export { Form, FormContent, FormDescription, FormFooter, FormHeader, FormTitle }

export interface FormContainerProps extends React.HTMLAttributes<HTMLFormElement> {
   formHeaderProps?: Omit<FormHeaderProps, 'children'>
   formTitleProps?: FormTitleProps
   formContentProps?: Omit<FormContentProps, 'children'>
   formFooterProps?: FormFooterProps
   formDescriptionProps?: FormDescriptionProps
}
