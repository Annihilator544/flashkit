import { LucideGauge, LucideGaugeCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const CircularProgress = ({ score = 79, startColor = "#ff9a9e", endColor = "#fad0c4" }) => {
  const [currentScore, setCurrentScore] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  // Reduced dimensions by 3/4
  const radius = 80; // Reduced from 90
  const strokeWidth = 10; // Reduced from 3
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  // Dash pattern
  const numberOfDashes = 100;
  const dashLength = (circumference / numberOfDashes) * 0.70;
  const gapLength = (circumference / numberOfDashes) * 0.30;
  const dashArray = `${dashLength} ${gapLength}`;

  // Generate unique gradient ID
  const gradientId = 'progressGradient';

  return (
    <div className="relative w-48 h-40 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>
        {/* Background dashed circle */}
        <circle
          cx="96"
          cy="80"
          r={normalizedRadius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          className="text-gray-100"
        />
        {/* Progress dashed circle */}
        <circle
          cx="96"
          cy="80"
          r={normalizedRadius}
          fill="transparent"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Score display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-medium text-gray-800 mx-auto">
          {currentScore}%
        </span>
        <span className="text-gray-400 text-[10px] mt-0.5 flex mx-auto ">
          <LucideGauge className='h-3 w-3 mr-1 my-auto'/> EQS Score
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;