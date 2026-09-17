(() => {
  "use strict";

  const SUPABASE_URL = "https://ltfzgiryskngpqrvnqao.supabase.co";
  const SUPABASE_KEY = "sb_publishable_ZFzmcz91ggG4wjnA_Gz7Xw_gHZ5X9pT";
  const COLOR = "#7c3aed";
  let markerDates = new Set(), doseHistory = [], client = null, userId = null, observer = null;

  function isoFromDisplay(text){const m=String(text||"").match(/(\d{2})\.(\d{2})\.(\d{4})/);return m?`${m[3]}-${m[2]}-${m[1]}`:null}
  function num(v){const n=Number(String(v??"").replace(",","."));return Number.isFinite(n)?n:null}
  function fmt(n){return Number.isInteger(Number(n))?String(Number(n)):String(Number(n)).replace(".",",")}
  function effectiveDose(date){let dose=null;for(const d of doseHistory){if(d.effective_on<=date)dose=Number(d.units);else break}return dose}

  function styleButton(btn,active){btn.textContent="◆";btn.title=active?"Fjern merke fra valgt dato":"Merk valgt dato";btn.setAttribute("aria-label",btn.title);btn.style.minWidth="42px";btn.style.fontSize="18px";btn.style.padding="6px 10px";btn.style.color=active?"#fff":COLOR;btn.style.background=active?COLOR:"#fff";btn.style.border=`1px solid ${COLOR}`}

  function decorateRows(){
    const tbody=document.getElementById("rows");if(!tbody)return;
    tbody.querySelectorAll("tr").forEach(tr=>{
      const first=tr.querySelector("td:first-child");if(!first)return;const date=isoFromDisplay(first.textContent);if(!date)return;
      let badge=first.querySelector(".day-event-mark");if(markerDates.has(date)){if(!badge){badge=document.createElement("span");badge.className="day-event-mark";badge.textContent=" ◆";badge.style.cssText=`color:${COLOR};font-weight:900;font-size:1.05em`;first.appendChild(badge)}}else badge?.remove();
      const cells=tr.querySelectorAll("td");if(cells.length>1){let dose=cells[1].querySelector(".insulin-row-dose");const units=effectiveDose(date);if(units!==null){if(!dose){dose=document.createElement("div");dose.className="insulin-row-dose";dose.style.cssText="font-size:.72rem;font-weight:700;color:#596b77;margin-top:2px";cells[1].appendChild(dose)}dose.textContent=`Insulin ${fmt(units)} E`}else dose?.remove()}
    })
  }
  function refreshMarkerButton(){const btn=document.getElementById("dayMarkerBtn"),date=document.getElementById("date")?.value;if(btn)styleButton(btn,!!date&&markerDates.has(date))}
  function refreshDoseField(){const input=document.getElementById("insulinUnits"),date=document.getElementById("date")?.value;if(!input||!date||document.activeElement===input)return;const d=effectiveDose(date);input.value=d===null?"":fmt(d)}

  async function loadData(){
    if(!client||!userId)return;
    const [m,d]=await Promise.all([
      client.from("day_events").select("event_date").eq("user_id",userId).eq("event_type","marker"),
      client.from("insulin_doses").select("effective_on,units").eq("user_id",userId).order("effective_on",{ascending:true})
    ]);
    if(!m.error)markerDates=new Set((m.data||[]).map(x=>x.event_date));
    if(!d.error)doseHistory=d.data||[];
    decorateRows();refreshMarkerButton();refreshDoseField();await renderDoseAnalysis();
  }

  async function toggleMarker(){const date=document.getElementById("date")?.value;if(!date||!client||!userId)return;const btn=document.getElementById("dayMarkerBtn");if(btn)btn.disabled=true;try{if(markerDates.has(date)){const {error}=await client.from("day_events").delete().eq("user_id",userId).eq("event_date",date).eq("event_type","marker");if(!error)markerDates.delete(date)}else{const {error}=await client.from("day_events").insert({user_id:userId,event_date:date,event_type:"marker"});if(!error)markerDates.add(date)}}finally{if(btn)btn.disabled=false;decorateRows();refreshMarkerButton()}}

  async function saveDoseIfChanged(){
    const input=document.getElementById("insulinUnits"),date=document.getElementById("date")?.value;if(!input||!date||!userId)return;
    const units=num(input.value);if(units===null||units<0)return;
    const current=effectiveDose(date);if(current!==null&&Number(current)===units)return;
    const {error}=await client.from("insulin_doses").upsert({user_id:userId,effective_on:date,units},{onConflict:"user_id,effective_on"});
    if(!error)await loadData();
  }

  async function renderDoseAnalysis(){
    const box=document.getElementById("doseAnalysis");if(!box||!userId)return;
    if(doseHistory.length<2){box.textContent=doseHistory.length?`Gjeldende dose: ${fmt(doseHistory[doseHistory.length-1].units)} E. Doseendringer vil spores her.`:"Når første insulindose registreres, huskes den automatisk til den endres.";return}
    const last=doseHistory[doseHistory.length-1],prev=doseHistory[doseHistory.length-2],change=new Date(last.effective_on+"T12:00:00"),from=new Date(change);from.setDate(from.getDate()-7);const to=new Date(change);to.setDate(to.getDate()+6),iso=d=>d.toISOString().slice(0,10);
    const {data,error}=await client.from("glucose_readings").select("measured_on,value_mmol").eq("user_id",userId).gte("measured_on",iso(from)).lte("measured_on",iso(to)).gt("value_mmol",0).order("measured_on");
    if(error){box.textContent=`Dose endret ${fmt(prev.units)} → ${fmt(last.units)} E fra ${last.effective_on}.`;return}
    const before=(data||[]).filter(r=>r.measured_on<last.effective_on).map(r=>Number(r.value_mmol)),after=(data||[]).filter(r=>r.measured_on>=last.effective_on).map(r=>Number(r.value_mmol)),avg=a=>a.length?(a.reduce((x,y)=>x+y,0)/a.length).toFixed(1).replace(".",","):"—";
    box.textContent=`Siste doseendring: ${fmt(prev.units)} → ${fmt(last.units)} E fra ${last.effective_on}. Snitt 7 dager før: ${avg(before)} mmol/L · etter endringen: ${avg(after)} mmol/L (${after.length} måling${after.length===1?"":"er"}).`;
  }

  function installUI(){
    if(document.getElementById("dayMarkerBtn"))return;const add=document.getElementById("addBtn");if(!add)return;
    const date=document.getElementById("date"),value=document.getElementById("value");
    if(value&&!document.getElementById("insulinUnits")){const label=document.createElement("label");label.innerHTML='<span>Insulin (E)</span><input id="insulinUnits" inputmode="decimal" type="text" placeholder="f.eks. 48">';label.style.minWidth="120px";value.closest("label")?.insertAdjacentElement("afterend",label)}
    const btn=document.createElement("button");btn.id="dayMarkerBtn";btn.type="button";btn.className="btn secondary";styleButton(btn,false);btn.addEventListener("click",toggleMarker);const parent=add.parentElement;if(parent?.classList.contains("buttons"))parent.appendChild(btn);else add.insertAdjacentElement("afterend",btn);
    const analysis=document.createElement("div");analysis.id="doseAnalysis";analysis.style.cssText="margin:8px 0 2px;padding:8px 10px;border-radius:10px;background:#f4faff;border:1px solid #dbeef9;font-size:.78rem;color:#50636f;line-height:1.4";add.parentElement?.parentElement?.appendChild(analysis);
    date?.addEventListener("change",()=>{refreshMarkerButton();refreshDoseField()});
    add.addEventListener("click",()=>setTimeout(saveDoseIfChanged,250));
  }

  async function init(){
    if(!window.supabase?.createClient)return;client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});const {data}=await client.auth.getSession();userId=data?.session?.user?.id||null;
    client.auth.onAuthStateChange((_e,s)=>{userId=s?.user?.id||null;if(userId){installUI();loadData()}});
    if(!userId)return;installUI();await loadData();const tbody=document.getElementById("rows");if(tbody){observer=new MutationObserver(()=>decorateRows());observer.observe(tbody,{childList:true,subtree:true})}setInterval(loadData,30000);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
