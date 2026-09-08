import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
http.createServer((req,res)=>{
 const p=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
 if(!p.startsWith(root+'/')){res.writeHead(403).end();return;}
 if(req.method==='PUT'&&p.startsWith(root+'/references/')){const stream=fs.createWriteStream(p);req.pipe(stream);stream.on('finish',()=>res.end('ok'));return;}
 if(!fs.existsSync(p)||!fs.statSync(p).isFile()){res.writeHead(404).end();return;}
 const size=fs.statSync(p).size;const type=p.endsWith('.mov')?'video/mp4':p.endsWith('.jpg')?'image/jpeg':p.endsWith('.html')?'text/html':'application/octet-stream';
 const range=req.headers.range;
 if(range){const [a,b]=range.replace('bytes=','').split('-');const start=Number(a),end=b?Math.min(Number(b),size-1):size-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1,'Content-Type':type});fs.createReadStream(p,{start,end}).pipe(res);}
 else{res.writeHead(200,{'Content-Length':size,'Content-Type':type,'Accept-Ranges':'bytes'});fs.createReadStream(p).pipe(res);}
}).listen(4322,'127.0.0.1');
