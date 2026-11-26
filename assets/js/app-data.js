// Workspace content for every app (feature groups → module pages) and the
// dummy records the module pages work with. Loaded after apps.js.

/* ---------- Workspaces ---------------------------------------------------- */

// Tabs shown above the feature groups; each feature belongs to one.
const WORKSPACE_TABS = {
  penilaian:    'Penilaian',
  kalibrasi:    'Kalibrasi',
  repository:   'Repository',
  monitoring:   'Monitoring',
  administrasi: 'Administrasi',
};

const feat = (name, desc, icon, tab, module) => ({ name, desc, icon, tab, module });

const WORKSPACES = {
  bbap: {
    stats: [['248', 'peserta aktif'], ['36', 'menunggu penilaian'], ['4', 'sesi kalibrasi']],
    groups: [
      { title: 'Penilaian & Kalibrasi', features: [
        feat('Penilaian BBAP',   'Kelola dan isi penilaian peserta', 'icon-clip-feature', 'penilaian',  'penilaian'),
        feat('Kalibrasi BBAP',   'Sesi kalibrasi hasil penilaian',   'icon-sliders',      'kalibrasi',  'kalibrasi'),
        feat('Repository BBAP',  'Arsip hasil & dokumen assessment', 'icon-folder',       'repository', 'repository'),
        feat('Lampiran Peserta', 'Dokumen pendukung tiap peserta',   'icon-paperclip',    'repository', 'lampiran'),
      ]},
      { title: 'Administrasi', features: [
        feat('Data Peserta',      'Kelola peserta & batch',       'icon-users',        'administrasi', 'peserta'),
        feat('Kompetensi',        'Kamus dan level kompetensi',   'icon-list-feature', 'administrasi', 'kompetensi'),
        feat('Jabatan & Formasi', 'Struktur jabatan dan formasi', 'icon-org',          'administrasi', 'jabatan'),
        feat('Kelola Pengguna',   'Akses & peran pengguna',       'icon-user-cog',     'administrasi', 'pengguna'),
      ]},
    ],
  },
  bflp: {
    stats: [['412', 'kandidat'], ['58', 'menunggu penilaian'], ['6', 'formasi dibuka']],
    groups: [
      { title: 'Rekrutmen & Penilaian', features: [
        feat('Penilaian Kandidat', 'Isi penilaian kompetensi kandidat', 'icon-clip-feature', 'penilaian',  'penilaian'),
        feat('Kalibrasi BFLP',     'Samakan hasil antar asesor',        'icon-sliders',      'kalibrasi',  'kalibrasi'),
        feat('Repository BFLP',    'Arsip hasil assessment kandidat',   'icon-folder',       'repository', 'repository'),
        feat('Monitoring Proses',  'Pantau tahap tiap kandidat',        'icon-activity',     'monitoring', 'monitoring'),
      ]},
      { title: 'Administrasi', features: [
        feat('Data Kandidat',   'Kelola kandidat & batch',     'icon-users',        'administrasi', 'peserta'),
        feat('Formasi Jabatan', 'Kebutuhan formasi per unit',  'icon-org',          'administrasi', 'jabatan'),
        feat('Kompetensi',      'Kamus kompetensi rekrutmen',  'icon-list-feature', 'administrasi', 'kompetensi'),
        feat('Kelola Pengguna', 'Akses & peran pengguna',      'icon-user-cog',     'administrasi', 'pengguna'),
      ]},
    ],
  },
  capacity: {
    stats: [['1.204', 'talenta'], ['87', 'dinilai bulan ini'], ['SSO', 'aplikasi terhubung']],
    groups: [
      { title: 'Talent Capacity', features: [
        feat('Penilaian Capacity', 'Ukur kapasitas & potensi talenta', 'icon-gauge',     'penilaian',  'penilaian'),
        feat('Laporan Capacity',   'Arsip hasil & rekomendasi',        'icon-folder',    'repository', 'repository'),
        feat('Lampiran Talenta',   'Dokumen pendukung talenta',        'icon-paperclip', 'repository', 'lampiran'),
      ]},
      { title: 'Administrasi', features: [
        feat('Data Talenta',    'Kelola talenta & kelompok', 'icon-users',    'administrasi', 'peserta'),
        feat('Kelola Pengguna', 'Akses & peran pengguna',    'icon-user-cog', 'administrasi', 'pengguna'),
      ]},
    ],
  },
  'kalibrasi-bflp': {
    stats: [['3', 'sesi berjalan'], ['126', 'peserta dikalibrasi'], ['18', 'menunggu']],
    groups: [
      { title: 'Kalibrasi', features: [
        feat('Sesi Kalibrasi',    'Kalibrasi hasil penilaian peserta', 'icon-sliders',  'kalibrasi',  'kalibrasi'),
        feat('Hasil Kalibrasi',   'Arsip keputusan kalibrasi',         'icon-folder',   'repository', 'repository'),
        feat('Monitoring Sesi',   'Pantau progres tiap peserta',       'icon-activity', 'monitoring', 'monitoring'),
      ]},
      { title: 'Administrasi', features: [
        feat('Data Peserta',    'Peserta yang dikalibrasi', 'icon-users',    'administrasi', 'peserta'),
        feat('Kelola Pengguna', 'Akses & peran pengguna',   'icon-user-cog', 'administrasi', 'pengguna'),
      ]},
    ],
  },
  'repository-bflp': {
    stats: [['2.318', 'dokumen'], ['200', 'hasil assessment'], ['12', 'diunggah minggu ini']],
    groups: [
      { title: 'Arsip', features: [
        feat('Arsip Hasil BFLP',   'Hasil assessment & rekomendasi', 'icon-archive',   'repository', 'repository'),
        feat('Lampiran Peserta',   'CV, sertifikat & dokumen lain',  'icon-paperclip', 'repository', 'lampiran'),
      ]},
      { title: 'Administrasi', features: [
        feat('Data Peserta',    'Peserta yang diarsipkan', 'icon-users',    'administrasi', 'peserta'),
        feat('Kelola Pengguna', 'Akses & peran pengguna',  'icon-user-cog', 'administrasi', 'pengguna'),
      ]},
    ],
  },
  'repository-spv': {
    stats: [['864', 'dokumen'], ['142', 'supervisor'], ['5', 'diunggah minggu ini']],
    groups: [
      { title: 'Arsip Supervisor', features: [
        feat('Arsip Hasil Supervisor', 'Hasil assessment supervisor', 'icon-folder-user', 'repository', 'repository'),
        feat('Lampiran Supervisor',    'Dokumen pendukung supervisor', 'icon-paperclip',  'repository', 'lampiran'),
      ]},
      { title: 'Administrasi', features: [
        feat('Data Supervisor', 'Kelola data supervisor', 'icon-users',    'administrasi', 'peserta'),
        feat('Kelola Pengguna', 'Akses & peran pengguna', 'icon-user-cog', 'administrasi', 'pengguna'),
      ]},
    ],
  },
  'qa-uko': {
    stats: [['64', 'unit kerja'], ['21', 'menunggu QA'], ['92%', 'skor rata-rata']],
    groups: [
      { title: 'Quality Assurance', features: [
        feat('Penilaian QA',   'Penilaian kualitas unit kerja', 'icon-shield-check', 'penilaian',  'penilaian'),
        feat('Kalibrasi QA',   'Kalibrasi hasil antar penilai', 'icon-sliders',      'kalibrasi',  'kalibrasi'),
        feat('Repository QA',  'Arsip hasil quality assurance', 'icon-folder',       'repository', 'repository'),
      ]},
      { title: 'Administrasi', features: [
        feat('Data Unit Kerja', 'Daftar unit & formasi',  'icon-org',      'administrasi', 'jabatan'),
        feat('Data Pegawai',    'Pegawai yang dinilai',   'icon-users',    'administrasi', 'peserta'),
        feat('Kelola Pengguna', 'Akses & peran pengguna', 'icon-user-cog', 'administrasi', 'pengguna'),
      ]},
    ],
  },
  'monitoring-bflp': {
    stats: [['412', 'kandidat dipantau'], ['73%', 'selesai'], ['9', 'terlambat']],
    groups: [
      { title: 'Monitoring', features: [
        feat('Monitoring Assessment', 'Progres tiap kandidat per tahap', 'icon-activity', 'monitoring', 'monitoring'),
        feat('Repository BFLP',       'Hasil yang sudah final',          'icon-folder',   'repository', 'repository'),
      ]},
      { title: 'Administrasi', features: [
        feat('Data Kandidat',   'Kandidat yang dipantau', 'icon-users',    'administrasi', 'peserta'),
        feat('Kelola Pengguna', 'Akses & peran pengguna', 'icon-user-cog', 'administrasi', 'pengguna'),
      ]},
    ],
  },
};

const featureFor = (appId, module) =>
  WORKSPACES[appId]?.groups.flatMap(g => g.features).find(ft => ft.module === module);

const moduleUrl = (appId, module) => `module.html?app=${appId}&m=${module}`;

/* ---------- Dummy records ------------------------------------------------- */

// Small seeded PRNG so every visit shows the same data.
function seeded(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const PEOPLE_NAMES = [
  'Titin Suhartini', 'Laurenzius Banne', 'Muhammad Ikhsan', 'Dewa Gede S. Putra', 'Clara Ziegler', 'Michael Chen',
  'Sofia Patel', "Liam O'Connor", 'Aisha Khan', 'Aiden Smith', 'Maya Johnson', 'Aidan Adams', 'Lila Bennett',
  'Marcus Chan', 'Nina Karelia Wijaya', 'Nofia Wang', 'Reni Kalista Situmorang', 'Rudi Tampubolon',
  'Okta Nandiana Wijaya', 'Olivia Brown', 'Ayu Lestari', 'Bagus Pratama', 'Citra Maharani', 'Dimas Anggara',
  'Eka Saputri', 'Fajar Nugroho', 'Gita Permata', 'Hendra Wijaya', 'Indah Puspita', 'Joko Susilo',
  'Kartika Sari', 'Lukman Hakim', 'Mega Ananda', 'Nanda Rizky', 'Oktaviani Putri', 'Putu Ardana',
  'Raka Mahendra', 'Salsabila Zahra', 'Teguh Santoso', 'Utari Dewi', 'Vino Bastian', 'Wulan Sari',
];
const UNITS = ['Kantor Pusat', 'Regional Office Bandung', 'Regional Office Jakarta 3', 'Regional Office Surabaya',
  'Regional Office Medan', 'Branch Office Bali', 'Divisi Keuangan', 'Divisi SDM', 'Divisi IT', 'Divisi Hukum'];
const POSITIONS = ['Officer - Sales Force Team', 'Relationship Manager', 'Universal Banker Leader', 'Analis Kredit',
  'Supervisor Operasional', 'Staff Compliance', 'Account Officer', 'Customer Service Leader'];
const BATCHES = ['Batch Oktober 2026', 'Batch September 2026', 'Batch Agustus 2026'];

const pad = (n, len) => String(n).padStart(len, '0');
const fmtDate = d => `${pad(d.getDate(), 2)}/${pad(d.getMonth() + 1, 2)}/${d.getFullYear()}`;

// One shared roster of employees; modules pick the fields they need.
const PEOPLE = (() => {
  const rnd = seeded(762);
  return PEOPLE_NAMES.map((name, i) => {
    const jg = 5 + Math.floor(rnd() * 13);
    const pg = 1 + Math.floor(rnd() * 9);
    const day = new Date(2026, 9, 28 - Math.floor(rnd() * 80));
    return {
      name,
      pn: pad(i === 0 ? 762 : 600 + Math.floor(rnd() * 900), 8),
      jgpg: `JG${pad(jg, 2)}/PG${pad(pg, 2)}`,
      unit: i === 0 ? 'Regional Office Bandung' : UNITS[Math.floor(rnd() * UNITS.length)],
      position: i === 0 ? 'Officer - Sales Force Team' : POSITIONS[Math.floor(rnd() * POSITIONS.length)],
      batch: BATCHES[Math.floor(rnd() * BATCHES.length)],
      date: fmtDate(day),
      r: rnd(),
    };
  });
})();

const ASSESSOR = { name: 'Evita Meliasari', position: 'RM SME Type A' };

/* ---------- Competency dictionary (Penilaian & Kalibrasi) ----------------- */

const COMPETENCIES = {
  soft: [
    { code: 'AOR', name: 'Achievement Orientation',      req: 3, indicator: 'Keinginan untuk bekerja dengan baik atau melampaui standar keunggulan.' },
    { code: 'ADA', name: 'Adaptability',                 req: 2, indicator: 'Mampu beradaptasi dan bekerja secara efektif dalam berbagai situasi atau perspektif yang berbeda.' },
    { code: 'CSO', name: 'Customer Service Orientation', req: 3, indicator: 'Memahami dunia dari sudut pandang pelanggan ("dari dalam ke luar").' },
    { code: 'DDR', name: 'Data Driven',                  req: 2, indicator: 'Berorientasi terhadap data dan menganalisa masalah sebagai landasan data.' },
    { code: 'DLI', name: 'Digital Literacy',             req: 3, indicator: 'Mengadopsi teknologi untuk menyelesaikan permasalahan atau situasi yang dihadapi.' },
    { code: 'COA', name: 'Concern of Order & Accuracy',  req: 2, indicator: 'Kemampuan untuk mengurangi kesalahan, ketidaksesuaian dan kepastian dalam lingkungan kerja yang berhubungan dengan standar, aturan, dan prosedur.' },
    { code: 'ATH', name: 'Analytical Thinking',          req: 3, indicator: 'Memecah masalah menjadi bagian-bagian kecil dan melihat hubungan sebab-akibat.' },
    { code: 'ISE', name: 'Information Seeking',          req: 1, indicator: 'Kemampuan untuk mencari informasi dan mengembangkan sistem dan jaringan untuk mengumpulkan informasi yang relevan, tepat waktu, dan akurat.' },
  ],
  hard: [
    { code: 'CRA', name: 'Credit Risk Analysis',          req: 3, indicator: 'Menganalisis kelayakan kredit nasabah berdasarkan data keuangan dan non-keuangan.' },
    { code: 'RCM', name: 'Regulatory Compliance',         req: 3, indicator: 'Memastikan setiap proses sesuai ketentuan regulator dan kebijakan internal.' },
    { code: 'PKN', name: 'Product Knowledge',             req: 2, indicator: 'Menguasai fitur, manfaat, dan risiko produk mikro & ritel.' },
    { code: 'FSA', name: 'Financial Statement Analysis',  req: 3, indicator: 'Membaca dan menafsirkan laporan keuangan untuk pengambilan keputusan.' },
    { code: 'RMT', name: 'Risk Mitigation',               req: 2, indicator: 'Menyusun langkah mitigasi atas risiko yang teridentifikasi.' },
    { code: 'SPM', name: 'Sales Process Management',      req: 2, indicator: 'Mengelola pipeline penjualan dari prospek hingga closing.' },
  ],
};

const FORM_TYPES = { soft: 'Soft Competency', hard: 'Hard Competency' };

const NORMS = [
  { title: 'Good', tone: 'good', points: [
    'Memenuhi seluruh kompetensi yang dipersyaratkan, atau',
    'Terdapat maksimal 1 kompetensi dengan gap (-1) pada kompetensi inti, atau',
    'Terdapat maksimal 1 kompetensi dengan gap (-1) pada kompetensi spesifik dan tidak terdapat gap pada kompetensi inti.',
  ]},
  { title: 'Fit', tone: 'fit', points: [
    'Terdapat maksimal 1 kompetensi dengan gap (-1) pada kompetensi inti dan maksimal 2 kompetensi dengan gap (-1) pada kompetensi spesifik, atau',
    'Terdapat maksimal 2 kompetensi dengan gap (-1) pada kompetensi inti dan maksimal 1 kompetensi dengan gap (-1) pada kompetensi spesifik.',
  ]},
  { title: 'Need Improvement', tone: 'need', points: [
    'Terdapat kompetensi dengan gap (-2), atau',
    'Terdapat lebih dari 2 kompetensi dengan gap (-1) pada kompetensi inti, atau',
    'Terdapat lebih dari 3 kompetensi dengan gap (-1).',
  ]},
];

// Result from the gaps of a filled form (simplified norm for the mockup).
function normFromGaps(gaps) {
  if (gaps.some(g => g <= -2)) return 'Need Improvement';
  const minusOne = gaps.filter(g => g === -1).length;
  if (minusOne <= 1) return 'Good';
  if (minusOne <= 3) return 'Fit';
  return 'Need Improvement';
}

/* ---------- Module access list (Kelola Pengguna) -------------------------- */

const MODULE_ACCESS = [
  { group: 'Assessment', items: ['Forms Penilaian SME', 'Assessment MOL', 'Assessment MRR', 'Study Case', 'Assessment New', 'Assessment PBM', 'POC Kepala Unit', 'Forms Penilaian CBM', 'Assessment RM Medium', 'Assessment UAI', 'Assessment POC', 'Assessment Dynamis'] },
  { group: 'Kalibrasi',  items: ['Kalibrasi CBM', 'Kalibrasi POC', 'Kalibrasi POC KAUNIT', 'Kalibrasi MRR', 'Kalibrasi UAJ', 'Kalibrasi PBM', 'Kalibrasi RM Medium', 'Kalibrasi Dynamis'] },
  { group: 'Repository', items: ['Repository RM', 'Repository RM Medium', 'Repository MOL', 'Repository Konseling', 'Repository CBM', 'Repository Dynamis', 'Repository MRR', 'Repository', 'Repository PBM', 'Repository UAI'] },
  { group: 'Konseling',  items: ['Konseling'] },
];

/* ---------- Local persistence (per viewer, best effort) ------------------- */

const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(`evalio:${key}`); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(`evalio:${key}`, JSON.stringify(value)); } catch {}
  },
};
