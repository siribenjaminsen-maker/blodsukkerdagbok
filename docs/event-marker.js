(() => {
  'use strict';

  const SUPABASE_URL = 'https://ltfzgiryskngpqrvnqao.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_ZFzmcz91ggG4wjnA_Gz7Xw_gHZ5X9pT';
  const PURPLE = '#7c3aed';
  const LIGHT_PURPLE = '#f5f0ff';

  function waitForApp() {
    if (!window.supabase?.createClient) return setTimeout(waitForApp, 250);
    const dateInput = document.getElementById('date');
    const addBtn = document.getElementById('addBtn');
    const rows = document.getElementById('rows');
    const chartWrap = document.getElementById('chartWrap');
    if (!dateInput || !addBtn || !rows || !chartWrap) return setTimeout(waitForApp, 250);
    init(dateInput, addBtn, rows, chartWrap);
  }

  function init(dateInput, addBtn, rowsEl, chartWrap) {
    if (document.getElementById('dayMarkerBtn')) return;

    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
    });

    let session = null;
    let markedDates = new Set();
    let busy = false;

    const style = document.createElement('style');
    style.textContent = `
      #dayMarkerBtn{background:#fff!important;color:${PURPLE}!important;border:1px solid #cdb8ff!important;box-shadow:none!important}
      #dayMarkerBtn.marked{background:${LIGHT_PURPLE}!important;border-color:${PURPLE}!important}
      .day-marker-symbol{color:${PURPLE};font-weight:900;margin-left:5px;font-size:.95em}
      #dayMarkerStrip{display:flex;gap:7px;flex-wrap:wrap;align-items:center;margin:7px 2px 0;min-height:0}
      #dayMarkerStrip:empty{display:none}
      .day-marker-chip{font-size:.74rem;color:${PURPLE};background:${LIGHT_PURPLE};border:1px solid #ddccff;border-radius:999px;padding:3px 7px;white-space:nowrap}
      @media(max-width:560px){#dayMarkerBtn{width:100%;margin-top:2px}.day-marker-chip{font-size:.7rem;padding:3px 6px}}
    `;
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.id = 'dayMarkerBtn';
    btn.type = 'button';
    btn.className = 'btn secondary';
    btn.textContent = '◆ Merk dagen';
    addBtn.insertAdjacentElement('afterend', btn);

    const strip = document.createElement('div');
    strip.id = 'dayMarkerStrip';
    strip.setAttribute('aria-label', 'Merkede dager');
    chartWrap.insertAdjacentElement('afterend', strip);

    function isoFromDisplay(text) {
      const m = String(text || '').trim().match(/^(\d{2})\.(\d{2})\.(\d{4})/);
      return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
    }

    function displayShort(iso) {
      const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
      return m ? `${m[3]}.${m[2]}` : iso;
    }

    function currentRange() {
      const active = document.querySelector('#periodTabs [data-mode].active')?.dataset.mode || 'month';
      const anchor = document.getElementById('anchorDate')?.value;
      const from = document.getElementById('fromDate')?.value;
      const to = document.getElementById('toDate')?.value;
      if (active === 'custom') return [from, to];
      if (!/^\d{4}-\d{2}-\d{2}$/.test(anchor || '')) return [null, null];
      const [y,m,d] = anchor.split('-').map(Number);
      const x = new Date(y,m-1,d);
      const fmt = z => `${z.getFullYear()}-${String(z.getMonth()+1).padStart(2,'0')}-${String(z.getDate()).padStart(2,'0')}`;
      if (active === 'day') return [anchor, anchor];
      if (active === 'week') {
        const a = new Date(x); a.setDate(a.getDate()-((a.getDay()+6)%7));
        const b = new Date(a); b.setDate(b.getDate()+6);
        return [fmt(a), fmt(b)];
      }
      return [fmt(new Date(y,m-1,1)), fmt(new Date(y,m,0))];
    }

    function updateButton() {
      const marked = markedDates.has(dateInput.value);
      btn.classList.toggle('marked', marked);
      btn.textContent = marked ? '◆ Merket' : '◆ Merk dagen';
      btn.setAttribute('aria-pressed', marked ? 'true' : 'false');
    }

    function decorateRows() {
      rowsEl.querySelectorAll('tr').forEach(tr => {
        const td = tr.querySelector('td:first-child');
        if (!td) return;
        td.querySelectorAll('.day-marker-symbol').forEach(x => x.remove());
        const iso = isoFromDisplay(td.textContent);
        if (iso && markedDates.has(iso)) {
          const s = document.createElement('span');
          s.className = 'day-marker-symbol';
          s.textContent = '◆';
          s.title = 'Merket dag';
          td.appendChild(s);
        }
      });
    }

    function renderStrip() {
      strip.innerHTML = '';
      const [from,to] = currentRange();
      if (!from || !to) return;
      [...markedDates].filter(d => d >= from && d <= to).sort().forEach(d => {
        const chip = document.createElement('span');
        chip.className = 'day-marker-chip';
        chip.textContent = `◆ ${displayShort(d)}`;
        strip.appendChild(chip);
      });
    }

    function repaint() {
      updateButton();
      decorateRows();
      renderStrip();
    }

    async function loadMarkers() {
      if (!session?.user) {
        markedDates = new Set();
        repaint();
        return;
      }
      const { data, error } = await client.from('day_events')
        .select('event_date')
        .eq('user_id', session.user.id)
        .eq('event_type', 'marker')
        .order('event_date', { ascending: true });
      if (error) {
        console.warn('Day marker load failed', error.message);
        return;
      }
      markedDates = new Set((data || []).map(x => x.event_date));
      repaint();
    }

    async function toggleMarker() {
      if (busy || !session?.user) return;
      const day = dateInput.value;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day || '')) return;
      busy = true;
      btn.disabled = true;
      try {
        if (markedDates.has(day)) {
          const { error } = await client.from('day_events')
            .delete()
            .eq('user_id', session.user.id)
            .eq('event_date', day)
            .eq('event_type', 'marker');
          if (error) throw error;
          markedDates.delete(day);
        } else {
          const { error } = await client.from('day_events')
            .insert({ user_id: session.user.id, event_date: day, event_type: 'marker' });
          if (error) throw error;
          markedDates.add(day);
        }
        repaint();
      } catch (error) {
        console.warn('Day marker toggle failed', error?.message || error);
      } finally {
        busy = false;
        btn.disabled = false;
      }
    }

    btn.addEventListener('click', toggleMarker);
    dateInput.addEventListener('change', updateButton);
    document.getElementById('anchorDate')?.addEventListener('change', renderStrip);
    document.getElementById('fromDate')?.addEventListener('change', renderStrip);
    document.getElementById('toDate')?.addEventListener('change', renderStrip);
    document.getElementById('periodTabs')?.addEventListener('click', () => setTimeout(renderStrip, 0));
    document.getElementById('prevPeriod')?.addEventListener('click', () => setTimeout(renderStrip, 0));
    document.getElementById('nextPeriod')?.addEventListener('click', () => setTimeout(renderStrip, 0));
    document.getElementById('todayBtn')?.addEventListener('click', () => setTimeout(renderStrip, 0));
    document.getElementById('syncBtn')?.addEventListener('click', () => setTimeout(loadMarkers, 400));

    const observer = new MutationObserver(() => decorateRows());
    observer.observe(rowsEl, { childList: true, subtree: true });

    client.auth.onAuthStateChange((_event, s) => {
      session = s;
      setTimeout(loadMarkers, 0);
    });
    client.auth.getSession().then(({ data }) => {
      session = data.session;
      loadMarkers();
    });
  }

  waitForApp();
})();
