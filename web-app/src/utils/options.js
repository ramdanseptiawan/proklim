// Shared dropdown option constants extracted from template.xlsx REF sheet

export const PROVINSI_OPTIONS = [
  'ACEH', 'SUMATERA UTARA', 'SUMATERA BARAT', 'RIAU', 'KEPULAUAN RIAU',
  'JAMBI', 'BENGKULU', 'SUMATERA SELATAN', 'LAMPUNG', 'BANGKA BELITUNG',
  'BANTEN', 'DKI JAKARTA', 'JAWA BARAT', 'JAWA TENGAH',
  'DAERAH ISTIMEWA YOGYAKARTA', 'JAWA TIMUR', 'BALI', 'NUSA TENGGARA BARAT',
  'NUSA TENGGARA TIMUR', 'KALIMANTAN BARAT', 'KALIMANTAN TENGAH',
  'KALIMANTAN SELATAN', 'KALIMANTAN TIMUR', 'KALIMANTAN UTARA', 'GORONTALO',
  'SULAWESI UTARA', 'SULAWESI TENGAH', 'SULAWESI BARAT', 'SULAWESI SELATAN',
  'SULAWESI TENGGARA', 'MALUKU', 'MALUKU UTARA', 'PAPUA', 'PAPUA BARAT'
];

export const TOPOGRAFI_OPTIONS = [
  'Dataran Rendah (<400 mdpl)',
  'Dataran Sedang (400-700 mdpl)',
  'Dataran Tinggi (>700 mdpl)',
  'Pegunungan',
  'Lainnya (sebutkan)'
];

export const TIPOLOGI_OPTIONS = [
  'Pesisir', 'Perkotaan', 'Perdesaan', 'Tepi Hutan', 'Lainnya (sebutkan)'
];

export const CIRI_KHAS_OPTIONS = [
  'Pemukiman Padat', 'Lumbung Pangan', 'Kampung Nelayan', 'Desa Wisata',
  'Desa Energi', 'Desa Edukasi', 'Lainnya (sebutkan)'
];

export const PENGGUNAAN_LAHAN_OPTIONS = [
  'Pertanian', 'Perkebunan', 'Hutan', 'Permukiman', 'Industri', 'Perikanan',
  'Lainnya (sebutkan)'
];

export const SUMBER_PENGHASILAN_OPTIONS = [
  'Pertanian', 'Perkebunan', 'Perikanan', 'Peternakan', 'Kehutanan',
  'Buruh Pabrik', 'Tambang/Galian', 'Pedagang', 'Pegawai', 'Industri',
  'Wirausaha', 'Lainnya (sebutkan)'
];

export const SUMBER_DATA_OPTIONS = [
  'BMKG', 'Dinas Pertanian', 'Kecamatan dalam Angka', 'Lainnya (sebutkan)'
];

export const TINGKAT_KEJADIAN_OPTIONS = [
  '-- Tidak Ada Data --', 'Bertambah', 'Berkurang', 'Tetap'
];

export const TINGKAT_KERENTANAN_OPTIONS = [
  '-- Tidak Ada --', 'Rendah', 'Sedang', 'Tinggi'
];

export const FUNGSI_SUMBER_AIR_OPTIONS = [
  '-- Tidak Ada Data --', 'Tidak Memadai', 'Kurang Memadai', 'Memadai'
];

// Yes/No-style options used in KEL-MASYARAKAT (Data column)
export const DATA_PIHAN_OPTIONS = ['Tidak Ada', 'Ada'];

// Kondisi options used in adaptasi/mitigasi tables
export const KONDISI_OPTIONS = [
  '-- Tidak Ada Data --', 'Tidak berjalan',
  'Berjalan dengan beberapa hambatan', 'Berjalan dengan baik'
];

export const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Helper to make a placeholder option list with empty first choice
export const withEmpty = (options) => ['', ...options];

// Kota Bandung data
export const KOTA_BANDUNG = 'Kota Bandung';
export { KECAMATAN_OPTIONS, getKelurahanByKecamatan } from '../data/bandung';