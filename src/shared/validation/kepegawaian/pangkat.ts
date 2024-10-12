import { z } from 'zod'

export const PangkatSchema = z.object({
   id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
   kode: z.string().trim().min(1),
   pangkat: z.string().trim().min(1),
   golongan: z.string().trim().min(1),
   ruang: z.string().trim().min(1),
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
   deleted_at: z.coerce.date().nullish(),
})

declare global {
   type Pangkat = z.infer<typeof PangkatSchema>
}
