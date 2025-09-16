// src/App.jsx
import React, { useState, useEffect, useRef } from "react";
import WelcomeScreen from "./components/WelcomeScreen.jsx";
import QuestionCard from "./components/QuestionCard.jsx";
import SurveyComplete from "./components/SurveyComplete.jsx";
import ResponsesPage from "./components/ResponsesPage.jsx";
import surveyQuestions from "./data/questions.json";

/**
 * App.jsx - integrated gamified background + custom cursor + gamification features
 * - Score / XP / Achievements
 * - Quick-answer bonus (within 10s)
 * - Animated score badge + XP bar, achievements toast
 * - Preserves survey flow & background canvas
 */

const THEME = {
  bg: "#05060A",
  card: "#071017",
  text: "#E9F8FF",
  muted: "#9FB7C7",
  primary: "#8B5CF6",
  cyan: "#06B6D4",
  accent: "#00E5FF",
  warm: "#FFB86B",
};

function lerp(a, b, n) { return (1 - n) * a + n * b; }
function hexToRgb(hex) {
  const h = hex.replace('#','');
  return [parseInt(h.substring(0,2),16), parseInt(h.substring(2,4),16), parseInt(h.substring(4,6),16)];
}
function randPaletteRgb() {
  const pal = [THEME.primary, THEME.cyan, THEME.accent, THEME.warm];
  return hexToRgb(pal[Math.floor(Math.random()*pal.length)]);
}

/* ---------- Simple Custom Cursor (desktop only) ---------- */
function CustomCursor() {
  const ring = useRef(null);
  const dot = useRef(null);
  const raf = useRef(null);
  const target = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth/2 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight/2 : 0,
  });
  const isTouch = (typeof window !== 'undefined') && (('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0));

  useEffect(() => {
    if (isTouch) return; // don't show custom cursor on touch

    function onMove(e){ target.current.x = e.clientX; target.current.y = e.clientY; }
    function onHover(e){
      const t = e.target;
      if(t && t.closest && t.closest('button, a, [role="button"]')) {
        ring.current && (ring.current.dataset.type = 'button');
      } else if(t && t.closest && t.closest('input, textarea, select, .no-brick')) {
        ring.current && (ring.current.dataset.type = 'form');
      } else {
        ring.current && (ring.current.dataset.type = 'default');
      }
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onHover);

    let px = target.current.x, py = target.current.y;
    const lerpF = 0.18;
    function loop(){
      px = lerp(px, target.current.x, lerpF);
      py = lerp(py, target.current.y, lerpF);
      if(ring.current && dot.current){
        const type = ring.current.dataset.type || 'default';
        const scale = (type === 'button') ? 1.35 : (type === 'form' ? 1.12 : 1.0);
        ring.current.style.transform = `translate3d(${px - 22}px, ${py - 22}px, 0) scale(${scale})`;
        dot.current.style.transform = `translate3d(${px - 6}px, ${py - 6}px, 0)`;
      }
      raf.current = requestAnimationFrame(loop);
    }
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onHover);
      cancelAnimationFrame(raf.current);
    };
  }, [isTouch]);

  useEffect(() => {
    if(isTouch) return;
    document.documentElement.classList.add('custom-cursor-hide');
    return () => document.documentElement.classList.remove('custom-cursor-hide');
  }, [isTouch]);

  if(isTouch) return null;

  return (
    <>
      <div
        ref={ring}
        style={{
          position:'fixed', left:0, top:0, width:44, height:44,
          borderRadius:9999, pointerEvents:'none', zIndex:1000005,
          transform:`translate3d(${(typeof window !== 'undefined' ? window.innerWidth/2 : 0) - 22}px, ${(typeof window !== 'undefined' ? window.innerHeight/2 : 0) - 22}px, 0)`,
          transition:'transform 120ms linear, box-shadow 180ms, opacity 160ms',
          boxShadow:'0 8px 30px rgba(12,18,26,0.55)',
          background:'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
          border:'1px solid rgba(255,255,255,0.06)',
          display:'flex', alignItems:'center', justifyContent:'center'
        }}
        data-type="default"
      >
        <svg width="44" height="44" viewBox="0 0 44 44" style={{ display:'block' }}>
          <defs>
            <linearGradient id="cursorRingG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.18" />
            </linearGradient>
          </defs>
          <circle cx="22" cy="22" r="16" stroke="url(#cursorRingG)" strokeWidth="1.6" fill="none" />
        </svg>
      </div>

      <div
        ref={dot}
        style={{
          position:'fixed', left:0, top:0, width:12, height:12, borderRadius:9999,
          pointerEvents:'none', zIndex:1000006,
          transform:`translate3d(${(typeof window !== 'undefined' ? window.innerWidth/2 : 0) - 6}px, ${(typeof window !== 'undefined' ? window.innerHeight/2 : 0) - 6}px, 0)`,
          transition:'transform 90ms linear, background 160ms',
          background:'#FFFFFF', border:'1px solid rgba(0,0,0,0.12)',
          boxShadow:'0 6px 18px rgba(6,182,212,0.10), inset 0 1px 0 rgba(255,255,255,0.7)'
        }}
      />

      <style>{`.custom-cursor-hide, .custom-cursor-hide * { cursor: none !important; }
        @media (hover: none) { .custom-cursor-hide, .custom-cursor-hide * { cursor: auto !important; } }
      `}</style>
    </>
  );
}

/* ---------- Main App ---------- */
export default function App() {
  // survey state
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [showResponses, setShowResponses] = useState(false);

  // gamification state
  const [score, setScore] = useState(() => Number(localStorage.getItem('surveyScore') || 0));
  const [xp, setXp] = useState(() => Number(localStorage.getItem('surveyXP') || 0));
  const [achievements, setAchievements] = useState(() => {
    try { return JSON.parse(localStorage.getItem('surveyAchievements') || '[]'); } catch { return []; }
  });
  const [pulseScore, setPulseScore] = useState(false);
  const [achievementToast, setAchievementToast] = useState(null);

  // canvas & cursor refs
  const bgCanvas = useRef(null);
  const [height, setHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);

  // track when a question became visible (for quick-answer bonus)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  useEffect(()=> {
    function onResize(){ setHeight(window.innerHeight); }
    window.addEventListener('resize', onResize);
    return ()=> window.removeEventListener('resize', onResize);
  }, []);

  // simple global cursor copy for canvas reaction
  useEffect(()=> {
    const cur = { x: window.innerWidth/2, y: window.innerHeight/2 };
    function onMove(e){ cur.x = e.clientX; cur.y = e.clientY; window._gamifiedCursor = cur; }
    window.addEventListener('pointermove', onMove);
    window._gamifiedCursor = cur;
    return ()=> { window.removeEventListener('pointermove', onMove); delete window._gamifiedCursor; };
  }, []);

  // persist gamification
  useEffect(()=> { localStorage.setItem('surveyScore', String(score)); }, [score]);
  useEffect(()=> { localStorage.setItem('surveyXP', String(xp)); }, [xp]);
  useEffect(()=> { localStorage.setItem('surveyAchievements', JSON.stringify(achievements)); }, [achievements]);

  // pulse animation helper
  function pulse() {
    setPulseScore(true);
    setTimeout(()=> setPulseScore(false), 650);
  }

  // achievements thresholds
  const ACHIEVEMENTS = [
    { id: 'bronze', name: 'Bronze Contributor', score: 50 },
    { id: 'silver', name: 'Silver Contributor', score: 120 },
    { id: 'gold', name: 'Gold Contributor', score: 250 },
  ];
  function maybeUnlockAchievements(newScore) {
    for (const a of ACHIEVEMENTS) {
      if (newScore >= a.score && !achievements.find(x=>x.id===a.id)) {
        setAchievements(prev => { const next = [...prev, a]; return next; });
        setAchievementToast(a.name);
        setTimeout(()=> setAchievementToast(null), 3600);
      }
    }
  }

  // scoring logic (uses question.points if available)
  function computePointsForAnswer(question, answer, timeMs) {
    let base = 0;
    if (question.points) {
      if (typeof question.points === 'object') {
        // mapping for multiple-choice choices mapped by text/value
        base = question.points[answer] || 8;
      } else if (typeof question.points === 'number') {
        base = question.points;
      } else base = 8;
    } else {
      if (question.type === 'multiple-choice' || question.type === 'mcq') base = 10;
      else if (question.type === 'rating') base = (question.pointsPerStar || 2) * (answer || 1);
      else if (question.type === 'text') base = 8;
      else base = 6;
    }
    // quick-answer bonus
    const bonus = timeMs < 10000 ? 5 : 0;
    // XP ~ base * 2 + bonus
    const xpGain = Math.max(6, Math.round(base * 1.7)) + bonus;
    return { points: base + bonus, xpGain };
  }

  /* ---------- Canvas bricks background (kept similar to the earlier integrated version) ---------- */
  useEffect(()=> {
    const canvas = bgCanvas.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = window.innerWidth, H = window.innerHeight;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.2);

    function resizeCanvas(){
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      ctx.setTransform(1,0,0,1,0,0);
      ctx.scale(DPR, DPR);
    }
    resizeCanvas();

    let BRW = window.innerWidth < 640 ? 120 : 96;
    let BRH = window.innerWidth < 640 ? 56 : 44;
    let cols = Math.ceil(W / BRW), rows = Math.ceil(H / BRH);
    const MAX = 700;
    if(cols * rows > MAX){
      const scaleUp = Math.sqrt((cols * rows)/MAX);
      BRW = Math.ceil(BRW * scaleUp);
      BRH = Math.ceil(BRH * scaleUp);
      cols = Math.ceil(W / BRW);
      rows = Math.ceil(H / BRH);
    }

    const paletteHex = [THEME.primary, THEME.cyan, THEME.accent, THEME.warm];
    const bricks = [];
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        const x = c*BRW + (r%2?BRW/2:0);
        const y = r*BRH;
        const cx = x + BRW/2;
        const cy = y + BRH/2;
        const colorHex = paletteHex[Math.floor(Math.random()*paletteHex.length)];
        const [r0,g0,b0] = hexToRgb(colorHex);
        const mix = Math.random();
        bricks.push({ x, y, w:BRW, h:BRH, cx, cy, baseX:x, baseY:y, phase:Math.random()*Math.PI*2, vy:0, pop:0, gone:false, falling:false, fallVy:0, fallY:0, opacity:1, col:[r0,g0,b0], mix, rIdx:r, cIdx:c });
      }
    }

    canvas._triggerPop = function(px, py){
      let nearest = null; let best = Infinity;
      for(const b of bricks){ if(b.gone) continue; const dx = b.cx - px; const dy = b.cy - py; const d = Math.hypot(dx,dy); if(d < best){ best = d; nearest = b; } }
      if(!nearest) return;
      const targets = [];
      for(let rr=0; rr<2; rr++){
        for(let cc=0; cc<2; cc++){
          const rIdx = nearest.rIdx + rr; const cIdx = nearest.cIdx + cc;
          if(rIdx < 0 || cIdx < 0 || rIdx >= rows || cIdx >= cols) continue;
          const idx = rIdx * cols + cIdx; const b = bricks[idx]; if(b && !b.gone && !b.falling) targets.push(b);
        }
      }
      for(const t of targets){ t.falling = true; t.fallVy = 220 + Math.random()*240; t.fallY = 0; t.pop = Math.max(t.pop, 0.6); }
      const R = 160;
      for(const b of bricks){ if(b.gone || b.falling) continue; const dx = b.cx - px; const dy = b.cy - py; const d = Math.hypot(dx,dy); if(d < R){ const norm = 1 - d / R; b.pop = Math.max(b.pop, 0.35 * norm + 0.02); b.vy += (6 * norm) + (Math.random()*3); } }
    };

    function onPointerMove(e){
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      let nearest = null; let best = Infinity;
      for(const b of bricks){ if(b.gone) continue; const d = Math.hypot(b.cx - px, b.cy - py); if(d < best){ best = d; nearest = b; } }
      if(nearest && best < Math.max(48, Math.min(W,H) * 0.06)){
        const newCol = randPaletteRgb();
        nearest.col = newCol;
        nearest.mix = Math.random();
      }
    }
    window.addEventListener('pointermove', onPointerMove);

    let lastT = performance.now();
    const FRAME_CAP = 40;
    const FRAME_MS = 1000 / FRAME_CAP;
    let raf = null;
    const startTime = performance.now();

    function roundRect(ctx,x,y,w,h,r){
      const minr = Math.min(r, w/2, h/2);
      ctx.beginPath();
      ctx.moveTo(x+minr,y);
      ctx.arcTo(x+w,y,x+w,y+h,minr);
      ctx.arcTo(x+w,y+h,x,y+h,minr);
      ctx.arcTo(x,y+h,x,y,minr);
      ctx.arcTo(x,y,x+ w,y,minr);
      ctx.closePath();
    }

    function draw(now){
      if(now - lastT < FRAME_MS){ raf = requestAnimationFrame(draw); return; }
      const dt = Math.min(40, now - lastT) * 0.001; lastT = now;
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = 'rgba(4,6,10,0.46)';
      ctx.fillRect(0,0,W,H);

      const time = now * 0.001;
      const maxD = Math.max(W,H) * 0.6;
      for(const b of bricks){
        if(b.gone) continue;
        if(b.falling){
          b.fallVy += 900 * dt;
          b.fallY += b.fallVy * dt;
          b.opacity = Math.max(0, 1 - (b.fallY / (H * 1.2)));
          if(b.fallY > H + 120){ b.gone = true; continue; }
        }
        const dx = b.cx - (window._gamifiedCursor?.x || (W/2));
        const dy = b.cy - (window._gamifiedCursor?.y || (H/2));
        const d = Math.hypot(dx,dy);
        let t = Math.max(0, 1 - d / maxD); t = Math.pow(t, 0.95);
        b.vy *= 0.92;
        b.vy -= 20 * dt * t;
        b.pop = Math.max(0, b.pop - 0.02);
        const lift = b.falling ? 0 : Math.min(14, 10 * t + b.pop * 20);
        const freq = 6;
        const ampX = 6 * (0.6 + 0.6 * b.mix) * t * 0.45;
        const ampY = (6 * 0.45) * (0.5 + 0.5 * b.mix) * t;
        const vibrateX = (b.falling ? 0 : Math.sin(time * freq + b.phase) * ampX);
        const vibrateY = (b.falling ? 0 : Math.cos(time * freq * 1.1 + b.phase) * ampY);
        const px = b.baseX + vibrateX;
        const py = b.baseY + vibrateY - lift + b.vy * dt * 50 + (b.falling ? b.fallY : 0);
        const r = Math.max(6, Math.min(255, Math.round(b.col[0] + Math.sin(time*0.6 + b.phase)*5)));
        const g = Math.max(6, Math.min(255, Math.round(b.col[1] + Math.cos(time*0.62 + b.phase)*5)));
        const bb = Math.max(6, Math.min(255, Math.round(b.col[2] + Math.sin(time*0.64 + b.phase)*5)));
        const alpha = (b.opacity !== undefined ? b.opacity : 1) * (0.98 - (1 - t) * 0.08);
        const grad = ctx.createLinearGradient(px+6,py+6,px + b.w - 6, py + b.h - 6);
        grad.addColorStop(0, `rgba(${Math.max(0,r-16)}, ${Math.max(0,g-16)}, ${Math.max(0,bb-16)}, ${alpha})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${bb}, ${alpha})`);
        ctx.save();
        if(b.falling){
          ctx.translate(px + b.w/2, py + b.h/2);
          ctx.rotate((b.phase % 1) * (b.fallY / (H/3)) * 0.4 );
          ctx.translate(-(px + b.w/2), -(py + b.h/2));
        }
        ctx.fillStyle = grad; roundRect(ctx, px+6, py+6, b.w - 12, b.h - 12, 6); ctx.fill();
        if(t > 0.06 && !b.falling){ ctx.fillStyle = `rgba(255,255,255,${0.02 * t + 0.02 * b.pop})`; ctx.fillRect(px+12, py+10, b.w - 24, Math.max(2, Math.min(5, 3 * t))); }
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);

    function onPointerDown(e){
      const inUI = e.target && e.target.closest && e.target.closest('button, input, textarea, select, [role="button"], .no-brick');
      if(inUI) return;
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      canvas._triggerPop(px, py);
    }
    window.addEventListener('pointerdown', onPointerDown);

    function onResize(){
      resizeCanvas();
    }
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(raf);
    };
  }, [height]);

  /* ---------- Survey handlers + gamification ---------- */
  const handleStart = () => {
    setStarted(true);
    setSurveyCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResponses(false);
    setQuestionStartTime(Date.now());
  };

  const handleAnswer = (answer) => {
    const question = surveyQuestions[currentQuestionIndex];
    const timeTaken = Date.now() - questionStartTime;
    const { points, xpGain } = computePointsForAnswer(question, answer, timeTaken);

    // award
    setScore(s => {
      const next = s + points;
      maybeUnlockAchievements(next);
      return next;
    });
    setXp(x => x + xpGain);
    pulse();

    // save answer
    const updatedAnswers = { ...answers, [question.id]: answer };
    setAnswers(updatedAnswers);

    // advance
    if (currentQuestionIndex < surveyQuestions.length - 1) {
      setCurrentQuestionIndex(idx => {
        const nextIdx = idx + 1;
        // reset question start time for next
        setQuestionStartTime(Date.now());
        return nextIdx;
      });
    } else {
      setStarted(false);
      setSurveyCompleted(true);
      console.log("Survey Completed! Answers:", updatedAnswers);
    }
  };

  const handleTakeSurveyAgain = () => {
    setSurveyCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResponses(false);
    setQuestionStartTime(Date.now());
  };

  const handleViewResponses = () => setShowResponses(true);
  const handleGoBackFromResponses = () => setShowResponses(false);

  const handleNext = () => {
    if (currentQuestionIndex < surveyQuestions.length - 1) {
      setCurrentQuestionIndex(i => { setQuestionStartTime(Date.now()); return i+1; });
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(i => { setQuestionStartTime(Date.now()); return i-1; });
    }
  };

  const renderContent = () => {
    if (showResponses) {
      return (
        <ResponsesPage
          questions={surveyQuestions}
          answers={answers}
          onGoBack={handleGoBackFromResponses}
          onStartNewSurvey={handleTakeSurveyAgain}
          score={score}
          xp={xp}
          achievements={achievements}
        />
      );
    } else if (surveyCompleted) {
      return (
        <SurveyComplete
          onTakeSurveyAgain={handleTakeSurveyAgain}
          onViewResponses={handleViewResponses}
          score={score}
          xp={xp}
          achievements={achievements}
        />
      );
    } else if (started) {
      const question = surveyQuestions[currentQuestionIndex];
      return (
        <QuestionCard
          question={question}
          questionsLength={surveyQuestions.length}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          handleAnswer={handleAnswer}
          handleNext={handleNext}
          handlePrev={handlePrev}
          questionStartTime={questionStartTime}
        />
      );
    } else {
      return <WelcomeScreen onStart={handleStart} score={score} xp={xp} achievements={achievements} />;
    }
  };

  /* ---------- UI: score badge + xp bar + toast ---------- */
  return (
    <div className="relative min-h-screen w-full font-sans bg-[#130E26] overflow-y-auto">
      {/* Fullscreen bricks canvas behind everything */}
      <canvas
        ref={bgCanvas}
        className="fixed inset-0"
        style={{
          pointerEvents: 'none',
          zIndex: 0,
          left:0,
          top:0,
          width:'100%',
          height:'100%',
          position:'fixed',
          mixBlendMode:'normal'
        }}
      />

      {/* Custom desktop cursor */}
      <CustomCursor />

      {/* Top-left HUD */}
      <div style={{ position:'fixed', left:16, top:16, zIndex:400, display:'flex', flexDirection:'column', gap:10, alignItems:'flex-start' }}>
        <div
          id="score-badge"
          onClick={() => { /* future: open achievements modal */ }}
          style={{
            padding:'8px 12px', borderRadius:9999, background:'linear-gradient(90deg, rgba(6,182,212,0.12), rgba(139,92,246,0.08))', fontWeight:900,
            display:'flex', gap:10, alignItems:'center', cursor:'default', transform: pulseScore ? 'scale(1.06)' : 'scale(1)', transition:'transform 260ms cubic-bezier(.2,.9,.2,1)'
          }}
        >
          <div style={{ fontSize:14, color:'#E8FBFF', letterSpacing:0.4 }}>⭐ {score} pts</div>
          <div style={{ fontSize:12, color:THEME.muted }}>{achievements.length} badges</div>
        </div>

        <div style={{ width:220, background:'rgba(255,255,255,0.04)', borderRadius:999, padding:6 }}>
          <div style={{ fontSize:11, color:THEME.muted, marginBottom:6 }}>XP {xp}</div>
          <div style={{ height:8, width:'100%', background:'rgba(255,255,255,0.02)', borderRadius:999 }}>
            <div style={{ width: `${Math.min(100, (xp % 100))}%`, height:'100%', borderRadius:999, background:'linear-gradient(90deg,' + THEME.cyan + ',' + THEME.primary + ')' }} />
          </div>
        </div>
      </div>

      {/* temporary achievement toast */}
      {achievementToast && (
        <div style={{ position:'fixed', right:20, top:18, zIndex:450, background:'#071017', color:THEME.text, padding:'10px 14px', borderRadius:12, boxShadow:'0 10px 34px rgba(2,6,12,0.56)', display:'flex', gap:10, alignItems:'center' }}>
          <div style={{ width:36, height:36, borderRadius:999, background:'linear-gradient(90deg,' + THEME.cyan + ',' + THEME.primary + ')', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#02171A' }}>✓</div>
          <div>
            <div style={{ fontWeight:800 }}>{achievementToast}</div>
            <div style={{ fontSize:12, color:THEME.muted }}>New achievement unlocked</div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex justify-center px-4 py-8">
        <div className="w-full max-w-2xl">{renderContent()}</div>
      </div>
    </div>
  );
}

