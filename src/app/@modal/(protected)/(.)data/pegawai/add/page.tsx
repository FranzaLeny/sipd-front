'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { addPegawai } from '@actions/data/pegawai'
import PangkatSelector from '@components/master/pangkat'
import { SkpdSelect } from '@components/perencanaan/skpd'
import { getLocalTimeZone, now, type DateValue } from '@internationalized/date'
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

import { PegawaiCreateSchema, TsForm, type PegawaiCreate } from './form'

const SKPD = {
   id_daerah: 424,
   id_skpd: 1871,
   kode_skpd: '2.11.0.00.0.00.01.0000',
   kode_unit: '2.11.0.00.0.00.01.0000',
   nama_skpd: 'Dinas Lingkungan Hidup',
}

const createDateFromNip = (nip: string) => {
   const tahun = parseInt(nip.substr(0, 4))
   const bulan = parseInt(nip.substr(4, 2))
   const tanggal = parseInt(nip.substr(6, 2))
   const tanggal_lahir = new Date(tahun, bulan - 1, tanggal)
   const tahun_asn = parseInt(nip.substr(8, 4))
   const bulan_asn = parseInt(nip.substr(12, 2))
   const tanggal_asn = new Date(tahun_asn, bulan_asn - 1, 1)
   const jenis_kelamin: any = nip.substr(14, 1) === '1' ? 'L' : 'P'
   return { tanggal_asn, tanggal_lahir, jenis_kelamin }
}

const ModalAddPegawai = () => {
   const [isOpen, setIsOpen] = useState(false)
   const router = useRouter()
   const defaultValues = {
      is_asn: 1,
      jenis_pegawai: 'PNS',
      instansi: 'Pemerintah Kabupaten Lembata',
      locked: 0,
      eselon: 6,
      ...SKPD,
   }
   const form = useForm<PegawaiCreate>({
      defaultValues,
   })
   const { refetchQueries } = useRefetchQueries()

   const handleClose = useCallback(() => {
      router.back()
   }, [router])

   const jenisPegawai = form.watch('jenis_pegawai')
   const nip = form.watch('nip')
   useEffect(() => {
      if (jenisPegawai === 'PPNPNS') {
         form.setValue('is_asn', 0)
         form.setValue('nip', undefined, { shouldValidate: true })
         form.setValue('pangkat_gol', undefined, { shouldValidate: true })
      } else {
         form.setValue('is_asn', 1)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [jenisPegawai])
   useEffect(() => {
      const nipClean = nip?.replace(/\D/g, '')
      if (nipClean?.length === 18) {
         const { tanggal_asn, tanggal_lahir, jenis_kelamin } = createDateFromNip(nipClean)
         form.setValue('tanggal_asn', tanggal_asn, { shouldValidate: true })
         form.setValue('tanggal_lahir', tanggal_lahir, { shouldValidate: true })
         form.setValue('jenis_kelamin', jenis_kelamin, { shouldValidate: true })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [nip])
   useEffect(() => {
      setIsOpen(true)
      return () => {
         setIsOpen(false)
      }
   }, [])

   const handlePangkatChange = (pangkat?: Pangkat) => {
      form.setValue('pangkat_gol', pangkat?.kode, { shouldValidate: true })
   }
   const handleSkpdChange = (skpd?: Skpd) => {
      console.log(skpd)
      if (skpd) {
         form.setValue('kode_skpd', skpd?.kode_skpd, { shouldValidate: true })
         form.setValue('id_daerah', skpd?.id_daerah, { shouldValidate: true })
         form.setValue('id_skpd', skpd?.id_skpd, { shouldValidate: true })
      }
   }
   const isAsn = !!form.watch('is_asn')

   const handeleSubmit = async (values: PegawaiCreate) => {
      await addPegawai({ ...values, locked: 0 })
         .then((res) => {
            toast.success(res?.message ?? 'Berhasil tambah data pegawai', {
               type: res?.success ? 'success' : 'error',
            })
            refetchQueries(['data_pegawai'])
            router.back()
         })
         .catch((e) => {
            toast.error(e?.message ?? 'Gagal simpan data pegawai')
         })
   }

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
                  <ModalHeader className='flex flex-col gap-1 py-2'>
                     Tambah Pegawai Baru
                  </ModalHeader>
                  <Divider />
                  <ModalBody className='gap-3'>
                     <TsForm
                        defaultValues={defaultValues}
                        formProps={{
                           id: 'form-add-pegawai',
                        }}
                        props={{
                           jenis_kelamin: {
                              options: [
                                 { value: 'L', label: 'Laki-laki' },
                                 { value: 'P', label: 'Perempuan' },
                              ],
                              orientation: 'horizontal',
                           },

                           tanggal_lahir: {
                              granularity: 'day',
                              // tanggal tidak bpleh lebih dari 10 tahun yang lalu
                              isDateUnavailable: (date: DateValue) =>
                                 date?.compare(now(getLocalTimeZone()).subtract({ years: 10 })) >
                                    0 ||
                                 date?.compare(now(getLocalTimeZone()).subtract({ years: 60 })) < 0,

                              showMonthAndYearPickers: true,
                           },
                           tanggal_asn: {
                              granularity: 'day',
                              isDateUnavailable: (date: DateValue) =>
                                 date?.compare(now(getLocalTimeZone()).subtract({ days: 1 })) > 0 ||
                                 date.compare(now(getLocalTimeZone()).subtract({ years: 45 })) < 0,
                              showMonthAndYearPickers: true,
                           },
                           jenis_pegawai: {
                              options: [
                                 { value: 'PNS', label: 'PNS' },
                                 { value: 'P3K', label: 'P3K' },
                                 { value: 'PPNPNS', label: 'PPNPNS/KSO' },
                              ],
                              orientation: 'horizontal',
                           },
                        }}
                        onSubmit={handeleSubmit}
                        form={form}
                        schema={PegawaiCreateSchema}>
                        {({
                           nama,
                           gelar_depan,
                           gelar_belakang,
                           jenis_kelamin,
                           tanggal_lahir,
                           tempat_lahir,
                           nik,
                           npwp,
                           alamat,
                           jenis_pegawai,
                           nip,
                           jabatan,
                           instansi,
                           tanggal_asn,
                           eselon,
                           ...other
                        }) => (
                           <>
                              <div className='hidden'>{Object.values(other)}</div>
                              {nama}
                              <div className='flex gap-3'>
                                 {gelar_depan}
                                 {gelar_belakang}
                              </div>
                              {jenis_kelamin}
                              {nik}
                              {npwp}
                              {alamat}
                              {jenis_pegawai}
                              {jabatan}
                              {eselon}
                              {isAsn && (
                                 <>
                                    {nip}
                                    {tanggal_asn}
                                    <PangkatSelector
                                       isInvalid={!!form?.formState?.errors?.pangkat_gol}
                                       errorMessage={form?.formState?.errors?.pangkat_gol?.message}
                                       onSelected={handlePangkatChange}
                                    />
                                 </>
                              )}
                              <div className='flex gap-3'>
                                 {tempat_lahir}
                                 {tanggal_lahir}
                              </div>
                              {instansi}
                              <SkpdSelect
                                 label='Nama SKPD'
                                 menuTrigger='manual'
                                 allowsCustomValue
                                 onInputChange={(v) =>
                                    form.setValue('nama_skpd', v, { shouldValidate: true })
                                 }
                                 inputValue={form?.watch('nama_skpd')}
                                 selectionKey='id_skpd'
                                 onSkpdChange={handleSkpdChange}
                                 disabledKeys={new Set([form?.watch('id_skpd')?.toString() ?? ''])}
                                 params={{ tahun: 2024 }}
                              />
                           </>
                        )}
                     </TsForm>
                  </ModalBody>
                  <Divider />
                  {JSON?.stringify(form?.formState?.errors)}
                  <ModalFooter className='py-2'>
                     <ModalFooter>
                        <Button
                           type='button'
                           onPress={onClose}
                           color='danger'>
                           Tutup
                        </Button>
                        <Button
                           form='form-add-pegawai'
                           type='submit'
                           color='primary'>
                           Simpan
                        </Button>
                     </ModalFooter>
                  </ModalFooter>
               </>
            )}
         </ModalContent>
      </Modal>
   )
}

export default ModalAddPegawai
