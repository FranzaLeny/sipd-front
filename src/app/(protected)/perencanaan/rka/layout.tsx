export const metadata = {
   title: {
      template: `RKA | %s`,
   },
   keywords: ['rka', 'sipd', 'dlh', 'sipd-dlh', 'lembata'],
}

interface Props {
   children: React.ReactNode
}

const Layout = ({ children }: Props) => children

export default Layout
