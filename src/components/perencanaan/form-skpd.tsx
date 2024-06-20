'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { updateSkpd } from '@actions/perencanaan/data/skpd'
import { TextInput } from '@components/form/text-input'
import DialogForm from '@components/modal/dialog-form'
import { createTsForm } from '@ts-react/form'
import { Skpd, SkpdSchema, z } from '@zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useRefetchQueries } from '@shared/hooks/use-refetch-queries'

const Schema = SkpdSchema.pick({
   nama_skpd: true,
   nama_jabatan_kepala: true,
   status_kepala: true,
   nama_kepala: true,
   pangkat_kepala: true,
   nip_kepala: true,
   nama_bendahara: true,
   nip_bendahara: true,
})

const mapping = [[z.string(), TextInput]] as const

function capitalizeString(str = ''): string {
   const words: string[] = str.toLocaleLowerCase('id-ID').split(' ')
   const capitalizedWords: string[] = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
   )
   return capitalizedWords.join(' ')
}

const MyForm = createTsForm(mapping)

export default function FrormSkpd({
   defaultValues,
   title = 'Form SKPD',
}: {
   defaultValues: Partial<Skpd>
   title?: string
}) {
   const defaultNamaJabatan = 'Kepala ' + capitalizeString(defaultValues?.nama_skpd)

   const form = useForm<z.infer<typeof Schema>>({
      resetOptions: { keepValues: false, keepDirty: false, keepDefaultValues: false },
   })
   const router = useRouter()
   const { refetchQueries } = useRefetchQueries()

   const handleSubmit = async (data: z.infer<typeof Schema>) => {
      try {
         if (defaultValues?.id) {
            await updateSkpd(defaultValues?.id, data).then((res) => {
               toast(res?.message ?? 'Berhasil', { type: res?.success ? 'success' : 'error' })
            })
            refetchQueries(['data_skpd', 'perencanaan'])
            form.reset()
            router.back()
         } else {
            throw new Error('Id SKPD tidak valid')
         }
      } catch (error: any) {
         toast.error(error?.message ?? 'Gagal simpan data SKPD')
      }
   }

   const handleClose = useCallback(() => {
      !form?.formState?.isSubmitting && router.back()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [form?.formState?.isSubmitting])
   return (
      <DialogForm
         onClose={handleClose}
         headerProps={{
            children: <p className='truncate pr-3'>{title}</p>,
         }}
         submitButtonProps={{ form: 'form-skpd', isLoading: form?.formState?.isSubmitting }}
         cancelButtonProps={{ isDisabled: form?.formState?.isSubmitting }}>
         <MyForm
            formProps={{ id: 'form-skpd', className: 'w-full space-y-3 py-3' }}
            form={form}
            schema={Schema}
            defaultValues={{
               nama_skpd: defaultValues?.nama_skpd,
               nama_kepala: defaultValues?.nama_kepala,
               nama_jabatan_kepala: defaultValues?.nama_jabatan_kepala ?? defaultNamaJabatan,
               status_kepala: defaultValues?.status_kepala,
               pangkat_kepala: defaultValues?.pangkat_kepala,
               nip_kepala: defaultValues?.nip_kepala,
               nama_bendahara: defaultValues?.nama_bendahara,
               nip_bendahara: defaultValues?.nip_bendahara,
            }}
            onSubmit={handleSubmit}
            props={{
               nama_skpd: {
                  isReadOnly: true,
               },
            }}
         />
      </DialogForm>
   )
}
