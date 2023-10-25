interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  classExtend?: string[];
  onClick: () => void;
}

export default function TextButton({ children, classExtend, onClick }: TextButtonProps) {
  const classExtension = classExtend ? classExtend.join(' ') : '';

  return (
    <button type="button" className={`border rounded hover:bg-zinc-100 ${classExtension}`} onClick={onClick}>
      {children}
    </button>
  );
}