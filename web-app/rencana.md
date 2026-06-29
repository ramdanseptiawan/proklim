# Rencana Peningkatan UX dan Otomatisasi Input Data (ProKlim Web-App)

Berdasarkan analisis pada kode aplikasi (terutama `App.jsx`, `FormControls.jsx`, dan struktur form yang ada), berikut adalah usulan komprehensif mengenai hal-hal yang dapat mempermudah pengguna (UX) dan data yang dapat diotomatisasi.

## 1. Kemudahan Input Pengguna (Peningkatan UX)

*   **Fitur "Sama dengan Pengisi Data" di Tahap 2 (Lokasi):** Seringkali Nara Hubung Lokasi adalah orang yang sama dengan Pengisi Data. Menambahkan _checkbox_ "Gunakan data Pengisi" akan menghemat waktu pengguna agar tidak perlu mengetik ulang Nama, Alamat, No. Telp, dan Email.
*   **Dropdown Wilayah Terintegrasi (Cascading Dropdowns):** Saat ini input Provinsi sudah berupa dropdown, namun Kabupaten/Kota, Kecamatan, dan Desa/Kelurahan masih berupa _free-text_. Sebaiknya gunakan dropdown berjenjang menggunakan API Wilayah Indonesia. Ini meminimalisir kesalahan ketik (typo) dan standarisasi data.
*   **Penyimpanan Draf Otomatis (Auto-Save ke Local Storage):** Form ini sangat panjang. Jika browser tertutup secara tidak sengaja atau ter-refresh, pengguna akan kehilangan semua data. Implementasikan penyimpanan State React ke `localStorage` agar sesi input tersimpan sementara.
*   **Navigasi Stepper Interaktif:** Pengguna harusnya bisa mengklik bagian _stepper_ di atas (Langkah 1, 2, 3...) untuk melompat kembali ke tahap sebelumnya tanpa harus menekan tombol "Kembali" berkali-kali.
*   **Validasi Total Persentase (Tahap 3):** Pada bagian Tiga Penggunaan Lahan dan Sumber Penghasilan, terdapat input Persentase. Harus ada validasi atau indikator visual yang menunjukkan apakah total persentase sudah mencapai batas logis (misalnya tidak boleh lebih dari 100%).
*   **Manajemen Baris Tabel Dinamis (Tahap 5, 6, 7):** Saat ini form merender 8 baris kosong secara default. Ini membuat halaman terasa sangat panjang dan mengintimidasi. Lebih baik tampilkan 1 baris saja dengan tombol **"+ Tambah Data"** agar UI lebih bersih.
*   **Preset Opsi untuk Kegiatan Adaptasi/Mitigasi:** Ketimbang membiarkan kolom "Jenis Kegiatan" kosong dan diisi manual, kita bisa menyediakan _dropdown_ opsi-opsi umum untuk Adaptasi/Mitigasi ProKlim dengan opsi "Lainnya" untuk input manual.

## 2. Otomatisasi Data (Data yang Bisa Diotomatisasi)

*   **Kalkulasi Otomatis Suhu dan Curah Hujan Tahunan (Tahap 3):** Saat ini Curah Hujan Tahunan dan Suhu Tahunan diinput manual. Sistem seharusnya menghitung ini secara otomatis sebagai rata-rata atau akumulasi dari input 12 bulan yang dimasukkan di bawahnya.
*   **Integrasi API Cuaca / Iklim (Tahap 3):** Data Suhu Bulanan dan Curah Hujan Bulanan sangat merepotkan jika dicari manual. Dengan mengetahui titik lokasi (Kecamatan/Desa), sistem bisa mengisi otomatis 12 bulan tersebut.
    *   *Ketersediaan API:* BMKG saat ini menyediakan API publik JSON gratis hanya untuk prakiraan cuaca harian (jangka pendek). Untuk data iklim/historis bulanan, BMKG menyediakannya melalui portal WMS/WFS Satu Peta atau Portal Data Terbuka, yang mungkin butuh *parsing* lebih lanjut. Sebagai alternatif siap pakai (REST API JSON), kita bisa menggunakan **Open-Meteo Historical Weather API** yang gratis dan menyediakan data iklim historis (curah hujan, suhu) bulanan secara global berbasis titik koordinat.
*   **Tingkat Kerentanan SIDIK (Tahap 4):** Indeks Kerentanan SIDIK (Sistem Informasi Data Indeks Kerentanan) dikelola oleh KLHK untuk menilai Keterpaparan, Sensitivitas, dan Kapasitas Adaptif.
    *   *Ketersediaan API:* Saat ini, platform SIDIK di `sidik.menlhk.go.id` sedang dalam proses revitalisasi dan KLHK belum menyediakan public REST API terbuka secara langsung. Pengambilan data umumnya membutuhkan pengajuan akses instansi atau metode *web scraping/crawling* jika portal publiknya sudah kembali online. Jika kita sudah mengimplementasikan _dropdown_ wilayah terstandar, nilai IKA dan IKS ini nantinya bisa disambungkan jika kita sudah mendapat akses database/API resmi SIDIK.
*   **Elevasi/Ketinggian (Tahap 3):** Jika kita mengimplementasikan input lokasi berbasis _Map_ (misalnya Google Maps / Mapbox untuk "Pin Lokasi"), data elevasi (mdpl) bisa didapatkan secara otomatis lewat API Elevasi (misalnya Google Elevation API atau Open Topo Data).

## Rekomendasi Prioritas Eksekusi

1.  ~~**Prioritas Tinggi (Mudah & Berdampak Besar):** Auto-save dengan `localStorage`, Checkbox "Sama dengan Pengisi", perhitungan otomatis Total Suhu/Hujan tahunan dari input bulanan, dan baris tabel dinamis (tombol tambah baris).~~ **[SELESAI]**
2.  **Prioritas Menengah:** Mengganti input wilayah teks menjadi Dropdown berjenjang API Wilayah.
3.  ~~**Prioritas Lanjut (Integrasi Eksternal):** Menarik data curah hujan bulanan, suhu, dan data indeks SIDIK otomatis menggunakan API eksternal.~~ **[BAGIAN CUACA SELESAI]** (Sisa: SIDIK API jika memungkinkan).
