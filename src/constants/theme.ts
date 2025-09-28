export const lightTheme = {
  colors: {
    primary: '#007AFF',
    primaryDark: '#0056CC',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#C6C6C8',
    placeholder: '#C7C7CC',
  },
  isDark: false,
};

export const darkTheme = {
  colors: {
    primary: '#0A84FF',
    primaryDark: '#0056CC',
    secondary: '#5E5CE6',
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    placeholder: '#636366',
  },
  isDark: true,
};

export type Theme = typeof lightTheme;
