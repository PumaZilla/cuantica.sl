export function initHeroMotion(signal: AbortSignal) {
  const root = document.documentElement;
  const story = document.querySelector<HTMLElement>('.celestial')!;
  const stage = story.querySelector<HTMLElement>('.cosmic-stage')!;
  const shop = document.querySelector<HTMLElement>('#inventos')!;
  const forward = story.querySelector<HTMLVideoElement>('#hero-motion')!;
  const backward = story.querySelector<HTMLVideoElement>('#hero-reverse')!;
  const videos = [forward, backward];
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const toggles = [
    ...document.querySelectorAll<HTMLButtonElement>(
      '#motion-toggle, #hero-motion-toggle',
    ),
  ];
  const first = Number(story.dataset.startFrame);
  const last = Number(story.dataset.endFrame);
  const release = Number(story.dataset.releaseFrame);
  const fps = Number(story.dataset.fps);
  let reduced =
    preference.matches ||
    Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData,
    );
  try {
    const saved = localStorage.getItem('cuantica-reduced');
    if (saved !== null) reduced = saved === 'true';
  } catch {}
  let state: 'idle' | 'loading' | 'playing' | 'reversing' | 'released' =
    scrollY > innerHeight / 2 ? 'released' : 'idle';
  let direction: 'down' | 'up' = 'down';
  let active = forward;
  let failed = false;
  let raf = 0;
  let timeout = 0;
  let touchY = 0;
  let lockedY = scrollY;
  let previousY = scrollY;
  let run = 0;
  let startY = 0;
  let endY = 0;
  const clamp = (n: number) => Math.min(1, Math.max(0, n));
  const ease = (n: number) => {
    const t = clamp(n);
    return t * t * (3 - 2 * t);
  };
  const locked = () =>
    state === 'loading' || state === 'playing' || state === 'reversing';
  const topOf = (el: HTMLElement) => scrollY + el.getBoundingClientRect().top;
  function setState(next: typeof state) {
    state = next;
    stage.dataset.motionState = next;
  }
  function show(video: HTMLVideoElement) {
    videos.forEach((v) => {
      v.classList.toggle('is-current', v === video);
    });
  }
  function load() {
    if (reduced || failed) return;
    videos.forEach((video) => {
      if (!video.getAttribute('src')) {
        video.muted = true;
        video.src = video.dataset.src!;
        video.load();
      }
    });
  }
  function labels(frame: number) {
    // Keep the approved text timing relative to the original complete sequence.
    const progress = ((frame - first) / (192 - first)) * 0.94;
    const opacity = String(1 - ease((progress - 0.15) / 0.3));
    stage.style.setProperty('--left-opacity', opacity);
    stage.style.setProperty('--right-opacity', opacity);
    stage.style.setProperty('--left-rise', String(clamp(progress / 0.6)));
    stage.style.setProperty('--right-rise', String(clamp(progress / 0.6)));
  }
  function moveTo(y: number) {
    lockedY = Math.round(y);
    previousY = lockedY;
    if (Math.abs(scrollY - lockedY) > 0.5)
      window.scrollTo({ top: lockedY, behavior: 'instant' });
  }
  function unlock() {
    clearTimeout(timeout);
    cancelAnimationFrame(raf);
    root.classList.remove('hero-scroll-locked');
  }
  function complete() {
    if (!locked()) return;
    active.pause();
    if (Number.isFinite(active.duration))
      active.currentTime = (last - first) / fps;
    const finalFrame = direction === 'down' ? last : first;
    labels(finalFrame);
    stage.dataset.frame = String(finalFrame);
    moveTo(direction === 'down' ? topOf(shop) : topOf(story));
    setState(direction === 'down' ? 'released' : 'idle');
    unlock();
  }
  function fail() {
    run++;
    failed = true;
    videos.forEach((v) => {
      v.pause();
    });
    setState('released');
    unlock();
    story.classList.add('hero-static');
  }
  function tick() {
    if (!locked() || state === 'loading') return;
    const elapsed = active.currentTime * fps;
    const frame =
      direction === 'down'
        ? Math.min(last, first + elapsed)
        : Math.max(first, last - elapsed);
    stage.dataset.frame = String(Math.round(frame));
    labels(frame);
    // Both directions use the same path. Below frame 80 the page stays at the hero.
    moveTo(
      startY + (endY - startY) * ease((frame - release) / (last - release)),
    );
    raf = requestAnimationFrame(tick);
  }
  function begin(nextDirection: typeof direction) {
    if (locked() || reduced || failed) return;
    direction = nextDirection;
    active = direction === 'down' ? forward : backward;
    const thisRun = ++run;
    startY = topOf(story);
    endY = topOf(shop);
    lockedY = scrollY;
    setState('loading');
    root.classList.add('hero-scroll-locked');
    load();
    // Also bounds waiting on an unavailable video or a stalled connection.
    timeout = window.setTimeout(fail, 18000);
    active.currentTime = 0;
    active
      .play()
      .then(() => {
        if (thisRun !== run || !locked()) {
          active.pause();
          return;
        }
        show(active);
        setState(direction === 'down' ? 'playing' : 'reversing');
        tick();
      })
      .catch(() => {
        if (thisRun === run) fail();
      });
  }
  function enabled() {
    return !reduced && !failed && !document.querySelector('dialog[open]');
  }
  function intercept(event: Event, delta: number) {
    if (locked()) {
      event.preventDefault();
      return;
    }
    if (!enabled() || delta === 0) return;
    if (
      delta > 0 &&
      state === 'idle' &&
      Math.abs(story.getBoundingClientRect().top) < 2
    ) {
      event.preventDefault();
      begin('down');
    } else if (
      delta < 0 &&
      state === 'released' &&
      shop.getBoundingClientRect().top >= -2 &&
      scrollY > topOf(story) + 2
    ) {
      event.preventDefault();
      begin('up');
    }
  }
  window.addEventListener(
    'wheel',
    (e) => {
      if (!e.ctrlKey)
        intercept(e, Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : 0);
    },
    { passive: false, signal },
  );
  window.addEventListener(
    'touchstart',
    (e) => {
      touchY = e.touches[0]?.clientY ?? 0;
    },
    { passive: true, signal },
  );
  window.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length !== 1) return;
      const delta = touchY - e.touches[0].clientY;
      touchY = e.touches[0].clientY;
      intercept(e, Math.abs(delta) > 2 ? delta : 0);
    },
    { passive: false, signal },
  );
  window.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape' && locked()) {
        run++;
        complete();
        return;
      }
      const target = e.target as HTMLElement;
      if (
        target.closest(
          'input,textarea,select,button,a,[contenteditable="true"]',
        ) ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey
      )
        return;
      if (
        [
          'ArrowDown',
          'ArrowUp',
          'PageDown',
          'PageUp',
          ' ',
          'Home',
          'End',
        ].includes(e.key)
      ) {
        intercept(
          e,
          ['ArrowDown', 'PageDown', 'End'].includes(e.key) ||
            (e.key === ' ' && !e.shiftKey)
            ? 1
            : -1,
        );
      }
    },
    { signal },
  );
  window.addEventListener(
    'scroll',
    () => {
      if (locked()) {
        if (scrollY !== lockedY)
          window.scrollTo({ top: lockedY, behavior: 'instant' });
        return;
      }
      const upward = scrollY < previousY;
      previousY = scrollY;
      if (scrollY > topOf(shop) - 2 && state === 'idle') setState('released');
      // Catch a wheel/touch step that crosses the shop boundary from further down.
      if (
        upward &&
        enabled() &&
        state === 'released' &&
        shop.getBoundingClientRect().top >= 0 &&
        scrollY > topOf(story) + 2
      )
        begin('up');
    },
    { passive: true, signal },
  );
  videos.forEach((video) => {
    video.addEventListener(
      'loadeddata',
      () => {
        if (!locked() && state === 'idle' && video === forward) show(forward);
      },
      { signal },
    );
    video.addEventListener(
      'ended',
      () => {
        if (video === active) complete();
      },
      { signal },
    );
    video.addEventListener(
      'error',
      () => {
        fail();
      },
      { signal },
    );
  });
  function motion(keepStage = false) {
    const onStage =
      story.getBoundingClientRect().top <= 0 &&
      story.getBoundingClientRect().bottom > innerHeight * 0.5;
    run++;
    videos.forEach((v) => {
      v.pause();
    });
    unlock();
    setState(scrollY > topOf(story) + 2 ? 'released' : 'idle');
    root.classList.toggle('reduced', reduced);
    for (const toggle of toggles) {
      toggle.setAttribute('aria-pressed', String(reduced));
      toggle.textContent = reduced
        ? 'Activar movimiento'
        : 'Reducir movimiento';
      toggle.setAttribute(
        'aria-label',
        reduced
          ? 'Activar el movimiento del universo'
          : 'Reducir el movimiento del universo',
      );
    }
    if (keepStage && onStage) {
      moveTo(topOf(story));
      setState('idle');
      forward.currentTime = 0;
      show(forward);
      labels(first);
    }
    load();
  }
  toggles.forEach((toggle) => {
    toggle.addEventListener(
      'click',
      () => {
        reduced = !reduced;
        try {
          localStorage.setItem('cuantica-reduced', String(reduced));
        } catch {}
        motion(true);
      },
      { signal },
    );
  });
  preference.addEventListener(
    'change',
    (e) => {
      reduced = e.matches;
      motion(true);
    },
    { signal },
  );
  window.addEventListener(
    'resize',
    () => {
      startY = topOf(story);
      endY = topOf(shop);
    },
    { signal },
  );
  document.addEventListener(
    'visibilitychange',
    () => {
      if (document.hidden && locked()) {
        run++;
        complete();
      }
    },
    { signal },
  );
  window.addEventListener(
    'pagehide',
    () => {
      if (locked()) {
        run++;
        complete();
      }
    },
    { signal },
  );
  signal.addEventListener(
    'abort',
    () => {
      run++;
      videos.forEach((v) => {
        v.pause();
      });
      unlock();
    },
    { once: true },
  );
  setState(state);
  labels(first);
  motion();
}
