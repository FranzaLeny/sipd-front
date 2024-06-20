interface ListStandarHargaSipdPayload {
   tahun: number
   id_daerah: number
   length?: number
   start?: number
   kelompok: 1 | 2 | 3 | 4
   tipe: 'SSH' | 'HSPK' | 'ASB' | 'SBU'
}

interface ListStandarHargaSipdResponse {
   status_code: number
   status: boolean
   message: string
   data: ListKomponenSipd
}

interface ListKomponenSipd {
   recordsTotal: number
   recordsFiltered: number
   data: KomponenSipd[]
}

interface KomponenSipd {
   id_standar_harga: number
   id_kel_standar_harga: number
   kode_kel_standar_harga: string
   nama_kel_standar_harga: string
   tipe_standar_harga: string
   id_unik: string
   tahun: number
   id_daerah: number
   kode_standar_harga: string
   nama_standar_harga: string
   satuan: string
   spek: string
   harga: number
   is_pdn: number
   nilai_tkdn: number
   is_locked: number
}
interface ListAkunStandarHargaSipdPayload {
   tahun: number
   id_daerah: number
   id_standar_harga: number
   kode_standar_harga: string
   kelompok: 1 | 2 | 3 | 4 | number
}

interface ListAkunStandarHargaSipdResponse {
   status: boolean
   status_code: number
   data: AkunKomponenSipd[]
}

interface AkunKomponenSipd {
   id_daerah: number
   id_standar_harga: number
   id_akun: number
   kode_akun: string
   nama_akun: string
}

interface ListStandarHargaByTipeAkunSipdPayload {
   tahun: number
   id_daerah: number
   tipe: 'SSH' | 'HSPK' | 'ASB' | 'SBU'
   id_akun: number
}

interface ListStandarHargaByTipeAkunSipdResponse {
   status: boolean
   status_code: number
   data: StandarHargaByTipeAkunSipd[]
}

interface StandarHargaByTipeAkunSipd {
   id_standar_harga: number
   id_kel_standar_harga: number
   kode_kel_standar_harga: string
   nama_kel_standar_harga: string
   tipe_standar_harga: string
   id_unik: string
   tahun: number
   id_daerah: number
   kode_standar_harga: string
   nama_standar_harga: string
   satuan: string
   spek: string
   harga: number
   is_pdn: number
   nilai_tkdn: number
   is_locked: number
}
interface ListStandarHargaByAkunSipdPayload {
   tahun: number
   id_daerah: number
   'search[value]'?: string
   length?: number
}

interface ListStandarHargaByAkunSipdResponse {
   status: boolean
   status_code: number
   data: StandarHargaByAkunSipd[]
}
interface StandarHargaByAkunSipd {
   id_standar_harga: number
   id_unik: string
   tahun: number
   id_daerah: number
   id_kel_standar_harga: number
   kelompok: number
   kode_standar_harga: string
   nama_standar_harga: string
   satuan: string
   id_satuan: number
   merk?: any
   spek: string
   harga: number
   harga_2: number
   harga_3: number
   ket_teks?: any
   id_usulan: number
   jenis?: any
   vol_peserta: number
   vol_hari: number
   is_locked: number
   is_deleted: number
   created_user: number
   created_at: string
   created_ip?: any
   updated_user?: number
   updated_at?: string
   updated_ip?: any
}
// api/master/d_komponen/export_excel

interface StandarHargaExportExcelSipdPayload {
   tahun: number
   id_daerah: number
   kelompok: 1 | 2 | 3 | 4
   tipe: 'SSH' | 'HSPK' | 'ASB' | 'SBU'
}

interface StandarHargaExportExcelSipdResponse {
   status: boolean
   status_code: number
   data: StandarHargaExportExcel[]
}
interface StandarHargaExportExcel {
   id_standar_harga: number
   kode_kel_standar_harga: string
   nama_kel_standar_harga: string
   kode_standar_harga: string
   nama_standar_harga: string
   spek: string
   satuan: string
   harga: number
   id_akun: string | null
   kode_akun: string
}
