interface DefaultItem {
  key: string;
}

interface ListBoxProps<T extends DefaultItem> {
  items: T[];
  sourceName: string;
  ItemComponent: (props: any) => JSX.Element;
  onClick?: () => void;
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
    <ul className={`shadow rounded ${classExtension}`}>
      {items.map((item) => (
        <ItemComponent key={item.key} onClick={handleClickItem} {...{ [sourceName]: item }} />
      ))}
    </ul>
  );
}