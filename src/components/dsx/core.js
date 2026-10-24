/* DSX SDL6 Pure-Boundary CORE: educational coupled 3D model; not validated physiology. No observed eight-coin launches. */
(function(g){'use strict';
const V={add:(a,b)=>a.map((x,i)=>x+b[i]),sub:(a,b)=>a.map((x,i)=>x-b[i]),mul:(a,k)=>a.map(x=>x*k),dot:(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),len:a=>Math.hypot(...a),norm:a=>{let l=Math.hypot(...a)||1;return a.map(x=>x/l)}};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
// Boundary mathematics are PURE: no state, no I/O, no string formatting.
// A bounded inverse-square MOTOR-ASSIST envelope, not Newtonian collision physics.
// r <= r0 has unit gain; doubling r beyond r0 quarters the assist.
const INVERSE_SQUARE_REFERENCE_METERS=.020;
function inverseSquare(distance, reference=INVERSE_SQUARE_REFERENCE_METERS){
  if(!Number.isFinite(distance)||distance<0||!Number.isFinite(reference)||reference<=0)
    throw new RangeError('finite distance >= 0 and reference > 0 required');
  const ratio=reference/Math.max(reference,distance);
  return ratio*ratio;
}
// HEAD: external text -> constrained immutable command. No unchecked commands enter CORE.
function explodeExternal(text){
  if(typeof text!=='string'||text.length>80)return {ok:false,error:'Invalid bounded command'};
  const fields=text.split('|');
  if(fields.length!==3||!['eight','single','nine'].includes(fields[0])||
     !['simultaneous','staggered'].includes(fields[1])||
     !['0','1'].includes(fields[2]))return {ok:false,error:'Unknown command token'};
  return {ok:true,value:Object.freeze({mode:fields[0],launch:fields[1],powered:fields[2]==='1'})};
}
// TAIL: typed state -> immutable numeric projection; encoding is OUTSIDE CORE.
function externalProjection(s){
  return Object.freeze({
    time:s.time,coins:s.coins.length,launches:s.fingerContacts,
    walls:s.walls,thumbs:s.thumbContacts,misses:s.misses,
    simulated:s.evidence.simulated,observed:s.evidence.observed
  });
}

const smooth=x=>{let u=clamp(x,0,1);return u*u*(3-2*u)};
const lens=[[.052,.039,.028],[.060,.045,.032],[.066,.049,.035],[.056,.042,.030]];
const locations=[-.075,-.025,.025,.075];
const inward=s=>[-s,0,0];
function finger(s,lane,t,start=0){
  // Proximal, middle, distal phalanges: motor-driven angles give actual moving tips.
  const base=[s*.59,-.075,locations[lane]];
  const u=smooth((t-start)/.24),recover=smooth((t-start-.28)/.38);
  const flex=.13+(.93*u-.72*recover);
  const theta=[flex*.75,flex*1.02,flex*1.23];
  let p=base;const out=[p];
  for(let j=0;j<3;j++){let a=theta[j];p=V.add(p,[-s*Math.sin(a)*lens[lane][j],Math.cos(a)*lens[lane][j],Math.sin(a)*.003]);out.push(p)}
  return out;
}
function launchThumb(s,t,start){
  const base=[s*.59,-.075,0],lengths=[.061,.039,.028];
  const u=smooth((t-start)/.24),recover=smooth((t-start-.28)/.38),a=.13+(.93*u-.72*recover);
  const pts=[base];let p=base;for(let j=0;j<3;j++){let th=a*[.75,1.02,1.23][j];p=V.add(p,[-s*Math.sin(th)*lengths[j],Math.cos(th)*lengths[j],0]);pts.push(p)}return pts;
}
function thumb(h){
  // Moving metacarpal plus two phalanges; approximate 3D inverse kinematics.
  const base=[h.s*.60,-.065,0],aim=V.add(h.target,[h.s*.015*h.recoil,0,0]),v=V.sub(aim,base),u=V.norm(v),reach=clamp(V.len(v),.031,.126);
  const bend=[-h.s*.028,0,.027],mid=V.add(base,V.add(V.mul(u,reach*.55),bend));
  const second=V.add(mid,V.mul(V.sub(aim,mid),.57));
  return [base,mid,second,aim.slice()];
}
function distanceSegment(p,a,b){const d=V.sub(b,a),q=clamp(V.dot(V.sub(p,a),d)/(V.dot(d,d)||1),0,1),near=V.add(a,V.mul(d,q));return {d:V.len(V.sub(p,near)),near};}
function dsxCoin(n){n=n|0;return n===0?'ERROR':(n&1)?'HEADS':'TAILS';}
function create(config={}){
  const mode=config.mode||'eight',launch=config.launch||'staggered',powered=!!config.powered;
  const s={mode,launch,powered,time:0,dt:1/120,events:[],observations:[],hands:[-1,1].map(z=>({s:z,target:[z*.45,.025,0],recoil:0})),coins:[],walls:0,fingerContacts:0,thumbContacts:0,misses:0,exits:0,faceCounts:{H:0,T:0,E:0},stopped:false,evidence:{observed:0,simulated:true,calibrated:false}};
  for(let i=0;i<(mode==='eight'?8:1);i++){
    const side=i<4?-1:1,lane=i%4,start=mode==='eight'?(launch==='simultaneous'?0:(lane*.45+(side>0?.22:0))):0;
    const site=mode==='eight'?'finger':'thumb';
    const motion=site==='thumb'?launchThumb:finger;
    const at=site==='thumb'?motion(side,0,start)[3]:motion(side,lane,0,start)[3];
    const p=site==='thumb'?motion(side,start+.095,start)[3]:motion(side,lane,start+.095,start)[3];
    const pos=[p[0]-side*.017,p[1],p[2]]; // distinct starting coins, just ahead of each fingertip
    const dsxInteger=(-28417+(i+1)*137)|0;
    s.coins.push({id:i+1,s:side,lane,site,start,dsxInteger,dsxFace:dsxCoin(dsxInteger),state:'queued',pos,vel:[0,0,0],spin:0,omega:0,origin:at,wallHits:0,thumbHits:0,lastThumb:-1,face:null,contactAt:null});
  }
  return s;
}
function event(s,type,c,desc){s.events.push({time:Math.round(s.time*1000)/1000,kind:type,coin:c?.id??0,description:desc,source:'simulation'});}
function finish(s,c,reason){if(c.state==='done')return;c.state='done';c.face=Math.cos(c.spin)>=0?'H':'T';s.faceCounts[c.face]++;s.exits++;if(!c.thumbHits){s.misses++;event(s,'missed-return',c,reason);}else event(s,'exit-after-thumb',c,reason);event(s,'orientation-estimate',c,c.face+' based on modeled rotation, not DSX parity');}
function updateMutable(s){if(s.stopped)return s;let dt=s.dt;s.time+=dt;
  // Contact target controller; each thumb can attend to only one returning coin at once.
  for(let i=0;i<2;i++){
    const h=s.hands[i],returning=s.coins.filter(c=>c.s===h.s&&c.state==='flight'&&c.wallHits>0&&c.vel[0]*c.s>0).sort((a,b)=>Math.abs(a.pos[0])-Math.abs(b.pos[0]));
    const target=returning[0];const dest=target?[h.s*.43,clamp(target.pos[1],-.10,.14),clamp(target.pos[2],-.09,.09)]:[h.s*.455,.025,0];
    const k=clamp(3.2*dt,0,1);h.target=h.target.map((v,j)=>v+(dest[j]-v)*k);h.recoil*=.94;
  }
  for(const c of s.coins){
    if(c.state==='queued'){
      const motion=c.site==='thumb'?(t=>launchThumb(c.s,t,c.start)[3]):(t=>finger(c.s,c.lane,t,c.start)[3]);
      const old=motion(s.time-dt),now=motion(s.time);
      const velocity=V.mul(V.sub(now,old),1/dt),speed=V.dot(velocity,inward(c.s));
      const gap=distanceSegment(c.pos,old,now);
      if(s.time>=c.start&&speed>.09&&gap.d<.026){
        // Launch exists only after a fingertip sweep contacts the actual coin.
        c.state='flight';c.contactAt=s.time;
        c.pos=V.add(c.pos,V.mul(inward(c.s),.006));
        const headGain=inverseSquare(gap.d);
        const impulse=.010*clamp(speed*.85,.25,1.1)*headGain;
        c.vel=V.add(V.mul(inward(c.s),impulse/.010),[0,.115,0]);
        c.omega=18+speed*55;c.spin=0;s.fingerContacts++;
        event(s,c.site==='thumb'?'thumb-launch-contact':'finger-contact',c,`${c.site==='thumb'?'thumb':'finger '+(c.lane+1)}; pad speed ${speed.toFixed(3)} m/s; impulse ${impulse.toFixed(4)} N s; head inverse-square gain ${headGain.toFixed(3)}`);
        event(s,'motor-work',c,'explicitly powered finger joint, not a free impulse');
      }else if(s.time>c.start+.5){c.state='done';s.misses++;event(s,'unlaunched',c,'finger missed launch pad; no invented trajectory');}
      continue;
    }
    if(c.state!=='flight')continue;
    c.vel[1]-=.085*dt;
    const previous=c.pos;c.pos=V.add(c.pos,V.mul(c.vel,dt));c.spin+=c.omega*dt;c.omega*=1-.006*dt;
    const plane=-c.s*.026;
    if(c.wallHits===0&&((c.s<0&&previous[0]<plane&&c.pos[0]>=plane)||(c.s>0&&previous[0]>plane&&c.pos[0]<=plane))){
      c.pos[0]=plane;c.vel[0]=-c.vel[0]*.75;c.vel[1]*=.86;c.omega*=.91;c.wallHits++;s.walls++;
      event(s,'wall-contact',c,'restitution 0.75, modeled energy loss');
    }
    // No catches on the outbound leg. Thumb contact requires actual segment proximity.
    if(c.wallHits>0&&c.vel[0]*c.s>0&&s.time-c.lastThumb>.15){
      const h=s.hands[c.s<0?0:1],chain=thumb(h);
      let best={d:Infinity};for(let k=0;k<3;k++){const v=distanceSegment(c.pos,chain[k],chain[k+1]);if(v.d<best.d)best=v;}
      if(best.d<.027){
        const normal=V.norm(V.sub(c.pos,best.near));const rel=V.dot(c.vel,normal);
        if(rel<-.01){const impulse=-(1+.55)*rel/(1/.010+1/.050);
          c.vel=V.add(c.vel,V.mul(normal,impulse/.010));h.recoil+=impulse/.050;
          c.thumbHits++;c.lastThumb=s.time;s.thumbContacts++;
          event(s,'thumb-contact',c,`segment collision; impulse ${impulse.toFixed(5)} N s`);
          if(s.powered){
            const tailGain=inverseSquare(best.d);
            // Inverse-square scales *added motor assist*, never passive impact restitution.
            c.vel[0]+=(-c.s*.57-c.vel[0])*tailGain;
            c.vel[1]+=(.09-c.vel[1])*tailGain;
            c.omega+=8*tailGain;
            event(s,'thumb-motor-work',c,`explicit powered flick; tail inverse-square gain ${tailGain.toFixed(3)}`);
          }
        }
      }
    }
    if(c.pos[1]<-.22||Math.abs(c.pos[0])>.80||Math.abs(c.pos[2])>.25||s.time>8)finish(s,c,'outside finite arena');
  }
  if(s.time>=8||s.coins.every(c=>c.state==='done'))s.stopped=true;
  return s;
}
function cloneWorld(s){
  return {...s,
    hands:s.hands.map(h=>({...h,target:h.target.slice()})),
    coins:s.coins.map(c=>({...c,pos:c.pos.slice(),vel:c.vel.slice(),origin:c.origin.slice()})),
    events:s.events.map(e=>({...e})),observations:s.observations.map(o=>({...o})),
    faceCounts:{...s.faceCounts},evidence:{...s.evidence}};
}
// Public transition is referentially transparent for the same input state.
function update(s){return updateMutable(cloneWorld(s));}
function replay(config,time){let s=create(config);for(let j=0;j<Math.min(960,Math.floor(time*120));j++)s=update(s);return s;}
function validate(s){const unique=s.coins.map(c=>[c.s,c.lane].join(':'));return new Set(unique).size===unique.length&&s.coins.every(c=>c.pos.every(Number.isFinite)&&c.vel.every(Number.isFinite))&&s.events.every(e=>e.source==='simulation')&&s.faceCounts.H+s.faceCounts.T+s.faceCounts.E<=s.coins.length&&s.thumbContacts<=s.events.filter(x=>x.kind==='thumb-contact').length;}
function nineViews(physicalResult){return [{kind:'simulated',name:'primary physical hypothesis',value:physicalResult},...['Launch angle','Finger force','Angular impulse','Coin tilt','Wall coefficient','Visibility','Mirror orientation','Surface geometry'].map(name=>({kind:'counterfactual',name,value:'undetermined'}))];}

// SIXTH DOMAIN: lockstep mirror + independent invariants, evaluated at EVERY fixed 120 Hz tick.
// This client-local demonstrator is NOT a substitute for trusted/server-side authority.
const canonNumber=n=>Number.isFinite(n)?Number(n.toFixed(11)):'NONFINITE';
const vec=v=>v.map(canonNumber);
function fiveDomains(s){
  const t=s.time;
  return {
    geometry:{hands:s.hands.map(h=>({s:h.s,target:vec(h.target),recoil:canonNumber(h.recoil),thumb:thumb(h).map(vec)})),coins:s.coins.map(c=>({id:c.id,side:c.s,lane:c.lane,site:c.site,start:c.start,origin:vec(c.origin),finger:c.site==='finger'?finger(c.s,c.lane,t,c.start).map(vec):launchThumb(c.s,t,c.start).map(vec)}))},
    dynamics:{time:canonNumber(t),dt:canonNumber(s.dt),powered:s.powered,mode:s.mode,launch:s.launch,stopped:s.stopped,coins:s.coins.map(c=>({id:c.id,state:c.state,position:vec(c.pos),velocity:vec(c.vel),spin:canonNumber(c.spin),angularVelocity:canonNumber(c.omega),face:c.face}))},
    contacts:{launches:s.fingerContacts,walls:s.walls,thumbs:s.thumbContacts,misses:s.misses,exits:s.exits,coins:s.coins.map(c=>({id:c.id,wallHits:c.wallHits,thumbHits:c.thumbHits,lastThumb:canonNumber(c.lastThumb),contactAt:c.contactAt===null?null:canonNumber(c.contactAt)}))},
    timeline:{events:s.events.map(e=>({time:e.time,coin:e.coin,kind:e.kind,description:e.description,source:e.source}))},
    evidence:{...s.evidence,dsx:s.coins.map(c=>({id:c.id,integer:c.dsxInteger,logical:c.dsxFace})),counterfactuals:s.mode==='nine'?nineViews('undetermined').slice(1):[]}
  };
}
function invariants(s){
  if(!validate(s))return 'Invalid positions, identity, provenance, or contact accounting';
  const ids=new Set(s.coins.map(c=>c.id));
  if(ids.size!==s.coins.length||s.coins.length<1||s.coins.length>8)return 'Coin identity/count mismatch';
  for(const c of s.coins){
    if(!['queued','flight','done'].includes(c.state))return `Coin ${c.id}: invalid state`;
    if(!Number.isFinite(c.spin)||!Number.isFinite(c.omega)||Math.abs(c.spin)>1e6)return `Coin ${c.id}: invalid spin`;
    if(c.wallHits<0||c.thumbHits<0||c.thumbHits>0&&c.wallHits===0)return `Coin ${c.id}: impossible contact order`;
    if(c.state==='flight'&&c.contactAt===null)return `Coin ${c.id}: flight without launch contact`;
    if(c.dsxFace!==dsxCoin(c.dsxInteger))return `Coin ${c.id}: logical parity mismatch`;
  }
  const kinds={};let lastTime=-1;
  const perCoinWall=new Map();
  for(const e of s.events){
    if(e.time<lastTime-1e-8||e.time>s.time+.00051)return 'Timeline order or future event';
    if(e.source!=='simulation'||!ids.has(e.coin))return 'Provenance or coin ID mismatch';
    if(e.kind==='thumb-contact'&&!perCoinWall.has(e.coin))return `Coin ${e.coin}: thumb contact before wall`;
    if(e.kind==='wall-contact')perCoinWall.set(e.coin,true);
    kinds[e.kind]=(kinds[e.kind]||0)+1;lastTime=e.time;
  }
  if((kinds['finger-contact']||0)+(kinds['thumb-launch-contact']||0)!==s.fingerContacts)return 'Finger-contact counter mismatch';
  if((kinds['wall-contact']||0)!==s.walls)return 'Wall-contact counter mismatch';
  if((kinds['thumb-contact']||0)!==s.thumbContacts)return 'Thumb-contact counter mismatch';
  if((kinds['missed-return']||0)+(kinds['unlaunched']||0)!==s.misses)return 'Miss counter mismatch';
  if(!Number.isFinite(s.time)||s.time<0||s.time>8.02)return 'Invalid simulation time';
  if(s.evidence.observed!==0||s.evidence.simulated!==true||s.evidence.calibrated!==false)return 'Evidence provenance changed';
  return null;
}
// FNV-1a is a fast, non-cryptographic local checksum. It is NOT tamper-proof.
function checksum(input){let h=0x811c9dc5;for(let i=0;i<input.length;i++){const code=input.charCodeAt(i);h=Math.imul(h^code,0x01000193)>>>0;}return h.toString(16).padStart(8,'0');}
function parityBit(text){
  // Even-parity bit over UTF-16 code units: catches some bit errors, not malicious editing.
  let p=0;for(let i=0;i<text.length;i++){let v=text.charCodeAt(i);v^=v>>>8;v^=v>>>4;v^=v>>>2;v^=v>>>1;p^=v&1;}return p;
}
function seal(g){
  const a=fiveDomains(g.primary),b=fiveDomains(g.mirror);
  const mismatch=['geometry','dynamics','contacts','timeline','evidence'].find(k=>JSON.stringify(a[k])!==JSON.stringify(b[k]));
  const issue=invariants(g.primary)||invariants(g.mirror)||(mismatch?`Domain mismatch: ${mismatch}`:null);
  if(issue){g.status='HALTED';g.reason=issue;g.failures.push({tick:g.tick,reason:issue,source:'parity-guard'});return false;}
  g.status='VERIFIED';g.reason='';
  g.domainChecks=Object.fromEntries(Object.entries(a).map(([k,v])=>[k,checksum(JSON.stringify(v))]));
  g.domainParity=Object.fromEntries(Object.entries(a).map(([k,v])=>[k,parityBit(JSON.stringify(v))]));
  g.digest=checksum(g.digest+'|'+g.tick+'|'+JSON.stringify(a));
  g.receipts.push({tick:g.tick,time:canonNumber(g.primary.time),digest:g.digest,domainChecks:{...g.domainChecks},parityBits:{...g.domainParity}});
  return true;
}
function guarded(config={}){
  const g={config:{...config},primary:create(config),mirror:create(config),tick:0,status:'VERIFIED',reason:'',digest:'00000000',domainChecks:{},domainParity:{},receipts:[],failures:[]};
  seal(g);return g;
}
function verifyGuarded(g){if(g.status==='HALTED')return false;
  const a=fiveDomains(g.primary),b=fiveDomains(g.mirror);
  const mismatch=['geometry','dynamics','contacts','timeline','evidence'].find(k=>JSON.stringify(a[k])!==JSON.stringify(b[k]));
  const issue=invariants(g.primary)||invariants(g.mirror)||(mismatch?`Domain mismatch: ${mismatch}`:null);
  const latest=g.receipts[g.receipts.length-1];
  const actualChecks=Object.fromEntries(Object.entries(a).map(([k,v])=>[k,checksum(JSON.stringify(v))]));
  const actualParity=Object.fromEntries(Object.entries(a).map(([k,v])=>[k,parityBit(JSON.stringify(v))]));
  const receiptError=!latest||latest.tick!==g.tick||latest.digest!==g.digest||JSON.stringify(actualChecks)!==JSON.stringify(latest.domainChecks)||JSON.stringify(actualParity)!==JSON.stringify(latest.parityBits);
  const reason=issue||(receiptError?'Sealed state receipt mismatch':null);
  if(reason){g.status='HALTED';g.reason=reason;g.failures.push({tick:g.tick,reason,source:'parity-guard'});return false;}
  return true;
}
function advanceGuarded(g,steps=1){
  for(let i=0;i<steps;i++){
    if(!verifyGuarded(g))return false;
    if(g.primary.stopped||g.mirror.stopped)return true;
    g.primary=update(g.primary);g.mirror=update(g.mirror);g.tick++;
    if(!seal(g))return false;
  }
  return true;
}
function guardedReplay(config,time){const g=guarded(config);advanceGuarded(g,Math.min(960,Math.max(0,Math.floor(time*120+1e-7))));return g;}
function injectCoinTamper(g){g.primary.coins[0].pos[0]+=.20;return verifyGuarded(g);}
const parityApi={fiveDomains,invariants,checksum,parityBit,guarded,verifyGuarded,advanceGuarded,guardedReplay,injectCoinTamper};

const api={V,clamp,inverseSquare,explodeExternal,externalProjection,
  finger,launchThumb,thumb,dsxCoin,create,update,replay,validate,nineViews,distanceSegment,...parityApi};if(typeof module==='object'&&module.exports)module.exports=api;g.DSXLivingCore=api;
})(typeof window!=='undefined'?window:globalThis);

