'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ThreeDShape() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 0.8]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-64 h-64 md:w-96 md:h-96"
      >
        {/* Cube faces */}
        <div className="absolute inset-0 transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
          {/* Front */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl"
            style={{ transform: 'translateZ(128px)' }}
          />
          {/* Back */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl"
            style={{ transform: 'translateZ(-128px) rotateY(180deg)' }}
          />
          {/* Right */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl"
            style={{ transform: 'rotateY(90deg) translateZ(128px)' }}
          />
          {/* Left */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl"
            style={{ transform: 'rotateY(-90deg) translateZ(128px)' }}
          />
          {/* Top */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-500/30 rounded-2xl"
            style={{ transform: 'rotateX(90deg) translateZ(128px)' }}
          />
          {/* Bottom */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm border border-pink-500/30 rounded-2xl"
            style={{ transform: 'rotateX(-90deg) translateZ(128px)' }}
          />
        </div>

        {/* Inner cube for depth */}
        <div 
          className="absolute inset-8 md:inset-12"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl"
            style={{ transform: 'translateZ(64px)' }}
          />
        </div>
      </motion.div>
    </div>
  );
}