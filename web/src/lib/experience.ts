export function initExperience() {
 const root = document.documentElement;
 const stage = document.querySelector<HTMLElement>('.film-stage')!;
 const story = document.querySelector<HTMLElement>('.film-scroll')!;
 const canvas = document.querySelector<HTMLCanvasElement>('#film-canvas')!;
 const ctx = canvas.getContext('2d');
 const preference = matchMedia('(prefers-reduced-motion: reduce)');
 const toggle = document.querySelector<HTMLButtonElement>('#motion-toggle')!;
 let reduced = preference.matches;
 try { const saved = localStorage.getItem('cuantica-reduced'); if(saved !== null) reduced = saved === 'true'; } catch {}
 let raf = 0, alive = true, visible = false, current = -1, wanted = 0;
 let manifest: {count:number; width:number; height:number; pattern:string; padding:number} | null = null;
 const cache = new Map<number, ImageBitmap>();
 const pending = new Set<number>();
 const failures = new Map<number,number>();
 const abort = new AbortController();
 const saveData = Boolean((navigator as Navigator & {connection?:{saveData?:boolean}}).connection?.saveData);
 const clamp = (n:number) => Math.min(1,Math.max(0,n));
 function schedule(){ if (!raf && alive) raf=requestAnimationFrame(render); }
 function setMotion(){
   root.classList.toggle('reduced',reduced);
   toggle.setAttribute('aria-pressed',String(reduced));
   toggle.textContent=reduced?'Activar movimiento':'Reducir movimiento';
   canvas.style.opacity='0';current=-1;schedule();
 }
 toggle.addEventListener('click',()=>{reduced=!reduced;try{localStorage.setItem('cuantica-reduced',String(reduced));}catch{}setMotion();});
 preference.addEventListener('change',event=>{reduced=event.matches;setMotion();},{signal:abort.signal});
 function paint(bitmap:ImageBitmap){
   if(!ctx)return;
   const w=canvas.width,h=canvas.height;
   const scale=Math.max(w/bitmap.width,h/bitmap.height);
   // Keep the original CEO on screen in the narrow portrait crop.
   ctx.clearRect(0,0,w,h);
   ctx.drawImage(bitmap,(w-bitmap.width*scale)*.64,(h-bitmap.height*scale)*.4,bitmap.width*scale,bitmap.height*scale);
   canvas.style.opacity='1';
 }
 function pump(){
   if(!manifest||reduced||saveData||!visible||document.hidden||!alive)return;
   const offsets=[0,1,-1,2,-2,3,-3,4,-4,5,-5];
   for(const offset of offsets){
     if(pending.size>=4)break;
     const index=wanted+offset;
     if(index<0||index>=manifest.count||cache.has(index)||pending.has(index)||(failures.get(index)||0)>=2)continue;
     pending.add(index);
     const url=manifest.pattern.replace('{index}',String(index).padStart(manifest.padding,'0'));
     fetch(url,{signal:abort.signal}).then(r=>{if(!r.ok)throw Error(String(r.status));return r.blob();}).then(createImageBitmap).then(bitmap=>{
       if(!alive){bitmap.close();return;}
       cache.set(index,bitmap);
       if(cache.size>16){const keys=[...cache.keys()].sort((a,b)=>Math.abs(b-wanted)-Math.abs(a-wanted));while(cache.size>16){const k=keys.shift()!;cache.get(k)?.close();cache.delete(k);}}
     }).catch(()=>{failures.set(index,(failures.get(index)||0)+1);}).finally(()=>{pending.delete(index);schedule();});
   }
 }
 function render(){
   raf=0;
   if(!alive||document.hidden)return;
   const rect=story.getBoundingClientRect();
   const travel=Math.max(1,story.offsetHeight-stage.offsetHeight);
   const progress=clamp((20-rect.top)/travel);
   stage.style.setProperty('--film-progress',String(progress));
   stage.style.setProperty('--caption-progress',String(reduced?1:clamp((progress-.3)/.3)));
   if(reduced||saveData){canvas.style.opacity='0';return;}
   // Reading hold, continuous movement, closing hold: native scroll is reversible.
   const frameProgress=clamp((progress-.15)/.7);
   if(manifest)wanted=Math.round(frameProgress*(manifest.count-1));
   if(cache.size){
     const nearest=cache.has(wanted)?wanted:[...cache.keys()].sort((a,b)=>Math.abs(a-wanted)-Math.abs(b-wanted))[0];
     if(current!==nearest){paint(cache.get(nearest)!);current=nearest;}
   }
   pump();
 }
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)schedule();},{rootMargin:'200px'});observer.observe(story);
 const resize=new ResizeObserver(()=>{const ratio=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(stage.clientWidth*ratio);canvas.height=Math.round(stage.clientHeight*ratio);current=-1;schedule();});resize.observe(stage);
 window.addEventListener('scroll',schedule,{passive:true,signal:abort.signal});
 document.addEventListener('visibilitychange',schedule,{signal:abort.signal});
 if(!saveData)fetch('/media/vision-v2/manifest.json',{signal:abort.signal}).then(r=>r.json()).then(data=>{manifest=data;schedule();}).catch(()=>{});
 setMotion();
 const dialog=document.querySelector<HTMLDialogElement>('#episode-dialog')!;
 const video=document.querySelector<HTMLVideoElement>('#episode-player')!;
 const error=document.querySelector<HTMLElement>('#player-error')!;
 let opener:HTMLElement|null=null;
 document.querySelectorAll<HTMLButtonElement>('[data-play]').forEach(button=>button.addEventListener('click',()=>{
   opener=button;error.hidden=true;
   if(!video.getAttribute('src'))video.src=video.dataset.src!;
   dialog.showModal();video.play().catch(()=>{/* Native controls remain available if playback needs another gesture. */});
 }));
 document.querySelector('#close-player')!.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{video.pause();opener?.focus({preventScroll:true});});
 video.addEventListener('error',()=>{error.hidden=false;});
 window.addEventListener('pagehide',event=>{if(event.persisted)return;alive=false;abort.abort();cancelAnimationFrame(raf);observer.disconnect();resize.disconnect();cache.forEach(bitmap=>bitmap.close());cache.clear();},{once:true});
}
