import { nextui } from '@nextui-org/react'
import type { Config } from 'tailwindcss'

var customColors = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
}

function swapColorValues(colors: any) {
  const swappedColors: any = {}
  const keys = Object.keys(colors)
  const length = keys.length
  for (let i = 0; i < length / 2; i++) {
    const key1 = keys[i]
    const key2 = keys[length - 1 - i]
    swappedColors[key1 as any] = colors[key2]
    swappedColors[key2 as any] = colors[key1]
  }
  if (length % 2 !== 0) {
    const middleKey = keys[Math.floor(length / 2)]
    swappedColors[middleKey as any] = colors[middleKey]
  }
  return swappedColors
}
var commonColors = {
  white: '#ffffff',
  black: '#000000',
  customColors,
}
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        hero: "url('/images/bg.svg')",
      },
      container: {
        center: true,
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1366px',
          '2xl': '1600px',
        },
      },
      fontFamily: {
        sans: ['arial', 'system-ui', 'sans'],
      },
      spacing: {
        navbar: 'var(--height-navbar)',
        sidebar: 'var(--sidebar-width)',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      prefix: 'ui',
      layout: {
        fontSize: {
          tiny: '0.75rem',
          small: '0.875rem',
          medium: '1rem',
          large: '1.125rem',
        },
        lineHeight: {
          tiny: '1rem',
          small: '1.25rem',
          medium: '1.5rem',
          large: '1.75rem',
        },
        radius: {
          small: '6px',
          medium: '8px',
          large: '12px',
        },
        borderWidth: {
          small: '1px',
          medium: '1.5px',
          large: '2px',
        },
      },

      themes: {
        light: {
          extend: 'light',
          colors: {
            default: {
              ...commonColors.customColors,
              DEFAULT: commonColors.customColors[300],
              foreground: commonColors.customColors[900],
            },
            primary: {
              ...swapColorValues(commonColors.customColors),
              DEFAULT: commonColors.customColors[900],
              foreground: commonColors.customColors[50],
            },
            background: {
              ...commonColors.customColors,
              DEFAULT: '#f5f5f5',
            },
            foreground: {
              ...commonColors.customColors,
              foreground: commonColors.customColors[50],
            },
            divider: {
              DEFAULT: 'rgba(17, 17, 17, 0.15)',
            },
            overlay: {
              DEFAULT: '#000000',
            },
            content1: {
              DEFAULT: commonColors.customColors[50],
              foreground: commonColors.customColors[800],
            },
            content2: {
              DEFAULT: commonColors.customColors[50],
              foreground: commonColors.customColors[700],
            },
            content3: {
              DEFAULT: commonColors.customColors[50],
              foreground: commonColors.customColors[600],
            },
            content4: {
              DEFAULT: commonColors.customColors[50],
              foreground: commonColors.customColors[500],
            },
          },
        },
        dark: {
          extend: 'dark',
          colors: {
            default: {
              ...swapColorValues(commonColors.customColors),
              DEFAULT: commonColors.customColors[700],
              foreground: commonColors.customColors[100],
            },
            background: {
              DEFAULT: '#020617',
            },
            foreground: {
              ...swapColorValues(commonColors.customColors),
              foreground: commonColors.customColors[50],
            },
            overlay: {
              DEFAULT: commonColors.customColors[500],
            },
            divider: {
              DEFAULT: 'rgba(255, 255, 255, 0.15)',
            },
            content1: {
              DEFAULT: commonColors.customColors[900],
              foreground: commonColors.customColors[50],
            },
            content2: {
              DEFAULT: commonColors.customColors[700],
              foreground: commonColors.customColors[100],
            },
            content3: {
              DEFAULT: commonColors.customColors[600],
              foreground: commonColors.customColors[200],
            },
            content4: {
              DEFAULT: commonColors.customColors[900],
              foreground: commonColors.customColors[300],
            },
          },
        },
      },
    }),
  ],
}
export default config
