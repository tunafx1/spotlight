/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Maximize2, Minimize2, Move, Eye, EyeOff } from 'lucide-react';

export default function App() {
  const [size, setSize] = useState(300);
  const [opacity, setOpacity] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [blur, setBlur] = useState(0);
  const [color, setColor] = useState('#ffffff');
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Center the spotlight initially
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setPosition({ x: width / 2, y: height / 2 });
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    setSize((prev) => {
      const delta = e.deltaY > 0 ? -20 : 20;
      const newSize = Math.max(10, Math.min(2000, prev + delta));
      return newSize;
    });
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const palette = [
    '#ffffff', '#ff0000', '#00ff00', '#0000ff', 
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500'
  ];

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden cursor-none select-none outline-none"
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onWheel={handleWheel}
      onKeyDown={(e) => {
        if (e.key === 'h') setShowControls(!showControls);
        if (e.key === 'f') toggleFullScreen();
      }}
      tabIndex={0}
    >
      {/* The Spotlight */}
      <motion.div
        drag
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          opacity: opacity,
          borderRadius: '50%',
          position: 'absolute',
          left: position.x - size / 2,
          top: position.y - size / 2,
          filter: `blur(${blur}px)`,
          boxShadow: `0 0 ${blur * 2}px ${color}`,
        }}
        className="cursor-grab active:cursor-grabbing"
      />

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-6 right-6 w-72 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 text-zinc-100 shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-zinc-400" />
                <h2 className="font-semibold tracking-tight">Spotlight Ayarları</h2>
              </div>
              <button 
                onClick={() => setShowControls(false)}
                className="p-1 hover:bg-zinc-800 rounded-lg transition-colors"
                title="Gizle (H)"
              >
                <EyeOff className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Size Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  <span>Boyut</span>
                  <span>{size}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>

              {/* Opacity Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  <span>Şeffaflık</span>
                  <span>{Math.round(opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>

              {/* Blur Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  <span>Yumuşaklık (Blur)</span>
                  <span>{blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>

              {/* Color Control */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  <span>Renk Paleti</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {palette.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      style={{ backgroundColor: c }}
                      className={`h-8 rounded-lg border-2 transition-all ${
                        color === c ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2 items-center pt-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 bg-transparent border-none cursor-pointer rounded-lg overflow-hidden shrink-0"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex gap-2">
                <button
                  onClick={toggleFullScreen}
                  className="flex-1 flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 py-2 rounded-xl font-medium transition-colors text-sm"
                >
                  <Maximize2 className="w-4 h-4" />
                  Tam Ekran
                </button>
              </div>
            </div>

            <div className="mt-6 text-[10px] text-zinc-500 text-center leading-relaxed">
              İpucu: Gizlemek için 'H', Tam ekran için 'F' tuşuna basın.
              <br />
              Daireyi sürükleyerek taşıyabilir, 
              <br />
              <span className="text-zinc-300 font-medium">fare tekerleği</span> ile boyutlandırabilirsiniz.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show Controls Button (when hidden) */}
      {!showControls && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          whileHover={{ opacity: 1 }}
          onClick={() => setShowControls(true)}
          className="absolute top-6 right-6 p-3 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-all shadow-lg cursor-pointer"
        >
          <Eye className="w-5 h-5" />
        </motion.button>
      )}

      {/* Helper for positioning */}
      <div className="absolute bottom-6 left-6 text-[10px] text-zinc-700 font-mono pointer-events-none uppercase tracking-widest">
        X: {Math.round(position.x)} Y: {Math.round(position.y)}
      </div>
    </div>
  );
}
