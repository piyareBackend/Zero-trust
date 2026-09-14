/* Zero Trust video watermark worker — FFmpeg.wasm, local-only. */
self.onmessage = async ({data}) => {
  try {
    self.postMessage({type:'progress',value:3});
    importScripts('https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg.js');
    const FFmpeg = self.FFmpeg?.FFmpeg;
    if(!FFmpeg) throw new Error('FFmpeg.wasm runtime unavailable');
    const ffmpeg = new FFmpeg();
    ffmpeg.on('progress', ({progress}) => self.postMessage({type:'progress',value:Math.max(5,Math.min(99,Math.round(progress*100)))}));
    ffmpeg.on('log', ({message}) => self.postMessage({type:'log',message}));
    await ffmpeg.load({
      coreURL:'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
      wasmURL:'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm'
    });
    self.postMessage({type:'progress',value:10});
    await ffmpeg.writeFile('input', new Uint8Array(data.data));
    const box = maskBounds(data.mask, data.width, data.height);
    if(!box) throw new Error('Draw a watermark mask or choose a preset first.');
    const start=Math.max(0,Number(data.start)||0), end=Math.max(start,Number(data.end)||0);
    const enable=`between(t,${start},${end})`;
    let xExpr=String(Math.round(box.x)), yExpr=String(Math.round(box.y));
    if(Array.isArray(data.keyframes)&&data.keyframes.length>=2){
      const k=[...data.keyframes].sort((a,b)=>a.t-b.t);
      xExpr=piecewise(k,'x',box.x); yExpr=piecewise(k,'y',box.y);
    }
    const vf=`delogo=x=${xExpr}:y=${yExpr}:w=${Math.max(1,Math.round(box.w))}:h=${Math.max(1,Math.round(box.h))}:enable='${enable}'`;
    self.postMessage({type:'progress',value:20});
    const rc=await ffmpeg.exec(['-i','input','-vf',vf,'-c:v','libx264','-preset','ultrafast','-crf','18','-c:a','aac','-b:a','160k','-movflags','+faststart','output.mp4']);
    if(rc!==0) throw new Error(`FFmpeg exited with code ${rc}`);
    const out=await ffmpeg.readFile('output.mp4');
    await ffmpeg.deleteFile('input').catch(()=>{});await ffmpeg.deleteFile('output.mp4').catch(()=>{});
    self.postMessage({type:'progress',value:100});
    self.postMessage({type:'result',data:out.buffer},[out.buffer]);
  } catch(e){self.postMessage({type:'error',message:e?.message||String(e)});}
};
function maskBounds(buffer,w,h){
  if(!buffer)return null;const m=new Uint8Array(buffer);let minX=w,minY=h,maxX=-1,maxY=-1;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(m[(y*w+x)*4]>8){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y}}
  return maxX<0?null:{x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1};
}
function piecewise(keys,field,fallback){
  if(keys.length<2)return String(Math.round(fallback));
  const exprs=[];
  for(let i=0;i<keys.length-1;i++){const a=keys[i],b=keys[i+1];const av=Number(a[field]??fallback),bv=Number(b[field]??fallback),dt=Math.max(.001,Number(b.t)-Number(a.t));exprs.push(`if(between(t,${a.t},${b.t}),${av}+(${bv-av})*(t-${a.t})/${dt},`)}
  const tail=Number(keys[keys.length-1][field]??fallback);return exprs.join('')+tail+')'.repeat(exprs.length);
}
