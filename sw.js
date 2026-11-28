const V='familienessen-v4';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET')return;
  if(u.origin!==location.origin&&u.hostname!=='www.gstatic.com')return;
  e.respondWith(caches.open(V).then(c=>fetch(r).then(res=>{
    if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());
    return res;
  }).catch(()=>c.match(r).then(m=>m||(r.mode==='navigate'?c.match('index.html'):undefined)))));
});
