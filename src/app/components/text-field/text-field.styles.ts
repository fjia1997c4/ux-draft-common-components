import { TextFieldType, TextFieldState, TextFieldColors } from './text-field.types';

// Design System Colors from Figma
export const DESIGN_COLORS = {
  // Neutral Colors
  neutral100: '#FCFCFC',
  neutral200: '#EEEEEE',
  neutral300: '#D3D3D3',
  neutral400: '#918F8F',
  neutral500: '#6C6C6C',
  neutral600: '#3A3A3A',
  neutral700: '#0A0A0A',
  
  // Primary Colors
  primaryBlue: '#1A70B3',
  
  // Error Colors
  errorRed300: '#960000',
  
  // Background
  white: '#FFFFFF'
};

// Color mapping based on Figma specifications
export const getTextFieldColors = (
  type: TextFieldType,
  state: TextFieldState
): TextFieldColors => {
  const colorMap: Record<TextFieldType, Record<TextFieldState, TextFieldColors>> = {
    default: {
      unselected: {
        border: DESIGN_COLORS.neutral600, // #3A3A3A
        background: DESIGN_COLORS.white,
        text: DESIGN_COLORS.neutral600, // #3A3A3A
        label: DESIGN_COLORS.neutral700, // #0A0A0A
        helperText: DESIGN_COLORS.neutral600, // #3A3A3A
        placeholder: DESIGN_COLORS.neutral500 // #6C6C6C
      },
      hover: {
        border: DESIGN_COLORS.neutral700, // #0A0A0A - 2px thick
        background: DESIGN_COLORS.white,
        text: DESIGN_COLORS.neutral600,
        label: DESIGN_COLORS.neutral700,
        helperText: DESIGN_COLORS.neutral600,
        placeholder: DESIGN_COLORS.neutral500
      },
      selected: {
        border: DESIGN_COLORS.neutral700, // #0A0A0A - 2px thick
        background: DESIGN_COLORS.white,
        text: DESIGN_COLORS.neutral600,
        label: DESIGN_COLORS.neutral700,
        helperText: DESIGN_COLORS.neutral600,
        placeholder: DESIGN_COLORS.neutral500,
        focusOutline: DESIGN_COLORS.neutral700
      }
    },
    error: {
      unselected: {
        border: DESIGN_COLORS.errorRed300, // #960000
        background: DESIGN_COLORS.white,
        text: DESIGN_COLORS.neutral600,
        label: DESIGN_COLORS.errorRed300,
        helperText: DESIGN_COLORS.errorRed300,
        placeholder: DESIGN_COLORS.neutral500
      },
      hover: {
        border: DESIGN_COLORS.errorRed300, // #960000 - 2px thick
        background: DESIGN_COLORS.white,
        text: DESIGN_COLORS.neutral600,
        label: DESIGN_COLORS.errorRed300,
        helperText: DESIGN_COLORS.errorRed300,
        placeholder: DESIGN_COLORS.neutral500
      },
      selected: {
        border: DESIGN_COLORS.errorRed300, // #960000 - 2px thick
        background: DESIGN_COLORS.white,
        text: DESIGN_COLORS.neutral600,
        label: DESIGN_COLORS.errorRed300,
        helperText: DESIGN_COLORS.errorRed300,
        placeholder: DESIGN_COLORS.neutral500,
        focusOutline: DESIGN_COLORS.errorRed300
      }
    },
    disabled: {
      unselected: {
        border: DESIGN_COLORS.neutral400, // #918F8F
        background: DESIGN_COLORS.neutral200, // #EEEEEE
        text: DESIGN_COLORS.neutral500, // #6C6C6C
        label: DESIGN_COLORS.neutral500,
        helperText: DESIGN_COLORS.neutral500,
        placeholder: DESIGN_COLORS.neutral500
      },
      hover: {
        border: DESIGN_COLORS.neutral400,
        background: DESIGN_COLORS.neutral200,
        text: DESIGN_COLORS.neutral500,
        label: DESIGN_COLORS.neutral500,
        helperText: DESIGN_COLORS.neutral500,
        placeholder: DESIGN_COLORS.neutral500
      },
      selected: {
        border: DESIGN_COLORS.neutral400,
        background: DESIGN_COLORS.neutral200,
        text: DESIGN_COLORS.neutral500,
        label: DESIGN_COLORS.neutral500,
        helperText: DESIGN_COLORS.neutral500,
        placeholder: DESIGN_COLORS.neutral500
      }
    }
  };

  return colorMap[type][state];
};

// CSS Custom Properties Generator
export const generateTextFieldCSSCustomProperties = (colors: TextFieldColors): Record<string, string> => {
  return {
    '--text-field-border-color': colors.border,
    '--text-field-background-color': colors.background,
    '--text-field-text-color': colors.text,
    '--text-field-label-color': colors.label,
    '--text-field-helper-color': colors.helperText,
    '--text-field-placeholder-color': colors.placeholder,
    '--text-field-focus-outline': colors.focusOutline || 'transparent'
  };
};

// Spacing and sizing constants from Figma
export const TEXT_FIELD_SPACING = {
  labelMarginBottom: '4px', // c4-space-2x
  helperMarginTop: '4px', // c4-space-2x
  inputPadding: '12px 16px', // Comfortable padding for text input
  borderRadius: '4px',
  borderWidth: '2px',
  minHeight: '44px' // Accessible minimum touch target
};

// Typography constants from Figma
export const TEXT_FIELD_TYPOGRAPHY = {
  fontFamily: 'PT Sans, sans-serif',
  labelFontSize: '16px',
  labelFontWeight: '400',
  labelLineHeight: '150%',
  inputFontSize: '16px',
  inputFontWeight: '400',
  inputLineHeight: '150%',
  helperFontSize: '14px',
  helperFontWeight: '400',
  helperLineHeight: '150%'
};