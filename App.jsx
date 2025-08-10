import React, { useMemo, useRef, useState, useEffect } from "react";

/**
 * Plate Carrier Builder – v3 (single-file React)
 * Features: full built-in catalog, filters, front/back, colorways (faux Multicam),
 * drag with momentum, export/import loadouts, export SVG.
 */

const COLORS = [
  { id: "ranger", name: "Ranger Green", hex: "#556b2f" },
  { id: "coyote", name: "Coyote Brown", hex: "#87613e" },
  { id: "black", name: "Black", hex: "#222" },
  { id: "wolf", name: "Wolf Grey", hex: "#5c6370" },
  { id: "mc", name: "Multicam", pattern: "mc" },
  { id: "mcb", name: "Multicam Black", pattern: "mcb" }
];

const CARRIERS = [
  { id: "slick", name: "Slick Plate Carrier", cols: 12, rows: 10 },
  { id: "avs", name: "AVS-style Rig", cols: 12, rows: 12 },
  { id: "jpc", name: "JPC-style", cols: 10, rows: 10 }
];

const BUILTIN_CATALOG = [
  {"id":"placard3","name":"Placard 3-cell 5.56","brand":"Spiritus-type","model":"Mk4","cat":"magazine","w":6,"h":3,"weight":0.45,"side":"front"},
  {"id":"placard4","name":"Placard 4-cell 5.56","brand":"Ferro-type","model":"Quad","cat":"magazine","w":8,"h":3,"weight":0.6,"side":"front"},
  {"id":"mag3","name":"Triple 5.56 Open","brand":"Kydex-type","model":"OpenTop","cat":"magazine","w":6,"h":3,"weight":0.55,"side":"front"},
  {"id":"mag2","name":"Double 5.56 Shingle","brand":"Elastic-type","model":"Ten-Speed","cat":"magazine","w":4,"h":3,"weight":0.35,"side":"front"},
  {"id":"mag762d","name":"Double 7.62","brand":"HSGI-type","model":"Rifle TACO","cat":"dmr/762","w":4,"h":4,"weight":0.6,"side":"front"},
  {"id":"mag308t","name":".308 Triple","brand":"Elastic-type","model":"3x SR-25","cat":"dmr/762","w":6,"h":4,"weight":0.8,"side":"front"},
  {"id":"shotcard","name":"Shotgun Card 6rd","brand":"Velcro-type","model":"6rnd","cat":"shotgun","w":3,"h":2,"weight":0.12,"side":"front"},
  {"id":"pistol2","name":"Double Pistol","brand":"HSGI-type","model":"Pistol TACO","cat":"pistol","w":2,"h":2,"weight":0.15,"side":"front"},
  {"id":"pistol3","name":"Triple Pistol","brand":"Elastic-type","model":"Elastic 3x","cat":"pistol","w":3,"h":2,"weight":0.2,"side":"front"},
  {"id":"40mm2","name":"40mm Dual","brand":"USGI-type","model":"M203","cat":"grenade/40mm","w":3,"h":3,"weight":0.22,"side":"front"},
  {"id":"frag2","name":"Frag Dual","brand":"USGI-type","model":"M67","cat":"grenade/40mm","w":4,"h":3,"weight":0.28,"side":"front"},
  {"id":"smoke1","name":"Smoke Can","brand":"Utility-type","model":"Smoke","cat":"smoke/flash","w":2,"h":3,"weight":0.2,"side":"front"},
  {"id":"flash2","name":"Flashbang Twin","brand":"Utility-type","model":"FB","cat":"smoke/flash","w":3,"h":2,"weight":0.18,"side":"front"},
  {"id":"adminsm","name":"Admin/Map Small","brand":"TT-type","model":"Admin S","cat":"admin/map","w":3,"h":2,"weight":0.15,"side":"front"},
  {"id":"adminlg","name":"Admin/Map Large","brand":"TT-type","model":"Admin L","cat":"admin/map","w":4,"h":3,"weight":0.22,"side":"front"},
  {"id":"atak","name":"ATAK/Phone Chest","brand":"Velcro-type","model":"Flip-Down","cat":"ataK/terminal","w":3,"h":3,"weight":0.2,"side":"front"},
  {"id":"tablet","name":"Tablet/Terminal","brand":"Clamshell-type","model":"8in","cat":"ataK/terminal","w":5,"h":4,"weight":0.4,"side":"front"},
  {"id":"radio","name":"Radio Pouch PRC/MBITR","brand":"Trellis-type","model":"MBITR","cat":"radio","w":2,"h":4,"weight":0.3,"side":"front"},
  {"id":"radioTall","name":"Radio Tall (152/163)","brand":"Trellis-type","model":"Tall","cat":"radio","w":2,"h":5,"weight":0.34,"side":"front"},
  {"id":"ptt","name":"PTT Dock","brand":"PTT-type","model":"Inline","cat":"nav/comms","w":1,"h":1,"weight":0.05,"side":"front"},
  {"id":"cablemgmt","name":"Cable Keeper","brand":"Elastic","model":"Loop","cat":"nav/comms","w":1,"h":1,"weight":0.02,"side":"front"},
  {"id":"ifak","name":"IFAK Compact","brand":"NorthAm-type","model":"Compact","cat":"ifak/med","w":3,"h":3,"weight":0.4,"side":"front"},
  {"id":"ifakrip","name":"IFAK Rip-Away","brand":"Med-type","model":"Rip","cat":"ifak/med","w":4,"h":3,"weight":0.5,"side":"front"},
  {"id":"tq","name":"Tourniquet Holder","brand":"Elastic","model":"TQ","cat":"ifak/med","w":1,"h":2,"weight":0.06,"side":"front"},
  {"id":"shears","name":"Trauma Shears","brand":"Elastic","model":"Shears","cat":"ifak/med","w":1,"h":2,"weight":0.05,"side":"front"},
  {"id":"gpsm","name":"GP Pouch Small","brand":"Crye-type","model":"GP SM","cat":"utility/gp","w":3,"h":3,"weight":0.25,"side":"front"},
  {"id":"gpm","name":"GP Pouch Medium","brand":"Crye-type","model":"GP MD","cat":"utility/gp","w":4,"h":3,"weight":0.35,"side":"front"},
  {"id":"gpl","name":"GP Pouch Large","brand":"Crye-type","model":"GP LG","cat":"utility/gp","w":4,"h":4,"weight":0.5,"side":"front"},
  {"id":"dump","name":"Dump Pouch Roll-Up","brand":"Roll-type","model":"Roll","cat":"dump","w":3,"h":2,"weight":0.2,"side":"front"},
  {"id":"dumpXL","name":"Dump Pouch XL","brand":"Roll-type","model":"Big","cat":"dump","w":4,"h":3,"weight":0.28,"side":"front"},
  {"id":"hydro","name":"Hydration 1.5L","brand":"Source-type","model":"Slim","cat":"hydration","w":6,"h":8,"weight":0.5,"side":"back"},
  {"id":"hydro3","name":"Hydration 3L","brand":"Source-type","model":"Wide","cat":"hydration","w":6,"h":10,"weight":0.7,"side":"back"},
  {"id":"zipongp","name":"Zip-On GP Back","brand":"ZipBack-type","model":"GP","cat":"zip-on back","w":8,"h":10,"weight":0.8,"side":"back"},
  {"id":"ziponbreach","name":"Zip-On Breacher Back","brand":"ZipBack-type","model":"Breach","cat":"zip-on back","w":8,"h":10,"weight":0.9,"side":"back"},
  {"id":"buttpack","name":"Buttpack","brand":"USGI-type","model":"Molle","cat":"buttpack","w":8,"h":4,"weight":0.6,"side":"back"},
  {"id":"boltcut","name":"Bolt Cutter Sleeve","brand":"Sleeve","model":"Bolt","cat":"breach","w":2,"h":8,"weight":0.4,"side":"back"},
  {"id":"ramstrap","name":"Battering Ram Straps","brand":"Strap","model":"Ram","cat":"breach","w":6,"h":2,"weight":0.35,"side":"back"},
  {"id":"cuff","name":"Flexcuff Keeper","brand":"Keeper","model":"Cuff","cat":"handcuff/restraint","w":2,"h":1,"weight":0.06,"side":"front"},
  {"id":"handcuffCase","name":"Handcuff Case","brand":"Duty-type","model":"Std","cat":"handcuff/restraint","w":2,"h":2,"weight":0.18,"side":"front"},
  {"id":"irstrobe","name":"IR Strobe Pouch","brand":"Signal-type","model":"IR","cat":"signal/ir","w":2,"h":2,"weight":0.1,"side":"front"},
  {"id":"chemlight","name":"Chemlight Loops 6x","brand":"Elastic","model":"Chem","cat":"chem","w":3,"h":1,"weight":0.04,"side":"front"},
  {"id":"flag","name":"Flag Patch Velcro","brand":"ID","model":"Patch","cat":"id/patch","w":2,"h":1,"weight":0.01,"side":"front"},
  {"id":"nametape","name":"Name Tape","brand":"ID","model":"Tape","cat":"id/patch","w":3,"h":1,"weight":0.01,"side":"front"},
  {"id":"sideplate","name":"Side Plate Pocket","brand":"Armor-type","model":"6x6/6x8","cat":"side-plate","w":3,"h":3,"weight":0.3,"side":"front"},
  {"id":"shoulder","name":"Shoulder Pad Pair","brand":"Comfort","model":"Pad","cat":"shoulder","w":3,"h":1,"weight":0.12,"side":"front"},
  {"id":"cumgp","name":"Cummerbund GP","brand":"Elastic","model":"CB GP","cat":"cummerbund","w":3,"h":2,"weight":0.2,"side":"front"},
  {"id":"battyAA","name":"Battery Pouch AA/AAA","brand":"Power","model":"AA","cat":"battery","w":2,"h":2,"weight":0.08,"side":"front"},
  {"id":"battyBB","name":"Battery Pouch BB2590","brand":"Power","model":"BB","cat":"battery","w":3,"h":3,"weight":0.22,"side":"back"},
  {"id":"note","name":"Notebook/Marker","brand":"Admin","model":"Rite-in-Rain","cat":"admin/map","w":2,"h":2,"weight":0.1,"side":"front"},
  {"id":"strobe","name":"Visible Strobe","brand":"Signal-type","model":"Vis","cat":"signal/ir","w":2,"h":2,"weight":0.1,"side":"front"},
  {"id":"utilityTall","name":"Utility Tall","brand":"PlatA-type","model":"Tall Zip","cat":"utility/gp","w":3,"h":5,"weight":0.45,"side":"front"}
];

function colorToFill(colorId) {
  const c = COLORS.find(c => c.id === colorId);
  if (!c) return "#444";
  if (c.pattern === "mc") return "url(#pat-mc)";
  if (c.pattern === "mcb") return "url(#pat-mcb)";
  return c.hex;
}

export default function App() {
  const [carrierId, setCarrierId] = useState("slick");
  const [colorId, setColorId] = useState("ranger");
  const [view, setView] = useState("front");
  const [items, setItems] = useState([]);
  const [catalog, setCatalog] = useState(BUILTIN_CATALOG);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedUid, setSelectedUid] = useState(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [momentum, setMomentum] = useState(true);
  const [friction, setFriction] = useState(0.92);

  const carrier = CARRIERS.find(c => c.id === carrierId);
  const cols = carrier.cols;
  const rows = carrier.rows;
  const svgRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === 'f') setMomentum(m=>!m);
      if (!selectedUid) return;
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
        e.preventDefault();
        setItems(prev => prev.map(it => it.uid===selectedUid ? {
          ...it,
          y: clamp(it.y + (e.key==='ArrowDown'?1:e.key==='ArrowUp'?-1:0), 0, rows - it.h),
          x: clamp(it.x + (e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0), 0, cols - it.w),
        } : it));
      } else if (e.key.toLowerCase()==='r') {
        e.preventDefault();
        rotateSelected();
      } else if (e.key==='Delete' || e.key==='Backspace') {
        e.preventDefault();
        removeSelected();
      }
    };
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  }, [selectedUid, rows, cols]);

  const drag = useRef({ active:null, lastT:0, lastX:0, lastY:0, vx:0, vy:0 });
  const rafRef = useRef(null);

  function startInertia(uid){
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(function step(){
      setItems(prev => {
        const it = prev.find(p=>p.uid===uid);
        if (!it || !momentum) return prev;
        let { vx=0, vy=0, x, y, w, h } = it;
        vx *= friction; vy *= friction;
        if (Math.abs(vx)<0.01 && Math.abs(vy)<0.01)
          return prev.map(p=>p.uid===uid?{...p, vx:0, vy:0}:p);
        const nx = clamp(Math.round(x + vx), 0, cols - w);
        const ny = clamp(Math.round(y + vy), 0, rows - h);
        return prev.map(p=>p.uid===uid?{...p, x:nx, y:ny, vx, vy}:p);
      });
      rafRef.current = requestAnimationFrame(step);
    });
  }

  function onItemPointerDown(e, uid){
    e.stopPropagation();
    const pt = getSvgPoint(e);
    drag.current = { active: uid, lastT: performance.now(), lastX: pt.x, lastY: pt.y, vx:0, vy:0 };
    svgRef.current?.setPointerCapture?.(e.pointerId);
    setSelectedUid(uid);
  }
  function onSvgPointerMove(e){
    const s = drag.current; if (!s.active) return;
    const pt = getSvgPoint(e);
    const dt = Math.max(1, performance.now()-s.lastT);
    const dx = pt.x - s.lastX; const dy = pt.y - s.lastY;
    s.vx = dx/dt; s.vy = dy/dt; s.lastX = pt.x; s.lastY = pt.y; s.lastT = performance.now();
    const { cx, cy } = svgPointToCell(pt.x, pt.y);
    setItems(prev => prev.map(p => p.uid===s.active ? { ...p, x: clamp(cx,0,cols-p.w), y: clamp(cy,0,rows-p.h) } : p));
  }
  function onSvgPointerUp(){
    const s = drag.current; if (!s.active) return;
    const uid = s.active;
    const cellVx = s.vx * (1/24) * 16;
    const cellVy = s.vy * (1/24) * 16;
    drag.current = { active:null, lastT:0, lastX:0, lastY:0, vx:0, vy:0 };
    setItems(prev => prev.map(p => p.uid===uid ? { ...p, vx:cellVx, vy:cellVy } : p));
    if (momentum) startInertia(uid);
  }

  const PADDING = 16; const CELL = 24;
  const GRID_W = cols * CELL; const GRID_H = rows * CELL;
  const SVG_W = GRID_W + PADDING*2; const SVG_H = GRID_H + PADDING*2;

  function getSvgPoint(evt){
    const svg = svgRef.current; const pt = svg.createSVGPoint();
    pt.x = evt.clientX; pt.y = evt.clientY; const ctm = svg.getScreenCTM();
    return pt.matrixTransform(ctm.inverse());
  }
  function svgPointToCell(x,y){
    return { cx: Math.floor((x-PADDING)/CELL), cy: Math.floor((y-PADDING)/CELL) };
  }

  const categories = useMemo(()=> ["all", ...Array.from(new Set(catalog.map(c=>c.cat)))], [catalog]);

  const filteredCatalog = useMemo(() => {
    return catalog
      .filter(c => c.side === view)
      .filter(c => catFilter === 'all' ? true : c.cat === catFilter)
      .filter(c => (c.name+" "+c.brand+" "+c.model).toLowerCase().includes(search.toLowerCase()));
  }, [catalog, search, view, catFilter]);

  function addAt(cx, cy){
    if (!selectedTool) return;
    const def = catalog.find(c=>c.id===selectedTool);
    if (!def) return;
    const x = clamp(cx, 0, cols - def.w);
    const y = clamp(cy, 0, rows - def.h);
    const newItem = { uid: gid(), ...def, x, y, side: view, rot: 0, vx:0, vy:0 };
    setItems(prev => [...prev, newItem]);
    setSelectedUid(newItem.uid);
  }
  function rotateSelected(){
    setItems(prev => prev.map(it => {
      if (it.uid !== selectedUid) return it;
      const newW = it.h, newH = it.w;
      return { ...it, w: newW, h: newH, x: clamp(it.x, 0, cols - newW), y: clamp(it.y, 0, rows - newH), rot: (it.rot+90)%360 };
    }));
  }
  function removeSelected(){
    setItems(prev => prev.filter(it => it.uid !== selectedUid));
    setSelectedUid(null);
  }
  function clearSide(){
    setItems(prev => prev.filter(it => it.side !== view));
    setSelectedUid(null);
  }

  function saveLocal(){ localStorage.setItem('pcb_state_v3', JSON.stringify({ carrierId, colorId, items, catalog })); }
  function loadLocal(){ try{ const s = JSON.parse(localStorage.getItem('pcb_state_v3')||'{}');
    if (s.carrierId) setCarrierId(s.carrierId); if (s.colorId) setColorId(s.colorId); if (Array.isArray(s.items)) setItems(s.items);
    if (Array.isArray(s.catalog)) setCatalog(s.catalog);
  } catch{} }
  function exportLoadout(){ downloadBlob(JSON.stringify({ carrierId, colorId, items }, null, 2), 'plate-loadout.json', 'application/json'); }
  function importLoadout(file){ const r=new FileReader(); r.onload=()=>{ try{ const s=JSON.parse(r.result); if(s.carrierId) setCarrierId(s.carrierId); if(s.colorId) setColorId(s.colorId); if(Array.isArray(s.items)) setItems(s.items);}catch{alert('Invalid loadout JSON');} }; r.readAsText(file); }
  function importCatalog(file){ const r=new FileReader(); r.onload=()=>{ try{ const arr=JSON.parse(r.result); if(Array.isArray(arr)) setCatalog(arr); else alert('Catalog JSON must be an array'); }catch{alert('Invalid catalog JSON');} }; r.readAsText(file); }
  function exportSVG(){ const svgEl = svgRef.current; const clone = svgEl.cloneNode(true); clone.querySelectorAll('[data-sel="1"]').forEach(n=>n.setAttribute('data-sel','0'));
    const blob = new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n` + clone.outerHTML], { type: 'image/svg+xml' }); downloadBlob(blob, 'plate-view.svg', 'image/svg+xml'); }
  function downloadBlob(data, filename, type){ const blob = data instanceof Blob ? data : new Blob([data], {type}); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url); }

  const sideItems = items.filter(it => it.side === view);
  const totalWeight = sideItems.reduce((s,it)=> s + (it.weight||0), 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100" onPointerUp={onSvgPointerUp}>
      <header className="p-3 border-b border-neutral-800 flex flex-wrap gap-2 items-center">
        <div className="font-bold text-lg">Plate Carrier Builder</div>
        <select className="bg-neutral-900 rounded px-2 py-1" value={carrierId} onChange={e=>setCarrierId(e.target.value)}>{CARRIERS.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <select className="bg-neutral-900 rounded px-2 py-1" value={colorId} onChange={e=>setColorId(e.target.value)}>{COLORS.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <div className="flex gap-1 bg-neutral-900 rounded overflow-hidden">
          <button onClick={()=>setView('front')} className={`px-3 py-1 ${view==='front'?'bg-neutral-800':''}`}>Front</button>
          <button onClick={()=>setView('back')} className={`px-3 py-1 ${view==='back'?'bg-neutral-800':''}`}>Back</button>
        </div>
        <select className="bg-neutral-900 rounded px-2 py-1" value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
          {categories.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
        <input className="bg-neutral-900 rounded px-2 py-1" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name/brand/model" />
        <div className="ml-auto flex gap-2">
          <button className="px-3 py-1 rounded bg-neutral-800" onClick={saveLocal}>Save</button>
          <button className="px-3 py-1 rounded bg-neutral-800" onClick={loadLocal}>Load</button>
          <button className="px-3 py-1 rounded bg-neutral-800" onClick={exportLoadout}>Export Loadout</button>
          <label className="px-3 py-1 rounded bg-neutral-800 cursor-pointer">Import Loadout<input type="file" accept="application/json" className="hidden" onChange={(e)=> e.target.files?.[0] && importLoadout(e.target.files[0])} /></label>
          <label className="px-3 py-1 rounded bg-neutral-800 cursor-pointer">Import Catalog<input type="file" accept="application/json" className="hidden" onChange={(e)=> e.target.files?.[0] && importCatalog(e.target.files[0])} /></label>
          <button className="px-3 py-1 rounded bg-neutral-800" onClick={exportSVG}>Export SVG</button>
        </div>
      </header>

      <div className="grid grid-cols-12">
        <aside className="col-span-3 p-3 border-r border-neutral-800 space-y-2">
          <div className="text-sm opacity-70">Showing {filteredCatalog.length} components for <b>{view}</b>. Total side: <b>{totalWeight.toFixed(2)} kg</b></div>
          <div className="grid grid-cols-2 gap-2">
            {filteredCatalog.map(c => (
              <button key={c.id} onClick={()=>setSelectedTool(c.id)} className={`text-left p-2 rounded border ${selectedTool===c.id?'border-emerald-400':'border-neutral-800'} bg-neutral-900 hover:bg-neutral-800`} title={`${c.w}x${c.h}`}>
                <div className="font-medium text-sm">{c.name}</div>
                <div className="text-xs opacity-70">{c.brand} • {c.model}</div>
                <div className="text-xs opacity-70">{c.cat} • {c.w}×{c.h} • ~{(c.weight||0).toFixed(2)}kg</div>
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-neutral-800 text-xs space-y-2">
            <label className="flex items-center gap-2"><input type="checkbox" checked={momentum} onChange={e=>setMomentum(e.target.checked)} /> Momentum drag (F)</label>
            <label>Friction <input type="range" min="0.7" max="0.99" step="0.01" value={friction} onChange={e=>setFriction(parseFloat(e.target.value))} className="w-full" /></label>
          </div>
        </aside>

        <main className="col-span-6 flex justify-center items-center p-4">
          <svg ref={svgRef} width={SVG_W} height={SVG_H} className="bg-neutral-900 rounded-2xl shadow-inner cursor-crosshair select-none" onPointerMove={onSvgPointerMove} onClick={(e)=>{
            const rect = svgRef.current.getBoundingClientRect();
            const cx = Math.floor((e.clientX - rect.left - 16)/24);
            const cy = Math.floor((e.clientY - rect.top - 16)/24);
            if (cx>=0 && cy>=0 && cx<cols && cy<rows) addAt(cx, cy);
          }}>
            {patternFillDefs()}
            <rect x={16} y={16} width={GRID_W} height={GRID_H} rx={16} fill={colorToFill(colorId)} stroke="#111" />
            <g opacity={0.25}>
              {Array.from({length: rows+1}).map((_,r)=>(<line key={"r"+r} x1={16} y1={16+r*24} x2={16+GRID_W} y2={16+r*24} stroke="#000" />))}
              {Array.from({length: cols+1}).map((_,c)=>(<line key={"c"+c} x1={16+c*24} y1={16} x2={16+c*24} y2={16+GRID_H} stroke="#000" />))}
            </g>
            {items.filter(it => it.side === view).map(it => (
              <g key={it.uid} data-sel={selectedUid===it.uid?"1":"0"} style={{cursor:'grab'}} onPointerDown={(e)=> onItemPointerDown(e, it.uid)}>
                <rect x={16+it.x*24} y={16+it.y*24} width={it.w*24} height={it.h*24} rx={6} fill="#1f2937" stroke={selectedUid===it.uid?"#10b981":"#111"} strokeWidth={selectedUid===it.uid?2:1} />
                <text x={16+it.x*24+6} y={16+it.y*24+16} fontSize={12} fill="#e5e7eb">{it.name}</text>
                <text x={16+it.x*24+6} y={16+it.y*24+30} fontSize={11} fill="#9ca3af">{it.brand} • {it.model}</text>
                <text x={16+it.x*24+6} y={16+it.y*24+44} fontSize={11} fill="#9ca3af">{it.w}×{it.h}</text>
              </g>
            ))}
          </svg>
        </main>

        <aside className="col-span-3 p-3 border-l border-neutral-800 space-y-3">
          <div className="text-lg font-semibold">Inspector</div>
          {selectedUid ? (
            <SelectedInspector
              key={selectedUid}
              item={items.find(i=>i.uid===selectedUid)}
              onRotate={rotateSelected}
              onRemove={removeSelected}
              onChange={(patch)=> setItems(prev=> prev.map(i=> i.uid===selectedUid?{...i, ...patch}:i))}
              cols={cols}
              rows={rows}
            />
          ) : <div className="text-sm opacity-70">Select an item to edit its position, size, or rotation.</div>}

          <div className="pt-2 border-t border-neutral-800 text-sm opacity-80">Side total est. add-on: <b>{totalWeight.toFixed(2)} kg</b></div>
          <div className="pt-2 border-t border-neutral-800 space-y-2">
            <button className="w-full px-3 py-2 rounded bg-red-900/60 hover:bg-red-800/60" onClick={clearSide}>Clear this side</button>
          </div>
        </aside>
      </div>

      <footer className="px-4 py-3 border-t border-neutral-800 text-xs opacity-70 flex items-center justify-between">
        <div>⚙️ Click grid to place • Drag to move • R = rotate • Delete = remove • Arrows = nudge • F = momentum</div>
        <div>Visualization only; dimensions approximate MOLLE spacing.</div>
      </footer>
    </div>
  );
}

function SelectedInspector({ item, onRotate, onRemove, onChange, cols, rows }){
  if (!item) return null;
  return (
    <div className="space-y-2">
      <div>
        <div className="text-sm opacity-70">Component</div>
        <div className="font-medium">{item.name}</div>
        <div className="text-xs opacity-60">{item.brand} • {item.model}</div>
      </div>
      <div className="grid grid-cols-4 gap-2 text-sm">
        <label className="col-span-2">X<input type="number" min={0} max={cols-item.w} value={item.x} onChange={e=> onChange({ x: clamp(+e.target.value, 0, cols-item.w) })} className="w-full bg-neutral-900 rounded px-2 py-1" /></label>
        <label className="col-span-2">Y<input type="number" min={0} max={rows-item.h} value={item.y} onChange={e=> onChange({ y: clamp(+e.target.value, 0, rows-item.h) })} className="w-full bg-neutral-900 rounded px-2 py-1" /></label>
        <label className="col-span-2">W<input type="number" min={1} max={cols} value={item.w} onChange={e=> onChange({ w: clamp(+e.target.value, 1, cols) })} className="w-full bg-neutral-900 rounded px-2 py-1" /></label>
        <label className="col-span-2">H<input type="number" min={1} max={rows} value={item.h} onChange={e=> onChange({ h: clamp(+e.target.value, 1, rows) })} className="w-full bg-neutral-900 rounded px-2 py-1" /></label>
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-2 rounded bg-neutral-800 hover:bg-neutral-700" onClick={onRotate}>Rotate (R)</button>
        <button className="px-3 py-2 rounded bg-red-800 hover:bg-red-700" onClick={onRemove}>Remove (Del)</button>
      </div>
    </div>
  );
}

function patternFillDefs(){
  return (
    <defs>
      <pattern id="pat-mc" patternUnits="userSpaceOnUse" width="40" height="40">
        <rect width="40" height="40" fill="#7a7f52" />
        <circle cx="10" cy="10" r="8" fill="#9aa06a" opacity="0.8" />
        <ellipse cx="28" cy="22" rx="10" ry="6" fill="#5e613f" opacity="0.7" />
        <ellipse cx="20" cy="32" rx="12" ry="6" fill="#a6a98a" opacity="0.6" />
      </pattern>
      <pattern id="pat-mcb" patternUnits="userSpaceOnUse" width="40" height="40">
        <rect width="40" height="40" fill="#1f2326" />
        <circle cx="12" cy="12" r="9" fill="#2b3136" opacity="0.8" />
        <ellipse cx="26" cy="26" rx="12" ry="7" fill="#15181b" opacity="0.7" />
        <ellipse cx="20" cy="34" rx="12" ry="6" fill="#33383e" opacity="0.5" />
      </pattern>
    </defs>
  );
}

function gid(){ return Math.random().toString(36).slice(2, 9); }
function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
