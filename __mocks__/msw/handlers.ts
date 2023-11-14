import url from 'node:url';
import { HttpHandler, http, HttpResponse } from 'msw';
import NOVEMBER_2023 from '@mocks/mockData/2023-11-schedule';
import OCTOBER_2023 from '@mocks/mockData/2023-10-schedule';
import DECEMBER_2023 from '@mocks/mockData/2023-12-schedule';

export const handlers: HttpHandler[] = [
  http.get('http://localhost:3000/api/schedule/month', ({ request }) => {
    const { query } = url.parse(request.url, true);
    const { year, month } = query;

    if (year === '2023' && month === '10') {
      return HttpResponse.json({ selectedMonthArray: OCTOBER_2023 });
    }
    if (year === '2023' && month === '11') {
      return HttpResponse.json({ selectedMonthArray: NOVEMBER_2023 });
    }
    if (year === '2023' && month === '12') {
      return HttpResponse.json({ selectedMonthArray: DECEMBER_2023 });
    }
    return HttpResponse.json({ selectedMonthArray: NOVEMBER_2023 });
  }),
];
