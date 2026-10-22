// 〈조병창: 밀정〉 기획 콘티 보기: 콘티.js(window.CONTI)를 읽어 탭으로 보여 줌.
// 한눈에 → 기획·아이디어 → 메커니즘 설계 → 관계 맵 → 역할 → 게임 진행 → 구성품 → 기획 로드맵
(()=>{
const C=window.CONTI;if(!C){document.body.textContent='콘티.js를 찾지 못했습니다.';return;}
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
const img=(src,alt,cls)=>{const i=el('img',cls);i.src='그림/'+src;i.alt=alt||'';i.loading='lazy';return i;};
const roles=new Map((C.roles||[]).map(r=>[r.id,r])),parts=new Map((C.parts||[]).map(p=>[p.id,p]));
const SIDE={joseon:'조선팀',japan:'일본팀',neutral:'중립',spare:'예비'};
const SIDE_COLOR={joseon:'#24527a',japan:'#9b3b33',neutral:'#a8822a',spare:'#7b8392'};
const STATE={done:'완료',now:'진행 중',next:'예정'};
const sideTag=s=>el('span','tag t-'+s,SIDE[s]||s);
const two=i=>String(i+1).padStart(2,'0');
document.title=C.title+' · 기획 콘티';

// 머리
const header=el('header'),head=el('div','head'),h1=el('h1');h1.append(el('small',null,C.kind+(C.caseNo?' · '+C.caseNo:'')),document.createTextNode(C.title));
const meta=el('div','meta');for(const t of [C.players,C.time,C.world].filter(Boolean))meta.append(el('span',null,t));head.append(h1,meta);
const tabs=el('nav','tabs');
const TABS=[['overview','한눈에'],['idea','기획 · 아이디어'],['mechanics','메커니즘 설계'],['map','관계 맵'],['roles','역할'],['flow','게임 진행'],['parts','구성품'],['roadmap','기획 로드맵']];
const WIDE=new Set(['overview','idea','mechanics','map','roadmap']);
// 누르면 상세가 나오는 탭에서만 오른쪽(아래) 상세 칸을 보여 줌
const DETAIL=new Set(['map','roles','flow','parts']);
// 제목은 위에서 스크롤되어 사라지고, 탭 줄만 화면 위에 붙어 있게 함 (휴대폰에서 화면을 덜 가림)
const tabbar=el('div','tabbar');tabbar.append(tabs);header.append(head);document.body.append(header,tabbar);
const main=el('main'),views=el('div'),detail=el('aside','card');detail.id='detail';main.append(views,detail);document.body.append(main);
// 콘티.js에 내용이 없는 탭은 버튼을 숨김 (공개판은 게임 진행 등을 뺀 콘티.js를 씀)
const HAS={parts:false,idea:!!C.ideation,mechanics:!!C.mechanics?.length,flow:!!C.stages?.length,roadmap:!!C.phases?.length};
const SHOWN=TABS.filter(([id])=>HAS[id]!==false).map(([id])=>id);
const sections={};for(const [id,name] of TABS){const s=el('section','view');s.hidden=true;sections[id]=s;views.append(s);if(!SHOWN.includes(id))continue;const b=el('button',null,name);b.dataset.tab=id;b.onclick=()=>show(id);tabs.append(b);}
function show(id){if(id==='parts')id='overview';for(const b of tabs.children){b.classList.toggle('on',b.dataset.tab===id);if(b.dataset.tab===id)tabs.scrollTo({left:b.offsetLeft-(tabs.clientWidth-b.offsetWidth)/2});}for(const [k,s] of Object.entries(sections))s.hidden=k!==id;main.classList.toggle('wide',WIDE.has(id));if(id==='map'&&mapWrap)mapWrap.scrollLeft=(mapWrap.scrollWidth-mapWrap.clientWidth)/2;detail.hidden=!DETAIL.has(id);try{history.replaceState(null,'','#'+id);}catch{}scrollTo({top:0});}

// 공통 조각
function blank(){detail.replaceChildren(el('p','empty','역할이나 구성품을 누르면 여기에 자세히 나옵니다.'));}
function field(label,text,cls){if(!text)return null;const f=el('div','field'+(cls?' '+cls:''));f.append(el('b',null,label),document.createTextNode(text));return f;}
function listField(label,items){if(!items?.length)return null;const f=el('div','field');f.append(el('b',null,label));const ul=el('ul','clean');items.forEach(t=>ul.append(el('li',null,t)));f.append(ul);return f;}
function intro(s,text){s.append(el('p','sub',text));}
function heading(s,text){const h=el('h2',null,text);h.style.margin='30px 0 12px';s.append(h);}
// 휴대폰용 인원별 구성: 인원마다 한 장 (표는 휴대폰에서 숨김)
function setupCards({head,rows}){const w=el('div','setup-m');for(const r of rows){const c=el('div','sc');const h=el('div','sc-h');h.append(el('b',null,r[0]));const team=el('div','sc-team');[[1,'navy'],[2,'red'],[3,'gold'],[4,'ink']].forEach(([i,cl])=>{if(r[i]==='—')return;const t=el('span','chip '+cl);t.append(el('em',null,head[i]),el('b',null,r[i]));team.append(t);});h.append(team);
 const rd=el('div','sc-rounds');rd.append(el('span','sc-l',head[5]));const g=el('div','rgrid');r[5].split('·').forEach((n,k)=>{const x=el('div','rc');x.append(el('i',null,(k+1)+'R'),el('b',null,n));g.append(x);});rd.append(g);
 const st=el('div','sc-stats');[6,7,8].forEach(i=>{const x=el('div');x.append(el('span',null,head[i]),el('b',null,r[i]));st.append(x);});c.append(h,rd,st);w.append(c);}return w;}
function table(head,rows,cls,firstCls){const t=el('table',cls);const tr=el('tr');head.forEach(x=>tr.append(el('th',null,x)));t.append(tr);for(const row of rows){const r=el('tr');row.forEach((x,i)=>r.append(el('td',i===0&&firstCls?firstCls:null,x)));t.append(r);}const c=el('div','card');c.append(t);return c;}
function partChip(id){const p=parts.get(id);const b=el('button','chip part-'+(p?.kind||''),id+(p?' '+p.title:''));b.onclick=e=>{e.stopPropagation();showPart(id);};return b;}

// 오른쪽 상세 (좁은 화면에서는 아래쪽)
function toDetail(){if(innerWidth<=1050)detail.scrollIntoView({behavior:'smooth',block:'start'});}
function showPart(id){const p=parts.get(id);if(!p)return;const box=el('div','kv'),h=el('h2');h.append(el('span','tag t-part',p.id),document.createTextNode(' '+p.title));
 // Like the role panel: text fields first, then small pictures with captions underneath.
 const gallery=el('div','part-gallery');const fig=(src,cap)=>{const f=el('figure'),a=el('a');a.href='그림/'+src;a.target='_blank';a.title='크게 보기';a.append(img(src,cap));f.append(a,el('figcaption',null,cap));gallery.append(f);};
 fig(p.img,p.imgCaption||(p.photo?'디자인':p.title));if(p.photo)fig(p.photo,p.photoCaption||'실물 출력');for(const m of p.more||[])fig(m.img,m.cap);
 box.append(...[h,field('수량',p.count),field('쓰임',p.use),field('이것이 드러내는 것',p.shows),field('노림수',p.intent),field(C.madeLabel||'제작 방식 · 원가',p.made,'made'),gallery].filter(Boolean));
 if(p.points?.length){const f=el('div','field');f.append(el('b',null,'연결'));const ul=el('ul','clean');for(const x of p.points)ul.append(el('li',null,(roles.get(x.to)?.name||parts.get(x.to)?.title||x.to)+' — '+x.label));f.append(ul);box.append(f);}
 const used=(C.stages||[]).map((s,i)=>s.uses?.includes(id)?two(i)+' '+s.name:null).filter(Boolean);if(used.length)box.append(listField('쓰이는 장면',used));
 detail.replaceChildren(box);highlight(id);toDetail();}
function showRole(id){const r=roles.get(id);if(!r)return;const box=el('div','kv'),h=el('h2');h.append(sideTag(r.side),document.createTextNode(' '+r.name));
 const gallery=el('div','card-gallery');for(const c of r.cards||[]){const f=el('figure');f.append(img(c.img,c.job+' '+c.name),el('figcaption',null,c.job+' · '+c.name),el('p','quote','“'+c.quote+'”'));if(c.note)f.append(el('p','card-note',c.note));gallery.append(f);}
 box.append(...[h,field('인원',r.count),field('공개 여부',r.public),field('목표',r.goal),listField('할 수 있는 것',r.can),field('플레이 포인트',r.plays),gallery].filter(Boolean));
 const rel=(C.relations||[]).filter(x=>x.from===id||x.to===id);if(rel.length){const f=el('div','field');f.append(el('b',null,'관계'));const ul=el('ul','clean');rel.forEach(x=>{const other=x.from===id?x.to:x.from;ul.append(el('li',null,(x.from===id?'→ ':'← ')+(roles.get(other)?.name||parts.get(other)?.title||other)+' — '+x.label));});f.append(ul);box.append(f);}
 detail.replaceChildren(box);highlight(id);toDetail();}

// 1) 한눈에
{const s=sections.overview,G=C.glance,W=C.winView;
 const list=(title,items)=>{const c=el('div','card');c.append(el('h3',null,title));const ul=el('ul','clean');(items||[]).forEach(t=>ul.append(el('li',null,t)));c.append(ul);return c;};
 const gh=(t,sub)=>{const h=el('h2','gl-h',t);if(sub)h.append(el('small',null,sub));s.append(h);};
 if(G){// 한 장짜리 기획 콘티와 같은 구성: 제목 → 세 진영 → 한 라운드 콘티 → 6라운드 로드맵 → 승패 → 두 상자
  const hd=el('div','gl-head');hd.append(el('p','gl-kicker',G.kicker),el('h1','gl-title',G.title),el('p','gl-lead',G.lead));s.append(hd);
  gh(G.sides.title,G.sides.sub);const sd=el('div','gl-sides');G.sides.items.forEach(([im,tag,col,txt])=>{const d=el('div','gl-side');d.append(img(im,tag),el('span','gl-tag '+col,tag),el('p',null,txt));sd.append(d);});s.append(sd);
  gh(G.round.title,G.round.sub);const st=el('div','gl-strip');G.round.items.forEach((r,i)=>{const f=el('div','gl-frame'),sh=el('div','gl-shot k-'+r.kind);
   sh.append(el('span','gl-no'+(r.hot?' red':''),two(i)));r.imgs.forEach(x=>sh.append(x==='→'?el('span','gl-arrow','→'):img(x,'')));
   const cap=el('div','gl-cap');cap.append(el('b',null,r.title),el('span',null,r.text));const em=el('em');em.append(el('i',null,'노림수 · '),document.createTextNode(r.aim));cap.append(em);f.append(sh,cap);st.append(f);});s.append(st);
  gh(G.road.title,G.road.sub);const rd=el('div','gl-road');G.road.items.forEach(([r,n,sm,note])=>{const d=el('div','gl-r'+(note?' hot':''));const c=el('div','gl-crew',n);c.append(el('small',null,sm));d.append(el('i',null,r),c);if(note)d.append(el('div','gl-note',note));rd.append(d);});
  {const d=el('div','gl-r final');d.append(el('i',null,G.road.final[0]),el('div','gl-note',G.road.final[1]));rd.append(d);}
  const rw=el('div','gl-roadwrap');rw.append(rd);s.append(rw);
  const ru=el('p','gl-rule');ru.append(el('b',null,G.road.rule[0]),document.createTextNode(' '+G.road.rule[1]));s.append(ru);
  const jd=el('div','gl-judge');jd.append(img(W?W.track:'track-board.jpg','생산진행도 −7 ~ +7'));const ws=el('div','gl-wins');G.wins.forEach(([a,b,col])=>{const w=el('div','gl-win '+col);w.append(el('b',null,a),document.createTextNode(' · '+b));ws.append(w);});jd.append(ws);s.append(jd);
  // 최종 지목 보정(토큰 그림)은 승패 바로 아래
  if(W){const c=el('div','card wv');const adj=el('div','wv-adj');W.adjust.forEach(a=>{const b=el('div','wa');b.append(el('h4',null,a.who));const r=el('div','wa-row');
    a.items.forEach(([k,v])=>{const it=el('div','wa-it');it.append(img(W.tokens[v],v),el('span',null,k),el('b','wa-v '+(v.startsWith('+')?'n-p':v==='0'?'n-z':'n-m'),v));r.append(it);});b.append(r);adj.append(b);});
   c.append(el('h4','wv-h','최종 지목 보정 — 밀정을 지목한 결과로 생산진행도를 한 칸 더 움직임'),adj,el('p','wv-note',W.note));s.append(c);}
  const bx=el('div','gl-boxes');G.boxes.forEach(([t,p])=>{const b=el('div','gl-box');b.append(el('b',null,t),el('p',null,p));bx.append(b);});s.append(bx);
 }else{const top=el('div','card hero');top.append(el('p','lead',C.oneLine||''),el('p','sub',C.summary||''));const g=el('div','grid g2');g.style.marginTop='16px';
  g.append(list('이 게임은?',C.purpose),list('승패 판정',(C.wins||[]).map(([q,a])=>q+' → '+a)));s.append(top,g);}
 heading(s,'인원별 구성');s.append(table(C.setup.head,C.setup.rows,'setup'),setupCards(C.setup));
 if(C.todo?.length||C.cost){const g2=el('div','grid g2');g2.style.marginTop='16px';if(C.todo?.length)g2.append(list('다듬을 곳',C.todo));if(C.cost){const cost=el('div','card');cost.append(el('h3',null,'세트 원가'),el('p',null,C.cost));g2.append(cost);}s.append(g2);}}

// 2) 기획 · 아이디어 도출
{const s=sections.idea,I=C.ideation||{};intro(s,'질문 하나에서 게임이 되기까지 — 무엇에서 출발했고, 왜 조병창이며, 그 이야기를 어떤 장치로 옮겼는지 정리했습니다.');
 const steps=el('div','idea-steps');(I.steps||[]).forEach((st,i)=>{const c=el('div','card idea');c.append(el('span','ino',two(i)),el('span','iname',st.name),el('h3',null,st.title),el('p',null,st.text));steps.append(c);});s.append(steps);
 if(C.concept){const c=el('div','card note');c.style.marginTop='16px';c.append(el('h3',null,'소재와 기획 의도'),el('p',null,C.concept));s.append(c);}
 heading(s,'조병창의 이야기를 게임 장치로');s.append(table(['조병창의 현실','게임에서는','왜 이렇게'],I.mapping||[],'mapping','real'));
 heading(s,'고민하고 정한 것');const d=el('div','grid g2');(I.decisions||[]).forEach(([q,a])=>{const c=el('div','card decision');c.append(el('b',null,q),el('p',null,a));d.append(c);});s.append(d);}

// 3) 메커니즘 설계
{const s=sections.mechanics;intro(s,'게임을 움직이는 장치들입니다. 규칙이 무엇인지, 왜 그렇게 설계했는지, 플레이어가 무엇을 느끼게 되는지를 함께 적었습니다.');
 // 장치 카드: 그림·번호·이름 → 규칙 → 왜 이렇게(옅게) → 플레이어의 한마디(말풍선)
 const g=el('div','mk-grid');(C.mechanics||[]).forEach((m,i)=>{const c=el('div','mk'+(m.name.includes('일본군 대장')?' mk-captain':''));const top=el('div','mk-top');const nm=el('div','mk-name');
  const [t1,t2]=m.name.split(' — ');nm.append(el('span','mk-no',two(i)),el('b',null,t1));if(t2)nm.append(el('small',null,t2));top.append(nm);
  const media=el('div','mk-media');
  const sources=i===0?['token-plus.png','token-zero.png','token-minus.png']:i===1?['gl-tray.png']:i===6?['track.jpg','rounds.jpg']:[m.img];
  if(i===0)media.classList.add('mk-tokens');if(i===6)media.classList.add('mk-boards');
  sources.forEach(src=>{const mi=img(src,m.name);mi.loading='eager';media.append(mi);});top.append(media);
  const body=el('div','mk-body');const row=(lb,txt,cl)=>{const r=el('div','mk-row '+cl);r.append(el('i',null,lb),el('p',null,txt));return r;};
  body.append(row('규칙',m.rule,'rule'),row('왜 이렇게',m.why,'why'));const f=el('div','mk-feel');f.append(el('p',null,m.feel));body.append(f);c.append(top,body);g.append(c);});s.append(g);
 // 누가 무엇을 아는가: 글 대신 아는 정도를 칩으로 (앎 · 일부 · 모름)
 if(C.knowledge){heading(s,'누가 무엇을 아는가');const K=C.knowledge,box=el('div','card kn');const t=el('table','kn-t');const hr=el('tr');K.head.forEach(h=>hr.append(el('th',null,h)));t.append(hr);
  const ROLE={'조선 노동자':'navy','밀정':'red','일본군 대장':'red','중립 황도윤':'gold'};
  K.rows.forEach(r=>{const tr=el('tr');r.forEach((v,i)=>{const td=el('td');if(!i){td.append(el('span','kn-role '+(ROLE[v]||''),v));tr.append(td);return;}
   const lv=/^모름/.test(v)?'no':/^(앎|모두 앎)/.test(v)?'yes':'part';const chip=el('span','kn-chip '+lv);chip.append(el('b',null,lv==='yes'?'✓':lv==='no'?'✕':'◐'),document.createTextNode(v.replace(/\s*\(.*\)$/,'')));td.append(chip);
   const note=v.match(/\((.*)\)$/);if(note)td.append(el('small','kn-note',note[1]));tr.append(td);});t.append(tr);});
  const lg=el('div','kn-legend');[['yes','✓','앎'],['part','◐','일부만'],['no','✕','모름']].forEach(([c,s2,l])=>{const x=el('span','kn-chip '+c);x.append(el('b',null,s2),document.createTextNode(l));lg.append(x);});
  const wrap=el('div','kn-wrap');wrap.append(t);box.append(wrap,lg);s.append(box);}
 // 숫자 설계: 값을 크게 보여 주는 타일
 if(C.numbers?.length){heading(s,'숫자 설계');const g2=el('div','nm-grid');C.numbers.forEach(([k,v,why])=>{const c=el('div','nm');c.append(el('span','nm-k',k),el('b','nm-v',v),el('p',null,why));g2.append(c);});s.append(g2);}
 // 바뀐 규칙: 전 → 후 카드
 if(C.changes?.length){heading(s,'플레이테스트로 바뀐 규칙 (10/6 원고 → 10/12 최종 룰북)');const g3=el('div','ch-grid');C.changes.forEach(([a,b,why],i)=>{const c=el('div','ch');
   const ba=el('div','ch-ba');const be=el('div','ch-before');be.append(el('i',null,'전'),el('p',null,a));const af=el('div','ch-after');af.append(el('i',null,'후'),el('p',null,b));ba.append(be,el('span','ch-arrow','→'),af);
   c.append(el('span','ch-no',two(i)),ba,el('p','ch-why',why));g3.append(c);});s.append(g3);}}

// 4) 관계 맵: 역할(원)·구성품(네모)·관계선(실선)·구성품이 가리키는 것(점선 화살표)
const NS='http://www.w3.org/2000/svg',svgEl=(t,a={})=>{const e=document.createElementNS(NS,t);for(const [k,v] of Object.entries(a))e.setAttribute(k,v);return e;};
let mapNodes=new Map(),mapEdges=[],mapWrap=null;
{const s=sections.map;intro(s,'누가 누구를 감시하고 찾는지(실선), 각 역할이 생산진행도를 어느 쪽으로 밀어야 하는지, 구성품이 어떤 단서를 주는지(점선)를 이었습니다. 누르면 연결된 것만 진하게 보이고 아래에 자세히 나옵니다.');
 const W=1200,H=800,svg=svgEl('svg',{class:'map',viewBox:`0 0 ${W} ${H}`,role:'img','aria-label':'역할·구성품 관계도'});
 const COLOR={watch:'#b23a32',hunt:'#b07d10',hidden:'#7a56a8',aim:'#3f6a96',part:'#8a5a32'};
 const defs=svgEl('defs');for(const [k,c] of Object.entries(COLOR)){const m=svgEl('marker',{id:'a-'+k,markerWidth:9,markerHeight:9,refX:8,refY:4.5,orient:'auto'});m.append(svgEl('path',{d:'M0,0 L9,4.5 L0,9 z',fill:c}));defs.append(m);}svg.append(defs);
 const pos=id=>{const p=roles.get(id)||parts.get(id);return p&&p.x!==undefined?{x:p.x,y:p.y}:null;};
 const edges=svgEl('g'),nodes=svgEl('g');svg.append(edges,nodes);
 const trim=(a,b,r)=>{const dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy)||1;return {x:b.x-dx/l*r,y:b.y-dy/l*r};};
 const curve=(a,b,bend)=>{const mx=(a.x+b.x)/2,my=(a.y+b.y)/2,dx=b.x-a.x,dy=b.y-a.y;return {x:mx-dy*bend,y:my+dx*bend};};
 function edge(from,to,type,dash,label,width){const a=pos(from),b0=pos(to);if(!a||!b0)return;const r=roles.has(to)?46:40,b=trim(a,b0,r),c=curve(a,b,dash?0.08:0.18),color=COLOR[type];
  const g=svgEl('g');g.dataset.ends=from+' '+to;g.append(svgEl('path',{d:`M${a.x},${a.y} Q${c.x},${c.y} ${b.x},${b.y}`,fill:'none',stroke:color,'stroke-width':width,'stroke-dasharray':dash?'6 6':'','marker-end':`url(#a-${type})`}));
  if(label){const t=svgEl('text',{x:(a.x+2*c.x+b.x)/4,y:(a.y+2*c.y+b.y)/4-6,'text-anchor':'middle','font-size':15,'font-weight':700,fill:color,'paint-order':'stroke',stroke:'#f7f2e7','stroke-width':6});t.textContent=label;g.append(t);}
  edges.append(g);mapEdges.push(g);}
 for(const r of C.relations||[])edge(r.from,r.to,r.type,r.type==='aim',r.label,r.type==='aim'?2.2:3);
 for(const p of C.parts||[])for(const x of p.points||[])edge(p.id,x.to,'part',true,x.short||'',2);
 for(const r of C.roles||[]){if(r.x===undefined)continue;const g=svgEl('g',{class:'node',transform:`translate(${r.x},${r.y})`});g.dataset.id=r.id;
  if(r.public==='공개 역할')g.append(svgEl('circle',{r:50,fill:'none',stroke:SIDE_COLOR[r.side],'stroke-width':2,'stroke-dasharray':'4 4'}));
  g.append(svgEl('circle',{r:44,fill:SIDE_COLOR[r.side]||'#556',stroke:'#fcfaf5','stroke-width':3}));
  const label=r.name.split(' · ')[0];const t1=svgEl('text',{y:6,'text-anchor':'middle','font-size':label.length>4?15:18,'font-weight':900,fill:'#fff'});t1.textContent=label;g.append(t1);
  const t2=svgEl('text',{y:68,'text-anchor':'middle','font-size':13,'font-weight':700,fill:'#4a5465','paint-order':'stroke',stroke:'#f7f2e7','stroke-width':5});t2.textContent=(SIDE[r.side]||'')+' · '+(r.cards?.[0]?.name||'')+(r.cards?.length>1?' 외 '+(r.cards.length-1)+'명':'')+(r.public==='공개 역할'?' · 공개':'');g.append(t2);
  g.onclick=()=>showRole(r.id);nodes.append(g);mapNodes.set(r.id,g);}
 for(const p of C.parts||[]){if(p.x===undefined)continue;const g=svgEl('g',{class:'node',transform:`translate(${p.x},${p.y})`});g.dataset.id=p.id;const label=p.title.split(' (')[0],w=Math.max(130,label.length*16+60);
  g.append(svgEl('rect',{x:-w/2,y:-21,width:w,height:42,rx:10,fill:'#fcfaf5',stroke:COLOR.part,'stroke-width':2}));
  const t=svgEl('text',{y:6,'text-anchor':'middle','font-size':15,'font-weight':700,fill:'#1e2430'});const b=svgEl('tspan',{'font-weight':900,fill:COLOR.part});b.textContent=p.id+' ';t.append(b,document.createTextNode(label));g.append(t);
  g.onclick=()=>showPart(p.id);nodes.append(g);mapNodes.set(p.id,g);}
 svg.onclick=ev=>{if(ev.target===svg){highlight(null);blank();}};
 const wrap=el('div','mapwrap');wrap.append(svg);mapWrap=wrap;s.append(el('p','maphint','← 관계 맵은 옆으로 밀어서 볼 수 있습니다 →'));
 const lg=el('div','legend');for(const [c,t] of [[COLOR.watch,'감시 · 통제'],[COLOR.hunt,'찾는다 (최종 지목)'],[COLOR.hidden,'숨은 같은 편'],[COLOR.aim,'생산진행도를 미는 방향 →'],[COLOR.part,'구성품이 주는 단서 →']]){const sp=el('span');const i=el('i');i.style.borderColor=c;sp.append(i,document.createTextNode(t));lg.append(sp);}
 s.append(wrap,lg);}
function highlight(id){if(!id){mapNodes.forEach(n=>n.classList.remove('dim'));mapEdges.forEach(e=>e.classList.remove('dim'));return;}
 const keep=new Set([id]);mapEdges.forEach(e=>{const [a,b]=e.dataset.ends.split(' ');const on=a===id||b===id;e.classList.toggle('dim',!on);if(on){keep.add(a);keep.add(b);}});mapNodes.forEach((n,k)=>n.classList.toggle('dim',!keep.has(k)));}

// 5) 역할
{const s=sections.roles;intro(s,'진영마다 목표가 다릅니다. 일본군 대장만 공개되고, 나머지는 게임이 끝날 때까지 서로를 모릅니다. 카드를 누르면 오른쪽에 자세히 나옵니다.');
 const g=el('div','grid g2');for(const r of C.roles||[]){const c=el('div','card person role side-'+r.side);c.style.setProperty('--side',SIDE_COLOR[r.side]||'#556');
  const thumbs=el('div','thumbs');(r.cards||[]).forEach(x=>thumbs.append(img(x.img,x.job+' '+x.name)));
  const who=el('div','who');const t=el('div');t.append(el('strong',null,r.name),document.createElement('br'),sideTag(r.side),el('span','mute',' '+r.count+' · '+r.public));who.append(t);
  c.append(...[who,thumbs,field('목표',r.goal),field('플레이 포인트',r.plays)].filter(Boolean));c.onclick=()=>showRole(r.id);g.append(c);}
 s.append(g);}

// 6) 게임 진행: 장면 카드 보드
{const s=sections.flow;intro(s,'한 판을 장면으로 나눠, 플레이어가 하는 일·쓰이는 구성품·만든 사람의 노림수·예상되는 말과 심리전을 적었습니다. 빨간 번호는 일본군 대장이 끼어드는 장면입니다.');
 const board=el('div','board');(C.stages||[]).forEach((st,i)=>{const c=el('div','card stage'+(st.cap?' cap':''));c.append(el('span','no',two(i)));
  if(st.img){const shot=el('div','shot');shot.append(img(st.img,st.name));c.append(shot);}
  c.append(el('h3',null,st.name));
  if(st.doing){const b=el('div','box');b.append(el('b',null,'플레이어가 하는 일'),document.createTextNode(st.doing));c.append(b);}
  if(st.uses?.length){const b=el('div','box');b.append(el('b',null,'쓰이는 구성품'));const ch=el('div','chips');st.uses.forEach(id=>ch.append(partChip(id)));b.append(ch);c.append(b);}
  if(st.intent){const b=el('div','box intent');b.append(el('b',null,'노림수'),document.createTextNode(st.intent));c.append(b);}
  if(st.expect){const b=el('div','box');b.append(el('b',null,'예상되는 말 · 심리전'),document.createTextNode(st.expect));c.append(b);}
  board.append(c);});
 s.append(board);}

// 7) 구성품
{const s=sections.parts;intro(s,C.partsIntro||'게임에 들어가는 구성품입니다. 각 구성품이 드러내는 정보와 노림수, 실제 제작 방식과 원가를 함께 적었습니다.');
 const list=el('div','partlist');for(const p of C.parts||[]){const c=el('div','card part');const pic=el('div','pic');pic.append(img(p.img,p.title));const body=el('div');const top=el('div','top'),t=el('strong');t.append(el('span','tag t-part',p.id),document.createTextNode(p.title));top.append(t,el('span','mute',p.count));
  body.append(top,el('div','sub',p.use),el('div','shows','→ '+(p.shows||'')),el('div','made-line',p.made||''));c.append(pic,body);c.onclick=()=>showPart(p.id);list.append(c);}
 s.append(list);if(C.cost){const n=el('div','card note');n.style.marginTop='16px';n.append(el('h3',null,'세트 원가'),el('p',null,C.cost));s.append(n);}}

// 8) 기획 로드맵: 단계 흐름 + 날짜별 기록
{const s=sections.roadmap;intro(s,'아이디어에서 실물, 체험, 판매까지 어디쯤 와 있는지 보여 줍니다. 초록은 완료, 금색은 진행 중, 회색은 앞으로 할 일입니다.');
 const road=el('div','phases');(C.phases||[]).forEach((p,i)=>{const c=el('div','card phase st-'+p.state);c.append(el('span','pno',two(i)),el('span','pstate',STATE[p.state]||''),el('h3',null,p.name));const ul=el('ul','clean');p.items.forEach(t=>ul.append(el('li',null,t)));c.append(ul);road.append(c);});
 s.append(road);if(C.log?.length){heading(s,'날짜별 기록');const t=el('table','tl');
 for(const [time,what,area,future,photo] of C.log||[]){const tr=el('tr',future?'future':'');const w=el('td',null,what);if(photo){const a=el('a','log-photo');a.href='그림/'+photo;a.target='_blank';a.title='크게 보기';a.append(img(photo,what));w.append(a);}tr.append(el('td',null,time),w,el('td','who',area||''));t.append(tr);}
 const card=el('div','card');card.append(t);s.append(card);}}

// 휴대폰에서는 표를 줄마다 카드로 쌓아 보여 주므로, 칸마다 머리글 이름을 달아 둠
const LOG_HEAD=['날짜','한 일','분야'];
for(const t of document.querySelectorAll('main table')){const rows=[...t.rows];const ths=rows[0]?.querySelectorAll('th');const head=ths?.length?[...ths].map(x=>x.textContent):t.classList.contains('tl')?LOG_HEAD:[];
 t.classList.add('stack');for(const r of rows)[...r.cells].forEach((c,i)=>{if(c.tagName==='TD'&&head[i])c.dataset.label=head[i];});}
// 글 다듬기 (관계 맵 그림 속 글자는 건드리지 않음)
// 1) 여러 문장이 한 덩어리면 마침표 뒤에서 줄바꿈  2) 생산진행도 숫자에 진영 색: −는 조선 남색, +는 일본 빨강, 0은 중립 금색
{const SIGN=/\((?:[−-]|\+)\)|(?<![\w가-힣−+-])[−+-]\d+(?:~[−+]\d+)?|(?<![\w.~가-힣])0(?![\w.%~])/g;
 const w=document.createTreeWalker(main,NodeFilter.SHOW_TEXT),nodes=[];let n;while(n=w.nextNode())if(!n.parentElement.closest('svg,script,style,.wv,.gl-road,.gl-win,.gl-tag'))nodes.push(n);
 for(const t of nodes){if(/[.?!] +(?=\S)|\n/.test(t.data)){t.data=t.data.replace(/([.?!]) +(?=\S)/g,'$1\n');t.parentElement.classList.add('lines');}
  SIGN.lastIndex=0;if(!SIGN.test(t.data))continue;SIGN.lastIndex=0;const f=document.createDocumentFragment();let last=0,m;
  while(m=SIGN.exec(t.data)){f.append(t.data.slice(last,m.index));const s=m[0];f.append(el('b','num '+(s.includes('~')?'n-r':/[−-]/.test(s)?'n-m':s.includes('+')?'n-p':'n-z'),s));last=m.index+s.length;}
  f.append(t.data.slice(last));t.replaceWith(f);}}
blank();show(SHOWN.includes(location.hash.slice(1))?location.hash.slice(1):'overview');
})();
