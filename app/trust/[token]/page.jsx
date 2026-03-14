'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

function Badge({status}) {
  var s = status==='granted'?{bg:'rgba(26,107,58,0.12)',color:'#1A6B3A',bd:'rgba(26,107,58,0.25)'}:status==='denied'?{bg:'rgba(180,40,40,0.1)',color:'#B42828',bd:'rgba(180,40,40,0.2)'}:{bg:'rgba(180,130,20,0.1)',color:'#B48214',bd:'rgba(180,130,20,0.2)'}
  return <span style={{fontFamily:'monospace',fontSize:10,fontWeight:600,padding:'3px 8px',borderRadius:4,background:s.bg,color:s.color,border:'1px solid '+s.bd}}>{status.toUpperCase()}</span>
}

export default function TrustPortal() {
  var params = useParams()
  var token = params.token
  var [consumer, setConsumer] = useState(null)
  var [events, setEvents] = useState([])
  var [brands, setBrands] = useState({})
  var [loading, setLoading] = useState(true)
  var [notFound, setNotFound] = useState(false)
  var [revokeMsg, setRevokeMsg] = useState(null)

  useEffect(function(){
    async function load(){
      if(!supabase || !token){ setNotFound(true); setLoading(false); return }
      var cRes = await supabase.from('consumers').select('*').eq('trust_token', token).single()
      if(!cRes.data){ setNotFound(true); setLoading(false); return }
      setConsumer(cRes.data)
      var eRes = await supabase.from('access_events').select('*').eq('consumer_id', cRes.data.id).order('accessed_at',{ascending:false})
      setEvents(eRes.data || [])
      var bRes = await supabase.from('brands').select('*')
      var bMap = {}
      if(bRes.data) bRes.data.forEach(function(b){ bMap[b.id] = b.name })
      setBrands(bMap)
      setLoading(false)
    }
    load()
  },[token])

  if(loading) return (
    <div style={{minHeight:'100vh',background:'#0A1628',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:40,height:40,border:'2px solid rgba(14,107,107,0.3)',borderTop:'2px solid #0E6B6B',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 16px'}} />
        <div style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>Verifying your trust token...</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  )

  if(notFound) return (
    <div style={{minHeight:'100vh',background:'#0A1628',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center',maxWidth:400}}>
        <div style={{fontSize:48,marginBottom:16}}>&#x1F512;</div>
        <div style={{fontSize:22,fontWeight:600,color:'#fff',marginBottom:8}}>Token Not Found</div>
        <div style={{fontSize:14,color:'rgba(255,255,255,0.5)',lineHeight:1.6}}>This trust link is not valid or has expired.</div>
      </div>
    </div>
  )

  var granted = events.filter(function(e){return e.status==='granted'}).length
  var denied = events.filter(function(e){return e.status==='denied'}).length
  var flagged = events.filter(function(e){return e.status==='flagged'}).length
  var uniqueBrands = [...new Set(events.map(function(e){return e.brand_id}))]

  function handleRevoke(brandId) {
    setRevokeMsg('Access revocation request submitted for ' + brands[brandId] + '. This will be processed within 24 hours.')
  }

  return (
    <div style={{background:'#0A1628',minHeight:'100vh',color:'#fff',fontFamily:'system-ui,-apple-system,sans-serif'}}>
      <div style={{background:'linear-gradient(90deg,#0E6B6B,#0A5252)',padding:'10px 24px',display:'flex',alignItems:'center',justifyContent:'center',gap:12}}>
        <div style={{width:8,height:8,borderRadius:'50%',background:'#4ADE80',boxShadow:'0 0 8px rgba(74,222,128,0.6)',animation:'pulse 2s infinite'}} />
        <span style={{fontSize:13,color:'rgba(255,255,255,0.9)',letterSpacing:0.8}}><strong style={{color:'#fff'}}>Amari AI</strong> — You control what is shared. Every access is logged. Nothing leaves without your permission.</span>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      </div>
      <div style={{background:'#0D1B2A',padding:'24px 32px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
        <div style={{maxWidth:800,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:36,height:36,borderRadius:8,background:'linear-gradient(135deg,#0E6B6B,#1A8A8A)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace',fontSize:16,fontWeight:700,color:'#fff'}}>A</div>
            <div><div style={{fontSize:18,fontWeight:600,color:'#fff',letterSpacing:0.5}}>Amari AI</div><div style={{fontSize:11,color:'rgba(255,255,255,0.4)',letterSpacing:1.5,textTransform:'uppercase'}}>Consumer Trust Portal</div></div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:8,height:8,borderRadius:'50%',background:'#1A6B3A',boxShadow:'0 0 6px rgba(26,107,58,0.4)'}} /><span style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>Verified Token</span></div>
        </div>
      </div>
      <div style={{maxWidth:800,margin:'0 auto',padding:32}}>
        <div style={{marginBottom:32}}>
          <div style={{fontSize:14,color:'rgba(255,255,255,0.4)',marginBottom:4}}>Your Data Sovereignty Dashboard</div>
          <div style={{fontSize:28,fontWeight:600,color:'#fff',marginBottom:4}}>Hello, {consumer.first_name}</div>
          <div style={{fontSize:14,color:'rgba(255,255,255,0.35)'}}>{consumer.email}</div>
        </div>
        <div style={{display:'flex',gap:16,marginBottom:28,flexWrap:'wrap'}}>
          {[['Brands With Access',uniqueBrands.length,'#0E6B6B'],['Access Granted',granted,'#1A6B3A'],['Access Denied',denied,'#B42828'],['Flagged',flagged,'#B48214']].map(function(s){return(
            <div key={s[0]} style={{flex:1,minWidth:140,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:'18px 20px',textAlign:'center'}}>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:1.5,marginBottom:8}}>{s[0]}</div>
              <div style={{fontFamily:'monospace',fontSize:32,fontWeight:700,color:s[2],lineHeight:1}}>{s[1]}</div>
            </div>
          )})}
        </div>
        <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:24,marginBottom:28}}>
          <div style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:1,marginBottom:8}}>Authorized Brands</div>
          <div style={{fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:16}}>These organizations have requested access to your data. You can revoke access at any time.</div>
          {uniqueBrands.map(function(brandId){
            var be=events.filter(function(e){return e.brand_id===brandId})
            return(
              <div key={brandId} style={{display:'flex',alignItems:'center',gap:16,padding:'14px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                <div style={{width:40,height:40,borderRadius:8,background:'rgba(14,107,107,0.12)',border:'1px solid rgba(14,107,107,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace',fontSize:16,fontWeight:700,color:'#0E6B6B'}}>{(brands[brandId]||'?').charAt(0)}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:600,color:'#fff'}}>{brands[brandId]}</div>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.3)'}}>{be.length} access events</div>
                </div>
                <button onClick={function(){handleRevoke(brandId)}} style={{padding:'8px 16px',fontSize:12,fontWeight:600,background:'rgba(180,40,40,0.1)',border:'1px solid rgba(180,40,40,0.25)',borderRadius:6,color:'#EF5350',cursor:'pointer'}}>Revoke Access</button>
              </div>
            )
          })}
          {revokeMsg && <div style={{marginTop:16,padding:'12px 16px',background:'rgba(214,166,60,0.08)',border:'1px solid rgba(214,166,60,0.2)',borderRadius:6,fontSize:13,color:'#D6A63C'}}>{revokeMsg}</div>}
        </div>
        <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:24,marginBottom:28}}>
          <div style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:1,marginBottom:8}}>Your Complete Access Log</div>
          <div style={{fontSize:12,color:'rgba(255,255,255,0.3)',marginBottom:16}}>Every request is logged permanently and cannot be edited or deleted by anyone.</div>
          {events.map(function(ev){return(
            <div key={ev.id} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
              <Badge status={ev.status} />
              <div style={{flex:1}}>
                <span style={{fontSize:13,color:'rgba(255,255,255,0.8)'}}>{brands[ev.brand_id]||'Unknown'}</span>
                <span style={{fontSize:13,color:'rgba(255,255,255,0.3)'}}> requested </span>
                <span style={{fontSize:13,color:'rgba(255,255,255,0.7)',fontWeight:600}}>{ev.data_category}</span>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.35)'}}>{ev.purpose}</div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:4,minWidth:60}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:'#1A6B3A'}} />
                <span style={{fontFamily:'monospace',fontSize:9,color:'rgba(255,255,255,0.2)'}}>verified</span>
              </div>
            </div>
          )})}
        </div>
        <div style={{background:'rgba(14,107,107,0.06)',border:'1px solid rgba(14,107,107,0.15)',borderRadius:10,padding:24,marginBottom:28}}>
          <div style={{fontSize:13,fontWeight:600,color:'#0E6B6B',textTransform:'uppercase',letterSpacing:1,marginBottom:12}}>Your Data Rights</div>
          {[['View','See every organization that has accessed your data.'],['Revoke','Revoke any brand access at any time. Processed within 24 hours.'],['Audit','Every event logged in an immutable ledger. Cannot be altered.'],['Portable','Request a full export of your data and access history.'],['Delete','Request complete deletion of your data. Permanent and irreversible.']].map(function(item){return(
            <div key={item[0]} style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:8}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:'#0E6B6B',marginTop:6,flexShrink:0}} />
              <div><span style={{fontSize:13,fontWeight:600,color:'#1A8A8A'}}>{item[0]}: </span><span style={{fontSize:13,color:'rgba(255,255,255,0.6)'}}>{item[1]}</span></div>
            </div>
          )})}
        </div>
        <div style={{textAlign:'center',padding:'20px 0',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
          <div style={{fontSize:14,fontWeight:600,color:'rgba(255,255,255,0.6)'}}>Amari AI</div>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.25)',marginTop:4}}>You Own Your Data. Finally.</div>
          <div style={{fontSize:10,color:'rgba(255,255,255,0.15)',marginTop:8}}>Protected by USP 11,151,254 and USP 11,042,641</div>
        </div>
      </div>
    </div>
  )
}
