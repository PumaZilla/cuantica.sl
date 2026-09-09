# Run in the Higgsfield sandbox with source MP4s under motion/.
# Requires rembg, onnxruntime, scipy, numpy, Pillow and ffmpeg.
import os, subprocess, json, time
os.environ['OMP_NUM_THREADS']='2'
from scipy import ndimage
from rembg import new_session, remove
from PIL import Image, ImageFilter, ImageChops
import numpy as np

session=new_session('u2netp', providers=['CPUExecutionProvider'])
os.makedirs('solid',exist_ok=True)
for name in ['ceo','hacker','cientifica','redes','perro','ascent']:
 path='motion/'+name+'.mp4'
 info=json.loads(subprocess.check_output(['ffprobe','-v','quiet','-show_streams','-of','json',path]))['streams'][0]
 w=640; h=round(int(info['height'])/int(info['width'])*w/2)*2
 dec=subprocess.Popen(['ffmpeg','-v','error','-i',path,'-vf',f'scale={w}:{h},fps=24','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
 enc=subprocess.Popen(['ffmpeg','-v','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{w*2}x{h}','-r','24','-i','-','-c:v','libx264','-preset','fast','-crf','20','-g','12' if name=='ascent' else '48','-pix_fmt','yuv420p','-movflags','+faststart','-an','-y','solid/'+name+'.mp4'],stdin=subprocess.PIPE)
 count=0
 while True:
  data=dec.stdout.read(w*h*3)
  if len(data)!=w*h*3: break
  rgb=Image.frombytes('RGB',(w,h),data)
  pixels=np.asarray(rgb)
  candidate=pixels.max(axis=2)<18
  seeds=np.zeros((h,w),dtype=bool)
  seeds[0,:]=candidate[0,:];seeds[-1,:]=candidate[-1,:]
  seeds[:,0]=candidate[:,0];seeds[:,-1]=candidate[:,-1]
  background=ndimage.binary_propagation(seeds,mask=candidate)
  foreground=ndimage.binary_fill_holes(~background)
  if name!='ascent':
   for row in range(int(h*.55),h):
    xs=np.flatnonzero(foreground[row])
    if len(xs)>8: foreground[row,xs[0]:xs[-1]+1]=True
  mask=Image.fromarray(foreground.astype('uint8')*255).filter(ImageFilter.GaussianBlur(.65))
  ai=np.asarray(remove(rgb,session=session,only_mask=True),dtype=np.float32)/255
  ai=np.clip((ai-.18)/.65,0,1); ai=ai*ai*(3-2*ai)
  ai_mask=Image.fromarray((ai*255).astype('uint8')).filter(ImageFilter.GaussianBlur(.7))
  mask=ImageChops.lighter(mask,ai_mask)
  if count==0:
   rgba=rgb.copy();rgba.putalpha(mask);rgba.save('solid/'+name+'.webp',quality=90)
  packed=Image.new('RGB',(w*2,h));packed.paste(rgb,(0,0));packed.paste(mask.convert('RGB'),(w,0))
  enc.stdin.write(packed.tobytes());count+=1
 enc.stdin.close();enc.wait();dec.wait()
 if enc.returncode or dec.returncode: raise RuntimeError('Video conversion failed: '+name)
 print(name,count,flush=True)

