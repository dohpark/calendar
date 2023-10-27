import Inline from '@/components/layouts/Inline';
import Layer from '@/components/layouts/Layer';
import Split from '@/components/layouts/Split';
import IconButton from '@/components/common/IconButton';
import Left from '@public/svg/left.svg';
import Right from '@public/svg/right.svg';

interface MiniCalendarProps {
  classExtend?: string[];
}

export default function MiniCalendar({ classExtend }: MiniCalendarProps) {
  const miniCalendarDisplayDate = new Date();
  const miniCalendarYear = miniCalendarDisplayDate.getFullYear();
  const miniCalendarMonth = miniCalendarDisplayDate.getMonth() + 1;

  const classExtension = classExtend ? classExtend.join(' ') : '';
  return (
    <div className={`${classExtension}`}>
      <Layer gap="0">
        <Split fraction="3/4" gap="0" classExtend={['items-center']}>
          <div className="text-sm pl-2 text-gray-800">{`${miniCalendarYear}년 ${miniCalendarMonth}월`}</div>
          <Inline gap="0" justify="end" align="center">
            <IconButton
              type="button"
              classExtend={['p-2']}
              onClick={() => {
                console.log('left');
              }}
            >
              <span>
                <Left width="10" height="10" />
              </span>
            </IconButton>
            <IconButton
              type="button"
              classExtend={['p-2']}
              onClick={() => {
                console.log('left');
              }}
            >
              <span>
                <Right width="10" height="10" />
              </span>
            </IconButton>
          </Inline>
        </Split>
        <div className="grid grid-cols-7 py-2 text-xs text-center text-gray-500">
          {['일', '월', '화', '수', '목', '금', '토'].map((value) => (
            <div key={value} className="">
              {value}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 text-xs text-center text-gray-500">
          {Array.from({ length: 42 }, (_, index) => index).map((value) => (
            <IconButton
              key={value}
              classExtend={['w-6', 'h-6', 'p-1', 'justify-self-center']}
              onClick={() => console.log(value)}
            >
              {value}
            </IconButton>
          ))}
        </div>
      </Layer>
    </div>
  );
}
