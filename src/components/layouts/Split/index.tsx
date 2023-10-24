import { gaps, fractions } from '@/constants/css';
import { FractionType, GapType } from '@/types/css';
import React from 'react';

interface SplitProps {
  children: React.ReactNode;
  fraction: FractionType;
  gap: GapType;
  classExtend?: string[];
}

export default function Split({ children, fraction, gap, classExtend }: SplitProps) {
  const classExtension = classExtend ? classExtend.join(' ') : '';

  return <div className={`grid ${fractions[fraction]} ${gaps[gap]} ${classExtension}`}>{children}</div>;
}
