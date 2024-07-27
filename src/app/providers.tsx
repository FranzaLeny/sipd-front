'use client'

import { SidebarProvider } from '@/providers/sidebar-provider'
import { UiProvider } from '@/providers/ui-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { ToastContainer } from 'react-toastify'

export interface ProvidersProps extends React.HTMLProps<HTMLDivElement> {
   children: React.ReactNode
   themeProps?: Omit<ThemeProviderProps, 'children'>
}

const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         refetchOnWindowFocus: false,
         networkMode: 'always',
         retry: 0,
         staleTime: 1000 * 60 * 60, // 60 menit
         placeholderData: (prev: unknown) => prev,
      },
   },
})

export function Providers({ children, themeProps, ...uiProviderProps }: ProvidersProps) {
   return (
      <SessionProvider basePath='/auth'>
         <QueryClientProvider client={queryClient}>
            <NextThemesProvider {...themeProps}>
               <SidebarProvider>
                  <UiProvider {...uiProviderProps}>
                     {children}
                     <ToastContainer limit={5} />
                  </UiProvider>
               </SidebarProvider>
            </NextThemesProvider>
         </QueryClientProvider>
      </SessionProvider>
   )
}
