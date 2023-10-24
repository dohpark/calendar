interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  classExtend?: string[];
  onClick: () => void;
}

export default function IconButton({ children, classExtend, onClick }: IconButtonProps) {
  const classExtension = classExtend ? classExtend.join(' ') : '';

  return (
    <button type="button" className={`hover:bg-zinc-100 rounded-full ${classExtension}`} onClick={onClick}>
      {children}
    </button>
  );
}
