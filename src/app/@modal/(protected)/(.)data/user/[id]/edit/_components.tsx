'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateUser } from '@actions/data/user'
import BooleanInput from '@components/form/boolean-input'
import { TextInput } from '@components/form/text-input'
import {
   Button,
   Modal,
   ModalBody,
   ModalContent,
   ModalFooter,
   ModalHeader,
   Select,
   SelectItem,
   type Selection,
} from '@nextui-org/react'
import { useQueryClient } from '@tanstack/react-query'
import { createTsForm } from '@ts-react/form'
import { snakeToTileCase } from '@utils'
import { UserSchema, z } from '@zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {}
const mapping = [[z.string(), TextInput] as const, [z.number(), BooleanInput] as const] as const
const Schema = UserSchema.pick({
   nama: true,
   jabatan: true,
   roles: true,
   username: true,
   nip: true,
   active: true,
   is_locked: true,
})
type ISchema = z.infer<typeof Schema>

const FormComponent = (props: FormProps) => <form {...props} />

const TsForm = createTsForm(mapping, { FormComponent })

const ModalCopy = ({ data, roles }: { data: IUser; roles: RoleUser[] }) => {
   const [isOpen, setIsOpen] = useState(false)
   const router = useRouter()
   const queryClient = useQueryClient()

   const form = useForm<ISchema>({
      defaultValues: {
         active: data.active,
         is_locked: data.is_locked,
         jabatan: data.jabatan,
         nama: data.nama,
         nip: data.nip,
         roles: data.roles,
         username: data.username,
      },
   })

   const {
      formState: { errors, isSubmitting },
      clearErrors,
      setValue,
   } = form

   useEffect(() => {
      setIsOpen(true)
      return () => {
         setIsOpen(false)
      }
   }, [])

   const handleClose = useCallback(() => {
      !isSubmitting && router.back()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isSubmitting])

   const onSubmit = async (value: ISchema) => {
      try {
         await updateUser(data?.id, value).then((res) => {
            if (res?.success) {
               toast.success(`${res?.message ?? 'Berhasil simpan data  data user'} ${value?.nama}`)
               queryClient.refetchQueries({
                  type: 'all',
                  exact: false,
                  predicate: ({ queryKey }) => {
                     return queryKey.includes('user')
                  },
               })

               handleClose()
            } else {
               toast.error(`${res?.message ?? 'Gagal simpan data user'} ${value?.nama}`, {
                  autoClose: 5000,
               })
            }
         })
      } catch (error: any) {
         toast.error(error?.message ?? 'Gagal simpan data user', { autoClose: 5000 })
      }
   }

   const onRoleChange = (data?: string[]) => {
      if (data) {
         clearErrors('roles')
         setValue('roles', data)
      } else {
         clearErrors('roles')
         setValue('roles', [])
      }
   }

   const pilih_role = PilihRole({
      defaultValues: data?.roles,
      onChange: onRoleChange,
      errorMessage: errors?.roles?.message,
      items: roles,
   })

   return (
      <Modal
         isOpen={isOpen}
         onClose={handleClose}
         scrollBehavior='outside'
         size='3xl'>
         <ModalContent>
            {(onClose) => (
               <TsForm
                  form={form}
                  schema={Schema}
                  onSubmit={onSubmit}>
                  {({ active, is_locked, jabatan, nama, username, nip }) => (
                     <>
                        <ModalHeader>Form Ubah User</ModalHeader>
                        <ModalBody className='gap-3 transition-all duration-75'>
                           {nama}
                           {jabatan}
                           {nip}
                           {username}
                           {pilih_role}
                           <div className='flex w-full justify-around'>
                              {active}
                              {is_locked}
                           </div>
                        </ModalBody>
                        <ModalFooter>
                           <Button
                              color='danger'
                              isDisabled={isSubmitting}
                              onPress={onClose}>
                              Tutup
                           </Button>
                           <Button
                              isLoading={isSubmitting}
                              color='primary'
                              type='submit'>
                              Simpan
                           </Button>
                        </ModalFooter>
                     </>
                  )}
               </TsForm>
            )}
         </ModalContent>
      </Modal>
   )
}

export default ModalCopy

function PilihRole({
   defaultValues,
   onChange,
   errorMessage,
   items,
}: {
   defaultValues: string[]
   errorMessage?: string
   onChange?: (data?: string[] | undefined) => void
   items: string[]
}) {
   const [value, setValue] = useState<Selection>(new Set(defaultValues))
   const _items = useMemo(() => {
      return [...new Set([...items, ...defaultValues])]
   }, [items, defaultValues])
   const handleChange = (v: Selection) => {
      if (typeof v !== 'string') {
         onChange && onChange([...v] as string[])
      }
      setValue(v)
   }
   const disabledKeys = useMemo(() => {
      return defaultValues.filter((role) => !items.includes(role))
   }, [items, defaultValues])
   return (
      <Select
         label='Role User'
         labelPlacement='outside'
         variant='bordered'
         placeholder='Pilih Role User'
         disabledKeys={disabledKeys}
         defaultSelectedKeys={defaultValues}
         disallowEmptySelection
         selectedKeys={value}
         multiple
         errorMessage={errorMessage}
         onSelectionChange={handleChange}
         fullWidth
         selectionMode='multiple'>
         {_items.map((role) => (
            <SelectItem
               key={role}
               value={role}>
               {snakeToTileCase(role)}
            </SelectItem>
         ))}
      </Select>
   )
}
