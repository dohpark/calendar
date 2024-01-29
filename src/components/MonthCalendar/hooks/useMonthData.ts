import { useQuery } from '@tanstack/react-query';
import scheduleApi from '@/api/schedule';
import { ScheduleArray } from '@/types/schedule';

/**
 * scheduleApi.getMonth에서 받은 월별 스케줄 데이터를 토대로 dateBoxSize에 맞춰 데이터를 가공하는 함수
 */
export default function useMonthData({ selectedDate }: { selectedDate: Date }) {
  const fetchSchedule = (): Promise<ScheduleArray> =>
    scheduleApi.getMonth(selectedDate.getFullYear(), selectedDate.getMonth() + 1);

  const { data = [], isSuccess } = useQuery({
    queryKey: [`${selectedDate.getFullYear()}-${selectedDate.getMonth()}`],
    queryFn: fetchSchedule,
    refetchOnWindowFocus: false,
  });

  return { data, isSuccess };
}
