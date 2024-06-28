import { z } from '@validations/zod'

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
   id: z.string(),
   username: z.string(),
   id_daerah: z.number().int(),
   id_unit: z.number().int(),
   id_skpd: z.number().int(),
   id_sub_skpd: z.number().int(),
   id_prop: z.number().int(),
   is_prop: z.number().int(),
   jabatan: z.string(),
   nama: z.string(),
   nip: z
      .string()
      .regex(
         new RegExp(
            /^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])(19|20)\d{2}(0[1-9]|1[012])\d{1,2}\d{3}$/
         ),
         'Format Nitp Tidak Sesuai'
      )
      .nullish(),
   active: z.number(),
   roles: z.string().array(),
   access: z.string().array(),
   is_locked: z.number(),
   image: z.string().nullish(),
   updated_at: z.coerce.date(),
   created_at: z.coerce.date(),
})

export type IUser = z.infer<typeof UserSchema>

/////////////////////////////////////////
// ROLE SCHEMA
/////////////////////////////////////////

export const RoleSchema = z.object({
   id: z.string(),
   name: z.string(),
   created_by: z.string().nullish(),
   description: z.string().optional().nullable(),
   level: z.number().int(),
   created_at: z.coerce.date(),
   updated_at: z.coerce.date(),
   updated_by: z.string().nullish(),
})

export type Role = z.infer<typeof RoleSchema>

export const RoleUncheckedCreateInputSchema = z.object({
   id: z.string().optional(),
   name: z.string(),
   description: z.string().optional().nullable(),
   level: z.number().int(),
})
