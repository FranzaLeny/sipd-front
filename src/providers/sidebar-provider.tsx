'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

interface SidebarContextProps {
   isSidebarOpen: boolean
   setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

export const useSidebar = () => {
   const context = useContext(SidebarContext)
   if (!context) {
      throw new Error('useSidebar must be used within a SidebarProvider')
   }
   return context
}

interface SidebarProviderProps {
   children: ReactNode
}
export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
   const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)

   const sidebarContextValue: SidebarContextProps = {
      isSidebarOpen,
      setIsSidebarOpen,
   }
   return <SidebarContext.Provider value={sidebarContextValue}>{children}</SidebarContext.Provider>
}
