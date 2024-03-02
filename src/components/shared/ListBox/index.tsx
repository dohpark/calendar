interface DefaultItem {
  key: string | number;
}

interface ListBoxProps<T extends DefaultItem> {
  items: T[];
  sourceName: string;
  ItemComponent: (props: any) => JSX.Element;
  onClick?: (...args: any[]) => any;
  classExtend?: string[];
}

export default function ListBox<T extends DefaultItem>({
  items,
  sourceName,
  ItemComponent,
  onClick: handleClickItem,
  classExtend,
}: ListBoxProps<T>) {
  const classExtension = classExtend ? classExtend.join(' ') : '';

  return (
    <ul className={`shadow-box-1 rounded z-10 bg-white ${classExtension}`}>
      {items.map((item) => (
        <ItemComponent key={item.key} onClick={handleClickItem} {...{ [sourceName]: item }} />
      ))}
    </ul>
  );
}
