import type { Metadata } from 'next'
import { getPegawai } from '@actions/data/pegawai'

import ModalDeletePegawai from './modal-confirm'

interface Props {
   params: Params
}

interface Params {
   id: string
}

export const metadata: Metadata = {
   title: 'Hapus Pegawai',
}
const Page = async ({ params: { id } }: Props) => {
   const { data: pegawai } = await getPegawai(id).catch(() => ({
      data: { id: undefined, nama: undefined },
   }))
   return <ModalDeletePegawai pegawai={{ id: pegawai?.id, nama: pegawai?.nama }} />
}

export default Page
