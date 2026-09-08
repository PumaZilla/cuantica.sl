type Span = { start: number; end: number };

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function fadeIn(p: number, start: number, end: number) {
  return smoothstep(start, end, p);
}

function fadeOut(p: number, start: number, end: number) {
  return 1 - smoothstep(start, end, p);
}

function trapezoid(p: number, inStart: number, inEnd: number, outStart: number, outEnd: number) {
  return Math.min(fadeIn(p, inStart, inEnd), fadeOut(p, outStart, outEnd));
}

function clamp01(x: number) {
  return Math.min(1, Math.max(0, x));
}

export function initScrollEngine() {
  const track = document.querySelector<HTMLElement>("#scroll-track");
  const dot = document.querySelector<HTMLElement>("#scroll-dot");
  const scroller = document.querySelector<HTMLElement>("#scroller");

  const segIds = ["seg-a", "seg-b", "seg-c", "seg-d", "seg-e"];
  const segs = segIds.map((id) => document.querySelector<HTMLVideoElement>(`#${id}`));

  const reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

  if (segs.some((v) => !v) || !scroller) return;
  const videos = segs as HTMLVideoElement[];

  for (const v of videos) {
    v.play()
      .then(() => v.pause())
      .catch(() => {});
  }

  // active windows (start of fade-in -> end of scrub range) used for local scrub timing,
  // evenly spaced and overlapping so each segment crossfades into the next
  const SPAN = 0.24;
  const wins: Span[] = videos.map((_, i) => {
    const start = (i * (1 - SPAN)) / (videos.length - 1);
    return { start, end: start + SPAN };
  });

  function seekIfNeeded(video: HTMLVideoElement, local: number) {
    const duration = video.duration;
    if (!duration || Number.isNaN(duration)) return;
    const target = clamp01(local) * duration;
    if (Math.abs(video.currentTime - target) > 0.033) {
      video.currentTime = target;
    }
  }

  function getProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return 0;
    return clamp01(window.scrollY / max);
  }

  function update() {
    const p = getProgress();

    for (let i = 0; i < videos.length; i++) {
      const win = wins[i];
      const isFirst = i === 0;
      const isLast = i === videos.length - 1;

      const inAlpha = isFirst ? 1 : fadeIn(p, win.start, win.start + 0.08);
      const outAlpha = isLast ? 1 : fadeOut(p, win.end - 0.08, win.end);
      const alpha = Math.min(inAlpha, outAlpha);

      videos[i].style.opacity = String(alpha);

      if (alpha > 0) {
        const local = (p - win.start) / (win.end - win.start);
        seekIfNeeded(videos[i], local);
      }
    }

    for (const el of reveals) {
      const inA = parseFloat(el.dataset.in || "0");
      const inB = parseFloat(el.dataset.inEnd || String(inA + 0.06));
      const outA = parseFloat(el.dataset.out || "1");
      const outB = parseFloat(el.dataset.outEnd || String(outA + 0.06));
      const a = trapezoid(p, inA, inB, outA, outB);
      el.style.opacity = String(a);
      const centerX = el.dataset.center ? "translateX(-50%) " : "";
      el.style.transform = `${centerX}translateY(${(1 - a) * 18}px)`;
    }

    if (track && dot) {
      const h = track.clientHeight - dot.clientHeight;
      dot.style.transform = `translateY(${p * h}px)`;
    }

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}
