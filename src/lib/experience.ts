import { initHeroMotion } from './hero-motion';
import { initSupportingCarousel } from './supporting-carousel';

export function initExperience() {
  const countdown = document.querySelector<HTMLElement>('#offer-countdown');
  const daySeconds = 86400;
  const now = new Date();
  // 42 days plus the current clock time.
  const clockSeconds =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  let offerDeadline = now.getTime() + (42 * daySeconds + clockSeconds) * 1000;
  try {
    const saved = Number(localStorage.getItem('cuantica-offer-deadline-v3'));
    if (Number.isFinite(saved) && saved > 0) offerDeadline = saved;
    else
      localStorage.setItem('cuantica-offer-deadline-v3', String(offerDeadline));
  } catch {}
  function tickOffer() {
    if (!countdown || document.hidden) return;
    let remaining = Math.max(
      0,
      Math.floor((offerDeadline - Date.now()) / 1000),
    );
    const days = Math.floor(remaining / 86400);
    remaining %= 86400;
    const hours = Math.floor(remaining / 3600),
      minutes = Math.floor((remaining % 3600) / 60),
      seconds = Math.floor(remaining % 60);
    countdown.textContent = `${days} días y ${[hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':')} horas`;
  }
  tickOffer();
  const offerInterval = window.setInterval(tickOffer, 1000);
  const abort = new AbortController();
  initHeroMotion(abort.signal);
  initSupportingCarousel(abort.signal);
  let activePortrait: HTMLElement | null = null;
  function clearPortrait() {
    activePortrait?.classList.remove('is-portrait-active');
    activePortrait
      ?.querySelector('.portrait-toggle')
      ?.setAttribute('aria-pressed', 'false');
    activePortrait = null;
  }
  document.addEventListener(
    'pointerdown',
    (event) => {
      if (
        event.target instanceof Node &&
        !activePortrait?.contains(event.target)
      )
        clearPortrait();
    },
    { signal: abort.signal },
  );
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape') clearPortrait();
    },
    { signal: abort.signal },
  );
  document.querySelectorAll<HTMLElement>('.person-photo').forEach((photo) => {
    if (!photo.querySelector('.person-photo-alternate')) return;
    const card = photo.closest<HTMLElement>('.person, .supporting-person');
    if (!card) return;
    const name = photo.querySelector('img')?.alt || 'este personaje';
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'portrait-toggle';
    if (photo.closest('[aria-hidden="true"]')) toggle.tabIndex = -1;
    toggle.setAttribute('aria-label', `Mostrar foto alternativa de ${name}`);
    toggle.setAttribute('aria-pressed', 'false');
    function isPortraitTarget(target: EventTarget | null) {
      if (!(target instanceof Element)) return false;
      const control = target.closest(
        'a,button,input,select,textarea,summary,[contenteditable="true"]',
      );
      return !control || control === toggle;
    }
    const togglePortrait = () => {
      const active = activePortrait !== card;
      clearPortrait();
      if (active) {
        activePortrait = card;
        card.classList.add('is-portrait-active');
        toggle.setAttribute('aria-pressed', 'true');
      }
    };
    let handledPress = false;
    card.addEventListener(
      'pointerdown',
      (event) => {
        handledPress = false;
        if (
          !event.isPrimary ||
          event.pointerType === 'mouse' ||
          !isPortraitTarget(event.target)
        )
          return;
        togglePortrait();
        handledPress = true;
      },
      { signal: abort.signal },
    );
    card.addEventListener(
      'click',
      (event) => {
        // Touch generates a click after release; keyboard clicks still toggle.
        if (handledPress && event.detail !== 0) {
          handledPress = false;
          return;
        }
        handledPress = false;
        if (!isPortraitTarget(event.target)) return;
        if (
          !toggle.contains(event.target as Node) &&
          !matchMedia('(hover: none), (pointer: coarse)').matches
        )
          return;
        togglePortrait();
      },
      { signal: abort.signal },
    );
    photo.append(toggle);
  });
  const dialog = document.querySelector<HTMLDialogElement>('#episode-dialog')!;
  const playerMeta = document.querySelector<HTMLElement>('#player-meta');
  let opener: HTMLElement | null = null;
  document
    .querySelectorAll<HTMLButtonElement>('[data-play]')
    .forEach((button) => {
      button.addEventListener('click', () => {
        opener = button;
        if (playerMeta)
          playerMeta.textContent =
            button.dataset.productName || 'Video cuántico';
        dialog.showModal();
      });
    });
  document
    .querySelector('#close-player')!
    .addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      const b = dialog.getBoundingClientRect();
      if (
        event.clientX < b.left ||
        event.clientX > b.right ||
        event.clientY < b.top ||
        event.clientY > b.bottom
      )
        dialog.close();
    }
  });
  dialog.addEventListener('close', () => {
    opener?.focus({ preventScroll: true });
  });
  window.addEventListener(
    'pagehide',
    (event) => {
      if (event.persisted) return;
      clearInterval(offerInterval);
      abort.abort();
    },
    { once: true },
  );
}
