import { createTheme } from '@mui/material/styles';
import { fontSans, palette, radii } from './tokens';

const theme = createTheme({
  direction: 'ltr',
  palette: {
    ...palette,
    background: {
      default: palette.surface,
      paper: '#FFFFFF',
    },
    divider: palette.divider,
  },
  shape: {
    borderRadius: radii.md,
  },
  typography: {
    fontFamily: `${fontSans.style.fontFamily}, ${fontSans.fallback?.join(', ') ?? 'sans-serif'}`,
    h1: { fontWeight: 600, fontSize: '2.25rem', lineHeight: '2.75rem' },
    h2: { fontWeight: 600, fontSize: '1.875rem', lineHeight: '2.25rem' },
    h3: { fontWeight: 600, fontSize: '1.5rem', lineHeight: '1.75rem' },
    h4: { fontWeight: 600, fontSize: '1.3125rem', lineHeight: '1.6rem' },
    h5: { fontWeight: 600, fontSize: '1.125rem', lineHeight: '1.6rem' },
    h6: { fontWeight: 600, fontSize: '1rem', lineHeight: '1.2rem' },
    button: { textTransform: 'capitalize', fontWeight: 500 },
    body1: { fontSize: '0.875rem', fontWeight: 400, lineHeight: '1.334rem' },
    body2: { fontSize: '0.75rem', fontWeight: 400, lineHeight: '1rem' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: palette.surface },
        '.MuiPaper-elevation9, .MuiPopover-root .MuiPaper-elevation': {
          boxShadow:
            'rgb(145 158 171 / 30%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: radii.md },
      },
    },
  },
});

export default theme;
