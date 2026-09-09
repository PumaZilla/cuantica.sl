import { initHeroMotion } from './hero-motion';
import { initSupportingCarousel } from './supporting-carousel';

export function initExperience() {
 const countdown=document.querySelector<HTMLElement>('#offer-countdown');
 const daySeconds=86400;
 const now=new Date();
 // 42 days plus the current clock time.
 const clockSeconds=now.getHours()*3600+now.getMinutes()*60+now.getSeconds();
 let offerDeadline=now.getTime()+(42*daySeconds+clockSeconds)*1000;
 try{
   const saved=Number(localStorage.getItem('cuantica-offer-deadline-v3'));
   if(Number.isFinite(saved)&&saved>0)offerDeadline=saved;
   else localStorage.setItem('cuantica-offer-deadline-v3',String(offerDeadline));
 }catch{}
 function tickOffer(){
   if(!countdown||document.hidden)return;
   let remaining=Math.max(0,Math.floor((offerDeadline-Date.now())/1000));
   const days=Math.floor(remaining/86400);remaining%=86400;
   const hours=Math.floor(remaining/3600),minutes=Math.floor(remaining%3600/60),seconds=Math.floor(remaining%60);
   countdown.textContent=`${days} días y ${[hours,minutes,seconds].map(n=>String(n).padStart(2,'0')).join(':')} horas`;
 }
 tickOffer();
 const offerInterval=window.setInterval(tickOffer,1000);
 const abort = new AbortController();
 initHeroMotion(abort.signal);
 initSupportingCarousel(abort.signal);
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
 window.addEventListener('pagehide',event=>{if(event.persisted)return;clearInterval(offerInterval);abort.abort();},{once:true});
}
