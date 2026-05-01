import { useState, useEffect, useRef } from 'react';
import REASONS from '../../constants/reasons';

const ACCENT_COMBOS = [
  { bg:'rgba(168,85,247,', border:'rgba(168,85,247,0.3)', glow:'rgba(168,85,247,0.15)' },
  { bg:'rgba(236,72,153,', border:'rgba(236,72,153,0.3)', glow:'rgba(236,72,153,0.15)' },
  { bg:'rgba(245,158,11,', border:'rgba(245,158,11,0.3)', glow:'rgba(245,158,11,0.12)' },
  { bg:'rgba(99,102,241,', border:'rgba(99,102,241,0.3)', glow:'rgba(99,102,241,0.15)' },
  { bg:'rgba(20,184,166,', border:'rgba(20,184,166,0.3)', glow:'rgba(20,184,166,0.12)' },
  { bg:'rgba(244,63,94,',  border:'rgba(244,63,94,0.3)',  glow:'rgba(244,63,94,0.12)'  },
  { bg:'rgba(139,92,246,', border:'rgba(139,92,246,0.3)', glow:'rgba(139,92,246,0.15)' },
  { bg:'rgba(251,146,60,', border:'rgba(251,146,60,0.3)', glow:'rgba(251,146,60,0.12)' },
];

const WhyYou = () => {
  const [headerVis, setHeaderVis] = useState(false);
  const [hovCard, setHovCard] = useState(null);
  const [visCards, setVisCards] = useState(new Set());
  const headerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const hio = new IntersectionObserver(([e])=>{if(e.isIntersecting)setHeaderVis(true);},{threshold:0.2});
    const cio = new IntersectionObserver(entries=>entries.forEach(e=>{
      if(e.isIntersecting) setVisCards(p=>new Set([...p,+e.target.dataset.id]));
    }),{threshold:0.08});
    if(headerRef.current) hio.observe(headerRef.current);
    containerRef.current?.querySelectorAll('[data-card]').forEach(el=>cio.observe(el));
    return ()=>{hio.disconnect();cio.disconnect();};
  },[]);

  return (
    <section id="why" style={{position:'relative',overflow:'hidden',
      padding:'80px 0 120px',background:'linear-gradient(180deg,#06060a 0%,#09090f 50%,#06060a 100%)'}}>
      <style>{`
        @keyframes wy-float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
        @keyframes wy-pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
      `}</style>

      
      <div style={{position:'absolute',inset:0,pointerEvents:'none',opacity:0.025,
        backgroundImage:'linear-gradient(rgba(168,85,247,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,0.4) 1px,transparent 1px)',
        backgroundSize:'60px 60px'}}/>
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',
        width:800,height:800,borderRadius:'50%',pointerEvents:'none',
        background:'radial-gradient(circle,rgba(245,158,11,0.04) 0%,transparent 70%)',filter:'blur(60px)'}}/>

      <div style={{maxWidth:1280,margin:'0 auto',padding:'0 24px'}}>
    
        <div ref={headerRef} style={{textAlign:'center',marginBottom:80,
          opacity:headerVis?1:0,transform:headerVis?'translateY(0)':'translateY(50px)',
          transition:'opacity 1.4s cubic-bezier(0.16,1,0.3,1),transform 1.4s cubic-bezier(0.16,1,0.3,1)'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 16px',borderRadius:999,marginBottom:20,
            background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.22)',
            color:'rgba(253,230,138,0.85)',fontSize:10,letterSpacing:'0.25em',textTransform:'uppercase'}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'#f59e0b',animation:'wy-pulse 2s infinite'}}/>
            Chapter 03 • Because
          </div>
          <h2 className="cinema-title" style={{fontSize:'clamp(44px,8vw,88px)',color:'#fff',lineHeight:1.05,marginBottom:16}}>
            What makes you
            <span style={{display:'block',fontStyle:'italic',fontWeight:300,marginTop:4,
              background:'linear-gradient(135deg,#f59e0b,#ec4899 60%,#a855f7)',
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>remarkable</span>
          </h2>
          <p style={{color:'rgba(255,255,255,0.35)',fontSize:13,fontWeight:300,letterSpacing:'0.06em',maxWidth:280,margin:'0 auto'}}>
            The little things that leave lasting impressions
          </p>
        </div>

     
        <div ref={containerRef}
          style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:20}}>
          {REASONS.map((r, i) => {
            const ac = ACCENT_COMBOS[i % ACCENT_COMBOS.length];
            const isHov = hovCard === r.id;
            const isVis = visCards.has(r.id);
            const isLarge = i === 0 || i === 4; 
            return (
              <div key={r.id} data-card data-id={r.id}
                onMouseEnter={()=>setHovCard(r.id)} onMouseLeave={()=>setHovCard(null)}
                style={{
                  gridColumn: isLarge ? 'span 1' : 'span 1',
                  padding: isLarge ? '40px 32px' : '32px 28px',
                  borderRadius:20,
                  background: isHov ? `${ac.bg}0.07)` : 'rgba(255,255,255,0.025)',
                  border: isHov ? `1px solid ${ac.border}` : '1px solid rgba(255,255,255,0.06)',
                  cursor:'default',
                  position:'relative',overflow:'hidden',
                  opacity: isVis?1:0,
                  transform: isVis
                    ? isHov?'translateY(-6px) scale(1.02)':'translateY(0) scale(1)'
                    : 'translateY(50px) scale(0.94)',
                  transition: isVis
                    ? 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1),opacity 0.1s,border-color 0.4s,background 0.4s,box-shadow 0.4s'
                    : `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${i*80}ms,transform 0.8s cubic-bezier(0.16,1,0.3,1) ${i*80}ms`,
                  boxShadow: isHov ? `0 20px 60px rgba(0,0,0,0.5),0 0 40px ${ac.glow}` : 'none',
                }}>
              
                {isHov && <div style={{position:'absolute',inset:0,pointerEvents:'none',
                  background:`radial-gradient(circle at 50% -10%,${ac.bg}0.1) 0%,transparent 65%)`}}/>}

             
                <div style={{position:'absolute',top:14,right:18,
                  fontFamily:'monospace',fontSize:11,letterSpacing:'0.1em',
                  color:`${ac.bg}0.4)`,fontWeight:400}}>
                  {String(i+1).padStart(2,'0')}
                </div>

              
                <div style={{
                  fontSize: isLarge?52:44, marginBottom:20,
                  display:'inline-block',position:'relative',
                  transform: isHov?'scale(1.25) translateY(-4px)':'scale(1)',
                  transition:'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
                  filter: isHov?`drop-shadow(0 0 14px ${ac.bg}0.6))`:'none',
                }}>
                  {r.emoji}
                </div>

                <h3 style={{fontSize:16,fontWeight:500,marginBottom:10,color:'#fff',
                  textShadow: isHov?`0 0 20px ${ac.bg}0.5)`:undefined}}>
                  {r.title}
                </h3>
                <p style={{fontSize:13,lineHeight:1.8,color:'rgba(255,255,255,0.45)',fontWeight:300}}>
                  {r.text}
                </p>

              
                <div style={{position:'absolute',bottom:0,left:'50%',transform:'translateX(-50%)',
                  height:1,
                  width: isHov?'75%':'0%',
                  background:`linear-gradient(to right,transparent,${ac.bg}0.6),transparent)`,
                  transition:'width 0.5s ease'}}/>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default WhyYou;
