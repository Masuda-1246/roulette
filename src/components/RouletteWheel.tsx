import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { RouletteItem } from '../types';

interface Props {
  items: RouletteItem[];
  onSpinEnd?: (item: RouletteItem) => void;
}

export const RouletteWheel: React.FC<Props> = ({ items, onSpinEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let currentAngle = rotation;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    items.forEach(item => {
      const sliceAngle = (2 * Math.PI * item.weight) / totalWeight;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      
      ctx.fillStyle = item.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(currentAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = '14px Arial';
      ctx.fillText(item.text, radius - 20, 5);
      ctx.restore();

      currentAngle += sliceAngle;
    });

    // Draw center point
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }, [items, rotation, totalWeight]);

  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const spinDuration = 3000;
    const startRotation = rotation;
    const totalRotation = 360 * 5 + Math.random() * 360; // 5-6 full rotations
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      // Easing function for smooth deceleration
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const currentRotation = startRotation + totalRotation * easeOut(progress);
      
      setRotation(currentRotation * (Math.PI / 180));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        
        // Calculate winning item based on final position
        const normalizedRotation = (currentRotation % 360 + 360) % 360;
        const finalAngle = (360 - normalizedRotation + 90) % 360; // Adjust for bottom pointer
        let currentAngle = 0;
        
        const winner = items.find(item => {
          const sliceAngle = (360 * item.weight) / totalWeight;
          currentAngle += sliceAngle;
          return finalAngle <= currentAngle;
        });

        if (winner && onSpinEnd) {
          onSpinEnd(winner);
        }
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-[300px]">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="max-w-full"
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 z-10">
          <ChevronUp className="text-blue-600" size={32} strokeWidth={3} />
        </div>
      </div>
      <button
        onClick={spin}
        disabled={isSpinning}
        className={`
          bg-blue-600 text-white rounded-full px-8 py-3 text-lg font-semibold
          hover:bg-blue-700 transition-colors shadow-lg
          ${isSpinning ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isSpinning ? 'スピン中...' : 'スピン！'}
      </button>
    </div>
  );
};