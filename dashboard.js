const KEY='stackly-data',$=(s,e=document)=>e.querySelector(s),role=document.body.dataset.role,isA=role==='admin';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const day=n=>{const d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
const getStoredEmail=()=>localStorage.getItem('userEmail')||localStorage.getItem('email')||(isA?'admin@stackly.in':'suresh@example.com');
const getStoredName=()=>localStorage.getItem('name')||(isA?'Admin':'Suresh Kumar');
const seed={profile:{name:getStoredName(),phone:'+91 98765 43210',email:getStoredEmail()},
tests:[{id:1,name:'Complete Blood Count',price:350,tat:'6 hrs'},{id:2,name:'Thyroid Profile',price:600,tat:'8 hrs'},{id:3,name:'Diabetes Panel',price:750,tat:'6 hrs'},{id:4,name:'Full Body Checkup',price:1999,tat:'24 hrs'},{id:5,name:'Lipid Profile',price:500,tat:'6 hrs'}],
bookings:[[ 'Suresh Kumar','+91 98765 43210',4,-1,'Ready','Home'],['Suresh Kumar','+91 98765 43210',1,2,'Confirmed','Home'],['Anitha S','+91 90000 11111',2,0,'Pending','Lab'],['Karthik M','+91 90000 22222',3,-2,'Collected','Lab'],['Meena R','+91 90000 33333',5,-3,'Ready','Home'],['Vimal P','+91 90000 44444',1,1,'Pending','Home'],['Divya K','+91 90000 55555',4,-4,'Cancelled','Lab']].map((b,i)=>({id:i+1,patient:b[0],phone:b[1],testId:b[2],date:day(b[3]),slot:'8:00 AM',mode:b[5],status:b[4]}))};

let storedRaw=null;
try{storedRaw=JSON.parse(localStorage.getItem(KEY))}catch(e){}
let D=Object.assign({},seed,storedRaw||{});
D.profile=Object.assign({},seed.profile,(storedRaw&&storedRaw.profile)||{});
D.tests=(storedRaw&&Array.isArray(storedRaw.tests)&&storedRaw.tests.length)?storedRaw.tests:seed.tests;
D.bookings=(storedRaw&&Array.isArray(storedRaw.bookings)&&storedRaw.bookings.length)?storedRaw.bookings:seed.bookings;
D.staff=(storedRaw&&Array.isArray(storedRaw.staff)&&storedRaw.staff.length)?storedRaw.staff:[{n:'Dr. Anitha Rajan',r:'Chief Pathologist',d:'Pathology',s:'On duty'},{n:'Dr. Vimal Kumar',r:'Senior Biochemist',d:'Biochemistry',s:'On duty'},{n:'Meena Sundaram',r:'Quality Manager',d:'Quality',s:'On duty'},{n:'Karthik Selvam',r:'Sample Collection Lead',d:'Field team',s:'On leave'}];
D.stock=(storedRaw&&Array.isArray(storedRaw.stock)&&storedRaw.stock.length)?storedRaw.stock:[{id:1,n:'CBC reagent kits',q:62,m:100},{id:2,n:'Vacutainer tubes',q:340,m:500},{id:3,n:'Glucose strips',q:18,m:150},{id:4,n:'Thyroid assay kits',q:44,m:80},{id:5,n:'Sterile gloves',q:120,m:400}];
D.reviews=(storedRaw&&Array.isArray(storedRaw.reviews)&&storedRaw.reviews.length)?storedRaw.reviews:[[5,'Suresh Kumar','Report reached my phone before lunch.'],[5,'Meena R','Technician was punctual and gentle.'],[4,'Karthik M','Great service, slot booking could show more times.'],[5,'Divya K','Clear prices and quick results.'],[3,'Vimal P','Had to wait a little at the lab.']];
D.prefs=(storedRaw&&storedRaw.prefs)?storedRaw.prefs:{sms:1,email:1,wa:0};
D.family=(storedRaw&&Array.isArray(storedRaw.family))?storedRaw.family:[];
D.tickets=(storedRaw&&Array.isArray(storedRaw.tickets))?storedRaw.tickets:[];
if(localStorage.getItem('userEmail')||localStorage.getItem('email'))D.profile.email=getStoredEmail();
if(localStorage.getItem('name'))D.profile.name=getStoredName();

const save=()=>{
  if(D.profile&&D.profile.email){
    localStorage.setItem('userEmail',D.profile.email);
    localStorage.setItem('email',D.profile.email);
  }
  if(D.profile&&D.profile.name){
    localStorage.setItem('name',D.profile.name);
  }
  localStorage.setItem(KEY,JSON.stringify(D));
};
const T=id=>(D.tests&&D.tests.find(t=>t.id==id))||{name:'Removed test',price:0,tat:'-'};
const inr=n=>'₹'+(n||0).toLocaleString('en-IN');
const me=()=>(D.profile&&D.profile.name)||getStoredName();
const mine=()=>(D.bookings||[]).filter(b=>b.phone===(D.profile&&D.profile.phone)||b.patient===me());
const STAT=['Pending','Confirmed','Collected','Ready','Cancelled'],pill=s=>`<span class="pill ${s}">${s==='Ready'?'Report ready':s}</span>`;
const ic=p=>`<svg viewBox="0 0 24 24">${p}</svg>`,I={chart:ic('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),star:ic('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'),home:ic('<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'),cal:ic('<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M8 2v4M16 2v4M3 10h18"/>'),plus:ic('<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'),doc:ic('<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/>'),user:ic('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>'),flask:ic('<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/>'),users:ic('<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-5 7-5s7 1.5 7 5M17 5a3.5 3.5 0 0 1 0 7M22 20c0-2.5-2-4-4-4.5"/>')};
const NAV=isA?[['overview','Overview',I.home],['bookings','Bookings',I.cal],['tests','Test catalog',I.flask],['patients','Patients',I.users],['reports','Reports',I.doc],['analytics','Analytics',I.chart],['feedback','Feedback',I.star],['staff','Staff',I.users],['stock','Inventory',I.flask]]:[['overview','Overview',I.home],['book','Book a test',I.plus],['bookings','My bookings',I.cal],['reports','My reports',I.doc],['insights','Health insights',I.chart],['packages','Packages',I.flask],['support','Support',I.star],['profile','Profile',I.user]];
const row=b=>`<div><div class="g"><b>${esc(T(b.testId).name)}</b><small>${isA?esc(b.patient)+' · ':''}${b.date} · ${b.slot} · ${b.mode==='Home'?'Home collection':'Lab visit'}</small></div>${pill(b.status)}</div>`;
const V={
user:{
overview:()=>{const m=mine(),nx=m.filter(b=>['Pending','Confirmed'].includes(b.status)&&b.date>=day(0)).sort((a,c)=>a.date>c.date?1:-1)[0];
return `<div class="hi"><h2>Hello, ${esc(me().split(' ')[0])}</h2><p>${nx?`Your next test is ${esc(T(nx.testId).name)} on ${nx.date}.`:'No upcoming tests. Book one in under a minute.'}</p><a class="btn lime" href="#book">Book a test</a></div>
<div class="grid g4" style="margin-bottom:16px"><div class="card kpi hero"><small>Total tests</small><b>${m.length}</b></div><div class="card kpi"><small>Upcoming</small><b>${m.filter(b=>['Pending','Confirmed'].includes(b.status)).length}</b></div><div class="card kpi"><small>Reports ready</small><b>${m.filter(b=>b.status==='Ready').length}</b></div><div class="card kpi"><small>Cancelled</small><b>${m.filter(b=>b.status==='Cancelled').length}</b></div></div>
<div class="card"><h2>Recent activity</h2><div class="list">${m.slice(-4).reverse().map(row).join('')||'<p class="empty">Nothing here yet.</p>'}</div></div>`},
book:()=>`<div class="card"><h2>Book a test</h2><form class="f" data-f="book"><label class="w">Test<select name="t">${D.tests.map(t=>`<option value="${t.id}">${esc(t.name)} · ${inr(t.price)} · report in ${esc(t.tat)}</option>`).join('')}</select></label><label>Date<input type="date" name="d" min="${day(0)}" value="${day(1)}" required></label><label>Time slot<select name="s"><option>7:00 AM</option><option selected>8:00 AM</option><option>10:00 AM</option><option>4:00 PM</option></select></label><label class="w">Collection<select name="m"><option value="Home">Home collection (Salem)</option><option value="Lab">Visit the lab</option></select></label><div class="w"><button class="btn">Confirm booking</button></div></form></div>`,
bookings:()=>`<div class="card"><h2>My bookings</h2><div class="list">${mine().slice().reverse().map(b=>`<div><div class="g"><b>${esc(T(b.testId).name)}</b><small>${b.date} · ${b.slot} · ${b.mode==='Home'?'Home collection':'Lab visit'} · ${inr(T(b.testId).price)}</small></div>${pill(b.status)}${['Pending','Confirmed'].includes(b.status)?`<button class="btn sm red" data-a="cancel" data-id="${b.id}">Cancel</button>`:''}</div>`).join('')||'<p class="empty">No bookings yet. Use “Book a test” to add one.</p>'}</div></div>`,
reports:()=>{const r=mine().filter(b=>b.status==='Ready');return `<div class="card"><h2>My reports</h2><div class="list">${r.map(b=>`<div><div class="g"><b>${esc(T(b.testId).name)}</b><small>${b.date}</small></div><a href="404.html" class="btn sm" data-a="dl" data-id="${b.id}">Download</a></div>`).join('')||'<p class="empty">No reports yet. They appear here as soon as your lab confirms them.</p>'}</div></div>`},
profile:()=>`<div class="card"><h2>Profile</h2><form class="f" data-f="profile"><label>Full name<input name="n" value="${esc(D.profile.name)}" placeholder="Full name (letters only)" required></label><label>Phone<input name="p" value="${esc(D.profile.phone)}" required></label><label class="w">Email<input type="email" name="e" value="${esc(D.profile.email)}" required></label><div class="w"><button class="btn">Save changes</button></div></form></div>`},
admin:{
overview:()=>{const B=D.bookings,ok=B.filter(b=>b.status!=='Cancelled'),days=[...Array(7)].map((_,i)=>day(i-4)),mx=Math.max(1,...days.map(d=>B.filter(b=>b.date===d).length));
return `<div class="grid g4" style="margin-bottom:16px"><div class="card kpi hero"><small>Revenue</small><b>${inr(ok.reduce((s,b)=>s+T(b.testId).price,0))}</b></div><div class="card kpi"><small>Bookings</small><b>${B.length}</b></div><div class="card kpi"><small>Pending</small><b>${B.filter(b=>b.status==='Pending').length}</b></div><div class="card kpi"><small>Reports ready</small><b>${B.filter(b=>b.status==='Ready').length}</b></div></div>
<div class="grid g2"><div class="card"><h2>Bookings, 7-day window</h2><div class="bars">${days.map(d=>{const n=B.filter(b=>b.date===d).length;return `<div><b>${n}</b><i style="height:${n/mx*100}%"></i>${d.slice(5)}</div>`}).join('')}</div></div><div class="card"><h2>Latest bookings</h2><div class="list">${B.slice(-4).reverse().map(row).join('')}</div></div></div>`},
bookings:()=>`<div class="card"><h2>All bookings</h2><div class="tools"><input id="q" placeholder="Search patient or test" aria-label="Search"><select id="sf"><option value="">All statuses</option>${STAT.map(s=>`<option>${s}</option>`).join('')}</select></div><div class="tw"><table><thead><tr><th>Patient</th><th>Test</th><th>Date</th><th>Mode</th><th>Status</th></tr></thead><tbody id="tb"></tbody></table></div></div>`,
tests:()=>`<div class="card" style="margin-bottom:16px"><h2>Add a test</h2><form class="f" data-f="test"><label>Name<input name="n" placeholder="Test name" required></label><label>Price (₹)<input type="number" name="p" min="1" required></label><label>Report time<input name="t" value="6 hrs"></label><div style="align-self:end"><button class="btn">Add test</button></div></form></div><div class="card"><h2>Test catalog</h2><div class="tw"><table><thead><tr><th>Test</th><th>Price</th><th>Report time</th><th></th></tr></thead>${D.tests.map(t=>`<tr><td><b>${esc(t.name)}</b></td><td>${inr(t.price)}</td><td>${esc(t.tat)}</td><td><button class="btn sm red" data-a="deltest" data-id="${t.id}">Remove</button></td></tr>`).join('')}</table></div></div>`,
patients:()=>{const m={};D.bookings.forEach(b=>{(m[b.phone]=m[b.phone]||{n:b.patient,p:b.phone,c:0,l:''}).c++;m[b.phone].l=T(b.testId).name});return `<div class="card"><h2>Patients</h2><div class="tw"><table><thead><tr><th>Name</th><th>Phone</th><th>Visits</th><th>Last test</th></tr></thead>${Object.values(m).map(p=>`<tr><td><b>${esc(p.n)}</b></td><td>${esc(p.p)}</td><td>${p.c}</td><td>${esc(p.l)}</td></tr>`).join('')}</table></div></div>`},
reports:()=>{const r=D.bookings.filter(b=>['Collected','Ready'].includes(b.status));return `<div class="card"><h2>Reports</h2><div class="list">${r.map(b=>`<div><div class="g"><b>${esc(T(b.testId).name)}</b><small>${esc(b.patient)} · ${b.date}</small></div>${pill(b.status)}${b.status==='Collected'?`<button class="btn sm" data-a="pub" data-id="${b.id}">Publish report</button>`:''}</div>`).join('')||'<p class="empty">No samples waiting. Mark a booking as Collected to see it here.</p>'}</div></div>`}}}[role];

const COL=['#0b8442','#c9ea5a','#052033','#4ea94c','#8fb7a5'];
const donut=it=>{const t=it.reduce((s,x)=>s+x[1],0)||1;let o=25;return `<div class="dn"><svg viewBox="0 0 42 42" role="img"><circle cx="21" cy="21" r="15.9155" fill="none" stroke="#eef3ef" stroke-width="6"/>${it.map((x,i)=>{const p=x[1]/t*100,c=`<circle cx="21" cy="21" r="15.9155" fill="none" stroke="${COL[i%5]}" stroke-width="6" stroke-dasharray="${p} ${100-p}" stroke-dashoffset="${o}"/>`;o-=p;return c}).join('')}<text x="21" y="23" text-anchor="middle" font-size="7" font-weight="600" fill="#031b34">${t}</text></svg><ul>${it.map((x,i)=>`<li><i style="background:${COL[i%5]}"></i>${esc(x[0])}<b>${x[1]}</b></li>`).join('')}</ul></div>`};
const line=(v,l,u='')=>{const W=300,H=120,mx=Math.max(...v),mn=Math.min(...v),r=mx-mn||1,p=v.map((y,i)=>[10+i*(W-20)/(v.length-1||1),H-14-(y-mn)/r*(H-34)]),d=p.map(x=>x.join(',')).join(' ');return `<svg class="ln" viewBox="0 0 ${W} ${H+14}"><polygon points="10,${H-14} ${d} ${p[p.length-1][0]},${H-14}" fill="rgba(11,132,66,.12)"/><polyline points="${d}" fill="none" stroke="#0b8442" stroke-width="2.5" stroke-linejoin="round"/>${p.map((x,i)=>`<circle cx="${x[0]}" cy="${x[1]}" r="3.5" fill="#fff" stroke="#0b8442" stroke-width="2"><title>${l[i]}: ${v[i]}${u}</title></circle><text x="${x[0]}" y="${H+6}" text-anchor="middle" font-size="9" fill="#5b6b7a">${l[i]}</text>`).join('')}</svg>`};
const hb=(it,f=x=>x)=>{const m=Math.max(1,...it.map(x=>x[1]));return `<div class="hb">${it.map(x=>`<div class="${x[2]||''}"><span>${esc(x[0])}</span><em><i style="width:${x[1]/m*100}%"></i></em><b>${f(x[1])}</b></div>`).join('')}</div>`};
const cnt=(arr,f)=>{const m={};arr.forEach(x=>{const k=f(x);m[k]=(m[k]||0)+1});return Object.entries(m)};
const sum=(arr,f)=>{const m={};arr.forEach(x=>{const k=f(x);m[k]=(m[k]||0)+T(x.testId).price});return Object.entries(m)};
const lab=s=>s==='Ready'?'Report ready':s,card=(t,b,c='')=>`<div class="card ${c}"><h2>${t}</h2>${b}</div>`;
const old=V.overview;
if(isA){const B=()=>D.bookings,dl=()=>[...Array(7)].map((_,i)=>day(i-4));
V.overview=()=>old()+`<div class="grid g22 mt">${card('Booking status',donut(cnt(B(),b=>lab(b.status))))}${card('Most booked tests',hb(cnt(B(),b=>T(b.testId).name).sort((a,c)=>c[1]-a[1]).slice(0,5)))}</div>`;
Object.assign(V,{
analytics:()=>`<div class="grid g22">${card('Revenue trend (₹, 7 days)',line(dl().map(d=>B().filter(b=>b.date===d&&b.status!=='Cancelled').reduce((s,b)=>s+T(b.testId).price,0)),dl().map(d=>d.slice(5)),' ₹'))}${card('Home vs lab collection',donut(cnt(B(),b=>b.mode==='Home'?'Home collection':'Lab visit')))}</div><div class="grid g22 mt">${card('Revenue by test',hb(sum(B().filter(b=>b.status!=='Cancelled'),b=>T(b.testId).name).sort((a,c)=>c[1]-a[1]),inr))}${card('Status share',donut(cnt(B(),b=>lab(b.status))))}</div>`,
feedback:()=>{const R=D.reviews,avg=(R.reduce((s,r)=>s+r[0],0)/R.length).toFixed(1);return `<div class="grid g22"><div class="card kpi hero"><small>Average rating</small><b>${avg} / 5</b><small>${R.length} patient reviews</small></div>${card('Rating breakdown',hb([5,4,3,2,1].map(n=>[n+' stars',R.filter(r=>r[0]===n).length])))}</div>${card('Latest reviews','<div class="list">'+R.map(r=>`<div><div class="g"><b>${esc(r[1])}</b><small>${esc(r[2])}</small></div><span class="star">${'★'.repeat(r[0])}</span></div>`).join('')+'</div>','mt')}`},
staff:()=>`<div class="card"><h2>Add team member</h2><form class="f" data-f="staff"><label>Name<input name="n" placeholder="Staff name" required></label><label>Role<input name="r" placeholder="Role (e.g. Biochemist)" required></label><label>Department<input name="d" placeholder="Department" required></label><div style="align-self:end"><button class="btn">Add member</button></div></form></div><div class="card mt"><h2>Team (${D.staff.length})</h2><div class="tw"><table><thead><tr><th>Name</th><th>Role</th><th>Department</th><th>Status</th></tr></thead>${D.staff.map(m=>`<tr><td><b>${esc(m.n)}</b></td><td>${esc(m.r)}</td><td>${esc(m.d)}</td><td><span class="pill ${m.s==='On duty'?'Ready':'Pending'}">${esc(m.s)}</span></td></tr>`).join('')}</table></div></div>`,
stock:()=>`<div class="card"><h2>Inventory levels</h2><div class="list">${D.stock.map(k=>`<div><div class="g"><b>${esc(k.n)}</b><small>${k.q} of ${k.m} in stock</small>${hb([['',k.q,k.q/k.m<.25?'low':'']],()=>Math.round(k.q/k.m*100)+'%').replace('<span></span>','')}</div>${k.q/k.m<.25?'<span class="pill Cancelled">Low</span>':''}<button class="btn sm" data-a="restock" data-id="${k.id}">Restock</button></div>`).join('')}</div></div>`})}
else{const M=()=>mine();
V.overview=()=>old()+`<div class="grid g22 mt">${card('My bookings by status',donut(cnt(M(),b=>lab(b.status))))}${card('Spend by test',hb(sum(M().filter(b=>b.status!=='Cancelled'),b=>T(b.testId).name),inr))}</div>`;
const PK=[['Full Body Checkup',4,['60+ parameters','Home collection included','Report in 24 hours','Doctor review']],['Diabetes Panel',3,['HbA1c and fasting glucose','Kidney markers','Report in 6 hours']],['Thyroid Profile',2,['T3, T4 and TSH','Report in 8 hours','Digital report']]];
Object.assign(V,{
insights:()=>{const m=['May','Jun','Jul','Aug','Sep','Oct'],R=[['Hemoglobin','14.1 g/dL','13.0-17.0','Normal'],['Fasting glucose','96 mg/dL','70-100','Normal'],['Total cholesterol','212 mg/dL','< 200','Watch'],['TSH','2.4 mIU/L','0.4-4.0','Normal']];return `<div class="grid g22">${card('Hemoglobin trend (g/dL)',line([13.1,13.4,13.2,13.8,14,14.1],m))}${card('Fasting glucose trend (mg/dL)',line([104,101,99,100,97,96],m))}</div><div class="card mt"><h2>Latest results (sample data)</h2><div class="tw"><table><thead><tr><th>Marker</th><th>Your value</th><th>Reference</th><th>Status</th></tr></thead>${R.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td><span class="pill ${r[3]==='Normal'?'Ready':'Pending'}">${r[3]}</span></td></tr>`).join('')}</table></div></div>`},
packages:()=>`<div class="grid g3">${PK.map((p,i)=>`<div class="card pk ${i?'':'hl'}"><h3>${p[0]}</h3><div class="pr">${inr(T(p[1]).price)}</div><ul>${p[2].map(x=>`<li>${x}</li>`).join('')}</ul><button class="btn" data-a="pkg" data-id="${p[1]}">Book this</button></div>`).join('')}</div>`,
support:()=>`<div class="grid g2"><div class="card"><h2>Common questions</h2>${[['Do I need to fast?','Some tests such as glucose and lipid profile need 8-10 hours of fasting. Water is fine.'],['How fast are reports ready?','Most reports are ready in about 6 hours and appear under My reports.'],['Can I change my slot?','Cancel the booking under My bookings and book a new time.'],['Is home collection available?','Yes, daily across Salem.']].map(q=>`<details><summary>${q[0]}</summary><p>${q[1]}</p></details>`).join('')}</div><div class="card"><h2>Talk to us</h2><div class="list"><div><div class="g"><b>Call</b><small><a href="tel:+919876543210">+91 98765 43210</a></small></div></div><div><div class="g"><b>WhatsApp</b><small><a href="https://wa.me/919876543210">Chat with the lab</a></small></div></div><div><div class="g"><b>Email</b><small><a href="mailto:info@stackly.in">info@stackly.in</a></small></div></div><div><div class="g"><b>Hours</b><small>Mon-Sat 6:30 AM-8 PM, Sun 7 AM-1 PM</small></div></div></div></div></div>`})}

let bf='All';
const prep=t=>/Diabetes|Lipid|Full/.test(t.name)?'Fast for 8-10 hours before sampling. Water is fine.':'No fasting needed.';
const ring=(p,c)=>`<svg viewBox="0 0 42 42"><circle cx="21" cy="21" r="15.9155" fill="none" stroke="#eef3ef" stroke-width="5"/><circle cx="21" cy="21" r="15.9155" fill="none" stroke="${c||'#0b8442'}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${p} ${100-p}"/></svg>`;
function bs(){const e=$('#bs'),x=$('[name=t]');if(e&&x){const t=T(x.value);e.innerHTML=`<h2>Test summary</h2><div class="kpi"><small>${esc(t.name)}</small><b>${inr(t.price)}</b></div><div class="list"><div><div class="g"><b>Report time</b><small>${esc(t.tat)}</small></div></div><div><div class="g"><b>Preparation</b><small>${prep(t)}</small></div></div><div><div class="g"><b>Please carry</b><small>A photo ID and any earlier reports</small></div></div></div>`}}
if(!isA){const oo=V.overview,oi=V.insights,os=V.support,ob=V.book,FL={All:()=>1,Upcoming:b=>['Pending','Confirmed'].includes(b.status),Completed:b=>['Collected','Ready'].includes(b.status),Cancelled:b=>b.status==='Cancelled'};
const trk=b=>{const i={Pending:0,Confirmed:1,Collected:2,Ready:3}[b.status];return i===undefined?'':`<div class="tr">${['Booked','Confirmed','Collected','Report'].map((x,j)=>`<span class="${j<=i?'d':''}">${x}</span>`).join('')}</div>`};
Object.assign(V,{
overview:()=>oo()+`<div class="grid g22 mt"><div class="card"><h2>Health score</h2><div class="ring">${ring(82)}<div><b>82 / 100</b><p style="color:var(--muted)">Based on your latest sample results. Cholesterol is the one area to watch.</p></div></div></div><div class="card"><h2>Reminders</h2><div class="list"><div><div class="g"><b>Yearly full body checkup</b><small>Recommended every 12 months</small></div><a class="btn sm" href="#packages">View</a></div><div><div class="g"><b>Lipid profile follow-up</b><small>Suggested 3 months after a watch result</small></div><a class="btn sm" href="#book">Book</a></div></div></div></div><div class="card mt"><h2>Quick actions</h2><div class="qa"><a href="#book">${I.plus}Book a test</a><a href="#reports">${I.doc}Get reports</a><a href="#insights">${I.chart}My insights</a><a href="#support">${I.star}Get help</a></div></div><div class="tip mt"><b>Tip of the day:</b> drink plenty of water before a blood test. It makes sampling easier and does not change most results.</div>`,
book:()=>`<div class="grid g2">${ob()}<div class="card" id="bs"></div></div>`,
bookings:()=>`<div class="card"><h2>My bookings</h2><div class="tools">${Object.keys(FL).map(k=>`<button class="btn sm ${k===bf?'':'ghost'}" data-a="bf" data-v="${k}">${k}</button>`).join('')}</div><div class="list">${mine().filter(FL[bf]).reverse().map(b=>`<div><div class="g"><b>${esc(T(b.testId).name)}</b><small>${b.date} · ${b.slot} · ${b.mode==='Home'?'Home collection':'Lab visit'} · ${inr(T(b.testId).price)}</small></div>${pill(b.status)}${['Pending','Confirmed'].includes(b.status)?`<button class="btn sm red" data-a="cancel" data-id="${b.id}">Cancel</button>`:''}${trk(b)}</div>`).join('')||'<p class="empty">No bookings in this view.</p>'}</div></div>`,
reports:()=>{const m=mine(),r=m.filter(b=>b.status==='Ready'),p=m.filter(b=>['Pending','Confirmed','Collected'].includes(b.status));return `<div class="grid g3"><div class="card kpi hero"><small>Ready</small><b>${r.length}</b></div><div class="card kpi"><small>In progress</small><b>${p.length}</b></div><div class="card kpi"><small>Total reports</small><b>${m.length}</b></div></div><div class="card mt"><h2>Ready to download</h2><div class="list">${r.map(b=>`<div><div class="g"><b>${esc(T(b.testId).name)}</b><small>${b.date} · ${b.patient}</small></div>${pill('Ready')}<a href="404.html" class="btn sm" data-a="dl" data-id="${b.id}">Download</a></div>`).join('')||'<p class="empty">No reports yet. They appear here as soon as your lab confirms them.</p>'}</div></div><div class="card mt"><h2>Being processed</h2><div class="list">${p.map(b=>`<div><div class="g"><b>${esc(T(b.testId).name)}</b><small>Expected in ${esc(T(b.testId).tat)} after sampling</small></div>${pill(b.status)}${trk(b)}</div>`).join('')||'<p class="empty">Nothing in progress.</p>'}</div></div>`},
insights:()=>oi()+`<div class="grid g22 mt"><div class="card"><h2>Score by area</h2>${hb([['Blood',90],['Sugar',85],['Lipids',68],['Thyroid',88]],x=>x+'/100')}</div><div class="card"><h2>Suggestions</h2><div class="list"><div><div class="g"><b>Cut back on fried food</b><small>Helps bring cholesterol into range</small></div></div><div><div class="g"><b>Walk 30 minutes daily</b><small>Supports glucose and heart health</small></div></div><div><div class="g"><b>Retest in 3 months</b><small>Book a lipid profile to track progress</small></div></div></div></div></div><p class="tip mt">These values are sample data. Real results appear here once your reports are ready. Always discuss results with your doctor.</p>`,
support:()=>os()+`<div class="grid g22 mt"><div class="card"><h2>Send us a message</h2><form class="f" data-f="tix"><label class="w">Subject<select name="s"><option>Booking help</option><option>Report question</option><option>Billing</option><option>Other</option></select></label><label class="w">Message<input name="m" required placeholder="How can we help?"></label><div class="w"><button class="btn">Send message</button></div></form></div><div class="card"><h2>Your messages</h2><div class="list">${D.tickets.slice().reverse().map(t=>`<div><div class="g"><b>${esc(t.s)}</b><small>${esc(t.m)} · ${t.d}</small></div><span class="pill Confirmed">Sent</span></div>`).join('')||'<p class="empty">No messages yet.</p>'}</div></div></div>`,
profile:()=>{const p=D.profile,o=(a,v)=>a.map(x=>`<option${x===v?' selected':''}>${x}</option>`).join('');return `<div class="card"><h2>Personal details</h2><form class="f" data-f="profile"><label>Full name<input name="n" value="${esc(p.name)}" placeholder="Full name (letters only)" required></label><label>Phone<input name="p" value="${esc(p.phone)}" required></label><label>Email<input type="email" name="e" value="${esc(p.email)}" required></label><label>Date of birth<input type="date" name="b" value="${esc(p.dob||'')}"></label><label>Gender<select name="g">${o(['','Female','Male','Other'],p.gender)}</select></label><label>Blood group<select name="bg">${o(['','A+','A-','B+','B-','O+','O-','AB+','AB-'],p.blood)}</select></label><label class="w">Home address (for collection)<input name="a" value="${esc(p.addr||'')}" placeholder="Street, area, Salem"></label><div class="w"><button class="btn">Save changes</button></div></form></div><div class="grid g22 mt"><div class="card"><h2>Notifications</h2>${[['sms','SMS updates'],['email','Email reports'],['wa','WhatsApp alerts']].map(k=>`<label class="chk"><input type="checkbox" data-a="pref" data-k="${k[0]}"${D.prefs[k[0]]?' checked':''}>${k[1]}</label>`).join('')}</div><div class="card"><h2>Family members</h2><div class="list">${D.family.map((f,i)=>`<div><div class="g"><b>${esc(f.n)}</b><small>${esc(f.r)}</small></div><button class="btn sm red" data-a="delfam" data-id="${i}">Remove</button></div>`).join('')||'<p class="empty">Add family to book tests for them.</p>'}</div><form class="f mt" data-f="fam"><label>Name<input name="n" placeholder="Member name (letters only)" required></label><label>Relation<input name="r" placeholder="Relation (e.g. Spouse)" required></label><div class="w"><button class="btn ghost">Add member</button></div></form></div></div>`}})}
function tbl(){const q=($('#q').value||'').toLowerCase(),s=$('#sf').value;$('#tb').innerHTML=D.bookings.filter(b=>(!s||b.status===s)&&(b.patient+T(b.testId).name).toLowerCase().includes(q)).reverse().map(b=>`<tr><td><b>${esc(b.patient)}</b><small style="display:block;color:var(--muted)">${esc(b.phone)}</small></td><td>${esc(T(b.testId).name)}</td><td>${b.date}<br><small>${b.slot}</small></td><td>${b.mode}</td><td><select data-a="st" data-id="${b.id}">${STAT.map(x=>`<option value="${x}"${x===b.status?' selected':''}>${x==='Ready'?'Report ready':x}</option>`).join('')}</select></td></tr>`).join('')||'<tr><td colspan="5" class="empty">No bookings match.</td></tr>'}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(t.h);t.h=setTimeout(()=>t.classList.remove('on'),2200)}

function validateDashField(inp){
  const name=inp.name,val=inp.value?inp.value.trim():'';
  let msg='';
  const label=inp.closest('label')||inp.parentElement;
  let err=label?label.querySelector('.validation-error'):null;
  if(!err&&label){
    err=document.createElement('span');
    err.className='validation-error';
    label.appendChild(err);
  }
  if(inp.required&&!val){
    msg='This field is required.';
  }else if(name==='e'||inp.type==='email'){
    const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(val&&!emailRegex.test(val))msg='Please enter a valid email address.';
  }else if(name==='p'&&inp.type!=='number'){
    const phoneRegex=/^\+?[0-9\s\-()]{7,15}$/;
    if(val&&!phoneRegex.test(val))msg='Please enter a valid phone number (min 7 digits).';
  }else if(name==='n'){
    if(val&&/[0-9]/.test(val))msg='Numbers are not accepted in name.';
    else if(val&&val.length<2)msg='Name must be at least 2 characters.';
    else if(val&&!/^[a-zA-Z\s.'-]+$/.test(val))msg='Only letters and spaces are allowed.';
  }else if(name==='p'&&inp.type==='number'){
    if(val&&(isNaN(val)||Number(val)<=0))msg='Price must be greater than 0.';
  }else if(name==='d'&&inp.type==='date'){
    if(val&&val<day(0))msg='Date cannot be in the past.';
  }else if(name==='m'&&inp.tagName==='INPUT'){
    if(val&&val.length<3)msg='Message must be at least 3 characters.';
  }
  if(msg){
    inp.classList.remove('is-valid');
    inp.classList.add('is-invalid');
    if(err){err.textContent=msg;err.style.opacity='1';err.style.maxHeight='30px';}
    return false;
  }else{
    inp.classList.remove('is-invalid');
    if(val)inp.classList.add('is-valid');
    if(err){err.textContent='';err.style.opacity='0';err.style.maxHeight='0';}
    return true;
  }
}

function validateDashForm(f){
  let ok=true;
  f.querySelectorAll('input, select, textarea').forEach(inp=>{
    if(!validateDashField(inp))ok=false;
  });
  if(!ok){
    f.classList.add('is-invalid-shake');
    setTimeout(()=>f.classList.remove('is-invalid-shake'),400);
  }
  return ok;
}

function bindDashValidation(){
  document.querySelectorAll('form.f input, form.f select, form.f textarea').forEach(inp=>{
    // Strip numbers from name inputs
    if(inp.name==='n'||(inp.id&&inp.id.toLowerCase().includes('name'))||(inp.placeholder&&inp.placeholder.toLowerCase().includes('name'))){
      inp.addEventListener('keydown',e=>{
        if(/^[0-9]$/.test(e.key))e.preventDefault();
      });
      inp.addEventListener('input',()=>{
        const old=inp.value,clean=old.replace(/[0-9]/g,'');
        if(old!==clean)inp.value=clean;
        if(inp.classList.contains('is-invalid')||inp.classList.contains('is-valid'))validateDashField(inp);
      });
    }else{
      inp.addEventListener('input',()=>{
        if(inp.classList.contains('is-invalid')||inp.classList.contains('is-valid'))validateDashField(inp);
      });
    }
    inp.addEventListener('blur',()=>validateDashField(inp));
    if(inp.tagName==='SELECT')inp.addEventListener('change',()=>validateDashField(inp));
  });
}

function updateMe(){
  const curE=getStoredEmail(),curN=isA?'Admin':(D.profile.name||getStoredName()),init=(curN&&curN[0])?curN[0].toUpperCase():(isA?'A':'P');
  const meEl=$('.me');
  if(meEl){
    meEl.innerHTML=`<i>${isA?'A':esc(init)}</i><div class="me-txt" style="line-height:1.2;text-align:left"><b style="display:block;font-size:13.5px;color:var(--ink)">${esc(curN)}</b><small style="font-size:11px;color:var(--muted);font-weight:400;display:block">${esc(curE)}</small></div>`;
  }
}

function go(){
  const k=(location.hash.slice(1)||'overview'),n=NAV.find(x=>x[0]===k)||NAV[0];
  $('#title').textContent=n[1];
  $('#view').innerHTML=V[n[0]]();
  document.querySelectorAll('aside nav a').forEach(a=>a.classList.toggle('on',a.dataset.k===n[0]));
  document.body.classList.remove('nav');
  if(n[0]==='bookings'&&isA){tbl();$('#q').oninput=tbl;$('#sf').onchange=tbl}
  if(D.pick&&$('[name=t]')){$('[name=t]').value=D.pick;D.pick=0}
  bs();
  updateMe();
  bindDashValidation();
  scrollTo(0,0);
}

$('aside').innerHTML=`<a class="logo" href="index.html"><img src="images/stackly logo.webp" alt="Stackly" class="stackly-logo-img"></a><div class="role">${isA?'Admin console':'Patient portal'}</div><nav>${NAV.map(n=>`<a href="#${n[0]}" data-k="${n[0]}">${n[2]}${n[1]}</a>`).join('')}</nav><div class="sw">${isA?'Viewing as staff.':'Viewing as patient.'}<br><a href="${isA?'user-dashboard.html':'admin-dashboard.html'}">Switch to ${isA?'patient':'admin'} view</a><br><a href="login.html" style="display:inline-block;margin-top:8px;color:#d9534f;font-weight:600">Sign out</a></div>`;
$('.burger').onclick=()=>document.body.classList.toggle('nav');
addEventListener('hashchange',go);
document.addEventListener('click',e=>{const a=e.target.closest('[data-a]');if(!a||a.tagName==='SELECT')return;const id=+a.dataset.id,b=D.bookings.find(x=>x.id===id);
if(a.dataset.a==='pkg'){D.pick=id;save();location.hash='book';return}if(a.dataset.a==='restock'){const k=D.stock.find(x=>x.id===id);k.q=k.m;toast(k.n+' restocked')}if(a.dataset.a==='bf'){bf=a.dataset.v;go();return}if(a.dataset.a==='delfam'){D.family.splice(id,1);toast('Removed')}if(a.dataset.a==='cancel'){b.status='Cancelled';toast('Booking cancelled')}
if(a.dataset.a==='pub'){b.status='Ready';toast('Report published to patient')}
if(a.dataset.a==='deltest'){D.tests=D.tests.filter(t=>t.id!==id);toast('Test removed')}
if(a.dataset.a==='dl'){window.location.href='404.html';return}
save();go()});
document.addEventListener('change',e=>{if(e.target.name==='t')bs();if(e.target.dataset.a==='pref'){D.prefs[e.target.dataset.k]=e.target.checked?1:0;save();toast('Preference saved')}if(e.target.dataset.a==='st'){D.bookings.find(x=>x.id==e.target.dataset.id).status=e.target.value;save();toast('Status updated')}});
document.addEventListener('submit',e=>{
  const f=e.target;
  if(!f||!f.classList.contains('f'))return;
  e.preventDefault();
  if(!validateDashForm(f))return;
  const v=Object.fromEntries(new FormData(f)),k=f.dataset.f;
  if(k==='book'){D.bookings.push({id:Date.now(),patient:me(),phone:D.profile.phone,testId:+v.t,date:v.d,slot:v.s,mode:v.m,status:'Pending'});save();toast('Booking received');location.hash='bookings';return}
  if(k==='profile'){Object.assign(D.profile,{name:v.n.trim(),phone:v.p.trim(),email:v.e.trim(),dob:v.b||'',gender:v.g||'',blood:v.bg||'',addr:v.a||''});save();updateMe();toast('Profile saved');return}
  if(k==='staff'){D.staff.push({n:v.n.trim(),r:v.r.trim(),d:v.d.trim(),s:'On duty'});toast('Team member added')}
  if(k==='fam'){D.family.push({n:v.n.trim(),r:v.r.trim()});toast('Family member added')}
  if(k==='tix'){D.tickets.push({s:v.s,m:v.m.trim(),d:day(0)});toast('Message sent to Stackly')}
  if(k==='test'){D.tests.push({id:Date.now(),name:v.n.trim(),price:+v.p,tat:v.t||'-'});toast('Test added')}
  save();go();
});
go();
