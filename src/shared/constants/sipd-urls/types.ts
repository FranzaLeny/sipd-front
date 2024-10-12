type TypeData<U = any, V = any> = {
   [key: string]: {
      payload: {
         [key: string]: U
      }
      response: V
   }
}

export type Payload<T extends keyof TypeData> = TypeData[T]['payload']

export type TypePostSipdUrls<T extends TypeData> = {
   [Key in keyof T]: {
      url: string
      defaultPayload: Partial<{
         [K in keyof T[Key]['payload']]: T[Key]['payload'][K]
      }>
      urlParam?: Array<keyof T[Key]['payload']>
   }
}

export type TypeGetSipdUrls<T extends TypeData> = {
   [Key in keyof T]: {
      url: string
      key_for_params?: Array<keyof T[Key]['payload']>
      defaultPayload: Partial<{
         [K in keyof T[Key]['payload']]: T[Key]['payload'][K]
      }>
   }
}
