interface LayerItemProps {
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  backgroundColor?: string;
  children: React.ReactNode;
}

export default function LayerItem({ children, Icon, backgroundColor }: LayerItemProps) {
  return (
    <div className="flex">
      <div className="flex-none w-9 h-9 p-2 mr-2">
        {Icon ? <Icon width="20" height="20" /> : <div className={`w-5 h-5 rounded ${backgroundColor || ''}`} />}
      </div>
      {children}
    </div>
  );
}
