import { z } from '../zod'

export const PendapatanSchema = z.object({
   id: z.string(),
   id_akun: z.number().int(),
   id_daerah: z.number().int(),
   id_pendapatan: z.number().int(),
   id_skpd: z.number().int(),
   id_unik: z.string(),
   id_unit: z.number().int(),
   is_locked: z.number().int(),
   keterangan: z.string(),
   kode_akun: z.string(),
   koefisien: z.string(),
   murni: z.number().int(),
   nama_akun: z.string(),
   tahun: z.number().int(),
   total: z.number().int(),
   uraian: z.string(),
   volume: z.number().int(),
   id_jadwal: z.number().int(),
   jadwal_anggaran_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
   jadwal_anggaran_murni_id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
      .optional()
      .nullable(),
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

export const PendapatanUncheckedCreateInputSchema = z
   .object({
      id: z.string().optional(),
      id_akun: z.number().int(),
      id_daerah: z.number().int(),
      id_pendapatan: z.number().int(),
      id_skpd: z.number().int(),
      id_unik: z.string(),
      id_unit: z.number().int(),
      is_locked: z.number().int(),
      keterangan: z.string(),
      kode_akun: z.string(),
      koefisien: z.string(),
      murni: z.number().int().optional().nullable(),
      nama_akun: z.string(),
      tahun: z.number().int(),
      total: z.number().int(),
      uraian: z.string(),
      volume: z.number().int(),
      id_jadwal: z.number().int(),
      jadwal_anggaran_id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' }),
      jadwal_anggaran_murni_id: z
         .string()
         .regex(/^[0-9a-fA-F]{24}$/, { message: 'bukan ObjectId' })
         .optional()
         .nullable(),
   })
   .strip()

declare global {
   type Pendapatan = z.infer<typeof PendapatanSchema>
   type PendapatanUncheckedCreateInput = z.infer<typeof PendapatanUncheckedCreateInputSchema>
}
