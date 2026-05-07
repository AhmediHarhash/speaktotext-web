import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Pulled from the SpeakToText app dashboard screenshots.
        ink: {
          950: '#05070D',
          900: '#0A0F1C',
          800: '#0F1726',
          700: '#172236',
          600: '#1F2D44'
        },
        gold: {
          50: '#FFF7E0',
          100: '#FFEBB0',
          200: '#F4D98A',
          300: '#E8C26A',
          400: '#D4A548',
          500: '#B8852E',
          600: '#8A6220'
        },
        silver: {
          100: '#E8EDF5',
          200: '#C9D2E0',
          300: '#9AA5B8',
          400: '#6B7586'
        },
        cyan: {
          accent: '#3DD1E7'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      backgroundImage: {
        'grid-radial':
          'radial-gradient(circle at 50% 0%, rgba(212,165,72,0.08), transparent 60%)',
        'gold-sheen':
          'linear-gradient(135deg, #FFEBB0 0%, #D4A548 40%, #8A6220 100%)',
        'silver-sheen':
          'linear-gradient(180deg, #E8EDF5 0%, #9AA5B8 50%, #6B7586 100%)'
      },
      boxShadow: {
        'glass-sm': 'inset 0 1px 1px rgba(255,255,255,0.08), 0 1px 2px rgba(0,0,0,0.3)',
        'glass-lg':
          'inset 0 1px 1px rgba(255,255,255,0.12), 0 10px 40px rgba(0,0,0,0.45)',
        gold: '0 0 40px rgba(212,165,72,0.25), 0 0 80px rgba(212,165,72,0.12)'
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.25,0.1,0.25,1) both',
        'pulse-slow': 'pulseSlow 3.2s ease-in-out infinite',
        'wave-1': 'waveBar 1.1s ease-in-out infinite',
        'wave-2': 'waveBar 1.3s ease-in-out infinite 0.15s',
        'wave-3': 'waveBar 0.9s ease-in-out infinite 0.3s',
        'wave-4': 'waveBar 1.2s ease-in-out infinite 0.45s',
        'wave-5': 'waveBar 1s ease-in-out infinite 0.6s'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseSlow: {
          '0%,100%': { opacity: '0.4' },
          '50%': { opacity: '1' }
        },
        waveBar: {
          '0%,100%': { transform: 'scaleY(0.35)' },
          '50%': { transform: 'scaleY(1)' }
        }
      }
    }
  },
  plugins: []
};

export default config;
