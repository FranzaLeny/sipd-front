'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateAkun } from '@actions/perencanaan/data/akun'
import {
   Button,
   Divider,
   Modal,
   ModalBody,
   ModalContent,
   ModalFooter,
   ModalHeader,
} from '@nextui-org/react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useRefetchQueries } from '@shared/hooks/use-refetch-queries'

import { AkunEditSchema, TsForm, type AkunEdit } from './form-edit'

const ModalEdit: React.FC<{ akun?: Akun }> = ({ akun }) => {
   const [isOpen, setIsOpen] = useState(false)
   const router = useRouter()

   const form = useForm<AkunEdit>()
   const { refetchQueries } = useRefetchQueries()

   const handleClose = useCallback(() => {
      router.back()
   }, [router])

   const handeleSubmit = async (values: AkunEdit) => {
      if (akun?.id) {
         await updateAkun(akun.id, { is_pdinas: values.is_pdinas })
            .then((res) => {
               toast(res?.message ?? 'Berhasil', { type: res?.success ? 'success' : 'error' })
               refetchQueries('data_akun')
               handleClose()
            })
            .catch((err) => {
               toast.error(err.message)
            })
      }
   }

   useEffect(() => {
      setIsOpen(true)
      return () => {
         setIsOpen(false)
      }
   }, [])
   return (
      <Modal
         scrollBehavior='inside'
         size='xl'
         placement='center'
         classNames={{
            base: 'max-h-[calc(100%_-_8rem)]',
         }}
         isOpen={isOpen}
         onClose={handleClose}>
         <ModalContent>
            {(onClose) => (
               <>
                  <ModalHeader className='flex flex-col gap-1 py-2'>Ubah Data Akun</ModalHeader>
                  <Divider />
                  <ModalBody className='gap-3'>
                     <TsForm
                        defaultValues={akun}
                        formProps={{
                           id: 'form-edit-akun',
                        }}
                        props={{
                           nama_akun: { isReadOnly: true },
                           kode_akun: { isReadOnly: true },
                           tahun: { isReadOnly: true },
                           is_locked: { isReadOnly: true },
                           is_pdinas: {
                              isDisabled: !!!akun?.is_bl || !!!akun.set_input || akun.level !== 17,
                           },
                        }}
                        onSubmit={handeleSubmit}
                        form={form}
                        schema={AkunEditSchema}
                     />
                  </ModalBody>
                  <Divider />
                  <ModalFooter className='py-2'>
                     <ModalFooter>
                        <Button
                           type='button'
                           onPress={onClose}
                           color='danger'>
                           Tutup
                        </Button>
                        <Button
                           form='form-edit-akun'
                           type='submit'
                           color='primary'>
                           Simpan perubahan
                        </Button>
                     </ModalFooter>
                  </ModalFooter>
               </>
            )}
         </ModalContent>
      </Modal>
   )
}

export default ModalEdit
