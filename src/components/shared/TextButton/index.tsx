interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  classExtend?: string[];
}

export default function TextButton({ children, classExtend, type, ...props }: TextButtonProps) {
  const classExtension = classExtend ? classExtend.join(' ') : '';

  return (
    <button {...props} className={`border rounded hover:bg-zinc-100 ${classExtension}`}>
      {children}
    </button>
  );
}
