'use client'

import { useEffect, useState } from 'react'
import {
   Button,
   Modal,
   ModalBody,
   ModalContent,
   ModalFooter,
   ModalHeader,
   Textarea,
   useDisclosure,
} from '@nextui-org/react'
import { Reorder } from 'framer-motion'
import { Control, useController } from 'react-hook-form'

import { PDinasInput } from './componet-form'

export default function DasarSPT({ control }: { control: Control<PDinasInput> }) {
   const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
   const [selectedIndex, setSelectedIndex] = useState(0)
   const [value, setValue] = useState('')
   const {
      field: { value: dasar, onChange, name },
      formState: {
         errors: { dasar: dasarError = [] },
      },
      fieldState: { invalid },
   } = useController({ name: 'dasar', control })

   const handleDataChange = (operation: 'update' | 'remove') => {
      if (!!value.trim()) {
         if (!!selectedIndex) {
            if (operation === 'remove') {
               onChange([...dasar.slice(0, selectedIndex - 1), ...dasar.slice(selectedIndex)])
            } else {
               onChange([
                  ...dasar.slice(0, selectedIndex - 1),
                  value,
                  ...dasar.slice(selectedIndex),
               ])
            }
         } else {
            onChange([...dasar, value])
         }
      }
      setValue('')
      setSelectedIndex(0)
      onClose()
   }
   useEffect(() => {
      if (Math.abs(selectedIndex) && dasar?.length) {
         setValue(dasar[Math.abs(selectedIndex) - 1])
      }
   }, [selectedIndex, dasar])
   return (
      <div className='space-y-3'>
         <div className='bg-secondary-50  rounded-medium flex items-center justify-between'>
            <h6 className='pl-3'>Dasar -Dasar Perjalanan Dinas</h6>
            <Button
               variant='bordered'
               color='primary'
               onPress={onOpen}>
               Tambah Dasa Perjalanan Dinas
            </Button>
         </div>
         <Modal
            isOpen={isOpen}
            onClose={() => {
               setSelectedIndex(0)
               setValue('')
            }}
            onOpenChange={onOpenChange}>
            <ModalContent>
               {(onClose) => (
                  <>
                     <ModalHeader className='flex flex-col gap-1'>
                        {!!selectedIndex ? 'Ubah' : 'Tambah'} Dasar Perjalanan Dinas
                     </ModalHeader>
                     <form id='form-dasar-pd'>
                        <ModalBody>
                           <Textarea
                              name='dasar_pd'
                              id='dasar_pd'
                              isInvalid={!value.trim()}
                              errorMessage='Tidak boleh kosong!'
                              value={value ?? undefined}
                              variant='bordered'
                              onValueChange={(v) => !!v.trim() && setValue(v)}
                              required
                              label='Dasar Perjalanan dinas'
                              placeholder='Masukan dasar - dasar perjalanan dinas'
                           />
                        </ModalBody>
                        <ModalFooter>
                           {!!selectedIndex && (
                              <Button
                                 color='danger'
                                 onPress={() => handleDataChange('remove')}>
                                 Hapus
                              </Button>
                           )}
                           <Button
                              form='form-dasar-pd'
                              color={!!selectedIndex ? 'success' : 'primary'}
                              onPress={() => handleDataChange('update')}>
                              {!!selectedIndex ? 'Ubah' : 'Tambah'}
                           </Button>
                        </ModalFooter>
                     </form>
                  </>
               )}
            </ModalContent>
         </Modal>
         <Reorder.Group
            className='list-inside list-[lower-alpha] space-y-2'
            axis='y'
            id='dasar-spt'
            values={dasar}
            onReorder={onChange}>
            {dasar?.map((item, i) => (
               <Reorder.Item
                  className={`border-divider flex items-center justify-between rounded-lg border p-2 ${!!dasarError[i] ? 'border-danger-500' : ''}`}
                  key={item.replace(/[^a-zA-Z0-9]/g, '')}
                  value={item}>
                  {item}{' '}
                  <span>
                     <Button
                        onPress={() => {
                           setSelectedIndex(i + 1)
                           onOpen()
                        }}
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
         <p className='text-danger-'>{dasar?.length === 0 ? 'Tidak ada data' : ''}</p>
      </div>
   )
}
