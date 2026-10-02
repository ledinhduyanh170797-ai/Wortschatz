const CACHE="wortschatz-a1-b1-3-0-v2";
const ASSETS=["./wortschatz.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];

self.addEventListener("install",e=>e.waitUntil(
  caches.open(CACHE).then(c=>Promise.all(ASSETS.map(a=>c.add(a).catch(()=>{}))))
  .then(()=>self.skipWaiting())));

self.addEventListener("activate",e=>e.waitUntil(
  caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  .then(()=>self.clients.claim())));

self.addEventListener("fetch",e=>{
  const req=e.request;
  if(req.method!=="GET") return;
  if(req.mode==="navigate"){
    e.respondWith(fetch(req).then(resp=>{
      if(resp.ok){const copy=resp.clone();caches.open(CACHE).then(c=>c.put("./wortschatz.html",copy));}
      return resp;
    }).catch(()=>caches.match("./wortschatz.html")));
    return;
  }
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(resp=>{
    if(resp.ok||resp.type==="opaque"){const copy=resp.clone();caches.open(CACHE).then(c=>c.put(req,copy));}
    return resp;
  })));
});
