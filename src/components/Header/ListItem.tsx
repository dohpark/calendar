import { ListItemType } from './types';

interface ListItemProps {
  item: ListItemType;
}

export default function ListItem({ item }: ListItemProps) {
  return (
    <li key={item.key} className="grid grid-cols-auto-start text-sm px-4 py-2 hover:bg-zinc-100 hover:cursor-pointer">
      <span className="text-sm">{item.dayKor}</span>
      <span className="text-xs text-right">{item.dayEng}</span>
    </li>
  );
}
