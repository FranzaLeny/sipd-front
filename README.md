# PERENCANAAN DLH LEMBATA

Ini adalah project frontend PERENCANAAN DLH LEMBATA berbasis web yang dibuat untuk mengoptimalkan penggunaan aplikasi [`SIPD-RI`](https://sipd-ri.kemendagri.go.id) [fitur-fitur](#fitur) yang dapat digunakan untuk kebutuhan PERENCANAAN dan KEUANGAN SKPD/OPD sehari-hari. Tujuan Pembuatan aplikasi ini semata-mata untuk kebutuhan pada DINAS LINGKUNGAN HIDUP KABUPATEN LEMBATA. Pembuatan aplikasi ini juga agar data perencanaan dan euangan dapat terintegrasi dengan aplikasi lainnya dengan mudah. Pembuatan aplikasi ini menggunakan tools berikut:

-  Framework [`NextJs`](https://nextjs.org/docs/getting-started/installation).
-  Untuk UI dibuat menggunakan [`NextUI`](https://nextui.org) dan [`tailwindcss`](https://tailwindcss.com/),

---

## Daftar Isi

-  [Persyaratan](#persyaratan)
-  [Panduan Instalasi](#panduan-instalasi)
-  [Fitur](#fitur)
-  [Dokumentasi](#dokumentasi)
-  [Uji Coba](#uji-coba)
-  [Kontribusi](#kontribusi)
-  [Lisensi](#lisensi)

---

## Persyaratan

Sebelum memulai, pastikan Anda telah memenuhi persyaratan berikut:

-  **Supported OS**: macOS, Windows (termasuk WSL), dan Linux.
-  **Node.js**: Pastikan Anda telah menginstal Node.js versi 16.14^ di sistem Anda. Anda dapat mengunduhnya dari [situs web Node.js](https://nodejs.org/).
-  **API**: untuk api ini dipakai dari [SIPD-RI](https://sipd-ri.kemendagri.go.id) dan api lokal menggungan api sesuai pada repositori API_SIPD_LOKAL.

## Panduan Instalasi

1. Clone repository ini atau unduh sebagai file zip terbaru.

2. Buat file baru `.env` dan salin isi dari `.env.example` ke dalam file `.env`.

3. Sesuaikan konfigurasi di file `.env` sesuai dengan pengaturan database Anda.

4. Install dependencies dengan menggunakan perintah berikut:

   ```bash
   pnpm i
   ```

5. Buat tabel-tabel database dengan menggunakan perintah berikut:

   ```bash
   pnpm push
   ```

6. Jalankan server dengan menggunakan perintah berikut:

   ```bash
   pnpm start
   ```

7. Buka [http://localhost:3000](http://localhost:3000) di browser Anda dan lihat hasilnya.

## Fitur

-  [x] **Login**
-  [x] **Akun**
   -  [x] Ubah Username dan Password Akun User
   -  [x] Ubah Akun User
   -  [ ] Hapus Akun User
-  [ ] **DATA MASTER**
   -  [ ] Role
      -  [x] List Data Role
      -  [ ] Tambah Data Role
      -  [ ] Ubah Data Role
      -  [ ] Lihat Data Role
      -  [ ] Hapus Data Role
   -  [ ] User
      -  [x] List Data User
      -  [ ] Tambah Data User
      -  [x] Ubah Data User
      -  [ ] Hapus Data User
   -  [x] TAPD Anggaran
      -  [x] Tambah Data TAPD Anggaran
      -  [x] Ubah Data TAPD Anggaran
      -  [x] Hapus Data TAPD Anggaran
-  [ ] **PERENCANAAN**
   -  [ ] **Master Data Perencanaan**
      -  [ ] **Rekening Akun**
         -  [x] List Data Rekening Akun
         -  [x] Singkron Rekening Akun dari SIPD
         -  [ ] Tambah Data Rekening Akun
         -  [ ] Ubah Data Rekening Akun
         -  [ ] Hapus Data Rekening Akun
      -  [ ] **Standar Harga**
         -  [x] List Data Standar Harga
         -  [x] Singkron Data Standar Harga dari SIPD
         -  [ ] Tambah Data Standar Harga
         -  [ ] Ubah Data Standar Harga
         -  [ ] Hapus Data Standar Harga
         -  [x] Mapping Data Akun Standar Harga dari SIPD
      -  [ ] **Tahapan**
         -  [x] List Data Tahapan
         -  [x] Singkron Data Tahapan dari SIPD
         -  [ ] Tambah Data Tahapan
         -  [ ] Ubah Data Tahapan
         -  [ ] Hapus Data Tahapan
      -  [ ] **Satuan**
         -  [x] List Data Satuan
         -  [x] Singkron Data Satuan dari SIPD
         -  [ ] Tambah Data Satuan
         -  [ ] Ubah Data Satuan
         -  [ ] Hapus Data Satuan
      -  [ ] **Lokasi**
         -  [ ] Provinsi
         -  [ ] Kabupaten / Kota
         -  [ ] Kecamatan
         -  [ ] Desa Kelurahan
      -  [ ] **Urusan**
         -  [ ] List Data Urusan
         -  [ ] Singkron Data Urusan dari SIPD
         -  [ ] Tambah Data Urusan
         -  [ ] Ubah Data Urusan
         -  [ ] Hapus Data Urusan
      -  [ ] **Bidang Urusan**
         -  [ ] List Data Bidang Urusan
         -  [ ] Singkron Data Bidang Urusan dari SIPD
         -  [ ] Tambah Data Bidang Urusan
         -  [ ] Ubah Data Bidang Urusan
         -  [ ] Hapus Data Bidang Urusan
      -  [ ] **Program**
         -  [ ] List Data Program
         -  [ ] Singkron Data Program dari SIPD
         -  [ ] Tambah Data Program
         -  [ ] Ubah Data Program
         -  [ ] Hapus Data Program
      -  [ ] **Sub Kegiatan**
         -  [ ] List Data Sub Kegiatan
         -  [ ] Singkron Data Sub Kegiatan dari SIPD
         -  [ ] Tambah Data Sub Kegiatan
         -  [ ] Ubah Data Sub Kegiatan
         -  [ ] Hapus Data Sub Kegiatan
      -  [ ] **SKPD**
         -  [x] List Data SKPD
         -  [x] Singkron Data SKPD dari SIPD
         -  [ ] Tambah Data SKPD
         -  [ ] Ubah Data SKPD
         -  [ ] Hapus Data SKPD
      -  [ ] **User**
         -  [x] List Data User SIPD
         -  [x] Singkron Data User SIPD dari SIPD
         -  [ ] Tambah Data User SIPD
         -  [ ] Ubah Data User SIPD
         -  [ ] Hapus Data User SIPD
         -  [x] Buat Akun User
   -  [ ] **RKA**
      -  [ ] Jadwal Anggaran
         -  [x] List Data Jadwal Anggaran
         -  [x] Singkron Data Jadwal Anggaran dari SIPD
         -  [ ] Tambah Data Jadwal Anggaran
         -  [x] Ubah Data Jadwal Anggaran
         -  [x] Salin Data Jadwal Anggaran
         -  [x] Hapus Data Jadwal Anggaran
      -  [ ] Belanja SKPD
         -  [x] List Data Belanja SKPD
         -  [x] Singkron Data Belanja SKPD dari SIPD
         -  [ ] Tambah Data Belanja SKPD
         -  [ ] Ubah Data Belanja SKPD
         -  [ ] Hapus Data Belanja SKPD
         -  [ ] Atur TAPD untuk Belanja SKPD
      -  [ ] Belanja Kegiatan
         -  [ ] List Data Belanja Kegiatan
         -  [x] Singkron Data Belanja Kegiatan dari SIPD
         -  [ ] Tambah Data Belanja Kegiatan
         -  [ ] Ubah Data Belanja Kegiatan
         -  [ ] Hapus Data Belanja Kegiatan
      -  [ ] Belanja Sub Kegiatan
         -  [x] List Data Belanja Sub Kegiatan
         -  [x] Singkron Data Belanja Sub Kegiatan dari SIPD
         -  [ ] Tambah Data Belanja Sub Kegiatan
         -  [ ] Ubah Data Belanja Sub Kegiatan
         -  [ ] Hapus Data Belanja Sub Kegiatan
         -  [ ] Rincian Belanja Sub Kegiatan
            -  [x] List Data Rincian Belanja Sub Kegiatan
            -  [ ] Singkron Data Rincian Belanja Sub Kegiatan
            -  [ ] Lihat Data Rincian Belanja Sub Kegiatan
            -  [ ] Tambah Data Rincian Belanja Sub Kegiatan
            -  [ ] Ubah Data Rincian Belanja Sub Kegiatan
            -  [ ] Hapus Data Rincian Belanja Sub Kegiatan
            -  [x] Cetak Data Rincian Belanja Sub Kegiatan
            -  [ ] Export Excel Data Rincian Belanja Sub Kegiatan
            -  [ ] Kelompok Data Rincian Belanja Sub Kegiatan
               -  [x] Singkron Data Kelompok Rincian Belanja Sub Kegiatan
               -  [ ] Tambah Data Kelompok Rincian Belanja Sub Kegiatan
               -  [ ] Hapus Data Kelompok Rincian Belanja Sub Kegiatan
            -  [ ] Keterangan Data Rincian Belanja Sub Kegiatan
               -  [x] Singkron Data Keterangan Rincian Belanja Sub Kegiatan
               -  [x] Tambah Data Keterangan Rincian Belanja Sub Kegiatan
               -  [ ] Hapus Data Keterangan Rincian Belanja Sub Kegiatan
      -  [ ] Laporan RKA Berdasarkan Jadwal Anggaran
         -  [ ] Laporan dari SIPD
            -  [ ] Belanja
               -  [ ] SKPD
                  -  [ ] Export Excel Laporan RKA SKPD
                  -  [x] Generate Excel Formulir Draft RKA Perubahan SKPD
                  -  [x] Cetak RDPPA SKPD
               -  [ ] Sub Kegiatan
                  -  [ ] Rekapan Sub Kegiatan
                     -  [ ] Export Excel RKA Rekapan Sub Kegiatan
                     -  [ ] Export Excel RKA Perubahan Rekapan Sub Kegiatan
                     -  [x] Generate Excel Formulir Draft RKA Perubahan Rekapan Sub Kegiatan
                  -  [ ] Rincian Sub Kegiatan
                     -  [ ] Export Excel RKA Rincian Belanja Sub Kegiatan
                     -  [ ] Export Excel RKA Perubahan Rincian Belanja Sub Kegiatan
                     -  [x] Generate Excel Formulir Draft RKA Perubahan Rincian Belanja Sub Kegiatan
                     -  [x] Cetak RDPPA Rincian Belanja Sub Kegiatan
            -  [ ] Pendapatan
               -  [ ] Export Excel RKA Pedapatan
               -  [ ] Export Excel RKA Perubahan Pedapatan
               -  [x] Generate Excel Formulir Draft RKA Perubahan Pedapatan
         -  [ ] Laporan RKA SKPD
            -  [ ] Belanja
               -  [ ] SKPD
                  -  [ ] Singkron Laporan Rekapan Belanja SKPD
                  -  [ ] Cetak RKA Rekapan Belanja SKPD
                  -  [x] Cetak RDPPA Rekapan Belanja SKPD
                  -  [ ] Export Excel Laporan Rekapan Belanja SKPD
               -  [ ] Sub Kegiatan
                  -  [ ] Laporan Rekapan Sub Kegiatan
                     -  [x] Singron Laporan RKA Rekapan Sub Kegiatan
                     -  [ ] Cetak Laporan RKA Rekapan Sub Kegiatan
                     -  [x] Cetak RDPPA Rekapan Sub Kegiatan
                     -  [x] Export Excel Laporan RKA Rekapan Sub Kegiatan
                  -  [ ] Laporan Rincian Belanja Sub Kegiatan
                     -  [x] Singron Laporan RKA Rincian Belanja Sub Kegiatan
                     -  [ ] Cetak Laporan RKA Rincian Belanja Sub Kegiatan
                     -  [x] Cetak RDPPA Rincian Belanja Sub Kegiatan
                     -  [x] Export Excel RKA Laporan Rincian Belanja Sub Kegiatan
            -  [ ] Pendapatan
               -  [x] Singkron Laporan RKA Pedapatan
               -  [ ] Cetak Laporan RKA Pedapatan
               -  [x] Export Excel Formulir Laporan RKA Pedapatan
   -  [ ] **RKPD**
      -  [ ] Jadwal RKPD
         -  [ ] Singkron Data Jadwal RKPD dari SIPD
         -  [ ] Tambah Data Jadwal RKPD
         -  [ ] Hapus Data Jadwal RKPD
         -  [ ] Ubah Data Jadwal RKPD
         -  [ ] Salin Data Jadwal RKPD
      -  [ ] Renja
         -  [ ] Singkron Data Renja dari SIPD
         -  [ ] List Data Renja
         -  [ ] Lihat Data Renja
         -  [ ] Tambah Data Renja
         -  [ ] Hapus Data Renja
         -  [ ] Ubah Data Renja
         -  [ ] Cetak Data Renja
      -  [ ] Laporan RKPD Berdasarkan Jadwal RKPD
         -  [ ] Singkron Laporan dari RKPD SIPD
         -  [ ] Export Excel Laporan dari RKPD SIPD
         -  [ ] Download Laporan dari RKPD SIPD
   -  [ ] **RENSTRA**
      -  [ ] Jadwal Renstra
         -  [ ] Singkron Data Jadwal Renstra dari SIPD
         -  [ ] Tambah Data Jadwal Renstra
         -  [ ] Hapus Data Jadwal Renstra
         -  [ ] Ubah Data Jadwal Renstra
         -  [ ] Salin Data Jadwal Renstra
      -  [ ] Cascading Renstra
      -  [ ] Laporan Renstra Berdasarkan Jadwal Renstra
         -  [ ] Singkron Laporan dari Renstra SIPD
         -  [ ] Export Excel Laporan dari Renstra SIPD
         -  [ ] Download Laporan dari Renstra SIPD
   -  [ ] **RPD**
      -  [ ] Jadwal RPD
         -  [ ] Singkron Data Jadwal RPD dari SIPD
         -  [ ] Tambah Data Jadwal RPD
         -  [ ] Hapus Data Jadwal RPD
         -  [ ] Ubah Data Jadwal RPD
         -  [ ] Salin Data Jadwal RPD
      -  [ ] Cascading RPD
      -  [ ] Laporan RPD Berdasarkan Jadwal RPD
         -  [ ] Singkron Laporan dari RPD SIPD
         -  [ ] Export Excel Laporan dari RPD SIPD
         -  [ ] Download Laporan dari RPD SIPD
   -  [ ] **RPJMD**
      -  [ ] Jadwal RPJMD
         -  [ ] Singkron Data Jadwal RPJMD dari SIPD
         -  [ ] Tambah Data Jadwal RPJMD
         -  [ ] Hapus Data Jadwal RPJMD
         -  [ ] Ubah Data Jadwal RPJMD
         -  [ ] Salin Data Jadwal RPJMD
      -  [ ] Cascading RPJMD
      -  [ ] Laporan RPJMD Berdasarkan Jadwal RPJMD
         -  [ ] Singkron Laporan dari RPJMD SIPD
         -  [ ] Export Excel Laporan dari RPJMD SIPD
         -  [ ] Download Laporan dari RPJMD SIPD
-  [ ] **Pengaduan**
   -  [x] Form Pengaduan
   -  [ ] List Pengaduan
   -  [ ] Tanggapan Pengaduan
-  [ ] **KEUANGAN**
   -  [x] Login
   -  [ ] **PENGELUARAN**
      -  [x] SKPD
         -  [x] Cetak Laporan DPA SKPD
         -  [ ] Export Excel Laporan DPA SKPD
      -  [x] PENDAPATAN
         -  [x] Cetak Laporan DPA Pendapatan SKPD
         -  [ ] Export Excel Laporan DPA Belanja SKPD
      -  [x] BELANJA
         -  [x] Cetak Laporan DPA Belanja SKPD
         -  [x] Export Excel Laporan DPA Belanja SKPD
      -  [x] RINCIAN
         -  [x] Cetak Laporan DPA Rincian SKPD
         -  [x] Export Excel Laporan DPA Rincian SKPD

## Dokumentasi

Dokumentasi akan segera tersedia di sini.

## Uji Coba

Aplikasi ini telah diuji pada:

-  Node.js v18.18.2.
-  Windows 11.
-  MongoDB Community Server 7.0.2.
-  Pastikan Anda memiliki database MongoDB yang sesuai.

## Kontribusi

Jika Anda ingin berkontribusi pada proyek ini, silakan ikuti panduan [CONTRIBUTING](./CONTRIBUTING.md) (jika ada) untuk detail lebih lanjut.

## Lisensi

Proyek ini dilisensikan di bawah [Lisensi MIT](./LICENSE). Lisensi MIT memberikan kebebasan yang luas kepada pengguna untuk menggunakan, memodifikasi, dan mendistribusikan perangkat lunak ini, dengan sedikit pembatasan. Ini berarti bahwa Anda dapat menggunakan proyek ini dalam proyek Anda sendiri, memodifikasinya, dan bahkan menjualnya, asalkan Anda tetap menyertakan pemberitahuan hak cipta dan izin yang ada di file lisensi yang terlampir.

Pastikan untuk membaca file lisensi yang disertakan untuk informasi lebih lanjut tentang hak dan kewajiban Anda saat menggunakan proyek ini.

Dengan berkontribusi pada proyek ini, Anda menyetujui lisensi proyek yang tersedia di [LICENSE](./LICENSE.md).

