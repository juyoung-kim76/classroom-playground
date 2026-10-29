// 같은 웹 주소에서 열리는 모든 교실은 새로운 파일을 자동으로 확인합니다.
const CORE_CACHE='school-playground-core-v1';
const DATA_CACHE='school-playground-data-v1';
const PRECACHE=['./','./index.html','./activities.json','./manifest.webmanifest','./icons/app-192.png','./icons/app-512.png',
'./activities/compare.html','./activities/daynight_photo.html','./activities/daynight_illustrated.html','./activities/tangram_new.html','./activities/tangram_original.html','./activities/half_picture.html','./activities/hourglass.html','./activities/big_number_sheet.html','./activities/number_order_sheet.html','./activities/leaf_boat.html','./activities/summer_forest.html'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CORE_CACHE).then(cache=>cache.addAll(PRECACHE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(self.clients.claim());});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 const url=new URL(event.request.url);
 if(url.pathname.endsWith('/sw.js'))return;
 event.respondWith((async()=>{
  const cache=await caches.open(DATA_CACHE);
  // 온라인이면 새 파일 우선, 인터넷이 없어도 이전 파일을 사용
  try{const fresh=await fetch(event.request,{cache:'no-store'});
   if(fresh.ok) await cache.put(event.request,fresh.clone());
   return fresh;
  }catch(err){const old=await cache.match(event.request);
   if(old)return old;
   const core=await caches.open(CORE_CACHE);
   const oldCore=await core.match(event.request);
   if(oldCore)return oldCore;
   throw err;
  }
 })());
});
