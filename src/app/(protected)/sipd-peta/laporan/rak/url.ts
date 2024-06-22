// https://service.sipd.kemendagri.go.id/referensi/strict/dpa/penarikan/belanja?page=1&limit=10
// https://service.sipd.kemendagri.go.id/referensi/strict/dpa/penarikan/belanja/skpd/1871

interface ResponseRakBelanjaSkpd {
   id_skpd: number
   nama_skpd: string
   kode_skpd: string
   items: ListSubGiatRak[]
}

interface ListSubGiatRak {
   id_daerah: number
   tahun: number
   id_unit: number
   id_skpd: number
   kode_skpd: string
   nama_skpd: string
   id_sub_skpd: number
   kode_sub_skpd: string
   nama_sub_skpd: string
   id_urusan: number
   id_bidang_urusan: number
   kode_bidang_urusan: string
   nama_bidang_urusan: string
   id_program: number
   kode_program: string
   nama_program: string
   id_giat: number
   kode_giat: string
   nama_giat: string
   id_sub_giat: number
   kode_sub_giat: string
   nama_sub_giat: string
   nilai: number
   nilai_rak: number
   status: number
   rak_belum_sesuai: number
}

// https://service.sipd.kemendagri.go.id/referensi/strict/laporan/dpa/anggaran-kas/belanja/1871?id_skpd=1871&id_sub_skpd=1871&id_urusan=12&id_bidang_urusan=211&id_program=1186&id_giat=8709&id_sub_giat=20294
interface RootObject {
   nama_daerah: string
   kode_skpd: string
   nama_skpd: string
   tahun: number
   tanggal: string
   nama_ibukota: string
   nama_penandatangan: string
   nip_penandatangan: string
   items: Item[]
}

interface Item {
   kode_rekening: string
   uraian: string
   anggaran_tahun_ini: number
   total_rak: number
   bulan_1: number
   bulan_2: number
   bulan_3: number
   bulan_4: number
   bulan_5: number
   bulan_6: number
   bulan_7: number
   bulan_8: number
   bulan_9: number
   bulan_10: number
   bulan_11: number
   bulan_12: number
}

interface RootObject {
   id_unit: number
   id_skpd: number
   id_sub_skpd: number
   id_urusan: number
   id_bidang_urusan: number
   id_program: number
   id_giat: number
   id_sub_giat: number
}

// https://service.sipd.kemendagri.go.id/referensi/strict/dpa/penarikan/belanja/sub-giat?id_unit=1871&id_skpd=1871&id_sub_skpd=1871&id_urusan=12&id_bidang_urusan=211&id_program=1186&id_giat=8709&id_sub_giat=20294

interface RootObject {
   '1': number
   '2': number
   '3': number
   '4': number
   '5': number
   '6': number
   '7': number
   '8': number
   '9': number
   '10': number
   '11': number
   '12': number
   id_daerah: number
   tahun: number
   id_unit: number
   id_skpd: number
   kode_skpd: string
   nama_skpd: string
   id_sub_skpd: number
   kode_sub_skpd: string
   nama_sub_skpd: string
   id_urusan: number
   id_bidang_urusan: number
   kode_bidang_urusan: string
   nama_bidang_urusan: string
   id_program: number
   kode_program: string
   nama_program: string
   id_giat: number
   kode_giat: string
   nama_giat: string
   id_sub_giat: number
   kode_sub_giat: string
   nama_sub_giat: string
   id_akun: number
   kode_akun: string
   nama_akun: string
   nilai: number
   nilai_rak: number
   id_rak_belanja: number
   is_valid_skpd: number
   is_valid_sekda: number
   is_valid_bud: number
}
