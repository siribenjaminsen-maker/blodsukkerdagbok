(() => {
  "use strict";

  const SUPABASE_URL = "https://ltfzgiryskngpqrvnqao.supabase.co";
  const SUPABASE_KEY = "sb_publishable_ZFzmcz91ggG4wjnA_Gz7Xw_gHZ5X9pT";
  const MARK = "◆";
  const MARK_COLOR = "#7c3aed";
  const $ = (id) => document.getElementById(id);

  if (!window.supabase?.createClient) return;
  const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession:true, autoRefreshToken:true, detectSessionInUrl:false }
  });

  let session = null;
  let markedDates = new Set();
  let busy = false;

  const style = document.createElement("style");
  style.textContent = `
    .day-marker-btn{background:#fff!important;color:${MARK_COLOR}!important;border-color:#ddd6fe!important}
    .day-marker-btn.marked{background:#f5f3ff!important;border-color:#a78bfa!important}
    .day-marker-list{color:${MARK_COLOR};font-size:.86rem;margin-left:5px;font-weight:900;vertical-align:1px}
    .day-marker-overlay{position:absolute;color:${MARK_COLOR};font-size:12px;font-weight:900;line-height:1;transform:translateX(-50%);pointer-events:none;z-index:4;text-shadow:0 1px 0 #fff}
    @media(max-width:700px){.day-marker-btn{font-size:.76rem!important;padding:7px 9px!important}.day-marker-overlay{font-size:11px}}
  `;
  document.head.appendChild(style);

  function isoFromDisplay(s){
    const m=String(s||"").match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
  }

  async function loadMarkers(){
    if(!session?.user){markedDates.clear();updateAll();return;}
    const {data,error}=await db.from("day_events").select("event_date").eq("user_id",session.user.id).eq("event_type","marker");
    if(error) return;
    markedDates=new Set((data||[]).map(x=>x.event_date));
    updateAll();
  }

  async function toggleMarker(){
    if(busy||!session?.user)return;
    const date=$("date")?.value;
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date||""))return;
    busy=true;
    const exists=markedDates.has(date);
    let error;
    if(exists){
      ({error}=await db.from("day_events").delete().eq("user_id",session.user.id).eq("event_date",date).eq("event_type","marker"));
      if(!error)markedDates.delete(date);
    }else{
      ({error}=await db.from("day_events").insert({user_id:session.user.id,event_date:date,event_type:"marker"}));
      if(!error)markedDates.add(date);
    }
    busy=false;
    updateAll();
  }

  function ensureButton(){
    const add=$("addBtn"), date=$("date");
    if(!add||!date||$("dayMarkerBtn"))return;
    const b=document.createElement("button");
    b.id="dayMarkerBtn";
    b.type="button";
    b.className="btn secondary day-marker-btn";
    b.addEventListener("click",toggleMarker);
    const holder=add.parentElement?.classList.contains("buttons")?add.parentElement:add.parentElement;
    holder?.appendChild(b);
    date.addEventListener("change",updateButton);
    updateButton();
  }

  function updateButton(){
    const b=$("dayMarkerBtn"),date=$("date")?.value;
    if(!b)return;
    const on=!!date&&markedDates.has(date);
    b.textContent=on?`${MARK} Merket`:`${MARK} Merk dagen`;
    b.classList.toggle("marked",on);
    b.title=on?"Trykk for å fjerne markeringen":"Sett en diskret markering på denne datoen";
  }

  function annotateList(){
    const body=$("rows");
    if(!body)return;
    [...body.querySelectorAll("tr")].forEach(tr=>{
      const td=tr.querySelector("td");
      if(!td)return;
      td.querySelectorAll(".day-marker-list").forEach(x=>x.remove());
      const date=isoFromDisplay(td.textContent.trim());
      if(date&&markedDates.has(date)){
        const s=document.createElement("span");
        s.className="day-marker-list";
        s.textContent=MARK;
        s.title="Merket dag";
        td.appendChild(s);
      }
    });
  }

  function annotateChart(){
    const canvas=$("chart"),wrap=$("chartWrap");
    if(!canvas||!wrap)return;
    wrap.querySelectorAll(".day-marker-overlay").forEach(x=>x.remove());
    const rows=canvas._rows;
    const state=canvas._chartState;
    if(!Array.isArray(rows)||!rows.length||!state)return;
    const start=Math.max(0,state.start||0),count=Math.max(1,state.count||rows.length);
    const visible=rows.slice(start,start+count);
    if(!visible.length)return;
    const rect=canvas.getBoundingClientRect();
    const scaleX=rect.width/canvas.width, scaleY=rect.height/canvas.height;
    const left=42, right=10, plot=canvas.width-left-right;
    visible.forEach((r,i)=>{
      if(!markedDates.has(r.measured_on))return;
      const x=visible.length===1?left+plot/2:left+(i/(visible.length-1))*plot;
      const d=document.createElement("span");
      d.className="day-marker-overlay";
      d.textContent=MARK;
      d.title="Merket dag";
      d.style.left=`${x*scaleX}px`;
      d.style.top=`${Math.max(2,(canvas.height-62)*scaleY)}px`;
      wrap.appendChild(d);
    });
  }

  function updateAll(){ensureButton();updateButton();annotateList();annotateChart();}

  const observer=new MutationObserver(()=>updateAll());
  observer.observe(document.documentElement,{subtree:true,childList:true});
  window.addEventListener("resize",annotateChart);
  setInterval(()=>{annotateChart();updateButton();},500);

  db.auth.onAuthStateChange((_event,s)=>{session=s;loadMarkers();});
  db.auth.getSession().then(({data})=>{session=data.session;loadMarkers();});
})();
