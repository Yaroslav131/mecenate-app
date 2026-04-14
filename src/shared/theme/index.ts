export const colors = {
  primary: '#7C3AED',
  actionButton: '#6115CD',
  background: '#FFFFFF',
  backgroundSecondary: '#F5F8FD',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  skeleton: 'rgba(238, 239, 241, 0.8)',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    inverse: '#FFFFFF',
    comment: '#111416',
    commentsCount: '#68727D',
  },
  icon: {
    default: '#57626F',
  },
  like: '#FF2B75',
  likeBackground: '#FFEAF1',
  overlay: 'rgba(17, 20, 22, 0.45)',
  inputBorder: '#EFF2F7',
  inputPlaceholder: '#A4AAB0',
  surfaceTransparent: 'rgba(255,255,255,0)',
} as const;

export const activeOpacity = 0.5;

export const fonts = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  title: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
} as const;

export const lineHeight = {
  sm: 18,
  md: 20,
  lg: 26,
  '2xl': 28,
  '3xl': 32,
} as const;

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    boxShadow: '0 1 2 rgba(0,0,0,0.05)',
  },
  md: {
    boxShadow: '0 2 4 rgba(0,0,0,0.08)',
  },
} as const;
