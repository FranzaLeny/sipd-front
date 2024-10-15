'use client'

import { useMemo, useState } from 'react'
import PegawaiSelector from '@components/master/pegawai'
import { DateFormatter } from '@internationalized/date'
import {
   Button,
   Modal,
   ModalBody,
   ModalContent,
   ModalFooter,
   ModalHeader,
   useDisclosure,
} from '@nextui-org/react'
import { eselonToString } from '@utils/roman'
import { Reorder } from 'framer-motion'
import { sortBy } from 'lodash-es'
import { EllipsisVertical } from 'lucide-react'
import { useController, useForm, type Control } from 'react-hook-form'
import { z } from 'zod'

import { PelaksanaPdSchema, TsForm, type PDinasInput } from './componet-form'

type PelaksanaPd = z.infer<typeof PelaksanaPdSchema>
export default function PelaksanaPDinas({ control }: { control: Control<PDinasInput> }) {
   const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
   const [formData, setFormData] = useState<PelaksanaPd>()
   const {
      field: { value, onChange, name },
      formState: {},
      fieldState: { invalid },
   } = useController({ name: 'pelaksana', control })
   const listPelaksana: PelaksanaPd[] = useMemo(
      () =>
         value
            ?.sort((a, b) => a.nomor_urut - b.nomor_urut)
            ?.map((d, i) => ({ ...d, nomor_urut: i + 1 })) || [],
      [value]
   )

   const handleOrder = (data: PelaksanaPd[]) => {
      onChange(data?.map((d, i) => ({ ...d, nomor_urut: i + 1 })))
   }
   const handleDataChange = (item: PelaksanaPd, index?: number, isDelete = false) => {
      const temp = listPelaksana?.filter(
         (peg, i) => i !== index && peg.pegawai_id !== item.pegawai_id
      )
      if (!isDelete) {
         temp.push(item)
      }
      onChange(temp)
      setFormData(undefined)
   }

   const handeleOpen = (data?: PelaksanaPd) => {
      setFormData(data)
      onOpen()
   }
   const handleClose = () => {
      setFormData(undefined)
      onClose()
   }
   const formatter = new DateFormatter('id-ID', { dateStyle: 'long' })
   const listPegawaiId = sortBy(listPelaksana?.map((d) => d.pegawai_id))
   return (
      <div>
         <ModalAddPegawai
            isOpen={isOpen}
            onClose={handleClose}
            onOpenChange={onOpenChange}
            handleDataChange={handleDataChange}
            defaultValue={formData}
            lastNumber={listPelaksana?.length ?? 1}
            disabledKeysPegawai={listPegawaiId}
         />
         <div
            className={`rounded-t-medium ${invalid || listPelaksana?.length === 0 ? 'border-danger' : 'border-divider'} flex items-center justify-between border p-2`}>
            <h6 className='pl-3'>Pelaksana Perjalanan Dinas</h6>
            <Button
               color='secondary'
               onPress={() => handeleOpen()}>
               Pelaksana Baru
            </Button>
         </div>
         {listPelaksana?.length > 0 ? (
            <table className='min-w-full'>
               <thead>
                  <tr className='text-center'>
                     <th className='cell-print font-normal'>No</th>
                     <th className='cell-print font-normal'>Nama/NIP/Jabatan</th>
                     <th className='cell-print font-normal'>TTL</th>
                     <th className='cell-print font-normal'>Ket</th>
                     <th className='cell-print font-normal'>#</th>
                  </tr>
               </thead>
               <Reorder.Group
                  as='tbody'
                  axis='y'
                  id='dasar-spt'
                  values={listPelaksana}
                  onReorder={handleOrder}>
                  {listPelaksana?.map((item, i) => (
                     // TODO Tampilkan error
                     <Reorder.Item
                        as='tr'
                        key={item?.pegawai_id}
                        value={item}>
                        <td className='cell-print'>{i + 1}</td>
                        <td className='cell-print'>
                           <div>{item?.nama}</div>
                           {item?.nip && <div>{item?.nip}</div>}
                           <div>{item?.jabatan}</div>
                        </td>
                        <td className='cell-print'>{formatter.format(item?.tanggal_lahir)}</td>
                        <td className='cell-print'>{item?.keterangan}</td>
                        <td className='cell-print'>
                           <Button
                              onPress={() => {
                                 handeleOpen(item)
                              }}
                              color='secondary'
                              isIconOnly
                              className='inline-flex size-5'
                              size='sm'>
                              <EllipsisVertical size={20} />
                           </Button>
                        </td>
                     </Reorder.Item>
                  ))}
               </Reorder.Group>
            </table>
         ) : (
            <p className='text-danger border-danger rounded-b-medium border-x border-b p-2 text-center'>
               Tidak ada data pelaksana perjalanan dinas
            </p>
         )}
      </div>
   )
}
const VAL_OP = {
   shouldValidate: true,
   shouldTouch: false,
   shouldDirty: false,
}
const ModalAddPegawai = ({
   isOpen,
   onClose,
   onOpenChange,
   defaultValue,
   lastNumber = 0,
   handleDataChange = () => {},
   disabledKeysPegawai = [],
}: {
   isOpen: boolean
   onOpenChange: () => void
   handleDataChange: (item: PelaksanaPd, index?: number, isDelete?: boolean) => void
   onClose: () => void
   defaultValue?: PelaksanaPd
   lastNumber?: number
   disabledKeysPegawai: string[]
}) => {
   const itemDefault = {
      nomor_urut: lastNumber + 1,
      unit_kerja: 'Dinas Lingkungan Hidup',
      is_pengikut: !!lastNumber ? 1 : 0,
   }
   const formPegawai = useForm<PelaksanaPd>()
   const handleClose = () => {
      formPegawai.reset(itemDefault)
      onClose()
   }
   const hanldeSubmit = (data: PelaksanaPd, isDelete = false) => {
      handleDataChange(data, data?.nomor_urut - 1, isDelete)
      onClose()
      formPegawai.reset(itemDefault)
   }
   const handlePegawaiChange = (data?: PegawaiWithPangkat) => {
      if (!!data) {
         const isGolongan = data?.eselon > 4
         const eselon = data?.is_asn ? eselonToString(data?.eselon) : data?.jenis_pegawai
         const pangkat = data?.pangkat
         formPegawai.clearErrors()
         formPegawai.setValue('unit_kerja', data?.nama_sub_skpd ?? data?.nama_skpd, VAL_OP)
         formPegawai.setValue('jabatan', data?.jabatan, VAL_OP)
         formPegawai.setValue('jenis_pegawai', data?.jenis_pegawai, VAL_OP)
         formPegawai.setValue('pangkat_gol', data?.pangkat_gol)
         formPegawai.setValue('tanggal_lahir', new Date(data?.tanggal_lahir), VAL_OP)
         formPegawai.setValue('pegawai_id', data?.id, VAL_OP)
         formPegawai.setValue('nama', data?.nama, VAL_OP)
         formPegawai.setValue('nip', data?.nip, VAL_OP)
         formPegawai.setValue(
            'keterangan',
            isGolongan ? `Golongan ${pangkat?.golongan}` : eselon,
            VAL_OP
         )
      }
   }

   return (
      <Modal
         isOpen={isOpen}
         onClose={handleClose}
         onOpenChange={onOpenChange}
         scrollBehavior='inside'>
         <ModalContent>
            <ModalHeader>
               {!!defaultValue ? 'Ubah' : 'Tambah'} Pelaksana Perjalanan Dinas
            </ModalHeader>
            <ModalBody>
               <PegawaiSelector
                  variant='flat'
                  disabledKeys={disabledKeysPegawai}
                  onChange={handlePegawaiChange}
                  params={{ orderBy: ['-is_asn', '-pangkat_gol', 'nip'] }}
               />
               <TsForm
                  defaultValues={{ ...itemDefault, ...defaultValue }}
                  props={{
                     pegawai_id: { hidden: true },
                     nomor_urut: { hidden: true },
                     jabatan: { hidden: true },
                     nip: {
                        hidden: formPegawai.watch('jenis_pegawai') === 'PPNPNS',
                     },
                     pangkat_gol: { hidden: true },
                     is_pengikut: { label: 'Pengikut', typeValue: 'number' },
                     tanggal_lahir: {
                        granularity: 'day',
                        calendarProps: {},
                        popoverProps: { placement: 'bottom-end' },
                     },
                  }}
                  formProps={{ id: 'form-pegawai' }}
                  schema={PelaksanaPdSchema}
                  form={formPegawai}
                  onSubmit={hanldeSubmit}
               />
            </ModalBody>
            <ModalFooter className='flex items-center justify-end gap-3'>
               {!!defaultValue && (
                  <Button
                     type='button'
                     color='danger'
                     onPress={() => hanldeSubmit(defaultValue, true)}>
                     Hapus
                  </Button>
               )}
               <Button
                  form='form-pegawai'
                  type='submit'
                  color='primary'>
                  {!!defaultValue ? 'Ubah Pegawai' : 'Tambah Pegawai'}
               </Button>
            </ModalFooter>
         </ModalContent>
      </Modal>
   )
}
