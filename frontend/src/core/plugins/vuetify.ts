/**
 * Vuetify plugin configuration.
 * Configures application themes, color palettes, and default component props.
 */

import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import '../assets/styles/theme.scss';
import { createVuetify } from 'vuetify';
import { VDateInput } from 'vuetify/labs/VDateInput';

export default createVuetify({
  components: {
    VDateInput,
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#FF5B00',         // Brand primary color
          'primary-darken-1': '#E55200',
          secondary: '#1A1C20',       // Dark background accent
          accent: '#FF7A29',          // Brand secondary accent
          background: '#F8F9FA',      // Application background
          surface: '#FFFFFF',         // Surface container background
          'surface-variant': '#F1F3F5',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      rounded: 'lg',
      elevation: 0,
      fontWeight: '600',
    },
    VCard: {
      rounded: 'xl',
      elevation: 0,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
    VDateInput: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
      activeColor: 'primary',
    },
    VDatePicker: {
      color: 'primary',
    },
    VDatePickerMonth: {
      color: 'primary',
    },
    VChip: {
      rounded: 'lg',
    },
  },
});
