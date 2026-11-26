// Shared header for the app detail and module pages: current app, app switcher.
// Loaded after apps.js / app-data.js and before ui.js.

const PARAMS = new URLSearchParams(location.search);

// Absolute url() for CSS masks: a relative url() inside a custom property would
// resolve against the stylesheet (assets/css/), not the page.
const iconURL = name => `url("${new URL(`assets/icons/${name}.svg`, location.href).href}")`;

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

// Resolve the app from ?id= / ?app=; unknown ids fall back to BBAP.
function currentApp() {
  return appById(PARAMS.get('id') || PARAMS.get('app')) || APPS[0];
}

function initShell(app) {
  document.body.classList.add(`cat-${app.category}`);
  document.querySelectorAll('[data-app-name]').forEach(el => { el.textContent = app.name; });
  document.querySelectorAll('[data-app-desc]').forEach(el => { el.textContent = app.desc; });
  document.querySelectorAll('[data-app-icon]').forEach(img => { img.src = `assets/icons/${app.icon}.svg`; });
  document.querySelectorAll('[data-app-link]').forEach(a => { a.href = appUrl(app); });
  renderAppSwitcher(app);
}

function renderAppSwitcher(current) {
  const panel = document.getElementById('dd-apps');
  if (!panel) return;
  panel.innerHTML = `
    <p class="px-4 pb-1.5 pt-3.5 text-[11px] font-bold uppercase tracking-[0.6px] text-ink-muted">Pindah aplikasi</p>
    <div class="max-h-[360px] overflow-y-auto p-1.5 pt-0">
      ${APPS.map(app => {
        const isCurrent = app.id === current.id;
        return `
          <a href="${appUrl(app)}" ${isCurrent ? 'aria-current="page"' : ''}
            class="cat-${app.category} flex items-center gap-3 rounded-lg px-2.5 py-2 transition hover:bg-page ${isCurrent ? 'bg-sky-50/70' : ''}">
            <span class="ws-tile size-[30px] rounded-[9px]"><img src="assets/icons/${app.icon}.svg" alt="" width="16" height="16" /></span>
            <span class="flex min-w-0 flex-1 flex-col">
              <span class="truncate text-[13px] font-bold text-ink">${app.name}</span>
              <span class="truncate text-[11px] font-medium text-ink-muted">${app.desc}</span>
            </span>
            ${isCurrent ? `<span class="text-brand">${UI_CHECK}</span>`
              : app.ssoUrl ? '<span class="rounded-full bg-mist-50 px-1.5 py-px text-[10px] font-bold text-ink-body">SSO</span>' : ''}
          </a>`;
      }).join('')}
    </div>
    <div class="border-t border-line p-1.5">
      <a href="index.html" class="flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-[13px] font-bold text-brand transition hover:bg-page">
        <img src="assets/icons/icon-grid.svg" alt="" width="16" height="16" />
        Kembali ke EVALIO Portal
      </a>
    </div>`;
}

const UI_CHECK = '<svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

// Header markup shared by app.html and module.html (injected before ui.js runs).
function shellHeaderHTML() {
  return `
    <header class="border-b border-line bg-white">
      <div class="mx-auto flex h-[71px] max-w-[1440px] items-center justify-between gap-3 px-4 md:px-8 xl:px-[120px]">
        <div class="flex min-w-0 items-center gap-3">
          <a href="index.html" class="block h-7 w-[102px] shrink-0" aria-label="Kembali ke EVALIO Portal">
            <img src="assets/img/logo-evalio.png" alt="EVALIO — Assessment Work by SAU" class="size-full object-cover" />
          </a>
          <span class="text-[22px] text-mist-300">/</span>
          <div class="relative min-w-0">
            <button type="button" data-dropdown="dd-apps" class="group flex min-w-0 items-center gap-2.5 rounded-xl py-[5px] pl-1.5 pr-2.5 text-left transition hover:bg-page aria-expanded:bg-page">
              <span class="ws-tile size-[30px] rounded-[9px]"><img data-app-icon src="" alt="" width="16" height="16" /></span>
              <span class="flex min-w-0 flex-col whitespace-nowrap">
                <span class="text-[10px] font-semibold text-[var(--c-tag)]">Aplikasi</span>
                <span data-app-name class="truncate text-sm font-extrabold text-ink"></span>
              </span>
              <img src="assets/icons/icon-chev-bbap.svg" alt="" width="16" height="16" class="transition group-aria-expanded:rotate-180" />
            </button>
            <div id="dd-apps" data-panel class="dd-panel hidden left-0 w-[320px]"></div>
          </div>
        </div>
        <div class="flex shrink-0 items-center gap-3">
          <span class="hidden rounded-full border border-line bg-page px-2.5 py-1.5 text-xs font-semibold text-ink-body md:inline-flex">PT Siaga Abdi Utama</span>
          <div class="relative">
            <button type="button" data-dropdown="dd-notif" aria-label="Notifikasi" class="relative block size-5 shrink-0 transition hover:opacity-70">
              <img src="assets/icons/icon-bell.svg" alt="" width="20" height="20" />
              <span data-unread-dot class="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-white bg-[#2ea9e2]"></span>
            </button>
            <div id="dd-notif" data-panel class="dd-panel hidden right-0 w-[360px]"></div>
          </div>
          <div class="relative">
            <button type="button" data-dropdown="dd-profile" aria-label="Menu pengguna" class="block size-[34px] shrink-0 rounded-full transition hover:opacity-80">
              <img src="assets/img/avatar-user-34.png" alt="Muhammad Hakim" width="34" height="34" />
            </button>
            <div id="dd-profile" data-panel class="dd-panel hidden right-0 w-[280px]"></div>
          </div>
        </div>
      </div>
    </header>`;
}

function shellFooterHTML(app) {
  return `
    <footer class="border-t border-line bg-white">
      <div class="mx-auto flex max-w-[1440px] items-start justify-between gap-4 px-4 py-5 text-xs font-medium md:px-8 xl:px-[120px]">
        <p class="text-ink-muted">© 2026 PT Siaga Abdi Utama · EVALIO / ${escapeHTML(app.name)}</p>
        <p class="whitespace-nowrap text-ink-body">Versi 2.0</p>
      </div>
    </footer>`;
}

// Writes the header/footer into their slots synchronously (call inline in <body>).
function mountShell() {
  const app = currentApp();
  document.getElementById('shell-header').outerHTML = shellHeaderHTML();
  document.getElementById('shell-footer').outerHTML = shellFooterHTML(app);
  initShell(app);
  return app;
}
