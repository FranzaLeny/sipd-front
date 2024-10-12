'use client'

import { DateInputProps } from '@components/form/date-time-input'
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@components/ui/card'
import { Button } from '@nextui-org/react'
import { useForm } from 'react-hook-form'

import { PDinasInput, PDinasInputSchema, TsForm } from './componet-form'
import DasarSPT from './dasar-spt'
import PelaksanaPDinas from './pelaksana-pd'

const dateProps: DateInputProps = {
   hideTimeZone: false,
   showMonthAndYearPickers: true,
   granularity: 'day',
   popoverProps: { placement: 'bottom-end' },
}

const DEFAULT_VALUES: Partial<PDinasInput> = {
   alat_angkut: 'Kendaraan Roda Empat',
   dasar: [
      'Surat dari Kepala Dinas Lingkungan Hidup Kab. Cirebon tanggal 10 Januari 2024 nomor 0.1.2.3 perihal Perjalanan Dinas',
      'Nota pertimbangan dari Kepala Bidang Lingkungan Hidup nomor:XX/XXX/2024 tanggal 10 Januari 2024',
      'Disposisi Kepala Dinas Lingkungan Hidup Kabupaten Lembata tanggal 10 Januari 2024',
      'DPA/DPPA Dinas Lingkungan Hidup Kabupaten Lembata tahun anggaran 2024',
   ],

   tempat_tujuan: 'Desa Hadakewa Kecamatan Lebatukan Kabupaten Lembata',
   tempat_berangkat: 'Lewoleba',
   tanggal_berangkat: new Date(),
   tanggal_pulang: new Date(),
   // SPT
   jabatan_ttd_spt: 'Kepala Dinas',
   nama_ttd_spt: 'Christianus Rimbaraya, SE., MM.',
   nip_ttd_spt: '197911162006041007',
   nomor_spt: 'B/0.1.2.3/DLH/2024',
   tanggal_spt: new Date(),
   tempat_terbit_spt: 'Lewoleba',
   // SPPD
   jabatan_ttd_spd: 'Kepala Dinas',
   nama_ttd_spd: 'Christianus Rimbaraya, SE., MM.',
   nip_ttd_spd: '197911162006041007',
   nomor_spd: 'B/0.1.2.3/DLH/2024',
   tanggal_spd: new Date(),
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

   return (
      <div className='content'>
         <Card className='z-0 mx-auto max-w-3xl p-4 sm:p-6'>
            <CardHeader>
               <CardTitle className='text-lg uppercase'>Data Perjalanan Dinas</CardTitle>
            </CardHeader>
            <CardDescription className='p-4 sm:p-6'>
               Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt adipisci cum, non
               nisi maiores ad ducimus architecto corrupti quis sunt temporibus perferendis, qui, a
               aut fugiat cupiditate voluptatem velit maxime.
            </CardDescription>
            <CardContent>
               <DasarSPT control={formPd.control} />
               <PelaksanaPDinas control={formPd.control} />
               <TsForm
                  form={formPd}
                  schema={PDinasInputSchema}
                  onSubmit={hanldeSubmit}
                  props={{
                     tanggal_berangkat: dateProps,
                     tanggal_pulang: dateProps,
                     tanggal_spt: dateProps,
                     tanggal_spd: dateProps,
                     is_lanjutan: { typeValue: 'number' },
                  }}>
                  {(field) => (
                     <>
                        <div>{field.is_lanjutan}</div>
                        {field.maksud_pd}
                        {!!isLanjutan && field.maksud_pd_lanjutan}
                        <div className='flex flex-row gap-3'>
                           <div className='w-1/2 space-y-3'>
                              {field.tempat_berangkat}
                              {field.tanggal_berangkat}
                           </div>
                           <div className='w-1/2 space-y-3'>
                              {field.tempat_tujuan}
                              {field.tanggal_pulang}
                           </div>
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
                           </div>
                        </div>
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