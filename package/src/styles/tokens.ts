import { Plus_Jakarta_Sans } from 'next/font/google';

export const fontSans = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

export const palette = {
  primary: { main: '#5D87FF', light: '#ECF2FF', dark: '#4570EA' },
  secondary: { main: '#49BEFF', light: '#E8F7FF', dark: '#23AFDB' },
  success: { main: '#13DEB9', light: '#E6FFFA', dark: '#02B3A9', contrastText: '#FFFFFF' },
  info: { main: '#539BFF', light: '#EBF3FE', dark: '#1682D4', contrastText: '#FFFFFF' },
  error: { main: '#FA896B', light: '#FDEDE8', dark: '#F3704D', contrastText: '#FFFFFF' },
  warning: { main: '#FFAE1F', light: '#FEF5E5', dark: '#AE8E59', contrastText: '#FFFFFF' },
  grey: { 100: '#F2F6FA', 200: '#EAEFF4', 300: '#DFE5EF', 400: '#7C8FAC', 500: '#5A6A85', 600: '#2A3547' },
  text: { primary: '#2A3547', secondary: '#5A6A85' },
  divider: '#E5EAEF',
  surface: '#F2F6FA',
} as const;

export const radii = {
  sm: 6,
  md: 8,
  lg: 12,
} as const;

export const spacing = (factor: number) => `${0.25 * factor}rem`;
