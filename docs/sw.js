const CACHE_NAME="blodsukkerdagbok-v20";
const APP_FILES=["./","./index.html","./manifest.webmanifest","./icon.svg","./event-marker.js"];

async function withMarkerModule(response){
  try{
    const type=response.headers.get("content-type")||"";
    if(!type.includes("text/html"))return response;
    const text=await response.text();
    if(text.includes('event-marker.js')){
      const headers=new Headers(response.headers);headers.delete("content-length");
      return new Response(text,{status:response.status,statusText:response.statusText,headers});
    }
    const updated=text.replace("</body>",'<script src="./event-marker.js" defer></script>\n</body>');
    const headers=new Headers(response.headers);headers.delete("content-length");
    return new Response(updated,{status:response.status,statusText:response.statusText,headers});
  }catch(_){return response}
}

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  event.respondWith((async()=>{
    try{
      const network=await fetch(event.request);
      const response=await withMarkerModule(network);
      if(event.request.url.startsWith(self.location.origin)){
        caches.open(CACHE_NAME).then(cache=>cache.put(event.request,response.clone()));
      }
      return response;
    }catch{
      const cached=await caches.match(event.request)||await caches.match("./index.html");
      return cached?withMarkerModule(cached):Response.error();
    }
  })());
});
