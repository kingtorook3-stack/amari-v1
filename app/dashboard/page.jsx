'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

function TrustBanner() {
  return (
    <div style={{background:'linear-gradient(90deg,#0E6B6B,#0A5252)',padding:'10px 24px',display:'flex',alignItems:'center',justifyContent:'center',gap:12}}>
      <div style={{width:8,height:8,borderRadius:'50%',background:'#4ADE80',boxShadow:'0 0 8px rgba(74,222,128,0.6)',animation:'pulse 2s infinite'}} />
      <span style={{fontSize:13,color:'rgba(255,255,255,0.9)',letterSpacing:0.8}}>
        <strong style={{color:'#fff'}}>Amari AI</strong> — You control what is shared. Every access is logged. Nothing leaves without your permission.
      </span>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  )
}

function Header() {
  return (
    <div style={{background:'#0D1B2A',padding:'16px 32px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <div style={{display:'flex',alignItems:'center',gap:14}}>
        <div style={{width:36,height:36,borderRadius:8,background:'linear-gradient(135deg,#0E6B6B,#1A8A8A)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace',fontSize:16,fontWeight:700,color:'#fff'}}>A</div>
        <div>
          <div style={{fontSize:18,fontWeight:600,color:'#fff',letterSpacing:0.5}}>Amari AI</div>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',letterSpacing:1.5,textTransform:'uppercase'}}>Enterprise Trust Dashboard</div>
        </div>
      </div>
    </div>
  )
}

const NAV = [
  {id:'overview',label:'Overview',icon:'\u25C9'},
  {id:'brands',label:'Brands',icon:'\u25C8'},
  {id:'consumers',label:'Consumers',icon:'\u25CE'},
  {id:'audit',label:'Audit Ledger',icon:'\u25EB'},
]

function Sidebar({active,onChange}) {
  return (
    <div style={{width:220,background:'#0F2133',padding:'24px 0',borderRight:'1px solid rgba(255,255,255,0.06)',display:'flex',flexDirection:'column',gap:4,minHeight:'calc(100vh - 110px)'}}>
      {NAV.map(item=>(
        <button key={item.id} onClick={()=>onChange(item.id)} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 24px',border:'none',cursor:'pointer',background:active===item.id?'rgba(14,107,107,0.15)':'transparent',borderRight:active===item.id?'3px solid #0E6B6B':'3px solid transparent',fontSize:14,color:active===item.id?'#1A8A8A':'rgba(255,255,255,0.45)',fontWeight:active===item.id?600:400}}>
          <span style={{fontSize:16,opacity:active===item.id?1:0.5}}>{item.icon}</span>
          {item.label}
        </button>
      ))}
      <div style={{flex:1}} />
      <div style={{padding:'16px 24px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
        <div style={{fontFamily:'monospace',fontSize:10,color:'rgba(255,255,255,0.2)',letterSpacing:1}}>PATENT PROTECTED</div>
        <div style={{fontSize:10,color:'rgba(255,255,255,0.15)',marginTop:4}}>USP 11,151,254 / USP 11,042,641</div>
      </div>
    </div>
  )
}

function Badge({status}) {
  const s = status==='granted'?{bg:'rgba(26,107,58,0.12)',color:'#1A6B3A',bd:'rgba(26,107,58,0.25)'}:status==='denied'?{bg:'rgba(180,40,40,0.1)',color:'#B42828',bd:'rgba(180,40,40,0.2)'}:{bg:'rgba(180,130,20,0.1)',color:'#B48214',bd:'rgba(180,130,20,0.2)'}
  return <span style={{fontFamily:'monospace',fontSize:10,fontWeight:600,padding:'3px 8px',borderRadius:4,background:s.bg,color:s.color,border:'1px solid '+s.bd}}>{status.toUpperCase()}</span>
}

function Stat({label,value,sub,accent}) {
  return (
    <div style={{background:'#0F2133',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:'20px 24px',flex:1,minWidth:160}}>
      <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:1.5,marginBottom:10}}>{label}</div>
      <div style={{fontFamily:'monospace',fontSize:32,fontWeight:700,color:accent||'#fff',lineHeight:1}}>{value}</div>
      {sub&&<div style={{fontSize:12,color:'rgba(255,255,255,0.3)',marginTop:8}}>{sub}</div>}
    </div>
  )
}

function OverviewPage({brands,consumers,events,bMap,cMap}) {
  const g=events.filter(e=>e.status==='granted').length
  const d=events.filter(e=>e.status==='denied').length
  const f=events.filter(e=>e.status==='flagged').length
  return (
    <div>
      <div style={{marginBottom:28}}>
        <h2 style={{fontSize:24,fontWeight:600,color:'#fff',margin:'0 0 6px'}}>Dashboard Overview</h2>
        <p style={{fontSize:14,color:'rgba(255,255,255,0.4)',margin:0}}>Real-time data sovereignty monitoring across all partner brands</p>
      </div>
      <div style={{display:'flex',gap:16,marginBottom:28,flexWrap:'wrap'}}>
        <Stat label="Active Brands" value={brands.length} accent="#0E6B6B" />
        <Stat label="Protected Consumers" value={consumers.length} accent="#1A8A8A" />
        <Stat label="Access Events" value={events.length} sub={g+' granted / '+d+' denied / '+f+' flagged'} />
        <Stat label="Compliance" value="98%" sub="NIST AI RMF aligned" accent="#1A6B3A" />
      </div>
      <div style={{display:'flex',gap:16,marginBottom:28}}>
        <div style={{flex:2,background:'#0F2133',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:24}}>
          <div style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:1,marginBottom:20}}>Access Distribution</div>
          <div style={{display:'flex',alignItems:'flex-end',gap:4,height:120,marginBottom:12}}>
            {[{label:'Granted',count:g,color:'#1A6B3A'},{label:'Denied',count:d,color:'#B42828'},{label:'Flagged',count:f,color:'#B48214'}].map(item=>(
              <div key={item.label} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                <div style={{fontFamily:'monospace',fontSize:20,fontWeight:700,color:item.color}}>{item.count}</div>
                <div style={{width:'100%',maxWidth:80,height:Math.max((item.count/Math.max(events.length,1))*100,8),background:item.color,borderRadius:'4px 4px 0 0',opacity:0.7}} />
                <div style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{flex:1,background:'#0F2133',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:24}}>
          <div style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:1,marginBottom:16}}>Trust Architecture</div>
          {[['Secure User Profile','Encrypted vaults per user'],['Access Control Manager','Enforcing permissions'],['Immutable Audit Ledger',events.length+' entries logged'],['Kernel Deploy Engine','Certified kernels active']].map(([name,desc])=>(
            <div key={name} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:'#1A6B3A',boxShadow:'0 0 6px rgba(26,107,58,0.4)'}} />
              <div>
                <div style={{fontSize:13,color:'rgba(255,255,255,0.8)'}}>{name}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.3)'}}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:'#0F2133',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:24}}>
        <div style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:1,marginBottom:16}}>Latest Access Events</div>
        {events.slice(0,8).map(ev=>(
          <div key={ev.id} style={{display:'flex',alignItems:'center',gap:16,padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
            <Badge status={ev.status} />
            <div style={{flex:1}}>
              <span style={{fontSize:13,color:'rgba(255,255,255,0.8)'}}>{cMap[ev.consumer_id]||'Consumer'}</span>
              <span style={{fontSize:13,color:'rgba(255,255,255,0.3)'}}> - {ev.data_category}</span>
            </div>
            <span style={{fontSize:12,color:'rgba(255,255,255,0.3)'}}>{bMap[ev.brand_id]||'Brand'}</span>
            <span style={{fontFamily:'monospace',fontSize:11,color:'rgba(255,255,255,0.2)'}}>{ev.accessor_name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function BrandsPage({brands,events,cMap}) {
  const [sel,setSel]=useState(null)
  const bEvents=(id)=>events.filter(e=>e.brand_id===id)
  const bCons=(id)=>new Set(events.filter(e=>e.brand_id===id).map(e=>e.consumer_id)).size
  return (
    <div>
      <h2 style={{fontSize:24,fontWeight:600,color:'#fff',margin:'0 0 6px'}}>Partner Brands</h2>
      <p style={{fontSize:14,color:'rgba(255,255,255,0.4)',margin:'0 0 24px'}}>Organizations authorized to request access to consumer data</p>
      <div style={{display:'grid',gridTemplateColumns:sel!==null?'1fr 1.5fr':'1fr 1fr 1fr',gap:16}}>
        {sel===null?brands.map((b,i)=>(
          <div key={b.id} onClick={()=>setSel(i)} style={{background:'#0F2133',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:28,cursor:'pointer'}}>
            <div style={{width:44,height:44,borderRadius:10,background:'rgba(14,107,107,0.12)',border:'1px solid rgba(14,107,107,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace',fontSize:16,fontWeight:700,color:'#0E6B6B',marginBottom:20}}>{b.name.charAt(0)}</div>
            <div style={{fontSize:17,fontWeight:600,color:'#fff',marginBottom:4}}>{b.name}</div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:20}}>{b.industry}</div>
            <div style={{display:'flex',gap:20}}>
              <div>
                <div style={{fontFamily:'monospace',fontSize:22,fontWeight:700,color:'#0E6B6B'}}>{bCons(b.id)}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.3)'}}>Consumers</div>
              </div>
              <div>
                <div style={{fontFamily:'monospace',fontSize:22,fontWeight:700,color:'rgba(255,255,255,0.7)'}}>{bEvents(b.id).length}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.3)'}}>Events</div>
              </div>
            </div>
          </div>
        )):(
          <>
            <div>
              {brands.map((b,i)=>(
                <div key={b.id} onClick={()=>setSel(i)} style={{padding:'14px 18px',marginBottom:4,borderRadius:8,cursor:'pointer',background:sel===i?'rgba(14,107,107,0.1)':'transparent',border:sel===i?'1px solid rgba(14,107,107,0.2)':'1px solid transparent'}}>
                  <div style={{fontSize:14,fontWeight:sel===i?600:400,color:sel===i?'#1A8A8A':'rgba(255,255,255,0.5)'}}>{b.name}</div>
                </div>
              ))}
              <button onClick={()=>setSel(null)} style={{marginTop:12,padding:'8px 16px',background:'none',border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,color:'rgba(255,255,255,0.4)',fontSize:12,cursor:'pointer'}}>Back to grid</button>
            </div>
            <div style={{background:'#0F2133',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:24}}>
              <div style={{fontSize:20,fontWeight:600,color:'#fff',marginBottom:4}}>{brands[sel].name}</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:20}}>{brands[sel].industry}</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:1,marginBottom:12}}>Recent Access Events</div>
              {bEvents(brands[sel].id).slice(0,8).map(ev=>(
                <div key={ev.id} style={{padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)',display:'flex',alignItems:'center',gap:12}}>
                  <Badge status={ev.status} />
                  <span style={{fontSize:13,color:'rgba(255,255,255,0.7)',flex:1}}>{cMap[ev.consumer_id]} - {ev.data_category}</span>
                  <span style={{fontFamily:'monospace',fontSize:10,color:'rgba(255,255,255,0.2)'}}>{ev.purpose}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function ConsumersPage({consumers,events,bMap}) {
  const [sel,setSel]=useState(null)
  const cEv=(id)=>events.filter(e=>e.consumer_id===id)
  const cBr=(id)=>[...new Set(events.filter(e=>e.consumer_id===id).map(e=>bMap[e.brand_id]))].filter(Boolean)
  return (
    <div>
      <h2 style={{fontSize:24,fontWeight:600,color:'#fff',margin:'0 0 6px'}}>Protected Consumers</h2>
      <p style={{fontSize:14,color:'rgba(255,255,255,0.4)',margin:'0 0 24px'}}>Data sovereignty enforced at the infrastructure level</p>
      <div style={{display:'grid',gridTemplateColumns:sel!==null?'1fr 1.5fr':'1fr',gap:16}}>
        <div>
          {consumers.map((c,i)=>(
            <div key={c.id} onClick={()=>setSel(sel===i?null:i)} style={{display:'flex',alignItems:'center',gap:16,padding:'16px 20px',marginBottom:4,background:sel===i?'rgba(14,107,107,0.08)':'#0F2133',border:sel===i?'1px solid rgba(14,107,107,0.2)':'1px solid rgba(255,255,255,0.06)',borderRadius:8,cursor:'pointer'}}>
              <div style={{width:40,height:40,borderRadius:'50%',background:'rgba(14,107,107,0.12)',border:'1px solid rgba(14,107,107,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:600,color:'#0E6B6B'}}>{c.first_name?c.first_name.charAt(0):'?'}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:500,color:'rgba(255,255,255,0.85)'}}>{c.first_name}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.3)'}}>{cBr(c.id).length} brands / {cEv(c.id).length} events</div>
              </div>
            </div>
          ))}
        </div>
        {sel!==null&&(
          <div style={{background:'#0F2133',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:24}}>
            <div style={{fontSize:20,fontWeight:600,color:'#fff',marginBottom:4}}>{consumers[sel].first_name}</div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.3)',marginBottom:24}}>{consumers[sel].email}</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:1,marginBottom:8}}>Authorized Brands</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:20}}>
              {cBr(consumers[sel].id).map(b=>(
                <span key={b} style={{fontSize:12,padding:'4px 12px',background:'rgba(14,107,107,0.1)',border:'1px solid rgba(14,107,107,0.2)',borderRadius:4,color:'#1A8A8A'}}>{b}</span>
              ))}
            </div>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:1,marginBottom:8}}>Access Log</div>
            {cEv(consumers[sel].id).slice(0,8).map(ev=>(
              <div key={ev.id} style={{padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.04)',display:'flex',alignItems:'center',gap:10}}>
                <Badge status={ev.status} />
                <span style={{fontSize:12,color:'rgba(255,255,255,0.6)',flex:1}}>{bMap[ev.brand_id]} - {ev.data_category}</span>
                <span style={{fontFamily:'monospace',fontSize:10,color:'rgba(255,255,255,0.2)'}}>{ev.purpose}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AuditPage({events,bMap,cMap}) {
  const [filter,setFilter]=useState('all')
  const filtered=filter==='all'?events:events.filter(e=>e.status===filter)
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
        <div>
          <h2 style={{fontSize:24,fontWeight:600,color:'#fff',margin:'0 0 6px'}}>Immutable Audit Ledger</h2>
          <p style={{fontSize:14,color:'rgba(255,255,255,0.4)',margin:0}}>Every access request logged permanently - cannot be edited or deleted</p>
        </div>
        <div style={{display:'flex',gap:4}}>
          {['all','granted','denied','flagged'].map(v=>(
            <button key={v} onClick={()=>setFilter(v)} style={{fontSize:12,padding:'6px 14px',background:filter===v?'rgba(14,107,107,0.15)':'transparent',border:filter===v?'1px solid rgba(14,107,107,0.3)':'1px solid rgba(255,255,255,0.08)',borderRadius:5,color:filter===v?'#1A8A8A':'rgba(255,255,255,0.4)',cursor:'pointer'}}>{v.charAt(0).toUpperCase()+v.slice(1)}{v!=='all'?' ('+events.filter(e=>e.status===v).length+')':''}</button>
          ))}
        </div>
      </div>
      <div style={{background:'#0F2133',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,overflow:'hidden'}}>
        <div style={{display:'grid',gridTemplateColumns:'80px 1fr 120px 160px 1fr 70px',padding:'12px 20px',background:'rgba(255,255,255,0.02)',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
          {['Status','Consumer','Data','Brand','Purpose',''].map(h=>(
            <div key={h} style={{fontSize:10,fontWeight:600,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:1.5}}>{h}</div>
          ))}
        </div>
        {filtered.map(ev=>(
          <div key={ev.id} style={{display:'grid',gridTemplateColumns:'80px 1fr 120px 160px 1fr 70px',padding:'12px 20px',borderBottom:'1px solid rgba(255,255,255,0.03)',alignItems:'center'}}>
            <Badge status={ev.status} />
            <span style={{fontSize:13,color:'rgba(255,255,255,0.8)'}}>{cMap[ev.consumer_id]||'Unknown'}</span>
            <span style={{fontSize:12,color:'rgba(255,255,255,0.5)'}}>{ev.data_category}</span>
            <span style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>{bMap[ev.brand_id]||'Unknown'}</span>
            <span style={{fontSize:12,color:'rgba(255,255,255,0.35)'}}>{ev.purpose}</span>
            <div style={{display:'flex',alignItems:'center',gap:4}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:'#1A6B3A'}} />
              <span style={{fontFamily:'monospace',fontSize:9,color:'rgba(255,255,255,0.2)'}}>verified</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [page,setPage]=useState('overview')
  const [brands,setBrands]=useState([])
  const [consumers,setConsumers]=useState([])
  const [events,setEvents]=useState([])
  const [loading,setLoading]=useState(true)
  const [bMap,setBMap]=useState({})
  const [cMap,setCMap]=useState({})

  useEffect(()=>{
    async function load(){
      try{
        const [br,co,ev]=await Promise.all([
          supabase.from('brands').select('*'),
          supabase.from('consumers').select('*'),
          supabase.from('access_events').select('*').order('accessed_at',{ascending:false}),
        ])
        const b=br.data||[],c=co.data||[],e=ev.data||[]
        setBrands(b);setConsumers(c);setEvents(e)
        const bm={};b.forEach(x=>{bm[x.id]=x.name});setBMap(bm)
        const cm={};c.forEach(x=>{cm[x.id]=x.first_name});setCMap(cm)
      }catch(err){console.error('Load error:',err)}
      setLoading(false)
    }
    load()
  },[])

  if(loading) return (
    <div style={{minHeight:'100vh',background:'#0A1628',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:40,height:40,border:'2px solid rgba(14,107,107,0.3)',borderTop:'2px solid #0E6B6B',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 16px'}} />
        <div style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>Loading trust dashboard...</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  )

  return (
    <div style={{background:'#0A1628',minHeight:'100vh',color:'#fff'}}>
      <TrustBanner />
      <Header />
      <div style={{display:'flex'}}>
        <Sidebar active={page} onChange={setPage} />
        <div style={{flex:1,padding:32,overflowY:'auto'}}>
          {page==='overview'&&<OverviewPage brands={brands} consumers={consumers} events={events} bMap={bMap} cMap={cMap} />}
          {page==='brands'&&<BrandsPage brands={brands} events={events} cMap={cMap} />}
          {page==='consumers'&&<ConsumersPage consumers={consumers} events={events} bMap={bMap} />}
          {page==='audit'&&<AuditPage events={events} bMap={bMap} cMap={cMap} />}
        </div>
      </div>
    </div>
  )
}
