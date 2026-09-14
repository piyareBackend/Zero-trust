/* Zero Trust local inpainting worker. Media bytes are never uploaded. */
self.onmessage = async ({data}) => {
  try {
    const {image, mask, width, height, mode='fast', feather=4, grain=15, color=50} = data;
    self.postMessage({type:'progress', value:5});
    if(mode==='ai') throw new Error('AI model asset is not bundled yet. Add /models/fastinpaint-int8.onnx; Fast mode is fully available now.');
    importScripts('https://docs.opencv.org/4.x/opencv.js');
    await waitForCV();
    self.postMessage({type:'progress', value:25});
    const rgba = new Uint8ClampedArray(image);
    const m = new Uint8Array(mask);
    const src = cv.matFromImageData(new ImageData(rgba, width, height));
    const maskMat = new cv.Mat(height,width,cv.CV_8UC1);
    for(let i=0;i<m.length;i+=4) maskMat.data[i/4]=m[i]>8?255:0;
    if(feather>0){const k=Math.max(1,Math.floor(feather)*2+1);const kernel=cv.getStructuringElement(cv.MORPH_ELLIPSE,new cv.Size(k,k));cv.GaussianBlur(maskMat,maskMat,new cv.Size(k,k),0);kernel.delete()}
    self.postMessage({type:'progress', value:45});
    const dst=new cv.Mat();
    cv.inpaint(src,maskMat,dst,3,mode==='ns'?cv.INPAINT_NS:cv.INPAINT_TELEA);
    self.postMessage({type:'progress', value:75});
    const out=new ImageData(width,height);
    dst.copyTo(cv.matFromImageData(out));
    // Subtle deterministic grain only inside the mask; avoids external randomness and keeps output reproducible.
    if(Number(grain)>0){
      const amount=Math.min(1,Number(grain)/100)*7;
      const d=out.data;
      for(let y=0;y<height;y++) for(let x=0;x<width;x++){
        const p=y*width+x, i=p*4; if(m[p*4]<8) continue;
        const n=((p*1103515245+12345)>>>16)%17-8;
        d[i]=Math.max(0,Math.min(255,d[i]+n*amount));d[i+1]=Math.max(0,Math.min(255,d[i+1]+n*amount));d[i+2]=Math.max(0,Math.min(255,d[i+2]+n*amount));
      }
    }
    src.delete();maskMat.delete();dst.delete();
    self.postMessage({type:'progress', value:95});
    self.postMessage({type:'result', image:out.data.buffer}, [out.data.buffer]);
  } catch (e) { self.postMessage({type:'error', message:e?.message||String(e)}); }
};
function waitForCV(){return new Promise((resolve,reject)=>{const start=Date.now();const t=()=>{if(self.cv?.Mat)return resolve();if(Date.now()-start>20000)return reject(new Error('OpenCV.js initialization timed out'));setTimeout(t,50)};t()})}
