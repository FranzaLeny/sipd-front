'use client'

import { useState } from 'react'
import {
   Button,
   Modal,
   ModalBody,
   ModalContent,
   ModalFooter,
   ModalHeader,
   useDisclosure,
} from '@nextui-org/react'
import { Reorder } from 'framer-motion'
import { Control, useController, useForm } from 'react-hook-form'

import { DasarForm, DasarInput, DasarInputSchema, PDinasInput } from './componet-form'

type SelectedItem = {
   dasar?: string
   index?: number
}

export default function DasarSPT({ control }: { control: Control<PDinasInput> }) {
   const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
   const [selected, setSelected] = useState<SelectedItem>()

   const {
      field: { value: listDasar, onChange, name },
      formState: {
         errors: { dasar: dasarError = [] },
      },
      fieldState: { invalid },
   } = useController({ name: 'dasar', control })

   const handleClose = () => {
      setSelected(undefined)
      onClose()
   }
   const handleDataChange = (data: DasarInput, isDelete = false) => {
      const { dasar } = data
      let temp: string[] = [...listDasar]
      if (typeof selected?.index === 'number') {
         if (isDelete) {
            temp = listDasar?.filter((d, i) => i !== selected?.index)
         } else {
            temp = listDasar?.map((d, i) => (i === selected?.index ? dasar : d))
         }
      } else {
         temp.push(dasar)
      }
      onChange(temp)
   }

   const handleOpen = (data?: SelectedItem) => {
      setSelected(data)
      onOpen()
   }

   return (
      <div className='space-y-3'>
         <div className='bg-secondary-50  rounded-medium flex items-center justify-between'>
            <h6 className='pl-3'>Dasar-dasar Perjalanan Dinas</h6>
            <Button
               variant='bordered'
               color='primary'
               onPress={() => handleOpen()}>
               Tambah Dasar Perjalanan Dinas
            </Button>
         </div>
         {NewFunction({
            isOpen,
            handleClose,
            onOpenChange,
            selected,
            handleDataChange,
         })}
         <Reorder.Group
            className='list-inside list-[lower-alpha] space-y-2'
            axis='y'
            id='dasar-spt'
            values={listDasar}
            onReorder={onChange}>
            {listDasar?.map((item, i) => (
               <Reorder.Item
                  className={`border-divider flex items-center justify-between rounded-lg border p-2 ${!!dasarError[i] ? 'border-danger-500' : ''}`}
                  key={item.replace(/[^a-zA-Z0-9]/g, '')}
                  value={item}>
                  {item}{' '}
                  <span>
                     <Button
                        onPress={() => handleOpen({ dasar: item, index: i })}
                        variant='ghost'
                        radius='full'
                        className='inline-flex size-5'
                        size='sm'>
                        Ubah
                     </Button>
                  </span>
               </Reorder.Item>
            ))}
         </Reorder.Group>
         <p className='text-danger-'>{listDasar?.length === 0 ? 'Tidak ada data' : ''}</p>
      </div>
   )
}
function NewFunction({
   isOpen,
   handleClose,
   onOpenChange,
   selected,
   handleDataChange,
}: {
   isOpen: boolean
   handleClose: () => void
   onOpenChange: () => void
   selected?: SelectedItem
   handleDataChange: (data: DasarInput, isDelete?: boolean) => void
}) {
   const formDasar = useForm<DasarInput>()
   const onClose = () => {
      formDasar.reset({ dasar: undefined })
      handleClose()
   }
   const handeleSubmit = (data: DasarInput) => {
      handleDataChange(data)
      onClose()
   }
   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         onOpenChange={onOpenChange}>
         <ModalContent>
            <ModalHeader className='flex flex-col gap-1'>
               {!!selected ? 'Ubah' : 'Tambah'} Dasar Perjalanan Dinas
            </ModalHeader>
            <ModalBody>
               <DasarForm
                  defaultValues={{ dasar: selected?.dasar }}
                  formProps={{
                     id: 'form-dasar-pd',
                  }}
                  onSubmit={handeleSubmit}
                  form={formDasar}
                  schema={DasarInputSchema}
               />
            </ModalBody>
            <ModalFooter>
               <Button
                  type='button'
                  color='danger'>
                  Hapus
               </Button>
               <Button
                  form='form-dasar-pd'
                  type='submit'
                  color={!!selected ? 'success' : 'primary'}>
                  {!!selected ? 'Ubah' : 'Tambah'}
               </Button>
            </ModalFooter>
         </ModalContent>
      </Modal>
   )
}
