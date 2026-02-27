import Portfolio from './Portfolio'
import { useState, useEffect, useRef } from 'react';

function App() {
  const [loading, setLoading] = useState(true);
  const [percent, setPercent] = useState(0);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const heroRef = useRef();
  const preloaderTextRef = useRef();

  useEffect(() => {
    if (!loading) return;
    let start = null;
    const duration = 2200; // 2.2s
    function animate(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setPercent(Math.floor(progress * 100));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setPercent(100);
        setTimeout(() => {
          setTransitioning(true);
        }, 400);
      }
    }
    requestAnimationFrame(animate);
  }, [loading]);

  // After transition, remove preloader
  useEffect(() => {
    if (!transitioning) return;
    // Wait for the transition animation to finish
    const timeout = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setPreloaderDone(true), 400);
    }, 900);
    return () => clearTimeout(timeout);
  }, [transitioning]);

  // Get hero headline position for animation
  useEffect(() => {
    if (!transitioning || !preloaderTextRef.current || !heroRef.current) return;
    const pre = preloaderTextRef.current;
    const hero = heroRef.current;
    const preRect = pre.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();
    const dx = heroRect.left + heroRect.width / 2 - (preRect.left + preRect.width / 2);
    const dy = heroRect.top + heroRect.height / 2 - (preRect.top + preRect.height / 2);
    const scale = heroRect.width / preRect.width;
    pre.style.transition = 'transform 0.85s cubic-bezier(.77,0,.18,1), opacity 0.7s cubic-bezier(.77,0,.18,1)';
    pre.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    pre.style.opacity = '0.98';
  }, [transitioning]);

  return (
    <>
      {!preloaderDone && (
        <Preloader
          percent={percent}
          loading={loading}
          transitioning={transitioning}
          preloaderTextRef={preloaderTextRef}
        />
      )}
      <div style={{ opacity: preloaderDone ? 1 : 0, transition: 'opacity 0.5s cubic-bezier(.77,0,.18,1)' }}>
        <Portfolio heroRef={heroRef} />
      </div>
    </>
  );
}

function Preloader({ percent, loading, transitioning, preloaderTextRef }) {
  // Gradient and noise background
  // Typography matches hero
  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 9999,
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0B0B1A 0%, #111122 100%)',
        overflow: 'hidden',
        transition: loading ? 'none' : 'opacity 0.7s cubic-bezier(.77,0,.18,1), transform 0.7s cubic-bezier(.77,0,.18,1)',
        opacity: loading || transitioning ? 1 : 0,
        pointerEvents: loading || transitioning ? 'auto' : 'none',
        transform: loading || transitioning ? 'scale(1) translateY(0)' : 'scale(0.98) translateY(-40px)',
      }}
    >
      {/* Noise overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'url("https://www.transparenttextures.com/patterns/noise.png")',
        opacity: 0.13,
        zIndex: 1,
      }} />
      {/* Loading percentage under the border */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 'calc(2.5vh - 2px)', // just under the border
          transform: 'translateX(-50%)',
          fontFamily: 'Syne, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
          color: '#fff',
          opacity: loading && !transitioning ? 0.18 : 0,
          transition: 'opacity 0.5s cubic-bezier(.77,0,.18,1)',
          zIndex: 2,
          userSelect: 'none',
          letterSpacing: '0.01em',
          textShadow: '0 2px 16px rgba(59,130,246,0.12)',
        }}
      >
        {percent}%
      </div>
      {/* Main text: Only ShubhSanket, centered, bigger, animates to hero */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw',
          height: '100vh',
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        <div
          ref={preloaderTextRef}
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(2.5rem, 10vw, 7.5rem)',
            letterSpacing: '0.01em',
            lineHeight: 1.08,
            background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            opacity: loading ? 0.97 : 0,
            transform: loading ? 'translateY(0px)' : 'translateY(-30px)',
            transition: transitioning
              ? undefined
              : 'opacity 0.7s cubic-bezier(.77,0,.18,1), transform 0.7s cubic-bezier(.77,0,.18,1)',
            textAlign: 'center',
            willChange: transitioning ? 'transform, opacity' : undefined,
            maxWidth: '100%',
            overflow: 'hidden',
            whiteSpace: 'pre-line',
            wordBreak: 'break-word',
            hyphens: 'auto',
            padding: '0 2vw',
            boxSizing: 'border-box',
          }}
        >
          ShubhSanket
        </div>
      </div>
    </div>
  );
}

export default App;