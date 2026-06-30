// Data Kecamatan dan Kelurahan Kota Bandung
// Sumber: Permendagri (Wikipedia) - 30 Kecamatan, 151 Kelurahan

const KECAMATAN_BANDUNG = [
  {
    nama: 'Andir',
    kelurahan: [
      'Campaka', 'Ciroyom', 'Dunguscariang', 'Garuda',
      'Kebonjeruk', 'Maleber'
    ]
  },
  {
    nama: 'Antapani',
    kelurahan: [
      'Antapani Kidul', 'Antapani Kulon',
      'Antapani Tengah', 'Antapani Wetan'
    ]
  },
  {
    nama: 'Arcamanik',
    kelurahan: [
      'Cisaranten Bina Harapan', 'Cisaranten Endah',
      'Cisaranten Kulon', 'Sukamiskin'
    ]
  },
  {
    nama: 'Astana Anyar',
    kelurahan: [
      'Cibadak', 'Karanganyar', 'Karasak',
      'Nyengseret', 'Panjunan', 'Pelindunghewan'
    ]
  },
  {
    nama: 'Babakan Ciparay',
    kelurahan: [
      'Babakan', 'Babakanciparay', 'Cirangrang',
      'Margahayu Utara', 'Margasuka', 'Sukahaji'
    ]
  },
  {
    nama: 'Bandung Kidul',
    kelurahan: [
      'Batununggal', 'Kujangsari', 'Mengger', 'Wates'
    ]
  },
  {
    nama: 'Bandung Kulon',
    kelurahan: [
      'Caringin', 'Cibuntu', 'Cigondewah Kaler',
      'Cigondewah Kidul', 'Cigondewah Rahayu', 'Cijerah',
      'Gempolsari', 'Warungmuncang'
    ]
  },
  {
    nama: 'Bandung Wetan',
    kelurahan: [
      'Cihapit', 'Citarum', 'Tamansari'
    ]
  },
  {
    nama: 'Batununggal',
    kelurahan: [
      'Binong', 'Cibangkong', 'Gumuruh', 'Kacapiring',
      'Kebongedang', 'Kebonwaru', 'Maleer', 'Samoja'
    ]
  },
  {
    nama: 'Bojongloa Kaler',
    kelurahan: [
      'Babakan Asih', 'Babakan Tarogong', 'Jamika',
      'Kopo', 'Suka Asih'
    ]
  },
  {
    nama: 'Bojongloa Kidul',
    kelurahan: [
      'Cibaduyut', 'Cibaduyut Kidul', 'Cibaduyut Wetan',
      'Kebon Lega', 'Mekarwangi', 'Situsaeur'
    ]
  },
  {
    nama: 'Buahbatu',
    kelurahan: [
      'Cijawura', 'Jatisari', 'Margasari', 'Sekejati'
    ]
  },
  {
    nama: 'Cibeunying Kaler',
    kelurahan: [
      'Cigadung', 'Cihaurgeulis', 'Neglasari', 'Sukaluyu'
    ]
  },
  {
    nama: 'Cibeunying Kidul',
    kelurahan: [
      'Cicadas', 'Cikutra', 'Padasuka', 'Pasirlayung',
      'Sukamaju', 'Sukapada'
    ]
  },
  {
    nama: 'Cibiru',
    kelurahan: [
      'Cipadung', 'Cisurupan', 'Palasari', 'Pasirbiru'
    ]
  },
  {
    nama: 'Cicendo',
    kelurahan: [
      'Arjuna', 'Husen Sastranegara', 'Pajajaran',
      'Pamoyanan', 'Pasirkaliki', 'Sukaraja'
    ]
  },
  {
    nama: 'Cidadap',
    kelurahan: [
      'Ciumbuleuit', 'Hegarmanah', 'Ledeng'
    ]
  },
  {
    nama: 'Cinambo',
    kelurahan: [
      'Babakan Penghulu', 'Cisaranten Wetan',
      'Pakemitan', 'Sukamulya'
    ]
  },
  {
    nama: 'Coblong',
    kelurahan: [
      'Cipaganti', 'Dago', 'Lebakgede', 'Lebaksiliwangi',
      'Sadangserang', 'Sekeloa'
    ]
  },
  {
    nama: 'Gedebage',
    kelurahan: [
      'Cimincrang', 'Cisaranten Kidul',
      'Rancabolang', 'Rancanumpang'
    ]
  },
  {
    nama: 'Kiaracondong',
    kelurahan: [
      'Babakansari', 'Babakansurabaya', 'Cicaheum',
      'Kebonkangkung', 'Kebunjayanti', 'Sukapura'
    ]
  },
  {
    nama: 'Lengkong',
    kelurahan: [
      'Burangrang', 'Cijagra', 'Cikawao', 'Lingkar Selatan',
      'Malabar', 'Paledang', 'Turangga'
    ]
  },
  {
    nama: 'Mandalajati',
    kelurahan: [
      'Jatihandap', 'Karangpamulang',
      'Pasir Impun', 'Sindangjaya'
    ]
  },
  {
    nama: 'Panyileukan',
    kelurahan: [
      'Cipadung Kidul', 'Cipadung Kulon',
      'Cipadung Wetan', 'Mekarmulya'
    ]
  },
  {
    nama: 'Rancasari',
    kelurahan: [
      'Cipamokolan', 'Darwati', 'Manjahlega', 'Mekar Jaya'
    ]
  },
  {
    nama: 'Regol',
    kelurahan: [
      'Ancol', 'Balonggede', 'Ciateul', 'Cigereleng',
      'Ciseureuh', 'Pasirluyu', 'Pungkur'
    ]
  },
  {
    nama: 'Sukajadi',
    kelurahan: [
      'Cipedes', 'Pasteur', 'Sukabungah',
      'Sukagalih', 'Sukawarna'
    ]
  },
  {
    nama: 'Sukasari',
    kelurahan: [
      'Gegerkalong', 'Isola', 'Sarijadi', 'Sukarasa'
    ]
  },
  {
    nama: 'Sumur Bandung',
    kelurahan: [
      'Babakanciamis', 'Braga', 'Kebonpisang', 'Merdeka'
    ]
  },
  {
    nama: 'Ujungberung',
    kelurahan: [
      'Cigending', 'Pasanggrahan', 'Pasirendah',
      'Pasirjati', 'Pasirwangi'
    ]
  }
];

// Helper: get all kecamatan names (sorted alphabetically)
export const KECAMATAN_OPTIONS = KECAMATAN_BANDUNG
  .map(k => k.nama)
  .sort((a, b) => a.localeCompare(b, 'id'));

// Helper: get kelurahan for a specific kecamatan
export const getKelurahanByKecamatan = (kecamatan) => {
  const found = KECAMATAN_BANDUNG.find(
    k => k.nama.toLowerCase() === kecamatan?.toLowerCase()
  );
  return found ? found.kelurahan.sort((a, b) => a.localeCompare(b, 'id')) : [];
};

export default KECAMATAN_BANDUNG;
