const CACHE_NAME = "blodsukkerdagbok-v14";
const APP_FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"];

function redesign(text) {
  text=text.replaceAll("#126b63","#2196f3").replaceAll("#0b4f49","#0879d1").replaceAll("rgba(18,107,99,.14)","rgba(33,150,243,.16)").replaceAll("#b7d9d4","#bbdefb").replaceAll("#eff9f7","#f4faff").replaceAll("#e8f4f2","#e3f2fd").replaceAll("#8bc8bf","#90caf9").replaceAll("#f4fbfa","#f5faff").replaceAll("#16836f","#1976d2");

  const css=`<style id="approved-mockup">
  :root{--brand:#2196f3;--brand-dark:#0879d1;--pink:#ff1478;--bg:#f5faff;--panel:#fff;--line:#dce9f3;--soft:#eef7fd}
  *{box-sizing:border-box}body{background:#f5faff!important;color:#17202a}main{width:100%!important;max-width:1160px!important;padding:0 18px 92px!important}
  .top{background:linear-gradient(135deg,#21a4f5,#168eea);margin:0 -18px 20px!important;padding:24px 30px 26px!important;color:white;min-height:126px;align-items:center}.top:before{content:'☰   💧';font-size:1.65rem;letter-spacing:8px;white-space:nowrap}.top>div:first-child{flex:1}.top .eyebrow{display:none}.top h1{color:white!important;font-size:2rem!important;margin:0!important}.top .lead{color:#eaf7ff!important;margin:7px 0 0!important}.account{background:rgba(255,255,255,.16)!important;border-color:rgba(255,255,255,.28)!important;color:white}.account .subtle{color:#eaf7ff!important}
  .panel{border:1px solid #dce9f3!important;border-radius:18px!important;box-shadow:0 5px 18px rgba(45,105,145,.09)!important;padding:20px!important;margin-bottom:18px!important}.layout{display:flex!important;flex-direction:column!important;gap:0!important}.layout>section{order:1}.layout>aside{order:3}.layout>aside.panel{background:#fff!important}
  .period-head{align-items:center!important}.period-head h2{font-size:1.35rem!important;margin:0}.period-head h2:before{content:'↗  ';color:#2196f3}.tabs{background:transparent!important;padding:0!important}.tabs .btn{background:#fff!important;color:#27343d!important;border:1px solid #d7e2e9!important}.tabs .active{background:#2196f3!important;color:white!important;border-color:#2196f3!important}.period-controls{align-items:end!important}.chart-wrap{height:430px!important;margin-top:10px!important;background:white!important;padding:0!important}.stats{margin:14px 0 2px!important}.stat{background:#f5faff!important;border:1px solid #e1eef6!important;border-radius:12px!important}.stat strong{color:#147fd1!important}
  .table-wrap{border:0!important;overflow:visible!important}table{min-width:0!important}thead{display:none!important}tbody{display:grid!important;gap:10px!important}tr{display:grid!important;grid-template-columns:105px 90px minmax(120px,1fr) auto!important;align-items:center;background:#fff;border:1px solid #e0eaf1;border-left:6px solid #2196f3;border-radius:12px;padding:4px 8px;box-shadow:0 2px 7px rgba(20,60,90,.04)}td{border:0!important;padding:10px 8px!important}td:nth-child(1){font-weight:750}td:nth-child(2){font-size:1.25rem;font-weight:850;color:#17202a}td:nth-child(3){color:#4c5c67}td:nth-child(4){color:#687985;font-size:.85rem}.panel:last-child .period-head h2:before{content:'▣  ';color:#2196f3}
  .layout>aside h2{margin-top:0}.layout>aside h2:before{content:'⊕  ';color:#2196f3}.btn{border-radius:9px!important}.btn:not(.secondary):not(.danger){background:#2196f3!important}.btn:not(.secondary):not(.danger):hover{background:#0879d1!important}input,select{border-radius:9px!important}.migration,.recovery{background:#eef8ff!important;border-color:#b8def8!important}
  #app:after{content:'⌂\A Oversikt     ☷\A Målinger     ◷\A Statistikk     ⚙\A Innstillinger';white-space:pre-wrap;position:fixed;z-index:30;left:0;right:0;bottom:0;background:rgba(255,255,255,.97);border-top:1px solid #dce7ee;box-shadow:0 -3px 14px rgba(40,80,110,.06);padding:13px 18px 12px;text-align:center;color:#52616a;font-size:.8rem;line-height:1.25;word-spacing:22px}
  @media(min-width:901px){.layout>aside{order:2}.layout>section{order:1}.layout{display:grid!important;grid-template-columns:minmax(0,1fr)!important}.layout>aside.panel{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;align-items:end}.layout>aside.panel h2{grid-column:1/-1}.layout>aside.panel .grid{display:contents}.layout>aside.panel .buttons{grid-column:1/-1}}
  @media(max-width:700px){main{padding:0 10px 88px!important}.top{margin:0 -10px 12px!important;padding:16px 14px 18px!important;min-height:108px;gap:10px}.top:before{content:'☰  💧';font-size:1.2rem;letter-spacing:2px}.top h1{font-size:1.45rem!important}.top .lead{display:none}.account{padding:8px!important}.panel{padding:13px!important;border-radius:14px!important;margin-bottom:11px!important}.period-head{align-items:flex-start!important}.period-head>div:first-child{width:100%}.period-head h2{font-size:1.12rem!important}.tabs{display:grid!important;grid-template-columns:repeat(4,1fr);width:100%}.tabs .btn{font-size:.73rem;padding:7px 2px!important}.period-controls{display:grid!important;grid-template-columns:38px 1fr 38px 62px;width:100%}.period-controls .btn{padding:5px!important}.chart-wrap{height:350px!important}.stats{grid-template-columns:repeat(4,1fr)!important;gap:5px!important}.stat{padding:8px 3px!important;text-align:center}.stat span{font-size:.65rem!important}.stat strong{font-size:1rem!important}.custom-controls{grid-template-columns:1fr 1fr!important}tr{grid-template-columns:78px 58px 1fr!important;border-left-width:5px!important}td{padding:8px 4px!important;font-size:.78rem}td:nth-child(2){font-size:1.05rem}td:nth-child(4){display:none}.layout>aside.panel{order:3}.account .subtle{display:none}#app:after{font-size:.7rem;word-spacing:6px;padding:10px 3px}}
  </style>`;
  text=text.replace('</head>',css+'</head>');
  text=text.replace('Graf og periode','Blodsukker (mmol/L)');

  const start=text.indexOf('function drawChart(rows){');
  const end=text.indexOf('function render(){',start);
  if(start!==-1&&end!==-1){
    const chartFn=`function drawChart(rows){
      const c=E.chart,ctx=c.getContext("2d"),w=c.width,h=c.height;ctx.clearRect(0,0,w,h);
      E.chartWrap.classList.toggle("hidden",!rows.length);E.chartEmpty.classList.toggle("hidden",!!rows.length);if(!rows.length)return;
      function easterSunday(year){const a=year%19,b=Math.floor(year/100),cc=year%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),hh=(19*a+b-d-g+15)%30,i=Math.floor(cc/4),k=cc%4,l=(32+2*e+2*i-hh-k)%7,m=Math.floor((a+11*hh+22*l)/451),month=Math.floor((hh+l-7*m+114)/31),day=((hh+l-7*m+114)%31)+1;return new Date(year,month-1,day)}
      function isoLocal(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
      function addDays(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return isoLocal(x)}
      function isSpecialDay(s){const d=new Date(s+"T12:00:00"),day=d.getDay();if(day===0||day===6)return true;const y=d.getFullYear(),fixed=new Set([y+"-01-01",y+"-05-01",y+"-05-17",y+"-12-25",y+"-12-26"]),e=easterSunday(y);if(fixed.has(s))return true;return new Set([addDays(e,-3),addDays(e,-2),addDays(e,0),addDays(e,1),addDays(e,39),addDays(e,49),addDays(e,50)]).has(s)}
      const dayNames=["søn","man","tir","ons","tor","fre","lør"];
      const vals=rows.map(r=>r.value_mmol),maxV=Math.max(25,Math.ceil(Math.max(...vals)/5)*5),minV=0;
      const p={l:48,r:16,t:18,b:112},pw=w-p.l-p.r,ph=h-p.t-p.b;
      const x=i=>rows.length===1?p.l+pw/2:p.l+(i/(rows.length-1))*pw,y=v=>p.t+((maxV-v)/(maxV-minV))*ph;
      ctx.fillStyle="#fff";ctx.fillRect(0,0,w,h);
      ctx.font="12px system-ui";ctx.lineWidth=1;ctx.textAlign="right";
      for(let v=0;v<=maxV;v+=5){const yy=y(v);ctx.strokeStyle="#e3e7eb";ctx.beginPath();ctx.moveTo(p.l,yy);ctx.lineTo(w-p.r,yy);ctx.stroke();ctx.fillStyle="#3f464c";ctx.fillText(String(v),p.l-8,yy+4)}
      rows.forEach((r,i)=>{const xx=x(i);ctx.strokeStyle="#edf0f2";ctx.beginPath();ctx.moveTo(xx,p.t);ctx.lineTo(xx,p.t+ph);ctx.stroke()});
      for(let i=1;i<rows.length;i++){const prev=rows[i-1],cur=rows[i],special=isSpecialDay(cur.measured_on);ctx.strokeStyle=special?"#ff1478":"#168eea";ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x(i-1),y(prev.value_mmol));ctx.lineTo(x(i),y(cur.value_mmol));ctx.stroke()}
      rows.forEach((r,i)=>{const xx=x(i),yy=y(r.value_mmol),special=isSpecialDay(r.measured_on);ctx.beginPath();ctx.arc(xx,yy,5.2,0,Math.PI*2);ctx.fillStyle=special?"#ff7cae":"#74bdf4";ctx.fill();ctx.strokeStyle=special?"#f00065":"#168eea";ctx.lineWidth=2.5;ctx.stroke()});
      const labelStep=rows.length<=18?1:Math.ceil(rows.length/16);
      rows.forEach((r,i)=>{if(i%labelStep!==0&&i!==rows.length-1)return;const d=new Date(r.measured_on+"T12:00:00"),special=isSpecialDay(r.measured_on),xx=x(i);ctx.textAlign="center";ctx.fillStyle=special?"#ff1478":"#222b32";ctx.font="12px system-ui";ctx.fillText(String(d.getDate()),xx,p.t+ph+20);ctx.font="11px system-ui";ctx.fillText(dayNames[d.getDay()],xx,p.t+ph+39)});
      const legendY=h-46,center=w/2;ctx.lineWidth=2.3;
      ctx.strokeStyle="#168eea";ctx.beginPath();ctx.moveTo(center-160,legendY);ctx.lineTo(center-122,legendY);ctx.stroke();ctx.beginPath();ctx.arc(center-141,legendY,4.5,0,Math.PI*2);ctx.fillStyle="#74bdf4";ctx.fill();ctx.strokeStyle="#168eea";ctx.stroke();ctx.fillStyle="#242c32";ctx.textAlign="left";ctx.font="12px system-ui";ctx.fillText("Ukedag",center-112,legendY+4);
      ctx.strokeStyle="#ff1478";ctx.beginPath();ctx.moveTo(center-30,legendY);ctx.lineTo(center+8,legendY);ctx.stroke();ctx.beginPath();ctx.arc(center-11,legendY,4.5,0,Math.PI*2);ctx.fillStyle="#ff7cae";ctx.fill();ctx.strokeStyle="#f00065";ctx.stroke();ctx.fillStyle="#242c32";ctx.fillText("Lørdag, søndag og helligdager",center+18,legendY+4);
      ctx.textAlign="center";ctx.fillStyle="#7b8389";ctx.font="12px system-ui";ctx.fillText("Dra i grafen for å panorere. Klyp for å zoome.",w/2,h-14);
    }
    `;
    text=text.slice(0,start)+chartFn+text.slice(end);
  }
  return text;
}
async function transformed(response){const type=response.headers.get('content-type')||'';if(!type.includes('text/html'))return response;const text=redesign(await response.text());const headers=new Headers(response.headers);headers.delete('content-length');return new Response(text,{status:response.status,statusText:response.statusText,headers})}
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith((async()=>{try{const n=await fetch(e.request),r=await transformed(n);if(e.request.url.startsWith(self.location.origin)){const copy=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,copy))}return r}catch{const c=await caches.match(e.request)||await caches.match('./index.html');return c?transformed(c):Response.error()}})())});
