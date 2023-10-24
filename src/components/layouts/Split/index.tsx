import { gaps, fractions } from '@/constants/css';
import { FractionType, GapType } from '@/types/css';
import React from 'react';

interface SplitProps {
  children: React.ReactNode;
  fraction: FractionType;
  gap: GapType;
}

export default function Split({ children, fraction, gap }: SplitProps) {
  return <div className={`grid ${fractions[fraction]} ${gaps[gap]}`}>{children}</div>;
}
