const PLAN = {
  title:'Outdoor Athlete Longevity Plan', version:'1.0',
  sessions:{
    A:{name:'Strength A',subtitle:'Squat • Pull • Core',exercises:[
      ex('Goblet squat → front/safety-bar squat','3 x 6–8','RPE 6–8','90 sec','Smooth depth; knees track over toes'),
      ex('Romanian deadlift','3 x 8','RPE 7','90 sec','Hips back; long spine'),
      ex('Step-up','2–3 x 8/leg','RPE 7','60 sec','Control lowering; whole foot'),
      ex('Lat pulldown or assisted pull-up','3 x 8–10','RPE 7–8','60–90 sec','Shoulders down; chest tall'),
      ex('Seated cable row','3 x 10','RPE 7','60 sec','Pause briefly at ribs'),
      ex('Pallof press','3 x 10/side','Controlled','45 sec','Do not rotate'),
      ex('Farmer carry','3 x 30–45 sec','Challenging','60 sec','Tall posture; strong grip') ]},
    B:{name:'Strength B',subtitle:'Hinge • Push • Carry',exercises:[
      ex('Trap-bar deadlift or kettlebell deadlift','3 x 5–6','RPE 6–8','2 min','Push floor away; no grinding'),
      ex('Split squat','3 x 8/leg','RPE 7','75 sec','Stable knee'),
      ex('DB bench press','3 x 8–10','RPE 7–8','75 sec','Neutral/comfortable wrist'),
      ex('Half-kneeling single-arm cable/DB press','3 x 8/side','RPE 7','60 sec','Ribs down; glute engaged'),
      ex('Face pull','3 x 12–15','Moderate','45 sec','Upper-back control'),
      ex('Dead bug','3 x 6–8/side','Slow','45 sec','Low back controlled'),
      ex('Suitcase carry','3 x 30–45 sec/side','Challenging','45 sec','Do not lean') ]},
    C:{name:'Strength C',subtitle:'Single-Leg • Athletic • Conditioning',exercises:[
      ex('Reverse lunge or supported rear-foot split squat','3 x 8/leg','RPE 7','75 sec','Stable foot and knee'),
      ex('Single-leg RDL','3 x 8/leg','RPE 6–7','60 sec','Square hips; balance first'),
      ex('Cable row or chest-supported DB row','3 x 10','RPE 7','60 sec','Upper-back endurance'),
      ex('Push-up progression','3 sets','RPE 6–8','60 sec','Stop 2–3 reps before failure'),
      ex('Cable chop/lift','3 x 8/side','Controlled','45 sec','Rotate through trunk/hips'),
      ex('Bike/row intervals','6–10 x 30s brisk / 60s easy','Repeatable','—','No all-out sprinting in Phase 1') ]}
  },
  durability:[
    ex('Short-lever Copenhagen plank','2 x 15–30 sec/side','Easy–moderate','30 sec','No sharp groin pain'),
    ex('Controlled lateral lunge / shallow Cossack','2 x 6/side','Easy','30 sec','Comfortable depth'),
    ex('Calf raise','2 x 12–15','Moderate','30 sec','Full controlled range'),
    ex('Tibialis raise','2 x 12–15','Moderate','30 sec','Back to wall if needed'),
    ex('Wrist extension rock','2 x 8–10','Gentle','30 sec','Gradually load palm-down extension'),
    ex('Light wrist flexion/extension','2 x 12–15 each','Light','30 sec','Slow tempo'),
    ex('Forearm pronation/supination','2 x 10/side','Light','30 sec','Light hammer/DB lever'),
    ex('Band external rotation','2 x 12–15','Light','30 sec','Shoulder durability')],
  warmup:['3 min easy bike/rower/treadmill','Thoracic rotations — 6/side','90/90 hip transitions — 6/side','Adductor rock-backs — 8/side','Bodyweight squat — 10','Band pull-aparts/face-pull — 12','Wrist quadruped rocks — 8–10'],
  phases:[
    ['Weeks 1–2','Re-entry','2 working sets on most movements; RPE 6','Leave feeling like you could do more'],
    ['Weeks 3–4','Build consistency','Mostly 3 sets; RPE 6–7','Technique before load'],
    ['Weeks 5–6','Build strength','3 sets; RPE 7','Small load increases only'],
    ['Weeks 7–8','Consolidate','3 sets; RPE 7–8','Protect riding quality'],
    ['Week 9','Deload','Reduce volume ~30–40%','Absorb training'],
    ['Weeks 10–11','Performance build','3 sets; selected load increases','Strong, crisp reps'],
    ['Week 12','Benchmark & reset','Moderate volume; no max testing','Compare consistency/capacity']]
};
function ex(name,prescription,effort,rest,cue){return {name,prescription,effort,rest,cue}}

const KEY='outdoorAthleteStateV1';
let state=load();
let route='today';
function defaults(){return {week:1,nextSession:'A',logs:[],rideTomorrow:false,energy:3,soreness:1,jointIssue:'',notes:'',bodyWeight:'',lastUpdated:null}}
function load(){try{return {...defaults(),...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return defaults()}}
function save(){state.lastUpdated=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(state))}
function esc(s=''){return String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]))}
function fmtDate(iso){return new Date(iso).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})}
function currentPhase(){const w=+state.week; if(w<=2)return PLAN.phases[0]; if(w<=4)return PLAN.phases[1]; if(w<=6)return PLAN.phases[2]; if(w<=8)return PLAN.phases[3]; if(w===9)return PLAN.phases[4]; if(w<=11)return PLAN.phases[5]; return PLAN.phases[6]}
function setTitle(t){document.getElementById('pageTitle').textContent=t}
function render(){document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.route===route)); if(route==='today')renderToday(); if(route==='plan')renderPlan(); if(route==='library')renderLibrary(); if(route==='history')renderHistory(); if(route==='settings')renderSettings()}

function renderToday(){setTitle('Today'); const p=currentPhase(); const s=PLAN.sessions[state.nextSession]; const wkLogs=state.logs.filter(l=>weekOf(l.date)===weekOf(new Date().toISOString()));
 const banner=state.rideTomorrow?'<div class="notice"><b>Ride tomorrow:</b> reduce lower-body volume ~⅓ and skip intervals.</div>':'';
 document.getElementById('app').innerHTML=`<div class="grid">
 <section class="card hero"><div class="small muted">WEEK ${state.week} • ${esc(p[1])}</div><div class="big">${esc(s.name)}</div><div class="muted">${esc(s.subtitle)}</div><div class="meta"><span class="pill good">${wkLogs.length} sessions logged this week</span><span class="pill">~55–60 min</span></div><button class="primary full" onclick="startWorkout('${state.nextSession}')">Start workout</button></section>
 ${banner}
 <section class="card"><h3>Quick check-in</h3><div class="two grid"><div><label>Energy (1–5)</label><select id="energy" onchange="quickSave()">${[1,2,3,4,5].map(n=>`<option ${state.energy==n?'selected':''}>${n}</option>`).join('')}</select></div><div><label>Soreness (1–5)</label><select id="soreness" onchange="quickSave()">${[1,2,3,4,5].map(n=>`<option ${state.soreness==n?'selected':''}>${n}</option>`).join('')}</select></div></div><div style="margin-top:10px"><label><input type="checkbox" id="rideTomorrow" ${state.rideTomorrow?'checked':''} onchange="quickSave()"> Hard ride/outdoor day tomorrow</label></div><div style="margin-top:10px"><label>Joint/sensitivity note (optional)</label><input id="jointIssue" value="${esc(state.jointIssue)}" onchange="quickSave()" placeholder="e.g., wrist a little sensitive"></div></section>
 <section class="card"><div class="row space"><div><h3>This phase</h3><div class="muted small">${esc(p[0])}</div></div><span class="pill">RPE focus</span></div><p>${esc(p[2])}</p><div class="goodbox">${esc(p[3])}</div></section>
 <section class="card"><h3>Weekly target</h3><div class="stat-grid"><div class="stat"><b>3</b><span>strength</span></div><div class="stat"><b>2–3</b><span>outdoor days</span></div><div class="stat"><b>1</b><span>full rest day</span></div></div></section>
 </div>`}
function quickSave(){state.energy=+document.getElementById('energy').value;state.soreness=+document.getElementById('soreness').value;state.rideTomorrow=document.getElementById('rideTomorrow').checked;state.jointIssue=document.getElementById('jointIssue').value;save();renderToday()}

function startWorkout(code){const s=PLAN.sessions[code]; const previous=findLastSession(code); const phase=currentPhase(); const initialSets=(state.week<=2?2:3); let html=`<form method="dialog"><div class="row space"><div><div class="eyebrow">WEEK ${state.week}</div><h2>${esc(s.name)}</h2><div class="muted">${esc(s.subtitle)}</div></div><button class="secondary" value="cancel">Close</button></div></form>`;
 html+=state.rideTomorrow?'<div class="notice" style="margin:12px 0">Ride tomorrow: consider fewer lower-body sets and skip intervals.</div>':'';
 html+=`<details class="card" style="margin:12px 0"><summary><b>8–10 min warm-up</b></summary><ol>${PLAN.warmup.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></details>`;
 html+=`<div id="workoutForm">${s.exercises.map((e,idx)=>exerciseLogHtml(e,idx,previous,initialSets)).join('')}</div>`;
 html+=`<div class="card" style="margin-top:12px"><label>Session notes</label><textarea id="sessionNotes" rows="3" placeholder="What felt good? Anything sensitive?"></textarea><div class="two grid" style="margin-top:10px"><div><label>Session RPE</label><select id="sessionRpe">${[5,6,7,8,9].map(n=>`<option ${n===7?'selected':''}>${n}</option>`).join('')}</select></div><div><label>Energy</label><select id="sessionEnergy">${[1,2,3,4,5].map(n=>`<option ${n===state.energy?'selected':''}>${n}</option>`).join('')}</select></div></div><button class="primary full" style="margin-top:12px" onclick="finishWorkout('${code}')">Finish & save workout</button></div>`;
 showModal(html)}
function exerciseLogHtml(e,idx,previous,sets){const prev=previous?.exercises?.find(x=>x.name===e.name); const last=prev?.sets?.find(x=>x.weight)?.weight||''; return `<section class="card exercise"><div class="exercise-title">${esc(e.name)}</div><div class="meta"><span class="pill">${esc(e.prescription)}</span><span class="pill">${esc(e.effort)}</span><span class="pill">Rest ${esc(e.rest)}</span></div><div class="small muted">${esc(e.cue)}</div>${last?`<div class="small" style="margin-top:8px">Last load: <b>${esc(last)}</b></div>`:''}<div>${Array.from({length:sets},(_,s)=>`<div class="set-row"><div class="set-badge">${s+1}</div><input class="w-${idx}" placeholder="lb" inputmode="decimal"><input class="r-${idx}" placeholder="reps" inputmode="numeric"><label class="done-check"><input class="d-${idx}" type="checkbox"></label></div>`).join('')}</div></section>`}
function finishWorkout(code){const sess=PLAN.sessions[code]; const exLogs=sess.exercises.map((e,idx)=>{const ws=[...document.querySelectorAll('.w-'+idx)];const rs=[...document.querySelectorAll('.r-'+idx)];const ds=[...document.querySelectorAll('.d-'+idx)];return {name:e.name,sets:ws.map((w,i)=>({weight:w.value,reps:rs[i].value,done:ds[i].checked}))}}); const log={id:crypto.randomUUID?crypto.randomUUID():Date.now().toString(),date:new Date().toISOString(),week:+state.week,session:code,name:sess.name,energy:+document.getElementById('sessionEnergy').value,rpe:+document.getElementById('sessionRpe').value,notes:document.getElementById('sessionNotes').value,exercises:exLogs}; state.logs.unshift(log); state.nextSession=code==='A'?'B':code==='B'?'C':'A'; save(); document.getElementById('modal').close(); render();}
function findLastSession(code){return state.logs.find(l=>l.session===code)}

function renderPlan(){setTitle('Plan'); const p=currentPhase(); document.getElementById('app').innerHTML=`<div class="grid"><section class="card hero"><div class="small muted">CURRENT</div><div class="big">Week ${state.week}</div><div>${esc(p[1])}</div><div style="margin-top:12px"><label>Change week</label><input type="range" min="1" max="12" value="${state.week}" oninput="setWeek(this.value)"><div class="row space small muted"><span>1</span><span>12</span></div></div></section><section class="card"><h3>12-week progression</h3>${PLAN.phases.map(ph=>`<div class="history-item"><b>${esc(ph[0])} — ${esc(ph[1])}</b><div class="small muted">${esc(ph[2])}</div><div class="small">${esc(ph[3])}</div></div>`).join('')}</section>${Object.entries(PLAN.sessions).map(([k,s])=>`<section class="card"><div class="row space"><div><h3>${esc(s.name)}</h3><div class="muted">${esc(s.subtitle)}</div></div><button class="secondary" onclick="startWorkout('${k}')">Open</button></div><div style="margin-top:10px">${s.exercises.map(e=>`<div class="history-item"><b>${esc(e.name)}</b><div class="small muted">${esc(e.prescription)} • ${esc(e.effort)}</div></div>`).join('')}</div></section>`).join('')}</div>`}
function setWeek(v){state.week=+v;save();renderPlan()}

function renderLibrary(){setTitle('Library'); const all=[...Object.values(PLAN.sessions).flatMap(s=>s.exercises),...PLAN.durability]; document.getElementById('app').innerHTML=`<div class="grid"><section class="card"><input id="search" placeholder="Search exercises" oninput="filterLib(this.value)"></section><section class="card"><h3>Joint durability</h3><p class="small muted">Short permanent maintenance work for wrists, groin/adductors, ankles and shoulders.</p>${PLAN.durability.map((e,i)=>libItem(e,'d'+i)).join('')}</section><section class="card"><h3>Exercise library</h3><div id="libItems">${all.map((e,i)=>libItem(e,'a'+i)).join('')}</div></section></div>`}
function libItem(e,id){return `<div class="history-item lib" data-search="${esc((e.name+' '+e.cue).toLowerCase())}"><b>${esc(e.name)}</b><div class="small muted">${esc(e.prescription)} • ${esc(e.effort)} • rest ${esc(e.rest)}</div><div class="small">${esc(e.cue)}</div></div>`}
function filterLib(q){q=q.toLowerCase();document.querySelectorAll('.lib').forEach(x=>x.style.display=x.dataset.search.includes(q)?'block':'none')}

function renderHistory(){setTitle('History'); const weekCount=state.logs.filter(l=>weekOf(l.date)===weekOf(new Date().toISOString())).length; const total=state.logs.length; const avg=total?(state.logs.reduce((a,b)=>a+b.energy,0)/total).toFixed(1):'—'; document.getElementById('app').innerHTML=`<div class="grid"><section class="card"><div class="stat-grid"><div class="stat"><b>${weekCount}</b><span>this week</span></div><div class="stat"><b>${total}</b><span>total sessions</span></div><div class="stat"><b>${avg}</b><span>avg energy</span></div></div></section><section class="card"><h3>Workout history</h3>${state.logs.length?state.logs.map(l=>`<div class="history-item"><div class="row space"><div><b>${esc(l.name)}</b><div class="small muted">${fmtDate(l.date)} • Week ${l.week}</div></div><div class="score">RPE ${l.rpe}</div></div>${l.notes?`<div class="small" style="margin-top:6px">${esc(l.notes)}</div>`:''}</div>`).join(''):'<p class="muted">No workouts logged yet.</p>'}</section></div>`}

function renderSettings(){setTitle('Settings'); document.getElementById('app').innerHTML=`<div class="grid"><section class="card"><h3>App settings</h3><label>Current week</label><select onchange="setWeekSetting(this.value)">${Array.from({length:12},(_,i)=>`<option value="${i+1}" ${state.week===i+1?'selected':''}>Week ${i+1}</option>`).join('')}</select><label style="margin-top:12px">Body weight (optional)</label><input value="${esc(state.bodyWeight)}" onchange="state.bodyWeight=this.value;save()" placeholder="lb"></section><section class="card"><h3>Backup & restore</h3><p class="small muted">V1 stores your data on this device. Export a backup periodically before clearing browser data or changing phones.</p><div class="stack"><button class="secondary full" onclick="exportData()">Export backup (.json)</button><label class="secondary full" style="text-align:center;color:var(--text)">Import backup<input type="file" accept="application/json" style="display:none" onchange="importData(this.files[0])"></label></div></section><section class="card"><h3>Install on iPhone</h3><p class="small">Open the hosted app in Chrome → tap <b>Share</b> → <b>Add to Home Screen</b>. After installation, launch it from the Home Screen like an app.</p></section><section class="card"><h3>V1 principles</h3><p class="small muted">Outdoor performance first. No failure training. Riding counts as training load. Pain changes range/load/exercise instead of forcing the plan.</p></section><button class="danger full" onclick="resetApp()">Reset all local data</button></div>`}
function setWeekSetting(v){state.week=+v;save();renderSettings()}
function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='outdoor-athlete-backup.json';a.click();URL.revokeObjectURL(a.href)}
function importData(file){if(!file)return;const r=new FileReader();r.onload=()=>{try{state={...defaults(),...JSON.parse(r.result)};save();renderSettings();alert('Backup restored.')}catch{alert('That file could not be imported.')}};r.readAsText(file)}
function resetApp(){if(confirm('Reset all workout history and settings?')){state=defaults();save();render()}}
function weekOf(iso){const d=new Date(iso), day=(d.getDay()+6)%7; d.setHours(0,0,0,0); d.setDate(d.getDate()-day); return d.toISOString().slice(0,10)}
function showModal(html){const m=document.getElementById('modal');m.innerHTML=html;m.showModal()}

document.querySelectorAll('.nav-btn').forEach(b=>b.addEventListener('click',()=>{route=b.dataset.route;render()}));
document.getElementById('installHelpBtn').addEventListener('click',()=>showModal(`<form method="dialog"><div class="row space"><h2>Add to iPhone</h2><button class="secondary" value="close">Close</button></div></form><p>Once this app is hosted at an HTTPS address:</p><ol><li>Open it in <b>Chrome</b> on your iPhone.</li><li>Tap the <b>Share</b> icon.</li><li>Choose <b>Add to Home Screen</b>.</li><li>Launch <b>Outdoor Athlete</b> from the new icon.</li></ol><p class="small muted">Workout data stays on your device in V1, so use Settings → Export backup occasionally.</p>`));
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}
render();
