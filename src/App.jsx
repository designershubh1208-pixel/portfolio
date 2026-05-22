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
    let doneTimeout;
    const timeout = setTimeout(() => {
      setLoading(false);
      doneTimeout = setTimeout(() => setPreloaderDone(true), 760);
    }, 900);
    return () => {
      clearTimeout(timeout);
      clearTimeout(doneTimeout);
    };
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
      <div
        style={{
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.75s cubic-bezier(.77,0,.18,1)',
        }}
      >
        <Portfolio heroRef={heroRef} />
      </div>
    </>
  );
}

function Preloader({ percent, loading, transitioning, preloaderTextRef }) {
  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 9999,
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, var(--bg-ivory) 0%, var(--bg-cream) 100%)',
        overflow: 'hidden',
        transition: 'opacity 0.7s cubic-bezier(.77,0,.18,1), transform 0.7s cubic-bezier(.77,0,.18,1)',
        opacity: loading ? 1 : 0,
        transform: loading ? 'scale(1) translateY(0)' : 'scale(0.99) translateY(-10px)',
      }}
    >
      {/* Grain overlay (local, no external assets) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.075,
          mixBlendMode: 'multiply',
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'180\' height=\'180\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'180\' height=\'180\' filter=\'url(%23n)\' opacity=\'.32\'/%3E%3C/svg%3E")',
        }}
      />
      {/* Editorial frame */}
      <div
        style={{
          position: 'absolute',
          inset: 'var(--pad)',
          pointerEvents: 'none',
          zIndex: 2,
          border: '1px solid rgba(23, 21, 19, 0.16)',
          borderRadius: 'var(--radius)',
        }}
      />
      {/* Loading percentage under the border */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 'calc(2.5vh - 2px)', // just under the border
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 'clamp(1.8rem, 4.2vw, 3rem)',
          color: 'var(--ink)',
          opacity: loading && !transitioning ? 0.16 : 0,
          transition: 'opacity 0.5s cubic-bezier(.77,0,.18,1)',
          zIndex: 3,
          userSelect: 'none',
          letterSpacing: '0.12em',
        }}
      >
        {percent}%
      </div>
      {/* Main text: Only ShubhSanket, centered, bigger, animates to hero */}
      <div
        style={{
          position: 'relative',
          zIndex: 4,
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
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(2.2rem, 8.8vw, 7.2rem)',
            letterSpacing: '0.22em',
            lineHeight: 1.08,
            textTransform: 'uppercase',
            color: 'var(--ink)',
            textAlign: 'center',
            willChange: 'transform, opacity',
            maxWidth: '100%',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            padding: '0 2vw',
            boxSizing: 'border-box',
          }}
        >
          SHUBH SANKET
        </div>
      </div>
    </div>
  );
}

export default App;