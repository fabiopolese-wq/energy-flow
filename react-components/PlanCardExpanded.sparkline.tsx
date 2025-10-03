import React from 'react';

export interface SparklineProps {
  width?: number;
  height?: number;
  stroke?: string;
}

const PlanCardSparkline: React.FC<SparklineProps> = ({ width = 220, height = 56, stroke = '#E11D48' }) => {
  const path = 'M2,40 C40,10 80,20 120,28 C160,36 190,18 218,24';
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path d={path} fill="none" stroke={stroke} strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
};

export default PlanCardSparkline;
