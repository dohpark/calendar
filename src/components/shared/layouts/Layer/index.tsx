import { gaps } from '@/constants/css';
import { GapType } from '@/types/css';

interface LayerProps {
  children: React.ReactNode;
  gap: GapType;
  classExtend?: string[];
}

export default function Layer({ children, gap, classExtend }: LayerProps) {
  const classExtension = classExtend ? classExtend.join(' ') : '';

  return <div className={`grid ${gaps[gap]} ${classExtension}`}>{children}</div>;
}
