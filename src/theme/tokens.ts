export const colors = {
  // Light theme palette
  background: '#F9FAFB', // or '#FAF9F7'
  surface: '#FFFFFF',
  hairline: '#E5E7EB',
  glass: '#F4F6F7',
  textPrimary: '#1C1C1E',
  textSecondary: '#6B7280',
  placeholder: '#9CA3AF',
  accentUnder: '#2BC9A6',
  accentOver: '#FF6B6B',
  accentWarm: '#FFD479',
  chipBorder: '#E5E7EB',
  chipBg: '#F4F6F7',
};

// 4 / 8 / 12 / 16 / 24
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

// card 16, chip/button 999
export const radii = { sm: 10, md: 14, lg: 16, pill: 999 };

// Add new canonical sizes while retaining old keys for compatibility
export const typography = {
  title20: 20,
  body16: 16,
  small13: 13,
  amount16: 16,
  size16: 16,
  size18: 18,
  size22: 20, // map old usage to new title size
  weightMedium: '500' as const,
};


