import { createAlphaVideo } from './alpha-video';

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (v: number) => { const t = clamp(v); return t * t * (3 - 2 * t); };

export function initExperience() {
 const story = document.querySelector<HTMLElement>('#story')!;
 const stage = document.querySelector<HTMLElement>('#stage')!;
 const scenes = [...document.querySelectorAll<HTMLElement>('[data-scene]')];
 const portraits = [...document.querySelectorAll<HTMLElement>('[data-portrait]')];
 const portraitStage = document.querySelector<HTMLElement>('#portraits')!;
 const ascent = document.querySelector<HTMLElement>('#ascent-visual')!;
 const ascentVideo = document.querySelector<HTMLVideoElement>('#ascent-video')!;
 const films = portraits.map(el => el.querySelector<HTMLVideoElement>('video')!);
 const renderers = films.map((video, i) => createAlphaVideo(video, portraits[i].querySelector('canvas')!));
 const ascentRenderer = createAlphaVideo(ascentVideo, ascent.querySelector('canvas')!);
 const playing = new Set<HTMLVideoElement>();
 let playerOpen = false;
 const chapters = [...document.querySelectorAll<HTMLAnchorElement>('[data-chapter]')];
 const spaceDescription = document.querySelector<HTMLElement>('.scene-space .scene-description')!;
 const atmosphere = document.querySelector<HTMLElement>('.synth-atmosphere')!;
 const orbit = document.querySelector<HTMLElement>('.orbital-field')!;
 const caption = document.querySelector<HTMLElement>('.portrait-caption')!;
 const stat = document.querySelector<HTMLElement>('.stat')!;
 const progressBar = document.querySelector<HTMLElement>('#progress-bar')!;
 const progressNumber = document.querySelector<HTMLElement>('#progress-number')!;
 const canvas = document.querySelector<HTMLCanvasElement>('#universe')!;
 const ctx = canvas.getContext('2d');
 const motionButton = document.querySelector<HTMLButtonElement>('#motion-toggle')!;
 const mediaQuery = matchMedia('(prefers-reduced-motion: reduce)');
 let preference: string | null = null;
 try { preference = localStorage.getItem('cuantica-motion'); } catch {}
 let reduced = preference ? preference === 'reduce' : mediaQuery.matches;
 let current = 0, target = 0, trackHeight = 1;
 let width = innerWidth, height = innerHeight, lastTime = 0, raf = 0, active = -1;
 let pointerX = 0, pointerY = 0, driftX = 0, driftY = 0;
 let pageVisible = !document.hidden, stageVisible = true, needsRender = true, lastCanvasTime = 0;
 const stars = Array.from({length: 115}, (_,i) => ({x: ((i * 7919 + 331) % 10000) / 10000, y: ((i * 3571 + 97) % 10000) / 10000, z: .2 + ((i * 23) % 100) / 100, r: .4 + (i % 3) * .35}));
 const $ = (id: string) => document.getElementById(id)!;

 // Decode only nearby clips; keep the matching still if autoplay is unavailable.
 function loadFilm(video: HTMLVideoElement) {
  if (!video.getAttribute('src')) { video.src = video.dataset.src!; video.preload = 'auto'; video.load(); }
 }
 function syncPlayback() {
  films.forEach((video, i) => {
   const wanted = !!renderers[i] && !reduced && pageVisible && stageVisible && !playerOpen && Number(portraits[i].style.opacity || (i === 0 ? 1 : 0)) > .01;
   if (wanted && !playing.has(video)) {
    loadFilm(video); playing.add(video);
    video.play().then(() => { if (!playing.has(video)) video.pause(); }).catch(() => { playing.delete(video); });
   } else if (!wanted) { playing.delete(video); if (!video.paused) video.pause(); }
   portraits[i].classList.toggle('has-video', wanted && !!renderers[i]?.render());
  });
  ascent.classList.toggle('has-video', !reduced && pageVisible && stageVisible && !playerOpen && Number(ascent.style.opacity) > .001 && !!ascentRenderer?.render());
 }
 films.forEach(video => video.addEventListener('loadeddata', () => { syncPlayback(); needsRender = true; }));
 ascentVideo.addEventListener('loadeddata', () => { syncPlayback(); needsRender = true; });
 function motionState() {
  document.documentElement.classList.toggle('reduced-motion', reduced);
  motionButton.setAttribute('aria-pressed', String(reduced));
  motionButton.setAttribute('aria-label', reduced ? 'Activar animaciones' : 'Reducir animaciones');
  $('motion-label').textContent = reduced ? 'ACTIVAR MOVIMIENTO' : 'MENOS MOVIMIENTO';
  syncPlayback();
  needsRender = true;
 }
 motionState();
 motionButton.addEventListener('click', () => {
  reduced = !reduced;
  try { localStorage.setItem('cuantica-motion', reduced ? 'reduce' : 'full'); } catch {}
  motionState();
 });
 mediaQuery.addEventListener('change', e => {
  let saved = null; try { saved = localStorage.getItem('cuantica-motion'); } catch {}
  if (!saved) { reduced = e.matches; motionState(); }
 });
 function readScroll() { target = clamp((scrollY - story.offsetTop) / trackHeight); }
 function resize() {
  width = stage.clientWidth; height = stage.clientHeight;
  trackHeight = Math.max(1, story.offsetHeight - stage.offsetHeight);
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  readScroll(); needsRender = true;
 }
 resize(); current = target;
 window.addEventListener('resize', resize, {passive:true});
 window.addEventListener('scroll', readScroll, {passive:true});
 stage.addEventListener('pointermove', e => { pointerX = (e.clientX / width - .5) * 2; pointerY = (e.clientY / height - .5) * 2; }, {passive:true});
 stage.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; });
 new IntersectionObserver(([entry]) => {stageVisible = entry.isIntersecting;syncPlayback();needsRender = true;}, {threshold:0}).observe(stage);
 document.addEventListener('visibilitychange', () => {pageVisible = !document.hidden;syncPlayback();lastTime = 0;});

 // Native anchors remain usable without JS; use the measured sticky track for precision.
 document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
   const id = link.getAttribute('href')!.slice(1);
   const ids = ['vision','hacker','cientifica','redes','perro','ceo','orbita'];
   const index = ids.indexOf(id);
   if (index < 0) return;
   e.preventDefault();
   const y = story.offsetTop + trackHeight * index / 7;
   history.replaceState(null, '', '#' + id);
   scrollTo({top:y,behavior:reduced?'instant':'smooth'});
  });
 });

 function update(p: number) {
  const x = p * 7;
  const base = Math.min(6, Math.floor(x));
  const blend = base === 6 ? 0 : (reduced ? (x - base >= .82 ? 1 : 0) : smooth((x - base - .65) / .35));
  const next = Math.min(6, base + 1);
  const index = blend > .5 ? next : base;
  scenes.forEach((scene,i) => {
   const opacity = i === base ? 1 - blend : i === next ? blend : 0;
   scene.style.opacity = String(opacity);
   scene.style.visibility = opacity > .001 ? 'visible' : 'hidden';
   scene.style.transform = `translateY(${reduced?0:(i===base?-blend:(1-blend))*22}px)`;
   scene.setAttribute('aria-hidden',String(i!==index));
   scene.inert = i !== index;
  });
  const leaving = smooth((x - 5.45) / .55);
  portraits.forEach(img => {
   const key = img.dataset.portrait;
   const a = scenes[base]?.dataset.image === key ? 1 - blend : 0;
   const b = scenes[next]?.dataset.image === key && next !== base ? blend : 0;
   img.style.opacity = String((a+b)*(1-leaving));
   const transition = a ? blend : 1-blend;
   img.style.transform = reduced ? 'none' : `translateY(${transition*16}px) scale(${1+transition*.035})`;
   img.style.filter = reduced ? 'none' : `blur(${transition*2}px)`;
  });
  portraitStage.style.transform = `translate(calc(-50% + ${driftX*7}px),${driftY*5}px) scale(${1-leaving*.12})`;
  orbit.style.opacity = String(1-leaving*.9);
  if (!reduced) orbit.style.transform = `translate(-50%,-50%) rotate(${p*80+driftX*2}deg) scale(${1+leaving*.3})`;
  const space = smooth((x-5.6)/1.4);
  ascent.style.opacity = String(leaving);
  ascent.style.transform = reduced ? 'translate(-50%,-50%)' : `translate(-50%,calc(-50% - ${space*height*.32}px)) scale(${1-space*.84})`;
  spaceDescription.style.opacity = String(reduced ? 1 : 1-smooth((space-.45)/.3));
  atmosphere.style.opacity = String(1-space*.88);
  if (!reduced && ascentRenderer && x > 4.8) loadFilm(ascentVideo);
  if (!reduced && ascentVideo.readyState >= 2 && !ascentVideo.seeking) {
   const time = space * Math.max(0, ascentVideo.duration - .06);
   if (Math.abs(ascentVideo.currentTime - time) > .06) ascentVideo.currentTime = time;
  }
  syncPlayback();
  caption.style.opacity = String(1-leaving); stat.style.opacity = String(1-leaving);
  $('specimen').textContent = String(index+1).padStart(3,'0');
  progressBar.style.transform = `scaleX(${p})`;
  progressNumber.textContent = String(Math.round(p*100)).padStart(2,'0');
  if (index !== active) {
   active = index;
   const scene = scenes[index];
   $('role').textContent = scene.dataset.role ?? 'FUERA DE ÓRBITA';
   $('department').textContent = scene.dataset.department ?? 'UBICACIÓN DESCONOCIDA';
   $('stat-value').textContent = scene.dataset.stat ?? '∞';
   $('stat-unit').textContent = scene.dataset.unit ?? 'METROS SOBRE EL SUELO';
   chapters.forEach((a,i) => {if(i===index)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});
   const nextLink = document.querySelector<HTMLAnchorElement>('#scroll-next')!;
   nextLink.href = index < 6 ? chapters[index+1].getAttribute('href')! : '#episodio';
   // Start decoding the next portrait ahead of its transition.
   const nextKey = scenes[Math.min(index+1,5)].dataset.image;
   portraits.filter(el=>el.dataset.portrait===nextKey).forEach(el=>{
    const img=el.querySelector('img')!;img.loading='eager';img.decode().catch(()=>{});
    if (!reduced && renderers[portraits.indexOf(el)]) loadFilm(el.querySelector('video')!);
   });
  }
 }
 function draw(time: number) {
  if (!ctx) return;
  ctx.clearRect(0,0,width,height);
  const space = smooth((current*7-5.3)/1.7);
  for(const s of stars) {
   const sx = s.x*width + driftX*s.z*9;
   const sy = ((s.y*height + (reduced?0:time*.0017*s.z) + space*height*s.z*1.6) % height + height) % height;
   ctx.beginPath();ctx.fillStyle=`rgba(117,207,255,${(.1+space*.55)*s.z})`;
   ctx.arc(sx,sy,s.r*(1+space*.3),0,Math.PI*2);ctx.fill();
   if(space>.1&&!reduced){ctx.strokeStyle=`rgba(117,207,255,${space*.15*s.z})`;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx,sy+space*s.z*24);ctx.stroke();}
  }
  // Fine measuring marks, part of the laboratory identity.
  if(space<.95){ctx.strokeStyle=`rgba(173,118,255,${.09*(1-space)})`;ctx.lineWidth=.5;const y=height*.84;ctx.beginPath();for(let x=width*.48;x<width*.87;x+=12){ctx.moveTo(x,y);ctx.lineTo(x,y+(Math.round(x/12)%5===0?8:3));}ctx.stroke();}
 }
 function frame(time: number) {
  raf = requestAnimationFrame(frame);
  if (!pageVisible || !stageVisible) return;
  const dt = Math.min(64,lastTime?time-lastTime:16);lastTime=time;
  const smoothing = 1-Math.exp(-dt/105);
  current = reduced ? target : current+(target-current)*smoothing;
  driftX += ((reduced?0:pointerX)-driftX)*smoothing;driftY += ((reduced?0:pointerY)-driftY)*smoothing;
  if (Math.abs(current-target)<.00001) current=target;
  if(needsRender || !reduced || current!==target) update(current);
  if(needsRender || (!reduced&&time-lastCanvasTime>32)){draw(time);lastCanvasTime=time;}
  needsRender=false;
 }
 // Reduced motion still updates the selected character on every scroll.
 window.addEventListener('scroll',()=>{needsRender=true;},{passive:true});
 update(current);raf=requestAnimationFrame(frame);
 window.addEventListener('pagehide',()=>cancelAnimationFrame(raf));
 window.addEventListener('pageshow',e=>{if(e.persisted){lastTime=0;raf=requestAnimationFrame(frame);}});

 const dialog = document.querySelector<HTMLDialogElement>('#episode-dialog')!;
 const player = document.querySelector<HTMLVideoElement>('#episode-player')!;
 let opener: HTMLElement | null = null;
 document.querySelectorAll<HTMLButtonElement>('[data-play]').forEach(button=>button.addEventListener('click',()=>{
  opener = button;playerOpen = true;syncPlayback();dialog.showModal();document.body.classList.add('player-open');
  if(!player.getAttribute('src'))player.src=player.dataset.src!;
  player.play().catch(()=>{/* Native controls remain available if playback needs another gesture. */});
 }));
 $('close-player').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{player.pause();playerOpen = false;syncPlayback();document.body.classList.remove('player-open');opener?.focus();});
 player.addEventListener('error',()=>{$('player-error').hidden=false;});
}
