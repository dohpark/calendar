interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  classExtend?: string[];
  onClick: () => void;
  'aria-label': string;
}

export default function IconButton({ children, classExtend, onClick, 'aria-label': ariaLabel }: IconButtonProps) {
  const classExtension = classExtend ? classExtend.join(' ') : '';

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`hover:bg-zinc-100 rounded-full ${classExtension}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
