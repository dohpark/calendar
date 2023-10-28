import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        '1/4': '1fr 3fr',
        '1/3': '1fr 2fr',
        '1/2': '1fr 1fr',
        '2/3': '2fr 1fr',
        '3/4': '3fr 1fr',
        'auto-start': 'auto 1fr',
        'auto-end': '1fr auto',
      },
      gridTemplateRows: {
        'auto-start': 'auto 1fr',
      },
      boxShadow: {
        'box-1': '0px 1px 2px 0px rgba(60,64,67,0.3),0px 1px 3px 1px rgba(60,64,67,0.15)',
        'box-2': '0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12)',
      },
      height: {
        main: 'calc(100vh - 65px)',
      },
    },
  },
  plugins: [],
};
export default config;
