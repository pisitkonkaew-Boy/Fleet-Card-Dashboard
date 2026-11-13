/* NIMEX Fleet Card Dashboard — share.js
 * แชร์/ส่งออกแบบเลือกหัวข้อ (Excel · PowerPoint · PNG ยาว · ข้อความ) + อินโฟกราฟิก 16:9
 * ใช้ตัวกรองบนหน้า (เดือน + กลุ่ม) · ไม่แก้สูตรเดิมของหน้า: ใช้ D / CUR_ROWS / ALL_ROWS / computeFromRows จาก app.js
 * ภาพทุกแบบสร้างจาก SVG ล้วน ฝังฟอนต์ Prompt + โลโก้ (ไม่ใช้ html2canvas)
 */

// ════════ 1) เกณฑ์เกรด (ตั้งค่าได้ในหน้า ตั้งค่า · เก็บใน Google Sheet) ════════
const GRADES=['A','B','C','D','F'];
const GCOL={A:'#123f8c',B:'#6e93d6',C:'#d4a72c',D:'#d9822b',F:'#b8334a'};
const G_PRESET={proj:[80,90,100,110],cur:[50,80,90,100]};
let GCFG={basis:'proj',th:G_PRESET.proj.slice()};
function normG(g){
  if(!g||typeof g!=='object')return null;
  const basis=['proj','cur','off'].includes(g.basis)?g.basis:'proj';
  const th=(Array.isArray(g.th)?g.th:[]).map(Number);
  if(th.length!==4||th.some(x=>!isFinite(x))||th.some((x,i)=>i&&x<=th[i-1]))return null;
  return {basis,th};
}
try{const l=normG(JSON.parse(localStorage.getItem('fleet-grade')||'null'));if(l)GCFG=l;}catch(e){}
function onSheetSettings(st){const g=st&&normG(st.grade);if(g)GCFG=g;fillGradeUI();}
function fillGradeUI(){
  const b=document.getElementById('g-basis');if(!b)return;
  b.value=GCFG.basis;['g-a','g-b','g-c','g-d'].forEach((id,i)=>document.getElementById(id).value=GCFG.th[i]);
}
function gradePreset(k){G_PRESET[k].forEach((v,i)=>document.getElementById(['g-a','g-b','g-c','g-d'][i]).value=v);document.getElementById('g-basis').value=k;document.getElementById('g-msg').textContent='ยังไม่ได้บันทึก กด "บันทึกเกณฑ์"';}
async function saveGradeCfg(){
  const m=document.getElementById('g-msg');
  const g=normG({basis:document.getElementById('g-basis').value,th:['g-a','g-b','g-c','g-d'].map(id=>document.getElementById(id).value)});
  if(!g){m.textContent='ตัวเลขเกณฑ์ต้องครบ 4 ช่อง และเรียงจากน้อยไปมาก (A < B < C < D)';return;}
  GCFG=g;try{localStorage.setItem('fleet-grade',JSON.stringify(g));}catch(e){}
  m.textContent='กำลังบันทึก…';
  try{await api({a:'settings',settings:{...(window.SHEET_SETTINGS||{}),grade:g}});window.SHEET_SETTINGS={...(window.SHEET_SETTINGS||{}),grade:g};m.textContent='✅ บันทึกลง Google Sheet แล้ว ใช้กับทุกเครื่อง';}
  catch(e){m.textContent=e.message==='unknown'?'⚠️ บันทึกไว้เฉพาะเครื่องนี้ — Code.gs บนเซิร์ฟเวอร์ยังเป็นเวอร์ชันเก่า ให้ Deploy เวอร์ชันใหม่ก่อน':'❌ บันทึกไม่สำเร็จ: '+e.message;}
}
function gradeOf(p){if(GCFG.basis==='off'||p==null||!isFinite(p))return null;const t=GCFG.th;return p<=t[0]?'A':p<=t[1]?'B':p<=t[2]?'C':p<=t[3]?'D':'F';}
function gradeRule(){const t=GCFG.th;return `A ≤${t[0]}% · B ≤${t[1]}% · C ≤${t[2]}% · D ≤${t[3]}% · F >${t[3]}%`;}

// ════════ 2) ชั้นตัวเลขสำหรับส่งออก ════════
const pf=v=>v==null||!isFinite(v)?'—':v.toFixed(1)+'%';
const r1=v=>v==null||!isFinite(v)?null:Math.round(v*10)/10;
const r2=v=>v==null||!isFinite(v)?null:Math.round(v*100)/100;
const dcName=s=>String(s||'').replace(/^\d+\s+/,'');
// ตัวคูณคาดการณ์สิ้นเดือน — สูตรเดียวกับการ์ด "คาดใช้ทั้งเดือน" บนหน้า: ใช้แล้ว + (ใช้แล้ว ÷ วันที่มีข้อมูล) × วันที่เหลือ
function projFactor(d){
  if(!d||!d.daily||!d.daily.length||!curMonth())return null;
  const days=d.daily.length;let left=30-days;
  try{const [dd,mm,yy]=d.daily[days-1][0].split('/').map(Number);left=Math.max(0,new Date(yy-543,mm,0).getDate()-dd);}catch(e){}
  return (days+left)/days;
}
function vehPA(d){const m={};(d.all_vehicles||[]).forEach(v=>{m[v[0]]={paL:v[5],paB:v[8]};});return m;}
// รวมตามมิติ: ลิตร/บาท จากแถวข้อมูล · PA = ผลรวม PA ของรถ (ไม่ซ้ำ) ที่อยู่ในมิตินั้น
function aggBy(rows,keyFn,pa){
  const m={};
  rows.forEach(r=>{const k=keyFn(r);const o=m[k]||(m[k]={key:k,l:0,b:0,ps:0,pn:0,plates:new Set()});o.l+=r.liter;o.b+=r.baht;o.plates.add(r.plate);if(r.price>0){o.ps+=r.price;o.pn++;}});
  return Object.values(m).map(o=>{let paL=0,paB=0,nPA=0;o.plates.forEach(p=>{const v=pa[p];if(v&&v.paL>0){paL+=v.paL;nPA++;}if(v&&v.paB>0)paB+=v.paB;});
    return {key:o.key,l:o.l,b:o.b,n:o.plates.size,nPA,paL,paB,pctL:paL>0?o.l/paL*100:null,pctB:paB>0?o.b/paB*100:null,price:o.pn?o.ps/o.pn:null};});
}
function prevInfo(){
  const mk=curMonth();if(!mk||!CUR_ROWS.length)return null;
  const [m,y]=mk.split('/').map(Number),pm=m===1?12:m-1,py=m===1?y-1:y,pmk=String(pm).padStart(2,'0')+'/'+py;
  const lastDay=Math.max(...CUR_ROWS.map(r=>+r.date.split('/')[0]));
  let rows=ALL_ROWS.filter(r=>monthKey(r.date)===pmk&&+r.date.split('/')[0]<=lastDay);
  if(GRP)rows=rows.filter(r=>r.group===GRP);
  if(!rows.length)return null;
  return {mk:pmk,lastDay,d:computeFromRows(rows),label:`1–${lastDay} ${monthLabel(pmk)}`};
}
let _ctx=null,_ctxKey='';
function ctx(){
  const key=[curMonth(),GRP,JSON.stringify(GCFG),D&&D.transactions,ALL_ROWS.length].join('|');
  if(_ctx&&_ctxKey===key)return _ctx;
  const mk=curMonth(),monthRows=mk?ALL_ROWS.filter(r=>monthKey(r.date)===mk):ALL_ROWS;
  const dAll=GRP?computeFromRows(monthRows):D;
  const f=projFactor(D),fAll=projFactor(dAll);
  const mode=GCFG.basis==='off'?'off':(GCFG.basis==='proj'&&f?'proj':'cur');
  const fb=GCFG.basis==='proj'&&!f;  // ทุกเดือน: คาดการณ์ไม่ได้ ใช้ %PA ที่ใช้ไปแล้ว
  const val=(p,ff)=>p==null?null:(mode==='proj'?p*ff:p);
  const pa=vehPA(D),paAll=vehPA(dAll);
  const go=aggBy(monthRows,r=>r.group+' · '+r.owner,paAll).sort((a,b)=>a.key.localeCompare(b.key,'th'));
  go.forEach(o=>{o.proj=o.pctL!=null&&fAll?o.pctL*fAll:null;o.val=val(o.pctL,fAll);o.g=gradeOf(o.val);});
  const dcs=aggBy(CUR_ROWS,r=>r.dc,pa),vt=aggBy(CUR_ROWS,r=>r.vtype,pa).sort((a,b)=>b.l-a.l);
  [dcs,vt].forEach(a=>a.forEach(o=>{o.proj=o.pctL!=null&&f?o.pctL*f:null;o.val=val(o.pctL,f);o.g=gradeOf(o.val);}));
  const veh=(D.all_vehicles||[]).filter(v=>v[5]>0).map(v=>{const p=v[4]/v[5]*100;return {plate:v[0],group:v[1],dc:v[2],owner:v[3],l:v[4],paL:v[5],pctL:p,proj:f?p*f:null,val:val(p,f),g:gradeOf(val(p,f))};});
  const gcount={};GRADES.forEach(g=>gcount[g]=0);veh.forEach(v=>{if(v.g)gcount[v.g]++;});
  const fleetPct=pct(D.total_liters,D.pa_liters),fleetVal=D.pa_liters>0?val(fleetPct,f):null;
  _ctx={mk,f,mode,fb,go,dcs,vt,veh,gcount,fleetPct,fleetProj:f&&D.pa_liters>0?fleetPct*f:null,fleetVal,fleetG:gradeOf(fleetVal),prev:prevInfo(),
    basisLabel:mode==='proj'?'%PA คาดการณ์สิ้นเดือน':'%PA ที่ใช้ไปแล้ว'};
  _ctxKey=key;return _ctx;
}
// KPI หลัก (ต่ำ = ดี ทุกตัว)
function kpiList(C){
  const d=D,p=C.prev&&C.prev.d;
  return [
    {k:'l',t:'ลิตรที่ใช้',v:d.total_liters,u:'ลิตร',pv:p?p.total_liters:null,m:'pct',fv:fmt,sub:'PA '+fmt(d.pa_liters)+' ล.'},
    {k:'b',t:'เงินที่ใช้',v:d.total_baht,u:'บาท',pv:p?p.total_baht:null,m:'pct',fv:fmt,sub:'PA '+fmt(d.pa_baht)+' บ.'},
    {k:'pl',t:'%PA ลิตร (ใช้แล้ว)',v:d.pa_liters>0?pct(d.total_liters,d.pa_liters):null,u:'%',pv:p&&p.pa_liters>0?pct(p.total_liters,p.pa_liters):null,m:'pt',fv:v=>v.toFixed(1),sub:'%PA บาท '+pf(d.pa_baht>0?pct(d.total_baht,d.pa_baht):null),g:C.mode==='cur'?C.fleetG:null},
    {k:'pj',t:'%PA คาดการณ์สิ้นเดือน',v:C.fleetProj,u:'%',pv:null,m:'none',fv:v=>v.toFixed(1),sub:C.f?'คาดใช้ '+fmt(d.total_liters*C.f)+' ล.':'เลือกเดือนเพื่อคาดการณ์',g:C.mode==='proj'?C.fleetG:null},
    {k:'pr',t:'ราคาเฉลี่ย',v:d.avg_price,u:'฿/ลิตร',pv:p?p.avg_price:null,m:'pct',fv:v=>v.toFixed(2),sub:fmt(d.transactions)+' รายการ'},
    {k:'ov',t:'รถเกิน PA',v:(d.over_pa||[]).length,u:'คัน',pv:p?(p.over_pa||[]).length:null,m:'abs',fv:fmt,sub:'จาก '+fmt(C.veh.length)+' คันที่มี PA'},
    {k:'nr',t:'รถใกล้เกิน PA',v:(d.near_pa||[]).length,u:'คัน',pv:p?(p.near_pa||[]).length:null,m:'abs',fv:fmt,sub:'ใช้ไปแล้ว 80–100%'}
  ];
}
function diffOf(k){
  if(k.m==='none')return {txt:'ค่าคาดการณ์ ไม่เทียบ',cls:'na'};
  if(k.pv==null||k.v==null)return {txt:'ไม่มีช่วงก่อนหน้า',cls:'na'};
  const dv=k.v-k.pv;if(Math.abs(dv)<1e-9)return {txt:'เท่าเดิม',cls:'eq',dv:0};
  const good=dv<0,ar=dv>0?'▲':'▼';let t;
  if(k.m==='pt')t=Math.abs(dv).toFixed(1)+' จุด';
  else if(k.m==='abs'||!k.pv)t=fmt(Math.abs(dv))+' '+k.u;
  else t=Math.abs(dv/k.pv*100).toFixed(1)+'%';
  return {txt:ar+' '+t,cls:good?'good':'bad',dv,good};
}
const BWM=[['pctL','%PA ลิตร'],['pctB','%PA บาท'],['price','ราคาเฉลี่ย']];
function bwOf(items,metric,nmax){
  const C=ctx();
  const xs=items.map(o=>{let v=o[metric];if(v!=null&&metric!=='price'&&C.mode==='proj'&&C.f)v=v*C.f;return {...o,mv:v};}).filter(o=>o.mv!=null).sort((a,b)=>a.mv-b.mv);
  const n=Math.min(nmax,Math.floor(xs.length/2));
  return {all:xs,best:xs.slice(0,n),worst:xs.slice(xs.length-n).reverse(),n};
}
function bwLabel(m){const C=ctx();return m==='price'?'ราคาเฉลี่ย ฿/ลิตร':((m==='pctL'?'%PA ลิตร':'%PA บาท')+(C.mode==='proj'?' (คาดการณ์สิ้นเดือน)':''));}
function bwFmt(m,v){return m==='price'?v.toFixed(2):v.toFixed(1)+'%';}
function dcwList(){return ctx().dcs.filter(o=>o.val!=null).sort((a,b)=>b.val-a.val).slice(0,10);}

// ════════ 3) หน้าต่างแชร์ ════════
const SECS=[['kpi','KPI หลัก + เทียบเดือนก่อน'],['go','ผลตามกลุ่ม × เจ้าของ'],['dcw','DC %PA สูงสุด 10 อันดับ'],['vt','ตามประเภทรถ'],['daily','การใช้รายวัน'],['dc','Top 10 DC ตามลิตร'],['plates','Top 10 ทะเบียน'],['alert','รถเกิน / ใกล้เกิน PA']];
const BWS=BWM.map(([m,t])=>['bw_'+m,'ดีสุด/แย่สุด · '+t]);
const picked=new Set(['kpi','go','dcw','daily']);
const LT={ink:'#0b1f3f',muted:'#55657f',line:'#dbe3f0',s:['#1d57b8','#b8860b','#6e93d6','#b8334a','#2f8f8f'],bad:'#b8334a',good:'#1f8a4c',red:'#c0392b'};
function say(m){const x=document.getElementById('xmsg');if(x)x.textContent=m;}
function openShare(){
  if(!D)return;
  const C=ctx();
  document.getElementById('share-scope').textContent='ตัวกรองปัจจุบัน: '+scopeLabel()+' · '+D.period+' · เทียบ: '+(C.prev?C.prev.label:'ไม่มีช่วงก่อนหน้า');
  const box=(arr,id)=>document.getElementById(id).innerHTML=arr.map(([k,t])=>`<label><input type="checkbox" data-sec="${k}"${picked.has(k)?' checked':''}> ${t}</label>`).join('');
  box(SECS,'share-checks');box(BWS,'share-checks-bw');
  document.getElementById('share-text').value=summaryText();
  document.getElementById('xprev').innerHTML='';say('');
  openM('m-share');
}
document.addEventListener('change',e=>{const k=e.target.dataset&&e.target.dataset.sec;if(!k)return;e.target.checked?picked.add(k):picked.delete(k);document.getElementById('share-text').value=summaryText();});
function selKeys(){return [...SECS,...BWS].map(s=>s[0]).filter(k=>picked.has(k));}

// ════════ 4) ข้อความสรุป ════════
const MD=['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];
function topDCs(g,n){return (D.dc_summary||[]).filter(r=>r[1]===g).sort((a,b)=>b[2]-a[2]).slice(0,n);}
function summaryText(){
  const d=D,C=ctx(),L=['⛽ NIMEX Fleet Card Dashboard','🗓️ '+scopeLabel()+'  |  '+d.period];
  if(C.prev)L.push('↔️ เทียบ '+C.prev.label+' (วันที่เท่ากัน)');
  const sec=t=>{L.push('');L.push(t);};
  if(picked.has('kpi')){sec('🎯 KPI หลัก (ต่ำ = ดี)');
    kpiList(C).forEach(k=>{const df=diffOf(k);L.push(`• ${k.t}: ${k.v==null?'—':k.fv(k.v)+(k.u==='%'?'%':' '+k.u)}${k.g?' · เกรด '+k.g:''}  ${df.cls==='good'?'🟢':df.cls==='bad'?'🔴':'⚪'} ${df.txt}`);});}
  if(picked.has('go')){sec('🚛 ตามกลุ่ม × เจ้าของ ('+C.basisLabel+')');C.go.forEach(o=>L.push(`• ${o.key} (${o.n} คัน): ${fmt(o.l)} ล. · ${pf(o.val)}${o.g?' · '+o.g:''}`));}
  if(picked.has('dcw')){sec('📍 DC %PA สูงสุด ('+C.basisLabel+')');dcwList().slice(0,5).forEach((o,i)=>L.push(`${MD[i]} ${dcName(o.key)} (${o.n} คัน): ${pf(o.val)}${o.g?' · '+o.g:''}`));}
  if(picked.has('vt')){sec('🚚 ตามประเภทรถ');C.vt.forEach(o=>L.push(`• ${o.key} (${o.n} คัน): ${fmt(o.l)} ล. (${(o.l/d.total_liters*100).toFixed(1)}%)`));}
  if(picked.has('daily')&&d.daily.length){sec('📅 การใช้รายวัน');const mx=d.daily.reduce((a,b)=>b[1]>a[1]?b:a);L.push(`📈 วันที่ใช้สูงสุด: ${mx[0]} ${fmt(mx[1])} ลิตร`);L.push(`📊 เฉลี่ย ${fmt(d.total_liters/d.daily.length)} ลิตร/วัน (${d.daily.length} วัน)`);}
  if(picked.has('dc')){['กระจาย','ขนย้าย'].filter(g=>!GRP||g===GRP).forEach(g=>{const t=topDCs(g,3);if(!t.length)return;sec(`🏆 DC ใช้น้ำมันสูงสุด · ${g}`);t.forEach((r,i)=>L.push(`${MD[i]} ${dcName(r[0])} (${r[4]} คัน): ${fmt(r[2])} ล.`));});}
  if(picked.has('plates')){sec('🔢 ทะเบียนใช้น้ำมันสูงสุด');(d.all_vehicles||[]).slice(0,3).forEach((v,i)=>L.push(`${MD[i]} ${v[0]} (${v[1]} / ${dcName(v[2])}): ${fmt(v[4])} ล.${v[5]>0?' · '+v[6].toFixed(1)+'% PA':''}`));}
  if(picked.has('alert')){sec(`🚨 เกิน PA ${(d.over_pa||[]).length} คัน · ⚠️ ใกล้เกิน (80–100%) ${(d.near_pa||[]).length} คัน`);(d.over_pa||[]).slice(0,5).forEach((r,i)=>L.push(`${MD[i]} ${r[0]} (${dcName(r[2])}): ${r[6].toFixed(1)}% ของ PA`));}
  BWM.forEach(([m])=>{if(!picked.has('bw_'+m))return;const a=bwOf(C.dcs,m,5),b=bwOf(C.go,m,3);sec('🥇 ดีสุด / แย่สุด · '+bwLabel(m)+' (ต่ำ = ดี)');
    L.push('DC ดีสุด: '+(a.best.map(o=>`${dcName(o.key)} ${bwFmt(m,o.mv)}`).join(', ')||'—'));L.push('DC แย่สุด: '+(a.worst.map(o=>`${dcName(o.key)} ${bwFmt(m,o.mv)}`).join(', ')||'—'));
    L.push('กลุ่มดีสุด: '+(b.best.map(o=>`${o.key} ${bwFmt(m,o.mv)}`).join(', ')||'—'));L.push('กลุ่มแย่สุด: '+(b.worst.map(o=>`${o.key} ${bwFmt(m,o.mv)}`).join(', ')||'—'));});
  return L.join('\n');
}

// ════════ 5) ตารางข้อมูลกลาง (ใช้ร่วม Excel / PowerPoint / PNG ยาว) ════════
function tables(key){
  const d=D,C=ctx(),gH=C.mode==='off'?[]:['เกรด'];const gV=o=>C.mode==='off'?[]:[o.g||'—'];
  if(key==='kpi'){const h=['ตัวชี้วัด','ค่า','หน่วย',C.prev?'เดือนก่อน ('+C.prev.label+')':'เดือนก่อน','ผลต่าง','เกรด'];
    return {title:'KPI หลัก (ต่ำ = ดี)',head:h,rows:kpiList(C).map(k=>{const df=diffOf(k);return [k.t,k.v==null?null:(k.m==='pt'||k.u==='%'?r1(k.v):k.u==='฿/ลิตร'?r2(k.v):r1(k.v)),k.u,k.pv==null?null:(k.u==='฿/ลิตร'?r2(k.pv):r1(k.pv)),df.txt,k.g||''];}),diffCol:4,diffCls:kpiList(C).map(k=>diffOf(k).cls)};}
  if(key==='go')return {title:'ผลตามกลุ่ม × เจ้าของ (แสดงครบทุกกลุ่ม)',head:['กลุ่ม · เจ้าของ','รถ (คัน)','ลิตร','PA ลิตร','%PA ใช้แล้ว','%PA คาดการณ์',...gH],rows:C.go.map(o=>[o.key,o.n,r1(o.l),r1(o.paL),r1(o.pctL),r1(o.proj),...gV(o)])};
  if(key==='dcw')return {title:'DC %PA สูงสุด 10 อันดับ ('+C.basisLabel+')',head:['DC','รถ (คัน)','ลิตร','PA ลิตร','%PA ใช้แล้ว','%PA คาดการณ์',...gH],rows:dcwList().map(o=>[dcName(o.key),o.n,r1(o.l),r1(o.paL),r1(o.pctL),r1(o.proj),...gV(o)])};
  if(key==='vt')return {title:'ตามประเภทรถ',head:['ประเภทรถ','รถ (คัน)','ลิตร','สัดส่วน %','%PA ใช้แล้ว',...gH],rows:C.vt.map(o=>[o.key,o.n,r1(o.l),r1(o.l/d.total_liters*100),r1(o.pctL),...gV(o)])};
  if(key==='daily'){const gm={};(d.daily_grp||[]).forEach(r=>{(gm[r[0]]||(gm[r[0]]={}))[r[1]]=r[2];});return {title:'การใช้น้ำมันรายวัน',head:['วันที่','ลิตร','บาท','ราคา ฿/ล.','กระจาย (ล.)','ขนย้าย (ล.)'],rows:d.daily.map((r,i)=>[r[0],r[1],r[2],d.daily_price[i],(gm[r[0]]||{})['กระจาย']||0,(gm[r[0]]||{})['ขนย้าย']||0])};}
  if(key==='dc')return {title:'Top 10 DC ตามลิตร',head:['DC','กลุ่ม','ลิตร','บาท','รถ (คัน)'],rows:['กระจาย','ขนย้าย'].filter(g=>!GRP||g===GRP).flatMap(g=>topDCs(g,10).map(r=>[dcName(r[0]),r[1],r[2],r[3],r[4]]))};
  if(key==='plates')return {title:'Top 10 ทะเบียนตามลิตร',head:['ทะเบียน','กลุ่ม','เจ้าของ','DC','ลิตร','%PA'],rows:[['top_gk_own','กระจาย','ผปก'],['top_gk_co','กระจาย','บริษัท'],['top_kn_own','ขนย้าย','ผปก'],['top_kn_co','ขนย้าย','บริษัท']].filter(x=>!GRP||x[1]===GRP).flatMap(([k,g,o])=>(d[k]||[]).map(r=>[r[0],g,o,dcName(r[3]),r[1],r[2]]))};
  if(key==='alert'){const f=r=>[r[0],r[1],dcName(r[2]),r[3],r[4],r[5],r[6]];return {title:`รถเกิน PA ${d.over_pa.length} คัน · ใกล้เกิน ${d.near_pa.length} คัน`,head:['ทะเบียน','กลุ่ม','DC','เจ้าของ','ลิตร','PA ลิตร','%PA','สถานะ'],rows:[...d.over_pa.map(r=>[...f(r),'เกิน PA']),...d.near_pa.map(r=>[...f(r),'ใกล้เกิน'])]};}
  if(key.startsWith('bw_')){const m=key.slice(3),lab=bwLabel(m);
    const mk=(items,nmax,dim)=>{const b=bwOf(items,m,nmax),bs=new Set(b.best.map(o=>o.key)),ws=new Set(b.worst.map(o=>o.key));return b.all.map((o,i)=>[dim,dim==='DC'?dcName(o.key):o.key,o.n,m==='price'?r2(o.mv):r1(o.mv),i+1,bs.has(o.key)?'ดีสุด':ws.has(o.key)?'แย่สุด':'']);};
    return {title:'ดีสุด / แย่สุด · '+lab+' (ต่ำ = ดี)',head:['มิติ','ชื่อ','รถ (คัน)',lab,'อันดับ','ป้าย'],rows:[...mk(C.dcs,5,'DC'),...mk(C.go,3,'กลุ่ม · เจ้าของ')]};}
}

// ════════ 6) SVG พื้นฐาน + ฟอนต์/โลโก้ ════════
const SF='font-family="Prompt,sans-serif"';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const svgI=(n,x,y,s,col,sw=2)=>`<g transform="translate(${x} ${y}) scale(${s/24})" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICON_PATH[n]}</g>`;
let _font=null,_logo=null;
function b64buf(buf){const u=new Uint8Array(buf);let s='';for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s);}
async function fontCss(){
  if(_font)return _font;
  const TH='U+0E01-0E5B,U+200C-200D,U+25CC',LA='U+0000-00FF,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+25B2,U+25BC';let css='';
  for(const w of [400,500,600])for(const [sub,rng] of [['thai',TH],['latin',LA]]){const b=await (await fetch(`prompt-${sub}-${w}.woff2?v=2`)).arrayBuffer();css+=`@font-face{font-family:'Prompt';font-weight:${w};src:url(data:font/woff2;base64,${b64buf(b)}) format('woff2');unicode-range:${rng}}`;}
  return (_font=css);
}
async function logoUri(){if(_logo)return _logo;const b=await (await fetch('logo.png?v=2')).arrayBuffer();return (_logo='data:image/png;base64,'+b64buf(b));}
function niceMax(v){if(v<=0)return 1;const e=Math.pow(10,Math.floor(Math.log10(v))),n=v/e;return (n<=1?1:n<=1.5?1.5:n<=2?2:n<=3?3:n<=5?5:n<=7.5?7.5:10)*e;}
function tblSvg(cols,data,W,fs=13.5,rh=30){
  const tw=cols.reduce((a,c)=>a+c.w,0);let x=0;const xs=cols.map(c=>{const a=x;x+=c.w/tw*W;return a;});
  let s=`<rect width="${W}" height="${rh}" rx="6" fill="#0a2a5e"/>`;
  const tx=(c,i)=>{const cw=c.w/tw*W;return c.r?xs[i]+cw-10:xs[i]+10;};
  cols.forEach((c,i)=>{s+=`<text x="${tx(c,i)}" y="${rh/2+fs*.36}" text-anchor="${c.r?'end':'start'}" font-size="${fs}" font-weight="500" fill="#fff">${esc(c.t)}</text>`;});
  data.forEach((r,j)=>{const y=(j+1)*rh;if(j%2)s+=`<rect y="${y}" width="${W}" height="${rh}" fill="#f2f5fb"/>`;
    cols.forEach((c,i)=>{s+=`<text x="${tx(c,i)}" y="${y+rh/2+fs*.36}" text-anchor="${c.r?'end':'start'}" font-size="${fs}" font-weight="${c.b?600:400}" fill="${(c.col&&c.col(r))||LT.ink}">${esc(c.f(r,j))}</text>`;});});
  if(!data.length)s+=`<text x="${W/2}" y="${rh*1.7}" text-anchor="middle" font-size="${fs}" fill="${LT.muted}">ไม่มีรายการ</text>`;
  return {s,h:(Math.max(1,data.length)+1)*rh};
}
function gBadge(g,cx,cy,r=15){return g?`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${GCOL[g]}" stroke="#fff" stroke-width="2"/><text x="${cx}" y="${cy+r*.38}" text-anchor="middle" font-size="${r*1.05}" font-weight="600" fill="#fff">${g}</text>`:'';}
function svgDoc(W,H,body,font){return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><style>${font}text{font-family:Prompt,sans-serif}</style>${body}</svg>`;}
function toPng(c,scale){return new Promise((res,rej)=>{if(c.W*c.H*scale*scale>34e6)scale=Math.sqrt(34e6/(c.W*c.H));const u=URL.createObjectURL(new Blob([c.svg],{type:'image/svg+xml'})),im=new Image();im.onload=()=>setTimeout(()=>{const cv=document.createElement('canvas');cv.width=Math.round(c.W*scale);cv.height=Math.round(c.H*scale);cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);URL.revokeObjectURL(u);cv.toBlob(b=>b?res(b):rej(new Error('png')),'image/png');},150);im.onerror=()=>rej(new Error('svg'));im.src=u;});}
function saveBlob(name,blob){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);}
function blobUri(b){return new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.readAsDataURL(b);});}
function headBand(W,H,logo,title,sub){
  const C=ctx(),pw=W>1500?250:230,m=W>1500?32:26,ph=H-28,ly=12;
  const right=[curMonth()?monthLabel(curMonth()):'ทุกเดือน (รวม)',(GRP||'ทุกกลุ่ม')+' · '+D.period,C.prev?'เทียบ '+C.prev.label:'ไม่มีช่วงก่อนหน้า'];
  return `<defs><linearGradient id="hg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#071f4a"/><stop offset=".5" stop-color="#143f8c"/><stop offset="1" stop-color="#071f4a"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#hg)"/><rect y="${H-5}" width="${W}" height="5" fill="#d4af37"/>
  <rect x="${m}" y="${ly}" width="${pw}" height="${ph}" rx="14" fill="#fff"/><image x="${m+10}" y="${ly+7}" width="${pw-20}" height="${ph-14}" href="${logo}" preserveAspectRatio="xMidYMid meet"/>
  <text x="${W/2}" y="${H*.47}" text-anchor="middle" font-size="${W>1500?42:34}" font-weight="600" ${SF} fill="#fff">${esc(title)}</text><text x="${W/2}" y="${H*.47+34}" text-anchor="middle" font-size="${W>1500?22:19}" fill="#e6d79c">${esc(sub)}</text>
  ${right.map((t,i)=>`<text x="${W-m}" y="${ly+28+i*29}" text-anchor="end" font-size="${i?17:24}" font-weight="${i?400:600}" fill="${i===2?'#e6d79c':'#fff'}">${esc(t)}</text>`).join('')}`;
}

// ════════ 7) อินโฟกราฟิก 16:9 (1920×1080) ════════
function kpiCard(k,x,y,w,h){
  const df=diffOf(k),dc=df.cls==='good'?'#5fd38d':df.cls==='bad'?'#ff8a8a':'#b9c9e6';
  const val=k.v==null?'—':k.fv(k.v);
  return `<g transform="translate(${x} ${y})"><rect width="${w}" height="${h}" rx="16" fill="#0a2a5e"/><rect y="${h-6}" width="${w}" height="6" fill="${df.cls==='bad'?'#e0657c':df.cls==='good'?'#3fb37a':'#d4af37'}"/>
  <text x="${w/2}" y="36" text-anchor="middle" font-size="19" fill="#e6d79c">${esc(k.t)}</text>
  <text x="${w/2}" y="${h*.5+10}" text-anchor="middle" font-size="${val.length>9?38:46}" font-weight="600" fill="#fff">${esc(val)}<tspan font-size="18" font-weight="500" fill="#cfdcf2"> ${esc(k.u==='%'?'%':k.u)}</tspan></text>
  <text x="${w/2}" y="${h*.5+42}" text-anchor="middle" font-size="16" fill="#cfdcf2">${esc(k.sub||'')}</text>
  <text x="${w/2}" y="${h-22}" text-anchor="middle" font-size="18" font-weight="600" fill="${dc}">${esc(df.txt)}</text>${k.g?gBadge(k.g,w-30,h*.5-4,19)+`<text x="${w-30}" y="${h*.5+30}" text-anchor="middle" font-size="12" fill="#cfdcf2">เกรด</text>`:''}</g>`;
}
function panel(x,y,w,h,title,note,inner){return `<g transform="translate(${x} ${y})"><rect width="${w}" height="${h}" rx="16" fill="#fff" stroke="#dbe3f0"/><rect x="${w*.2}" y="-1" width="${w*.6}" height="2.5" fill="#d4af37"/><text x="24" y="38" font-size="22" font-weight="600" fill="#0a2a5e">${esc(title)}</text>${note?`<text x="${w-24}" y="38" text-anchor="end" font-size="15" fill="${LT.muted}">${esc(note)}</text>`:''}<g transform="translate(24 56)">${inner}</g></g>`;}
// (1) %PA ตามกลุ่ม × เจ้าของ — แสดงครบทุกกลุ่ม
function chGO(w,h){
  const C=ctx(),it=C.go.filter(o=>o.val!=null);if(!it.length)return {s:`<text x="${w/2}" y="${h/2}" text-anchor="middle" font-size="18" fill="${LT.muted}">ไม่มีข้อมูล PA</text>`,note:''};
  const vals=it.map(o=>o.val),mn=Math.min(...vals),mx=Math.max(...vals,100);
  let lo=0;if(mn>=30&&(mx-mn)<mx*.5)lo=Math.max(0,Math.floor((mn-10)/10)*10);
  const hi=Math.ceil(mx*1.06/10)*10,lw=250,rw=170,iw=w-lw-rw,bh=Math.min(46,(h-40)/it.length-14),gap=(h-30-bh*it.length)/it.length;
  const X=v=>lw+(Math.max(lo,Math.min(hi,v))-lo)/(hi-lo)*iw;let s='';
  for(let t=lo;t<=hi;t+=(hi-lo>60?20:10))s+=`<line x1="${X(t)}" x2="${X(t)}" y1="0" y2="${h-30}" stroke="${LT.line}"/><text x="${X(t)}" y="${h-10}" text-anchor="middle" font-size="14" fill="${LT.muted}">${t}%</text>`;
  if(100>=lo&&100<=hi)s+=`<line x1="${X(100)}" x2="${X(100)}" y1="0" y2="${h-30}" stroke="${LT.bad}" stroke-width="2" stroke-dasharray="6 5"/>`;
  it.forEach((o,i)=>{const y=gap/2+i*(bh+gap),c=o.g?GCOL[o.g]:LT.s[0];
    s+=`<text x="${lw-12}" y="${y+bh/2-2}" text-anchor="end" font-size="17" fill="${LT.ink}">${esc(o.key)}</text><text x="${lw-12}" y="${y+bh/2+17}" text-anchor="end" font-size="13.5" fill="${LT.muted}">${o.n} คัน${o.n<20?' · จำนวนน้อย':''}</text>
    <rect x="${lw}" y="${y}" width="${Math.max(3,X(o.val)-lw)}" height="${bh}" rx="6" fill="${c}"/><text x="${X(o.val)+10}" y="${y+bh/2+7}" font-size="18" font-weight="600" fill="${LT.ink}">${o.val.toFixed(1)}%${o.g?' · '+o.g:''}</text>`;});
  return {s,note:(lo>0?'แกนเริ่มที่ '+lo+'% · ':'')+'เส้นแดง = 100% ของ PA'};
}
// เส้น PA ต่อวัน: สูตรเดียวกับกราฟเทรนด์บนหน้า (PA รวม ÷ 30)
const paDay=d=>d.pa_liters>0?Math.round(d.pa_liters/30):0;
// (2) ลิตรรายวัน + เส้น PA/วัน
function chDaily(w,h){
  const d=D,vals=d.daily.map(r=>r[1]),ref=paDay(d),m={l:70,r:10,t:10,b:30},iw=w-m.l-m.r,ih=h-m.t-m.b,mx=niceMax(Math.max(...vals,ref,1)),Y=v=>m.t+ih*(1-v/mx),bw=iw/Math.max(1,vals.length);let s='';
  for(let k=0;k<=4;k++){const v=mx*k/4;s+=`<line x1="${m.l}" x2="${w-m.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="${LT.line}"/><text x="${m.l-8}" y="${Y(v)+5}" text-anchor="end" font-size="14" fill="${LT.muted}">${esc(fmt(v))}</text>`;}
  const step=Math.ceil(vals.length/16);
  vals.forEach((v,i)=>{const x=m.l+i*bw+bw*.15,bw2=bw*.7;s+=`<rect x="${x.toFixed(1)}" y="${Y(v).toFixed(1)}" width="${bw2.toFixed(1)}" height="${(m.t+ih-Y(v)).toFixed(1)}" rx="3" fill="${ref&&v>ref?LT.s[3]:LT.s[0]}"/>`;if(i%step===0)s+=`<text x="${(x+bw2/2).toFixed(1)}" y="${h-8}" text-anchor="middle" font-size="13.5" fill="${LT.muted}">${esc(d.daily[i][0].slice(0,5))}</text>`;});
  if(ref)s+=`<line x1="${m.l}" x2="${w-m.r}" y1="${Y(ref)}" y2="${Y(ref)}" stroke="${LT.s[1]}" stroke-width="2.5" stroke-dasharray="8 6"/>`;
  return {s,note:ref?'เส้นทอง = PA/วัน ≈ '+fmt(ref)+' ล. · แดง = เกินเส้น':''};
}
// (3) 10 DC ที่ %PA สูงสุด: ลิตร เทียบ PA
function chDCW(w,h){
  const C=ctx(),it=dcwList();if(!it.length)return {s:`<text x="${w/2}" y="${h/2}" text-anchor="middle" font-size="18" fill="${LT.muted}">ไม่มีข้อมูล PA</text>`,note:''};
  const lw=230,rw=190,iw=w-lw-rw,mx=Math.max(...it.map(o=>Math.max(o.l,o.paL))),rh=(h-24)/it.length,bh=Math.min(11,rh/2-3);let s='';
  it.forEach((o,i)=>{const y=i*rh+4;s+=`<text x="${lw-10}" y="${y+rh/2+2}" text-anchor="end" font-size="15.5" fill="${LT.ink}">${esc(dcName(o.key).slice(0,22))} <tspan font-size="12.5" fill="${LT.muted}">(${o.n} คัน)</tspan></text>
    <rect x="${lw}" y="${y+rh/2-bh-1}" width="${Math.max(2,o.l/mx*iw)}" height="${bh}" rx="3" fill="${LT.s[0]}"/><rect x="${lw}" y="${y+rh/2+1}" width="${Math.max(2,o.paL/mx*iw)}" height="${bh}" rx="3" fill="#d4af37"/>
    <text x="${w-8}" y="${y+rh/2+6}" text-anchor="end" font-size="16" font-weight="600" fill="${o.val>100?LT.bad:LT.ink}">${o.val.toFixed(1)}%${o.g?' · '+o.g:''}</text>`;});
  s+=`<rect x="${lw}" y="${h-14}" width="14" height="10" fill="${LT.s[0]}"/><text x="${lw+20}" y="${h-4}" font-size="13.5" fill="${LT.muted}">ลิตรที่ใช้</text><rect x="${lw+110}" y="${h-14}" width="14" height="10" fill="#d4af37"/><text x="${lw+130}" y="${h-4}" font-size="13.5" fill="${LT.muted}">PA ลิตร</text>`;
  return {s,note:C.basisLabel};
}
// (4) โดนัทสัดส่วนเกรดรถ + แย่สุด 3 อันดับ
function chDonut(w,h){
  const C=ctx();let parts;
  if(C.mode==='off'){const st=[['ปกติ ≤50%',v=>v<=50,GCOL.A],['กลาง 50–80%',v=>v>50&&v<=80,GCOL.B],['ใกล้เกิน 80–100%',v=>v>80&&v<=100,GCOL.D],['เกิน >100%',v=>v>100,GCOL.F]];parts=st.map(([l,f,c])=>({l,c,n:C.veh.filter(v=>f(v.pctL)).length}));}
  else parts=GRADES.map(g=>({l:'เกรด '+g,c:GCOL[g],n:C.gcount[g]}));
  const tot=parts.reduce((a,b)=>a+b.n,0)||1,cx=150,cy=h/2-6,R=Math.min(130,h/2-14),r0=R*.6;let a0=-Math.PI/2,s='';
  parts.forEach(p=>{if(!p.n)return;const a1=a0+p.n/tot*Math.PI*2,lg=a1-a0>Math.PI?1:0;
    if(p.n===tot)s+=`<circle cx="${cx}" cy="${cy}" r="${(R+r0)/2}" fill="none" stroke="${p.c}" stroke-width="${R-r0}"/>`;
    else s+=`<path d="M${cx+R*Math.cos(a0)} ${cy+R*Math.sin(a0)}A${R} ${R} 0 ${lg} 1 ${cx+R*Math.cos(a1)} ${cy+R*Math.sin(a1)}L${cx+r0*Math.cos(a1)} ${cy+r0*Math.sin(a1)}A${r0} ${r0} 0 ${lg} 0 ${cx+r0*Math.cos(a0)} ${cy+r0*Math.sin(a0)}Z" fill="${p.c}"/>`;a0=a1;});
  s+=`<text x="${cx}" y="${cy-2}" text-anchor="middle" font-size="34" font-weight="600" fill="${LT.ink}">${fmt(C.veh.length)}</text><text x="${cx}" y="${cy+24}" text-anchor="middle" font-size="15" fill="${LT.muted}">คันที่มี PA</text>`;
  parts.forEach((p,i)=>{const y=6+i*27;s+=`<rect x="320" y="${y}" width="16" height="16" rx="4" fill="${p.c}"/><text x="344" y="${y+14}" font-size="16" fill="${LT.ink}">${esc(p.l)}</text><text x="560" y="${y+14}" text-anchor="end" font-size="16" font-weight="600" fill="${LT.ink}">${fmt(p.n)} คัน · ${(p.n/tot*100).toFixed(0)}%</text>`;});
  const worst=[...C.veh].sort((a,b)=>(b.val??b.pctL)-(a.val??a.pctL)).slice(0,3),y0=6+parts.length*27+12;
  s+=`<text x="320" y="${y0+6}" font-size="16" font-weight="600" fill="${LT.bad}">แย่สุด 3 อันดับ</text>`;
  worst.forEach((v,i)=>{const y=y0+28+i*25;s+=`<text x="320" y="${y}" font-size="15.5" fill="${LT.ink}">${i+1}. ${esc(v.plate)} <tspan font-size="13" fill="${LT.muted}">${esc(dcName(v.dc).slice(0,18))}</tspan></text><text x="${w-48}" y="${y}" text-anchor="end" font-size="15.5" font-weight="600" fill="${LT.bad}">${(v.val??v.pctL).toFixed(1)}%${v.g?' · '+v.g:''}</text>`;});
  return {s,note:C.mode==='off'?'สถานะตาม %PA ที่ใช้ไปแล้ว':C.basisLabel};
}
async function composeInfo(){
  const W=1920,H=1080,[font,logo]=await Promise.all([fontCss(),logoUri()]),C=ctx();
  const ks=kpiList(C).filter(k=>k.k!=='pr'||true),show=['l','b','pl','pj','ov','nr'].map(id=>ks.find(k=>k.k===id));
  const m=32,g=16,cw=(W-2*m-5*g)/6,ky=140,kh=196;let b=`<rect width="${W}" height="${H}" fill="#eef2f9"/>`+headBand(W,120,logo,'NIMEX Fleet Card Dashboard','การใช้น้ำมันเทียบวงเงิน PA'+(GRP?' · กลุ่ม '+GRP:''));
  show.forEach((k,i)=>b+=kpiCard(k,m+i*(cw+g),ky,cw,kh));
  const py=ky+kh+22,pw=(W-2*m-24)/2,ph=(H-py-86-24)/2;
  const P=[['%PA ตามกลุ่ม × เจ้าของ (ครบทุกกลุ่ม)',chGO],['ลิตรรายวัน เทียบ PA ต่อวัน',chDaily],['10 DC ที่ %PA สูงสุด: ลิตร เทียบ PA',chDCW],[C.mode==='off'?'สัดส่วนสถานะรถ + แย่สุด 3':'สัดส่วนเกรดรถ + แย่สุด 3',chDonut]];
  P.forEach(([t,fn],i)=>{const x=m+(i%2)*(pw+24),y=py+Math.floor(i/2)*(ph+24),r=fn(pw-48,ph-72);b+=panel(x,y,pw,ph,t,r.note,r.s);});
  const fy=H-62,now=new Date();
  const n1='สูตร: %PA = ลิตรที่ใช้ ÷ ผลรวมวงเงิน PA ลิตรของรถ · คาดการณ์สิ้นเดือน = ใช้แล้ว ÷ วันที่มีข้อมูล × จำนวนวันทั้งเดือน · DC/กลุ่ม = ลิตรรวม ÷ PA ลิตรรวมของรถในนั้น · ทุกตัว ต่ำ = ดี';
  const n2=(C.mode==='off'?'ไม่ใช้เกรด':'เกรดจาก '+C.basisLabel+': '+gradeRule())+(C.fb?' (ทุกเดือน: คาดการณ์ไม่ได้ ใช้ %PA ที่ใช้ไปแล้ว)':'')+' · เทียบ: '+(C.prev?C.prev.label+' วันที่เท่ากัน · เขียว = ดีขึ้น แดง = แย่ลง':'ไม่มีช่วงก่อนหน้า')+' · สร้างเมื่อ '+now.toLocaleDateString('th-TH',{day:'numeric',month:'short',year:'numeric'});
  b+=`<rect y="${fy}" width="${W}" height="${H-fy}" fill="#0a2a5e"/><rect y="${fy}" width="${W}" height="3" fill="#d4af37"/><text x="${W/2}" y="${fy+26}" text-anchor="middle" font-size="15" fill="#dfe8f7">${esc(n1)}</text><text x="${W/2}" y="${fy+50}" text-anchor="middle" font-size="15" fill="#e6d79c">${esc(n2)}</text>`;
  return {svg:svgDoc(W,H,b,font),W,H};
}

// ════════ 8) PNG ยาว (ตามหัวข้อที่เลือก) ════════
const SECI={kpi:'star',go:'users',dcw:'alert',vt:'truck',daily:'line',dc:'dc',plates:'truck',alert:'alert'};
function longPiece(k,w){
  const C=ctx();
  if(k==='kpi'){const ks=kpiList(C),g=12,cw=(w-3*g)/4,ch=170;let s='';ks.forEach((kk,i)=>{s+=`<g transform="scale(1)">${kpiCard(kk,(i%4)*(cw+g),Math.floor(i/4)*(ch+g),cw,ch).replace(/font-size="46"/,'font-size="34"').replace(/font-size="38"/,'font-size="28"')}</g>`;});return {t:'KPI หลัก (ต่ำ = ดี)'+(C.prev?' · เทียบ '+C.prev.label:''),s,h:2*ch+g};}
  if(k==='daily'){const r=chDaily(w,300);return {t:'การใช้น้ำมันรายวัน (ลิตร)',s:r.s,h:300};}
  if(k==='go'){const r=chGO(w,60*Math.max(1,C.go.length)+40);return {t:'%PA ตามกลุ่ม × เจ้าของ',s:r.s+`<text x="${w}" y="-14" text-anchor="end" font-size="13" fill="${LT.muted}">${esc(r.note)}</text>`,h:60*Math.max(1,C.go.length)+40};}
  const T=tables(k);if(!T)return null;
  const isNum=v=>typeof v==='number';
  const cols=[{t:'#',w:.5,f:(r,j)=>j+1},...T.head.map((h,i)=>({t:h,w:i===0?2.6:1.3,r:T.rows.some(r=>isNum(r[i])),b:i===0,f:r=>r[i]==null?'—':isNum(r[i])?(Number.isInteger(r[i])?fmt(r[i]):r[i].toLocaleString('th-TH',{maximumFractionDigits:2})):r[i],col:k==='kpi'&&i===T.diffCol?(r=>String(r[i]).startsWith('▲')?LT.red:String(r[i]).startsWith('▼')?LT.good:LT.muted):(h==='ป้าย'?(r=>r[i]==='แย่สุด'?LT.red:r[i]==='ดีสุด'?LT.good:LT.ink):(h==='เกรด'?(r=>GCOL[r[i]]||LT.ink):null))}))];
  const rows=k==='alert'?T.rows.slice(0,25):k.startsWith('bw_')?T.rows.filter(r=>r[5]):T.rows;const t=tblSvg(cols,rows,w);
  return {t:T.title+(k==='alert'&&T.rows.length>25?' (แสดง 25 แรก)':'')+(k.startsWith('bw_')?' · อันดับเต็มอยู่ใน Excel':''),s:t.s,h:t.h};
}
async function composeLong(keys){
  const [font,logo]=await Promise.all([fontCss(),logoUri()]);
  const W=1240,m=26,head=150,foot=46,top=56,pad=20;let y=head+m+10,b='';
  keys.forEach(k=>{const p=longPiece(k,W-2*m-2*pad);if(!p)return;const h=p.h+top+pad,ic=SECI[k]||'star';
    b+=`<g transform="translate(${m} ${y})"><rect width="${W-2*m}" height="${h}" rx="16" fill="#fff" stroke="#dbe3f0"/><rect x="${(W-2*m)*.15}" y="-1.2" width="${(W-2*m)*.7}" height="2.4" fill="#d4af37"/><circle cx="${(W-2*m)/2}" cy="0" r="19" fill="#0a2a5e" stroke="#d4af37" stroke-width="2"/>${svgI(ic,(W-2*m)/2-11,-11,22,'#f0d57a')}<text x="${(W-2*m)/2}" y="${top-14}" text-anchor="middle" font-size="18" font-weight="600" fill="#0a2a5e">${esc(p.t)}</text><g transform="translate(${pad} ${top})">${p.s}</g></g>`;y+=h+m+10;});
  const H=y-10+foot,now=new Date();
  const ft=`<rect y="${H-foot}" width="${W}" height="${foot}" fill="#0a2a5e"/><rect y="${H-foot}" width="${W}" height="3" fill="#d4af37"/><text x="${W/2}" y="${H-foot/2+6}" text-anchor="middle" font-size="14" fill="#dfe8f7">NIMEX Fleet Card Dashboard · สร้างเมื่อ ${now.toLocaleDateString('th-TH',{day:'numeric',month:'short',year:'numeric'})} ${now.toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})}</text>`;
  return {svg:svgDoc(W,H,`<rect width="${W}" height="${H}" fill="#eef2f9"/>`+headBand(W,head,logo,'NIMEX Fleet Card Dashboard','สรุปการใช้น้ำมันเทียบวงเงิน PA')+b+ft,font),W,H};
}

// ════════ 9) Excel / PowerPoint ════════
function sheetName(t,used){let n=t.replace(/\s*\/\s*/g,'-').replace(/[\\\?\*\[\]:]/g,' ').slice(0,28);let i=2;while(used.has(n))n=n.slice(0,25)+' '+(i++);used.add(n);return n;}
function buildXlsx(keys){
  const wb=XLSX.utils.book_new(),used=new Set(),C=ctx();
  keys.forEach(k=>{const T=tables(k);if(!T)return;
    const aoa=[[T.title],['ตัวกรอง: '+scopeLabel()+' · '+D.period+(C.prev?' · เทียบ '+C.prev.label:'')],[],T.head,...T.rows];
    const ws=XLSX.utils.aoa_to_sheet(aoa);ws['!cols']=T.head.map((_,i)=>({wch:i?14:30}));
    XLSX.utils.book_append_sheet(wb,ws,sheetName(SECS.concat(BWS).find(s=>s[0]===k)[1],used));});
  const ws=XLSX.utils.aoa_to_sheet([['หมายเหตุ'],['%PA = ลิตรที่ใช้ ÷ ผลรวมวงเงิน PA ลิตรของรถ'],['คาดการณ์สิ้นเดือน = ใช้แล้ว ÷ วันที่มีข้อมูล × จำนวนวันทั้งเดือน'],['DC/กลุ่ม = ลิตรรวม ÷ PA ลิตรรวมของรถในนั้น'],['เกรด: '+(C.mode==='off'?'ไม่ใช้':C.basisLabel+' · '+gradeRule())],['เทียบ: '+(C.prev?C.prev.label+' (วันที่เท่ากัน)':'ไม่มีช่วงก่อนหน้า')],['ทุกตัวชี้วัด ต่ำ = ดี']]);ws['!cols']=[{wch:70}];
  XLSX.utils.book_append_sheet(wb,ws,'หมายเหตุ');
  return wb;
}
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=()=>rej(new Error('โหลดไลบรารี PowerPoint ไม่สำเร็จ'));document.head.appendChild(s);});}
async function buildPptx(keys){
  if(!window.PptxGenJS)await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pptxgenjs/3.12.0/pptxgen.bundle.js');
  const p=new PptxGenJS();p.layout='LAYOUT_WIDE';p.title='NIMEX Fleet Card Dashboard';const FF='Tahoma',C=ctx();
  const info=await blobUri(await toPng(await composeInfo(),1));
  p.addSlide().addImage({data:info,x:0,y:0,w:13.333,h:7.5});
  const head=(sl,t)=>{sl.background={color:'EEF2F9'};sl.addShape(p.ShapeType.rect,{x:0,y:0,w:13.333,h:0.8,fill:{color:'0A2A5E'}});sl.addShape(p.ShapeType.rect,{x:0,y:0.8,w:13.333,h:0.05,fill:{color:'D4AF37'}});
    sl.addText(t,{x:0.4,y:0.1,w:9.5,h:0.6,fontFace:FF,fontSize:22,bold:true,color:'FFFFFF'});sl.addText(scopeLabel()+' · '+D.period,{x:8.6,y:0.1,w:4.4,h:0.6,fontFace:FF,fontSize:12,color:'E6D79C',align:'right'});};
  for(const k of keys){
    if(k==='daily'){const sl=p.addSlide();head(sl,'การใช้น้ำมันรายวัน (ลิตร)');
      sl.addChart(p.ChartType.bar,[{name:'ลิตร',labels:D.daily.map(r=>r[0].slice(0,5)),values:D.daily.map(r=>r[1])}],{x:0.4,y:1.1,w:12.5,h:5.9,chartColors:['1D57B8'],catAxisLabelFontFace:FF,valAxisLabelFontFace:FF,catAxisLabelFontSize:9,valAxisLabelFormatCode:'#,##0',showLegend:false});
      continue;}
    const T0=tables(k);if(!T0)continue;const per=13;
    const T=k==='alert'?{...T0,rows:T0.rows.slice(0,26),title:T0.title+(T0.rows.length>26?' · 26 คันแรก (ครบใน Excel)':'')}:k.startsWith('bw_')?{...T0,rows:T0.rows.filter(r=>r[5]),title:T0.title+' · อันดับเต็มใน Excel'}:T0;
    for(let i=0;i<Math.max(1,T.rows.length);i+=per){const sl=p.addSlide();head(sl,T.title+(T.rows.length>per?` (${Math.floor(i/per)+1}/${Math.ceil(T.rows.length/per)})`:''));
      const hdr=T.head.map(h=>({text:h,options:{bold:true,color:'FFFFFF',fill:{color:'0A2A5E'}}}));
      const body=T.rows.slice(i,i+per).map((r,j)=>r.map((v,ci)=>{let color='0B1F3F';
        if(k==='kpi'&&ci===T.diffCol){const c=T.diffCls[i+j];color=c==='good'?'1F8A4C':c==='bad'?'C0392B':'55657F';}
        if(T.head[ci]==='ป้าย')color=v==='แย่สุด'?'C0392B':v==='ดีสุด'?'1F8A4C':color;
        if(T.head[ci]==='เกรด'&&GCOL[v])color=GCOL[v].slice(1).toUpperCase();
        return {text:v==null?'—':typeof v==='number'?v.toLocaleString('th-TH',{maximumFractionDigits:2}):String(v),options:{color,align:typeof v==='number'?'right':'left',fill:{color:j%2?'F2F5FB':'FFFFFF'}}};}));
      sl.addTable([hdr,...(body.length?body:[[{text:'ไม่มีรายการ',options:{colspan:T.head.length}}]])],{x:0.4,y:1.1,w:12.5,fontFace:FF,fontSize:12,border:{type:'solid',color:'DBE3F0',pt:0.5},rowH:0.38});}
  }
  const sl=p.addSlide();head(sl,'หมายเหตุสูตรและเกณฑ์');
  sl.addText(['%PA = ลิตรที่ใช้ ÷ ผลรวมวงเงิน PA ลิตรของรถ','คาดการณ์สิ้นเดือน = ใช้แล้ว ÷ วันที่มีข้อมูล × จำนวนวันทั้งเดือน','DC/กลุ่ม = ลิตรรวม ÷ PA ลิตรรวมของรถในนั้น','เกรด: '+(C.mode==='off'?'ไม่ใช้':C.basisLabel+' · '+gradeRule()),'เทียบ: '+(C.prev?C.prev.label+' (วันที่เท่ากัน) · เขียว = ดีขึ้น แดง = แย่ลง':'ไม่มีช่วงก่อนหน้า'),'ทุกตัวชี้วัด ต่ำ = ดี'].map(t=>({text:t,options:{bullet:true,breakLine:true}})),{x:0.6,y:1.2,w:12,h:5,fontFace:FF,fontSize:18,color:'0B1F3F',valign:'top'});
  return p;
}

// ════════ 10) ปุ่มส่งออก ════════
async function doExport(kind){
  if(!D)return;
  if(kind==='copy'){const t=document.getElementById('share-text');try{await navigator.clipboard.writeText(t.value);say('คัดลอกแล้ว นำไปวางใน LINE หรือแอปอื่นได้เลย');}catch(e){t.select();say('เลือกข้อความแล้ว กดคัดลอกจากเมนูของเครื่อง');}return;}
  const keys=selKeys();
  if(kind!=='info'&&!keys.length){say('เลือกอย่างน้อย 1 หัวข้อก่อน');return;}
  const btns=document.querySelectorAll('#m-share .btn');btns.forEach(b=>b.disabled=true);say('กำลังสร้างไฟล์…');
  const name='NIMEX-Fleet-Card-'+fileStamp();
  try{
    if(kind==='xlsx'){XLSX.writeFile(buildXlsx(keys),name+'.xlsx');say('ดาวน์โหลด Excel แล้ว');}
    if(kind==='pptx'){const p=await buildPptx(keys);await p.writeFile({fileName:name+'.pptx'});say('ดาวน์โหลด PowerPoint แล้ว');}
    if(kind==='png'||kind==='info'){
      const b=await toPng(kind==='info'?await composeInfo():await composeLong(keys),2);
      saveBlob(name+(kind==='info'?'-Infographic':'')+'.png',b);
      const u=URL.createObjectURL(b);document.getElementById('xprev').innerHTML=`<p class="msg">ถ้าไฟล์ไม่ดาวน์โหลด ให้กดค้างหรือคลิกขวาที่รูปเพื่อบันทึก</p><img src="${u}" alt="ภาพสรุปผล" style="width:100%;border:1px solid var(--line);border-radius:10px">`;
      say(kind==='info'?'สร้างอินโฟกราฟิก 16:9 แล้ว (3840×2160)':'สร้างรูปแล้ว');}
  }catch(e){console.error(e);say('สร้างไฟล์ไม่สำเร็จ: '+e.message);}
  btns.forEach(b=>b.disabled=false);
}
fillGradeUI();
window.__share={ctx,kpiList,diffOf,tables,composeInfo,composeLong,buildXlsx,buildPptx,bwOf,dcwList}; // ใช้ตรวจสอบ
