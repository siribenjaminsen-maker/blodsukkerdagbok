const CACHE_NAME = "blodsukkerdagbok-v12";
const APP_FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"];

function redesign(text) {
  text = text
    .replaceAll("#126b63", "#38bdf8")
    .replaceAll("#0b4f49", "#0284c7")
    .replaceAll("rgba(18,107,99,.14)", "rgba(56,189,248,.18)")
    .replaceAll("#b7d9d4", "#bae6fd")
    .replaceAll("#eff9f7", "#f0f9ff")
    .replaceAll("#e8f4f2", "#e0f2fe")
    .replaceAll("#8bc8bf", "#7dd3fc")
    .replaceAll("#f4fbfa", "#f0f9ff")
    .replaceAll("#16836f", "#0284c7")
    .replace('<meta name="theme-color" content="#38bdf8">','<meta name="theme-color" content="#38bdf8">');

  const extraCss = `<style id="mobile-redesign">
  :root{--brand:#38bdf8;--brand-dark:#0284c7;--pink:#ff1493;--bg:#f4faff;--soft:#eef9ff;--line:#d9eef8}
  body{background:linear-gradient(180deg,#38bdf8 0,#38bdf8 150px,#f4faff 150px);min-height:100vh}
  main{max-width:980px;padding-top:0}
  .top{margin:0 -12px 18px;padding:24px 20px 22px;color:#fff;align-items:center}
  .top .eyebrow{color:#fff;opacity:.92;font-size:.86rem;letter-spacing:.03em}.top h1{font-size:clamp(1.7rem,5vw,2.45rem);color:#fff}.top .lead{color:#eaf8ff;margin-bottom:0}
  .panel{border-color:#dcecf4;border-radius:20px;box-shadow:0 8px 26px rgba(2,132,199,.10)}
  .account{padding:13px 16px;border-radius:16px}.sync-dot.online{background:#38bdf8}
  .layout{grid-template-columns:310px minmax(0,1fr)}
  .layout>aside.panel{background:linear-gradient(145deg,#fff,#f3fbff)}
  .layout>aside h2:before{content:'＋ ';color:#0284c7}
  .btn{border-radius:12px}.btn:not(.secondary):not(.danger){box-shadow:0 5px 12px rgba(2,132,199,.18)}
  .tabs{background:#eaf8ff;padding:4px;border-radius:14px}.tabs .btn{flex:1;border:0;background:transparent}.tabs .active{background:#38bdf8!important;box-shadow:0 3px 9px rgba(2,132,199,.2)}
  .stats{gap:8px}.stat{background:#f1faff;border:1px solid #e1f2fa;border-radius:14px}.stat strong{color:#0369a1}
  .chart-wrap{height:390px;border-radius:16px;background:linear-gradient(180deg,#fff,#fbfdff);padding:4px}
  .period-head h2{font-size:1.3rem}.periodLabel{font-weight:600}
  .table-wrap{border:0;overflow:visible}table{min-width:0}thead{display:none}tbody{display:grid;gap:9px}tr{display:grid;grid-template-columns:95px 70px 1fr auto;align-items:center;background:#fff;border:1px solid #e0eef5;border-radius:14px;padding:4px 6px;box-shadow:0 3px 10px rgba(20,33,38,.035)}td{border:0!important;padding:9px 7px}td:nth-child(2){font-size:1.15rem;font-weight:850;color:#0369a1}td:nth-child(3){font-size:.85rem;color:#52636b}td:nth-child(4){font-size:.82rem;color:#6b7780}.panel:last-child .period-head h2:before{content:'◷ ';color:#38bdf8}
  input,select{border-radius:12px;background:#fbfdff}.migration{background:#f0f9ff;border-color:#bae6fd}.recovery{background:#f0f9ff;border-color:#7dd3fc}
  @media(max-width:900px){body{background:linear-gradient(180deg,#38bdf8 0,#38bdf8 175px,#f4faff 175px)}main{width:100%;padding:0 10px 34px}.top{margin:0 -10px 12px;padding:20px 16px 22px}.top h1{font-size:1.8rem}.top .lead{font-size:.92rem}.account{margin-top:8px}.layout{display:flex;flex-direction:column}.layout>aside{width:100%;order:2}.layout>section{width:100%;order:1}.chart-wrap{height:340px}.panel{border-radius:18px;padding:15px}.period-head{align-items:flex-start}.period-head>div:first-child{width:100%}.tabs{width:100%;display:grid;grid-template-columns:repeat(4,1fr);gap:2px}.tabs .btn{font-size:.78rem;padding:7px 4px}.period-controls{display:grid!important;grid-template-columns:44px 1fr 44px 72px;align-items:end;width:100%}.period-controls label{min-width:0}.period-controls .btn{padding:6px}.stats{grid-template-columns:repeat(4,1fr)}.stat{padding:9px 6px;text-align:center}.stat strong{font-size:1.08rem}.stat span{font-size:.7rem}}
  @media(max-width:560px){.top h1{font-size:1.65rem}.top .lead{display:none}.chart-wrap{height:315px}.panel{margin-bottom:11px}.layout>*+*{margin-top:0}.layout>aside{margin-top:0}.period-controls{grid-template-columns:42px 1fr 42px 68px}.custom-controls{grid-template-columns:1fr 1fr}.panel:last-child{padding:14px 10px}tr{grid-template-columns:82px 58px 1fr auto}td{padding:8px 5px;font-size:.82rem}td:nth-child(4){display:none}.account .subtle{max-width:190px;overflow:hidden;text-overflow:ellipsis}.btn.small{font-size:.78rem}.auth-card{margin-top:18px}}
  </style>`;
  text = text.replace('</head>', extraCss + '</head>');

  // Strong pink markers for Saturdays, Sundays and Norwegian public holidays.
  if (!text.includes('function isSpecialDay(dateString)')) {
    text = text.replace('function drawChart(rows){', `function drawChart(rows){
    function easterSunday(year){const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),month=Math.floor((h+l-7*m+114)/31),day=((h+l-7*m+114)%31)+1;return new Date(year,month-1,day)}
    function isoLocal(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
    function addDays(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return isoLocal(x)}
    function isSpecialDay(dateString){const d=new Date(dateString+"T12:00:00"),day=d.getDay();if(day===0||day===6)return true;const y=d.getFullYear(),fixed=new Set([y+"-01-01",y+"-05-01",y+"-05-17",y+"-12-25",y+"-12-26"]),easter=easterSunday(y);if(fixed.has(dateString))return true;return new Set([addDays(easter,-3),addDays(easter,-2),addDays(easter,0),addDays(easter,1),addDays(easter,39),addDays(easter,49),addDays(easter,50)]).has(dateString)}
    `);
  }
  text = text.replace(
    'rows.forEach((r,i)=>{const xx=x(i),yy=y(r.value_mmol);ctx.beginPath();ctx.arc(xx,yy,4.5,0,Math.PI*2);ctx.fillStyle="#fff";ctx.fill();ctx.strokeStyle="#38bdf8";ctx.lineWidth=2;ctx.stroke()});',
    'rows.forEach((r,i)=>{const xx=x(i),yy=y(r.value_mmol),special=isSpecialDay(r.measured_on);ctx.beginPath();ctx.arc(xx,yy,special?6:4.5,0,Math.PI*2);ctx.fillStyle=special?"#ff1493":"#fff";ctx.fill();ctx.strokeStyle=special?"#d9006c":"#38bdf8";ctx.lineWidth=special?3:2;ctx.stroke()});'
  );
  return text;
}

async function redesignedResponse(response) {
  const type=response.headers.get("content-type")||"";
  if(!type.includes("text/html"))return response;
  const text=redesign(await response.text());
  const headers=new Headers(response.headers);headers.delete("content-length");
  return new Response(text,{status:response.status,statusText:response.statusText,headers});
}

self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_FILES)));self.skipWaiting()});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))));self.clients.claim()});
self.addEventListener("fetch",event=>{if(event.request.method!=="GET")return;event.respondWith((async()=>{try{const network=await fetch(event.request);const response=await redesignedResponse(network);if(event.request.url.startsWith(self.location.origin)){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy))}return response}catch{const cached=await caches.match(event.request)||await caches.match("./index.html");return cached?redesignedResponse(cached):Response.error()}})())});
