// GET https://service.sipd.kemendagri.go.id/referensi/strict/jadwal

type GetJadwalPenatausahaan = JadwalPenatausahaan[]

interface JadwalPenatausahaan {
   id_jadwal: number
   id_jadwal_sipd: number
   id_unik: string
   tahun: number
   id_tahap_sipd: number
   nama_sub_tahap_jadwal: string
   no_perda: string
   no_perkada: string
   tgl_perda: string
   tgl_perkada: string
   waktu_mulai_jadwal: string
   waktu_selesai_jadwal: string
   is_locked: number
   created_at: string
   created_by: number
   created_by_nama: string
}
