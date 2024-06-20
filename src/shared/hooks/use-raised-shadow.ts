'use client'

import { useEffect } from 'react'
import { animate, MotionValue, useMotionValue } from 'framer-motion'

const inactiveShadow = '0px 0px 0px rgba(0,0,0,0)'
const inactiveBackground = 'rgba(0,0,0,0)'
function getCssVariableValue(variable: string) {
   return getComputedStyle(document.documentElement).getPropertyValue(variable)
}

export function useRaisedShadow(value: MotionValue<number>) {
   const boxShadow = useMotionValue(inactiveShadow)
   const backgroundColor = useMotionValue(inactiveBackground)

   useEffect(() => {
      let isActive = false

      const unsubscribe = value.on('change', (latest) => {
         const wasActive = isActive
         if (latest !== 0) {
            const background = getCssVariableValue('--ui-content1')?.split(' ')?.join(', ')
            const divider = getCssVariableValue('--ui-divider')?.split(' ')?.join(', ')
            isActive = true
            if (isActive !== wasActive) {
               animate(boxShadow, `4px 4px 8px hsl(${divider}/0.2)`, { duration: 0.1 })
               animate(backgroundColor, `hsl(${background})`, { duration: 0.1 })
            }
         } else {
            isActive = false
            if (isActive !== wasActive) {
               animate(boxShadow, inactiveShadow, { duration: 0.1 })
               animate(backgroundColor, inactiveBackground, { duration: 0.1 })
            }
         }
      })

      return () => unsubscribe()
   }, [value, boxShadow, backgroundColor])

   return { boxShadow, backgroundColor }
}
