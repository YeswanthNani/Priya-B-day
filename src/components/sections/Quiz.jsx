import { useState, useEffect, useRef } from 'react';
import QUIZ_QUESTIONS from '../../constants/quizQuestions';

const Quiz = () => {
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [vis, setVis] = useState(false);
  const [anim, setAnim] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef(null);

  useEffect(()=>{
    const io = new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true);},{threshold:0.15});
    if(sectionRef.current) io.observe(sectionRef.current);
    return ()=>io.disconnect();
  },[]);

  const pick = (i) => {
    if(anim||revealed) return;
    setSel(i);
    setRevealed(true);
  };

  const next = () => {
    if(sel===null||anim) return;
    setAnim(true);
    if(sel===QUIZ_QUESTIONS[cur].correctAnswer) setScore(p=>p+1);
    setTimeout(()=>{
      if(cur<QUIZ_QUESTIONS.length-1){ setCur(p=>p+1); setSel(null); setRevealed(false); }
      else setDone(true);
      setAnim(false);
    },400);
  };

  const restart = () => { setCur(0); setSel(null); setScore(0); setDone(false); setRevealed(false); };

  const prog = (cur/QUIZ_QUESTIONS.length)*100;
  const pct = Math.round((score/QUIZ_QUESTIONS.length)*100);
  const result = pct>=80
    ? {msg:"You really pay attention — that's rare and beautiful.",emoji:'🌟',grad:'linear-gradient(135deg,#f59e0b,#ec4899)'}
    : pct>=60
    ? {msg:"There's definitely something worth exploring further.",emoji:'✨',grad:'linear-gradient(135deg,#a855f7,#6366f1)'}
    : {msg:"Maybe we need more conversations to discover each other better.",emoji:'💙',grad:'linear-gradient(135deg,#6366f1,#22d3ee)'};

  const optColors = ['#06b6d4','#8b5cf6','#ec4899','#f59e0b'];

  const getOptionState = (i) => {
    if(!revealed) return 'idle';
    if(i===QUIZ_QUESTIONS[cur].correctAnswer) return 'correct';
    if(i===sel && i!==QUIZ_QUESTIONS[cur].correctAnswer) return 'wrong';
    return 'dim';
  };

  return (
    <section id="quiz" ref={sectionRef} style={{position:'relative',overflow:'hidden',
      padding:'80px 0 120px',background:'linear-gradient(180deg,#04040a 0%,#060610 50%,#04040a 100%)'}}>
      <style>{`
        @keyframes qz-pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
        @keyframes qz-pop{0%{transform:scale(0.8);opacity:0;}100%{transform:scale(1);opacity:1;}}
        @keyframes qz-shake{0%,100%{transform:translateX(0);}20%{transform:translateX(-6px);}40%{transform:translateX(6px);}60%{transform:translateX(-4px);}80%{transform:translateX(4px);}}
        @keyframes qz-correct{0%{transform:scale(1);}50%{transform:scale(1.04);}100%{transform:scale(1);}}
      `}</style>

      <div style={{position:'absolute',inset:0,pointerEvents:'none',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'30%',left:'10%',width:400,height:400,borderRadius:'50%',opacity:0.05,
          background:'radial-gradient(circle,#22d3ee,transparent)',filter:'blur(80px)'}}/>
        <div style={{position:'absolute',bottom:'20%',right:'10%',width:350,height:350,borderRadius:'50%',opacity:0.04,
          background:'radial-gradient(circle,#6366f1,transparent)',filter:'blur(80px)'}}/>
      </div>

      <div style={{maxWidth:720,margin:'0 auto',padding:'0 24px'}}>
     
        <div style={{textAlign:'center',marginBottom:64,
          opacity:vis?1:0,transform:vis?'translateY(0)':'translateY(50px)',
          transition:'opacity 1.4s cubic-bezier(0.16,1,0.3,1),transform 1.4s cubic-bezier(0.16,1,0.3,1)'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 16px',borderRadius:999,marginBottom:20,
            background:'rgba(6,182,212,0.08)',border:'1px solid rgba(6,182,212,0.22)',
            color:'rgba(103,232,249,0.85)',fontSize:10,letterSpacing:'0.25em',textTransform:'uppercase'}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'#06b6d4',animation:'qz-pulse 2s infinite'}}/>
            Chapter 05 • Curious Minds
          </div>
          <h2 className="cinema-title" style={{fontSize:'clamp(40px,7vw,80px)',color:'#fff',lineHeight:1.05,marginBottom:16}}>
            How well do
            <span style={{display:'block',fontStyle:'italic',fontWeight:300,marginTop:4,
              background:'linear-gradient(135deg,#06b6d4,#6366f1 50%,#a855f7)',
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>you know?</span>
          </h2>
          <p style={{color:'rgba(255,255,255,0.35)',fontSize:13,fontWeight:300,letterSpacing:'0.06em'}}>
            A playful test of observation and connection
          </p>
        </div>

       
        <div style={{
          borderRadius:28,overflow:'hidden',
          background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.07)',
          boxShadow:'0 30px 80px rgba(0,0,0,0.5)',
          opacity:vis?1:0,transform:vis?'translateY(0)':'translateY(40px)',
          transition:'opacity 1s cubic-bezier(0.16,1,0.3,1) 200ms,transform 1s cubic-bezier(0.16,1,0.3,1) 200ms',
        }}>
          {!done ? (
            <>
             
              <div style={{height:3,background:'rgba(255,255,255,0.06)'}}>
                <div style={{height:'100%',
                  background:'linear-gradient(to right,#06b6d4,#6366f1,#a855f7)',
                  width:`${prog}%`,transition:'width 0.6s cubic-bezier(0.16,1,0.3,1)'}}/>
              </div>

              <div style={{padding:'40px 40px 36px'}}>
              
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:32}}>
                  <div style={{display:'flex',gap:8}}>
                    {QUIZ_QUESTIONS.map((_,i)=>(
                      <div key={i} style={{width:8,height:8,borderRadius:'50%',
                        background: i<cur?'#06b6d4': i===cur?'#fff':'rgba(255,255,255,0.15)',
                        transition:'background 0.4s ease',
                        transform: i===cur?'scale(1.3)':'scale(1)'}}/>
                    ))}
                  </div>
                  <span style={{fontSize:11,color:'rgba(255,255,255,0.3)',letterSpacing:'0.1em'}}>
                    {cur+1} / {QUIZ_QUESTIONS.length}
                  </span>
                </div>

                
                <div style={{
                  opacity:anim?0:1,transform:anim?'translateY(-12px)':'translateY(0)',
                  transition:'opacity 0.3s,transform 0.3s',marginBottom:32}}>
                  <p className="cinema-title" style={{fontSize:'clamp(18px,3vw,26px)',color:'#fff',
                    lineHeight:1.45,fontWeight:400,textAlign:'center'}}>
                    {QUIZ_QUESTIONS[cur].question}
                  </p>
                </div>

           
                <div style={{
                  display:'grid',gap:12,
                  opacity:anim?0:1,transition:'opacity 0.3s'}}>
                  {QUIZ_QUESTIONS[cur].options.map((opt,i)=>{
                    const state = getOptionState(i);
                    const col = optColors[i%optColors.length];
                    return (
                      <button key={i} onClick={()=>pick(i)}
                        style={{
                          padding:'16px 20px',textAlign:'left',borderRadius:14,
                          display:'flex',alignItems:'center',gap:14,
                          cursor: revealed?'default':'pointer',
                          background:
                            state==='correct' ? 'rgba(34,197,94,0.12)' :
                            state==='wrong'   ? 'rgba(239,68,68,0.1)' :
                            state==='dim'     ? 'rgba(255,255,255,0.02)' :
                            sel===i           ? `rgba(${col.replace('#','').match(/../g).map(x=>parseInt(x,16)).join(',')},0.12)` :
                            'rgba(255,255,255,0.035)',
                          border:
                            state==='correct' ? '1px solid rgba(34,197,94,0.5)' :
                            state==='wrong'   ? '1px solid rgba(239,68,68,0.5)' :
                            state==='dim'     ? '1px solid rgba(255,255,255,0.04)' :
                            sel===i           ? `1px solid ${col}66` :
                            '1px solid rgba(255,255,255,0.07)',
                          transition:'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                          animation:
                            state==='correct' ? 'qz-correct 0.4s ease' :
                            state==='wrong'   ? 'qz-shake 0.4s ease' : undefined,
                          opacity: state==='dim'?0.4:1,
                          transform: state==='correct'?'scale(1.01)':'scale(1)',
                          boxShadow: state==='correct'?'0 0 20px rgba(34,197,94,0.15)':
                            state==='wrong'?'0 0 15px rgba(239,68,68,0.12)':'none',
                        }}>
                       
                        <div style={{width:28,height:28,borderRadius:8,flexShrink:0,
                          display:'flex',alignItems:'center',justifyContent:'center',
                          fontSize:11,fontFamily:'monospace',fontWeight:600,
                          background:
                            state==='correct' ? 'rgba(34,197,94,0.25)' :
                            state==='wrong'   ? 'rgba(239,68,68,0.2)' :
                            'rgba(255,255,255,0.07)',
                          color:
                            state==='correct' ? '#4ade80' :
                            state==='wrong'   ? '#f87171' :
                            'rgba(255,255,255,0.5)',
                        }}>
                          {String.fromCharCode(65+i)}
                        </div>
                        <span style={{fontSize:14,fontWeight:300,color:
                          state==='correct'?'#86efac':
                          state==='wrong'?'#fca5a5':
                          state==='dim'?'rgba(255,255,255,0.4)':
                          '#fff'}}>
                          {opt}
                        </span>
                       
                        {state==='correct'&&<span style={{marginLeft:'auto',fontSize:16}}>✓</span>}
                        {state==='wrong'&&<span style={{marginLeft:'auto',fontSize:16}}>✗</span>}
                      </button>
                    );
                  })}
                </div>

              
                <button onClick={next}
                  disabled={!revealed||anim}
                  style={{
                    marginTop:28,width:'100%',height:52,borderRadius:14,
                    background: revealed?'linear-gradient(135deg,#06b6d4,#6366f1,#a855f7)':'rgba(255,255,255,0.05)',
                    border:'none',cursor:revealed?'pointer':'not-allowed',
                    color:revealed?'#fff':'rgba(255,255,255,0.2)',
                    fontSize:14,letterSpacing:'0.08em',fontWeight:400,
                    boxShadow:revealed?'0 0 30px rgba(6,182,212,0.25)':'none',
                    transform:revealed?'scale(1)':'scale(0.99)',
                    transition:'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                  }}>
                  {cur<QUIZ_QUESTIONS.length-1 ? 'Next Question →' : 'See My Score ✨'}
                </button>
              </div>
            </>
          ) : (
         
            <div style={{padding:'60px 40px',textAlign:'center',animation:'qz-pop 0.6s cubic-bezier(0.34,1.56,0.64,1)'}}>
              <div style={{fontSize:72,marginBottom:20}}>{result.emoji}</div>
              <h3 className="cinema-title" style={{fontSize:32,color:'#fff',marginBottom:28}}>Your Score</h3>
              <div style={{fontSize:80,fontWeight:300,marginBottom:12,lineHeight:1,
                background:result.grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                {score}/{QUIZ_QUESTIONS.length}
              </div>
              <div style={{width:200,height:4,borderRadius:2,background:'rgba(255,255,255,0.08)',margin:'0 auto 12px'}}>
                <div style={{height:'100%',borderRadius:2,background:result.grad,
                  width:`${pct}%`,transition:'width 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s'}}/>
              </div>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.3)',marginBottom:32}}>{pct}% correct</div>
              <p className="cinema-title" style={{fontSize:18,color:'rgba(255,255,255,0.65)',
                maxWidth:360,margin:'0 auto 40px',lineHeight:1.6,fontStyle:'italic',fontWeight:300}}>
                "{result.msg}"
              </p>
              <button onClick={restart}
                style={{padding:'14px 36px',borderRadius:14,
                  background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.12)',
                  color:'rgba(255,255,255,0.7)',fontSize:14,cursor:'pointer',
                  transition:'all 0.3s ease'}}
                onMouseEnter={e=>{e.target.style.background='rgba(255,255,255,0.1)';e.target.style.color='#fff';}}
                onMouseLeave={e=>{e.target.style.background='rgba(255,255,255,0.05)';e.target.style.color='rgba(255,255,255,0.7)';}}>
                Try Again 🔄
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
export default Quiz;
