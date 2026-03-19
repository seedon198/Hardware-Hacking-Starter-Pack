/* ═══════════════════════════════════════════════ §1 CONSTANTS & CONFIG */

const RAW_BASE = 'https://raw.githubusercontent.com/seedon198/Hardware-Hacking-Starter-Pack/main/';
const INDEX_URL = 'content-index.json';

const SECTIONS_META = [
  { num: 1, name: '01 — FOUNDATIONS' },
  { num: 2, name: '02 — PROTOCOLS' },
  { num: 3, name: '03 — FIRMWARE' },
  { num: 4, name: '04 — ATTACK VECTORS' },
  { num: 5, name: '05 — REVERSE ENGINEERING' },
  { num: 6, name: '06 — EMBEDDED SECURITY' },
  { num: 7, name: '07 — SPECIALIZED DOMAINS' },
  { num: 8, name: '08 — PROFESSIONAL' },
  { num: 9, name: '09 — RESOURCES' },
];

const LEARNING_PATHS = {
  BEGINNER: {
    label: 'BEGINNER',
    description: 'Foundations-first. No prior hardware knowledge required.',
    articles: [
      'sections/01-foundations/01-introduction',
      'sections/01-foundations/02-lab-setup',
      'sections/01-foundations/03-tools-equipment',
      'sections/01-foundations/04-basic-electronics',
      'sections/02-communication-protocols/index',
      'sections/02-communication-protocols/wired/01-uart-protocol',
      'sections/02-communication-protocols/wired/02-i2c-protocol',
      'sections/02-communication-protocols/wired/03-spi-protocol',
      'sections/03-firmware/01-firmware-analysis',
      'sections/08-professional/01-learning-path',
      'sections/08-professional/05-project-ideas',
      'sections/08-professional/06-glossary',
    ],
  },
  SOFTWARE_DEV: {
    label: 'SOFTWARE DEV',
    description: 'Firmware and software-adjacent attack paths. Best if you code.',
    articles: [
      'sections/01-foundations/01-introduction',
      'sections/01-foundations/04-basic-electronics',
      'sections/03-firmware/01-firmware-analysis',
      'sections/04-attack-vectors/index',
      'sections/04-attack-vectors/01-physical-access',
      'sections/04-attack-vectors/02-side-channel',
      'sections/04-attack-vectors/03-fault-injection',
      'sections/06-embedded-security/index',
      'sections/06-embedded-security/01-secure-boot',
      'sections/06-embedded-security/02-memory-protection',
      'sections/06-embedded-security/03-secure-communications',
      'sections/07-specialized-domains/02-iot-security',
      'sections/08-professional/04-legal-ethical',
    ],
  },
  ELECTRONICS_ENG: {
    label: 'ELECTRONICS ENG',
    description: 'Protocol-heavy and RE-focused. Great if you have EE background.',
    articles: [
      'sections/01-foundations/01-introduction',
      'sections/01-foundations/03-tools-equipment',
      'sections/01-foundations/04-basic-electronics',
      'sections/02-communication-protocols/index',
      'sections/02-communication-protocols/wired/01-uart-protocol',
      'sections/02-communication-protocols/wired/02-i2c-protocol',
      'sections/02-communication-protocols/wired/03-spi-protocol',
      'sections/02-communication-protocols/wired/04-jtag-swd',
      'sections/02-communication-protocols/wired/05-usb-protocol',
      'sections/02-communication-protocols/wired/06-ethernet-protocols',
      'sections/02-communication-protocols/wireless/01-rf-fundamentals',
      'sections/02-communication-protocols/wireless/06-rfid-nfc',
      'sections/05-reverse-engineering/index',
      'sections/05-reverse-engineering/01-re-fundamentals',
      'sections/05-reverse-engineering/02-pcb-analysis',
      'sections/05-reverse-engineering/03-component-id',
      'sections/05-reverse-engineering/04-circuit-extraction',
      'sections/04-attack-vectors/01-physical-access',
      'sections/04-attack-vectors/04-hardware-implants',
    ],
  },
};

/* ═══════════════════════════════════════════════ §2 THEME */

const LS_THEME = 'hhsp_theme';

function applyTheme(theme) {
  document.body.classList.toggle('light', theme === 'light');
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = theme === 'light' ? '☾ DARK' : '☀ LIGHT';
}

function initTheme() {
  const saved = localStorage.getItem(LS_THEME) || 'dark';
  applyTheme(saved);
  document.getElementById('themeBtn').addEventListener('click', () => {
    const next = document.body.classList.contains('light') ? 'dark' : 'light';
    localStorage.setItem(LS_THEME, next);
    applyTheme(next);
  });
}
