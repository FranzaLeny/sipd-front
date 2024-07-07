import { z } from '@zod'
import { fromZodError } from 'zod-validation-error'

interface ChunkDataParams<T, U, V> {
   data: T[]
   max: number
   schema: z.ZodType<U, z.ZodTypeDef, unknown>
   action: (data: U[], n: number, progress: number, last: number) => Promise<V>
   onError?: (error: unknown, progress: number, n: number) => void
   onSuccess?: (data: V, progress: number, n: number) => void
}
interface ChunkDataParams2<U, V> {
   data: U[]
   max: number
   action: (data: U[], n: number, progress: number, last: number) => Promise<V>
   onError?: (error: unknown, progress: number, n: number) => void
   onSuccess?: (data: V, progress: number, n: number) => void
}

/**
 * Processes chunks of data asynchronously.
 *
 * @param {ChunkDataParams<T, U, V> | ChunkDataParams2<U, V>} params - The parameters for processing the chunks.
 * @return {Promise<void>} A promise that resolves when the processing is complete.
 */
export async function processChunks<T, U, V>(
   params: ChunkDataParams<T, U, V> | ChunkDataParams2<U, V>
): Promise<void> {
   const { data: initialData, max: batchSize, action, onError, onSuccess } = params
   const totalItems = initialData.length
   const numChunks = Math.ceil(totalItems / batchSize)

   let dataToProcess = initialData
   if ('schema' in params) {
      const validation = params.schema.array().min(1).safeParse(initialData)
      if (validation.success) {
         dataToProcess = validation.data
      } else {
         const message = fromZodError(validation.error, {
            maxIssuesInMessage: 4,
            includePath: true,
            prefix: 'Data Error',
            prefixSeparator: '\n',
            issueSeparator: '\n',
         })
            .toString()
            ?.replaceAll(' at ', ' pada ')
         console.log(message)

         throw new Error(message)
      }
   }

   for (let chunkIndex = 0; chunkIndex < numChunks; chunkIndex++) {
      const progress = (chunkIndex + 1) / numChunks
      try {
         const startIndex = chunkIndex * batchSize
         const endIndex = Math.min(startIndex + batchSize, totalItems)
         const currentChunk: any = dataToProcess.slice(startIndex, endIndex)
         const result = await action(currentChunk, chunkIndex + 1, progress, numChunks)

         onSuccess?.(result, progress, chunkIndex + 1)
      } catch (error) {
         onError?.(error, progress, chunkIndex + 1)
      }
   }
}
