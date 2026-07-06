import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        bone: '#f5f4f0',
        ink: '#090909',
        smoke: '#111111',
        mist: '#b7b7b4',
        accent: '#d4d0c7'
      },
      boxShadow: {
        glow: '0 0 120px rgba(255,255,255,0.08)',
        panel: '0 20px 80px rgba(0,0,0,0.45)'
      },
      backgroundImage: {
        grain: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.09), transparent 35%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.08), transparent 25%), linear-gradient(180deg, rgba(255,255,255,0.04), transparent 40%)'
      },
      letterSpacing: {
        ultra: '0.28em'
      }
    }
  },
  plugins: []
};

export default config;
