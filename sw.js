/* MR.ORBEA offline cache v20261025-dialogos-2.
   Pages and scripts always check the network first so iPhone home-screen users get updates. */
const CACHE='mr-orbea-dialogos-20261025-2';
const FALLBACK='./index.html';
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(c=>c.add(FALLBACK)).catch(()=>{}).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('mr-orbea-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin)return;
 event.respondWith(fetch(req).then(response=>{
   if(response.ok){const clone=response.clone();caches.open(CACHE).then(c=>c.put(req,clone)).catch(()=>{});}
   return response;
 }).catch(async()=>await caches.match(req)|| (req.mode==='navigate'?await caches.match(FALLBACK):Response.error())));
});
