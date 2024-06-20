import { Skpd, SkpdSchema, z } from '@zod'

export const TapdAnggaranSchema = z.object({
   id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
   nama: z.string().trim().min(1, { message: 'Wajib diisi' }),
   created_by: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
      .nullish(),
   created_at: z.coerce.date(),
   updated_by: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
      .nullish(),
   updated_at: z.coerce.date(),
})

export type TapdAnggaran = z.infer<typeof TapdAnggaranSchema>

export const AnggotaTapdSchema = z.object({
   id: z.string().trim().min(1, { message: 'Wajib diisi' }),
   nip: z.string().trim().min(1, { message: 'Wajib diisi' }),
   nama: z.string().trim().min(1, { message: 'Wajib diisi' }),
   jabatan: z.string().trim().min(1, { message: 'Wajib diisi' }),
})

export type AnggotaTapd = z.infer<typeof AnggotaTapdSchema>

export type TapdAnggaranRelations = {
   anggota_tapd: AnggotaTapd[]
   skpd: Skpd[]
}

export type TapdAnggaranWithRelations = z.infer<typeof TapdAnggaranSchema> & TapdAnggaranRelations

export const TapdAnggaranWithRelationsSchema: z.ZodType<TapdAnggaranWithRelations> =
   TapdAnggaranSchema.merge(
      z.object({
         anggota_tapd: z.lazy(() => AnggotaTapdSchema).array(),
         skpd: z.lazy(() => SkpdSchema).array(),
      })
   )

export const TapdAnggaranUncheckedCreateInputSchema = z
   .object({
      id: z
         .string()
         .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
         .optional(),
      nama: z.string().trim().min(1, { message: 'Wajib diisi' }),
      anggota_tapd: z.array(AnggotaTapdSchema.strip()).min(1),
      skpd: z
         .object({
            connect: z.array(
               z
                  .object({
                     id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
                  })
                  .strip()
            ),
         })
         .optional(),
   })
   .strip()
export type TapdAnggaranUncheckedCreateInput = z.infer<
   typeof TapdAnggaranUncheckedCreateInputSchema
>
