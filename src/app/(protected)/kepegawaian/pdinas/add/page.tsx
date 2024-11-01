'use client'

import { useEffect } from 'react'
import type { DateInputProps } from '@components/form/date-time-input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@components/ui/card'
import { Button } from '@nextui-org/react'
import { toRoman } from '@utils/roman'
import { useForm } from 'react-hook-form'

import { AlatAngkut } from './alat-angkut'
import { PDinasInputSchema, TsForm, type PDinasInput } from './componet-form'
import { DasarSPT, TujuanSPT } from './dasar-spt'
import PelaksanaPDinas from './pelaksana-pd'
import { PendanaanPerjalananDinas } from './pendanaan'

const dateProps: DateInputProps = {
   hideTimeZone: false,
   showMonthAndYearPickers: true,
   granularity: 'day',
   popoverProps: { placement: 'bottom-end' },
}
const CURR_DATE = new Date()
const ROMAN_CURR_MONTH = toRoman(CURR_DATE.getMonth() + 1)
const YEAR = CURR_DATE.getFullYear()
const STR_DATE = CURR_DATE.toLocaleDateString('id-ID', { dateStyle: 'long' })
const DEFAULT_VALUES: Partial<PDinasInput> = {
   alat_angkut: 'Kendaraan Roda Empat',
   dasar: [
      `Surat dari Kepala Dinas Lingkungan Hidup Kab. Cirebon tanggal ${STR_DATE} nomor 0.1.2.3 perihal Perjalanan Dinas`,
      `Nota pertimbangan dari Kepala Bidang Lingkungan Hidup nomor:XX/XXX/2024 ${STR_DATE}`,
      `Disposisi Kepala Dinas Lingkungan Hidup Kabupaten Lembata tanggal ${STR_DATE}`,
      `DPA/DPPA Dinas Lingkungan Hidup Kabupaten Lembata tahun anggaran ${YEAR}`,
   ],
   tujuan_pd: [
      `Melaksanakan Perjalanan Dinas pada tanggal ${STR_DATE} pada desa Hadakewa Kecamatan Lebatukan Kabupaten Lembata`,
      'Melaksanakan Perjalanan Dinas dengan penuh rasa tanggungjawab',
      'Melaporkan hasil Perjalanan Dinas kepada kepala Dinas Lingkungan Hidup Kabupaten Lembata',
   ],
   tempat_tujuan: 'Desa Hadakewa Kecamatan Lebatukan Kabupaten Lembata',
   tempat_berangkat: 'Lewoleba',
   tanggal_berangkat: CURR_DATE,
   tanggal_pulang: CURR_DATE,
   // SPT
   jabatan_ttd_spt: 'Kepala Dinas',
   nama_ttd_spt: 'Christianus Rimbaraya, SE., MM.',
   nip_ttd_spt: '197911162006041007',
   nomor_spt: `B/0.1.2.3/DLH/${ROMAN_CURR_MONTH}/${YEAR}`,
   tanggal_spt: CURR_DATE,
   tempat_terbit_spt: 'Lewoleba',
   // SPPD
   jabatan_ttd_spd: 'Kepala Dinas',
   nama_ttd_spd: 'Christianus Rimbaraya, SE., MM.',
   nip_ttd_spd: '197911162006041007',
   nomor_spd: `B/0.1.2.3/   /DLH/${ROMAN_CURR_MONTH}/${YEAR}`,
   tanggal_spd: CURR_DATE,
   tempat_terbit_spd: 'Lewoleba',
}

export default function Page() {
   const formPd = useForm<PDinasInput>({
      defaultValues: {
         is_lanjutan: 0,
         maksud_pd: 'Perjalanan Dinas',
         ...DEFAULT_VALUES,
      },
   })
   const isLanjutan = formPd.watch('is_lanjutan')

   const hanldeSubmit = async (data: PDinasInput) => {
      console.log('submited', data)
   }

   const dateSpt = formPd.watch('tanggal_spt')
   const dateSpd = formPd.watch('tanggal_spd')
   useEffect(() => {
      if (!!dateSpt) {
         const nomorSpt = formPd.watch('nomor_spt')
         const tahun = dateSpt?.getFullYear()
         const bulan = dateSpt?.getMonth() + 1
         const blnRoman = toRoman(bulan)
         if (!!nomorSpt) {
            const temp: any[] = nomorSpt.split('/').filter((_, i) => i < 4)
            temp.push(blnRoman, tahun)
            formPd.setValue('nomor_spt', temp?.join('/'), { shouldValidate: true })
         } else {
            formPd.setValue('nomor_spt', `B/0.1.2.3/      /DLH/${blnRoman}/${tahun}`, {
               shouldValidate: true,
            })
         }
         formPd.setValue('tahun', tahun, { shouldValidate: true })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [dateSpt])
   useEffect(() => {
      if (!!dateSpd) {
         const nomorSpd = formPd.watch('nomor_spd')
         const tahun = dateSpd?.getFullYear()
         const bulan = dateSpd?.getMonth() + 1
         const blnRoman = toRoman(bulan)
         if (nomorSpd) {
            const temp: any[] = nomorSpd.split('/').filter((_, i) => i < 4)
            temp.push(blnRoman, tahun)
            formPd.setValue('nomor_spd', temp?.join('/'), { shouldValidate: true })
         } else {
            formPd.setValue('nomor_spd', `B/0.1.2.3/      /DLH/${blnRoman}/${tahun}`, {
               shouldValidate: true,
            })
         }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [dateSpd])

   return (
      <div className='content'>
         <Card className='z-0 mx-auto max-w-[50rem] p-4 sm:p-6'>
            <CardHeader>
               <CardTitle className='text-lg uppercase'>Form Perjalanan Dinas Baru</CardTitle>
            </CardHeader>
            <CardContent>
               <DasarSPT control={formPd.control} />
               <PelaksanaPDinas control={formPd.control} />
               <PendanaanPerjalananDinas control={formPd.control} />
               <TujuanSPT control={formPd.control} />
               <TsForm
                  form={formPd}
                  schema={PDinasInputSchema}
                  onSubmit={hanldeSubmit}
                  props={{
                     tanggal_berangkat: dateProps,
                     tanggal_pulang: dateProps,
                     tanggal_spt: dateProps,
                     tanggal_spd: dateProps,
                     maksud_pd: {
                        description: 'Maksud perjalanan dinas harus diawali dengan kata kerja',
                     },
                     maksud_pd_lanjutan: {
                        description:
                           'Maksud perjalanan dinas lanjutan harus diawali dengan kata kerja',
                     },
                  }}>
                  {(field) => (
                     <>
                        {field.is_lanjutan}
                        {field.maksud_pd}
                        {!!isLanjutan && field.maksud_pd_lanjutan}
                        {field.tempat_berangkat}
                        {field.tempat_tujuan}
                        {/* {field.alat_angkut} */}
                        <AlatAngkut
                           value={formPd.watch('alat_angkut')}
                           errorMessage={formPd.formState.errors.alat_angkut?.message}
                           isInvalid={formPd.getFieldState('alat_angkut').invalid}
                           {...formPd.register('alat_angkut')}
                        />
                        <div className='flex gap-3'>
                           {field.tanggal_berangkat}
                           {field.tanggal_pulang}
                        </div>
                        <div className='flex flex-row gap-3'>
                           <div className='border-primary rounded-medium w-1/2 space-y-3 border p-2'>
                              <h5 className='text-primary text-center font-bold'>
                                 Penadatangan ST
                              </h5>
                              {field.nama_ttd_spd}
                              {field.nip_ttd_spd}
                              {field.jabatan_ttd_spd}
                              {field.tempat_terbit_spd}
                              {field.tanggal_spd}
                              {field.nomor_spd}
                           </div>
                           <div className='border-secondary rounded-medium w-1/2 space-y-3 border p-2'>
                              <h5 className='text-secondary text-center font-bold'>
                                 Penadatangan SPPD
                              </h5>
                              {field.nama_ttd_spt}
                              {field.nip_ttd_spt}
                              {field.jabatan_ttd_spt}
                              {field.tempat_terbit_spt}
                              {field.tanggal_spt}
                              {field.nomor_spt}
                           </div>
                        </div>
                        {JSON?.stringify(formPd?.formState?.errors)}
                     </>
                  )}
               </TsForm>
            </CardContent>
            <CardFooter>
               <Button
                  form='form-sppt'
                  // isLoading={isLoading}
                  type='submit'
                  size='lg'
                  color='primary'
                  variant='shadow'
                  fullWidth>
                  Masuk
               </Button>
            </CardFooter>
         </Card>
      </div>
   )
}
