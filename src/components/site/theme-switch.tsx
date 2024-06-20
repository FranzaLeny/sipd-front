'use client'

import { cn, SwitchProps, useSwitch } from '@nextui-org/react'
import { useIsSSR } from '@react-aria/ssr'
import { VisuallyHidden } from '@react-aria/visually-hidden'
import { Moon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

export interface ThemeSwitchProps {
   className?: string
   classNames?: SwitchProps['classNames']
}

const ThemeSwitch: React.FC<SwitchProps> = (props) => {
   const { theme, setTheme } = useTheme()
   const isSSR = useIsSSR()

   const onChange = () => {
      theme === 'light' ? setTheme('dark') : setTheme('light')
   }

   const { Component, slots, isSelected, getBaseProps, getInputProps, getWrapperProps } = useSwitch(
      {
         isSelected: theme === 'light',
         'aria-label': `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`,
         onChange,
         ...props,
      }
   )

   return (
      <Component {...getBaseProps()}>
         <VisuallyHidden>
            <input
               id='themes'
               aria-labelledby='themes'
               name='themes'
               {...getInputProps()}
            />
         </VisuallyHidden>
         <div
            {...getWrapperProps()}
            className={slots.wrapper({
               className: cn(
                  [
                     'w-8',
                     'h-8',
                     ' group-data-[selected=true]:text-primary mr-0 bg-transparent group-data-[selected=true]:bg-transparent',
                     'flex items-center justify-center',
                  ],
                  props?.classNames?.wrapper
               ),
            })}>
            {!isSelected || isSSR ? <SunIcon size={22} /> : <Moon size={22} />}
         </div>
      </Component>
   )
}
export default ThemeSwitch
