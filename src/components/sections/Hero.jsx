import { useState, useEffect, useRef } from 'react';
import MagneticButton from '../ui/MagneticButton';
import useCountdown from '../../hooks/useCountdown';


const FlipCell = ({ value, label }) => {
  const padded = String(value).padStart(2, '0');
  const [display, setDisplay] = useState(padded);
  const [flip, setFlip] = useState(false);
  const prev = useRef(padded);

  useEffect(() => {
    if (prev.current !== padded) {
      setFlip(true);
      const t = setTimeout(() => { setDisplay(padded); setFlip(false); }, 200);
      prev.current = padded;
      return () => clearTimeout(t);
    }
  }, [padded]);

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, minWidth:72 }}>
      <div style={{
        position:'relative',
        fontFamily:"'Space Grotesk',monospace",
        fontVariantNumeric:'tabular-nums',
        fontSize:'clamp(2rem,5vw,3rem)',
        fontWeight:300,
        color:'#fff',
        lineHeight:1,
        width:72,
        textAlign:'center',
        background:'rgba(255,255,255,0.055)',
        border:'1px solid rgba(255,255,255,0.1)',
        borderRadius:14,
        padding:'15px 0 12px',
        boxShadow:'0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
        transform: flip ? 'rotateX(-22deg) scale(0.94)' : 'rotateX(0deg) scale(1)',
        opacity: flip ? 0.4 : 1,
        transition:'transform .2s ease, opacity .2s ease',
        letterSpacing:'0.04em',
        overflow:'hidden',
      }}>
       
        <div style={{
          position:'absolute', top:0, left:0, right:0, height:'50%',
          background:'linear-gradient(to bottom, rgba(255,255,255,0.04), transparent)',
          borderRadius:'14px 14px 0 0', pointerEvents:'none'
        }}/>
        {display}
      </div>
      <span style={{
        fontSize:9, letterSpacing:'.28em', textTransform:'uppercase',
        color:'rgba(232,121,160,0.7)', fontFamily:"'Inter',sans-serif"
      }}>{label}</span>
    </div>
  );
};


const Hero = ({ onJourneyStart, onMusicToggle }) => {
  const { age, days, hours, minutes, seconds } = useCountdown('2004-05-02');
  const [typedText, setTypedText] = useState('');
  const [phase, setPhase] = useState(0);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x:0.5, y:0.5 });
  const fullText = 'Happiest Birthday, PriyaDarshini 🩵🌏🦋🫂';

 
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const mkP = () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx:(Math.random()-.5)*.35, vy:(Math.random()-.5)*.35,
      r: Math.random()*1.4+.3, hue: Math.random()>.5?340:280, a:Math.random()*.5+.1,
    });
    const pts = Array.from({length:110}, mkP);

    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const mx = mouseRef.current.x*canvas.width, my = mouseRef.current.y*canvas.height;
      pts.forEach((p,i) => {
        const dx=mx-p.x, dy=my-p.y, dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<200){p.vx+=(dx/dist)*.008; p.vy+=(dy/dist)*.008;}
        const spd=Math.sqrt(p.vx*p.vx+p.vy*p.vy);
        if(spd>.8){p.vx*=.95;p.vy*=.95;}
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=canvas.width; if(p.x>canvas.width)p.x=0;
        if(p.y<0)p.y=canvas.height; if(p.y>canvas.height)p.y=0;
        pts.slice(i+1).forEach(p2=>{
          const ex=p.x-p2.x,ey=p.y-p2.y,ed=Math.sqrt(ex*ex+ey*ey);
          if(ed<110){
            ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p2.x,p2.y);
            ctx.strokeStyle=`rgba(232,121,160,${.05*(1-ed/110)})`;ctx.lineWidth=.5;ctx.stroke();
          }
        });
        const pulse=.5+.5*Math.sin(Date.now()/1800+i);
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`hsla(${p.hue},75%,70%,${p.a*pulse})`;ctx.fill();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    const onMouse = e => { mouseRef.current={x:e.clientX/window.innerWidth,y:e.clientY/window.innerHeight}; };
    window.addEventListener('mousemove', onMouse, {passive:true});
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize',resize); window.removeEventListener('mousemove',onMouse); };
  }, []);

 
  useEffect(() => {
    let idx = 0;
    const delay = setTimeout(() => {
      const iv = setInterval(() => {
        if(idx < fullText.length){ setTypedText(fullText.slice(0, idx+1)); idx++; }
        else { clearInterval(iv); setTimeout(()=>setPhase(1),500); setTimeout(()=>setPhase(2),1100); }
      }, 60);
      return ()=>clearInterval(iv);
    }, 400);
    return ()=>clearTimeout(delay);
  }, []);

  const show = (delay) => ({
    opacity: phase>=1 ? 1 : 0,
    transform: phase>=1 ? 'translateY(0)' : 'translateY(20px)',
    filter: phase>=1 ? 'blur(0)' : 'blur(4px)',
    transition: `opacity .8s ease ${delay}s, transform .8s cubic-bezier(.16,1,.3,1) ${delay}s, filter .8s ease ${delay}s`,
  });

  const DividerDot = () => (
    <div style={{width:3,height:3,borderRadius:'50%',background:'rgba(255,255,255,.2)',marginBottom:26,flexShrink:0}}/>
  );

  return (
    <>
      <style>{`
        @keyframes heroReveal{from{opacity:0;transform:translateY(22px);filter:blur(4px)}to{opacity:1;transform:none;filter:blur(0)}}
        @keyframes auroraShift{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(38px,-22px) scale(1.07)}66%{transform:translate(-22px,18px) scale(.96)}}
        @keyframes scrollDrop{0%{transform:scaleY(0);transform-origin:top;opacity:0}30%{transform:scaleY(1);opacity:1;transform-origin:top}70%{transform:scaleY(1);opacity:1;transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom;opacity:0}}
        .aurora-1{animation:auroraShift 14s ease-in-out infinite}
        .aurora-2{animation:auroraShift 18s ease-in-out infinite reverse;animation-delay:-4s}
        .aurora-3{animation:auroraShift 22s ease-in-out infinite;animation-delay:-9s}
        .scroll-line-anim{animation:scrollDrop 2.2s ease-in-out infinite}
        .film-cell{width:26px;height:18px;border:1px solid rgba(255,255,255,.14);border-radius:2px;margin:3px auto;background:rgba(255,255,255,.015)}
        .cta-btn{position:relative;display:inline-flex;align-items:center;gap:14px;padding:18px 48px;font-family:'Inter',sans-serif;font-size:12px;font-weight:400;letter-spacing:.2em;text-transform:uppercase;color:#0a0a0a;background:#fff;border:none;border-radius:100px;cursor:pointer;overflow:hidden;transition:transform .35s cubic-bezier(.34,1.56,.64,1),box-shadow .35s ease}
        .cta-btn:hover{transform:scale(1.04);box-shadow:0 0 60px -8px rgba(232,121,160,.55)}
        .cta-shimmer{position:absolute;inset:0;background:linear-gradient(105deg,transparent 30%,rgba(232,121,160,.3) 50%,transparent 70%);transform:translateX(-100%);transition:transform .65s ease}
        .cta-btn:hover .cta-shimmer{transform:translateX(100%)}
        .cta-grad{position:absolute;inset:0;background:linear-gradient(135deg,#f9a8d4,#c4b5fd);opacity:0;transition:opacity .35s ease}
        .cta-btn:hover .cta-grad{opacity:1}
        .cta-btn span,.cta-btn svg{position:relative;z-index:1;transition:color .2s ease}
        .cta-btn:hover span,.cta-btn:hover svg{color:#fff}
        .cta-arrow{transition:transform .3s ease}
        .cta-btn:hover .cta-arrow{transform:translateX(4px)}
      `}</style>

      <section id="hero" className="relative min-h-screen flex items-center justify-center section overflow-hidden" style={{background:'#060608'}}>

       
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:1}}/>

    
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{zIndex:2}}>
          <div className="aurora-1 absolute" style={{top:'14%',left:'18%',width:520,height:520,borderRadius:'50%',background:'radial-gradient(circle,rgba(232,121,160,.09) 0%,transparent 70%)',filter:'blur(70px)'}}/>
          <div className="aurora-2 absolute" style={{bottom:'18%',right:'14%',width:420,height:420,borderRadius:'50%',background:'radial-gradient(circle,rgba(168,85,247,.08) 0%,transparent 70%)',filter:'blur(60px)'}}/>
          <div className="aurora-3 absolute" style={{top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:600,height:180,borderRadius:'50%',background:'radial-gradient(ellipse,rgba(96,165,250,.04) 0%,transparent 70%)',filter:'blur(50px)'}}/>
        </div>

       
        <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 85% 75% at 50% 50%,transparent 25%,rgba(6,6,8,.88) 100%)',zIndex:3}}/>

      
        {['left-0','right-0'].map(pos=>(
          <div key={pos} className={`absolute ${pos} top-0 bottom-0 w-10 pointer-events-none hidden xl:flex flex-col justify-center`} style={{zIndex:4,opacity:.1}}>
            {Array.from({length:24}).map((_,i)=><div key={i} className="film-cell"/>)}
          </div>
        ))}

      
        <div className="relative w-full max-w-4xl mx-auto px-6 md:px-10 text-center" style={{zIndex:10}}>

          
          <div style={{marginBottom:32,opacity:0,animation:'heroReveal .8s .15s cubic-bezier(.16,1,.3,1) forwards'}}>
            <span style={{
              display:'inline-flex',alignItems:'center',gap:10,
              padding:'10px 20px',borderRadius:100,
              background:'rgba(232,121,160,.07)',border:'1px solid rgba(232,121,160,.2)',
              color:'rgba(232,121,160,.85)',fontSize:10,letterSpacing:'.3em',textTransform:'uppercase',fontFamily:"'Inter',sans-serif"
            }}>
              <span style={{width:6,height:6,borderRadius:'50%',background:'#e879a0',animation:'pulse 2s ease-in-out infinite',display:'inline-block'}}/>
              A Special Dedication
            </span>
          </div>

        
          <div style={{marginBottom:40,overflow:'hidden'}}>
            <h1 style={{
              fontFamily:"'Cormorant Garamond',serif",fontWeight:300,
              fontSize:'clamp(1.85rem,5.2vw,3.8rem)',letterSpacing:'.04em',
              color:'#fff',lineHeight:1.15,display:'inline-block',
              textShadow:'0 0 80px rgba(232,121,160,.08), 0 2px 4px rgba(0,0,0,.4)',
            }}>
              {typedText}<span className="typing-cursor"/>
            </h1>
          </div>

        
          <p style={{
            fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontWeight:300,
            fontSize:'clamp(.95rem,2vw,1.15rem)',color:'rgba(255,255,255,.5)',
            maxWidth:420,margin:'0 auto 3.5rem',
            ...show(0)
          }}>
            A story waiting to be written, one moment at a time
          </p>

         
          <div style={{marginBottom:56,...show(.15)}}>
            <div style={{
              display:'inline-flex',flexDirection:'column',alignItems:'center',gap:20,
              padding:'28px 36px 26px',
              background:'rgba(255,255,255,0.025)',
              backdropFilter:'blur(28px)',WebkitBackdropFilter:'blur(28px)',
              border:'1px solid rgba(255,255,255,0.09)',borderRadius:28,
              boxShadow:'0 0 60px -20px rgba(232,121,160,.15),0 20px 60px -30px rgba(0,0,0,.55)',
              position:'relative',overflow:'hidden',
              maxWidth:'100%',
            }}>
            
              <div style={{
                position:'absolute',top:0,left:0,right:0,height:1,
                background:'linear-gradient(90deg,transparent,rgba(232,121,160,.4),rgba(168,85,247,.4),transparent)',
                pointerEvents:'none'
              }}/>

           
              <p style={{fontSize:10,letterSpacing:'.25em',textTransform:'uppercase',color:'rgba(255,255,255,.3)',fontFamily:"'Inter',sans-serif"}}>
                ↓ countdown to may 2nd
              </p>

             
              <div style={{display:'flex',alignItems:'center',gap:0,flexWrap:'wrap',justifyContent:'center',rowGap:16}}>

              
                <div style={{
                  display:'flex',flexDirection:'column',alignItems:'center',gap:6,
                  padding:'18px 26px',
                  background:'linear-gradient(135deg,rgba(232,121,160,.12),rgba(168,85,247,.1))',
                  border:'1px solid rgba(232,121,160,.22)',borderRadius:18,
                  position:'relative',overflow:'hidden',flexShrink:0,
                }}>
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(232,121,160,.07),transparent 60%)',pointerEvents:'none'}}/>
                  <span style={{fontSize:9,letterSpacing:'.28em',textTransform:'uppercase',color:'rgba(232,121,160,.75)',fontFamily:"'Inter',sans-serif",zIndex:1}}>
                    Turning
                  </span>
                  <span style={{
                    fontFamily:"'Space Grotesk',monospace",fontVariantNumeric:'tabular-nums',
                    fontSize:'clamp(2.6rem,5.5vw,3.8rem)',fontWeight:300,lineHeight:1,
                    background:'linear-gradient(135deg,#f9a8d4,#fff 50%,#c4b5fd)',
                    WebkitBackgroundClip:'text',backgroundClip:'text',WebkitTextFillColor:'transparent',
                    zIndex:1,position:'relative',
                  }}>
                    {age}
                  </span>
                </div>

               
                <div style={{width:1,height:64,background:'linear-gradient(to bottom,transparent,rgba(255,255,255,.12),transparent)',margin:'0 16px',flexShrink:0}}/>

               
                <div style={{display:'flex',alignItems:'flex-start',gap:8,flexWrap:'nowrap'}}>
                  <FlipCell value={days}    label="Days"/>
                  <DividerDot/>
                  <FlipCell value={hours}   label="Hrs"/>
                  <DividerDot/>
                  <FlipCell value={minutes} label="Min"/>
                  <DividerDot/>
                  <FlipCell value={seconds} label="Sec"/>
                </div>
              </div>
            </div>
          </div>

      
          <div style={show(.3)}>
            <MagneticButton onClick={onJourneyStart} className="cta-btn">
              <div className="cta-shimmer"/>
              <div className="cta-grad"/>
              <span>Begin the Journey</span>
              <svg className="cta-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </MagneticButton>
          </div>

        </div>

      
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{zIndex:10,opacity:phase>=2?1:0,transition:'opacity .8s ease 1.2s'}}>
          <div className="scroll-line-anim" style={{width:1,height:46,background:'linear-gradient(to bottom,transparent,rgba(232,121,160,.65))'}}/>
          <span style={{fontSize:9,letterSpacing:'.3em',textTransform:'uppercase',color:'rgba(255,255,255,.22)'}} className="hidden md:block">
            Scroll to explore
          </span>
        </div>

      
        <button onClick={onMusicToggle}
          className="absolute bottom-10 right-10 hidden md:flex items-center gap-2.5 hover:scale-105 transition-all duration-300"
          style={{
            background:'rgba(255,255,255,.04)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',
            border:'1px solid rgba(255,255,255,.08)',borderRadius:100,padding:'10px 20px',
            fontSize:11,color:'rgba(255,255,255,.5)',zIndex:10,cursor:'pointer'
          }}>
          <span style={{color:'#e879a0',fontSize:13}}>♪</span>
          <span style={{fontWeight:300,letterSpacing:'.1em',fontFamily:"'Inter',sans-serif"}}>Now Playing</span>
        </button>

      </section>
    </>
  );
};

const DividerDot = () => (
  <div style={{width:3,height:3,borderRadius:'50%',background:'rgba(255,255,255,.2)',marginBottom:26,flexShrink:0}}/>
);

export default Hero;
