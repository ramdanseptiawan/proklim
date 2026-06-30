import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// ---- Helper: convert string to number if it looks numeric ----
const toNumber = (val) => {
  if (val === undefined || val === null || val === '') return undefined;
  const num = Number(val);
  return isNaN(num) ? val : num;
};

// ---- Numeric field keys (flat sheets) that must be written as numbers ----
const NUMERIC_FIELDS_DATA_DASAR = new Set([
  'luasLokasi', 'jumlahKK', 'jumlahPenduduk', 'elevasi',
  'lahanAPersen', 'lahanBPersen', 'lahanCPersen',
  'penghasilanAPersen', 'penghasilanBPersen', 'penghasilanCPersen',
  'curahHujanTahunan',
  'curahJan', 'curahFeb', 'curahMar', 'curahApr', 'curahMei', 'curahJun',
  'curahJul', 'curahAgu', 'curahSep', 'curahOkt', 'curahNov', 'curahDes',
  'suhuTahunan',
  'suhuJan', 'suhuFeb', 'suhuMar', 'suhuApr', 'suhuMei', 'suhuJun',
  'suhuJul', 'suhuAgu', 'suhuSep', 'suhuOkt', 'suhuNov', 'suhuDes',
]);

const NUMERIC_FIELDS_INFORMASI_PI = new Set([
  'nilaiIKA', 'nilaiIKS',
]);

// Table numeric columns for ADAPTASI / MITIGASI
const NUMERIC_TABLE_FIELDS = new Set([
  'jumlah', 'penerimaKK', 'terdampakKK',
]);

// Field mapping configuration: { sheetName: { stateKey: 'CELL' } }
const fieldMappings = {
  'ID-PENGISI': {
    namaLengkap: 'J10',
    jabatan: 'J12',
    jalan: 'J17',
    desaKel: 'J20',
    kecamatan: 'J22',
    kotaKab: 'J24',
    provinsi: 'J26',
    noTelp: 'J28',
    email: 'J30'
  },
  'ID-LOKASI': {
    dusun: 'I12',
    desa: 'I14',
    kecamatan: 'I16',
    kotaKab: 'I18',
    provinsi: 'I20',
    website: 'I22',
    emailLokasi: 'I24',
    naraNama: 'I28',
    naraAlamat: 'I30',
    naraTelp: 'I33',
    naraEmail: 'I35',
    naraInstitusi: 'I37',
    naraJabatan: 'I39'
  },
  // DATA DASAR - basic location/demographic/climate data
  'DATA DASAR': {
    luasLokasi: 'I13',
    jumlahKK: 'I15',
    jumlahPenduduk: 'I17',
    elevasi: 'I19',
    topografi: 'I21',
    tipologi: 'I23',
    ciriKhas: 'I25',
    // Three dominant land uses (type + percentage)
    lahanA: 'I29', lahanAPersen: 'N29',
    lahanB: 'I31', lahanBPersen: 'N31',
    lahanC: 'I33', lahanCPersen: 'N33',
    // Three main income sources (type + percentage)
    penghasilanA: 'I37', penghasilanAPersen: 'N37',
    penghasilanB: 'I39', penghasilanBPersen: 'N39',
    penghasilanC: 'I41', penghasilanCPersen: 'N41',
    // Rainfall
    curahHujanTahunan: 'I45',
    curahJan: 'I49', curahFeb: 'I51', curahMar: 'I53', curahApr: 'I55',
    curahMei: 'I57', curahJun: 'I59', curahJul: 'I61', curahAgu: 'I63',
    curahSep: 'I65', curahOkt: 'I67', curahNov: 'I69', curahDes: 'I71',
    sumberDataCurah: 'I73',
    // Temperature
    suhuTahunan: 'I78',
    suhuJan: 'I82', suhuFeb: 'I84', suhuMar: 'I86', suhuApr: 'I88',
    suhuMei: 'I90', suhuJun: 'I92', suhuJul: 'I94', suhuAgu: 'I96',
    suhuSep: 'I98', suhuOkt: 'I100', suhuNov: 'I102', suhuDes: 'I104',
    sumberDataSuhu: 'I106'
  },
  // INFORMASI TERKAIT PI - vulnerability index & climate change observations
  'INFORMASI TERKAIT PI': {
    tingkatKerentanan: 'H13',
    nilaiIKA: 'H15',
    nilaiIKS: 'H17',
    // 18 climate-change items (a-r): tingkat kejadian + keterangan
    // Input cells: I (tingkat) + J (keterangan) per row 24-41
    perubahanA_T: 'I24', perubahanA_K: 'J24',
    perubahanB_T: 'I25', perubahanB_K: 'J25',
    perubahanC_T: 'I26', perubahanC_K: 'J26',
    perubahanD_T: 'I27', perubahanD_K: 'J27',
    perubahanE_T: 'I28', perubahanE_K: 'J28',
    perubahanF_T: 'I29', perubahanF_K: 'J29',
    perubahanG_T: 'I30', perubahanG_K: 'J30',
    perubahanH_T: 'I31', perubahanH_K: 'J31',
    perubahanI_T: 'I32', perubahanI_K: 'J32',
    perubahanJ_T: 'I33', perubahanJ_K: 'J33',
    perubahanK_T: 'I34', perubahanK_K: 'J34',
    perubahanL_T: 'I35', perubahanL_K: 'J35',
    perubahanM_T: 'I36', perubahanM_K: 'J36',
    perubahanN_T: 'I37', perubahanN_K: 'J37',
    perubahanO_T: 'I38', perubahanO_K: 'J38',
    perubahanP_T: 'I39', perubahanP_K: 'J39',
    perubahanQ_T: 'I40', perubahanQ_K: 'J40',
    perubahanR_T: 'I41', perubahanR_K: 'J41',
    // 5 water-source-function items (a-e): fungsi + keterangan, rows 46-50
    airA_F: 'I46', airA_K: 'J46',
    airB_F: 'I47', airB_K: 'J47',
    airC_F: 'I48', airC_K: 'J48',
    airD_F: 'I49', airD_K: 'J49',
    airE_F: 'I50', airE_K: 'J50'
  },
  // ADAPTASI PI - adaptation activities table. Column map: J=No,K/L=Komponen,M=Jenis,
  // N=Satuan,O=Jumlah,P=Penerima KK,Q=Terdampak KK,R=Lama,T=Kondisi,U=Uraian
  // Row groups derived from template (rowCount=130). Each entry: array of row maps.
  'ADAPTASI PI': {},
  // MITIGASI PI - mitigation activities table (same structure)
  'MITIGASI PI': {},
  // KEL-MASYARAKAT - community sections. Columns: I=Data, J=Keterangan, K=Bukti
  'KEL-MASYARAKAT': {}
};

// ---- Table-style mappings (row-indexed) for ADAPTASI/MITIGASI/KEL-MASYARAKAT ----
// Each table row maps to a set of columns. We store per-row field keys in the
// formData arrays (e.g., formData.adaptasi.sections[0].rows[i]). At write time
// we walk the row-index arrays below.

// ADAPTASI PI row layout: sections 1-5, each with N component rows.
// Columns: J(No=10), K(11), L(12)=Komponen merged, M(13)=Jenis Kegiatan,
// N(14)=Satuan, O(15)=Jumlah, P(16)=Penerima KK, Q(17)=Terdampak KK,
// R(18)=Lama Kegiatan, T(20)=Kondisi, U(21)=Uraian/Bukti
// Note: gap columns S(19) and beyond are non-input.
const ADAPTASI_COLUMNS = {
  no: 10,        // J
  jenisKegiatan: 13, // M
  satuan: 14,    // N
  jumlah: 15,    // O
  penerimaKK: 16,// P
  terdampakKK: 17,// Q
  lamaKegiatan: 18,// R
  kondisi: 20,   // T
  uraian: 21     // U
};
// Section start rows (header rows omitted; data rows start below). These match
// the template's section 1..5 layout. Each section has up to 8 component rows
// with a 2-row stride (label row + input row pattern) — but the input row is
// the one we write to. Using the first data row of each section and a stride of 1
// since the template exposes one input row per component line. Adjusted to known
// data rows 25,26,... for section 1 and similar for others.
const ADAPTASI_SECTION_ROWS = {
  // sectionKey: [row, row, ...] for each component in that section
  1: [25, 26, 27, 28, 29, 30, 31, 32],      // Pengendalian Kekeringan (8 rows)
  2: [34, 35, 36, 37, 38, 39, 40, 41],      // Pengendalian Banjir
  3: [43, 44, 45, 46, 47, 48, 49, 50],      // Pengendalian Longsor
  4: [52, 53, 54, 55, 56, 57, 58, 59],      // Pengendalian Gelombang/Pasang
  5: [61, 62, 63, 64, 65, 66, 67, 68]       // Pengendalian Kebakaran
};

// MITIGASI PI — same column structure; row groups differ.
const MITIGASI_COLUMNS = { ...ADAPTASI_COLUMNS };
const MITIGASI_SECTION_ROWS = {
  1: [25, 26, 27, 28, 29, 30, 31, 32],
  2: [34, 35, 36, 37, 38, 39, 40, 41],
  3: [43, 44, 45, 46, 47, 48, 49, 50],
  4: [52, 53, 54, 55, 56, 57, 58, 59]
};

// KEL-MASYARAKAT row layout: columns I(9)=Data, J(10)=Keterangan, K(11)=Bukti
const KEL_COLUMNS = { data: 9, keterangan: 10, bukti: 11 };
// 8 sections with their item rows (from template, rows 12-130)
const KEL_SECTION_ROWS = {
  1: [12, 13, 14, 15],          // Kelembagaan Masyarakat
  2: [17, 18, 19, 20],          // Dukungan Kebijakan
  3: [22, 23, 24, 25],          // Partisipasi Masyarakat
  4: [27, 28, 29, 30, 31],      // Kapasitas Masyarakat
  5: [33, 34, 35],              // Dukungan Sumberdaya Eksternal
  6: [37, 38, 39, 40],          // Pengembangan Kegiatan
  7: [42, 43, 44, 45],          // Pengelolaan Data Aksi
  8: [47, 48, 49, 50, 51, 52]   // Manfaat Ekonomi/Sosial/Lingkungan
};

// Generic sheet populator for flat key->cell mappings
// numericFields: optional Set of field keys to convert to number before writing
const populateSheet = (sheet, mapping, data, numericFields = null) => {
  if (!sheet || !data) return;
  Object.keys(mapping).forEach(key => {
    const rawVal = data[key];
    if (rawVal === undefined || rawVal === null || rawVal === '') return;
    // Convert to number if this field expects numeric values
    const val = numericFields?.has(key) ? toNumber(rawVal) : rawVal;
    // Only write if we got a valid value back (toNumber returns undefined for empty)
    if (val !== undefined) {
      // Preserve cell style: only set value, never touch style properties
      sheet.getCell(mapping[key]).value = val;
    }
  });
};

// Table populator: walks formData[sectionKey].rows array and writes each row's
// fields into the corresponding template row at the mapped column.
// Includes auto-numbering of the "No" column and numeric field conversion.
const populateTableSheet = (sheet, columns, sectionRows, sectionsData) => {
  if (!sheet || !sectionsData) return;
  // Keep a running counter across all sections for auto-numbering
  let globalRowNum = 0;
  Object.keys(sectionsData).forEach(secKey => {
    const rows = sectionsData[secKey]?.rows || [];
    const targetRows = sectionRows[secKey] || [];
    rows.forEach((rowData, idx) => {
      const rowNum = targetRows[idx];
      if (!rowNum) return;

      // Auto-number: write sequential number to "No" column (col 10 = J)
      globalRowNum++;
      if (columns.no !== undefined) {
        sheet.getRow(rowNum).getCell(columns.no).value = globalRowNum;
      }

      // Write data fields
      Object.keys(rowData).forEach(field => {
        const rawVal = rowData[field];
        const col = columns[field];
        if (col !== undefined && rawVal !== undefined && rawVal !== null && rawVal !== '') {
          // Convert numeric fields to actual numbers to preserve number formatting
          const val = NUMERIC_TABLE_FIELDS.has(field) ? toNumber(rawVal) : rawVal;
          if (val !== undefined) {
            // Preserve cell style: only set value
            sheet.getRow(rowNum).getCell(col).value = val;
          }
        }
      });
    });
  });
};

// Helper: attempt to write buffer, falling back to clearing conditional formattings
// if ExcelJS renderExpression bug is hit.
const safeWriteBuffer = async (workbook) => {
  try {
    return await workbook.xlsx.writeBuffer();
  } catch (e) {
    // ExcelJS ≤4.4.0 can crash on renderExpression for certain conditional-formatting
    // rules with missing formula data. Fall back: clear all CF and retry once.
    if (
      e.message &&
      (e.message.includes('renderExpression') || e.message.includes('formula'))
    ) {
      console.warn('Conditional formatting render error, retrying without CF...');
      workbook.worksheets.forEach(ws => {
        ws.conditionalFormattings = [];
      });
      return await workbook.xlsx.writeBuffer();
    }
    throw e;
  }
};

export const generateExcel = async (formData) => {
  try {
    // Cache-busting to avoid Vercel CDN returning 304 (Not Modified) with empty body
    const response = await fetch(`/template.xlsx?t=${Date.now()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch template: ${response.status} ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    // Flat-mapped sheets (pass numeric field sets for proper type conversion)
    populateSheet(workbook.getWorksheet('ID-PENGISI'), fieldMappings['ID-PENGISI'], formData.pengisi);
    populateSheet(workbook.getWorksheet('ID-LOKASI'), fieldMappings['ID-LOKASI'], formData.lokasi);
    populateSheet(workbook.getWorksheet('DATA DASAR'), fieldMappings['DATA DASAR'], formData.dataDasar, NUMERIC_FIELDS_DATA_DASAR);
    populateSheet(workbook.getWorksheet('INFORMASI TERKAIT PI'), fieldMappings['INFORMASI TERKAIT PI'], formData.informasiPI, NUMERIC_FIELDS_INFORMASI_PI);

    // Table-mapped sheets (auto-numbering + numeric conversion built in)
    if (formData.adaptasi?.sections) {
      populateTableSheet(
        workbook.getWorksheet('ADAPTASI PI'),
        ADAPTASI_COLUMNS,
        ADAPTASI_SECTION_ROWS,
        formData.adaptasi.sections
      );
    }
    if (formData.mitigasi?.sections) {
      populateTableSheet(
        workbook.getWorksheet('MITIGASI PI'),
        MITIGASI_COLUMNS,
        MITIGASI_SECTION_ROWS,
        formData.mitigasi.sections
      );
    }
    if (formData.kelMasyarakat?.sections) {
      populateTableSheet(
        workbook.getWorksheet('KEL-MASYARAKAT'),
        KEL_COLUMNS,
        KEL_SECTION_ROWS,
        formData.kelMasyarakat.sections
      );
    }

    // Write buffer — preserves conditional formatting unless ExcelJS bug forces fallback
    const buffer = await safeWriteBuffer(workbook);
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'ProKlim_Filled.xlsx');

    return true;
  } catch (error) {
    console.error('Error generating Excel file:', error);
    return false;
  }
};