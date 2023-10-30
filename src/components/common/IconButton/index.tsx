interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  classExtend?: string[];
}

export default function IconButton({ children, classExtend, ...props }: IconButtonProps) {
  const classExtension = classExtend ? classExtend.join(' ') : '';

  return (
    <button {...props} type="button" className={`hover:bg-zinc-100 rounded-full ${classExtension}`}>
      {children}
    </button>
  );
}
