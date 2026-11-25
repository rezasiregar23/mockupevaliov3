// Apps available to the signed-in user — shared by the portal grid and the in-app switcher.

// Icon tile + arrow button colours per app theme (from the Figma cards).
const THEMES = {
  sky:    { tile: 'bg-[linear-gradient(135deg,#7fcdee_0%,#2a93d5_50%)]', btn: 'bg-[#e5f5fd]', arcs: 'decor-arcs-sky',    arrow: 'icon-arrow-sky' },
  blue:   { tile: 'bg-[linear-gradient(135deg,#1a6fdb_0%,#0957c3_50%)]', btn: 'bg-[#e8f6fd]', arcs: 'decor-arcs-blue',   arrow: 'icon-arrow-blue' },
  indigo: { tile: 'bg-[linear-gradient(135deg,#7389f4_0%,#2f3fb5_50%)]', btn: 'bg-[#edf0fe]', arcs: 'decor-arcs-indigo', arrow: 'icon-arrow-indigo' },
  navy:   { tile: 'bg-[linear-gradient(135deg,#2f63b8_0%,#0b2a5b_50%)]', btn: 'bg-[#e7f0f9]', arcs: 'decor-arcs-navy',   arrow: 'icon-arrow-navy' },
};

const APPS = [
  { name: 'Evalio BBAP',       desc: 'Assessment & Development',   icon: 'icon-clip',   theme: 'sky',    category: 'assessment',  pinned: true, href: 'bbap.html', ready: true },
  { name: 'Evalio BFLP',       desc: 'Assessment & Recruitment',   icon: 'icon-cap',    theme: 'blue',   category: 'recruitment', pinned: true, href: 'assessment_bflp/dev_layout' },
  { name: 'Evalio Capacity',   desc: 'Talent Capacity Assessment', icon: 'icon-gauge',  theme: 'indigo', category: 'assessment',  pinned: true, href: 'https://evalio.sauwork.co.id/api-talent-capacity/', sso: true },
  { name: 'Kalibrasi BFLP',    desc: 'Kalibrasi Hasil Assessment', icon: 'icon-scale',       theme: 'navy',   category: 'kalibrasi',  pinned: false, href: 'assessment_bflp_kalibrasi/dev_layout' },
  { name: 'Repository BFLP',   desc: 'Arsip Hasil Assessment BFLP', icon: 'icon-archive',     theme: 'sky',    category: 'repository', pinned: false, href: 'repository_bflp/repo' },
  { name: 'Repository SPV',    desc: 'Arsip Hasil Supervisor',     icon: 'icon-folder-user', theme: 'blue',   category: 'repository', pinned: false, href: 'repository' },
  { name: 'QA UKO',            desc: 'Quality Assurance UKO',      icon: 'icon-shield-check', theme: 'indigo', category: 'assessment', pinned: false },
  { name: 'Monitoring BFLP',   desc: 'Monitoring Assessment BFLP', icon: 'icon-activity',    theme: 'navy',   category: 'recruitment', pinned: false },
];

// Link attributes for an app. Only apps with a mockup page (`ready`) navigate;
// the rest show a "segera hadir" toast via ui.js [data-soon].
const appLink = app => app.ready
  ? `href="${app.href}"${app.sso ? ' target="_blank" rel="noopener"' : ''}`
  : `href="#" data-soon="Halaman ${app.name}"`;

// The portal grid is rendered by JS, so the browser can't discover the card icons
// until then. Call this from <head> to start fetching them with the first requests.
const appIconUrls = () => [...new Set(APPS.flatMap(app => [app.icon, THEMES[app.theme].arcs, THEMES[app.theme].arrow]))]
  .map(file => `assets/icons/${file}.svg`);

function preloadAppIcons() {
  for (const href of appIconUrls()) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = href;
    document.head.append(link);
  }
}

// Apps the user can request access to via "Ajukan".
const REQUESTABLE_APPS = ['Evalio 360', 'Evalio Psikotes', 'Evalio Interview', 'Evalio Succession', 'Evalio Learning'];
