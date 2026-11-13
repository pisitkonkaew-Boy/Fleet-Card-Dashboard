/* NIMEX Fleet Card Dashboard — app.js (หน้าเว็บ + การคำนวณเดิม + Google Sheet) */
const ICON={home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',dc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21V9l9-5 9 5v12"/><path d="M7 21v-8h10v8"/><path d="M7 17h10"/></svg>',truck:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 6h12v10H2z"/><path d="M14 9h4l4 4v3h-8z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',line:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>',alert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3L2 20h20z"/><path d="M12 10v4"/><path d="M12 17v.5"/></svg>',analysis:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/><path d="M8 13l2-2 2 2 2-3"/></svg>',upload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M4 16v4h16v-4"/></svg>',share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>',fuel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 21V5a2 2 0 012-2h6a2 2 0 012 2v16"/><path d="M3 21h12"/><path d="M6 8h6"/><path d="M14 10h2a2 2 0 012 2v4a1.5 1.5 0 003 0V8l-3-3"/></svg>',money:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M15 8.5h-4.5a2 2 0 000 4h3a2 2 0 010 4H9"/><path d="M12 6v12"/></svg>',wallet:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h16a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M3 7l12-4v4"/><circle cx="16.5" cy="13.5" r="1.3"/></svg>',flame:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c1 4 5 5.5 5 10a5 5 0 01-10 0c0-2.5 1.5-3.5 2-5 1 1.5 1.5 2 2 2 0-2.5-.5-4.5 1-7z"/></svg>',pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',bill:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6"/></svg>',gauge:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 18a9 9 0 1116 0"/><path d="M12 14l4-5"/><circle cx="12" cy="14" r="1.2"/></svg>',star:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',users:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-4 3.5-5.5 6.5-5.5s5.7 1.5 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 010 7M18.5 14.8c1.7.8 2.7 2.4 3 5.2"/></svg>',sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/></svg>',gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></svg>'};
const ICON_PATH={home:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',dc:'<path d="M3 21V9l9-5 9 5v12"/><path d="M7 21v-8h10v8"/><path d="M7 17h10"/>',truck:'<path d="M2 6h12v10H2z"/><path d="M14 9h4l4 4v3h-8z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',line:'<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',alert:'<path d="M12 3L2 20h20z"/><path d="M12 10v4"/><path d="M12 17v.5"/>',analysis:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/><path d="M8 13l2-2 2 2 2-3"/>',upload:'<path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M4 16v4h16v-4"/>',share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',fuel:'<path d="M4 21V5a2 2 0 012-2h6a2 2 0 012 2v16"/><path d="M3 21h12"/><path d="M6 8h6"/><path d="M14 10h2a2 2 0 012 2v4a1.5 1.5 0 003 0V8l-3-3"/>',money:'<circle cx="12" cy="12" r="9"/><path d="M15 8.5h-4.5a2 2 0 000 4h3a2 2 0 010 4H9"/><path d="M12 6v12"/>',wallet:'<path d="M3 7h16a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M3 7l12-4v4"/><circle cx="16.5" cy="13.5" r="1.3"/>',flame:'<path d="M12 3c1 4 5 5.5 5 10a5 5 0 01-10 0c0-2.5 1.5-3.5 2-5 1 1.5 1.5 2 2 2 0-2.5-.5-4.5 1-7z"/>',pin:'<path d="M12 22s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',bill:'<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6"/>',gauge:'<path d="M4 18a9 9 0 1116 0"/><path d="M12 14l4-5"/><circle cx="12" cy="14" r="1.2"/>',star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-4 3.5-5.5 6.5-5.5s5.7 1.5 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 010 7M18.5 14.8c1.7.8 2.7 2.4 3 5.2"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',moon:'<path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>'};
const ICON_SUN=ICON.sun, ICON_MOON=ICON.moon;
// ════════ DATA ════════
// ข้อมูลโหลดจาก Google Sheet (ดู admin: loadData) — ไม่ฝังข้อมูลในหน้าเว็บ
let D = null;
let STORE = {}; // multi-file store: key -> {rows:[obj], filename, range, dates:[]}
let ALL_ROWS = []; // flattened row objects across all STORE entries, for month filtering
let CH = {};

// ════════ NA / DATE / MONTH HELPERS ════════
function isNA(v){
  if(v===null||v===undefined) return true;
  const s=String(v).trim();
  return s===''||s==='#N/A'||s.toUpperCase()==='#N/A';
}
// Collapse whitespace variants (incl. non-breaking space \u00A0, tabs, double
// spaces) so e.g. "322 DC จันทบุรี" and "322\u00A0DC จันทบุรี" are treated as
// the SAME DC/group/owner and their totals get combined instead of split.
function normText(s){
  return String(s||'').replace(/[\s\u00A0]+/g,' ').trim();
}
// Same idea for plates, plus normalize dash style and uppercase (in case a
// plate has mixed-case Latin letters/format quirks from different exports).
function normPlate(s){
  return normText(s).replace(/[\u2013\u2014]/g,'-').toUpperCase();
}
// Convert row-array [date,liter,baht,price,plate,paBaht,paLiter,group,dc,vtype,owner] -> row object
function toRowObj(r){
  return {date:r[0],liter:r[1],baht:r[2],price:r[3],plate:normPlate(r[4]),paBaht:r[5],paLiter:r[6],group:normText(r[7]),dc:normText(r[8]),vtype:normText(r[9]),owner:normText(r[10])};
}
// dd/mm/yyyy(Buddhist) -> numeric sortable key yyyy*10000+mm*100+dd
function dateSortKey(dateStr){
  const p=String(dateStr||'').split('/');
  if(p.length!==3) return 0;
  const d=parseInt(p[0],10)||0, m=parseInt(p[1],10)||0, y=parseInt(p[2],10)||0;
  return y*10000+m*100+d;
}
function dateCmp(a,b){ return dateSortKey(a)-dateSortKey(b); }
// dd/mm/yyyy -> "mm/yyyy"
function monthKey(dateStr){
  const p=String(dateStr||'').split('/');
  return p.length===3 ? (p[1]+'/'+p[2]) : '';
}
const THAI_MONTHS=['','มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
function monthLabel(mk){
  const p=mk.split('/');
  if(p.length!==2) return mk;
  const mi=parseInt(p[0],10)||0;
  return (THAI_MONTHS[mi]||p[0])+' '+p[1];
}
function rebuildAllRows(){
  ALL_ROWS=[];
  Object.values(STORE).forEach(s=>{ ALL_ROWS=ALL_ROWS.concat(s.rows); });
}
function populateMonthSelect(){
  const sel=document.getElementById('f-month');
  if(!sel) return;
  const cur=sel.value;
  const months=[...new Set(ALL_ROWS.map(r=>monthKey(r.date)))].filter(Boolean)
    .sort((a,b)=>{
      const pa=a.split('/'), pb=b.split('/');
      return (parseInt(pa[1])*100+parseInt(pa[0]))-(parseInt(pb[1])*100+parseInt(pb[0]));
    });
  sel.innerHTML='<option value="">📅 ทุกเดือน (รวม)</option>'+
    months.map(mk=>`<option value="${mk}">${monthLabel(mk)}</option>`).join('');
  if(cur && months.includes(cur)){
    sel.value=cur;
  } else if(!cur){
    // Default to the current calendar month (Buddhist year); if the data has
    // no such month, fall back to the most recent month available.
    const now=new Date();
    const curMk=String(now.getMonth()+1).padStart(2,'0')+'/'+(now.getFullYear()+543);
    sel.value = months.includes(curMk) ? curMk : (months[months.length-1]||'');
  }
}
let GRP='';        // กลุ่มรถจากปุ่มทองบนแถบบน ('' = ทั้งหมด)
let CUR_ROWS=[];  // แถวข้อมูลหลังกรองเดือน + กลุ่ม (ใช้นับรถไม่ซ้ำ และดูรายวัน)
function applyMonthFilter(){
  const sel=document.getElementById('f-month');
  const mk=sel?sel.value:'';
  let rows= mk ? ALL_ROWS.filter(r=>monthKey(r.date)===mk) : ALL_ROWS;
  if(GRP) rows=rows.filter(r=>r.group===GRP);
  CUR_ROWS=rows;
  syncGroupUI();
  if(!rows.length){ showEmpty(); return; }
  const computed=computeFromRows(rows);
  render(computed);
  renderDCTab(); renderVeh(); renderTrend(); renderAlert();
  if(typeof renderAnalysis==='function') renderAnalysis();
  renderChips(); syncBadges();
}

// ════════ UTILS ════════
const fmt = n => Math.round(n).toLocaleString('th-TH');
const fmt1 = n => (+n).toLocaleString('th-TH',{minimumFractionDigits:1,maximumFractionDigits:1});
const pct  = (a,b) => b>0 ? a/b*100 : 0;
const pctS = (a,b) => pct(a,b).toFixed(1)+'%';

function pchip(p){
  let c = 'b-green';
  if(p>100) c='b-red'; else if(p>80) c='b-yellow'; else if(p>50) c='b-purple';
  return `<span class="pchip bdg ${c}">${p.toFixed(1)}%</span>`;
}
function statusBdg(p){
  if(p>100) return `<span class="bdg b-red">เกิน PA</span>`;
  if(p>80)  return `<span class="bdg b-yellow">ใกล้เกิน</span>`;
  if(p>50)  return `<span class="bdg b-purple">กลาง</span>`;
  return `<span class="bdg b-green">ปกติ</span>`;
}

// ════════ THEME ════════
let theme='light';
try{ theme=localStorage.getItem('fcd-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'); }catch(e){}
function applyTheme(){
  document.documentElement.dataset.theme=theme;
  const b=document.getElementById('btn-theme');
  if(b) b.innerHTML=theme==='dark'?ICON_SUN:ICON_MOON;
}
function setTheme(t){
  theme=t; try{localStorage.setItem('fcd-theme',t);}catch(e){}
  applyTheme();
  if(D) setTimeout(()=>{renderCharts(); if(document.getElementById('tab-trend').classList.contains('on')) renderTrend(); if(document.getElementById('tab-analysis').classList.contains('on')) renderAnalysis();},60);
}
function toggleTheme(){ setTheme(theme==='dark'?'light':'dark'); }
applyTheme();

// ════════ TABS ════════
const TAB_INFO={
  overview:['ภาพรวม','การใช้น้ำมันเทียบวงเงิน PA'],
  dc:['รายละเอียด DC','การใช้น้ำมันราย DC'],
  vehicles:['รายละเอียดรถ','การใช้น้ำมันรายทะเบียน'],
  trend:['เทรนด์รายวัน','การใช้น้ำมันและราคารายวัน'],
  alert:['แจ้งเตือน','รถที่เกินหรือใกล้เกิน PA'],
  analysis:['วิเคราะห์แนวโน้ม','คาดการณ์การใช้เทียบ PA']
};
function goTab(id){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));
  document.querySelectorAll('[data-tab]').forEach(b=>{ if(b.dataset.tab===id) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current'); });
  document.getElementById('tab-'+id).classList.add('on');
  const ti=TAB_INFO[id]; if(ti){document.getElementById('page-eyebrow').textContent=ti[0];document.getElementById('page-title').textContent=ti[1];}
  window.scrollTo({top:0});
  if(!D) return;
  if(id==='dc') renderDCTab();
  if(id==='vehicles') renderVeh();
  if(id==='trend') renderTrend();
  if(id==='alert') renderAlert();
  if(id==='analysis') renderAnalysis();
}

// ════════ MODAL ════════
function openM(id){document.getElementById(id).classList.add('open')}
function closeM(id){document.getElementById(id).classList.remove('open')}
document.querySelectorAll('.moverlay').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open')}));

// ════════ RENDER DASHBOARD ════════
function render(d){
  D = d;
  const paL=d.pa_liters, paB=d.pa_baht, tL=d.total_liters, tB=d.total_baht;
  const pL=pct(tL,paL), pB=pct(tB,paB);

  document.getElementById('period-badge').textContent = d.period;
  if(document.getElementById('period-sub')) document.getElementById('period-sub').textContent = d.period;
  document.getElementById('hn-l').textContent  = fmt(tL);
  document.getElementById('hn-lp').textContent = pL.toFixed(1)+'%';
  document.getElementById('pa-lt').textContent = fmt(paL);
  document.getElementById('pa-lr').textContent = fmt(paL-tL);
  document.getElementById('hn-b').textContent  = fmt(tB);
  document.getElementById('hn-bp').textContent = pB.toFixed(1)+'%';
  document.getElementById('pa-bt').textContent = fmt(paB);
  document.getElementById('pa-br').textContent = fmt(paB-tB);
  document.getElementById('k-v').textContent   = fmt(d.vehicles);
  document.getElementById('k-dc').textContent  = fmt(d.dcs);
  document.getElementById('k-tx').textContent  = fmt(d.transactions);
  document.getElementById('k-pr').textContent  = '฿'+d.avg_price.toFixed(2);

  setTimeout(()=>{
    document.getElementById('pf-l').style.width = Math.min(pL,100)+'%';
    document.getElementById('pf-b').style.width = Math.min(pB,100)+'%';
  },120);

  // Group breakdown
  const cols = ['var(--s1)','var(--s2)'];
  document.getElementById('grp-break').innerHTML = d.by_group.map(([g,l],i)=>{
    const p = (l/tL*100).toFixed(1);
    return `<div class="brow">
      <div class="brow-head"><span>${g}</span><span style="color:${cols[i]}">${fmt(l)} ล. <small style="color:var(--muted)">(${p}%)</small></span></div>
      <div class="brow-track"><div class="brow-fill" style="width:${p}%;background:${cols[i]}"></div></div>
    </div>`;
  }).join('');

  const ocols = ['var(--s1)','var(--s2)'];
  document.getElementById('own-break').innerHTML = d.by_owner.map(([o,l],i)=>{
    const p = (l/tL*100).toFixed(1);
    return `<div class="brow">
      <div class="brow-head"><span>${o}</span><span style="color:${ocols[i]}">${fmt(l)} ล. <small style="color:var(--muted)">(${p}%)</small></span></div>
      <div class="brow-track"><div class="brow-fill" style="width:${p}%;background:${ocols[i]}"></div></div>
    </div>`;
  }).join('');

  document.getElementById('dc-cnt').textContent = new Set((d.dc_summary||[]).map(r=>r[0])).size + ' DC · '+(d.dc_summary||[]).length+' รายการ (DC×กลุ่ม)';
  document.querySelectorAll('#tab-overview [data-grp]').forEach(el=>{el.hidden=!!GRP&&el.dataset.grp!==GRP;});

  renderCharts();
  renderTopDC();
  renderTopPlates();
  renderAlert();
}

// ════════ CHARTS ════════
function cssv(k){return getComputedStyle(document.documentElement).getPropertyValue(k).trim()}
function pal(){return{s:[cssv('--s1'),cssv('--s2'),cssv('--s3'),cssv('--s4'),cssv('--s5')],bad:cssv('--bad'),line:cssv('--line'),muted:cssv('--muted'),ink:cssv('--ink'),panel:cssv('--panel')}}
function alpha(hex,a){const h=hex.replace('#','');const n=parseInt(h.length===3?h.split('').map(c=>c+c).join(''):h,16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`}
function gc(){return cssv('--line')}
function tc(){return cssv('--muted')}
if(window.Chart){Chart.defaults.font.family='Prompt, system-ui, sans-serif';Chart.defaults.font.size=12;}
// แตะแท่ง/จุดในกราฟรายวัน -> เปิดรายละเอียดวันนั้น
function dayClick(dates){return (e,els)=>{if(els&&els.length){const d=dates[els[0].index];if(d)showDayModal(d);}}}
function dc2(id){if(CH[id]){CH[id].destroy();delete CH[id]}}

function renderCharts(){
  renderDailyChart();
  renderVtypeChart();
}

function renderDailyChart(){
  dc2('daily');
  const d=D; if(!d.daily) return;
  const labels=d.daily.map(r=>r[0].replace(/\/\d{4}$/,''));
  const liters=d.daily.map(r=>r[1]);
  const ctx=document.getElementById('c-daily').getContext('2d');
  CH['daily']=new Chart(ctx,{
    type:'bar',
    data:{labels,datasets:[{label:'ลิตร',data:liters,backgroundColor:pal().s[0],borderRadius:5,borderSkipped:false}]},
    options:{responsive:true,maintainAspectRatio:false,onClick:dayClick(d.daily.map(r=>r[0])),
      plugins:{legend:{display:false},tooltip:{callbacks:{title:c=>d.daily[c[0].dataIndex][0],label:c=>'  '+fmt(c.raw)+' ลิตร'}}},
      scales:{x:{grid:{display:false},ticks:{color:tc()}},y:{grid:{color:gc()},ticks:{color:tc(),callback:v=>fmt(v)}}}}
  });
}

function renderVtypeChart(){
  dc2('vtype');
  const d=D; if(!d.by_vtype) return;
  const labels=d.by_vtype.map(r=>r[0]);
  const vals=d.by_vtype.map(r=>r[1]);
  const P=pal(); const colors=[...P.s.slice(0,3),P.s[4],'#9aa9c2','#c9b26a','#7c8aa3','#b9c4d6'];
  const ctx=document.getElementById('c-vtype').getContext('2d');
  CH['vtype']=new Chart(ctx,{
    type:'doughnut',
    data:{labels,datasets:[{data:vals,backgroundColor:colors,borderWidth:2,borderColor:P.panel}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'62%',
      plugins:{legend:{position:window.innerWidth<520?'bottom':'right',labels:{color:tc(),font:{size:11.5},boxWidth:10,padding:6}},tooltip:{callbacks:{label:c=>{const t=vals.reduce((a,b)=>a+b,0);return c.label+': '+fmt(c.raw)+' ล. ('+(c.raw/t*100).toFixed(1)+'%)'}}}}}
  });
}

function renderTrend(){
  dc2('tgrp'); dc2('tbaht'); dc2('tpa'); dc2('tprice');
  const d=D; if(!d.daily_grp) return;
  const dates=[...new Set(d.daily_grp.map(r=>r[0]))].sort(dateCmp);
  const gk=dates.map(dt=>{const r=d.daily_grp.find(x=>x[0]===dt&&x[1]==='กระจาย');return r?r[2]:0});
  const kn=dates.map(dt=>{const r=d.daily_grp.find(x=>x[0]===dt&&x[1]==='ขนย้าย');return r?r[2]:0});
  const lb=dates.map(x=>x.replace(/\/\d{4}$/,''));

  // ── กลางซ้าย: ลิตรรายวัน vs PA (แท่ง) ──
  const dailyLiters=d.daily.map(r=>r[1]);
  const paPerDay=d.pa_liters>0 ? Array(d.daily.length).fill(Math.round(d.pa_liters/30)) : [];
  const lbD=d.daily.map(r=>r[0].replace(/\/\d{4}$/,''));
  const P=pal();
  const ctx0=document.getElementById('c-tpa').getContext('2d');
  CH['tpa']=new Chart(ctx0,{type:'bar',
    data:{labels:lbD,datasets:[
      {label:'ลิตรที่ใช้',data:dailyLiters,backgroundColor:P.s[0],borderRadius:5,borderSkipped:false,order:2},
      {label:'PA (รายวัน est.)',data:paPerDay,type:'line',borderColor:P.s[1],borderDash:[6,4],borderWidth:2,pointRadius:0,fill:false,order:1}
    ]},
    options:{responsive:true,maintainAspectRatio:false,onClick:dayClick(d.daily.map(r=>r[0])),
      plugins:{legend:{labels:{color:tc(),font:{size:11.5},boxWidth:12}},tooltip:{callbacks:{label:c=>c.dataset.label+': '+fmt(c.raw)+' ล.'}}},
      scales:{x:{grid:{display:false},ticks:{color:tc()}},y:{grid:{color:gc()},ticks:{color:tc(),callback:v=>fmt(v)}}}}
  });

  // ── กลางขวา: ราคาน้ำมัน บาท/ลิตร กราฟเส้น ──
  const priceData=d.daily_price||d.daily.map(r=>d.avg_price||41.0);
  const ctx3=document.getElementById('c-tprice').getContext('2d');
  CH['tprice']=new Chart(ctx3,{type:'line',
    data:{labels:lbD,datasets:[{
      label:'ราคา (฿/ลิตร)',data:priceData,
      borderColor:P.s[1],backgroundColor:alpha(P.s[1],.1),borderWidth:2,
      fill:true,tension:.3,pointRadius:3,pointBackgroundColor:P.s[1],
      pointBorderColor:P.panel,pointBorderWidth:1.5
    }]},
    options:{responsive:true,maintainAspectRatio:false,onClick:dayClick(d.daily.map(r=>r[0])),
      plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>'฿'+c.raw.toFixed(2)+'/ล.'}}},
      scales:{
        x:{grid:{display:false},ticks:{color:tc()}},
        y:{grid:{color:gc()},ticks:{color:tc(),callback:v=>'฿'+v.toFixed(2)},
           min:Math.min(...priceData)-0.5, max:Math.max(...priceData)+0.5}
      }}
  });

  // ── กลุ่ม stacked bar ──
  const ctx1=document.getElementById('c-tgrp').getContext('2d');
  CH['tgrp']=new Chart(ctx1,{type:'bar',
    data:{labels:lb,datasets:[
      {label:'กระจาย',data:gk,backgroundColor:P.s[0],borderRadius:3,borderSkipped:false},
      {label:'ขนย้าย',data:kn,backgroundColor:P.s[1],borderRadius:3,borderSkipped:false}
    ]},
    options:{responsive:true,maintainAspectRatio:false,onClick:dayClick(dates),
      plugins:{legend:{labels:{color:tc(),boxWidth:12}},tooltip:{mode:'index',callbacks:{label:c=>c.dataset.label+': '+fmt(c.raw)+' ล.'}}},
      scales:{x:{stacked:true,grid:{display:false},ticks:{color:tc()}},y:{stacked:true,grid:{color:gc()},ticks:{color:tc(),callback:v=>fmt(v)}}}}
  });

  // ── บาทรายวัน line ──
  const bth=d.daily.map(r=>r[2]);
  const ctx2=document.getElementById('c-tbaht').getContext('2d');
  CH['tbaht']=new Chart(ctx2,{type:'line',
    data:{labels:lbD,datasets:[{label:'บาท',data:bth,borderColor:P.s[0],backgroundColor:alpha(P.s[0],.1),borderWidth:2,fill:true,tension:.3,pointRadius:3,pointBackgroundColor:P.s[0]}]},
    options:{responsive:true,maintainAspectRatio:false,onClick:dayClick(d.daily.map(r=>r[0])),
      plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>'฿'+fmt(c.raw)}}},
      scales:{x:{grid:{display:false},ticks:{color:tc()}},y:{grid:{color:gc()},ticks:{color:tc(),callback:v=>'฿'+fmt(v)}}}}
  });

  // ── Daily table ──
  const grpMap={};
  (d.daily_grp||[]).forEach(r=>{if(!grpMap[r[0]])grpMap[r[0]]={};grpMap[r[0]][r[1]]=r[2]});
  document.getElementById('daily-tbody').innerHTML = d.daily.map((r,i)=>{
    const gk2=grpMap[r[0]]?.['กระจาย']||0;
    const kn2=grpMap[r[0]]?.['ขนย้าย']||0;
    const pr=priceData[i]||d.avg_price||0;
    return `<tr class="clickrow" onclick="showDayModal('${r[0]}')"><td>${r[0]}</td><td class="r"><strong>${fmt(r[1])}</strong></td><td class="r">฿${fmt(r[2])}</td><td class="r" style="color:var(--gold);font-weight:600">฿${pr.toFixed(2)}</td><td class="r">${fmt(gk2)}</td><td class="r">${fmt(kn2)}</td></tr>`;
  }).join('');
}

// ════════ TOP DC ════════
function renderTopDC(){
  const d=D; if(!d.dc_summary) return;
  const gk=d.dc_summary.filter(r=>r[1]==='กระจาย').sort((a,b)=>b[2]-a[2]).slice(0,10);
  const kn=d.dc_summary.filter(r=>r[1]==='ขนย้าย').sort((a,b)=>b[2]-a[2]).slice(0,10);

  const rr=(rows,tbl)=>{
    const mx=rows[0]?rows[0][2]:1;
    const tot=rows.reduce((s,r)=>s+r[2],0);
    document.querySelector('#'+tbl+' tbody').innerHTML=rows.map((r,i)=>{
      const w=(r[2]/mx*100).toFixed(1);
      const p=(r[2]/D.total_liters*100).toFixed(1);
      return `<tr class="clickrow" onclick="showDCVeh('${r[0]}')">
        <td style="color:var(--muted)">${i+1}</td>
        <td class="pl"><strong>${r[0].replace(/^\d+\s+/,'')}</strong><small>${r[0].match(/^\d+/)?.[0]||''}</small></td>
        <td class="r"><strong>${fmt(r[2])}</strong></td>
        <td><div class="bi"><div class="bm"><div class="bf" style="width:${w}%;background:var(--s1)"></div></div><span style="font-size:12px;min-width:38px">${p}%</span></div></td>
        <td class="r">${r[4]}</td>
      </tr>`;
    }).join('');
  };
  rr(gk,'t-dc-gk'); rr(kn,'t-dc-kn');
}

// ════════ TOP PLATES ════════
function renderTopPlates(){
  const d=D;
  [['top_gk_own','t-p-gk-o'],['top_gk_co','t-p-gk-c'],['top_kn_own','t-p-kn-o'],['top_kn_co','t-p-kn-c']].forEach(([k,id])=>{
    if(!d[k]) return;
    const rows=d[k]; const mx=rows[0]?rows[0][1]:1;
    document.querySelector('#'+id+' tbody').innerHTML=rows.map((r,i)=>`
      <tr class="clickrow" onclick="showVehModal('${r[0]}')">
        <td style="color:var(--muted)">${i+1}</td>
        <td class="pl"><strong>${r[0]}</strong><small>${(r[3]||'').replace(/^\d+\s+/,'')}</small></td>
        <td class="r">${fmt(r[1])}</td>
        <td>${pchip(r[2])}</td>
      </tr>`).join('');
  });
}

// ════════ DC TAB ════════
function renderDCTab(){
  const d=D; if(!d.dc_summary) return;
  const grp=document.getElementById('f-dcgrp').value;
  const q=(document.getElementById('f-dcsearch').value||'').toLowerCase();

  // Aggregate
  const map={};
  d.dc_summary.forEach(r=>{
    if(grp && r[1]!==grp) return;
    if(q && !r[0].toLowerCase().includes(q)) return;
    if(!map[r[0]]) map[r[0]]={dc:r[0],l:0,b:0,v:0};
    map[r[0]].l+=r[2]; map[r[0]].b+=r[3]; map[r[0]].v+=r[4];
  });
  const pset=dcPlateSets(grp);
  Object.values(map).forEach(r=>{ r.v=pset[r.dc]?pset[r.dc].size:0; });
  const rows=Object.values(map).sort((a,b)=>b.l-a.l);
  const tot=rows.reduce((s,r)=>s+r.l,0);

  document.getElementById('dc-tbody').innerHTML=rows.map((r,i)=>{
    const p=(r.l/tot*100).toFixed(1);
    return `<tr class="clickrow" onclick="showDCVeh('${r.dc}')">
      <td style="color:var(--muted)">${i+1}</td>
      <td class="pl"><strong>${r.dc.replace(/^\d+\s+/,'')}</strong><small>${r.dc.match(/^\d+/)?.[0]||''}</small></td>
      <td><span class="bdg b-gray" style="font-size:10px">${grp||'รวม'}</span></td>
      <td class="r"><strong>${fmt(r.l)}</strong></td>
      <td class="r">฿${fmt(r.b)}</td>
      <td class="r">${r.v}</td>
      <td><div class="bi"><div class="bm"><div class="bf" style="width:${p}%;background:var(--s1)"></div></div><span style="font-size:12px;min-width:38px">${p}%</span></div></td>
      <td><span class="bdg b-blue">›</span></td>
    </tr>`;
  }).join('');
}

// ════════ VEHICLES TAB ════════
function renderVeh(){
  const d=D; if(!d.all_vehicles) return;
  const grp=document.getElementById('f-vgrp').value;
  const own=document.getElementById('f-vown').value;
  const dc =document.getElementById('f-vdc').value;
  const minP=parseFloat(document.getElementById('f-vpct').value)||0;
  const q=(document.getElementById('f-vpl').value||'').toLowerCase();

  // Populate DC select
  const sel=document.getElementById('f-vdc');
  if(sel.options.length<=1){
    [...new Set(d.all_vehicles.map(r=>r[2]))].sort().forEach(dc=>{
      const o=document.createElement('option'); o.value=dc; o.textContent=dc.replace(/^\d+\s+/,''); sel.appendChild(o);
    });
  }

  let rows=d.all_vehicles;
  if(grp)  rows=rows.filter(r=>r[1]===grp);
  if(own)  rows=rows.filter(r=>r[3]===own);
  if(dc)   rows=rows.filter(r=>r[2]===dc);
  if(minP>=100) rows=rows.filter(r=>r[6]>100);
  else if(minP>0) rows=rows.filter(r=>r[6]>=minP);
  if(q) rows=rows.filter(r=>r[0].toLowerCase().includes(q));

  document.getElementById('veh-tbody').innerHTML=rows.slice(0,300).map((r,i)=>`
    <tr class="clickrow" onclick="showVehModal('${r[0]}')">
      <td style="color:var(--muted)">${i+1}</td>
      <td><strong>${r[0]}</strong></td>
      <td><span class="bdg ${r[1]==='กระจาย'?'b-blue':'b-purple'}">${r[1]}</span></td>
      <td style="font-size:11px">${r[2].replace(/^\d+\s+/,'')}</td>
      <td><span class="bdg ${r[3]==='ผปก'?'b-green':'b-gray'}">${r[3]}</span></td>
      <td class="r">${fmt(r[4])}</td>
      <td class="r">${r[5]>0?fmt(r[5]):'—'}</td>
      <td>${r[5]>0?pchip(r[6]):'—'}</td>
      <td class="r">฿${fmt(r[7])}</td>
      <td>${r[5]>0?statusBdg(r[6]):'—'}</td>
    </tr>`).join('');
}

// ════════ ALERT ════════
function renderAlert(){
  const d=D;
  const over=d.over_pa||[];
  const near=d.near_pa||[];
  document.getElementById('a-over').textContent=over.length;
  document.getElementById('a-near').textContent=near.length;
  document.getElementById('abadge').textContent=over.length+near.length;

  document.getElementById('opa-tbody').innerHTML=over.length===0
    ?'<tr><td colspan="9" style="text-align:center;color:var(--muted);padding:20px">✅ ไม่มีรถที่เกิน PA ในช่วงนี้</td></tr>'
    :over.map((r,i)=>`<tr class="clickrow" onclick="showVehModal('${r[0]}')">
        <td>${i+1}</td><td><strong>${r[0]}</strong></td>
        <td><span class="bdg ${r[1]==='กระจาย'?'b-blue':'b-purple'}">${r[1]}</span></td>
        <td style="font-size:11px">${r[2].replace(/^\d+\s+/,'')}</td>
        <td><span class="bdg b-gray">${r[3]}</span></td>
        <td class="r">${fmt(r[4])}</td><td class="r">${fmt(r[5])}</td>
        <td class="r" style="color:var(--bad);font-weight:600">+${fmt(r[4]-r[5])}</td>
        <td>${pchip(r[6])}</td>
      </tr>`).join('');

  document.getElementById('npa-tbody').innerHTML=near.length===0
    ?'<tr><td colspan="8" style="text-align:center;color:var(--muted);padding:20px">✅ ไม่มีรถที่ใกล้เกิน PA ในช่วงนี้</td></tr>'
    :near.map((r,i)=>`<tr class="clickrow" onclick="showVehModal('${r[0]}')">
        <td>${i+1}</td><td><strong>${r[0]}</strong></td>
        <td><span class="bdg ${r[1]==='กระจาย'?'b-blue':'b-purple'}">${r[1]}</span></td>
        <td style="font-size:11px">${r[2].replace(/^\d+\s+/,'')}</td>
        <td><span class="bdg b-gray">${r[3]}</span></td>
        <td class="r">${fmt(r[4])}</td><td class="r">${fmt(r[5])}</td>
        <td>${pchip(r[6])}</td>
      </tr>`).join('');
}

// ════════ DETAIL MODALS ════════
function showDCVeh(dcName){
  const d=D;
  document.getElementById('m-dtitle').textContent='🏢 '+dcName;
  const vs=(d.all_vehicles||[]).filter(r=>r[2]===dcName).sort((a,b)=>b[4]-a[4]);
  const tot=vs.reduce((s,r)=>s+r[4],0);
  document.getElementById('m-dbody').innerHTML=`
    <p class="flog" style="margin-bottom:10px">รถ ${vs.length} คัน · รวม ${fmt(tot)} ลิตร ใน ${dcName.replace(/^\d+\s+/,'')}</p>
    <div class="sb2"><table class="dt">
      <thead><tr><th>#</th><th>ทะเบียน</th><th>กลุ่ม</th><th>เจ้าของ</th><th class="r">ลิตร</th><th class="r">PA ล.</th><th>%PA</th><th class="r">บาท</th></tr></thead>
      <tbody>${vs.map((r,i)=>`<tr class="clickrow" onclick="showVehModal('${r[0]}')">
        <td>${i+1}</td><td><strong>${r[0]}</strong></td>
        <td><span class="bdg ${r[1]==='กระจาย'?'b-blue':'b-purple'}">${r[1]}</span></td>
        <td><span class="bdg ${r[3]==='ผปก'?'b-green':'b-gray'}">${r[3]}</span></td>
        <td class="r">${fmt(r[4])}</td>
        <td class="r">${r[5]>0?fmt(r[5]):'—'}</td>
        <td>${r[5]>0?pchip(r[6]):'—'}</td>
        <td class="r">฿${fmt(r[7])}</td>
      </tr>`).join('')}</tbody>
    </table></div>`;
  openM('m-detail');
}

function showVehModal(plate){
  const d=D;
  const v=(d.all_vehicles||[]).find(r=>r[0]===plate);
  if(!v) return;
  document.getElementById('m-dtitle').textContent='🚗 '+plate;
  document.getElementById('m-dbody').innerHTML=`
    <div class="g g2" style="margin-bottom:14px">
      <div class="kbox"><div class="klabel">ปริมาณใช้ (ลิตร)</div><div class="kval" style="color:var(--accent)">${fmt(v[4])}</div></div>
      <div class="kbox"><div class="klabel">PA ลิตร</div><div class="kval">${v[5]>0?fmt(v[5]):'—'}</div></div>
      <div class="kbox"><div class="klabel">% ใช้ PA</div><div class="kval">${v[5]>0?v[6].toFixed(1)+'%':'—'}</div></div>
      <div class="kbox"><div class="klabel">ยอดเงิน</div><div class="kval" style="color:var(--a2)">฿${fmt(v[7])}</div></div>
    </div>
    <table class="dt"><tbody>
      <tr><td style="color:var(--muted);width:100px">กลุ่มรถ</td><td><span class="bdg ${v[1]==='กระจาย'?'b-blue':'b-purple'}">${v[1]}</span></td></tr>
      <tr><td style="color:var(--muted)">DC</td><td>${v[2]}</td></tr>
      <tr><td style="color:var(--muted)">เจ้าของ</td><td><span class="bdg ${v[3]==='ผปก'?'b-green':'b-gray'}">${v[3]}</span></td></tr>
      <tr><td style="color:var(--muted)">PA บาท</td><td>${v[8]>0?'฿'+fmt(v[8]):'—'}</td></tr>
      <tr><td style="color:var(--muted)">สถานะ</td><td>${v[5]>0?statusBdg(v[6]):'—'}</td></tr>
    </tbody></table>`;
  openM('m-detail');
}

function showAllDC(grp){
  const d=D;
  const rows=(d.dc_summary||[]).filter(r=>!grp||r[1]===grp).sort((a,b)=>b[2]-a[2]);
  document.getElementById('m-dtitle').textContent=`🏢 DC ทั้งหมด — ${grp}`;
  document.getElementById('m-dbody').innerHTML=`
    <div class="sb2"><table class="dt">
      <thead><tr><th>#</th><th>DC</th><th class="r">ลิตร</th><th class="r">บาท</th><th class="r">รถ</th></tr></thead>
      <tbody>${rows.map((r,i)=>`<tr class="clickrow" onclick="showDCVeh('${r[0]}')">
        <td>${i+1}</td><td>${r[0].replace(/^\d+\s+/,'')}</td>
        <td class="r"><strong>${fmt(r[2])}</strong></td><td class="r">฿${fmt(r[3])}</td><td class="r">${r[4]}</td>
      </tr>`).join('')}</tbody>
    </table></div>`;
  openM('m-detail');
}

function showAllPlates(grp,own){
  const d=D;
  const rows=(d.all_vehicles||[]).filter(r=>r[1]===grp&&r[3]===own).sort((a,b)=>b[4]-a[4]);
  document.getElementById('m-dtitle').textContent=`🚗 ${grp} · ${own} — ทะเบียนทั้งหมด`;
  document.getElementById('m-dbody').innerHTML=`
    <div class="sb2"><table class="dt">
      <thead><tr><th>#</th><th>ทะเบียน</th><th>DC</th><th class="r">ลิตร</th><th class="r">PA ล.</th><th>%PA</th><th class="r">บาท</th></tr></thead>
      <tbody>${rows.map((r,i)=>`<tr class="clickrow" onclick="showVehModal('${r[0]}')">
        <td>${i+1}</td><td><strong>${r[0]}</strong></td>
        <td>${r[2].replace(/^\d+\s+/,'')}</td>
        <td class="r">${fmt(r[4])}</td>
        <td class="r">${r[5]>0?fmt(r[5]):'—'}</td>
        <td>${r[5]>0?pchip(r[6]):'—'}</td>
        <td class="r">฿${fmt(r[7])}</td>
      </tr>`).join('')}</tbody>
    </table></div>`;
  openM('m-detail');
}

// ════════ FILE UPLOAD ════════
function doDrop(e){
  e.preventDefault();
  document.getElementById('uzone').classList.remove('drag');
  const f=e.dataTransfer.files[0];
  if(f) processFile(f);
}
function onFile(e){const f=e.target.files[0];if(f) processFile(f);}

// เจ้าของรถ: "รถบริษัท" กับ "บริษัท" นับเป็นกลุ่มเดียวกัน (ตัดคำว่า รถ ที่นำหน้า)
function normOwner(s){return normText(s).replace(/^รถ\s*/,'');}
// อ่าน 1 ชีต (array of arrays จาก sheet_to_json header:1) -> {parsed, naDropped}
// กติกาเดิมทุกอย่าง: ใช้ทั้งข้อมูลจาก Google Sheet และไฟล์ที่เติม
function parseRaw(raw){
  const out={parsed:[],naDropped:0,naRows:[]};
  if(!raw||!raw.length) return out;
        let hIdx=-1;
        for(let i=0;i<Math.min(raw.length,5);i++){
          if(raw[i]&&raw[i].some(c=>String(c).includes('วันที่')||String(c).includes('ทะเบียน'))){hIdx=i;break;}
        }
        if(hIdx===-1) return out; // sheet doesn't look like a data sheet, skip
        const hdrs=raw[hIdx].map(c=>String(c).trim());
        const rows=raw.slice(hIdx+1).filter(r=>r.some(c=>c!=null&&c!==''));
        const ci={
          date:hdrs.findIndex(h=>h.includes('วันที่')),
          liter:hdrs.findIndex(h=>h.includes('ปริมาณ')||h.includes('ลิตร')),
          baht:hdrs.findIndex(h=>h.includes('จำนวนเงิน')),
          price:hdrs.findIndex(h=>h.includes('ราคา')),
          plate:hdrs.findIndex(h=>h.includes('ทะเบียน')),
          pab:hdrs.findIndex(h=>h.includes('วงเงิน')&&h.includes('บาท')),
          pal:hdrs.findIndex(h=>h.includes('วงเงิน')&&h.includes('ลิตร')),
          grp:hdrs.findIndex(h=>h.includes('กลุ่ม')),
          dc:hdrs.findIndex(h=>h.includes('สังกัด')||h.includes('DC')),
          vt:hdrs.findIndex(h=>h.includes('ประเภทรถ')),
          own:hdrs.findIndex(h=>h.includes('ผปก')||h.includes('บริษัท'))
        };
        rows.forEach(r=>{
          // Any row where the plate (or key lookup columns) is #N/A is a failed
          // VLOOKUP row — drop it everywhere instead of letting "#N/A" leak in
          // as a literal plate/DC/group/owner value.
          if(isNA(r[ci.plate])||isNA(r[ci.dc])||isNA(r[ci.grp])||isNA(r[ci.own])){ out.naDropped++; out.naRows.push({r,ci}); return; }
          const liter=parseFloat(r[ci.liter])||0;
          const plate=normPlate(r[ci.plate]);
          if(!plate||liter<=0) return;
          out.parsed.push({
            date:String(r[ci.date]||'').trim(),
            liter,
            baht:parseFloat(r[ci.baht])||0,
            price:parseFloat(r[ci.price])||0,
            plate,
            paBaht:parseFloat(r[ci.pab])||0,
            paLiter:parseFloat(r[ci.pal])||0,
            group:normText(r[ci.grp]),
            dc:normText(r[ci.dc]),
            vtype:normText(r[ci.vt]),
            owner:normOwner(r[ci.own])
          });
        });
  return out;
}

function computeFromRows(rows){
  if(!rows||!rows.length) return D;
  const tL=rows.reduce((s,r)=>s+r.liter,0);
  const tB=rows.reduce((s,r)=>s+r.baht,0);
  const avgP=rows.filter(r=>r.price>0).reduce((s,r)=>s+r.price,0)/(rows.filter(r=>r.price>0).length||1);
  const dates=[...new Set(rows.map(r=>r.date))].sort(dateCmp);
  const period=dates[0]+' – '+dates[dates.length-1];

  const vMap={};
  rows.forEach(r=>{
    if(!vMap[r.plate]) vMap[r.plate]={plate:r.plate,group:r.group,dc:r.dc,owner:r.owner,vtype:r.vtype,paBaht:r.paBaht,paLiter:r.paLiter,l:0,b:0};
    vMap[r.plate].l+=r.liter; vMap[r.plate].b+=r.baht;
    if(r.paBaht>0) vMap[r.plate].paBaht=r.paBaht;
    if(r.paLiter>0) vMap[r.plate].paLiter=r.paLiter;
  });
  const vs=Object.values(vMap);
  const paL=vs.reduce((s,v)=>s+(v.paLiter>0?v.paLiter:0),0);
  const paB=vs.reduce((s,v)=>s+(v.paBaht>0?v.paBaht:0),0);

  const grpMap={};
  rows.forEach(r=>{if(!grpMap[r.group])grpMap[r.group]={l:0,b:0};grpMap[r.group].l+=r.liter;grpMap[r.group].b+=r.baht});
  const by_group=Object.entries(grpMap).map(([k,v])=>[k,round1(v.l),round1(v.b)]);

  const ownMap={};
  rows.forEach(r=>{if(!ownMap[r.owner])ownMap[r.owner]={l:0,b:0};ownMap[r.owner].l+=r.liter;ownMap[r.owner].b+=r.baht});
  const by_owner=Object.entries(ownMap).map(([k,v])=>[k,round1(v.l),round1(v.b)]);

  const vtMap={};
  rows.forEach(r=>{if(!vtMap[r.vtype])vtMap[r.vtype]=0;vtMap[r.vtype]+=r.liter});
  const by_vtype=Object.entries(vtMap).sort((a,b)=>b[1]-a[1]).map(([k,v])=>[k,round1(v)]);

  const dMap={};
  rows.forEach(r=>{if(!dMap[r.date])dMap[r.date]={l:0,b:0,prices:[]};dMap[r.date].l+=r.liter;dMap[r.date].b+=r.baht;if(r.price>0)dMap[r.date].prices.push(r.price)});
  const daily=Object.entries(dMap).sort((a,b)=>dateCmp(a[0],b[0])).map(([d,v])=>[d,round1(v.l),round1(v.b)]);
  const daily_price=Object.entries(dMap).sort((a,b)=>dateCmp(a[0],b[0])).map(([d,v])=>v.prices.length?round1(v.prices.reduce((a,b)=>a+b)/v.prices.length):avgP);

  const dgMap={};
  rows.forEach(r=>{const k=r.date+'|'+r.group;if(!dgMap[k])dgMap[k]={d:r.date,g:r.group,l:0};dgMap[k].l+=r.liter});
  const daily_grp=Object.values(dgMap).sort((a,b)=>dateCmp(a.d,b.d)).map(r=>[r.d,r.g,round1(r.l)]);

  const dcgMap={};
  rows.forEach(r=>{const k=r.dc+'|'+r.group;if(!dcgMap[k])dcgMap[k]={dc:r.dc,g:r.group,l:0,b:0,v:new Set()};dcgMap[k].l+=r.liter;dcgMap[k].b+=r.baht;dcgMap[k].v.add(r.plate)});
  const dc_summary=Object.values(dcgMap).sort((a,b)=>b.l-a.l).map(r=>[r.dc,r.g,round1(r.l),round1(r.b),r.v.size]);

  const t10=(g,o)=>vs.filter(v=>v.group===g&&v.owner===o).sort((a,b)=>b.l-a.l).slice(0,10).map(v=>[v.plate,round1(v.l),v.paLiter>0?round1(v.l/v.paLiter*100):0,v.dc]);

  const all_vehicles=vs.sort((a,b)=>b.l-a.l).map(v=>[v.plate,v.group,v.dc,v.owner,round1(v.l),v.paLiter>0?v.paLiter:0,v.paLiter>0?round1(v.l/v.paLiter*100):0,round1(v.b),v.paBaht>0?v.paBaht:0]);
  const over_pa=all_vehicles.filter(r=>r[5]>0&&r[6]>100).sort((a,b)=>b[6]-a[6]);
  const near_pa=all_vehicles.filter(r=>r[5]>0&&r[6]>80&&r[6]<=100).sort((a,b)=>b[6]-a[6]);

  return{period,total_liters:round1(tL),total_baht:round1(tB),pa_liters:round1(paL),pa_baht:round1(paB),
    vehicles:vs.length,dcs:[...new Set(rows.map(r=>r.dc))].length,transactions:rows.length,avg_price:+avgP.toFixed(2),
    by_group,by_owner,by_vtype,daily,daily_price,daily_grp,dc_summary,
    top_gk_own:t10('กระจาย','ผปก'),top_gk_co:t10('กระจาย','บริษัท'),
    top_kn_own:t10('ขนย้าย','ผปก'),top_kn_co:t10('ขนย้าย','บริษัท'),
    all_vehicles,over_pa,near_pa};
}
function round1(n){return Math.round(n*10)/10}

// ════════ EXPORT ════════
function doPNG_legacy_unused(){
  const btn=document.querySelector('[onclick="doPNG()"]');
  const orig=btn.textContent;
  btn.textContent='⏳ กำลังบันทึก...';
  btn.disabled=true;

  // Scroll to top, hide sticky topbar temporarily
  const topbar=document.querySelector('.topbar');
  const tabbar=document.querySelector('.tabbar');
  const prevTopPos=window.scrollY;
  window.scrollTo(0,0);

  // Make topbar non-sticky for capture
  topbar.style.position='relative';

  html2canvas(document.body,{
    scale:2,
    useCORS:true,
    allowTaint:true,
    backgroundColor:theme==='dark'?'#0f1117':'#f0f4fa',
    scrollX:0,
    scrollY:0,
    windowWidth:document.body.scrollWidth,
    windowHeight:document.body.scrollHeight,
    logging:false
  }).then(canvas=>{
    topbar.style.position='';
    window.scrollTo(0,prevTopPos);
    btn.textContent=orig; btn.disabled=false;

    const link=document.createElement('a');
    const period=(D.period||'dashboard').replace(/[ –/]/g,'_');
    link.download=`fleet_dashboard_${period}.png`;
    link.href=canvas.toDataURL('image/png');
    link.click();
  }).catch(err=>{
    topbar.style.position='';
    window.scrollTo(0,prevTopPos);
    btn.textContent=orig; btn.disabled=false;
    alert('Export PNG ไม่สำเร็จ: '+err.message);
  });
}

function doXlsx(){
  const d=D;
  const wb=XLSX.utils.book_new();
  const s=[['Fleet Card Dashboard — สรุปภาพรวม'],['ช่วงข้อมูล',d.period],
    ['ลิตรรวม',d.total_liters],['PA ลิตร',d.pa_liters],['% PA ลิตร',pct(d.total_liters,d.pa_liters).toFixed(1)+'%'],
    ['บาทรวม',d.total_baht],['PA บาท',d.pa_baht],['% PA บาท',pct(d.total_baht,d.pa_baht).toFixed(1)+'%'],
    ['จำนวนรถ',d.vehicles],['จำนวน DC',d.dcs],['ธุรกรรม',d.transactions],['ราคา/ลิตร',d.avg_price]];
  XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(s),'สรุป');
  if(d.dc_summary) XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([['DC','กลุ่ม','ลิตร','บาท','รถ'],...d.dc_summary]),'DC');
  if(d.all_vehicles) XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([['ทะเบียน','กลุ่ม','DC','เจ้าของ','ลิตร','PA ลิตร','%PA','บาท','PA บาท'],...d.all_vehicles]),'รถ');
  if(d.daily) XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([['วันที่','ลิตร','บาท'],...d.daily]),'รายวัน');
  XLSX.writeFile(wb,'NIMEX-Fleet-Card-'+fileStamp()+'.xlsx');
}

// ════════ EXPORT (filter-aware) ════════
function expDC(){
  const d=D; if(!d.dc_summary) return;
  const grp=document.getElementById('f-dcgrp').value;
  const q=(document.getElementById('f-dcsearch').value||'').toLowerCase();
  // aggregate same as renderDCTab
  const map={};
  d.dc_summary.forEach(r=>{
    if(grp && r[1]!==grp) return;
    if(q && !r[0].toLowerCase().includes(q)) return;
    if(!map[r[0]]) map[r[0]]={dc:r[0],l:0,b:0,v:0};
    map[r[0]].l+=r[2]; map[r[0]].b+=r[3]; map[r[0]].v+=r[4];
  });
  const pset=dcPlateSets(grp);
  const rows=Object.values(map).sort((a,b)=>b.l-a.l).map(r=>[r.dc,grp||'รวม',r.l,r.b,pset[r.dc]?pset[r.dc].size:0]);
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([['DC','กลุ่ม','ลิตร','บาท','รถ'],...rows]),'DC');
  const notice=document.getElementById('dc-exp-notice');
  if(notice) notice.textContent = (grp||q)?'(ตาม filter)':'';
  XLSX.writeFile(wb,'NIMEX-Fleet-DC-'+fileStamp()+(grp?'-'+GRP_EN[grp]:'')+'.xlsx');
}

function expVeh(){
  const d=D; if(!d.all_vehicles) return;
  const grp=document.getElementById('f-vgrp').value;
  const own=document.getElementById('f-vown').value;
  const dc=document.getElementById('f-vdc').value;
  const minP=parseFloat(document.getElementById('f-vpct').value)||0;
  const q=(document.getElementById('f-vpl').value||'').toLowerCase();
  let rows=d.all_vehicles;
  if(grp) rows=rows.filter(r=>r[1]===grp);
  if(own) rows=rows.filter(r=>r[3]===own);
  if(dc) rows=rows.filter(r=>r[2]===dc);
  if(minP>=100) rows=rows.filter(r=>r[6]>100);
  else if(minP>0) rows=rows.filter(r=>r[6]>=minP);
  if(q) rows=rows.filter(r=>r[0].toLowerCase().includes(q));
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([['ทะเบียน','กลุ่ม','DC','เจ้าของ','ลิตร','PA ลิตร','%PA','บาท','PA บาท'],...rows]),'รถ');
  XLSX.writeFile(wb,'NIMEX-Fleet-Vehicles-'+fileStamp()+(grp?'-'+GRP_EN[grp]:'')+(own?'-'+OWN_EN[own]:'')+'.xlsx');
}

function expModal(){
  const tbl=document.querySelector('#m-dbody table');
  if(!tbl) return;
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,XLSX.utils.table_to_sheet(tbl),'Data');
  XLSX.writeFile(wb,'NIMEX-Fleet-Detail-'+fileStamp()+'.xlsx');
}

// ════════ BURN RATE ════════
function renderBurnRate(d){
  const wrap=document.getElementById('burn-wrap');
  if(!d.daily||d.daily.length===0){wrap.style.display='none';return;}
  wrap.style.display='';
  const days=d.daily.length;
  const avgPerDay=d.total_liters/days;
  // Calculate remaining days in month from last date
  let daysLeft=30-days; // fallback
  try{
    const lastDateStr=d.daily[d.daily.length-1][0]; // e.g. "04/05/2569"
    const parts=lastDateStr.split('/');
    const month=parseInt(parts[1]);
    const year=parseInt(parts[2])-543; // Buddhist to Gregorian
    const daysInMonth=new Date(year,month,0).getDate();
    const dayOfMonth=parseInt(parts[0]);
    daysLeft=Math.max(0,daysInMonth-dayOfMonth);
  }catch(e){}
  const projRemaining=avgPerDay*daysLeft;
  const projTotal=d.total_liters+projRemaining;
  const paL=d.pa_liters;
  document.getElementById('burn-avg').textContent=fmt(avgPerDay);
  document.getElementById('burn-proj').textContent=fmt(projTotal);
  let status='';
  if(paL>0){
    const overAmt=projTotal-paL;
    if(overAmt>0){
      status=`<span class="dn">⚠️ คาดเกิน PA ${fmt(overAmt)} ล.</span>`;
    } else {
      const daysCanUse=Math.floor((paL-d.total_liters)/avgPerDay);
      status=`<span class="up">✅ PA เพียงพออีก ~${daysCanUse} วัน</span>`;
    }
  }
  document.getElementById('burn-status').innerHTML=status;
  wrap.style.setProperty('--bar', (paL>0&&projTotal>paL)?'var(--gF)':'var(--gold-l)');
}

// ════════ DC MINI KPI ════════
function renderDCMiniKPI(d){
  const el=document.getElementById('dc-kpi-row');
  if(!el||!d.dc_summary) return;
  const grp=document.getElementById('f-dcgrp').value;
  const filtered=grp ? d.dc_summary.filter(r=>r[1]===grp) : d.dc_summary;
  const dcNames=[...new Set(filtered.map(r=>r[0]))];
  const totalLiters=filtered.reduce((s,r)=>s+r[2],0);
  // นับรถไม่ซ้ำ: รถคันเดียวที่อยู่หลายกลุ่ม/หลาย DC นับเป็น 1 คัน
  const totalVeh=new Set(CUR_ROWS.filter(r=>!grp||r.group===grp).map(r=>r.plate)).size;
  // Top DC by liters
  const dcAgg={};
  filtered.forEach(r=>{if(!dcAgg[r[0]])dcAgg[r[0]]=0;dcAgg[r[0]]+=r[2];});
  const sortedDC=Object.entries(dcAgg).sort((a,b)=>b[1]-a[1]);
  const topDCName=sortedDC[0]?sortedDC[0][0].replace(/^\d+\s+/,''):'—';
  const topDCLit=sortedDC[0]?sortedDC[0][1]:0;

  el.innerHTML=`
    <div class="stat"><div class="si">${ICON.pin}</div><div><b>${dcNames.length}</b><span>DC ที่แสดง (แห่ง)</span></div></div>
    <div class="stat"><div class="si">${ICON.fuel}</div><div><b>${fmt(totalLiters)}</b><span>ลิตรรวม</span></div></div>
    <div class="stat"><div class="si">${ICON.truck}</div><div><b>${fmt(totalVeh)}</b><span>รถรวม (คัน ไม่นับซ้ำ)</span></div></div>
    <div class="stat"><div class="si">${ICON.star}</div><div><b style="font-size:16px">${topDCName}</b><span>Top DC · ${fmt(topDCLit)} ล.</span></div></div>`;
}

// ════════ PA OVER ALERT ════════
function checkPAAlert(d){
  // Flash PA section if liters pct > 100
  const pL=d.pa_liters>0?d.total_liters/d.pa_liters*100:0;
  const pB=d.pa_baht>0?d.total_baht/d.pa_baht*100:0;
  const paCards=document.querySelectorAll('.card');
  // Find the PA liter card
  const pfL=document.getElementById('pf-l');
  const pfB=document.getElementById('pf-b');
  if(pfL){
    const parentCard=pfL.closest('.kpi');
    if(parentCard){
      if(pL>100){parentCard.classList.add('pa-over-alert');}
      else{parentCard.classList.remove('pa-over-alert');}
    }
  }
  if(pfB){
    const parentCard=pfB.closest('.kpi');
    if(parentCard){
      if(pB>100){parentCard.classList.add('pa-over-alert');}
      else{parentCard.classList.remove('pa-over-alert');}
    }
  }
}

// ════════ TOOLTIP ON PROGRESS BARS ════════
function addProgressTooltips(){
  document.querySelectorAll('.pa-track').forEach(track=>{
    const fill=track.querySelector('.pa-fill');
    if(!fill) return;
    if(track.parentNode.querySelector('.tipwrap')) return; // already done
    const pct=parseFloat(fill.style.width)||0;
    track.parentNode.insertBefore(
      Object.assign(document.createElement('div'),{
        className:'tipwrap',
        innerHTML:`<div class="tip">${pct.toFixed(1)}% ของ PA</div>`
      }),track);
    track.parentNode.querySelector('.tipwrap').appendChild(track);
  });
}

// ════════ KEYBOARD SHORTCUTS ════════
document.addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT') return;
  const tabs=['overview','dc','vehicles','trend','alert','analysis'];
  const n=parseInt(e.key);
  if(n>=1&&n<=6) goTab(tabs[n-1]);
  if(e.key==='Escape'){
    document.querySelectorAll('.moverlay.open').forEach(m=>m.classList.remove('open'));
    enterDash();
  }
  if(e.key==='/'||e.key==='ก'){
    e.preventDefault();
    // Focus the active tab's search input
    const activeTab=document.querySelector('.tab.on');
    if(activeTab){
      const inp=activeTab.querySelector('input[type=search],input[type=text],input:not([type])');
      if(inp) inp.focus();
    }
  }
});

// ════════ ANALYSIS TAB ════════
let _cMA3=null, _cBurn=null;

function renderAnalysis(){
  const d=D;
  const daily=d.daily||[];
  const nDays=daily.length||1;
  const avgPerDay=d.total_liters/nDays;

  // ── 7-DAY FORECAST per vehicle ──
  const vehicles=d.all_vehicles||[];
  const forecast7=[];
  vehicles.forEach(v=>{
    const usedL=v[4], paL=v[5], pct7=v[6];
    if(paL<=0) return;
    const avgDay=usedL/nDays;
    const proj7=usedL+(avgDay*7);
    const overAmt=proj7-paL;
    if(overAmt>0){
      forecast7.push({plate:v[0],group:v[1],dc:v[2],owner:v[3],usedL,paL,avgDay,proj7,overAmt});
    }
  });
  forecast7.sort((a,b)=>b.overAmt-a.overAmt);

  const warnBox=document.getElementById('forecast-warn-box');
  const okBox=document.getElementById('forecast-ok-box');
  const badge=document.getElementById('forecast-badge');

  if(forecast7.length>0){
    warnBox.style.display='block'; okBox.style.display='none';
    badge.style.display='inline-block';
    badge.textContent=forecast7.length;
    document.getElementById('forecast-count').textContent=forecast7.length;
    document.getElementById('forecast7-tbody').innerHTML=forecast7.map((r,i)=>`
      <tr class="clickrow" onclick="showVehModal('${r.plate}')">
        <td>${i+1}</td>
        <td><strong style="color:var(--bad)">${r.plate}</strong></td>
        <td><span class="bdg ${r.group==='กระจาย'?'b-blue':'b-purple'}">${r.group}</span></td>
        <td style="font-size:11px">${r.dc.replace(/^\d+\s+/,'')}</td>
        <td><span class="bdg ${r.owner==='ผปก'?'b-green':'b-gray'}">${r.owner}</span></td>
        <td class="r">${fmt(r.usedL)}</td>
        <td class="r">${fmt(r.paL)}</td>
        <td class="r">${r.avgDay.toFixed(1)}</td>
        <td class="r">${fmt(r.proj7)}</td>
        <td class="r" style="color:var(--red);font-weight:900">+${fmt(r.overAmt)}</td>
      </tr>`).join('');
  } else {
    warnBox.style.display='none'; okBox.style.display='block';
    badge.style.display='none';
  }

  // ── MOVING AVG 3-DAY CHART ──
  const labels=daily.map(r=>r[0].slice(0,5));
  const P=pal(), dDates=daily.map(r=>r[0]);
  const liters=daily.map(r=>r[1]);
  const ma3=liters.map((_,i)=>{
    if(i<2) return null;
    return Math.round((liters[i]+liters[i-1]+liters[i-2])/3*10)/10;
  });

  if(_cMA3) _cMA3.destroy();
  _cMA3=new Chart(document.getElementById('c-ma3').getContext('2d'),{
    type:'line',
    data:{labels,datasets:[
      {label:'ลิตร/วัน',data:liters,borderColor:P.s[0],backgroundColor:alpha(P.s[0],.1),borderWidth:2,fill:true,tension:.3,pointRadius:2,pointBackgroundColor:P.s[0]},
      {label:'MA 3 วัน',data:ma3,borderColor:P.s[1],borderWidth:2,borderDash:[6,4],pointRadius:0,tension:.4,fill:false}
    ]},
    options:{responsive:true,maintainAspectRatio:false,onClick:dayClick(dDates),plugins:{legend:{position:'top',labels:{color:tc(),boxWidth:12}},tooltip:{mode:'index',intersect:false,callbacks:{label:c=>c.dataset.label+': '+(c.raw==null?'–':fmt1(c.raw))+' ล.'}}},
      scales:{x:{grid:{display:false},ticks:{color:tc()}},y:{beginAtZero:false,grid:{color:gc()},ticks:{color:tc(),callback:v=>fmt(v)}}}}
  });

  // ── BURN RATE SAFETY CHART ──
  // Safe daily = remaining PA / remaining days in month
  const daysInMonth=30;
  const remainDays=Math.max(1,daysInMonth-nDays);
  const remPA=Math.max(0,d.pa_liters-d.total_liters);
  const safeBurn=remPA/remainDays;
  const safeLine=Array(labels.length).fill(Math.round(safeBurn*10)/10);
  const avgLine=Array(labels.length).fill(Math.round(avgPerDay*10)/10);

  if(_cBurn) _cBurn.destroy();
  _cBurn=new Chart(document.getElementById('c-burnrate').getContext('2d'),{
    type:'bar',
    data:{labels,datasets:[
      {label:'ลิตร/วัน',data:liters,backgroundColor:liters.map(l=>l>safeBurn?P.bad:P.s[0]),borderRadius:3,order:2},
      {label:'เฉลี่ย/วัน',data:avgLine,type:'line',borderColor:P.s[2],borderWidth:2,borderDash:[4,3],pointRadius:0,fill:false,order:1},
      {label:'Safe Burn Rate',data:safeLine,type:'line',borderColor:P.s[1],borderWidth:2,borderDash:[8,4],pointRadius:0,fill:false,order:0}
    ]},
    options:{responsive:true,maintainAspectRatio:false,onClick:dayClick(dDates),plugins:{legend:{position:'top',labels:{color:tc(),boxWidth:12}},tooltip:{mode:'index',intersect:false,callbacks:{label:c=>c.dataset.label+': '+fmt1(c.raw)+' ล.'}}},
      scales:{x:{grid:{display:false},ticks:{color:tc()}},y:{beginAtZero:false,grid:{color:gc()},ticks:{color:tc(),callback:v=>fmt(v)}}}}
  });

  // ── SUMMARY TABLE ──
  const daysLeft=Math.max(1,daysInMonth-nDays);
  const rows=vehicles.filter(v=>v[5]>0).sort((a,b)=>b[6]-a[6]).slice(0,100);
  document.getElementById('analysis-veh-tbody').innerHTML=rows.map((v,i)=>{
    const avgDay=v[4]/nDays;
    const projEOM=v[4]+(avgDay*daysLeft);
    const willOver=projEOM>v[5];
    const status=willOver
      ?`<span class="bdg b-red">⚠️ จะเกิน</span>`
      :v[6]>80?`<span class="bdg b-yellow">⚡ ระวัง</span>`
      :`<span class="bdg b-green">✅ ปลอดภัย</span>`;
    return `<tr>
      <td>${i+1}</td>
      <td><strong>${v[0]}</strong></td>
      <td><span class="bdg ${v[1]==='กระจาย'?'b-blue':'b-purple'}">${v[1]}</span></td>
      <td style="font-size:11px">${v[2].replace(/^\d+\s+/,'')}</td>
      <td class="r">${fmt(v[4])}</td>
      <td class="r">${fmt(v[5])}</td>
      <td>${pchip(v[6])}</td>
      <td class="r">${avgDay.toFixed(1)}</td>
      <td class="r" style="color:${willOver?'var(--red)':'inherit'}">${fmt(projEOM)}</td>
      <td>${status}</td>
    </tr>`;
  }).join('');
}


const _origRender=render;
render=function(d){
  _origRender(d);
  renderBurnRate(d);
  checkPAAlert(d);
  document.getElementById('pf-l').parentNode.title=pctS(d.total_liters,d.pa_liters)+' ของ PA ลิตร';
  document.getElementById('pf-b').parentNode.title=pctS(d.total_baht,d.pa_baht)+' ของ PA บาท';
};

const _origRenderDCTab=renderDCTab;
renderDCTab=function(){
  _origRenderDCTab();
  renderDCMiniKPI(D);
};

// ════════ KEYBOARD HINT in topbar ════════
// เริ่มทำงาน: boot() ใน admin (โหลดจาก Google Sheet)
// ════════ NIMEX LAYOUT HELPERS (ไม่ยุ่งกับสูตรคำนวณ) ════════
const GRP_EN={'กระจาย':'Distribution','ขนย้าย':'Transfer'};
const OWN_EN={'ผปก':'Owner','บริษัท':'Company'};
function curMonth(){const s=document.getElementById('f-month');return s?s.value:'';}
function fileStamp(){const mk=curMonth();const m=mk?mk.split('/'):null;return (m?(m[1]+'-'+m[0]):'AllMonths')+(GRP?'-'+GRP_EN[GRP]:'');}
function scopeLabel(){const mk=curMonth();return (mk?monthLabel(mk):'ทุกเดือน (รวม)')+' · '+(GRP||'ทุกกลุ่ม');}
function escH(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

function enterDash(){const c=document.getElementById('cover');if(c&&!c.classList.contains('hide')){c.classList.add('hide');if(D)setTimeout(()=>{renderCharts();},30);}}

// ปุ่มกลุ่มสีทอง: กรองทั้งหน้า
let _grpForced=false;
function setGroup(g){GRP=g;applyMonthFilter();}
function syncGroupUI(){
  document.querySelectorAll('#seg-group button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.grp===GRP)));
  ['f-dcgrp','f-vgrp'].forEach(id=>{const s=document.getElementById(id);if(!s)return;
    if(GRP){s.value=GRP;s.disabled=true;}else{if(_grpForced)s.value='';s.disabled=false;}});
  _grpForced=!!GRP;
}
function clearMonth(){const s=document.getElementById('f-month');if(s){s.value='';applyMonthFilter();}}
function renderChips(){
  const x=document.getElementById('chips-x');if(!x)return;
  const mk=curMonth();let h='';
  if(mk) h+=`<span class="chip">เดือน ${escH(monthLabel(mk))}<button onclick="clearMonth()" aria-label="ล้างตัวกรองเดือน">✕</button></span>`;
  if(GRP) h+=`<span class="chip">กลุ่ม ${escH(GRP)}<button onclick="setGroup('')" aria-label="ล้างตัวกรองกลุ่ม">✕</button></span>`;
  x.innerHTML=h;
}
function showEmpty(){
  renderChips();
  document.getElementById('period-badge').textContent='ไม่มีข้อมูลในตัวกรองนี้';
}
function syncBadges(){
  const a=document.getElementById('abadge');
  if(a) a.classList.toggle('zero',a.textContent==='0');
  document.querySelectorAll('[data-mirror]').forEach(m=>{
    const s=document.getElementById(m.dataset.mirror);if(!s)return;
    m.textContent=s.textContent;
    m.style.display=(s.style.display==='none'||s.classList.contains('zero')||s.textContent==='0')?'none':'';
  });
}

// รถไม่ซ้ำต่อ DC (จากแถวข้อมูลจริง) — รถคันเดียวที่อยู่หลายกลุ่มนับเป็น 1
function dcPlateSets(grp){
  const m={};
  CUR_ROWS.forEach(r=>{if(grp&&r.group!==grp)return;(m[r.dc]||(m[r.dc]=new Set())).add(r.plate);});
  return m;
}

// รายละเอียดรายวัน (จากการกดกราฟหรือแถวตารางรายวัน)
function showDayModal(date){
  const rows=CUR_ROWS.filter(r=>r.date===date);
  if(!rows.length) return;
  const m={};
  rows.forEach(r=>{if(!m[r.dc])m[r.dc]={dc:r.dc,l:0,b:0,p:new Set(),g:new Set()};const o=m[r.dc];o.l+=r.liter;o.b+=r.baht;o.p.add(r.plate);o.g.add(r.group);});
  const list=Object.values(m).sort((a,b)=>b.l-a.l);
  const tl=rows.reduce((s,r)=>s+r.liter,0), tb=rows.reduce((s,r)=>s+r.baht,0);
  document.getElementById('m-dtitle').textContent='วันที่ '+date;
  document.getElementById('m-dbody').innerHTML=`
    <div class="g g2" style="margin-bottom:12px">
      <div class="kbox"><div class="klabel">ลิตรรวม</div><div class="kval">${fmt(tl)}</div></div>
      <div class="kbox"><div class="klabel">ยอดเงิน</div><div class="kval">฿${fmt(tb)}</div></div>
      <div class="kbox"><div class="klabel">รถ (คัน)</div><div class="kval">${fmt(new Set(rows.map(r=>r.plate)).size)}</div></div>
      <div class="kbox"><div class="klabel">DC (แห่ง)</div><div class="kval">${list.length}</div></div>
    </div>
    <div class="sb2"><table class="dt">
      <thead><tr><th>#</th><th>DC</th><th>กลุ่ม</th><th class="r">ลิตร</th><th class="r">บาท</th><th class="r">รถ (คัน)</th></tr></thead>
      <tbody>${list.map((o,i)=>`<tr class="clickrow" onclick="showDCVeh('${o.dc}')"><td>${i+1}</td><td>${escH(o.dc.replace(/^\d+\s+/,''))}</td><td>${[...o.g].join(', ')}</td><td class="r"><strong>${fmt(o.l)}</strong></td><td class="r">฿${fmt(o.b)}</td><td class="r">${o.p.size}</td></tr>`).join('')}</tbody>
    </table></div>`;
  openM('m-detail');
}

// ตาราง: กดหัวเพื่อเรียง / แถวที่เลือกมีแถบทอง
function cellVal(td){const t=(td?td.textContent:'').trim();const n=t.replace(/[฿,%+\s]|ล\.|คัน/g,'');return (n!==''&&!isNaN(n))?parseFloat(n):t;}
document.addEventListener('click',e=>{
  const th=e.target.closest('.dt thead th');
  if(th){
    const tbl=th.closest('table'),tb=tbl.tBodies[0];if(!tb)return;
    const i=[...th.parentNode.children].indexOf(th);
    const rows=[...tb.rows].filter(r=>r.cells.length>i);
    if(rows.length<2)return;
    const dir=th.dataset.sort==='desc'?'asc':'desc';
    th.parentNode.querySelectorAll('th').forEach(x=>delete x.dataset.sort);th.dataset.sort=dir;
    rows.sort((a,b)=>{const x=cellVal(a.cells[i]),y=cellVal(b.cells[i]);const c=(typeof x==='number'&&typeof y==='number')?x-y:String(x).localeCompare(String(y),'th');return dir==='asc'?c:-c;});
    rows.forEach(r=>tb.appendChild(r));
    return;
  }
  const tr=e.target.closest('.dt tbody tr.clickrow');
  if(tr){tr.parentNode.querySelectorAll('tr.sel').forEach(x=>x.classList.remove('sel'));tr.classList.add('sel');}
});


// ════════ GOOGLE SHEET SYNC + ADMIN ════════
// ข้อมูลมาจาก Google Sheet ผ่าน Apps Script (ที่อยู่อยู่ใน config.js) ไม่มีข้อมูลฝังในหน้าเว็บ
let ADMIN=false, PLAN=null, SHEET_INFO=null;
TAB_INFO.settings=['ตั้งค่า','เติมไฟล์และตรวจสอบข้อมูล'];
function getKey(){try{return sessionStorage.getItem('fleet-key')}catch(e){return null}}
function setKey(v){try{v?sessionStorage.setItem('fleet-key',v):sessionStorage.removeItem('fleet-key')}catch(e){}}
async function api(body){
  const r=await fetch(window.FLEET_API,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({...body,key:getKey()})});
  const j=await r.json(); if(!j.ok) throw new Error(j.error||'failed'); return j;
}
function bootMsg(h,spin){const b=document.getElementById('boot');b.hidden=false;b.innerHTML=(spin?'<div class="spin"></div>':'')+h;}
function setAdmin(on){ADMIN=on;document.body.classList.toggle('admin',on);}

async function loadData(fresh){
  const url=window.FLEET_API+(fresh?(window.FLEET_API.includes('?')?'&':'?')+'t='+Date.now():'');
  const j=await (await fetch(url,{cache:fresh?'no-store':'default'})).json();
  if(!j||!j.ok) throw new Error('bad data');
  const p=parseRaw([j.headers,...j.rows]);              // กติกาเดียวกับการเติมไฟล์ (#N/A, ลิตร ≤ 0)
  const dates=[...new Set(p.parsed.map(r=>r.date))].sort(dateCmp);
  STORE={'__sheet__':{rows:p.parsed,filename:'Google Sheet',range:(dates[0]||'')+' – '+(dates[dates.length-1]||''),dates}};
  SHEET_INFO={raw:j.rows.length,kept:p.parsed.length,na:p.naDropped,skip:j.rows.length-p.parsed.length-p.naDropped,updated:j.updated};
  window.SHEET_SETTINGS=j.settings||null;
  if(typeof onSheetSettings==='function') onSheetSettings(window.SHEET_SETTINGS);
  rebuildAllRows();
  if(!ALL_ROWS.length){ D=null; bootMsg(ADMIN?'<h2>ยังไม่มีข้อมูลใน Google Sheet</h2><p class="note">ไปที่หน้า ตั้งค่า แล้วเติมไฟล์ Excel เพื่อเริ่มต้น</p>':'<h2>ยังไม่มีข้อมูล</h2>'); if(ADMIN){document.getElementById('root').classList.remove('loading');document.getElementById('boot').hidden=false;goTab('settings');} renderChecks(); return; }
  document.getElementById('boot').hidden=true;
  document.getElementById('root').classList.remove('loading');
  populateMonthSelect();
  applyMonthFilter();
  renderChecks();
}
async function boot(){
  const wantAdmin=location.hash==='#admin', key=getKey();
  if(wantAdmin||key) enterDash();
  if(!window.FLEET_API){bootMsg('<h2>ยังไม่ได้ตั้งค่า</h2><p class="note">ยังไม่ได้ใส่ที่อยู่ Apps Script ในไฟล์ config.js</p>');return;}
  if(key){try{await api({a:'auth'});setAdmin(true);}catch(e){setKey(null);if(wantAdmin)openLogin('รหัสไม่ถูกต้อง หรือหมดอายุ');}}
  else if(wantAdmin) openLogin('');
  bootMsg('<p>กำลังโหลดข้อมูลจาก Google Sheet…</p>',true);
  try{await loadData(false);}catch(e){console.error(e);bootMsg('<h2>โหลดข้อมูลไม่สำเร็จ</h2><p class="note">ตรวจการเชื่อมต่อ แล้วลองเปิดหน้านี้ใหม่อีกครั้ง</p><button class="btn" onclick="location.reload()">ลองใหม่</button>');}
}
function openLogin(err){document.getElementById('login-msg').textContent=err||'';openM('m-login');setTimeout(()=>document.getElementById('adm-key').focus(),50);}
async function doLogin(){
  const v=document.getElementById('adm-key').value, m=document.getElementById('login-msg');
  if(!v){m.textContent='ใส่รหัสก่อน';return;}
  m.textContent='กำลังตรวจสอบ…';setKey(v);
  try{await api({a:'auth'});setAdmin(true);closeM('m-login');document.getElementById('adm-key').value='';if(D)goTab('settings');renderChecks();}
  catch(e){setKey(null);m.textContent='รหัสไม่ถูกต้อง';}
}
function logout(){setKey(null);setAdmin(false);history.replaceState(null,'',location.pathname+location.search);goTab('overview');}
window.addEventListener('hashchange',()=>{if(location.hash==='#admin'&&!ADMIN)openLogin('');});

// ---- เติมไฟล์: อ่านในเครื่อง -> สรุปให้ตรวจ -> บันทึก ----
function processFile(file){
  if(!ADMIN){openLogin('ต้องเข้าสู่ระบบผู้ดูแลก่อน');return;}
  PLAN=null;document.getElementById('set-plan').innerHTML='';
  document.getElementById('ustatus').textContent='⏳ กำลังอ่าน '+file.name+'...';
  const reader=new FileReader();
  reader.onload=function(e){
    try{
      const wb=XLSX.read(e.target.result,{type:'array'});
      let parsed=[],naDropped=0,naRows=[];
      wb.SheetNames.forEach(n=>{const p=parseRaw(XLSX.utils.sheet_to_json(wb.Sheets[n],{header:1}));for(const r of p.parsed)parsed.push(r);for(const x of p.naRows)naRows.push(x);naDropped+=p.naDropped;});
      if(!parsed.length){document.getElementById('ustatus').textContent='❌ ไม่พบข้อมูลในไฟล์นี้';return;}
      const dates=[...new Set(parsed.map(r=>r.date))].sort(dateCmp);
      const badDates=dates.filter(d=>!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(d));
      const dset=new Set(dates);
      const oldRows=ALL_ROWS.filter(r=>dset.has(r.date));
      const oldDays=new Set(oldRows.map(r=>r.date)).size;
      const na=naRows.map(({r,ci})=>({date:String(r[ci.date]||'').trim(),plate:String(r[ci.plate]??'').trim(),liter:parseFloat(r[ci.liter])||0,baht:parseFloat(r[ci.baht])||0,dc:String(r[ci.dc]??'').trim()}));
      const naL=na.reduce((s,x)=>s+x.liter,0),naP=new Set(na.map(x=>x.plate)).size;
      PLAN={file:file.name,parsed,dates,naDropped,badDates,na};
      const months=[...new Set(dates.map(monthKey))].filter(Boolean).map(monthLabel).join(', ');
      const tl=parsed.reduce((s,r)=>s+r.liter,0),tb=parsed.reduce((s,r)=>s+r.baht,0),ol=oldRows.reduce((s,r)=>s+r.liter,0);
      document.getElementById('ustatus').textContent='อ่านไฟล์แล้ว ตรวจสรุปด้านล่างก่อนบันทึก';
      document.getElementById('set-plan').innerHTML=`
        <div class="stats">
          <div class="stat"><div><b>${fmt(parsed.length)}</b><span>รายการที่จะบันทึก</span></div></div>
          <div class="stat"><div><b>${dates.length}</b><span>วัน · ${escH(months||'-')}</span></div></div>
          <div class="stat"><div><b>${fmt(tl)}</b><span>ลิตรรวม</span></div></div>
          <div class="stat"><div><b>${fmt(tb)}</b><span>บาทรวม</span></div></div>
        </div>
        <p class="note" style="text-align:left;margin:0">ช่วงวันที่ ${escH(dates[0])} – ${escH(dates[dates.length-1])} · รถ ${fmt(new Set(parsed.map(r=>r.plate)).size)} คัน · DC ${new Set(parsed.map(r=>r.dc)).size} แห่ง<br>
        ${oldDays?`⚠️ มีข้อมูลเดิม ${oldDays} วัน (${fmt(oldRows.length)} รายการ · ${fmt(ol)} ลิตร) จะถูกลบแล้วแทนที่ด้วยค่าใหม่`:'✅ วันที่ใหม่ทั้งหมด เพิ่มเข้าระบบ'}
        ${naDropped?`<br><span class="badt">⚠️ ตัดแถว #N/A ออก ${fmt(naDropped)} แถว · ${fmt(naL)} ลิตร (${(naL/(tl+naL)*100).toFixed(1)}% ของไฟล์) · ${fmt(naP)} ทะเบียน — ทะเบียน/DC/กลุ่ม/เจ้าของ หาไม่เจอในตารางอ้างอิง ไม่ถูกนับในแดชบอร์ด</span> <button class="btn alt btn-sm" onclick="exportNA()">ดาวน์โหลดรายการ #N/A</button>`:''}
        ${badDates.length?`<br><span class="badt">วันที่ไม่ใช่รูปแบบ dd/mm/yyyy ${badDates.length} ค่า เช่น ${escH(badDates.slice(0,3).join(', '))} — ตรวจไฟล์ก่อนบันทึก</span>`:''}</p>
        <div class="btns"><button class="btn goldb" id="btn-commit" onclick="commitPlan()">บันทึกลง Google Sheet</button><button class="btn alt" onclick="cancelPlan()">ยกเลิก</button></div>`;
    }catch(err){document.getElementById('ustatus').textContent='❌ '+err.message;}
  };
  reader.readAsArrayBuffer(file);
}
function cancelPlan(){PLAN=null;document.getElementById('set-plan').innerHTML='';document.getElementById('ustatus').textContent='';document.getElementById('finput').value='';}
async function commitPlan(){
  if(!PLAN) return;
  const btn=document.getElementById('btn-commit'),st=document.getElementById('ustatus');btn.disabled=true;
  st.textContent='⏳ กำลังบันทึกลง Google Sheet… (อาจใช้เวลา 20–60 วินาที อย่าปิดหน้านี้)';
  try{
    const rows=PLAN.parsed.map(r=>[r.date,r.liter,r.baht,r.price,r.plate,r.paBaht,r.paLiter,r.group,r.dc,r.vtype,r.owner]);
    const res=await api({a:'upsert',file:PLAN.file,dates:PLAN.dates,rows});
    st.textContent=`✅ บันทึกแล้ว: เพิ่ม ${fmt(res.added)} แถว · แทนที่ ${fmt(res.replaced)} แถว · ในชีตมี ${fmt(res.total)} แถว — กำลังโหลดข้อมูลใหม่…`;
    PLAN=null;document.getElementById('set-plan').innerHTML='';document.getElementById('finput').value='';
    await loadData(true);
    st.textContent=`✅ บันทึกและโหลดข้อมูลใหม่แล้ว (เพิ่ม ${fmt(res.added)} · แทนที่ ${fmt(res.replaced)} แถว)`;
  }catch(e){st.textContent='❌ บันทึกไม่สำเร็จ: '+(e.message==='denied'?'รหัสผู้ดูแลไม่ถูกต้อง':e.message==='busy'?'ระบบกำลังบันทึกงานอื่น รอสักครู่แล้วลองใหม่':e.message);btn.disabled=false;}
}

// ---- ตรวจสอบข้อมูล ----
function renderChecks(){
  const f=document.getElementById('flist');if(!f||!SHEET_INFO)return;
  const I=SHEET_INFO;
  f.innerHTML=`ใน Google Sheet ${fmt(I.raw)} แถว · ใช้ได้ ${fmt(I.kept)} แถว`+(I.na?` · <span class="badt">ตัด #N/A ${fmt(I.na)} แถว</span>`:'')+(I.skip?` · <span class="badt">ข้ามแถวไม่มีทะเบียนหรือลิตร ≤ 0 อีก ${fmt(I.skip)} แถว</span>`:'')+(I.updated?` · โหลดเมื่อ ${new Date(I.updated).toLocaleString('th-TH',{dateStyle:'medium',timeStyle:'short'})}`:'');
  const m={};ALL_ROWS.forEach(r=>{const k=monthKey(r.date);if(!m[k])m[k]={n:0,d:new Set(),l:0,b:0,p:new Set()};const o=m[k];o.n++;o.d.add(r.date);o.l+=r.liter;o.b+=r.baht;o.p.add(r.plate);});
  const ks=Object.keys(m).sort((a,b)=>{const x=a.split('/'),y=b.split('/');return (+x[1]*100+ +x[0])-(+y[1]*100+ +y[0]);});
  document.getElementById('chk-tbody').innerHTML=ks.map(k=>{const o=m[k];return `<tr><td>${escH(monthLabel(k))}</td><td class="r">${fmt(o.n)}</td><td class="r">${o.d.size}</td><td class="r">${fmt(o.l)}</td><td class="r">฿${fmt(o.b)}</td><td class="r">${fmt(o.p.size)}</td></tr>`;}).join('')||'<tr><td colspan="6" style="text-align:center">ยังไม่มีข้อมูล</td></tr>';
}
function exportAllData(){
  const h=['วันที่','ปริมาณ(ลิตร)','จำนวนเงิน','ราคาน้ำมัน','ทะเบียน','วงเงินบาท','วงเงินลิตร','กลุ่มรถ','สังกัดDC','ประเภทรถ','ผปก/บริษัท'];
  const rows=[...ALL_ROWS].sort((a,b)=>dateCmp(a.date,b.date)).map(r=>[r.date,r.liter,r.baht,r.price,r.plate,r.paBaht,r.paLiter,r.group,r.dc,r.vtype,r.owner]);
  const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([h,...rows]),'Data');
  const t=new Date();XLSX.writeFile(wb,'NIMEX-Fleet-Card-AllData-'+t.getFullYear()+String(t.getMonth()+1).padStart(2,'0')+String(t.getDate()).padStart(2,'0')+'.xlsx');
}
boot();

function exportNA(){
  if(!PLAN||!PLAN.na||!PLAN.na.length) return;
  const m={};PLAN.na.forEach(x=>{const k=x.plate||'(ว่าง)';if(!m[k])m[k]={n:0,l:0,b:0,d1:x.date,d2:x.date,dc:x.dc};const o=m[k];o.n++;o.l+=x.liter;o.b+=x.baht;if(dateCmp(x.date,o.d1)<0)o.d1=x.date;if(dateCmp(x.date,o.d2)>0)o.d2=x.date;});
  const sum=[['ทะเบียน','จำนวนรายการ','ลิตร','บาท','วันแรก','วันสุดท้าย','สังกัด DC ในไฟล์'],...Object.entries(m).sort((a,b)=>b[1].l-a[1].l).map(([k,o])=>[k,o.n,Math.round(o.l*100)/100,Math.round(o.b*100)/100,o.d1,o.d2,o.dc])];
  const det=[['วันที่','ทะเบียน','ลิตร','บาท','สังกัด DC ในไฟล์'],...PLAN.na.map(x=>[x.date,x.plate,x.liter,x.baht,x.dc])];
  const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(sum),'สรุปตามทะเบียน');XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(det),'รายการ');
  XLSX.writeFile(wb,'NIMEX-Fleet-NA-'+PLAN.file.replace(/\.[^.]+$/,'').replace(/[^A-Za-z0-9_-]+/g,'_')+'.xlsx');
}

