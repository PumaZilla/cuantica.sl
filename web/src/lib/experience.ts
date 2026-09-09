export function initExperience() {
 const root = document.documentElement;
 const countdown=document.querySelector<HTMLElement>('#offer-countdown');
 const yearSeconds=365.25*24*60*60;
 let offerDeadline=Date.now()+27.9*yearSeconds*1000;
 try{
   const saved=Number(localStorage.getItem('cuantica-offer-deadline-v1'));
   if(Number.isFinite(saved)&&saved>0)offerDeadline=saved;
   else localStorage.setItem('cuantica-offer-deadline-v1',String(offerDeadline));
 }catch{}
 function tickOffer(){
   if(!countdown||document.hidden)return;
   let remaining=Math.max(0,Math.floor((offerDeadline-Date.now())/1000));
   const years=Math.floor(remaining/yearSeconds);remaining-=years*yearSeconds;
   const days=Math.floor(remaining/86400);remaining%=86400;
   const hours=Math.floor(remaining/3600),minutes=Math.floor(remaining%3600/60),seconds=Math.floor(remaining%60);
   countdown.textContent=`${years} años · ${days} días · ${[hours,minutes,seconds].map(n=>String(n).padStart(2,'0')).join(':')}`;
 }
 tickOffer();
 const offerInterval=window.setInterval(tickOffer,1000);
 const stage = document.querySelector<HTMLElement>('.film-stage')!;
 const story = document.querySelector<HTMLElement>('.film-scroll')!;
 const canvas = document.querySelector<HTMLCanvasElement>('#film-canvas')!;
 const ctx = canvas.getContext('2d');
 const preference = matchMedia('(prefers-reduced-motion: reduce)');
 const toggles = [...document.querySelectorAll<HTMLButtonElement>('#motion-toggle, #hero-motion-toggle')];
 const saveData = Boolean((navigator as Navigator & {connection?:{saveData?:boolean}}).connection?.saveData);
 let reduced = preference.matches || saveData;
 try { const saved = localStorage.getItem('cuantica-reduced'); if(saved !== null) reduced = saved === 'true'; } catch {}
 let raf = 0, alive = true, visible = false, current = -1, wanted = 0;
 let manifest: {count:number; width:number; height:number; pattern:string; padding:number} | null = null;
 let manifestRequested = false;
 let cacheLimit = 20;
 let playbackFrames: number[] = [];
 let wantedPosition = 0;
 let releaseProgress = 1;
 const cache = new Map<number, ImageBitmap>();
 const pending = new Set<number>();
 const failures = new Map<number,number>();
 const abort = new AbortController();
 const clamp = (n:number) => Math.min(1,Math.max(0,n));
 // Play the approved continuous take through its final frame.
 const requestedEndFrame = Number(story.dataset.endFrame);
 const lastFrame = () => manifest ? Math.min(manifest.count-1, Number.isInteger(requestedEndFrame) && requestedEndFrame >= 0 ? requestedEndFrame : manifest.count-1) : 0;
 function schedule(){ if (!raf && alive) raf=requestAnimationFrame(render); }
 function loadManifest(){
   if(manifestRequested || reduced)return;
   manifestRequested=true;
   fetch(matchMedia('(max-width: 680px)').matches ? story.dataset.mobileManifest! : story.dataset.manifest!,{signal:abort.signal}).then(r=>{if(!r.ok)throw Error('Missing sequence');return r.json();}).then(data=>{
     if(!Number.isInteger(data.count)||data.count<1||typeof data.pattern!=='string')throw Error('Invalid sequence');
     manifest=data;
     // Bound decoded image memory as source resolution increases.
     cacheLimit=Math.max(5,Math.min(20,Math.floor(160*1024*1024/(data.width*data.height*4))));
     const firstFrame=Math.min(lastFrame(),Math.max(0,Math.floor(Number(story.dataset.startFrame)||0)));
     playbackFrames=Array.from({length:lastFrame()-firstFrame+1},(_,index)=>index+firstFrame);
     const releaseFrame=Number(story.dataset.releaseFrame);
     releaseProgress=Number.isFinite(releaseFrame)&&lastFrame()>firstFrame
       ? Math.max(.01,clamp((releaseFrame-firstFrame)/(lastFrame()-firstFrame))*.94) : 1;
     story.style.setProperty('--release-progress',String(releaseProgress));
     schedule();
   }).catch(()=>{/* The generated still remains a usable background if media cannot load. */});
 }
 function setMotion(keepStage=false){
   const rect=story.getBoundingClientRect();
   const onStage=rect.top<=0&&rect.bottom>innerHeight*.5;
   root.classList.toggle('reduced',reduced);
   for(const toggle of toggles){
     toggle.setAttribute('aria-pressed',String(reduced));
     toggle.textContent=reduced?'Activar movimiento':'Reducir movimiento';
     toggle.setAttribute('aria-label',reduced?'Activar el movimiento del universo':'Reducir el movimiento del universo');
   }
   canvas.style.opacity='0';current=-1;
   if(keepStage&&onStage)window.scrollTo({top:window.scrollY+rect.top,behavior:'instant'});
   loadManifest();schedule();
 }
 toggles.forEach(toggle=>toggle.addEventListener('click',()=>{reduced=!reduced;try{localStorage.setItem('cuantica-reduced',String(reduced));}catch{}setMotion(true);}));
 preference.addEventListener('change',event=>{reduced=event.matches;setMotion(true);},{signal:abort.signal});
 function paint(bitmap:ImageBitmap){
   if(!ctx)return;
   const w=canvas.width,h=canvas.height;
   const scale=Math.max(w/bitmap.width,h/bitmap.height);
   // One shared centered crop for poster and frames: David remains the mobile focal point.
   ctx.clearRect(0,0,w,h);
   ctx.drawImage(bitmap,(w-bitmap.width*scale)/2,(h-bitmap.height*scale)/2,bitmap.width*scale,bitmap.height*scale);
   ctx.globalAlpha=1;
   canvas.style.opacity='1';
 }
 function pump(){
   if(!manifest||reduced||!visible||document.hidden||!alive)return;
   const offsets=[0,1,-1,2,-2,3,-3,4,-4,5,-5,6,-6,7,-7].slice(0,cacheLimit);
   for(const offset of offsets){
     if(pending.size>=4)break;
     const index=playbackFrames[wantedPosition+offset];
     if(index===undefined||cache.has(index)||pending.has(index)||(failures.get(index)||0)>=2)continue;
     pending.add(index);
     const url=manifest.pattern.replace('{index}',String(index).padStart(manifest.padding,'0'));
     fetch(url,{signal:abort.signal}).then(r=>{if(!r.ok)throw Error(String(r.status));return r.blob();}).then(createImageBitmap).then(bitmap=>{
       if(!alive){bitmap.close();return;}
       cache.set(index,bitmap);
       if(cache.size>cacheLimit){const keys=[...cache.keys()].sort((a,b)=>Math.abs(b-wanted)-Math.abs(a-wanted));while(cache.size>cacheLimit){const k=keys.shift()!;cache.get(k)?.close();cache.delete(k);}}
     }).catch(()=>{failures.set(index,(failures.get(index)||0)+1);}).finally(()=>{pending.delete(index);schedule();});
   }
 }
 function render(){
   raf=0;
   if(!alive||document.hidden)return;
   const rect=story.getBoundingClientRect();
   // Continue playing as the stage exits after the release frame.
   const travel=Math.max(1,(story.offsetHeight-stage.offsetHeight)/releaseProgress);
   const progress=reduced?0:clamp(-rect.top/travel);
   stage.style.setProperty('--film-progress',String(progress));
   const smooth=(value:number)=>{const t=clamp(value);return t*t*(3-2*t);};
   stage.style.setProperty('--left-opacity',String(1-smooth((progress-.15)/.3)));
   stage.style.setProperty('--right-opacity',String(1-smooth((progress-.15)/.3)));
   stage.style.setProperty('--left-rise',String(clamp(progress/.6)));
   stage.style.setProperty('--right-rise',String(clamp(progress/.6)));
   const releaseFraction=clamp(releaseProgress/.94);
   const releaseDistance=travel*releaseProgress;
   // Fit the closing frames into the viewport exit so the full ending remains visible.
   const frameProgress=releaseProgress<1 && -rect.top>releaseDistance
     ? releaseFraction+(1-releaseFraction)*clamp((-rect.top-releaseDistance)/(stage.offsetHeight*.9))
     : clamp(progress/.94);
   wantedPosition=Math.round(frameProgress*Math.max(0,playbackFrames.length-1));
   wanted=playbackFrames[wantedPosition]??0;
   if(reduced){canvas.style.opacity='0';return;}
   // Start immediately on scroll; retain only the 6% closing hold.
   if(cache.size){
     const nearest=cache.has(wanted)?wanted:[...cache.keys()].sort((a,b)=>Math.abs(a-wanted)-Math.abs(b-wanted))[0];
     if(current!==nearest){
       paint(cache.get(nearest)!);current=nearest;
     }
   }
   stage.dataset.frame=String(current);
   stage.dataset.targetFrame=String(wanted);
   pump();
 }
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)schedule();},{rootMargin:'200px'});observer.observe(story);
 const resize=new ResizeObserver(()=>{const ratio=Math.min(devicePixelRatio,2);canvas.width=Math.round(stage.clientWidth*ratio);canvas.height=Math.round(stage.clientHeight*ratio);current=-1;schedule();});resize.observe(stage);
 window.addEventListener('scroll',schedule,{passive:true,signal:abort.signal});
 document.addEventListener('visibilitychange',schedule,{signal:abort.signal});
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
 window.addEventListener('pagehide',event=>{if(event.persisted)return;alive=false;clearInterval(offerInterval);abort.abort();cancelAnimationFrame(raf);observer.disconnect();resize.disconnect();cache.forEach(bitmap=>bitmap.close());cache.clear();},{once:true});
}
