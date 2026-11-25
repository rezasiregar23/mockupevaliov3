// App card for the portal grid — each category gets its own identity
// (colour set in assets/css/app-card.css, background motif and tag here).
// Pinned apps render as a full-colour card with a "Disematkan" badge.

const CATEGORIES = {
  assessment:  { label: 'Assessment' },
  recruitment: { label: 'Recruitment' },
  kalibrasi:   { label: 'Kalibrasi' },
  repository:  { label: 'Repository' },
};

// Motifs are drawn on a 288×154 card and anchored to the right edge.
// Strokes use currentColor; var(--paper) masks lines behind filled shapes.
const motifSVG = inner =>
  `<svg viewBox="0 0 288 154" preserveAspectRatio="xMaxYMin meet" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

const MOTIFS = {
  // Target / radar with a score arc — measuring.
  assessment: motifSVG(`
    <circle cx="262" cy="72" r="20" stroke="currentColor" stroke-width="1.3"/>
    <circle cx="262" cy="72" r="40" stroke="currentColor" stroke-width="1.3"/>
    <circle cx="262" cy="72" r="62" stroke="currentColor" stroke-width="1.3"/>
    <circle cx="262" cy="72" r="86" stroke="currentColor" stroke-width="1.3" stroke-dasharray="1 6" stroke-linecap="round"/>
    <path d="M150 72H288M262 0V100" stroke="currentColor" stroke-dasharray="3 5"/>
    <path d="M200 72A62 62 0 0 1 262 10" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="262" cy="10" r="4.5" fill="currentColor"/>
    <circle cx="262" cy="72" r="5" fill="currentColor"/>`),

  // Network of people — finding and connecting candidates.
  recruitment: motifSVG(`
    <path d="M238.3 73.6L204 96M260.2 75.6L282 96M237.4 59.9L196 40M243.7 53.5L226 18M196 40L168 64M168 64L204 96M196 40L226 18" stroke="currentColor" stroke-width="1.3"/>
    <circle cx="250" cy="66" r="24" stroke="currentColor" stroke-dasharray="2 4" stroke-linecap="round"/>
    <circle cx="250" cy="66" r="14" fill="var(--paper)" stroke="currentColor" stroke-width="1.6"/>
    <circle cx="250" cy="61" r="4.2" stroke="currentColor" stroke-width="1.6"/>
    <path d="M242.5 74C242.5 68.5 257.5 68.5 257.5 74" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="204" cy="96" r="5.5" fill="currentColor"/><circle cx="282" cy="96" r="5" fill="currentColor"/>
    <circle cx="196" cy="40" r="4" fill="currentColor"/><circle cx="226" cy="18" r="3" fill="currentColor"/>
    <circle cx="168" cy="64" r="3" fill="currentColor"/>`),

  // Sliders on a tick scale — fine-tuning results.
  kalibrasi: motifSVG(`
    <path d="M168 30H284M168 54H284M168 78H284" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M168 30H246M168 54H204M168 78H264" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>
    <circle cx="246" cy="30" r="6" fill="var(--paper)" stroke="currentColor" stroke-width="2"/>
    <circle cx="204" cy="54" r="6" fill="var(--paper)" stroke="currentColor" stroke-width="2"/>
    <circle cx="264" cy="78" r="6" fill="var(--paper)" stroke="currentColor" stroke-width="2"/>
    <path d="M168 98v4M179 98v4M190 98v4M201 98v4M212 96v8M223 98v4M234 98v4M245 98v4M256 98v4M267 98v4M278 98v4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>`),

  // Stacked folders — archived results.
  repository: motifSVG(`
    <rect x="198" y="12" width="80" height="56" rx="9" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 4"/>
    <rect x="187" y="24" width="80" height="56" rx="9" fill="var(--paper)" stroke="currentColor" stroke-width="1.3"/>
    <path d="M176 46a7 7 0 0 1 7-7h17l7 7h42a7 7 0 0 1 7 7v32a7 7 0 0 1-7 7h-66a7 7 0 0 1-7-7z" fill="var(--paper)" stroke="currentColor" stroke-width="1.7"/>
    <path d="M188 62h40M188 71h52M188 80h30" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`),
};

const sparkle = (cx, cy, s) =>
  `M${cx} ${cy - s}Q${cx + s * 0.18} ${cy - s * 0.18} ${cx + s} ${cy}Q${cx + s * 0.18} ${cy + s * 0.18} ${cx} ${cy + s}` +
  `Q${cx - s * 0.18} ${cy + s * 0.18} ${cx - s} ${cy}Q${cx - s * 0.18} ${cy - s * 0.18} ${cx} ${cy - s}Z`;

const SPARKLES = motifSVG(`
  <path d="${sparkle(146, 27, 7)}" fill="currentColor"/>
  <path d="${sparkle(161, 45, 3.5)}" fill="currentColor"/>
  <path d="${sparkle(124, 15, 2.5)}" fill="currentColor" fill-opacity="0.7"/>`);

const ARROW_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.333 8h9.334M8 12.667 12.667 8 8 3.333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const PIN_ICON = `<svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.298 6.37267C14.2873 6.56565 14.2301 6.75319 14.1313 6.91933C14.0381 7.08427 13.9109 7.22744 13.758 7.33933C13.6914 7.38771 13.6132 7.41761 13.5313 7.426L12.358 7.57933C12.2278 7.6015 12.1072 7.66183 12.0113 7.75267C11.658 8.09267 11.298 8.41933 10.8047 8.93933L10.238 9.49933C10.1643 9.57581 10.1115 9.66993 10.0847 9.77267L9.458 12.2927C9.46067 12.3193 9.46067 12.3461 9.458 12.3727C9.37118 12.5681 9.23864 12.7397 9.07156 12.8732C8.90448 13.0066 8.70776 13.0979 8.498 13.1393H8.258C8.12737 13.1381 7.99742 13.1202 7.87133 13.086C7.66712 13.0234 7.4816 12.9111 7.33133 12.7593L5.638 11.0727L2.52467 14.186C2.42988 14.2743 2.30452 14.3224 2.17498 14.3201C2.04545 14.3178 1.92186 14.2654 1.83025 14.1737C1.73864 14.0821 1.68617 13.9585 1.68388 13.829C1.6816 13.6995 1.72968 13.5741 1.818 13.4793L4.93133 10.366L3.26467 8.69933C3.11564 8.54546 3.00587 8.35795 2.94467 8.15267C2.87696 7.94837 2.86545 7.72961 2.91133 7.51933C2.95049 7.31207 3.03975 7.11753 3.17133 6.95267C3.3046 6.78557 3.47608 6.65295 3.67133 6.566H3.75133L6.24467 5.89933C6.35512 5.86985 6.45613 5.81245 6.538 5.73267C7.46467 4.81933 7.78467 4.49933 8.29133 3.95267C8.37758 3.86135 8.43145 3.74424 8.44467 3.61933L8.60467 2.43933C8.6119 2.35514 8.64185 2.2745 8.69133 2.206C8.86187 1.97647 9.10169 1.80785 9.37538 1.72502C9.64907 1.64219 9.94214 1.64955 10.2113 1.746C10.3916 1.81245 10.5553 1.91706 10.6913 2.05267L13.9447 5.31933C14.0779 5.45459 14.1808 5.61674 14.2463 5.79495C14.3118 5.97315 14.3386 6.1633 14.3247 6.35267L14.298 6.37267Z" fill="currentColor"/></svg>`;

function appCardHTML(app, i) {
  const cat = CATEGORIES[app.category] || CATEGORIES.assessment;
  const pinLabel = app.pinned ? 'Lepas sematan' : 'Sematkan';
  return `
    <article class="app-card cat-${app.category}${app.pinned ? ' is-pinned' : ''}">
      <span class="app-card__motif" aria-hidden="true">${MOTIFS[app.category] || ''}</span>
      ${app.pinned ? `<span class="app-card__spark" aria-hidden="true">${SPARKLES}</span>` : ''}
      <a ${appLink(app)} class="app-card__link">
        <span class="app-card__tile"><img src="assets/icons/${app.icon}.svg" alt="" width="22" height="22" /></span>
        <span class="app-card__body">
          <span class="app-card__text">
            <span class="app-card__tag"><span class="app-card__dot"></span>${cat.label}</span>
            <span class="app-card__title">${app.name}</span>
            <span class="app-card__desc">${app.desc}</span>
          </span>
          <span class="app-card__go">${ARROW_ICON}</span>
        </span>
      </a>
      <button type="button" data-pin="${i}" aria-pressed="${app.pinned}" aria-label="${pinLabel} ${app.name}" title="${pinLabel}" class="app-card__pin">
        ${PIN_ICON}<span>Disematkan</span>
      </button>
    </article>`;
}
