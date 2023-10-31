interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  classExtend?: string[];
}

export default function TextButton({ children, classExtend, ...props }: TextButtonProps) {
  const classExtension = classExtend ? classExtend.join(' ') : '';

  return (
    <button {...props} type="button" className={`border rounded hover:bg-zinc-100 ${classExtension}`}>
      {children}
    </button>
  );
}
