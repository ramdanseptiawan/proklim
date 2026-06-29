import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});
import './index.css';
import { generateExcel } from './utils/excelHelper';
import { NumberField, SelectField, TextareaField, SubHeading } from './components/FormControls';
import {
  PROVINSI_OPTIONS, TOPOGRAFI_OPTIONS, TIPOLOGI_OPTIONS, CIRI_KHAS_OPTIONS,
  PENGGUNAAN_LAHAN_OPTIONS, SUMBER_PENGHASILAN_OPTIONS, SUMBER_DATA_OPTIONS,
  TINGKAT_KEJADIAN_OPTIONS, TINGKAT_KERENTANAN_OPTIONS, FUNGSI_SUMBER_AIR_OPTIONS,
  DATA_PIHAN_OPTIONS, KONDISI_OPTIONS, BULAN
} from './utils/options';

// ---- Constants ----
const MONTH_KEYS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const PERUBAHAN_ITEMS = [
  { id: 'a', label: 'a. Perubahan frekuensi (sering atau tidak) turunnya hujan' },
  { id: 'b', label: 'b. Perubahan intensitas (deras atau tidak) curah hujan' },
  { id: 'c', label: 'c. Perubahan / pergeseran musim hujan / kemarau' },
  { id: 'd', label: 'd. Perubahan suhu udara' },
  { id: 'e', label: 'e. Perubahan pasang surut air laut' },
  { id: 'f', label: 'f. Kecukupan Air Hujan' },
  { id: 'g', label: 'g. Kecukupan Air Permukaan (Sungai, danau, situ, dll.)' },
  { id: 'h', label: 'h. Kecukupan Air Tanah (Sumur rumah tangga)' },
  { id: 'i', label: 'i. Kecukupan Air Tanah Dalam (> 40 meter) (Sumur bor)' },
  { id: 'j', label: 'j. Kecukupan Mata Air' },
  { id: 'k', label: 'k. Tingkat kejadian banjir' },
  { id: 'l', label: 'l. Tingkat kejadian longsor' },
  { id: 'm', label: 'm. Tingkat kejadian ROB' },
  { id: 'n', label: 'n. Tingkat kejadian kekeringan' },
  { id: 'o', label: 'o. Tingkat kejadian gagal panen' },
  { id: 'p', label: 'p. Tingkat kejadian cuaca angin ekstrim puting beliung' },
  { id: 'q', label: 'q. Tingkat kejadian penyakit terkait iklim (DBD, Diare / Malaria)' },
  { id: 'r', label: 'r. Tingkat kejadian kebakaran hutan / lahan' }
];
const AIR_ITEMS = [
  { id: 'a', label: 'a. Air Hujan' },
  { id: 'b', label: 'b. Air Permukaan (Sungai, danau / situ, dll.)' },
  { id: 'c', label: 'c. Air Tanah (Sumur rumah tangga)' },
  { id: 'd', label: 'd. Air Tanah Dalam (> 40 meter) (Sumur bor)' },
  { id: 'e', label: 'e. Mata Air' }
];

const STEPS = ['Pengisi', 'Lokasi', 'Data Dasar', 'Informasi PI', 'Adaptasi', 'Mitigasi', 'Kel. Masyarakat'];

// ---- Table field configs (DRY: drive header + row rendering) ----
const ADAPTASI_FIELDS = [
  { key: 'jenisKegiatan', label: 'Jenis Kegiatan', type: 'text' },
  { key: 'satuan', label: 'Satuan', type: 'text' },
  { key: 'jumlah', label: 'Jumlah', type: 'number' },
  { key: 'penerimaKK', label: 'Penerima KK', type: 'number' },
  { key: 'terdampakKK', label: 'Terdampak KK', type: 'number' },
  { key: 'lamaKegiatan', label: 'Lama Kegiatan', type: 'text' },
  { key: 'kondisi', label: 'Kondisi', type: 'select', options: KONDISI_OPTIONS },
  { key: 'uraian', label: 'Uraian/Bukti', type: 'text' }
];

const KEL_FIELDS = [
  { key: 'data', label: 'Data', type: 'select', options: DATA_PIHAN_OPTIONS },
  { key: 'keterangan', label: 'Keterangan', type: 'text' },
  { key: 'bukti', label: 'Bukti Pendukung', type: 'text' }
];

const ADAPTASI_SECTIONS_META = [
  { key: '1', title: '1. Pengendalian Kekeringan', rowCount: 8 },
  { key: '2', title: '2. Pengendalian Banjir', rowCount: 8 },
  { key: '3', title: '3. Pengendalian Longsor', rowCount: 8 },
  { key: '4', title: '4. Pengendalian Gelombang Pasang', rowCount: 8 },
  { key: '5', title: '5. Pengendalian Kebakaran', rowCount: 8 }
];

const MITIGASI_SECTIONS_META = [
  { key: '1', title: '1. Pengurangan Emisi GRK', rowCount: 8 },
  { key: '2', title: '2. Penyerapan/Penyimpanan Karbon', rowCount: 8 },
  { key: '3', title: '3. Energi Terbarukan & Efisiensi Energi', rowCount: 8 },
  { key: '4', title: '4. Teknologi Ramah Iklim', rowCount: 8 }
];

const KEL_SECTIONS_META = [
  { key: '1', title: '1. Kelembagaan Masyarakat', rowCount: 4 },
  { key: '2', title: '2. Dukungan Kebijakan', rowCount: 4 },
  { key: '3', title: '3. Partisipasi Masyarakat', rowCount: 4 },
  { key: '4', title: '4. Kapasitas Masyarakat', rowCount: 5 },
  { key: '5', title: '5. Dukungan Sumberdaya Eksternal', rowCount: 3 },
  { key: '6', title: '6. Pengembangan Kegiatan', rowCount: 4 },
  { key: '7', title: '7. Pengelolaan Data Aksi', rowCount: 4 },
  { key: '8', title: '8. Manfaat Ekonomi/Sosial/Lingkungan', rowCount: 6 }
];

// ---- State factory helpers ----
const emptyAdaptasiRow = () => ({
  jenisKegiatan: '', satuan: '', jumlah: '', penerimaKK: '',
  terdampakKK: '', lamaKegiatan: '', kondisi: '', uraian: ''
});
const emptyKelRow = () => ({ data: '', keterangan: '', bukti: '' });
const makeRows = (count, fn) => Array.from({ length: count }, fn);

const buildSections = (meta, emptyFn) => {
  const sections = {};
  meta.forEach(s => { sections[s.key] = { title: s.title, rows: makeRows(1, emptyFn) }; });
  return sections;
};

const buildDataDasarState = () => {
  const s = {
    luasLokasi: '', jumlahKK: '', jumlahPenduduk: '', elevasi: '',
    topografi: '', tipologi: '', ciriKhas: '',
    lahanA: '', lahanAPersen: '', lahanB: '', lahanBPersen: '', lahanC: '', lahanCPersen: '',
    penghasilanA: '', penghasilanAPersen: '', penghasilanB: '', penghasilanBPersen: '', penghasilanC: '', penghasilanCPersen: '',
    curahHujanTahunan: '', sumberDataCurah: '', suhuTahunan: '', sumberDataSuhu: ''
  };
  MONTH_KEYS.forEach(m => { s[`curah${m}`] = ''; s[`suhu${m}`] = ''; });
  return s;
};

const buildInformasiPIState = () => {
  const s = { tingkatKerentanan: '', nilaiIKA: '', nilaiIKS: '' };
  PERUBAHAN_ITEMS.forEach(item => {
    const L = item.id.toUpperCase();
    s[`perubahan${L}_T`] = ''; s[`perubahan${L}_K`] = '';
  });
  AIR_ITEMS.forEach(item => {
    const L = item.id.toUpperCase();
    s[`air${L}_F`] = ''; s[`air${L}_K`] = '';
  });
  return s;
};

// ---- Reusable table form component (uses <table> for semantics + CSS) ----
function TableForm({ sections, sectionsMeta, fields, onChange, onAddRow, onRemoveRow }) {
  return (
    <div className="table-form">
      {sectionsMeta.map(sec => (
        <div key={sec.key} style={{ marginBottom: '1.5rem' }}>
          <SubHeading>{sec.title}</SubHeading>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th className="col-narrow">No</th>
                  {fields.map(f => <th key={f.key}>{f.label}</th>)}
                  <th className="col-narrow">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {(sections[sec.key]?.rows || []).map((row, idx) => (
                  <tr key={idx}>
                    <td className="no">{idx + 1}</td>
                    {fields.map(f => (
                      <td key={f.key}>
                        {f.type === 'select' ? (
                          <select value={row[f.key] || ''} onChange={e => onChange(sec.key, idx, f.key, e.target.value)}>
                            <option value="">--</option>
                            {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input type={f.type} value={row[f.key] || ''} onChange={e => onChange(sec.key, idx, f.key, e.target.value)} />
                        )}
                      </td>
                    ))}
                    <td>
                      <button className="btn btn-sm" style={{ backgroundColor: '#ff4d4f', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }} onClick={() => onRemoveRow(sec.key, idx)}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem', padding: '4px 12px', fontSize: '0.85rem' }} onClick={() => onAddRow(sec.key)}>
            + Tambah Baris
          </button>
        </div>
      ))}
    </div>
  );
}

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

// ---- Main App ----
function App() {
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem('proklim_step');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('proklim_form');
    if (saved) return JSON.parse(saved);
    return {
      pengisi: { namaLengkap:'', jabatan:'', jalan:'', desaKel:'', kecamatan:'', kotaKab:'', provinsi:'', noTelp:'', email:'' },
      lokasi: { dusun:'', desa:'', kecamatan:'', kotaKab:'', provinsi:'', website:'', emailLokasi:'', naraNama:'', naraAlamat:'', naraTelp:'', naraEmail:'', naraInstitusi:'', naraJabatan:'', latitude: '', longitude: '' },
      dataDasar: buildDataDasarState(),
      informasiPI: buildInformasiPIState(),
      adaptasi: { sections: buildSections(ADAPTASI_SECTIONS_META, emptyAdaptasiRow) },
      mitigasi: { sections: buildSections(MITIGASI_SECTIONS_META, emptyAdaptasiRow) },
      kelMasyarakat: { sections: buildSections(KEL_SECTIONS_META, emptyKelRow) }
    };
  });

  useEffect(() => {
    localStorage.setItem('proklim_step', step);
  }, [step]);

  useEffect(() => {
    localStorage.setItem('proklim_form', JSON.stringify(formData));
  }, [formData]);

  const handleResetDraft = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua draft dan mengulang dari awal?")) {
      localStorage.removeItem('proklim_step');
      localStorage.removeItem('proklim_form');
      window.location.reload();
    }
  };

  const handleCopyPengisi = (e) => {
    if (e.target.checked) {
      setFormData(prev => ({
        ...prev,
        lokasi: {
          ...prev.lokasi,
          naraNama: prev.pengisi.namaLengkap,
          naraAlamat: prev.pengisi.jalan,
          naraTelp: prev.pengisi.noTelp,
          naraEmail: prev.pengisi.email
        }
      }));
    }
  };

  const handleAddTableRow = (formName, sectionKey, emptyFn) => {
    setFormData(prev => ({
      ...prev,
      [formName]: {
        sections: {
          ...prev[formName].sections,
          [sectionKey]: {
            ...prev[formName].sections[sectionKey],
            rows: [...prev[formName].sections[sectionKey].rows, emptyFn()]
          }
        }
      }
    }));
  };

  const handleRemoveTableRow = (formName, sectionKey, rowIndex) => {
    setFormData(prev => ({
      ...prev,
      [formName]: {
        sections: {
          ...prev[formName].sections,
          [sectionKey]: {
            ...prev[formName].sections[sectionKey],
            rows: prev[formName].sections[sectionKey].rows.filter((_, i) => i !== rowIndex)
          }
        }
      }
    }));
  };

  const handleFetchWeather = async () => {
    let { latitude, longitude, desa, kecamatan } = formData.lokasi;
    
    if (!latitude || !longitude) {
      if (!desa && !kecamatan) {
        alert("Pilih titik di peta pada Langkah 2, atau isi Desa/Kecamatan untuk pencarian otomatis.");
        return;
      }
      setIsFetchingWeather(true);
      try {
        const query = `${desa} ${kecamatan}`.trim();
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=id`);
        const geoData = await geoRes.json();
        if (!geoData.results || geoData.results.length === 0) {
          alert("Lokasi tidak ditemukan. Silakan pilih titik koordinat langsung di peta pada Langkah 2.");
          setIsFetchingWeather(false);
          return;
        }
        latitude = geoData.results[0].latitude;
        longitude = geoData.results[0].longitude;
        setFormData(prev => ({ ...prev, lokasi: { ...prev.lokasi, latitude, longitude } }));
      } catch (err) {
        console.error(err);
        alert("Gagal mencari lokasi otomatis.");
        setIsFetchingWeather(false);
        return;
      }
    } else {
      setIsFetchingWeather(true);
    }

    try {
      const elevRes = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${latitude}&longitude=${longitude}`);
      const elevData = await elevRes.json();
      const elevation = elevData.elevation && elevData.elevation.length > 0 ? elevData.elevation[0] : '';

      const weatherRes = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=2023-01-01&end_date=2023-12-31&daily=temperature_2m_mean,precipitation_sum&timezone=Asia/Jakarta`);
      const weatherData = await weatherRes.json();
      
      const monthlyPrecip = new Array(12).fill(0);
      const monthlyTempSum = new Array(12).fill(0);
      const monthlyDays = new Array(12).fill(0);
      
      weatherData.daily.time.forEach((dateStr, i) => {
        const monthIndex = new Date(dateStr).getMonth();
        const precip = weatherData.daily.precipitation_sum[i];
        const temp = weatherData.daily.temperature_2m_mean[i];
        if (precip !== null) monthlyPrecip[monthIndex] += precip;
        if (temp !== null) {
          monthlyTempSum[monthIndex] += temp;
          monthlyDays[monthIndex]++;
        }
      });
      
      const newDataDasar = { ...formData.dataDasar };
      MONTH_KEYS.forEach((m, i) => {
        newDataDasar[`curah${m}`] = Math.round(monthlyPrecip[i]);
        newDataDasar[`suhu${m}`] = monthlyDays[i] ? (monthlyTempSum[i] / monthlyDays[i]).toFixed(1) : '';
      });
      if (elevation !== '') newDataDasar.elevasi = elevation;
      newDataDasar.sumberDataCurah = 'Lainnya (sebutkan)';
      newDataDasar.sumberDataSuhu = 'Lainnya (sebutkan)';
      
      setFormData(prev => ({ ...prev, dataDasar: newDataDasar }));
      alert(`Data iklim dan elevasi berhasil ditarik dari koordinat: ${latitude}, ${longitude}`);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menarik data cuaca/elevasi.");
    }
    setIsFetchingWeather(false);
  };

  const getCurahTahunan = () => {
    let sum = 0;
    MONTH_KEYS.forEach(m => sum += Number(formData.dataDasar[`curah${m}`]) || 0);
    return sum;
  };
  
  const getSuhuTahunan = () => {
    let sum = 0;
    let count = 0;
    MONTH_KEYS.forEach(m => {
      const v = Number(formData.dataDasar[`suhu${m}`]);
      if (v) { sum += v; count++; }
    });
    return count > 0 ? (sum / count).toFixed(1) : '';
  };

  // Generic flat-form change handler factory
  const handleChange = (formName) => (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [formName]: { ...prev[formName], [name]: value } }));
  };
  const handlePengisiChange = handleChange('pengisi');
  const handleLokasiChange = handleChange('lokasi');
  const handleDataDasarChange = handleChange('dataDasar');
  const handleInformasiPIChange = handleChange('informasiPI');

  // Table-form change handler
  const handleTableChange = (formName, sectionKey, rowIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      [formName]: {
        sections: {
          ...prev[formName].sections,
          [sectionKey]: {
            ...prev[formName].sections[sectionKey],
            rows: prev[formName].sections[sectionKey].rows.map((row, i) =>
              i === rowIndex ? { ...row, [field]: value } : row
            )
          }
        }
      }
    }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsSuccess(false);
    const success = await generateExcel(formData);
    setIsGenerating(false);
    if (success) { setIsSuccess(true); setTimeout(() => setIsSuccess(false), 5000); }
  };

  return (
    <div className="app-container">
      <div className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>ProKlim Form Generator</h1>
          <button className="btn btn-secondary btn-sm" onClick={handleResetDraft}>Reset Draft</button>
        </div>
        <p>Isi data di bawah ini untuk menghasilkan file Excel otomatis</p>
      </div>

      <div className="stepper">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const state = step === n ? 'active' : step > n ? 'completed' : '';
          return (
            <div className={`step ${state}`} key={n}>
              <div className={`step-indicator ${state}`}>
                {step > n ? '✓' : n}
              </div>
              <span className="step-label">{label}</span>
            </div>
          );
        })}
      </div>
      <div className="current-step-label">Langkah {step} dari {STEPS.length}: {STEPS[step - 1]}</div>

      {/* STEP 1: ID-PENGISI */}
      {step === 1 && (
        <div className="form-section">
          <h2 className="form-title">Identitas Pengisi Data</h2>
          <div className="form-grid">
            <div className="form-group full-width"><label>Nama Lengkap</label><input type="text" name="namaLengkap" value={formData.pengisi.namaLengkap} onChange={handlePengisiChange} placeholder="John Doe" /></div>
            <div className="form-group full-width"><label>Jabatan</label><input type="text" name="jabatan" value={formData.pengisi.jabatan} onChange={handlePengisiChange} placeholder="Ketua Kelompok" /></div>
            <div className="form-group full-width"><label>Jalan, Nomor, RT / RW</label><input type="text" name="jalan" value={formData.pengisi.jalan} onChange={handlePengisiChange} placeholder="Jl. Merdeka No.1 RT 01 / RW 02" /></div>
            <div className="form-group"><label>Desa / Kelurahan</label><input type="text" name="desaKel" value={formData.pengisi.desaKel} onChange={handlePengisiChange} /></div>
            <div className="form-group"><label>Kecamatan</label><input type="text" name="kecamatan" value={formData.pengisi.kecamatan} onChange={handlePengisiChange} /></div>
            <div className="form-group"><label>Kota / Kabupaten</label><input type="text" name="kotaKab" value={formData.pengisi.kotaKab} onChange={handlePengisiChange} /></div>
            <SelectField label="Provinsi" name="provinsi" value={formData.pengisi.provinsi} onChange={handlePengisiChange} options={PROVINSI_OPTIONS} />
            <div className="form-group"><label>No Telepon / HP</label><input type="tel" name="noTelp" value={formData.pengisi.noTelp} onChange={handlePengisiChange} placeholder="081234567890" /></div>
            <div className="form-group"><label>E-mail</label><input type="email" name="email" value={formData.pengisi.email} onChange={handlePengisiChange} placeholder="john@example.com" /></div>
          </div>
        </div>
      )}

      {/* STEP 2: ID-LOKASI */}
      {step === 2 && (
        <div className="form-section">
          <h2 className="form-title">Identitas Lokasi</h2>
          <div className="form-grid">
            <div className="form-group"><label>Dusun/RW</label><input type="text" name="dusun" value={formData.lokasi.dusun} onChange={handleLokasiChange} /></div>
            <div className="form-group"><label>Desa/Kelurahan</label><input type="text" name="desa" value={formData.lokasi.desa} onChange={handleLokasiChange} /></div>
            <div className="form-group"><label>Kecamatan</label><input type="text" name="kecamatan" value={formData.lokasi.kecamatan} onChange={handleLokasiChange} /></div>
            <div className="form-group"><label>Kota/Kabupaten</label><input type="text" name="kotaKab" value={formData.lokasi.kotaKab} onChange={handleLokasiChange} /></div>
            <SelectField label="Provinsi" name="provinsi" value={formData.lokasi.provinsi} onChange={handleLokasiChange} options={PROVINSI_OPTIONS} />
            <div className="form-group full-width">
              <label>Titik Koordinat Lokasi (Klik di peta untuk menentukan Latitude & Longitude)</label>
              <div style={{ height: '300px', width: '100%', marginBottom: '0.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                <MapContainer center={formData.lokasi.latitude ? [formData.lokasi.latitude, formData.lokasi.longitude] : [-2.5, 118.0]} zoom={formData.lokasi.latitude ? 13 : 4} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker 
                    position={formData.lokasi.latitude ? { lat: formData.lokasi.latitude, lng: formData.lokasi.longitude } : null} 
                    setPosition={(pos) => setFormData(prev => ({ ...prev, lokasi: { ...prev.lokasi, latitude: pos.lat, longitude: pos.lng } }))} 
                  />
                </MapContainer>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Koordinat Terpilih: {formData.lokasi.latitude ? `${formData.lokasi.latitude.toFixed(6)}, ${formData.lokasi.longitude.toFixed(6)}` : 'Belum ditentukan'}
              </div>
            </div>
            <div className="form-group"><label>Website</label><input type="url" name="website" value={formData.lokasi.website} onChange={handleLokasiChange} placeholder="https://..." /></div>
            <div className="form-group full-width"><label>E-mail Lokasi</label><input type="email" name="emailLokasi" value={formData.lokasi.emailLokasi} onChange={handleLokasiChange} /></div>
            <SubHeading>Nara Hubung di Lokasi ProKlim</SubHeading>
            <div className="form-group full-width">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'normal' }}>
                <input type="checkbox" onChange={handleCopyPengisi} />
                Ganti dengan data Pengisi Utama
              </label>
            </div>
            <div className="form-group"><label>Nama Nara Hubung</label><input type="text" name="naraNama" value={formData.lokasi.naraNama} onChange={handleLokasiChange} /></div>
            <div className="form-group"><label>Alamat</label><input type="text" name="naraAlamat" value={formData.lokasi.naraAlamat} onChange={handleLokasiChange} /></div>
            <div className="form-group"><label>Telepon/HP</label><input type="tel" name="naraTelp" value={formData.lokasi.naraTelp} onChange={handleLokasiChange} /></div>
            <div className="form-group"><label>Email Nara Hubung</label><input type="email" name="naraEmail" value={formData.lokasi.naraEmail} onChange={handleLokasiChange} /></div>
            <div className="form-group"><label>Institusi</label><input type="text" name="naraInstitusi" value={formData.lokasi.naraInstitusi} onChange={handleLokasiChange} /></div>
            <div className="form-group"><label>Jabatan</label><input type="text" name="naraJabatan" value={formData.lokasi.naraJabatan} onChange={handleLokasiChange} /></div>
          </div>
        </div>
      )}

      {/* STEP 3: DATA DASAR */}
      {step === 3 && (
        <div className="form-section">
          <h2 className="form-title">Data Dasar Lokasi</h2>
          <div className="form-grid">
            <SubHeading>Karakteristik Lokasi</SubHeading>
            <NumberField label="Luas Lokasi ProKlim" name="luasLokasi" value={formData.dataDasar.luasLokasi} onChange={handleDataDasarChange} suffix="Ha" />
            <NumberField label="Jumlah Kepala Keluarga" name="jumlahKK" value={formData.dataDasar.jumlahKK} onChange={handleDataDasarChange} suffix="KK" />
            <NumberField label="Jumlah Penduduk" name="jumlahPenduduk" value={formData.dataDasar.jumlahPenduduk} onChange={handleDataDasarChange} suffix="Jiwa" />
            <NumberField label="Ketinggian/Elevasi" name="elevasi" value={formData.dataDasar.elevasi} onChange={handleDataDasarChange} suffix="mdpl" />
            <SelectField label="Topografi Daerah" name="topografi" value={formData.dataDasar.topografi} onChange={handleDataDasarChange} options={TOPOGRAFI_OPTIONS} />
            <SelectField label="Tipologi Lokasi" name="tipologi" value={formData.dataDasar.tipologi} onChange={handleDataDasarChange} options={TIPOLOGI_OPTIONS} />
            <SelectField label="Ciri Khas Lokasi" name="ciriKhas" value={formData.dataDasar.ciriKhas} onChange={handleDataDasarChange} options={CIRI_KHAS_OPTIONS} />

            <SubHeading>Tiga Penggunaan Lahan Dominan</SubHeading>
            {['A','B','C'].map(letter => (
              <div className="field-pair" key={letter}>
                <SelectField label={`Penggunaan Lahan ${letter}`} name={`lahan${letter}`} value={formData.dataDasar[`lahan${letter}`]} onChange={handleDataDasarChange} options={PENGGUNAAN_LAHAN_OPTIONS} />
                <NumberField label="Persentase" name={`lahan${letter}Persen`} value={formData.dataDasar[`lahan${letter}Persen`]} onChange={handleDataDasarChange} suffix="%" />
              </div>
            ))}

            <SubHeading>Tiga Sumber Penghasilan Utama</SubHeading>
            {['A','B','C'].map(letter => (
              <div className="field-pair" key={letter}>
                <SelectField label={`Sumber Penghasilan ${letter}`} name={`penghasilan${letter}`} value={formData.dataDasar[`penghasilan${letter}`]} onChange={handleDataDasarChange} options={SUMBER_PENGHASILAN_OPTIONS} />
                <NumberField label="Persentase" name={`penghasilan${letter}Persen`} value={formData.dataDasar[`penghasilan${letter}Persen`]} onChange={handleDataDasarChange} suffix="%" />
              </div>
            ))}

            <SubHeading>Curah Hujan Rata-Rata</SubHeading>
            <div className="full-width">
              <button type="button" className="btn btn-secondary" onClick={handleFetchWeather} disabled={isFetchingWeather} style={{ marginBottom: '1rem', padding: '6px 12px', fontSize: '0.9rem' }}>
                {isFetchingWeather ? 'Menarik data...' : '☁️ Tarik Data Iklim Otomatis dari Open-Meteo'}
              </button>
            </div>
            <div className="form-group">
              <label>Curah Hujan Tahunan (Kalkulasi Otomatis) (mm/tahun)</label>
              <input type="number" readOnly value={getCurahTahunan()} style={{ backgroundColor: '#f0f0f0' }} />
            </div>
            <div className="full-width monthly-grid">
              <h4 className="monthly-title">Curah Hujan Bulanan (mm/bulan)</h4>
              <div className="monthly-fields">
                {MONTH_KEYS.map((m, i) => (
                  <NumberField key={m} label={BULAN[i]} name={`curah${m}`} value={formData.dataDasar[`curah${m}`]} onChange={handleDataDasarChange} />
                ))}
              </div>
            </div>
            <SelectField label="Sumber Data Curah Hujan" name="sumberDataCurah" value={formData.dataDasar.sumberDataCurah} onChange={handleDataDasarChange} options={SUMBER_DATA_OPTIONS} fullWidth />

            <SubHeading>Suhu Rata-Rata</SubHeading>
            <div className="form-group">
              <label>Suhu Tahunan (Kalkulasi Otomatis) (°C)</label>
              <input type="number" readOnly value={getSuhuTahunan()} style={{ backgroundColor: '#f0f0f0' }} />
            </div>
            <div className="full-width monthly-grid">
              <h4 className="monthly-title">Suhu Bulanan (°C)</h4>
              <div className="monthly-fields">
                {MONTH_KEYS.map((m, i) => (
                  <NumberField key={m} label={BULAN[i]} name={`suhu${m}`} value={formData.dataDasar[`suhu${m}`]} onChange={handleDataDasarChange} />
                ))}
              </div>
            </div>
            <SelectField label="Sumber Data Suhu" name="sumberDataSuhu" value={formData.dataDasar.sumberDataSuhu} onChange={handleDataDasarChange} options={SUMBER_DATA_OPTIONS} fullWidth />
          </div>
        </div>
      )}

      {/* STEP 4: INFORMASI TERKAIT PI */}
      {step === 4 && (
        <div className="form-section">
          <h2 className="form-title">Informasi Terkait PI</h2>
          <div className="form-grid">
            <SubHeading>Tingkat Kerentanan dan Indeks</SubHeading>
            <SelectField label="Tingkat Kerentanan (SIDIK)" name="tingkatKerentanan" value={formData.informasiPI.tingkatKerentanan} onChange={handleInformasiPIChange} options={TINGKAT_KERENTANAN_OPTIONS} />
            <NumberField label="Nilai IKA" name="nilaiIKA" value={formData.informasiPI.nilaiIKA} onChange={handleInformasiPIChange} />
            <NumberField label="Nilai IKS" name="nilaiIKS" value={formData.informasiPI.nilaiIKS} onChange={handleInformasiPIChange} />

            <SubHeading>Perubahan dalam 5 Tahun Terakhir</SubHeading>
            <p className="form-hint">Pilih tingkat kejadian dan isi keterangan untuk setiap indikator.</p>
            {PERUBAHAN_ITEMS.map(item => {
              const L = item.id.toUpperCase();
              return (
                <div className="field-pair full-width" key={item.id}>
                  <SelectField label={item.label} name={`perubahan${L}_T`} value={formData.informasiPI[`perubahan${L}_T`]} onChange={handleInformasiPIChange} options={TINGKAT_KEJADIAN_OPTIONS} />
                  <div className="form-group flex-grow"><label>Keterangan</label><input type="text" name={`perubahan${L}_K`} value={formData.informasiPI[`perubahan${L}_K`]} onChange={handleInformasiPIChange} /></div>
                </div>
              );
            })}

            <SubHeading>Fungsi Sumber Air</SubHeading>
            {AIR_ITEMS.map(item => {
              const L = item.id.toUpperCase();
              return (
                <div className="field-pair full-width" key={item.id}>
                  <SelectField label={item.label} name={`air${L}_F`} value={formData.informasiPI[`air${L}_F`]} onChange={handleInformasiPIChange} options={FUNGSI_SUMBER_AIR_OPTIONS} />
                  <div className="form-group flex-grow"><label>Keterangan</label><input type="text" name={`air${L}_K`} value={formData.informasiPI[`air${L}_K`]} onChange={handleInformasiPIChange} /></div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 5: ADAPTASI PI */}
      {step === 5 && (
        <div className="form-section">
          <h2 className="form-title">Adaptasi PI</h2>
          <TableForm
            sections={formData.adaptasi.sections}
            sectionsMeta={ADAPTASI_SECTIONS_META}
            fields={ADAPTASI_FIELDS}
            onChange={(secKey, idx, field, val) => handleTableChange('adaptasi', secKey, idx, field, val)}
            onAddRow={(secKey) => handleAddTableRow('adaptasi', secKey, emptyAdaptasiRow)}
            onRemoveRow={(secKey, idx) => handleRemoveTableRow('adaptasi', secKey, idx)}
          />
        </div>
      )}

      {/* STEP 6: MITIGASI PI */}
      {step === 6 && (
        <div className="form-section">
          <h2 className="form-title">Mitigasi PI</h2>
          <TableForm
            sections={formData.mitigasi.sections}
            sectionsMeta={MITIGASI_SECTIONS_META}
            fields={ADAPTASI_FIELDS}
            onChange={(secKey, idx, field, val) => handleTableChange('mitigasi', secKey, idx, field, val)}
            onAddRow={(secKey) => handleAddTableRow('mitigasi', secKey, emptyAdaptasiRow)}
            onRemoveRow={(secKey, idx) => handleRemoveTableRow('mitigasi', secKey, idx)}
          />
        </div>
      )}

      {/* STEP 7: KEL-MASYARAKAT */}
      {step === 7 && (
        <div className="form-section">
          <h2 className="form-title">Kelembagaan Masyarakat</h2>
          <TableForm
            sections={formData.kelMasyarakat.sections}
            sectionsMeta={KEL_SECTIONS_META}
            fields={KEL_FIELDS}
            onChange={(secKey, idx, field, val) => handleTableChange('kelMasyarakat', secKey, idx, field, val)}
            onAddRow={(secKey) => handleAddTableRow('kelMasyarakat', secKey, emptyKelRow)}
            onRemoveRow={(secKey, idx) => handleRemoveTableRow('kelMasyarakat', secKey, idx)}
          />
        </div>
      )}

      <div className="button-container">
        {step > 1 ? (
          <button className="btn btn-secondary" onClick={prevStep}>Kembali</button>
        ) : (
          <div></div>
        )}
        {step < STEPS.length ? (
          <button className="btn btn-primary" onClick={nextStep}>Selanjutnya</button>
        ) : (
          <button className="btn btn-primary" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? 'Memproses...' : 'Download Excel'}
          </button>
        )}
      </div>

      {isSuccess && (
        <div className="generate-status">Berhasil! File Excel telah diunduh dengan rumus yang utuh.</div>
      )}
    </div>
  );
}

export default App;