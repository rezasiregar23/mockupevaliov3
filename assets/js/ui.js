// Shared header interactions for EVALIO pages: dropdown panels, modals, toasts,
// and the notification + profile menus. Load at the end of <body>.
//
// Dropdowns: a trigger `<button data-dropdown="panel-id">` toggles the element
// with that id (which carries `data-panel` and starts with the `hidden` class).
// `#dd-notif` and `#dd-profile` are filled in here when present on the page.
const UI = (() => {
  const USER = { name: 'Muhammad Hakim', first: 'Hakim', role: 'Administrator', email: 'm.hakim@sauwork.co.id', avatar: 'assets/img/avatar-user.png' };

  const NOTIFS = [
    { title: 'Sesi Kalibrasi BFLP dibuka', body: 'Kalibrasi batch Oktober 2026 siap dimulai.',    time: '10 menit lalu', unread: true },
    { title: 'Penilaian menunggu',          body: '12 peserta BBAP belum selesai dinilai.',         time: '1 jam lalu',    unread: true },
    { title: 'Akses disetujui',             body: 'Anda kini memiliki akses ke Repository SPV.',    time: 'Kemarin',       unread: false },
    { title: 'Pembaruan sistem',            body: 'EVALIO versi 2.0 telah dirilis.',                time: '3 hari lalu',   unread: false },
  ];

  // 16px stroke icons (currentColor) used inside menus.
  const ICON = {
    user:   '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    gear:   '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    help:   '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    check:  '<path d="M20 6 9 17l-5-5"/>',
    x:      '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  };
  const icon = (name, cls = 'size-4') =>
    `<svg class="${cls} shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[name]}</svg>`;

  /* ---------- Dropdowns ---------- */

  function closeDropdowns(except) {
    document.querySelectorAll('[data-dropdown][aria-expanded="true"]').forEach(btn => {
      if (btn === except) return;
      btn.setAttribute('aria-expanded', 'false');
      document.getElementById(btn.dataset.dropdown)?.classList.add('hidden');
    });
  }

  document.querySelectorAll('[data-dropdown]').forEach(btn => {
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('click', e => {
    // Ignore clicks on nodes a panel just re-rendered away.
    if (!e.target.isConnected) return;
    const btn = e.target.closest('[data-dropdown]');
    if (btn) {
      const panel = document.getElementById(btn.dataset.dropdown);
      const open = panel.classList.contains('hidden');
      closeDropdowns(btn);
      panel.classList.toggle('hidden', !open);
      btn.setAttribute('aria-expanded', String(open));
      return;
    }
    if (!e.target.closest('[data-panel]')) closeDropdowns();
  });

  /* ---------- Modal ---------- */

  let activeModal = null;

  // Opens a dialog; `body` is HTML. Elements with [data-modal-close] close it.
  function openModal({ title, desc = '', body = '', width = 'max-w-[440px]' }) {
    activeModal?.close();
    const returnFocus = document.activeElement;
    const wrap = document.createElement('div');
    wrap.className = 'fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink-strong/40 p-4 animate-fade-in';
    wrap.innerHTML = `
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" class="relative w-full ${width} rounded-[20px] bg-white p-6 shadow-pop animate-pop-in">
        <button type="button" data-modal-close aria-label="Tutup" class="absolute right-4 top-4 grid size-8 place-items-center rounded-lg text-ink-muted transition hover:bg-page hover:text-ink">${icon('x')}</button>
        <h2 id="modal-title" class="pr-8 text-lg font-extrabold tracking-[-0.2px] text-ink">${title}</h2>
        ${desc ? `<p class="mt-1.5 text-sm leading-[21px] text-ink-body">${desc}</p>` : ''}
        ${body}
      </div>`;
    const close = () => {
      wrap.remove();
      activeModal = null;
      returnFocus?.focus?.();
    };
    wrap.addEventListener('click', e => {
      if (e.target === wrap || e.target.closest('[data-modal-close]')) close();
    });
    document.body.append(wrap);
    activeModal = { el: wrap, close };
    (wrap.querySelector('[autofocus]') ?? wrap.querySelector('[data-modal-close]')).focus();
    return activeModal;
  }

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (activeModal) { activeModal.close(); return; }
    const open = document.querySelector('[data-dropdown][aria-expanded="true"]');
    if (open) { closeDropdowns(); open.focus(); }
  });

  /* ---------- Toast ---------- */

  let toastTimer;
  function toast(message) {
    document.getElementById('toast')?.remove();
    clearTimeout(toastTimer);
    const el = document.createElement('div');
    el.id = 'toast';
    el.setAttribute('role', 'status');
    el.className = 'fixed bottom-6 left-1/2 z-[60] flex max-w-[calc(100vw-32px)] -translate-x-1/2 items-center gap-2.5 rounded-xl bg-ink px-4 py-3 text-[13px] font-semibold text-white shadow-pop animate-toast-in';
    el.innerHTML = `<span class="grid size-5 place-items-center rounded-full bg-white/15">${icon('check', 'size-3')}</span><span>${message}</span>`;
    document.body.append(el);
    toastTimer = setTimeout(() => el.remove(), 3000);
  }

  /* ---------- Skeleton loading ---------- */

  // Resolves once every image has loaded (or failed), or after `timeout` ms, so
  // pages can keep skeleton cards up until the real cards' icons paint together.
  function imagesReady(urls, timeout = 4000) {
    const loads = urls.map(src => {
      const img = new Image();
      img.src = src;
      return img.decode().catch(() => {});
    });
    return Promise.race([Promise.all(loads), new Promise(r => setTimeout(r, timeout))]);
  }

  /* ---------- Notifications ---------- */

  function renderNotifs() {
    const unread = NOTIFS.filter(n => n.unread).length;
    document.querySelectorAll('[data-notif-icon]').forEach(img => {
      img.src = unread ? img.dataset.srcUnread : img.dataset.srcRead;
    });
    document.querySelectorAll('[data-unread-dot]').forEach(dot => dot.classList.toggle('hidden', !unread));

    const panel = document.getElementById('dd-notif');
    if (!panel) return;
    panel.innerHTML = `
      <div class="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div class="flex items-center gap-2">
          <p class="text-sm font-extrabold text-ink">Notifikasi</p>
          ${unread ? `<span class="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-bold text-brand">${unread} baru</span>` : ''}
        </div>
        <button type="button" data-notif-read-all ${unread ? '' : 'disabled'}
          class="text-xs font-bold text-brand hover:underline disabled:cursor-default disabled:text-ink-muted disabled:no-underline">Tandai semua dibaca</button>
      </div>
      <ul class="max-h-[340px] overflow-y-auto py-1">
        ${NOTIFS.map((n, i) => `
          <li>
            <button type="button" data-notif="${i}" class="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-page">
              <span class="mt-[5px] size-2 shrink-0 rounded-full ${n.unread ? 'bg-[#2ea9e2]' : 'bg-transparent'}"></span>
              <span class="flex min-w-0 flex-col gap-0.5">
                <span class="text-[13px] ${n.unread ? 'font-bold text-ink' : 'font-semibold text-ink-body'}">${n.title}</span>
                <span class="text-xs leading-[18px] text-ink-body">${n.body}</span>
                <span class="mt-0.5 text-[11px] font-medium text-ink-muted">${n.time}</span>
              </span>
            </button>
          </li>`).join('')}
      </ul>
      <div class="border-t border-line p-2">
        <button type="button" data-soon="Semua notifikasi" class="w-full rounded-lg py-2 text-xs font-bold text-brand transition hover:bg-page">Lihat semua notifikasi</button>
      </div>`;
  }

  function notify(n) {
    NOTIFS.unshift({ time: 'Baru saja', unread: true, ...n });
    renderNotifs();
  }

  document.getElementById('dd-notif')?.addEventListener('click', e => {
    const item = e.target.closest('[data-notif]');
    if (item) { NOTIFS[item.dataset.notif].unread = false; renderNotifs(); }
    if (e.target.closest('[data-notif-read-all]')) {
      NOTIFS.forEach(n => { n.unread = false; });
      renderNotifs();
      toast('Semua notifikasi ditandai sudah dibaca');
    }
  });

  /* ---------- Profile & logout ---------- */

  const menuItem = (action, ic, label, extra = 'text-ink hover:bg-page') =>
    `<button type="button" data-profile-action="${action}" class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-semibold transition ${extra}">${icon(ic)}${label}</button>`;

  function renderProfile() {
    const panel = document.getElementById('dd-profile');
    if (!panel) return;
    panel.innerHTML = `
      <div class="flex items-center gap-3 border-b border-line px-4 py-4">
        <img src="${USER.avatar}" alt="" width="40" height="40" class="size-10 shrink-0 rounded-full" />
        <div class="flex min-w-0 flex-col gap-0.5">
          <p class="truncate text-sm font-bold text-ink">${USER.name}</p>
          <p class="truncate text-xs text-ink-body">${USER.email}</p>
          <span class="mt-1 w-fit rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-bold text-brand">${USER.role}</span>
        </div>
      </div>
      <div class="p-1.5 text-ink-body">
        ${menuItem('Profil Saya', 'user', 'Profil Saya')}
        ${menuItem('Pengaturan Akun', 'gear', 'Pengaturan Akun')}
        ${menuItem('Pusat Bantuan', 'help', 'Pusat Bantuan')}
      </div>
      <div class="border-t border-line p-1.5">
        ${menuItem('logout', 'logout', 'Keluar', 'text-red-600 hover:bg-red-50')}
      </div>`;
  }

  function confirmLogout() {
    const modal = openModal({
      title: 'Keluar dari EVALIO?',
      desc: 'Anda perlu masuk kembali untuk mengakses aplikasi-aplikasi EVALIO.',
      body: `
        <div class="mt-6 flex justify-end gap-2.5">
          <button type="button" data-modal-close class="rounded-xl border border-line px-4 py-2.5 text-[13px] font-bold text-ink-body transition hover:border-sky-300">Batal</button>
          <button type="button" data-confirm-logout autofocus class="rounded-xl bg-red-600 px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-red-700">Ya, Keluar</button>
        </div>`,
    });
    modal.el.querySelector('[data-confirm-logout]').addEventListener('click', () => {
      modal.close();
      showSignedOut();
    });
  }

  function showSignedOut() {
    document.title = 'Keluar — EVALIO';
    document.body.innerHTML = `
      <main class="grid min-h-screen place-items-center bg-gradient-to-b from-sky-100 to-page p-4">
        <div class="w-full max-w-[400px] rounded-[20px] border border-line bg-white p-8 text-center shadow-pop animate-pop-in">
          <img src="assets/img/logo-evalio.png" alt="EVALIO — Assessment Work by SAU" class="mx-auto h-8 w-[116px] object-cover" />
          <span class="mx-auto mt-7 grid size-12 place-items-center rounded-full bg-sky-50 text-brand">${icon('logout', 'size-5')}</span>
          <h1 class="mt-4 text-xl font-extrabold tracking-[-0.2px] text-ink">Anda telah keluar</h1>
          <p class="mt-2 text-sm leading-[21px] text-ink-body">Sesi Anda di EVALIO sudah berakhir. Sampai jumpa lagi, ${USER.first}!</p>
          <a href="index.html" class="mt-7 block w-full rounded-xl bg-brand py-3 text-sm font-bold text-white transition hover:brightness-110">Masuk kembali</a>
        </div>
      </main>`;
  }

  document.getElementById('dd-profile')?.addEventListener('click', e => {
    const item = e.target.closest('[data-profile-action]');
    if (!item) return;
    closeDropdowns();
    if (item.dataset.profileAction === 'logout') confirmLogout();
    else toast(`Halaman ${item.dataset.profileAction} segera hadir`);
  });

  // Placeholder actions that aren't part of the mockup yet.
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-soon]');
    if (!el) return;
    e.preventDefault();
    closeDropdowns();
    toast(`${el.dataset.soon} segera hadir`);
  });

  renderNotifs();
  renderProfile();

  return { icon, toast, openModal, notify, closeDropdowns, imagesReady };
})();
