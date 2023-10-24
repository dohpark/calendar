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
    },
  },
  plugins: [],
};
export default config;
