import axios from '@custom-axios/api-fetcher'

interface KabKota {
   id: string
   id_daerah: number
   id_kab_kota: number
   id_prop: number
   kode_ddn: string
   kode_ddn_2: string
   logo?: string
   nama_daerah: string
}

interface Provinsi {
   id: string
   id_daerah: number
   id_prop: number
   kode_ddn: string
   nama_daerah: string
   logo?: string
}

export const getDaerah = async <T extends boolean = false>({
   is_prop,
   id_daerah,
}: {
   is_prop?: T
   id_daerah: number
}): Promise<T extends false ? KabKota : Provinsi> => {
   const url = !!is_prop
      ? `/api/master/lokasi/provinsi/by-id-daerah/${id_daerah}`
      : `/api/master/lokasi/kab-kota/by-id-daerah/${id_daerah}`
   return await axios
      .get<ResponseApi<T extends false ? KabKota : Provinsi>>(url)
      .then((res) => res.data)
}

export const getAuthDaerah = async () => {
   return await axios
      .get<
         ResponseApi<
            {
               id_daerah: number
               id_prop: number
               id_kab_kota: number
               nama_daerah: string
            }[]
         >
      >('/api/auth/daerah')
      .then((res) => res.data)
}
