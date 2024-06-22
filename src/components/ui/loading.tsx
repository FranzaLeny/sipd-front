'use client'

import { cn, Spinner } from '@nextui-org/react'

interface LoadingProps
   extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
   color?: Colors
}
const Loading: React.FC<LoadingProps> = (props) => {
   const { color, children, className, ...other } = props
   return (
      <div
         {...other}
         className={cn([
            'flex size-full cursor-wait items-center justify-center gap-2',
            className,
         ])}>
         <Spinner color={color} />
         {children}
      </div>
   )
}
export default Loading
