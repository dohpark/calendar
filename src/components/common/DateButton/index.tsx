import IconButton from '@/components/common/IconButton';

interface DateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  year: number;
  month: number;
  date: number;
  children: React.ReactNode;
  classExtend?: string[];
  onClick: () => void;
}

export default function DateButton({
  year,
  month,
  date,
  classExtend = [],
  onClick,
  children,
  ...props
}: DateButtonProps) {
  return (
    <IconButton
      {...props}
      aria-label={`${year}-${month}-${date}`}
      classExtend={['w-6', 'h-6', 'p-1', ...classExtend]}
      onClick={onClick}
    >
      {children}
    </IconButton>
  );
}
