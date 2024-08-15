import axios from '@custom-axios/peta-fetcher'

export interface SpjFungsional {
   nama_daerah: string
   nama_skpd: string
   kode_skpd: string
   tahun: number
   logo: string
   nama_pa_kpa: string
   nip_pa_kpa: string
   jabatan_pa_kpa: string
   nama_bp_bpp: string
   nip_bp_bpp: string
   jabatan_bp_bpp: string
   pembukuan1: Pembukuan1[]
   pembukuan2: Pembukuan1[]
   pembukuan3: Pembukuan3[]
   pembukuan4: Pembukuan4[]
   pembukuan5: Pembukuan5[]
   pembukuan6: Pembukuan3[]
   pembukuan7: Pembukuan4[]
   pembukuan8: Pembukuan5[]
   pembukuan9: Pembukuan3[]
   pembukuan10: Pembukuan10[]
   pembukuan11: Pembukuan3[]
}

interface Pembukuan10 {
   urut: number
   jenis: string
   pengembalian_realisasi_gaji_bulan_sebelumnya: number
   pengembalian_realisasi_gaji_bulan_ini: number
   pengembalian_realisasi_gaji_sd_saat_ini: number
   pengembalian_realisasi_selain_gaji_bulan_sebelumnya: number
   pengembalian_realisasi_selain_gaji_bulan_ini: number
   pengembalian_realisasi_selain_gaji_sd_saat_ini: number
   pengembalian_realisasi_upgutu_bulan_sebelumnya: number
   pengembalian_realisasi_upgutu_bulan_ini: number
   pengembalian_realisasi_upgutu_sd_saat_ini: number
}

interface Pembukuan5 {
   id_pajak_potongan: number
   nama_pajak_potongan: string
   realisasi_pajak_gaji_bulan_sebelumnya: number
   realisasi_pajak_gaji_bulan_ini: number
   realisasi_pajak_gaji_sd_saat_ini: number
   realisasi_pajak_selain_gaji_bulan_sebelumnya: number
   realisasi_pajak_selain_gaji_bulan_ini: number
   realisasi_pajak_selain_gaji_sd_saat_ini: number
   realisasi_pajak_upgutu_bulan_sebelumnya: number
   realisasi_pajak_upgutu_bulan_ini: number
   realisasi_pajak_upgutu_sd_saat_ini: number
}

interface Pembukuan4 {
   id_pajak_potongan: number
   nama_pajak_potongan: string
   realisasi_potongan_gaji_bulan_sebelumnya: number
   realisasi_potongan_gaji_bulan_ini: number
   realisasi_potongan_gaji_sd_saat_ini: number
   realisasi_potongan_selain_gaji_bulan_sebelumnya: number
   realisasi_potongan_selain_gaji_bulan_ini: number
   realisasi_potongan_selain_gaji_sd_saat_ini: number
   realisasi_potongan_upgutu_bulan_sebelumnya: number
   realisasi_potongan_upgutu_bulan_ini: number
   realisasi_potongan_upgutu_sd_saat_ini: number
}

interface Pembukuan3 {
   urut: number
   jenis: string
   realisasi_gaji_bulan_sebelumnya: number
   realisasi_gaji_bulan_ini: number
   realisasi_gaji_sd_saat_ini: number
   realisasi_ls_selain_gaji_bulan_sebelumnya: number
   realisasi_ls_selain_gaji_bulan_ini: number
   realisasi_ls_selain_gaji_sd_saat_ini: number
   realisasi_up_gu_tu_bulan_sebelumnya: number
   realisasi_up_gu_tu_bulan_ini: number
   realisasi_up_gu_tu_sd_saat_ini: number
}

interface Pembukuan1 {
   kode_akun: string
   nama_akun: string
   alokasi_anggaran: number
   realisasi_gaji_bulan_sebelumnya: number
   realisasi_gaji_bulan_ini: number
   realisasi_gaji_sd_saat_ini: number
   realisasi_ls_selain_gaji_bulan_sebelumnya: number
   realisasi_ls_selain_gaji_bulan_ini: number
   realisasi_ls_selain_gaji_sd_saat_ini: number
   realisasi_up_gu_tu_bulan_sebelumnya: number
   realisasi_up_gu_tu_bulan_ini: number
   realisasi_up_gu_tu_sd_saat_ini: number
   jumlah_sd_saat_ini: number
   sisa_pagu_anggaran: number
   bku_jenis: number
   kode_unik: string
}

export const getSpjFungsional = async ({
   id_pegawai = 0,
   bulan,
   type,
}: {
   type: string
   bulan: string
   id_pegawai?: number
}) => {
   return await axios.get<SpjFungsional>(`pengeluaran/strict/lpj/adm-fungs/0`, {
      params: { id_pegawai, bulan, type },
   })
}
