'use client'

import { useState } from 'react'
import {
   Button,
   Modal,
   ModalBody,
   ModalContent,
   ModalFooter,
   ModalHeader,
   Tooltip,
   useDisclosure,
} from '@nextui-org/react'
import { Reorder } from 'framer-motion'
import { CirclePlus, SquarePen } from 'lucide-react'
import {
   useController,
   useForm,
   type Control,
   type FieldError,
   type FieldValues,
   type Merge,
} from 'react-hook-form'

import { DasarForm, TextInputSchema, type PDinasInput, type TextInput } from './componet-form'

type SelectedItem = {
   value?: string
   index?: number
}

export function DasarSPT({ control }: { control: Control<PDinasInput> }) {
   const {
      field: { value: listDasar, onChange },
      formState: {
         errors: { dasar: errors },
      },
      fieldState: { invalid },
   } = useController({ name: 'dasar', control })
   return (
      <TextArrayInput
         name='Dasar Perjalanan Dinas'
         errors={errors}
         listValue={listDasar}
         invalid={invalid}
         onChange={onChange}
      />
   )
}
export function TujuanSPT({ control }: { control: Control<PDinasInput> }) {
   const {
      field: { value, onChange },
      formState: {
         errors: { dasar: errors },
      },
      fieldState: { invalid },
   } = useController({ name: 'tujuan_pd', control })
   return (
      <TextArrayInput
         name='Tujuan Perjalanan Dinas'
         errors={errors}
         listValue={value}
         invalid={invalid}
         onChange={onChange}
      />
   )
}
function TextArrayInput<T extends FieldValues>({
   listValue = [],
   onChange,
   name,
   invalid = false,
   errors = [],
}: {
   listValue: string[]
   errors?: Merge<FieldError, (FieldError | undefined)[]>
   name: string
   invalid?: boolean
   onChange: (data: string[]) => void
}) {
   const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
   const [selected, setSelected] = useState<SelectedItem>()

   const handleClose = () => {
      setSelected(undefined)
      onClose()
   }
   const handleDataChange = (data: TextInput, isDelete = false) => {
      const { value } = data
      let temp: string[] = [...listValue]

      if (typeof selected?.index === 'number') {
         if (isDelete) {
            temp = listValue?.filter((d, i) => i !== selected?.index)
         } else {
            temp = listValue?.map((d, i) => (i === selected?.index ? value : d))
         }
      } else {
         temp.push(value)
      }
      onChange(temp)
   }

   const handleOpen = (data?: SelectedItem) => {
      setSelected(data)
      onOpen()
   }

   return (
      <div
         className={`rounded-medium border-divider space-y-3 border p-2 ${invalid && 'border-danger '}`}>
         <DialogTextEditor
            handleClose={handleClose}
            onOpenChange={onOpenChange}
            selected={selected}
            handleDataChange={handleDataChange}
            isOpen={isOpen}
            title={name}
         />
         <table className='min-w-full border-0'>
            <thead>
               <tr>
                  <th
                     colSpan={3}
                     className=''>
                     <div className='flex content-end justify-between'>
                        <p className='flex-1'>{name} :</p>
                        <Tooltip
                           color={errors?.message ? 'danger' : 'warning'}
                           placement='top-end'
                           content={!!errors?.message ? errors?.message : `Tambah ${name} baru`}>
                           <Button
                              startContent={<CirclePlus />}
                              color='primary'
                              radius='md'
                              onPress={() => handleOpen()}>
                              Baru
                           </Button>
                        </Tooltip>
                     </div>
                  </th>
               </tr>
            </thead>
            <Reorder.Group
               axis='y'
               id='dasar-spt'
               as='tbody'
               values={listValue}
               onReorder={onChange}>
               {listValue?.map((item, i) => (
                  <Reorder.Item
                     as='tr'
                     className={`hover:bg-foreground/10 hover:cursor-move ${!!errors[i] ? 'border-danger-500 border' : ''}`}
                     key={item.replace(/[^a-zA-Z0-9]/g, '')}
                     value={item}>
                     <td className='px-2 py-1 align-top'>{i + 1}</td>
                     <td className='px-2 py-1 align-top'>{item}</td>
                     <td className='px-2 py-0.5 text-end align-middle'>
                        <Tooltip
                           placement='bottom-end'
                           content={`Ubah / hapus ${name}`}>
                           <Button
                              onPress={() => handleOpen({ value: item, index: i })}
                              variant='bordered'
                              radius='full'
                              color='success'
                              size='sm'
                              isIconOnly>
                              <SquarePen className='size-4' />
                           </Button>
                        </Tooltip>
                     </td>
                  </Reorder.Item>
               ))}
            </Reorder.Group>
         </table>

         {!!errors?.message && <p className='text-danger-500 text-center'>{errors?.message}</p>}
      </div>
   )
}
function DialogTextEditor({
   title = 'Dasar Perjalanan Dinas',
   isOpen,
   handleClose,
   onOpenChange,
   selected,
   handleDataChange,
}: {
   title?: string
   isOpen: boolean
   handleClose: () => void
   onOpenChange: () => void
   selected?: SelectedItem
   handleDataChange: (data: TextInput, isDelete?: boolean) => void
}) {
   const formDasar = useForm<TextInput>()
   const onClose = () => {
      formDasar.reset({ value: undefined })
      handleClose()
   }
   const handeleSubmit = (data: TextInput, isDelete = false) => {
      handleDataChange(data, isDelete)
      onClose()
   }
   return (
      <Modal
         isOpen={isOpen}
         placement='top'
         onClose={onClose}
         onOpenChange={onOpenChange}>
         <ModalContent>
            <ModalHeader className='flex flex-col gap-1 py-2'>
               {!!selected ? 'Ubah' : 'Tambah'} {title}
            </ModalHeader>
            <ModalBody>
               <DasarForm
                  defaultValues={{ value: selected?.value }}
                  formProps={{
                     id: 'text-input',
                  }}
                  props={{ value: { label: title } }}
                  onSubmit={handeleSubmit}
                  form={formDasar}
                  schema={TextInputSchema}
               />
            </ModalBody>
            <ModalFooter className='py-2'>
               {!!selected && (
                  <Button
                     type='button'
                     onPress={() => handeleSubmit({ value: '' }, true)}
                     color='danger'>
                     Hapus
                  </Button>
               )}
               <Button
                  form='text-input'
                  type='submit'
                  color={!!selected ? 'success' : 'primary'}>
                  Simpan {!!selected && 'Perubahan'}
               </Button>
            </ModalFooter>
         </ModalContent>
      </Modal>
   )
}
