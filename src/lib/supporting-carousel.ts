export function initSupportingCarousel(signal: AbortSignal) {
 const viewport = document.querySelector<HTMLElement>('.supporting-viewport');
 const track = viewport?.querySelector<HTMLElement>('.supporting-track');
 const group = track?.querySelector<HTMLElement>('.supporting-grid');
 if (!viewport || !track || !group) return;
 let offset = 0;
 let touchX = 0;
 let touchY = 0;
 const wrap = (value: number, length: number) => ((value % length) + length) % length;
 function advance(delta: number) {
   const width = group!.getBoundingClientRect().width;
   if (!width) return;
   const animation = track!.getAnimations()[0];
   if (animation) {
     // Seek the existing drift, including while hover or the pause button pauses it.
     const duration = Number(animation.effect!.getTiming().duration);
     animation.currentTime = wrap(Number(animation.currentTime ?? 0) + delta / width * duration, duration);
   } else {
     // Reduced motion still allows deliberate navigation without automatic movement.
     offset = wrap(offset + delta, width);
     track!.style.transform = `translateX(${-offset}px)`;
   }
 }
 viewport.addEventListener('wheel', event => {
   if (event.ctrlKey) return;
   const delta = event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX;
   if (!delta || (!event.shiftKey && Math.abs(event.deltaY) > Math.abs(delta))) return;
   event.preventDefault();
   advance(delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientWidth : 1));
 }, {passive: false, signal});
 viewport.addEventListener('touchstart', event => {
   touchX = event.touches[0].clientX;
   touchY = event.touches[0].clientY;
 }, {passive: true, signal});
 viewport.addEventListener('touchmove', event => {
   if (event.touches.length !== 1) return;
   const {clientX, clientY} = event.touches[0];
   const dx = touchX - clientX;
   const dy = touchY - clientY;
   touchX = clientX;
   touchY = clientY;
   if (Math.abs(dx) <= Math.abs(dy)) return;
   event.preventDefault();
   advance(dx);
 }, {passive: false, signal});
 viewport.addEventListener('keydown', event => {
   if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
   event.preventDefault();
   const card = group.querySelector<HTMLElement>('.supporting-person')!;
   advance((card.getBoundingClientRect().width + 16) * (event.key === 'ArrowRight' ? 1 : -1));
 }, {signal});
}
