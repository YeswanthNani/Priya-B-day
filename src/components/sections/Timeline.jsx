import { useEffect, useRef, useState } from 'react';
import TIMELINE_DATA from '../../constants/timeline';

const CinematicImage = ({ src, alt, index }) => {
  const [loaded, setLoaded] = useState(false);
  const [hov, setHov] = useState(false);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  };
  return (
    <div ref={ref}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onMouseMove={onMove}
      style={{
        position:'relative', width:'100%', height:'400px', borderRadius:18, overflow:'hidden',
        border:'1px solid rgba(255,255,255,0.07)', cursor:'crosshair',
        transform: hov
          ? `perspective(900px) rotateX(${(mouse.y-0.5)*-4}deg) rotateY(${(mouse.x-0.5)*4}deg) scale(1.025)`
          : 'perspective(900px) rotateX(0) rotateY(0) scale(1)',
        transition: hov ? 'transform 0.1s ease-out' : 'transform 0.65s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: hov ? '0 30px 80px rgba(0,0,0,0.7),0 0 50px rgba(168,85,247,0.12)' : '0 16px 50px rgba(0,0,0,0.5)',
      }}>
      {!loaded && <div style={{position:'absolute',inset:0,background:'rgba(255,255,255,0.04)'}} className="image-shimmer"/>}
      <img src={src} alt={alt}
        onLoad={() => setLoaded(true)}
        onError={e => { e.target.src=`https://picsum.photos/seed/${index*17+3}/800/600`; }}
        style={{
          width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center',
          opacity: loaded?1:0,
          transform: hov?'scale(1.06)':'scale(1)',
          transition:'opacity 0.9s ease, transform 0.65s cubic-bezier(0.16,1,0.3,1)',
          filter: hov?'brightness(1.05) saturate(1.1)':'brightness(0.88)',
        }}/>
      <div style={{position:'absolute',inset:0,pointerEvents:'none',
        background:'linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 50%,rgba(0,0,0,0.12) 100%)',
        opacity: hov?0.45:0.95, transition:'opacity 0.5s ease'}}/>
      {hov && <div style={{position:'absolute',inset:0,pointerEvents:'none',
        background:`radial-gradient(circle at ${mouse.x*100}% ${mouse.y*100}%,rgba(255,255,255,0.08) 0%,transparent 55%)`}}/>}
      <div style={{position:'absolute',top:10,left:10,width:16,height:16,opacity:0.5,
        borderTop:'1px solid rgba(255,255,255,0.7)',borderLeft:'1px solid rgba(255,255,255,0.7)',
        transform:hov?'scale(1.5)':'scale(1)',transition:'transform 0.4s ease'}}/>
      <div style={{position:'absolute',bottom:10,right:10,width:16,height:16,opacity:0.5,
        borderBottom:'1px solid rgba(255,255,255,0.7)',borderRight:'1px solid rgba(255,255,255,0.7)',
        transform:hov?'scale(1.5)':'scale(1)',transition:'transform 0.4s ease'}}/>
      <div style={{position:'absolute',bottom:12,left:12,right:12,
        opacity:hov?1:0,transform:hov?'translateY(0)':'translateY(10px)',transition:'opacity 0.4s,transform 0.4s',pointerEvents:'none'}}>
        <p style={{color:'rgba(255,255,255,0.75)',fontSize:10,letterSpacing:'0.14em',fontWeight:300}}>{alt}</p>
      </div>
    </div>
  );
};

const TextBlock = ({ item, align, glow }) => (
  <div style={{textAlign:align,padding:'12px 0',height:'100%',display:'flex',flexDirection:'column',justifyContent:'center'}}>
    <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'4px 12px',borderRadius:999,marginBottom:14,
      background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',
      color:'rgba(255,255,255,0.4)',fontSize:9,letterSpacing:'0.18em',textTransform:'uppercase',
      width:'fit-content',marginLeft:align==='right'?'auto':0}}>
      <span style={{width:5,height:5,borderRadius:'50%',background:`${glow}0.9)`,flexShrink:0}}/>
      {item.date}
    </div>
    <h3 className="cinema-title" style={{
      fontSize:'clamp(22px,2.6vw,36px)',color:'#fff',lineHeight:1.2,marginBottom:14,
      textShadow:`0 0 50px ${glow}0.2)`}}>
      {item.title}
    </h3>
    <p style={{color:'rgba(255,255,255,0.45)',fontSize:13,lineHeight:1.85,fontWeight:300,
      maxWidth:260,marginLeft:align==='right'?'auto':0}}>
      {item.description}
    </p>
  </div>
);

const Timeline = () => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const [vis, setVis] = useState(new Set());
  const [headerVis, setHeaderVis] = useState(false);
  const [lineP, setLineP] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver(entries =>
      entries.forEach(e => { if(e.isIntersecting) setVis(p=>new Set([...p,+e.target.dataset.id])); }),
      {threshold:0.08,rootMargin:'-10px'});
    const hio = new IntersectionObserver(([e])=>{if(e.isIntersecting) setHeaderVis(true);},{threshold:0.2});
    containerRef.current?.querySelectorAll('[data-timeline-item]').forEach(el=>io.observe(el));
    if(headerRef.current) hio.observe(headerRef.current);
    const onScroll = () => {
      if(!containerRef.current) return;
      const {top,height}=containerRef.current.getBoundingClientRect();
      setLineP(Math.max(0,Math.min(1,(window.innerHeight-top)/(height+window.innerHeight))));
    };
    window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
    return ()=>{io.disconnect();hio.disconnect();window.removeEventListener('scroll',onScroll);};
  },[]);

  const grads=['linear-gradient(135deg,#7c3aed,#db2777)','linear-gradient(135deg,#db2777,#f59e0b)','linear-gradient(135deg,#6366f1,#a855f7)'];
  const glows=['rgba(168,85,247,','rgba(236,72,153,','rgba(99,102,241,'];

  return (
    <section id="timeline" style={{position:'relative',overflow:'hidden',width:'100%',
      padding:'80px 0 120px',background:'linear-gradient(180deg,#050507 0%,#07070f 50%,#050507 100%)'}}>
      <style>{`
        @keyframes tl-ping{75%,100%{transform:scale(2.4);opacity:0;}}
        @keyframes tl-pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
        .tl-grid{display:none;}
        .tl-mobile{display:block;}
        @media(min-width:768px){.tl-grid{display:grid!important;}.tl-mobile{display:none!important;}.tl-spine{display:block!important;}}
      `}</style>
      <div style={{position:'absolute',inset:0,pointerEvents:'none',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'20%',left:'15%',width:600,height:600,borderRadius:'50%',opacity:0.04,
          background:'radial-gradient(circle,#a855f7,transparent)',filter:'blur(100px)'}}/>
        <div style={{position:'absolute',bottom:'20%',right:'15%',width:450,height:450,borderRadius:'50%',opacity:0.03,
          background:'radial-gradient(circle,#ec4899,transparent)',filter:'blur(80px)'}}/>
      </div>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'0 24px'}}>
        <div ref={headerRef} style={{textAlign:'center',marginBottom:96,
          opacity:headerVis?1:0,transform:headerVis?'translateY(0)':'translateY(50px)',
          transition:'opacity 1.4s cubic-bezier(0.16,1,0.3,1),transform 1.4s cubic-bezier(0.16,1,0.3,1)'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 16px',borderRadius:999,marginBottom:20,
            background:'rgba(168,85,247,0.08)',border:'1px solid rgba(168,85,247,0.22)',
            color:'rgba(216,180,254,0.85)',fontSize:10,letterSpacing:'0.25em',textTransform:'uppercase'}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'#a855f7',animation:'tl-pulse 2s infinite'}}/>
            Chapter 02 • Our Story
          </div>
          <h2 className="cinema-title" style={{fontSize:'clamp(44px,8vw,88px)',color:'#fff',lineHeight:1.05,marginBottom:16}}>
            A timeline of
            <span style={{display:'block',fontStyle:'italic',fontWeight:300,marginTop:4,
              background:'linear-gradient(135deg,#a855f7,#ec4899 50%,#f59e0b)',
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>moments</span>
          </h2>
          <p style={{color:'rgba(255,255,255,0.35)',fontSize:13,fontWeight:300,letterSpacing:'0.06em',maxWidth:280,margin:'0 auto'}}>
            Every encounter writes a new chapter
          </p>
        </div>

        <div ref={containerRef} style={{position:'relative'}}>
         
          <div className="tl-spine" style={{display:'none',position:'absolute',left:'50%',top:0,bottom:0,width:1,transform:'translateX(-50%)'}}>
            <div style={{position:'absolute',inset:0,background:'rgba(168,85,247,0.07)'}}/>
            <div style={{position:'absolute',top:0,left:0,width:'100%',height:`${lineP*100}%`,
              background:'linear-gradient(180deg,transparent,rgba(168,85,247,0.7) 15%,rgba(236,72,153,0.5))',
              transition:'height 0.12s linear',boxShadow:'0 0 10px rgba(168,85,247,0.4)'}}/>
          </div>

          {TIMELINE_DATA.map((item,index)=>{
            const isEven=index%2===0;
            const isVis=vis.has(item.id);
            const grad=grads[index%3];
            const glow=glows[index%3];
            const delay=index*90;
            return (
              <div key={item.id} data-timeline-item data-id={item.id} style={{marginBottom:72}}>
              
                <div className="tl-grid"
                  style={{gridTemplateColumns:'1fr 60px 1fr',alignItems:'center',gap:'0 20px',
                    opacity:isVis?1:0,transform:isVis?'translateY(0)':'translateY(60px)',
                    transition:`opacity 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms,transform 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`}}>
               
                  <div style={{gridColumn:isEven?1:3,gridRow:1,
                    opacity:isVis?1:0,transform:isVis?'translateX(0)':`translateX(${isEven?40:-40}px)`,
                    transition:`opacity 1.2s cubic-bezier(0.16,1,0.3,1) ${delay+120}ms,transform 1.2s cubic-bezier(0.16,1,0.3,1) ${delay+120}ms`}}>
                    {isEven?<TextBlock item={item} align="right" glow={glow}/>:<CinematicImage src={item.image} alt={item.title} index={index}/>}
                  </div>
               
                  <div style={{gridColumn:2,gridRow:1,display:'flex',alignItems:'center',justifyContent:'center',zIndex:10}}>
                    <div style={{width:52,height:52,borderRadius:'50%',background:grad,
                      display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,
                      position:'relative',flexShrink:0,border:'1px solid rgba(255,255,255,0.12)',
                      boxShadow:isVis?`0 0 0 8px ${glow}0.07),0 0 28px ${glow}0.45)`:'none',
                      transition:'box-shadow 0.7s ease 0.3s'}}>
                      {item.icon}
                      {isVis&&<span style={{position:'absolute',inset:0,borderRadius:'50%',
                        background:`${glow}0.35)`,animation:'tl-ping 2.5s cubic-bezier(0,0,0.2,1) infinite'}}/>}
                    </div>
                  </div>
                 
                  <div style={{gridColumn:isEven?3:1,gridRow:1,
                    opacity:isVis?1:0,transform:isVis?'translateX(0)':`translateX(${isEven?-40:40}px)`,
                    transition:`opacity 1.2s cubic-bezier(0.16,1,0.3,1) ${delay+80}ms,transform 1.2s cubic-bezier(0.16,1,0.3,1) ${delay+80}ms`}}>
                    {isEven?<CinematicImage src={item.image} alt={item.title} index={index}/>:<TextBlock item={item} align="left" glow={glow}/>}
                  </div>
                </div>

           
                <div className="tl-mobile"
                  style={{opacity:isVis?1:0,transform:isVis?'translateY(0)':'translateY(40px)',
                    transition:`opacity 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms,transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`}}>
                  <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                    <div style={{width:42,height:42,borderRadius:'50%',flexShrink:0,background:grad,
                      display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,
                      border:'1px solid rgba(255,255,255,0.12)',
                      boxShadow:isVis?`0 0 20px ${glow}0.4)`:'none'}}>{item.icon}</div>
                    <span style={{display:'inline-flex',alignItems:'center',gap:6,padding:'4px 10px',borderRadius:999,
                      background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',
                      color:'rgba(255,255,255,0.4)',fontSize:9,letterSpacing:'0.18em',textTransform:'uppercase'}}>{item.date}</span>
                  </div>
                  <div style={{marginBottom:18}}><CinematicImage src={item.image} alt={item.title} index={index}/></div>
                  <TextBlock item={item} align="left" glow={glow}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default Timeline;
