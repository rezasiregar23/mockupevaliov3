// Module pages opened from an app's feature cards: data tables with filters,
// sorting, paging, add/edit/delete and export, plus the Penilaian and
// Kalibrasi assessment flows. Needs apps.js, app-data.js, shell.js, ui.js.

const MOD = PARAMS.get('m') || 'repository';
const FEATURE = featureFor(APP.id, MOD) || { name: 'Modul', desc: '', icon: 'icon-folder' };
const ROOT = document.getElementById('module');
const h = escapeHTML;

document.title = `${FEATURE.name} — ${APP.name} — EVALIO`;
document.querySelectorAll('[data-module-name]').forEach(el => { el.textContent = FEATURE.name; });
document.querySelectorAll('[data-module-desc]').forEach(el => { el.textContent = FEATURE.desc; });
document.getElementById('module-icon').style.setProperty('--icon', iconURL(FEATURE.icon));

/* ---------- Icons ---------------------------------------------------------- */

const ICONS = {
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6M14 11v6"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  sheet: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5Z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8M10 9h1"/>',
  sort: '<path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/>',
  up: '<path d="m7 14 5-5 5 5"/>', down: '<path d="m7 10 5 5 5-5"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M9.9 4.2A10 10 0 0 1 12 4c7 0 10 8 10 8a13 13 0 0 1-1.7 2.7"/><path d="M6.6 6.6A13 13 0 0 0 2 12s3 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="m2 2 20 20"/><path d="M14.1 14.1a3 3 0 0 1-4.2-4.2"/>',
  spark: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M8 16H3v5"/>',
  calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
};
const ico = (name, cls = 'size-4') =>
  `<svg class="${cls} shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

const today = () => fmtDate(new Date());
const isoToDMY = iso => (iso ? iso.split('-').reverse().join('/') : '');
const dmyToISO = dmy => (dmy ? dmy.split('/').reverse().join('-') : '');
const dmyKey = dmy => dmyToISO(dmy);                          // sortable yyyy-mm-dd
const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/* ---------- Results & badges ---------------------------------------------- */

const KRITERIA = {
  'DIREKOMENDASI':                 'ok',
  'DIREKOMENDASI DENGAN CATATAN':  'warn',
  'TIDAK DIREKOMENDASI':           'bad',
};
const kriteriaFromNorm = norm => ({ Good: 'DIREKOMENDASI', Fit: 'DIREKOMENDASI DENGAN CATATAN' }[norm] || 'TIDAK DIREKOMENDASI');
const badge = (text, tone) => `<span class="md-badge md-badge--${tone}">${h(text)}</span>`;

/* ---------- Table module configs ------------------------------------------ */

const entityFor = {
  peserta: { 'bflp': 'Kandidat', 'monitoring-bflp': 'Kandidat', 'capacity': 'Talenta', 'repository-spv': 'Supervisor', 'qa-uko': 'Pegawai' },
};

function pickPeople(seed, count) {
  const rnd = seeded(seed);
  return PEOPLE.map(p => ({ p, k: rnd() })).sort((a, b) => a.k - b.k).slice(0, count).map(x => x.p);
}
const seedFor = str => [...`${APP.id}:${str}`].reduce((s, c) => (s * 31 + c.charCodeAt(0)) >>> 0, 7);

const TABLES = {
  repository: () => ({
    entity: 'Repository',
    filters: [
      { key: 'q', label: 'Pekerja', type: 'search', placeholder: 'Masukkan Nama atau Personal Number', match: (r, v) => `${r.name} ${r.pn}`.toLowerCase().includes(v.toLowerCase()) },
      { key: 'kriteria', label: 'Hasil Kriteria Akhir', type: 'select', options: [['', 'Semua Rekomendasi'], ...Object.keys(KRITERIA).map(k => [k, k[0] + k.slice(1).toLowerCase()])], match: (r, v) => r.kriteria === v },
      { key: 'periode', label: 'Periode', type: 'date', match: (r, v) => r.periode === isoToDMY(v) },
    ],
    columns: [
      { key: 'name', label: 'Nama', sort: true, render: r => `<span class="font-semibold">${h(r.name)}</span>${r.isNew ? ' ' + badge('Baru', 'info') : ''}` },
      { key: 'pn', label: 'PN', sort: true },
      { key: 'jgpg', label: 'JG/PG' },
      { key: 'unit', label: 'Unit Kerja' },
      { key: 'kriteria', label: 'Kriteria Akhir', render: r => badge(r.kriteria, KRITERIA[r.kriteria]) },
      { key: 'periode', label: 'Periode', sort: true, sortValue: r => dmyKey(r.periode) },
    ],
    rowActions: ['download'],
    exportable: true,
    initialSort: { key: 'periode', dir: -1 },
    rows: () => {
      const rnd = seeded(seedFor('repo'));
      const saved = store.get(`${APP.id}:assessments`, []).map(a => ({ ...a, isNew: true }));
      const base = pickPeople(seedFor('repo-people'), 30).map((p, i) => ({
        id: `r${i}`, name: p.name, pn: p.pn, jgpg: p.jgpg, unit: p.unit,
        kriteria: Object.keys(KRITERIA)[Math.floor(rnd() * 3)],
        periode: fmtDate(new Date(2026, 9, 20 - Math.floor(rnd() * 40))),
      }));
      return [...saved, ...base];
    },
    persist: false,
  }),

  lampiran: () => ({
    entity: 'Dokumen', addLabel: 'Unggah Dokumen',
    filters: [
      { key: 'q', label: 'Peserta', type: 'search', placeholder: 'Cari nama peserta atau dokumen', match: (r, v) => `${r.name} ${r.file}`.toLowerCase().includes(v.toLowerCase()) },
      { key: 'jenis', label: 'Jenis Dokumen', type: 'select', options: [['', 'Semua Jenis'], ...['CV', 'Sertifikat', 'Hasil Psikotes', 'Surat Rekomendasi'].map(v => [v, v])], match: (r, v) => r.jenis === v },
    ],
    columns: [
      { key: 'file', label: 'Dokumen', sort: true, render: r => `<span class="flex items-center gap-2"><span class="grid size-8 place-items-center rounded-lg bg-[var(--c-tag-bg)] text-[var(--c-tile)]">${ico('sheet')}</span><span class="font-semibold">${h(r.file)}</span></span>` },
      { key: 'name', label: 'Peserta', sort: true },
      { key: 'jenis', label: 'Jenis', render: r => badge(r.jenis, 'info') },
      { key: 'size', label: 'Ukuran' },
      { key: 'date', label: 'Diunggah', sort: true, sortValue: r => dmyKey(r.date) },
    ],
    rowActions: ['download', 'delete'],
    form: [
      { key: 'name', label: 'Peserta', type: 'select', required: true, options: PEOPLE.map(p => [p.name, `${p.name} · ${p.pn}`]) },
      { key: 'jenis', label: 'Jenis Dokumen', type: 'select', required: true, options: ['CV', 'Sertifikat', 'Hasil Psikotes', 'Surat Rekomendasi'].map(v => [v, v]) },
      { key: 'upload', label: 'File', type: 'file', required: true, accept: '.pdf,.doc,.docx,.jpg,.png' },
    ],
    onSave: (vals) => ({ name: vals.name, jenis: vals.jenis, file: vals.upload.name, size: vals.upload.size, date: today() }),
    rows: () => {
      const rnd = seeded(seedFor('lampiran'));
      const kinds = ['CV', 'Sertifikat', 'Hasil Psikotes', 'Surat Rekomendasi'];
      return pickPeople(seedFor('lamp-people'), 22).map((p, i) => {
        const jenis = kinds[Math.floor(rnd() * kinds.length)];
        return { id: `l${i}`, name: p.name, jenis, file: `${jenis.replace(/ /g, '_')}_${p.name.split(' ')[0]}.pdf`,
          size: `${(0.2 + rnd() * 3).toFixed(1)} MB`, date: fmtDate(new Date(2026, 9, 25 - Math.floor(rnd() * 50))) };
      });
    },
  }),

  peserta: () => {
    const entity = entityFor.peserta[APP.id] || 'Peserta';
    return {
      entity, addLabel: `Tambah ${entity}`,
      filters: [
        { key: 'q', label: entity, type: 'search', placeholder: 'Masukkan Nama atau Personal Number', match: (r, v) => `${r.name} ${r.pn}`.toLowerCase().includes(v.toLowerCase()) },
        { key: 'batch', label: 'Batch', type: 'select', options: [['', 'Semua Batch'], ...BATCHES.map(b => [b, b])], match: (r, v) => r.batch === v },
        { key: 'status', label: 'Status', type: 'select', options: [['', 'Semua Status'], ['Aktif', 'Aktif'], ['Menunggu', 'Menunggu'], ['Selesai', 'Selesai']], match: (r, v) => r.status === v },
      ],
      columns: [
        { key: 'name', label: 'Nama', sort: true, render: r => `<span class="font-semibold">${h(r.name)}</span>` },
        { key: 'pn', label: 'PN', sort: true },
        { key: 'jgpg', label: 'JG/PG' },
        { key: 'position', label: 'Jabatan' },
        { key: 'unit', label: 'Unit Kerja' },
        { key: 'batch', label: 'Batch' },
        { key: 'status', label: 'Status', render: r => badge(r.status, { Aktif: 'info', Menunggu: 'warn', Selesai: 'ok' }[r.status]) },
      ],
      rowActions: ['edit', 'delete'],
      form: [
        { key: 'name', label: 'Nama Lengkap', type: 'text', required: true, placeholder: 'Contoh: Titin Suhartini' },
        { key: 'pn', label: 'Personal Number', type: 'text', required: true, pattern: /^\d{8}$/, patternMsg: 'PN harus 8 digit angka.', placeholder: '8 digit', half: true },
        { key: 'jgpg', label: 'JG/PG', type: 'text', placeholder: 'JG07/PG08', half: true },
        { key: 'position', label: 'Jabatan', type: 'select', required: true, options: POSITIONS.map(v => [v, v]), half: true },
        { key: 'unit', label: 'Unit Kerja', type: 'select', required: true, options: UNITS.map(v => [v, v]), half: true },
        { key: 'batch', label: 'Batch', type: 'select', required: true, options: BATCHES.map(v => [v, v]), half: true },
        { key: 'status', label: 'Status', type: 'select', required: true, options: [['Aktif', 'Aktif'], ['Menunggu', 'Menunggu'], ['Selesai', 'Selesai']], half: true },
      ],
      rows: () => pickPeople(seedFor('peserta'), 32).map((p, i) => ({
        id: `p${i}`, name: p.name, pn: p.pn, jgpg: p.jgpg, position: p.position, unit: p.unit, batch: p.batch,
        status: p.r < 0.5 ? 'Aktif' : p.r < 0.75 ? 'Menunggu' : 'Selesai',
      })),
    };
  },

  kompetensi: () => ({
    entity: 'Kompetensi', addLabel: 'Tambah Kompetensi',
    filters: [
      { key: 'q', label: 'Kompetensi', type: 'search', placeholder: 'Cari kode atau nama kompetensi', match: (r, v) => `${r.code} ${r.name}`.toLowerCase().includes(v.toLowerCase()) },
      { key: 'jenis', label: 'Jenis', type: 'select', options: [['', 'Semua Jenis'], ['Soft Competency', 'Soft Competency'], ['Hard Competency', 'Hard Competency']], match: (r, v) => r.jenis === v },
    ],
    columns: [
      { key: 'code', label: 'Kode', sort: true, render: r => `<span class="font-bold text-[var(--c-tile)]">${h(r.code)}</span>` },
      { key: 'name', label: 'Nama Kompetensi', sort: true, render: r => `<span class="font-semibold">${h(r.name)}</span>` },
      { key: 'jenis', label: 'Jenis', render: r => badge(r.jenis, r.jenis.startsWith('Soft') ? 'info' : 'muted') },
      { key: 'req', label: 'Syarat Level', sort: true, render: r => `<span class="md-req">Level ${h(r.req)}</span>` },
      { key: 'indicator', label: 'Indikator Perilaku', render: r => `<span class="line-clamp-2 max-w-[420px] text-ink-body">${h(r.indicator)}</span>` },
    ],
    rowActions: ['edit', 'delete'],
    form: [
      { key: 'code', label: 'Kode', type: 'text', required: true, placeholder: 'AOR', half: true, pattern: /^[A-Z]{2,5}$/, patternMsg: 'Kode 2–5 huruf kapital.' },
      { key: 'req', label: 'Syarat Level', type: 'select', required: true, options: [1, 2, 3, 4, 5].map(n => [String(n), `Level ${n}`]), half: true },
      { key: 'name', label: 'Nama Kompetensi', type: 'text', required: true },
      { key: 'jenis', label: 'Jenis', type: 'select', required: true, options: [['Soft Competency', 'Soft Competency'], ['Hard Competency', 'Hard Competency']] },
      { key: 'indicator', label: 'Indikator Perilaku', type: 'textarea', required: true, minLength: 20 },
    ],
    rows: () => [...COMPETENCIES.soft.map(c => ({ ...c, jenis: 'Soft Competency' })), ...COMPETENCIES.hard.map(c => ({ ...c, jenis: 'Hard Competency' }))]
      .map((c, i) => ({ id: `k${i}`, code: c.code, name: c.name, jenis: c.jenis, req: String(c.req), indicator: c.indicator })),
  }),

  jabatan: () => ({
    entity: APP.id === 'qa-uko' ? 'Unit Kerja' : 'Jabatan', addLabel: APP.id === 'qa-uko' ? 'Tambah Unit' : 'Tambah Jabatan',
    filters: [
      { key: 'q', label: 'Jabatan', type: 'search', placeholder: 'Cari jabatan atau kode', match: (r, v) => `${r.code} ${r.position}`.toLowerCase().includes(v.toLowerCase()) },
      { key: 'unit', label: 'Unit Kerja', type: 'select', options: [['', 'Semua Unit'], ...UNITS.map(u => [u, u])], match: (r, v) => r.unit === v },
    ],
    columns: [
      { key: 'code', label: 'Kode', sort: true, render: r => `<span class="font-bold text-[var(--c-tile)]">${h(r.code)}</span>` },
      { key: 'position', label: 'Jabatan', sort: true, render: r => `<span class="font-semibold">${h(r.position)}</span>` },
      { key: 'jgpg', label: 'JG/PG' },
      { key: 'unit', label: 'Unit Kerja' },
      { key: 'filled', label: 'Keterisian', sort: true, sortValue: r => r.filled / r.quota, render: r => {
        const pct = Math.round((r.filled / r.quota) * 100);
        return `<span class="flex min-w-[140px] items-center gap-2"><span class="md-progress flex-1"><span style="width:${Math.min(pct, 100)}%"></span></span><span class="text-xs font-bold text-ink-body">${r.filled}/${r.quota}</span></span>`;
      } },
    ],
    rowActions: ['edit', 'delete'],
    form: [
      { key: 'code', label: 'Kode', type: 'text', required: true, placeholder: 'JBT-001', half: true },
      { key: 'jgpg', label: 'JG/PG', type: 'text', placeholder: 'JG07/PG08', half: true },
      { key: 'position', label: 'Nama Jabatan', type: 'text', required: true },
      { key: 'unit', label: 'Unit Kerja', type: 'select', required: true, options: UNITS.map(u => [u, u]) },
      { key: 'quota', label: 'Formasi', type: 'number', required: true, min: 1, half: true },
      { key: 'filled', label: 'Terisi', type: 'number', required: true, min: 0, half: true },
    ],
    normalize: v => ({ ...v, quota: Number(v.quota), filled: Number(v.filled) }),
    rows: () => {
      const rnd = seeded(seedFor('jabatan'));
      return POSITIONS.flatMap((pos, i) => [0, 1].map(j => {
        const quota = 2 + Math.floor(rnd() * 10);
        return { id: `j${i}${j}`, code: `JBT-${pad(i * 2 + j + 1, 3)}`, position: pos, jgpg: `JG${pad(6 + i, 2)}/PG${pad(2 + j * 3, 2)}`,
          unit: UNITS[Math.floor(rnd() * UNITS.length)], quota, filled: Math.floor(rnd() * (quota + 1)) };
      }));
    },
  }),

  pengguna: () => ({
    entity: 'Admin User', addLabel: 'Tambah User', drawer: 'user',
    filters: [
      { key: 'q', label: 'Pekerja', type: 'search', placeholder: 'Masukkan Nama atau Personal Number', match: (r, v) => `${r.name} ${r.username}`.toLowerCase().includes(v.toLowerCase()) },
      { key: 'tipe', label: 'Tipe Pekerja', type: 'select', options: [['', 'Semua Pekerja'], ['Internal', 'Pekerja Internal'], ['External', 'Pekerja External']], match: (r, v) => r.tipe === v },
      { key: 'joined', label: 'Tanggal Bergabung', type: 'date', match: (r, v) => r.joined === isoToDMY(v) },
    ],
    columns: [
      { key: 'name', label: 'Nama', sort: true, render: r => `<span class="font-semibold">${h(r.name)}</span>` },
      { key: 'username', label: 'Username/PN' },
      { key: 'jgpg', label: 'JG/PG' },
      { key: 'unit', label: 'Unit Kerja' },
      { key: 'tipe', label: 'Tipe Pekerja', render: r => badge(`Pekerja ${r.tipe}`, r.tipe === 'Internal' ? 'ok' : 'warn') },
      { key: 'access', label: 'Akses Modul', render: r => `<span class="text-xs font-semibold text-ink-body">${r.access.length} modul</span>` },
      { key: 'joined', label: 'Tanggal Bergabung', sort: true, sortValue: r => dmyKey(r.joined) },
    ],
    rowActions: ['edit', 'delete'],
    rows: () => {
      const rnd = seeded(seedFor('users'));
      const all = MODULE_ACCESS.flatMap(g => g.items);
      return pickPeople(seedFor('users-people'), 24).map((p, i) => {
        const external = rnd() < 0.3;
        return { id: `u${i}`, name: p.name, tipe: external ? 'External' : 'Internal',
          username: external ? `@${p.name.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '')}` : p.pn,
          jgpg: external ? '-' : p.jgpg, unit: external ? '-' : p.unit, joined: p.date,
          access: all.filter(() => rnd() < 0.25) };
      });
    },
  }),

  monitoring: () => ({
    entity: 'Kandidat',
    filters: [
      { key: 'q', label: 'Kandidat', type: 'search', placeholder: 'Masukkan Nama atau Personal Number', match: (r, v) => `${r.name} ${r.pn}`.toLowerCase().includes(v.toLowerCase()) },
      { key: 'stage', label: 'Tahap', type: 'select', options: [['', 'Semua Tahap'], ...['Administrasi', 'Penilaian', 'Kalibrasi', 'Selesai'].map(s => [s, s])], match: (r, v) => r.stage === v },
      { key: 'late', label: 'Status', type: 'select', options: [['', 'Semua Status'], ['ontrack', 'Sesuai jadwal'], ['late', 'Terlambat']], match: (r, v) => (v === 'late') === r.late },
    ],
    columns: [
      { key: 'name', label: 'Nama', sort: true, render: r => `<span class="font-semibold">${h(r.name)}</span>` },
      { key: 'pn', label: 'PN' },
      { key: 'unit', label: 'Unit Kerja' },
      { key: 'stage', label: 'Tahap', render: r => badge(r.stage, r.stage === 'Selesai' ? 'ok' : 'info') },
      { key: 'progress', label: 'Progres', sort: true, render: r => `<span class="flex min-w-[150px] items-center gap-2"><span class="md-progress flex-1"><span style="width:${r.progress}%"></span></span><span class="w-9 text-right text-xs font-bold text-ink-body">${r.progress}%</span></span>` },
      { key: 'late', label: 'Status', render: r => r.late ? badge('Terlambat', 'bad') : badge('Sesuai jadwal', 'ok') },
      { key: 'updated', label: 'Update Terakhir', sort: true, sortValue: r => dmyKey(r.updated) },
    ],
    rowActions: ['remind'],
    exportable: true,
    rows: () => {
      const rnd = seeded(seedFor('monitor'));
      const stages = ['Administrasi', 'Penilaian', 'Kalibrasi', 'Selesai'];
      return pickPeople(seedFor('mon-people'), 30).map((p, i) => {
        const s = Math.floor(rnd() * 4);
        return { id: `m${i}`, name: p.name, pn: p.pn, unit: p.unit, stage: stages[s],
          progress: s === 3 ? 100 : Math.round((s * 25) + rnd() * 24), late: s < 3 && rnd() < 0.25,
          updated: fmtDate(new Date(2026, 9, 26 - Math.floor(rnd() * 14))) };
      });
    },
    persist: false,
  }),
};

/* ---------- Table engine --------------------------------------------------- */

function tableModule(cfg) {
  const key = `${APP.id}:${MOD}:rows`;
  const persist = cfg.persist !== false;
  let rows = (persist && store.get(key, null)) || cfg.rows();
  const draft = Object.fromEntries((cfg.filters || []).map(fl => [fl.key, '']));
  let applied = { ...draft };
  let sort = cfg.initialSort || { key: null, dir: 1 };
  let page = 1, per = 10, flashId = null;
  const actionsLabel = cfg.rowActions?.length ? 'Aksi' : '';
  const save = () => { if (persist) store.set(key, rows); };

  ROOT.innerHTML = `
    ${cfg.filters ? `
    <form id="filters" class="md-panel grid gap-4 p-5 md:grid-cols-12" novalidate>
      ${cfg.filters.map((fl, i) => `
        <label class="${fl.type === 'search' ? 'md:col-span-6' : 'md:col-span-3'} ${i === 0 ? '' : ''}">
          <span class="md-label">${h(fl.label)}</span>
          ${fl.type === 'select'
            ? `<select name="${fl.key}" class="md-input">${fl.options.map(([v, t]) => `<option value="${h(v)}">${h(t)}</option>`).join('')}</select>`
            : fl.type === 'date'
              ? `<input name="${fl.key}" type="date" class="md-input" />`
              : `<span class="relative block"><span class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--c-tile)]">${ico('user')}</span><input name="${fl.key}" type="search" placeholder="${h(fl.placeholder || '')}" class="md-input pl-10" /></span>`}
        </label>`).join('')}
      <div class="flex items-end justify-end gap-2.5 md:col-span-12">
        <button type="reset" class="md-btn md-btn--ghost">Reset</button>
        <button type="submit" class="md-btn md-btn--primary">Filter</button>
      </div>
    </form>` : ''}
    <section class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-lg font-extrabold text-ink">Daftar ${h(cfg.entity)} <span id="count" class="text-ink-muted"></span></h2>
        <div class="flex flex-wrap gap-2.5">
          ${cfg.exportable ? `<button type="button" data-export class="md-btn md-btn--ghost">${ico('sheet')} Export to Excel</button>` : ''}
          ${cfg.form || cfg.drawer ? `<button type="button" data-add class="md-btn md-btn--primary">${ico(cfg.addLabel?.startsWith('Unggah') ? 'upload' : 'plus')} ${h(cfg.addLabel || 'Tambah')}</button>` : ''}
        </div>
      </div>
      <div class="md-panel overflow-x-auto p-1.5">
        <table class="md-table">
          <thead><tr>
            <th class="w-12">No</th>
            ${cfg.columns.map(c => `<th>${c.sort ? `<button type="button" class="md-sort" data-sort="${c.key}">${h(c.label)} <span data-sort-icon>${ico('sort', 'size-3.5')}</span></button>` : h(c.label)}</th>`).join('')}
            ${actionsLabel ? `<th class="text-center">${actionsLabel}</th>` : ''}
          </tr></thead>
          <tbody id="tbody"></tbody>
        </table>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-3 text-xs text-ink-body">
        <label class="flex items-center gap-2">jumlah per halaman
          <select id="per" class="md-input h-8 w-auto rounded-lg px-2 text-xs">${[10, 25, 50].map(n => `<option>${n}</option>`).join('')}</select>
        </label>
        <nav id="pager" class="flex items-center gap-1" aria-label="Paginasi"></nav>
      </div>
    </section>`;

  const tbody = document.getElementById('tbody');

  function filtered() {
    let list = rows.filter(r => (cfg.filters || []).every(fl => !applied[fl.key] || fl.match(r, applied[fl.key])));
    if (sort.key) {
      const col = cfg.columns.find(c => c.key === sort.key);
      const val = col?.sortValue || (r => r[sort.key]);
      list = [...list].sort((a, b) => {
        const x = val(a), y = val(b);
        return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'id', { numeric: true })) * sort.dir;
      });
    }
    return list;
  }

  function actionButtons(r) {
    const b = {
      download: `<button type="button" data-act="download" data-id="${r.id}" class="md-btn md-btn--soft md-btn--sm">${ico('download', 'size-3.5')} Download</button>`,
      edit:     `<button type="button" data-act="edit" data-id="${r.id}" class="md-btn md-btn--sm bg-[#fff3e0] text-[#b45309] hover:bg-[#ffe6c2]" aria-label="Edit ${h(r.name || r.position || r.code)}">${ico('edit', 'size-3.5')} Edit</button>`,
      delete:   `<button type="button" data-act="delete" data-id="${r.id}" class="md-btn md-btn--sm bg-[#fdecec] text-[#c2261d] hover:bg-[#fbd5d5]" aria-label="Hapus ${h(r.name || r.position || r.code)}">${ico('trash', 'size-3.5')} Hapus</button>`,
      remind:   `<button type="button" data-act="remind" data-id="${r.id}" class="md-btn md-btn--soft md-btn--sm" ${r.stage === 'Selesai' ? 'disabled' : ''}>${ico('bell', 'size-3.5')} Ingatkan</button>`,
    };
    return `<div class="flex justify-center gap-1.5">${cfg.rowActions.map(a => b[a]).join('')}</div>`;
  }

  function render() {
    const list = filtered();
    const pages = Math.max(1, Math.ceil(list.length / per));
    page = Math.min(page, pages);
    const slice = list.slice((page - 1) * per, page * per);
    const span = cfg.columns.length + 1 + (actionsLabel ? 1 : 0);
    tbody.innerHTML = slice.length ? slice.map((r, i) => `
      <tr class="${r.id === flashId ? 'is-new' : ''}">
        <td class="text-ink-muted">${(page - 1) * per + i + 1}</td>
        ${cfg.columns.map(c => `<td class="${c.key === 'name' ? 'whitespace-nowrap' : ''}">${c.render ? c.render(r) : h(r[c.key] ?? '-')}</td>`).join('')}
        ${actionsLabel ? `<td>${actionButtons(r)}</td>` : ''}
      </tr>`).join('')
      : `<tr><td colspan="${span}" class="py-10 text-center text-sm text-ink-body">Tidak ada data yang cocok dengan filter.</td></tr>`;
    flashId = null;
    document.getElementById('count').textContent = `(${list.length})`;

    document.querySelectorAll('[data-sort]').forEach(btn => {
      const active = btn.dataset.sort === sort.key;
      btn.toggleAttribute('data-dir', active);
      btn.querySelector('[data-sort-icon]').innerHTML = ico(active ? (sort.dir === 1 ? 'up' : 'down') : 'sort', 'size-3.5');
      btn.closest('th').setAttribute('aria-sort', active ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none');
    });

    const pager = document.getElementById('pager');
    const nums = [];
    for (let n = 1; n <= pages; n++) if (n === 1 || n === pages || Math.abs(n - page) <= 1) nums.push(n); else if (nums[nums.length - 1] !== '…') nums.push('…');
    pager.innerHTML = `
      <button type="button" class="md-page-btn" data-page="${page - 1}" ${page === 1 ? 'disabled' : ''}>Prev</button>
      ${nums.map(n => n === '…' ? '<span class="px-1">…</span>' : `<button type="button" class="md-page-btn" data-page="${n}" ${n === page ? 'aria-current="page"' : ''}>${n}</button>`).join('')}
      <button type="button" class="md-page-btn" data-page="${page + 1}" ${page === pages ? 'disabled' : ''}>Next</button>`;
  }

  const form = document.getElementById('filters');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    applied = Object.fromEntries(new FormData(form));
    page = 1;
    render();
  });
  form?.addEventListener('reset', () => { applied = { ...draft }; page = 1; setTimeout(render); });

  document.querySelector('thead').addEventListener('click', e => {
    const btn = e.target.closest('[data-sort]');
    if (!btn) return;
    sort = sort.key === btn.dataset.sort ? { key: sort.key, dir: -sort.dir } : { key: btn.dataset.sort, dir: 1 };
    render();
  });
  document.getElementById('pager').addEventListener('click', e => {
    const btn = e.target.closest('[data-page]');
    if (!btn || btn.disabled) return;
    page = Number(btn.dataset.page);
    render();
  });
  document.getElementById('per').addEventListener('change', e => { per = Number(e.target.value); page = 1; render(); });

  document.querySelector('[data-export]')?.addEventListener('click', () => {
    const list = filtered();
    const cols = cfg.columns.filter(c => !['access'].includes(c.key));
    const csv = [cols.map(c => c.label), ...list.map(r => cols.map(c => r[c.key] ?? ''))]
      .map(line => line.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `${FEATURE.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.csv` });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    UI.toast(`${list.length} baris diekspor ke Excel (.csv)`);
  });

  document.querySelector('[data-add]')?.addEventListener('click', () => openForm(null));

  tbody.addEventListener('click', e => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const row = rows.find(r => r.id === btn.dataset.id);
    const label = row.name || row.position || row.code;
    if (btn.dataset.act === 'download') UI.toast(`Mengunduh ${row.file || `laporan ${label}.pdf`}`);
    if (btn.dataset.act === 'remind') {
      UI.toast(`Pengingat terkirim ke ${label}`);
      UI.notify({ title: 'Pengingat terkirim', body: `${label} diingatkan untuk menyelesaikan tahap ${row.stage}.` });
    }
    if (btn.dataset.act === 'edit') openForm(row);
    if (btn.dataset.act === 'delete') confirmDelete(row, label);
  });

  function openForm(row) {
    const onSubmit = values => {
      const data = cfg.normalize ? cfg.normalize(values) : values;
      if (row) {
        Object.assign(row, data);
        flashId = row.id;
        UI.toast(`${cfg.entity} ${values.name || values.position || values.code} berhasil diperbarui`);
      } else {
        const fresh = { id: `n${Date.now()}`, ...(cfg.onSave ? cfg.onSave(data) : data) };
        rows.unshift(fresh);
        flashId = fresh.id;
        sort = { key: null, dir: 1 };
        applied = { ...draft }; form?.reset();
        page = 1;
        UI.toast(`${cfg.entity} ${fresh.name || fresh.position || fresh.code} berhasil ditambahkan`);
      }
      save();
      render();
    };
    if (cfg.drawer === 'user') openUserDrawer(row, onSubmit);
    else openDrawer({ title: row ? `Edit ${cfg.entity}` : (cfg.addLabel || `Tambah ${cfg.entity}`), fields: cfg.form, values: row, submitLabel: row ? 'Simpan Perubahan' : (cfg.addLabel?.startsWith('Unggah') ? 'Unggah' : 'Tambah'), onSubmit });
  }

  function confirmDelete(row, label) {
    const modal = UI.openModal({
      title: `<span class="mb-4 grid size-16 place-items-center rounded-full bg-[#fdecec] text-[#dc2626]">${ico('trash', 'size-7')}</span>Hapus ${h(cfg.entity.toLowerCase())}?`,
      desc: `Tindakan ini akan menghapus <b>${h(label)}</b> secara permanen. Apakah kamu yakin?`,
      body: `<div class="mt-6 flex justify-end gap-2.5">
        <button type="button" data-modal-close class="md-btn md-btn--ghost">Batal</button>
        <button type="button" data-confirm autofocus class="md-btn md-btn--danger">Ya, Hapus</button>
      </div>`,
    });
    modal.el.querySelector('[data-confirm]').addEventListener('click', () => {
      rows = rows.filter(r => r !== row);
      save();
      modal.close();
      render();
      UI.toast(`${label} berhasil dihapus`);
    });
  }

  render();
}

/* ---------- Drawers --------------------------------------------------------- */

function drawerShell(title, bodyHTML, submitLabel) {
  const wrap = document.createElement('div');
  wrap.className = 'md-drawer-wrap';
  wrap.innerHTML = `
    <form class="md-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" novalidate>
      <div class="md-drawer__head">
        <h2 id="drawer-title" class="text-lg font-extrabold">${h(title)}</h2>
        <button type="button" data-close aria-label="Tutup" class="grid size-8 place-items-center rounded-lg text-white/90 transition hover:bg-white/15">${ico('x')}</button>
      </div>
      <div class="flex-1 overflow-y-auto px-6 py-5">${bodyHTML}</div>
      <div class="flex items-center justify-between gap-3 border-t border-line px-6 py-4">
        <p data-form-error class="hidden text-xs font-semibold text-[#dc2626]"></p>
        <div class="ml-auto flex gap-2.5">
          <button type="button" data-close class="md-btn md-btn--ghost">Batal</button>
          <button type="submit" class="md-btn md-btn--primary">${ico(submitLabel.startsWith('Simpan') ? 'check' : submitLabel.startsWith('Unggah') ? 'upload' : 'plus')} ${h(submitLabel)}</button>
        </div>
      </div>
    </form>`;
  const returnFocus = document.activeElement;
  const close = () => { wrap.remove(); document.removeEventListener('keydown', onKey); returnFocus?.focus?.(); };
  const onKey = e => { if (e.key === 'Escape') close(); };
  wrap.addEventListener('click', e => { if (e.target === wrap || e.target.closest('[data-close]')) close(); });
  document.addEventListener('keydown', onKey);
  document.body.append(wrap);
  return { wrap, form: wrap.querySelector('form'), close };
}

function fieldHTML(fl, value) {
  const v = value ?? '';
  const req = fl.required ? '<span class="text-[#dc2626]">*</span>' : '';
  let input;
  if (fl.type === 'select') {
    input = `<select name="${fl.key}" class="md-input"><option value="">Pilih ${h(fl.label.toLowerCase())}</option>${fl.options.map(([ov, t]) => `<option value="${h(ov)}" ${String(ov) === String(v) ? 'selected' : ''}>${h(t)}</option>`).join('')}</select>`;
  } else if (fl.type === 'textarea') {
    input = `<textarea name="${fl.key}" rows="4" class="md-input">${h(v)}</textarea>`;
  } else if (fl.type === 'file') {
    input = `<label class="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[var(--c-border)] bg-[var(--c-tint)] px-4 py-6 text-center transition hover:border-[var(--c-motif)]">
      <span class="grid size-11 place-items-center rounded-xl bg-white text-[var(--c-tile)]">${ico('upload', 'size-5')}</span>
      <span data-file-name class="text-sm font-bold text-ink">Pilih file untuk diunggah</span>
      <span class="text-xs text-ink-body">PDF, DOC, JPG atau PNG · maks. 10 MB</span>
      <input name="${fl.key}" type="file" accept="${fl.accept || ''}" class="sr-only" />
    </label>`;
  } else {
    input = `<input name="${fl.key}" type="${fl.type}" value="${h(v)}" ${fl.min !== undefined ? `min="${fl.min}"` : ''} placeholder="${h(fl.placeholder || '')}" class="md-input" />`;
  }
  return `<div class="${fl.half ? 'col-span-2 sm:col-span-1' : 'col-span-2'}" data-field="${fl.key}"><span class="md-label">${h(fl.label)} ${req}</span>${input}<p class="md-error hidden"></p></div>`;
}

function setError(form, key, msg) {
  const box = form.querySelector(`[data-field="${key}"]`);
  if (!box) return;
  const err = box.querySelector('.md-error');
  err.textContent = msg || '';
  err.classList.toggle('hidden', !msg);
  box.querySelectorAll('.md-input').forEach(i => i.setAttribute('aria-invalid', String(!!msg)));
}

function validateFields(form, fields) {
  const values = {};
  let firstBad = null;
  for (const fl of fields) {
    const el = form.elements[fl.key];
    let val = fl.type === 'file' ? el.files?.[0] : el.value.trim();
    let msg = '';
    if (fl.required && !val) msg = `${fl.label} wajib diisi.`;
    else if (val && fl.pattern && !fl.pattern.test(val)) msg = fl.patternMsg;
    else if (val && fl.minLength && val.length < fl.minLength) msg = `Minimal ${fl.minLength} karakter.`;
    else if (fl.type === 'number' && val !== '' && Number(val) < (fl.min ?? -Infinity)) msg = `Minimal ${fl.min}.`;
    setError(form, fl.key, msg);
    if (msg && !firstBad) firstBad = el;
    if (fl.type === 'file' && val) val = { name: val.name, size: `${(val.size / 1048576).toFixed(1)} MB` };
    values[fl.key] = val;
  }
  return { values, firstBad };
}

function openDrawer({ title, fields, values, submitLabel, onSubmit }) {
  const { form, close } = drawerShell(title, `<div class="grid grid-cols-2 gap-4">${fields.map(fl => fieldHTML(fl, values?.[fl.key])).join('')}</div>`, submitLabel);
  form.querySelectorAll('input[type=file]').forEach(inp => inp.addEventListener('change', () => {
    inp.closest('label').querySelector('[data-file-name]').textContent = inp.files[0]?.name || 'Pilih file untuk diunggah';
  }));
  form.querySelector('.md-input, input')?.focus();
  form.addEventListener('submit', e => {
    e.preventDefault();
    const { values: vals, firstBad } = validateFields(form, fields);
    const errBox = form.querySelector('[data-form-error]');
    errBox.classList.toggle('hidden', !firstBad);
    errBox.textContent = firstBad ? 'Periksa kembali isian yang ditandai.' : '';
    if (firstBad) { firstBad.focus(); return; }
    close();
    onSubmit(vals);
  });
}

// "Tambah User Baru" from the Figma: personal info + module access.
function openUserDrawer(row, onSubmit) {
  const tipe = row?.tipe || 'Internal';
  const access = new Set(row?.access || []);
  const body = `
    <section class="flex flex-col gap-1">
      <h3 class="text-sm font-extrabold text-ink">Informasi Personal</h3>
      <p class="text-xs text-ink-body">Isi data diri dan informasi yang dibutuhkan untuk ${row ? 'memperbarui' : 'membuat'} akun.</p>
    </section>
    <div class="mt-4 rounded-2xl border border-line p-4">
      <div class="md-seg mb-4" role="group" aria-label="Tipe pekerja">
        <button type="button" data-tipe="Internal" aria-pressed="${tipe === 'Internal'}">Pekerja Internal</button>
        <button type="button" data-tipe="External" aria-pressed="${tipe === 'External'}">Pekerja External</button>
      </div>
      <div class="grid grid-cols-2 gap-4">
        ${fieldHTML({ key: 'name', label: 'Nama', type: 'text', required: true, half: true, placeholder: 'Masukkan nama' }, row?.name)}
        ${fieldHTML({ key: 'username', label: 'Username', type: 'text', required: true, half: true, placeholder: '@username atau PN' }, row?.username)}
        ${fieldHTML({ key: 'jgpg', label: 'JG/PG', type: 'text', half: true, placeholder: 'Masukkan JG/PG' }, row?.jgpg === '-' ? '' : row?.jgpg)}
        ${fieldHTML({ key: 'unit', label: 'Unit Kerja', type: 'select', half: true, options: UNITS.map(u => [u, u]) }, row?.unit)}
        <div class="col-span-2" data-field="password">
          <span class="md-label">Kata Sandi ${row ? '<span class="font-medium text-ink-muted">(kosongkan jika tidak diubah)</span>' : '<span class="text-[#dc2626]">*</span>'}</span>
          <div class="flex flex-wrap gap-2.5">
            <span class="relative min-w-[220px] flex-1">
              <input name="password" type="password" placeholder="Masukkan kata sandi" class="md-input pr-28" autocomplete="new-password" />
              <button type="button" data-toggle-pass class="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-[var(--c-tile)] hover:bg-page">${ico('eye', 'size-3.5')} <span>Tampilkan</span></button>
            </span>
            <button type="button" data-gen-pass class="md-btn bg-[#ea6a0c] text-white hover:bg-[#d25d08]">${ico('spark')} Generate Password</button>
          </div>
          <p class="md-error hidden"></p>
        </div>
      </div>
    </div>
    <section class="mt-6 flex items-end justify-between gap-3">
      <div><h3 class="text-sm font-extrabold text-ink">Atur Akses Modul</h3><p class="text-xs text-ink-body">Pilih modul apa saja yang boleh diakses oleh admin ini.</p></div>
      <p class="whitespace-nowrap text-xs text-ink-body"><b data-selected class="text-ink">0</b> dipilih</p>
    </section>
    <p data-access-error class="md-error hidden">Pilih minimal satu modul.</p>
    <div class="mt-3 flex flex-col gap-3">
      ${MODULE_ACCESS.map((g, gi) => `
        <details class="rounded-2xl border border-line" ${gi === 0 ? 'open' : ''}>
          <summary class="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
            <label class="md-check font-bold" onclick="event.stopPropagation()"><input type="checkbox" data-group="${gi}" /> ${h(g.group)} (<span data-group-count="${gi}">0</span>/${g.items.length})</label>
            ${ico('down')}
          </summary>
          <div class="grid gap-2.5 border-t border-line px-4 py-3 sm:grid-cols-3">
            ${g.items.map(it => `<label class="md-check"><input type="checkbox" name="access" value="${h(it)}" data-in-group="${gi}" ${access.has(it) ? 'checked' : ''} /> ${h(it)}</label>`).join('')}
          </div>
        </details>`).join('')}
    </div>`;
  const { form, close } = drawerShell(row ? 'Edit User' : 'Tambah User Baru', body, row ? 'Simpan Perubahan' : 'Tambah');
  let currentTipe = tipe;

  const syncAccess = () => {
    const boxes = [...form.querySelectorAll('input[name=access]')];
    form.querySelector('[data-selected]').textContent = boxes.filter(b => b.checked).length;
    MODULE_ACCESS.forEach((g, gi) => {
      const inGroup = boxes.filter(b => b.dataset.inGroup === String(gi));
      const n = inGroup.filter(b => b.checked).length;
      form.querySelector(`[data-group-count="${gi}"]`).textContent = n;
      const all = form.querySelector(`[data-group="${gi}"]`);
      all.checked = n === inGroup.length;
      all.indeterminate = n > 0 && n < inGroup.length;
    });
  };
  syncAccess();
  form.addEventListener('change', e => {
    if (e.target.dataset.group !== undefined) {
      form.querySelectorAll(`[data-in-group="${e.target.dataset.group}"]`).forEach(b => { b.checked = e.target.checked; });
    }
    syncAccess();
  });
  form.addEventListener('click', e => {
    const seg = e.target.closest('[data-tipe]');
    if (seg) {
      currentTipe = seg.dataset.tipe;
      form.querySelectorAll('[data-tipe]').forEach(b => b.setAttribute('aria-pressed', String(b === seg)));
      form.elements.username.placeholder = currentTipe === 'Internal' ? 'Personal Number (8 digit)' : '@username';
    }
    if (e.target.closest('[data-toggle-pass]')) {
      const inp = form.elements.password;
      const show = inp.type === 'password';
      inp.type = show ? 'text' : 'password';
      e.target.closest('[data-toggle-pass]').innerHTML = `${ico(show ? 'eyeOff' : 'eye', 'size-3.5')} <span>${show ? 'Sembunyikan' : 'Tampilkan'}</span>`;
    }
    if (e.target.closest('[data-gen-pass]')) {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
      const buf = new Uint32Array(12);
      crypto.getRandomValues(buf);
      const inp = form.elements.password;
      inp.value = [...buf].map(n => chars[n % chars.length]).join('');
      inp.type = 'text';
      form.querySelector('[data-toggle-pass]').innerHTML = `${ico('eyeOff', 'size-3.5')} <span>Sembunyikan</span>`;
      setError(form, 'password', '');
      UI.toast('Password baru dibuat — salin sebelum menyimpan');
    }
  });
  form.elements.name.focus();

  form.addEventListener('submit', e => {
    e.preventDefault();
    const fields = [
      { key: 'name', label: 'Nama', required: true },
      { key: 'username', label: 'Username', required: true, ...(currentTipe === 'Internal' ? { pattern: /^\d{8}$/, patternMsg: 'Pekerja internal memakai PN 8 digit.' } : { pattern: /^@?[a-z0-9._]{3,}$/i, patternMsg: 'Username minimal 3 karakter (huruf, angka, titik).' }) },
      { key: 'jgpg', label: 'JG/PG' },
      { key: 'unit', label: 'Unit Kerja' },
      { key: 'password', label: 'Kata Sandi', required: !row, minLength: 8 },
    ];
    const { values, firstBad } = validateFields(form, fields);
    const selected = [...form.querySelectorAll('input[name=access]:checked')].map(b => b.value);
    const accessErr = form.querySelector('[data-access-error]');
    accessErr.classList.toggle('hidden', selected.length > 0);
    const errBox = form.querySelector('[data-form-error]');
    const bad = firstBad || (!selected.length && form.querySelector('[data-group="0"]'));
    errBox.classList.toggle('hidden', !bad);
    errBox.textContent = bad ? 'Masih ada isian yang belum valid.' : '';
    if (bad) { bad.focus(); return; }
    close();
    onSubmit({
      name: values.name, tipe: currentTipe,
      username: currentTipe === 'External' && !values.username.startsWith('@') ? `@${values.username}` : values.username,
      jgpg: values.jgpg || '-', unit: values.unit || '-', access: selected,
      joined: row?.joined || today(),
    });
  });
}

/* ---------- Penilaian / Kalibrasi flow ---------------------------------------- */

function assessmentModule(mode) {
  const isKal = mode === 'kalibrasi';
  const s = { person: null, type: '', submitted: false, tab: 'soft', scores: { soft: {}, hard: {} }, generated: null, saved: false };

  ROOT.innerHTML = `
    <form id="pick" class="md-panel grid gap-4 p-5 md:grid-cols-12" novalidate>
      <div class="relative ${isKal ? 'md:col-span-12' : 'md:col-span-8'}">
        <label class="md-label" for="person">Pekerja</label>
        <span class="relative block">
          <span class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--c-tile)]">${ico('user')}</span>
          <input id="person" role="combobox" aria-expanded="false" aria-controls="person-list" autocomplete="off" placeholder="Ketik nama atau Personal Number" class="md-input pl-10 pr-10" />
          <button type="button" data-clear-person class="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-lg p-1.5 text-ink-muted hover:bg-page" aria-label="Hapus pilihan">${ico('x', 'size-3.5')}</button>
        </span>
        <div id="person-list" role="listbox" class="md-combo-list hidden"></div>
      </div>
      ${isKal ? '' : `
      <label class="md:col-span-4">
        <span class="md-label">Jenis Form</span>
        <select id="type" class="md-input">
          <option value="">Silahkan Pilih Jenis Form</option>
          <option value="soft">Soft Competency</option>
          <option value="hard">Hard Competency</option>
        </select>
      </label>`}
      <div class="flex items-center justify-end gap-2.5 md:col-span-12">
        <button type="reset" class="md-btn md-btn--ghost">Reset</button>
        <button type="submit" id="pick-submit" class="md-btn md-btn--primary" disabled>Submit</button>
      </div>
    </form>
    <div id="sheet"></div>`;

  const pick = document.getElementById('pick');
  const input = document.getElementById('person');
  const list = document.getElementById('person-list');
  const sheet = document.getElementById('sheet');
  const typeSel = document.getElementById('type');
  const personLabel = p => `${p.pn} | ${p.name} | ${p.position.toUpperCase()} | ${p.unit.toUpperCase()}`;

  const canSubmit = () => document.getElementById('pick-submit').disabled = !(s.person && (isKal || typeSel.value));

  function showList() {
    const q = input.value.trim().toLowerCase();
    const items = PEOPLE.filter(p => !q || `${p.name} ${p.pn}`.toLowerCase().includes(q)).slice(0, 8);
    list.innerHTML = items.length ? items.map((p, i) => `
      <button type="button" role="option" data-pn="${p.pn}" aria-selected="${i === 0}">
        <span class="text-[13px] font-bold text-ink">${h(p.name)}</span>
        <span class="text-[11px] text-ink-body">${p.pn} · ${h(p.position)} · ${h(p.unit)}</span>
      </button>`).join('') : '<p class="px-3 py-3 text-xs text-ink-body">Pekerja tidak ditemukan.</p>';
    list.classList.remove('hidden');
    input.setAttribute('aria-expanded', 'true');
  }
  const hideList = () => { list.classList.add('hidden'); input.setAttribute('aria-expanded', 'false'); };
  function choose(p) {
    s.person = p;
    input.value = personLabel(p);
    input.readOnly = true;
    pick.querySelector('[data-clear-person]').classList.remove('hidden');
    hideList();
    canSubmit();
  }

  input.addEventListener('focus', () => { if (!s.person) showList(); });
  input.addEventListener('input', showList);
  input.addEventListener('keydown', e => {
    const opts = [...list.querySelectorAll('[role=option]')];
    const idx = opts.findIndex(o => o.getAttribute('aria-selected') === 'true');
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = opts[(idx + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length];
      opts.forEach(o => o.setAttribute('aria-selected', String(o === next)));
      next?.scrollIntoView({ block: 'nearest' });
    }
    if (e.key === 'Enter' && !list.classList.contains('hidden') && opts[idx]) {
      e.preventDefault();
      choose(PEOPLE.find(p => p.pn === opts[idx].dataset.pn));
    }
    if (e.key === 'Escape') hideList();
  });
  list.addEventListener('mousedown', e => e.preventDefault());
  list.addEventListener('click', e => {
    const opt = e.target.closest('[data-pn]');
    if (opt) choose(PEOPLE.find(p => p.pn === opt.dataset.pn));
  });
  input.addEventListener('blur', () => setTimeout(hideList, 120));
  pick.querySelector('[data-clear-person]').addEventListener('click', () => {
    s.person = null; input.readOnly = false; input.value = '';
    pick.querySelector('[data-clear-person]').classList.add('hidden');
    canSubmit(); input.focus();
  });
  typeSel?.addEventListener('change', canSubmit);

  pick.addEventListener('reset', () => {
    setTimeout(() => {
      s.person = null; s.submitted = false; s.saved = false; s.generated = null;
      input.readOnly = false;
      pick.querySelector('[data-clear-person]').classList.add('hidden');
      sheet.innerHTML = '';
      canSubmit();
    });
  });

  pick.addEventListener('submit', e => {
    e.preventDefault();
    if (!s.person) return;
    s.type = isKal ? 'soft' : typeSel.value;
    s.tab = s.type;
    s.submitted = true; s.saved = false; s.generated = null;
    s.scores = { soft: {}, hard: {} };
    if (isKal) prefillFromAssessor();
    renderSheet();
    sheet.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });

  // Kalibrasi starts from the assessor's scores; the calibrator adjusts them.
  function prefillFromAssessor() {
    const rnd = seeded(Number(s.person.pn));
    for (const kind of ['soft', 'hard']) for (const c of COMPETENCIES[kind]) {
      const level = Math.max(0, Math.min(5, c.req + Math.floor(rnd() * 3) - 1));
      s.scores[kind][c.code] = { level, evidence: `Berdasarkan observasi asesor, peserta menunjukkan perilaku ${c.name.toLowerCase()} secara konsisten pada simulasi kasus dan wawancara.` };
    }
  }

  const kinds = () => isKal ? ['soft', 'hard'] : [s.type];
  const gapOf = (c, kind) => { const lv = s.scores[kind][c.code]?.level; return lv === undefined ? null : lv - c.req; };
  const isComplete = kind => COMPETENCIES[kind].every(c => {
    const sc = s.scores[kind][c.code];
    return sc && sc.level !== undefined && (sc.evidence || '').trim().length >= 50;
  });
  const normOf = kind => isComplete(kind) ? normFromGaps(COMPETENCIES[kind].map(c => gapOf(c, kind))) : null;
  const overall = (soft, hard) => soft === 'Need Improvement' && hard === 'Need Improvement' ? 'Tidak Direkomendasi'
    : soft === 'Need Improvement' || hard === 'Need Improvement' ? 'Direkomendasi dengan Catatan' : 'Direkomendasi';
  const toneOf = norm => ({ Good: 'is-good', Fit: 'is-fit', 'Need Improvement': 'is-need', Direkomendasi: 'is-good', 'Direkomendasi dengan Catatan': 'is-fit', 'Tidak Direkomendasi': 'is-need', Passed: 'is-good' }[norm] || '');

  function compHTML(c, i, kind) {
    const sc = s.scores[kind][c.code] || {};
    const gap = gapOf(c, kind);
    const gapCls = gap === null ? '' : gap >= 0 ? 'is-ok' : gap === -1 ? 'is-minus' : 'is-bad';
    const len = (sc.evidence || '').trim().length;
    return `
      <div class="md-comp" data-comp="${kind}:${c.code}">
        <div class="md-comp__head">
          <h4 class="text-sm font-extrabold text-ink">${i + 1}. ${h(c.name)} (${c.code})</h4>
          <span class="md-req">Syarat Kedalaman : ${c.req}</span>
        </div>
        <div class="grid items-center gap-4 p-4 lg:grid-cols-[1.4fr_auto_auto_1.6fr]">
          <p class="text-[13px] font-semibold leading-5 text-ink">${h(c.indicator)}</p>
          <div>
            <p class="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-muted lg:hidden">Level Kedalaman</p>
            <div class="md-level" role="group" aria-label="Level kedalaman ${h(c.name)}">
              ${[0, 1, 2, 3, 4, 5].map(n => `<button type="button" data-level="${n}" aria-pressed="${sc.level === n}">${n}</button>`).join('')}
            </div>
          </div>
          <div class="flex flex-col items-start gap-1 lg:items-center">
            <p class="text-[11px] font-bold uppercase tracking-wide text-ink-muted lg:hidden">GAP</p>
            <span class="md-gap ${gapCls}" data-gap>${gap === null ? '–' : gap > 0 ? `+${gap}` : gap}</span>
          </div>
          <div>
            <textarea data-evidence rows="3" class="md-input text-[13px]" placeholder="Deskripsikan bukti perilaku di sini (min. 50 karakter)">${h(sc.evidence || '')}</textarea>
            <p class="mt-1 flex justify-between text-[11px]"><span data-ev-hint class="font-semibold ${len >= 50 ? 'text-[#11804b]' : 'text-ink-muted'}">${len >= 50 ? 'Bukti perilaku cukup' : 'Minimal 50 karakter'}</span><span data-ev-count class="text-ink-muted">${len}/50</span></p>
          </div>
        </div>
      </div>`;
  }

  function progressHTML() {
    const total = kinds().reduce((n, k) => n + COMPETENCIES[k].length, 0);
    const done = kinds().reduce((n, k) => n + COMPETENCIES[k].filter(c => {
      const sc = s.scores[k][c.code]; return sc && sc.level !== undefined && (sc.evidence || '').trim().length >= 50;
    }).length, 0);
    return `<div class="flex items-center gap-3"><span class="md-progress w-40"><span style="width:${(done / total) * 100}%"></span></span><span class="text-xs font-bold text-ink-body">${done} dari ${total} kompetensi lengkap</span></div>`;
  }

  function resultPanelHTML() {
    if (!isKal) {
      const norm = normOf(s.type);
      return `
        <div class="grid gap-4 sm:grid-cols-2">
          ${readField('Nama Peserta', s.person.name)}${readField('Tanggal', today(), 'calendar')}
          <div><span class="md-label">Hasil Rekomendasi</span><div class="md-result ${toneOf(norm)}" data-live-result>${norm || 'Belum lengkap — isi semua kompetensi'}</div></div>
          ${readField('Jenis Form', FORM_TYPES[s.type])}
        </div>`;
    }
    const g = s.generated;
    return `
      <div class="grid gap-4 sm:grid-cols-2">${readField('Nama Peserta', s.person.name)}${readField('Tanggal', today(), 'calendar')}</div>
      <div class="mt-4 grid gap-4 md:grid-cols-3">
        <div><span class="md-label">Hasil Rekomendasi Soft Competency</span><div class="md-result ${toneOf(g?.soft)}">${g ? g.soft : 'Belum digenerate'}</div></div>
        <div><span class="md-label">Hasil Rekomendasi Hard Competency</span><div class="md-result ${toneOf(g?.hard)}">${g ? g.hard : 'Belum digenerate'}</div></div>
        <div><span class="md-label">Hasil Rekomendasi Assessment</span><div class="md-result ${toneOf(g?.overall)} text-base">${g ? g.overall : 'Belum digenerate'}</div></div>
      </div>`;
  }

  const readField = (label, value, icon) => `<div><span class="md-label">${label}</span><div class="md-input flex items-center gap-2 bg-page text-ink-body">${icon ? `<span class="text-[var(--c-tile)]">${ico(icon)}</span>` : ''}${h(value || '-')}</div></div>`;

  function renderSheet() {
    const p = s.person;
    const activeNorm = isKal ? s.generated?.[s.tab] : normOf(s.type);
    const activeKind = isKal ? s.tab : s.type;
    sheet.innerHTML = `
      <div class="flex flex-col gap-6 animate-fade-in">
        <h2 class="text-lg font-extrabold uppercase tracking-tight text-ink">Formulir Hasil Assessment Micro &amp; Retail Risk &amp; Compliance</h2>
        <div class="md-panel grid gap-4 p-5 sm:grid-cols-2">
          ${readField('Nama Peserta', p.name)}${readField('Jabatan', p.position)}
          ${readField('PN/NIP', p.pn)}${readField('JG/PG', p.jgpg)}
          ${readField('Regional Office', p.unit.startsWith('Regional') ? p.unit : 'Kantor Pusat')}${readField('Unit Kerja', p.unit)}
        </div>

        <section class="flex flex-col gap-4">
          ${isKal ? `
          <div class="flex border-b border-line" role="tablist">
            ${['soft', 'hard'].map(k => `<button type="button" role="tab" data-kind-tab="${k}" aria-selected="${s.tab === k}" class="-mb-px flex-1 border-b-2 px-4 py-3 text-sm font-bold transition ${s.tab === k ? 'border-[var(--c-tile)] text-[var(--c-tile)]' : 'border-transparent text-ink-body hover:text-ink'}">${FORM_TYPES[k]} ${isComplete(k) ? '✓' : ''}</button>`).join('')}
          </div>` : `<h3 class="text-base font-extrabold uppercase text-ink">${FORM_TYPES[s.type]}</h3>`}
          <p class="text-[13px] leading-5 text-ink-body">${isKal
            ? 'Berikut adalah tabel penilaian dari asesor. Sesuaikan level kedalaman dan bukti perilaku bila perlu, lalu klik <b>Generate Nilai</b> untuk memunculkan hasil akhir. Setelah itu, klik <b>Simpan</b> untuk menyimpan hasilnya.'
            : 'Silakan lakukan pengisian nilai indikator berdasarkan kompetensi yang ditampilkan dengan cara mengklik tombol angka pada kolom "Level Kedalaman", mulai dari skala 1 sampai dengan 5, sesuai dengan penilaian Anda. Setelah memberikan nilai, pastikan untuk mengisi bagian "Bukti Perilaku" dengan deskripsi yang panjangnya lebih dari 50 karakter. Jika semua sudah terisi dengan benar, klik tombol "Simpan".'}</p>
          <div data-progress>${progressHTML()}</div>
          <div class="hidden grid-cols-[1.4fr_auto_auto_1.6fr] gap-4 rounded-xl bg-[linear-gradient(135deg,var(--c-light),var(--c-deep))] px-4 py-3 text-xs font-extrabold text-white lg:grid">
            <span>Indikator Perilaku</span><span class="w-[216px] text-center">Level Kedalaman</span><span class="w-[44px] text-center">GAP</span><span class="text-center">Bukti Perilaku</span>
          </div>
          <div id="comps" class="flex flex-col gap-3">${COMPETENCIES[activeKind].map((c, i) => compHTML(c, i, activeKind)).join('')}</div>
          ${isKal ? `<button type="button" data-generate class="md-btn md-btn--primary h-12 w-full">${ico('spark')} Generate Nilai</button>` : ''}
        </section>

        <section class="flex flex-col gap-3">
          <h3 class="text-base font-extrabold text-ink">Norma Kelulusan</h3>
          <div class="grid gap-3 md:grid-cols-3">
            ${NORMS.map(n => `
              <div class="md-norm ${activeNorm === n.title ? 'is-active' : ''}" data-norm="${n.title}">
                <p class="mb-2 text-center text-lg font-extrabold ${n.tone === 'good' ? 'text-[#11804b]' : n.tone === 'fit' ? 'text-[#b45309]' : 'text-[#c2261d]'}">${n.title}</p>
                <ul class="list-disc space-y-1.5 pl-4 text-xs leading-[18px] text-ink">${n.points.map(pt => `<li>${h(pt)}</li>`).join('')}</ul>
              </div>`).join('')}
          </div>
        </section>

        <section class="flex flex-col gap-3">
          <h3 class="text-base font-extrabold text-ink">Peserta</h3>
          <div class="md-panel p-5" data-result-panel>${resultPanelHTML()}</div>
        </section>

        <section class="flex flex-col gap-3">
          <h3 class="text-base font-extrabold text-ink">Penilai</h3>
          <div class="md-panel grid gap-4 p-5 sm:grid-cols-2">${readField('Nama Penilai', ASSESSOR.name)}${readField('Jabatan', ASSESSOR.position)}</div>
        </section>

        <div class="flex flex-col gap-2">
          <button type="button" data-save class="md-btn md-btn--primary h-12 w-full" ${isKal && !s.generated ? 'disabled' : ''}>Simpan</button>
          ${isKal && !s.generated ? '<p class="text-center text-xs text-ink-muted">Tombol Simpan aktif setelah Anda klik Generate Nilai.</p>' : ''}
        </div>
      </div>`;
  }

  // Update one competency in place (keeps focus while typing).
  function refreshComp(kind, code) {
    const c = COMPETENCIES[kind].find(x => x.code === code);
    const box = sheet.querySelector(`[data-comp="${kind}:${code}"]`);
    const gap = gapOf(c, kind);
    const gapEl = box.querySelector('[data-gap]');
    gapEl.textContent = gap === null ? '–' : gap > 0 ? `+${gap}` : gap;
    gapEl.className = `md-gap ${gap === null ? '' : gap >= 0 ? 'is-ok' : gap === -1 ? 'is-minus' : 'is-bad'}`;
    box.querySelectorAll('[data-level]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.level) === s.scores[kind][code]?.level)));
    const len = (s.scores[kind][code]?.evidence || '').trim().length;
    box.querySelector('[data-ev-count]').textContent = `${len}/50`;
    const hint = box.querySelector('[data-ev-hint]');
    hint.textContent = len >= 50 ? 'Bukti perilaku cukup' : 'Minimal 50 karakter';
    hint.className = `font-semibold ${len >= 50 ? 'text-[#11804b]' : 'text-ink-muted'}`;
    if (len >= 50 && s.scores[kind][code]?.level !== undefined) box.classList.remove('has-error');
    sheet.querySelector('[data-progress]').innerHTML = progressHTML();
    if (isKal && s.generated) {
      s.generated = null;                      // edits invalidate the generated result
      sheet.querySelector('[data-result-panel]').innerHTML = resultPanelHTML();
      const save = sheet.querySelector('[data-save]');
      save.disabled = true;
      UI.toast('Nilai berubah — klik Generate Nilai lagi');
    }
    if (!isKal) {
      sheet.querySelector('[data-result-panel]').innerHTML = resultPanelHTML();
      const norm = normOf(s.type);
      sheet.querySelectorAll('[data-norm]').forEach(n => n.classList.toggle('is-active', n.dataset.norm === norm));
    }
  }

  sheet.addEventListener('click', e => {
    const lv = e.target.closest('[data-level]');
    if (lv) {
      const [kind, code] = lv.closest('[data-comp]').dataset.comp.split(':');
      s.scores[kind][code] = { ...(s.scores[kind][code] || {}), level: Number(lv.dataset.level) };
      refreshComp(kind, code);
      return;
    }
    const tab = e.target.closest('[data-kind-tab]');
    if (tab) { s.tab = tab.dataset.kindTab; renderSheet(); return; }
    if (e.target.closest('[data-generate]')) {
      const missing = ['soft', 'hard'].filter(k => !isComplete(k));
      if (missing.length) {
        s.tab = missing[0]; renderSheet(); flagErrors(missing[0]);
        UI.toast(`Lengkapi ${FORM_TYPES[missing[0]]} sebelum generate nilai`);
        return;
      }
      const soft = normOf('soft');
      const hardNorm = normOf('hard');
      s.generated = { soft, hard: hardNorm === 'Need Improvement' ? hardNorm : 'Passed', overall: overall(soft, hardNorm) };
      renderSheet();
      sheet.querySelector('[data-result-panel]').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      UI.toast('Nilai berhasil digenerate');
      return;
    }
    if (e.target.closest('[data-save]')) save();
  });

  sheet.addEventListener('input', e => {
    if (!e.target.matches('[data-evidence]')) return;
    const [kind, code] = e.target.closest('[data-comp]').dataset.comp.split(':');
    s.scores[kind][code] = { ...(s.scores[kind][code] || {}), evidence: e.target.value };
    refreshComp(kind, code);
  });

  function flagErrors(kind) {
    let first = null;
    COMPETENCIES[kind].forEach(c => {
      const sc = s.scores[kind][c.code];
      const bad = !sc || sc.level === undefined || (sc.evidence || '').trim().length < 50;
      const box = sheet.querySelector(`[data-comp="${kind}:${c.code}"]`);
      box?.classList.toggle('has-error', bad);
      if (bad && !first) first = box;
    });
    first?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    return first;
  }

  function save() {
    if (!isKal) {
      const missing = COMPETENCIES[s.type].filter(c => { const sc = s.scores[s.type][c.code]; return !sc || sc.level === undefined || (sc.evidence || '').trim().length < 50; });
      if (missing.length) {
        flagErrors(s.type);
        UI.toast(`${missing.length} kompetensi belum lengkap (level & bukti perilaku min. 50 karakter)`);
        return;
      }
    }
    const overlay = document.createElement('div');
    overlay.className = 'md-overlay';
    overlay.innerHTML = `<div class="flex flex-col items-center gap-4 rounded-3xl bg-white px-10 py-8 shadow-pop"><span class="md-spinner"></span><p class="text-sm font-bold text-ink">Menyimpan ${isKal ? 'hasil kalibrasi' : 'penilaian'}…</p><p class="text-xs text-ink-body">Mohon tunggu sebentar</p></div>`;
    document.body.append(overlay);
    setTimeout(() => {
      overlay.remove();
      const norm = isKal ? null : normOf(s.type);
      const kriteria = isKal
        ? { Direkomendasi: 'DIREKOMENDASI', 'Direkomendasi dengan Catatan': 'DIREKOMENDASI DENGAN CATATAN' }[s.generated.overall] || 'TIDAK DIREKOMENDASI'
        : kriteriaFromNorm(norm);
      const saved = store.get(`${APP.id}:assessments`, []);
      saved.unshift({ id: `a${Date.now()}`, name: s.person.name, pn: s.person.pn, jgpg: s.person.jgpg, unit: s.person.unit, kriteria, periode: today() });
      store.set(`${APP.id}:assessments`, saved.slice(0, 20));
      UI.toast(`${isKal ? 'Hasil kalibrasi' : 'Penilaian'} ${s.person.name} berhasil disimpan`);
      UI.notify({ title: isKal ? 'Kalibrasi tersimpan' : 'Penilaian tersimpan', body: `${s.person.name} · ${kriteria.toLowerCase()}` });
      const hasRepo = !!featureFor(APP.id, 'repository');
      sheet.innerHTML = `
        <div class="md-panel flex flex-col items-center gap-4 px-6 py-12 text-center animate-fade-in">
          <span class="grid size-20 place-items-center rounded-full bg-[#e6f6ee] text-[#11804b]">${ico('check', 'size-10')}</span>
          <h2 class="text-xl font-extrabold text-ink">${isKal ? 'Hasil kalibrasi' : 'Penilaian'} berhasil disimpan</h2>
          <p class="max-w-md text-sm text-ink-body">${h(s.person.name)} (${s.person.pn}) — hasil akhir <b>${h(isKal ? s.generated.overall : norm)}</b>${hasRepo ? ' dan sudah masuk ke Repository.' : '.'}</p>
          <div class="mt-2 flex flex-wrap justify-center gap-2.5">
            <button type="button" data-again class="md-btn md-btn--ghost">${ico('refresh')} ${isKal ? 'Kalibrasi peserta lain' : 'Nilai peserta lain'}</button>
            ${hasRepo ? `<a href="${moduleUrl(APP.id, 'repository')}" class="md-btn md-btn--primary">Lihat di Repository</a>` : ''}
          </div>
        </div>`;
      sheet.querySelector('[data-again]').addEventListener('click', () => { pick.reset(); window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); input.focus(); });
    }, 1400);
  }
}

/* ---------- Boot ------------------------------------------------------------ */

if (MOD === 'penilaian' || MOD === 'kalibrasi') assessmentModule(MOD);
else tableModule((TABLES[MOD] || TABLES.repository)());
