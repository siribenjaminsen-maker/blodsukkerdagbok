(() => {
  "use strict";

  const SUPABASE_URL = "https://ltfzgiryskngpqrvnqao.supabase.co";
  const SUPABASE_KEY = "sb_publishable_ZFzmcz91ggG4wjnA_Gz7Xw_gHZ5X9pT";
  const COLOR = "#7c3aed";
  let markerDates = new Set();
  let client = null;
  let userId = null;
  let observer = null;

  function isoFromDisplay(text) {
    const m = String(text || "").match(/(\d{2})\.(\d{2})\.(\d{4})/);
    return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
  }

  function styleButton(btn, active) {
    btn.textContent = "◆";
    btn.title = active ? "Fjern merke fra valgt dato" : "Merk valgt dato";
    btn.setAttribute("aria-label", btn.title);
    btn.style.minWidth = "42px";
    btn.style.fontSize = "18px";
    btn.style.padding = "6px 10px";
    btn.style.color = active ? "#fff" : COLOR;
    btn.style.background = active ? COLOR : "#fff";
    btn.style.border = `1px solid ${COLOR}`;
  }

  function markRows() {
    const tbody = document.getElementById("rows");
    if (!tbody) return;
    tbody.querySelectorAll("tr").forEach(tr => {
      const first = tr.querySelector("td:first-child");
      if (!first) return;
      const date = isoFromDisplay(first.textContent);
      let badge = first.querySelector(".day-event-mark");
      if (date && markerDates.has(date)) {
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "day-event-mark";
          badge.textContent = " ◆";
          badge.style.color = COLOR;
          badge.style.fontWeight = "900";
          badge.style.fontSize = "1.05em";
          badge.setAttribute("aria-label", "Merket dag");
          first.appendChild(badge);
        }
      } else if (badge) {
        badge.remove();
      }
    });
  }

  function refreshButton() {
    const btn = document.getElementById("dayMarkerBtn");
    const date = document.getElementById("date")?.value;
    if (btn) styleButton(btn, !!date && markerDates.has(date));
  }

  async function loadMarkers() {
    if (!client || !userId) return;
    const { data, error } = await client
      .from("day_events")
      .select("event_date")
      .eq("user_id", userId)
      .eq("event_type", "marker");
    if (error) return;
    markerDates = new Set((data || []).map(x => x.event_date));
    markRows();
    refreshButton();
  }

  async function toggleMarker() {
    const date = document.getElementById("date")?.value;
    if (!date || !client || !userId) return;
    const btn = document.getElementById("dayMarkerBtn");
    if (btn) btn.disabled = true;
    try {
      if (markerDates.has(date)) {
        const { error } = await client
          .from("day_events")
          .delete()
          .eq("user_id", userId)
          .eq("event_date", date)
          .eq("event_type", "marker");
        if (!error) markerDates.delete(date);
      } else {
        const { error } = await client
          .from("day_events")
          .insert({ user_id: userId, event_date: date, event_type: "marker" });
        if (!error) markerDates.add(date);
      }
    } finally {
      if (btn) btn.disabled = false;
      markRows();
      refreshButton();
    }
  }

  function installButton() {
    if (document.getElementById("dayMarkerBtn")) return;
    const add = document.getElementById("addBtn");
    if (!add) return;
    const btn = document.createElement("button");
    btn.id = "dayMarkerBtn";
    btn.type = "button";
    btn.className = "btn secondary";
    styleButton(btn, false);
    btn.addEventListener("click", toggleMarker);
    const parent = add.parentElement;
    if (parent && parent.classList.contains("buttons")) parent.appendChild(btn);
    else add.insertAdjacentElement("afterend", btn);
    document.getElementById("date")?.addEventListener("change", refreshButton);
  }

  async function init() {
    if (!window.supabase?.createClient) return;
    client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
    });
    const { data } = await client.auth.getSession();
    userId = data?.session?.user?.id || null;
    if (!userId) {
      client.auth.onAuthStateChange((_event, session) => {
        userId = session?.user?.id || null;
        if (userId) {
          installButton();
          loadMarkers();
        }
      });
      return;
    }
    installButton();
    await loadMarkers();
    const tbody = document.getElementById("rows");
    if (tbody) {
      observer = new MutationObserver(() => markRows());
      observer.observe(tbody, { childList: true, subtree: true });
    }
    setInterval(loadMarkers, 30000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
