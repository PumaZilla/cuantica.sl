"""Prepare the accepted Higgsfield clip as bounded browser image sequences."""
from pathlib import Path
import subprocess,json
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[2]
FF=Path('/tmp/cuantica-media-tools/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1')
source=ROOT/'references/celestial/orbit-original.mp4'
public=ROOT/'web/public/media/celestial'
for label,width in [('desktop',1600),('mobile',960)]:
 dest=public/label;dest.mkdir(parents=True,exist_ok=True)
 subprocess.run([str(FF),'-hide_banner','-loglevel','error','-i',str(source),'-an','-vf',f'fps=24,scale={width}:-2','-c:v','libwebp','-quality','78','-start_number','0',str(dest/'frame-%03d.webp')],check=True)
 frames=sorted(dest.glob('frame-*.webp'));im=Image.open(frames[0]);
 manifest={'count':len(frames),'width':im.width,'height':im.height,'pattern':f'/media/celestial/{label}/frame-{{index}}.webp','padding':3,'fps':24,'bytes':sum(f.stat().st_size for f in frames),'poster':'/media/celestial/poster.webp'}
 (dest/'manifest.json').write_text(json.dumps(manifest,indent=2))
 if label=='desktop':
  (public/'manifest.json').write_text(json.dumps(manifest|{'mobileManifest':'/media/celestial/mobile/manifest.json'},indent=2))
  im.save(public/'poster.webp',quality=88)
  sheet=Image.new('RGB',(1200,760),'#101510');draw=ImageDraw.Draw(sheet)
  for i in range(12):
   n=round(i*(len(frames)-1)/11);fr=Image.open(frames[n]);fr.thumbnail((300,169));x=i%4*300;y=i//4*250;sheet.paste(fr,(x,y));draw.text((x+10,y+178),f'{n/24:.2f} s',fill='white')
  sheet.save(ROOT/'references/celestial/motion-contact.jpg')
 print(label,manifest)
