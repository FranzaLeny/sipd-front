import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Tambah Pegawai Baru',
}

export default async function MetaLayout({ children }: { children: React.ReactNode }) {
   return <>{children}</>
}
