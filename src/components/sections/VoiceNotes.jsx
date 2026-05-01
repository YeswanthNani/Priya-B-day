import { useState, useRef, useEffect } from 'react';
import VOICE_NOTES from '../../constants/voiceNotes';
import useAudio from '../../hooks/useAudio';

const VoiceNotes = () => {
  const { audioRef, isPlaying, play, setSource, toggle } = useAudio();
  const [current, setCurrent] = useState(null);
  const [vis, setVis] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bars, setBars] = useState(Array(48).fill(6));
  const [hov, setHov] = useState(null);
  const sectionRef = useRef(null);
  const rafRef = useRef(null);
  const phaseRef = useRef(0);

  useEffect(()=>{
    const io = new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true);},{threshold:0.15});
    if(sectionRef.current) io.observe(sectionRef.current);
    return ()=>io.disconnect();
  },[]);

  useEffect(()=>{
    if(isPlaying){
      const tick = () => {
        phaseRef.current += 0.04;
        setBars(Array(48).fill(0).map((_,i)=>{
          const wave = Math.sin(phaseRef.current + i*0.28)*28 + Math.sin(phaseRef.current*1.7 + i*0.45)*18;
          return Math.max(4, 36 + wave + (Math.random()-0.5)*10);
        }));
        if(audioRef.current?.duration){
          setProgress((audioRef.current.currentTime/audioRef.current.duration)*100);
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafRef.current);
      phaseRef.current = 0;
      setBars(Array(48).fill(6));
    }
    return ()=>cancelAnimationFrame(rafRef.current);
  },[isPlaying]);

  const select = (note, i) => {
    if(current===i){ toggle(); }
    else { setCurrent(i); setSource(note.src); play(); setProgress(0); }
  };

  const accents = [
    {from:'#6366f1',to:'#a855f7',glow:'rgba(99,102,241,'},
    {from:'#ec4899',to:'#f43f5e',glow:'rgba(236,72,153,'},
    {from:'#a855f7',to:'#6366f1',glow:'rgba(168,85,247,'},
  ];

  return (
    <section id="voice" ref={sectionRef} style={{position:'relative',overflow:'hidden',
      padding:'80px 0 120px',background:'linear-gradient(180deg,#060609 0%,#08080e 50%,#060609 100%)'}}>
      <style>{`@keyframes vn-pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}`}</style>

      <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <div style={{position:'absolute',top:0,right:0,width:500,height:500,borderRadius:'50%',opacity:0.04,
          background:'radial-gradient(circle,#6366f1,transparent)',filter:'blur(80px)',transform:'translate(30%,-30%)'}}/>
        <div style={{position:'absolute',bottom:0,left:0,width:400,height:400,borderRadius:'50%',opacity:0.03,
          background:'radial-gradient(circle,#ec4899,transparent)',filter:'blur(80px)',transform:'translate(-30%,30%)'}}/>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'0 24px'}}>
       
        <div style={{textAlign:'center',marginBottom:64,
          opacity:vis?1:0,transform:vis?'translateY(0)':'translateY(50px)',
          transition:'opacity 1.4s cubic-bezier(0.16,1,0.3,1),transform 1.4s cubic-bezier(0.16,1,0.3,1)'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 16px',borderRadius:999,marginBottom:20,
            background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.22)',
            color:'rgba(199,210,254,0.85)',fontSize:10,letterSpacing:'0.25em',textTransform:'uppercase'}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'#6366f1',animation:'vn-pulse 2s infinite'}}/>
            Chapter 04 • From My Heart
          </div>
          <h2 className="cinema-title" style={{fontSize:'clamp(44px,8vw,88px)',color:'#fff',lineHeight:1.05,marginBottom:16}}>
            Words worth
            <span style={{display:'block',fontStyle:'italic',fontWeight:300,marginTop:4,
              background:'linear-gradient(135deg,#6366f1,#a855f7 50%,#ec4899)',
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>sharing</span>
          </h2>
          <p style={{color:'rgba(255,255,255,0.35)',fontSize:13,fontWeight:300,letterSpacing:'0.06em',maxWidth:300,margin:'0 auto'}}>
            Sometimes the most important things are said without grand gestures
          </p>
        </div>

      
        <div style={{
          display:'grid',gridTemplateColumns:'1fr 1fr',gap:32,
          opacity:vis?1:0,transform:vis?'translateY(0)':'translateY(40px)',
          transition:'opacity 1s cubic-bezier(0.16,1,0.3,1) 200ms,transform 1s cubic-bezier(0.16,1,0.3,1) 200ms',
        }} className="vn-layout">
          <style>{`@media(max-width:768px){.vn-layout{grid-template-columns:1fr!important;}}`}</style>

          
          <div style={{borderRadius:24,padding:36,
            background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.07)',
            display:'flex',flexDirection:'column',justifyContent:'space-between',minHeight:340,
            boxShadow: isPlaying?'0 0 80px rgba(99,102,241,0.12)':'none',
            transition:'box-shadow 1s ease'}}>

           
            <div>
              <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:32}}>
                <div style={{width:52,height:52,borderRadius:14,flexShrink:0,
                  background:'linear-gradient(135deg,#6366f1,#a855f7)',
                  display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,
                  boxShadow: isPlaying?'0 0 25px rgba(99,102,241,0.55)':'0 0 10px rgba(99,102,241,0.2)',
                  transition:'box-shadow 0.5s ease'}}>🎙</div>
                <div style={{overflow:'hidden'}}>
                  <div style={{fontWeight:500,fontSize:15,color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                    {current!==null ? VOICE_NOTES[current]?.title : 'Select a note'}
                  </div>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.35)',marginTop:3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                    {current!==null ? VOICE_NOTES[current]?.description : 'Choose a track to play'}
                  </div>
                </div>
              </div>

            
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',
                gap:2,height:80,marginBottom:20,overflow:'hidden'}}>
                {bars.map((h,i)=>{
                  const hue = 240 + i*2.5;
                  return (
                    <div key={i} style={{
                      flex:1,maxWidth:5,borderRadius:3,
                      height:`${Math.max(4,Math.min(h,100))}%`,
                      background: isPlaying
                        ? `hsla(${hue},70%,65%,${0.45+(h/100)*0.55})`
                        : 'rgba(255,255,255,0.1)',
                      transition: isPlaying?'height 65ms ease-out':'height 700ms ease-out',
                    }}/>
                  );
                })}
              </div>

      
              <div style={{height:3,borderRadius:2,background:'rgba(255,255,255,0.08)',overflow:'hidden',marginBottom:8}}>
                <div style={{height:'100%',borderRadius:2,
                  width:`${progress}%`,
                  background:'linear-gradient(to right,#6366f1,#a855f7,#ec4899)',
                  transition:'width 0.3s ease'}}/>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'rgba(255,255,255,0.25)'}}>
                <span>{audioRef.current ? `${Math.floor((audioRef.current.currentTime||0)/60)}:${String(Math.floor((audioRef.current.currentTime||0)%60)).padStart(2,'0')}` : '0:00'}</span>
                <span>{current!==null ? VOICE_NOTES[current]?.duration : '--:--'}</span>
              </div>
            </div>

           
            <button
              onClick={()=>current!==null && toggle()}
              disabled={current===null}
              style={{
                marginTop:24, width:'100%', height:52, borderRadius:14,
                background: current!==null ? 'linear-gradient(135deg,#6366f1,#a855f7)' : 'rgba(255,255,255,0.05)',
                border:'none', cursor: current===null?'not-allowed':'pointer',
                color: current!==null?'#fff':'rgba(255,255,255,0.2)',
                fontSize:22, fontWeight:400,
                boxShadow: current!==null && isPlaying?'0 0 30px rgba(99,102,241,0.5)':'none',
                transform: isPlaying?'scale(0.97)':'scale(1)',
                transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              }}>
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>

         
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {VOICE_NOTES.map((note,i)=>{
              const isAct = current===i;
              const isH = hov===i;
              const ac = accents[i%accents.length];
              return (
                <button key={note.id}
                  onClick={()=>select(note,i)}
                  onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}
                  style={{
                    width:'100%',textAlign:'left',padding:'18px 20px',
                    borderRadius:16,display:'flex',alignItems:'center',gap:14,
                    background: isAct?`linear-gradient(135deg,${ac.from}12,${ac.to}08)`
                      : isH?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.025)',
                    border: isAct?`1px solid ${ac.glow}0.35)`:'1px solid rgba(255,255,255,0.05)',
                    cursor:'pointer',position:'relative',overflow:'hidden',
                    transform: isH&&!isAct?'translateX(6px)':'translateX(0)',
                    boxShadow: isAct?`0 0 30px ${ac.glow}0.15)`:'none',
                    transition:'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                  }}>
               
                  {isAct&&isPlaying&&<div style={{position:'absolute',left:0,top:'20%',bottom:'20%',
                    width:3,borderRadius:'0 2px 2px 0',
                    background:`linear-gradient(180deg,${ac.from},${ac.to})`}}/>}
                  
                  <div style={{width:38,height:38,borderRadius:10,flexShrink:0,
                    display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,
                    background: isAct?`linear-gradient(135deg,${ac.from},${ac.to})`:'rgba(255,255,255,0.05)',
                    color: isAct?'#fff':'rgba(255,255,255,0.4)',
                    boxShadow: isAct?`0 0 15px ${ac.glow}0.4)`:'none',
                    transform: isAct&&isPlaying?'scale(1.1)':'scale(1)',
                    transition:'all 0.4s cubic-bezier(0.34,1.56,0.64,1)'}}>
                    {isAct&&isPlaying?'⏸':'▶'}
                  </div>

                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:500,fontSize:14,
                      color:isAct?'#fff':'rgba(255,255,255,0.7)',
                      overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {note.title}
                    </div>
                    <div style={{fontSize:11,color:'rgba(255,255,255,0.3)',marginTop:3,
                      overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {note.description}
                    </div>
                  </div>

                  <div style={{fontSize:11,fontFamily:'monospace',color:'rgba(255,255,255,0.22)',
                    background:'rgba(0,0,0,0.3)',padding:'3px 8px',borderRadius:8,flexShrink:0}}>
                    {note.duration}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <audio ref={audioRef} className="hidden"/>
    </section>
  );
};
export default VoiceNotes;
