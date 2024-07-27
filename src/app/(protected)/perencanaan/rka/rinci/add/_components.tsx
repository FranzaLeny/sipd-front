'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Props as InputProps, NumberInput, TextInput } from '@components/form/text-input'
import DialogForm from '@components/modal/dialog-form'
import AkunSelector, { ObjectBl, ObjekBlSelector } from '@components/perencanaan/akun'
import DanaSelector from '@components/perencanaan/dana-sbl'
import KetRinciSelector, { ModalCreateKetRincian } from '@components/perencanaan/ket-rinci'
import SatuanSelector, { SatuanSelectorProps } from '@components/perencanaan/satuan'
import StandarHargaSelector, {
   KelompokStandarHarga,
   TipeStandarHargaSelector,
} from '@components/perencanaan/standar-harga'
import SubsRinciSelector from '@components/perencanaan/subs-rinci'
import { Button, useDisclosure } from '@nextui-org/react'
import { createTsForm } from '@ts-react/form'
import { Akun, BlSubGiat, StandarHarga, z } from '@zod'
import { PlusCircle } from 'lucide-react'
import { useForm, UseFormWatch } from 'react-hook-form'
import { toast } from 'react-toastify'

const mapping = [
   [z.number(), NumberInput] as const,
   [z.string(), TextInput] as const,
   [z.enum(['JENIS']), TextInput] as const,
] as const

const InputGenerateShchema = z.object({
   id_rinci_sub_bl: z.number().int(),
   id_blt: z.number().int().nullish(),
   id_jenis_usul: z.number().int().nullish().default(null),
   id_standar_nfs: z.number().int().nullish().default(null),
   is_lokus_akun: z.number().int().nullish().default(null),
   id_usulan: z.number().int().nullish().default(null),
   nama_blt: z.string().nullish().default(null),
   nama_bl: z.string().nullish().default(null),
   nama_sub_bl: z.string().nullish().default(null),
   koefisien_murni: z.string().nullish().default(null),
   nama_jenis_usul: z.string().nullish().default(null),
   nama_standar_nfs: z.string().nullish().default(null),
   nama_usulan: z.string().nullish().default(null),
   lokus_akun_teks: z.string().nullish().default(null),
})

const InputDefaultSchmema = z.object({
   id_daerah: z.number().int(),

   id_giat: z.number().int(),
   id_jadwal: z.number().int(),
   id_program: z.number().int(),
   id_skpd: z.number().int(),
   id_sub_bl: z.number().int(),
   id_sub_giat: z.number().int(),
   id_sub_skpd: z.number().int(),
   id_unik: z.string(),
   id_unit: z.number().int(),
   id_bl: z.number(),
   id_jadwal_murni: z.number().int(),
   kua_murni: z.string().nullish(),
   kua_pak: z.string().nullish(),
   rkpd_murni: z.number().int(),
   rkpd_pak: z.number().int(),
   jadwal_anggaran_id: z.string(),
   jadwal_anggaran_murni_id: z.string().nullish(),
   bl_sub_giat_id: z.string().nullish(),
   total_harga_murni: z.number().nullish(),
   volume_murni: z.number().nullish(),
   pajak_murni: z.number().nullish(),
   harga_satuan_murni: z.number().nullish(),
   tahun: z.number().int(),
})

const SelectorSchema = z.object({
   id_akun: z.number().int(),
   kode_akun: z.string(),
   id_standar_harga: z.number().int().nullish().default(null),
   kode_standar_harga: z.string().nullish().default(null),
   nama_standar_harga: z.string().nullish().default(null),
   spek: z.string().nullish().default(null),
   ssh_locked: z.number().int(),
   id_ket_sub_bl: z.number().int().nullish(),
   id_subs_sub_bl: z.number().int().nullish(),
})

const volumeProps: InputProps = {
   labelPlacement: 'outside-left',
   classNames: {
      mainWrapper: 'w-full',
      base: 'flex-1',
      innerWrapper: 'pb-0',
      inputWrapper: 'h-auto min-h-auto',
   },
   variant: 'underlined',
   numberFormatOptions: {},
}
const satuanProps: SatuanSelectorProps = {
   className: 'flex-none w-[50%]',
   variant: 'underlined',
   classNames: { base: 'w-fit' },
   inputProps: { classNames: { innerWrapper: 'pb-0', inputWrapper: 'h-auto min-h-auto' } },
   // base: 'flex-1',
}
const hargaProps: InputProps = {
   numberFormatOptions: { currency: 'IDR', style: 'currency' },
}

const checkVolumeAndSatuan = (
   vol: number | null,
   sat: string | null,
   num: number,
   ctx: z.RefinementCtx
) => {
   if (vol && !sat) {
      ctx.addIssue({
         code: z.ZodIssueCode.custom,
         message: `Satuan ${num} harus diisi jika volume ${num} diisi`,
         path: [`sat_${num}`],
      })
   }
   if (sat && !vol) {
      ctx.addIssue({
         code: z.ZodIssueCode.custom,
         message: `Volume ${num} harus diisi jika satuan ${num} diisi`,
         path: [`sat_${num}`, `vol_${num}`],
      })
   }
}

const InputSchema = z
   .object({
      jenis_bl: z.enum([
         'BTL-GAJI',
         'BARJAS-MODAL',
         'BUNGA',
         'SUBSIDI',
         'HIBAH-BRG',
         'HIBAH',
         'BANSOS-BRG',
         'BANSOS',
         'BAGI-HASIL',
         'BANKEU',
         'BANKEU-KHUSUS',
         'BTT',
         'BOS',
         'BLUD',
         'TANAH',
      ]),
      harga_satuan: z.number({ description: 'Harga Satuan // Harga Satuan' }).min(1),
      pajak: z.number().default(0), //Buat pilihan
      nama_standar_harga: z
         .string({ description: 'Nama Standar Harga // Nama Standar Harga' })
         .nullish()
         .optional(),
      id_standar_harga: z.number().int().nullish().default(null),
      kode_standar_harga: z.string().nullish().default(null),
      sat_1: z.string({ description: 'Satuan // Satuan' }), //Buat pilihan
      sat_2: z
         .string({ description: 'Satuan 2 // Satuan untuk perkalian 2' })
         .nullish()
         .default(null), //Buat pilihan
      sat_3: z
         .string({ description: 'Satuan 3 // Satuan untuk perkalian 3' })
         .nullish()
         .default(null), //Buat pilihan
      sat_4: z
         .string({ description: 'Satuan 4 // Satuan untuk perkalian 4' })
         .nullish()
         .default(null),
      vol_1: z.number({ description: 'Volume // Perkalian 1' }).min(1),
      vol_2: z.number({ description: 'Volume // Perkalian 2' }).min(1).nullish().default(null),
      vol_3: z.number({ description: 'Volume // Perkalian 3' }).min(1).nullish().default(null),
      vol_4: z.number({ description: 'Volume // Perkalian 4' }).min(1).nullish().default(null),
      set_sisa_kontrak: z.number().int().default(0), //Buat pilihan
      total_harga: z.number().nullish(),
      koefisien: z.string({ description: 'Koefisien // Koefisien Terisi otomatis..' }),
      id_akun: z.number().int(),
      kode_akun: z.string(),
      nama_akun: z.string(),
      id_ket_sub_bl: z.number().int(),
      id_subs_sub_bl: z.number().int(),
      id_dana: z.number().int(),
      volume: z
         .number({ description: 'Total Volume // Total diisi otomatis' })
         .nullish()
         .default(null),
   })
   .superRefine((data, ctx) => {
      if (data?.jenis_bl === 'BARJAS-MODAL' && !data?.nama_standar_harga) {
         return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Nama Standar Harga Harus diisi',
            path: ['nama_standar_harga'],
         })
      }

      // Inside your superRefine method:
      checkVolumeAndSatuan(data?.vol_2, data.sat_2, 2, ctx)
      checkVolumeAndSatuan(data?.vol_3, data.sat_3, 3, ctx)
      checkVolumeAndSatuan(data?.vol_4, data.sat_4, 4, ctx)
   })

const calculateVolume = (volumes: (string | number | null)[][]) =>
   volumes.reduce((acc: number, vol) => {
      if (typeof vol[0] === 'number') {
         return acc > 0 ? acc * vol[0] : vol[0]
      }
      return acc
   }, 0)

type Schema = z.infer<typeof InputSchema>

const FormComponent = (props: React.HTMLAttributes<HTMLFormElement>) => <form {...props} />

const TsForm = createTsForm(mapping, { FormComponent })
const generateUniqId = () => {
   return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

function watchValue(watch: UseFormWatch<Schema>) {
   const vol1 = watch('vol_1')
   const vol2 = watch('vol_2')
   const vol3 = watch('vol_3')
   const vol4 = watch('vol_4')
   const sat1 = watch('sat_1')
   const sat2 = watch('sat_2')
   const sat3 = watch('sat_3')
   const sat4 = watch('sat_4')
   const idDana = watch('id_dana')
   const idKet = watch('id_ket_sub_bl')
   const idSubs = watch('id_subs_sub_bl')
   const idStandarHarga = watch('id_standar_harga')
   const idAkun = watch('id_akun')
   const harga_satuan = watch('harga_satuan')
   const jenisBl = watch('jenis_bl')
   return {
      vol1,
      vol2,
      vol3,
      vol4,
      sat1,
      sat2,
      sat3,
      sat4,
      harga_satuan,
      idKet,
      idSubs,
      idDana,
      idStandarHarga,
      idAkun,
      jenisBl,
   }
}

const ModalAddRincian = ({ data }: { data: BlSubGiat; user?: UserWithoutToken }) => {
   const { isOpen, onOpenChange, onOpen } = useDisclosure()
   const [objBelanja, setObjBelanja] = useState<ObjectBl>()
   const [akun, setAkun] = useState<Akun>()
   const [tipeKomponen, setTipeKomponen] = useState<KelompokStandarHarga>()
   const [standarHarga, setStandarHarga] = useState<StandarHarga>()
   const [volumes, setVolumes] = useState<(string | number | null)[][]>()
   const router = useRouter()
   const form = useForm<Schema>({
      resetOptions: { keepDirty: false, keepDefaultValues: false },
   })

   const {
      formState: { errors, isSubmitting },
      setValue,
      watch,
      reset,
      resetField,
      clearErrors,
      trigger,
   } = form

   const {
      vol1,
      vol2,
      vol3,
      vol4,
      sat1,
      sat2,
      sat3,
      sat4,
      harga_satuan,
      idKet,
      idSubs,
      idDana,
      idStandarHarga,
      idAkun,
      jenisBl,
   } = watchValue(watch)

   const handleValueChange = useCallback(
      (key: keyof Schema, value: any) => {
         clearErrors(key)
         setValue(key, value, { shouldValidate: true })
      },
      [clearErrors, setValue]
   )

   useEffect(() => {
      setVolumes([
         [vol1, sat1],
         [vol2, sat2],
         [vol3, sat3],
         [vol4, sat4],
      ])
   }, [vol1, vol2, vol3, vol4, sat1, sat2, sat3, sat4])

   useEffect(() => {
      if (volumes) {
         const koefisienParts = volumes
            .map((vol) => {
               if (!!vol[0] && !!vol[1]) {
                  return `${vol[0]} ${vol[1]}`
               }
               return ''
            })
            .filter(Boolean)
            .join(' x ')
         handleValueChange('koefisien', koefisienParts)
         const volume = calculateVolume(volumes)
         handleValueChange('volume', volume)
         const totalHarga = volume * (harga_satuan ?? 0)
         handleValueChange('total_harga', Math.round(totalHarga))
      } else {
         handleValueChange('koefisien', null)
         handleValueChange('volume', 0)
         handleValueChange('total_harga', 0)
      }
   }, [volumes, harga_satuan, handleValueChange])

   useEffect(() => {
      setAkun(undefined)
      handleValueChange('jenis_bl', objBelanja?.value)
   }, [objBelanja, handleValueChange])

   useEffect(() => {
      handleValueChange('kode_akun', akun?.kode_akun)
      setTipeKomponen(undefined)
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [akun])
   useEffect(() => {
      setStandarHarga(undefined)
   }, [tipeKomponen])

   useEffect(() => {
      if (standarHarga && objBelanja?.fields?.includes('komponen')) {
         handleValueChange('harga_satuan', standarHarga.harga)
         handleValueChange('nama_standar_harga', standarHarga.nama_standar_harga)
         handleValueChange('id_standar_harga', standarHarga.id_standar_harga)
         handleValueChange('kode_standar_harga', standarHarga.kode_standar_harga)
      } else {
         handleValueChange('id_standar_harga', null)
         handleValueChange('kode_standar_harga', null)
         handleValueChange('harga_satuan', 0)
         handleValueChange('nama_standar_harga', null)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [standarHarga, handleValueChange])

   const onSubmit = async (value: Schema) => {
      try {
         toast.success(JSON.stringify(value))
      } catch (error: any) {
         toast.error(error?.message ?? 'Gagal simpan data jadwal anggran', { autoClose: 5000 })
      }
   }

   const handleClose = useCallback(() => {
      !isSubmitting && router.replace(`/perencanaan/rka/rinci?id=${data?.id}`)
   }, [router, isSubmitting, data?.id])
   return (
      <DialogForm
         onClose={handleClose}
         submitButtonProps={{ isLoading: isSubmitting, form: 'form_add_rincian' }}
         size='2xl'>
         <>
            <ModalCreateKetRincian
               isOpen={isOpen}
               onOpenChange={onOpenChange}
               defaultValue={data}
            />
            <TsForm
               formProps={{
                  id: 'form_add_rincian',
                  className: 'space-y-3',
               }}
               form={form}
               schema={InputSchema}
               props={{
                  total_harga: {
                     isReadOnly: true,
                     ...hargaProps,
                  },
                  koefisien: { isReadOnly: true },
                  volume: {
                     isReadOnly: true,
                     numberFormatOptions: {},
                  },
                  harga_satuan: {
                     isReadOnly: objBelanja?.fields?.includes('komponen'),
                     ...hargaProps,
                  },
                  vol_1: volumeProps,
                  vol_2: volumeProps,
                  vol_3: volumeProps,
                  vol_4: volumeProps,
               }}
               onSubmit={onSubmit}>
               {({ vol_1, vol_2, vol_3, vol_4, volume, koefisien, total_harga, harga_satuan }) => (
                  <>
                     <div>
                        <ObjekBlSelector
                           label='Jenis Belanja'
                           errorMessage={errors?.jenis_bl?.message}
                           isInvalid={!!errors?.jenis_bl}
                           selectedKey={jenisBl}
                           placeholder='Pilih Jenis Belanja...'
                           onChange={setObjBelanja}
                        />
                     </div>
                     {objBelanja && (
                        <>
                           <AkunSelector
                              params={{
                                 set_input: 1,
                                 is_bl: 1,
                                 set_kab_kota: 1,
                                 ...objBelanja.akun,
                                 tahun: data.tahun,
                              }}
                              selectedKey={idAkun}
                              onValueChange={(v) => handleValueChange('nama_akun', v)}
                              onSelectionChange={(v) => handleValueChange('id_akun', v)}
                              errorMessage={errors?.id_akun?.message}
                              onChange={setAkun}
                           />
                           {!!akun && (
                              <>
                                 {!!objBelanja?.fields?.includes('komponen') && (
                                    <>
                                       <TipeStandarHargaSelector
                                          label='Tipe komponen'
                                          placeholder='Pilih Tipe komponen...'
                                          selectionMode='single'
                                          onValueChange={setTipeKomponen}
                                       />
                                       {!!tipeKomponen && (
                                          <>
                                             <StandarHargaSelector
                                                warningEmpties
                                                allowsCustomValue
                                                allowsEmptyCollection={false}
                                                label='Komponen belanja'
                                                isInvalid={!!errors?.id_standar_harga}
                                                selectedKey={idStandarHarga}
                                                errorMessage={errors?.id_standar_harga?.message}
                                                params={{
                                                   tahun: data.tahun,
                                                   id_akun: akun?.id_akun,
                                                   kelompok: tipeKomponen.key,
                                                }}
                                                onValueChange={setStandarHarga}
                                             />
                                          </>
                                       )}
                                    </>
                                 )}

                                 <>
                                    <div className='flex w-full'>
                                       {vol_1}
                                       <SatuanSelector
                                          {...satuanProps}
                                          placeholder='Pilih Satuan 1...'
                                          onValueChange={(v) => handleValueChange('sat_1', v)}
                                          name='sat_1'
                                          isInvalid={!!errors?.sat_1}
                                          errorMessage={errors?.sat_1?.message}
                                       />
                                    </div>
                                    <div className='flex w-full'>
                                       {vol_2}
                                       <SatuanSelector
                                          {...satuanProps}
                                          name='sat_2'
                                          allowsCustomValue={!vol2}
                                          placeholder='Pilih Satuan 2...'
                                          onValueChange={(v) => handleValueChange('sat_2', v)}
                                          isInvalid={!!errors?.sat_2}
                                          errorMessage={errors?.sat_2?.message}
                                       />
                                    </div>
                                    <>
                                       <div className='flex w-full'>
                                          {vol_3}
                                          <SatuanSelector
                                             {...satuanProps}
                                             allowsCustomValue={!vol3}
                                             name='Satuan_3'
                                             placeholder='Pilih Satuan 3...'
                                             onValueChange={(v) => handleValueChange('sat_3', v)}
                                             isInvalid={!!errors?.sat_3}
                                             errorMessage={errors?.sat_3?.message}
                                          />
                                       </div>
                                       <div className='flex w-full'>
                                          {vol_4}
                                          <SatuanSelector
                                             {...satuanProps}
                                             allowsCustomValue={!vol4}
                                             name='Satuan_4'
                                             placeholder='Pilih Satuan 4...'
                                             onValueChange={(v) => handleValueChange('sat_4', v)}
                                             isInvalid={!!errors?.sat_4}
                                             errorMessage={errors?.sat_4?.message}
                                          />
                                       </div>
                                    </>
                                    <div className='flex w-full flex-col gap-3 sm:flex-row'>
                                       {harga_satuan}
                                       {volume}
                                    </div>
                                 </>
                                 <KetRinciSelector
                                    label='Keterangan'
                                    placeholder='Pilih Keterangan...'
                                    params={{ tahun: data?.tahun, id_sub_bl: data.id_sub_bl }}
                                    onSelectionChange={(v) => handleValueChange('id_ket_sub_bl', v)}
                                    selectedKey={idKet}
                                    isInvalid={!!errors?.id_ket_sub_bl}
                                    errorMessage={errors?.id_ket_sub_bl?.message}
                                    isClearable={false}
                                    endContent={
                                       <Button
                                          className='mr-2'
                                          isIconOnly
                                          radius='full'
                                          color='primary'
                                          variant='light'
                                          title='Tambah keterangan'
                                          endContent={<PlusCircle className='size-8' />}
                                          onPress={onOpen}
                                       />
                                    }
                                 />
                                 <SubsRinciSelector
                                    label='Kelompok rincian'
                                    params={{
                                       tahun: data?.tahun,
                                       id_sub_bl: data.id_sub_bl,
                                    }}
                                    selectedKey={idSubs}
                                    onSelectionChange={(v) =>
                                       handleValueChange('id_subs_sub_bl', v)
                                    }
                                    isInvalid={!!errors?.id_subs_sub_bl}
                                    errorMessage={errors?.id_subs_sub_bl?.message}
                                    isClearable={false}
                                 />
                                 <DanaSelector
                                    label='Sumber Dana'
                                    placeholder='Pilih Sumber Dana...'
                                    params={{
                                       tahun: data?.tahun,
                                       id_sub_bl: data.id_sub_bl,
                                       bl_sub_giat_id: data.id,
                                    }}
                                    selectedKey={idDana}
                                    onSelectionChange={(v) => handleValueChange('id_dana', v)}
                                    isInvalid={!!errors?.id_dana}
                                    errorMessage={errors?.id_dana?.message}
                                    isClearable={false}
                                 />
                                 <div className='flex w-full flex-col gap-3 sm:flex-row'>
                                    {koefisien}
                                    {total_harga}
                                 </div>
                              </>
                           )}
                        </>
                     )}
                  </>
               )}
            </TsForm>
         </>
      </DialogForm>
   )
}

export default ModalAddRincian
