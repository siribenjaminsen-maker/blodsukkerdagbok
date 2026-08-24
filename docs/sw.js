const CACHE_NAME = "blodsukkerdagbok-v11";
const APP_FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"];

function skyBlueTheme(text) {
  text = text
    .replaceAll("#126b63", "#38bdf8")
    .replaceAll("#0b4f49", "#0284c7")
    .replaceAll("rgba(18,107,99,.14)", "rgba(56,189,248,.18)")
    .replaceAll("#b7d9d4", "#bae6fd")
    .replaceAll("#eff9f7", "#f0f9ff")
    .replaceAll("#e8f4f2", "#e0f2fe")
    .replaceAll("#8bc8bf", "#7dd3fc")
    .replaceAll("#f4fbfa", "#f0f9ff")
    .replaceAll("#16836f", "#0284c7");

  // Restore strong pink chart markers for Saturdays, Sundays and Norwegian public holidays.
  text = text.replace(
    'function drawChart(rows){',
    `function drawChart(rows){
    function easterSunday(year){
      const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),month=Math.floor((h+l-7*m+114)/31),day=((h+l-7*m+114)%31)+1;
      return new Date(year,month-1,day);
    }
    function isoLocal(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
    function addDays(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return isoLocal(x)}
    function isSpecialDay(dateString){
      const d=new Date(dateString+"T12:00:00"),day=d.getDay();
      if(day===0||day===6)return true;
      const y=d.getFullYear(),fixed=new Set([y+"-01-01",y+"-05-01",y+"-05-17",y+"-12-25",y+"-12-26"]),easter=easterSunday(y);
      if(fixed.has(dateString))return true;
      return new Set([addDays(easter,-3),addDays(easter,-2),addDays(easter,0),addDays(easter,1),addDays(easter,39),addDays(easter,49),addDays(easter,50)]).has(dateString);
    }`
  );

  text = text.replace(
    'rows.forEach((r,i)=>{const xx=x(i),yy=y(r.value_mmol);ctx.beginPath();ctx.arc(xx,yy,4.5,0,Math.PI*2);ctx.fillStyle="#fff";ctx.fill();ctx.strokeStyle="#38bdf8";ctx.lineWidth=2;ctx.stroke()});',
    'rows.forEach((r,i)=>{const xx=x(i),yy=y(r.value_mmol),special=isSpecialDay(r.measured_on);ctx.beginPath();ctx.arc(xx,yy,special?6:4.5,0,Math.PI*2);ctx.fillStyle=special?"#ff1493":"#fff";ctx.fill();ctx.strokeStyle=special?"#d9006c":"#38bdf8";ctx.lineWidth=special?3:2;ctx.stroke()});'
  );
  return text;
}

async function themedResponse(response) {
  const type = response.headers.get("content-type") || "";
  if (!type.includes("text/html")) return response;
  const text = skyBlueTheme(await response.text());
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(text, { status: response.status, statusText: response.statusText, headers });
}

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith((async () => {
    try {
      const network = await fetch(event.request);
      const response = await themedResponse(network);
      if (event.request.url.startsWith(self.location.origin)) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      }
      return response;
    } catch {
      const cached = await caches.match(event.request) || await caches.match("./index.html");
      return cached ? themedResponse(cached) : Response.error();
    }
  })());
});
