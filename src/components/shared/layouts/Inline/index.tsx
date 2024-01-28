import { gaps, justifyContents, alignItems } from '@/constants/css';
import { GapType, JustifyContentsType, AlignItemsType } from '@/types/css';

interface InlineProps {
  children: React.ReactNode;
  gap: GapType;
  justify: JustifyContentsType;
  align: AlignItemsType;
  classExtend?: string[];
}

export default function Inline({ children, gap, justify, align, classExtend }: InlineProps) {
  const classExtension = classExtend ? classExtend.join(' ') : '';

  return (
    <div className={`flex ${gaps[gap]} ${justifyContents[justify]} ${alignItems[align]} ${classExtension}`}>
      {children}
    </div>
  );
}
