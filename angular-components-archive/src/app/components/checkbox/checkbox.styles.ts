import { CheckboxType, CheckboxState, CheckboxVariant, CheckboxColors } from './checkbox.types';

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
  errorRed400: '#960000',
  
  // State Colors
  hoverOutline: '#0A0A0A',
  focusOutline: '#000000',
  pressedOutline: '#0A0A0A'
};

// Color mapping based on Figma specifications
export const getCheckboxColors = (
  type: CheckboxType,
  state: CheckboxState,
  variant: CheckboxVariant
): CheckboxColors => {
  const colorMap: Record<CheckboxType, Record<CheckboxState, Record<CheckboxVariant, CheckboxColors>>> = {
    enabled: {
      default: {
        unselected: {
          border: DESIGN_COLORS.neutral600,
          background: 'transparent',
          text: DESIGN_COLORS.neutral700,
          checkmark: DESIGN_COLORS.neutral100
        },
        selected: {
          border: DESIGN_COLORS.primaryBlue,
          background: DESIGN_COLORS.primaryBlue,
          text: DESIGN_COLORS.neutral700,
          checkmark: DESIGN_COLORS.neutral100
        }
      },
      hover: {
        unselected: {
          border: DESIGN_COLORS.neutral700,
          background: 'transparent',
          text: DESIGN_COLORS.neutral700,
          checkmark: DESIGN_COLORS.neutral100,
          hoverOutline: DESIGN_COLORS.hoverOutline
        },
        selected: {
          border: DESIGN_COLORS.primaryBlue,
          background: DESIGN_COLORS.primaryBlue,
          text: DESIGN_COLORS.neutral700,
          checkmark: DESIGN_COLORS.neutral100,
          hoverOutline: DESIGN_COLORS.hoverOutline
        }
      },
      focus: {
        unselected: {
          border: DESIGN_COLORS.focusOutline,
          background: 'transparent',
          text: DESIGN_COLORS.neutral700,
          checkmark: DESIGN_COLORS.neutral100,
          focusOutline: DESIGN_COLORS.focusOutline
        },
        selected: {
          border: DESIGN_COLORS.focusOutline,
          background: DESIGN_COLORS.primaryBlue,
          text: DESIGN_COLORS.neutral700,
          checkmark: DESIGN_COLORS.neutral100,
          focusOutline: DESIGN_COLORS.focusOutline
        }
      },
      pressed: {
        unselected: {
          border: DESIGN_COLORS.neutral700,
          background: 'transparent',
          text: DESIGN_COLORS.neutral700,
          checkmark: DESIGN_COLORS.neutral100,
          pressedOutline: DESIGN_COLORS.pressedOutline
        },
        selected: {
          border: DESIGN_COLORS.primaryBlue,
          background: DESIGN_COLORS.primaryBlue,
          text: DESIGN_COLORS.neutral700,
          checkmark: DESIGN_COLORS.neutral100,
          pressedOutline: DESIGN_COLORS.pressedOutline
        }
      }
    },
    disabled: {
      default: {
        unselected: {
          border: DESIGN_COLORS.neutral400,
          background: DESIGN_COLORS.neutral300,
          text: DESIGN_COLORS.neutral500,
          checkmark: DESIGN_COLORS.neutral400
        },
        selected: {
          border: DESIGN_COLORS.neutral400,
          background: DESIGN_COLORS.neutral200,
          text: DESIGN_COLORS.neutral500,
          checkmark: DESIGN_COLORS.neutral400
        }
      },
      hover: {
        unselected: {
          border: DESIGN_COLORS.neutral400,
          background: DESIGN_COLORS.neutral300,
          text: DESIGN_COLORS.neutral500,
          checkmark: DESIGN_COLORS.neutral400
        },
        selected: {
          border: DESIGN_COLORS.neutral400,
          background: DESIGN_COLORS.neutral200,
          text: DESIGN_COLORS.neutral500,
          checkmark: DESIGN_COLORS.neutral400
        }
      },
      focus: {
        unselected: {
          border: DESIGN_COLORS.neutral400,
          background: DESIGN_COLORS.neutral300,
          text: DESIGN_COLORS.neutral500,
          checkmark: DESIGN_COLORS.neutral400
        },
        selected: {
          border: DESIGN_COLORS.neutral400,
          background: DESIGN_COLORS.neutral200,
          text: DESIGN_COLORS.neutral500,
          checkmark: DESIGN_COLORS.neutral400
        }
      },
      pressed: {
        unselected: {
          border: DESIGN_COLORS.neutral400,
          background: DESIGN_COLORS.neutral300,
          text: DESIGN_COLORS.neutral500,
          checkmark: DESIGN_COLORS.neutral400
        },
        selected: {
          border: DESIGN_COLORS.neutral400,
          background: DESIGN_COLORS.neutral200,
          text: DESIGN_COLORS.neutral500,
          checkmark: DESIGN_COLORS.neutral400
        }
      }
    },
    error: {
      default: {
        unselected: {
          border: DESIGN_COLORS.errorRed400,
          background: 'transparent',
          text: DESIGN_COLORS.errorRed300,
          checkmark: DESIGN_COLORS.neutral100
        },
        selected: {
          border: DESIGN_COLORS.errorRed300,
          background: DESIGN_COLORS.errorRed300,
          text: DESIGN_COLORS.errorRed300,
          checkmark: DESIGN_COLORS.neutral100
        }
      },
      hover: {
        unselected: {
          border: DESIGN_COLORS.errorRed300,
          background: 'transparent',
          text: DESIGN_COLORS.errorRed300,
          checkmark: DESIGN_COLORS.neutral100,
          hoverOutline: DESIGN_COLORS.hoverOutline
        },
        selected: {
          border: DESIGN_COLORS.errorRed300,
          background: DESIGN_COLORS.errorRed300,
          text: DESIGN_COLORS.errorRed300,
          checkmark: DESIGN_COLORS.neutral100,
          hoverOutline: DESIGN_COLORS.hoverOutline
        }
      },
      focus: {
        unselected: {
          border: DESIGN_COLORS.focusOutline,
          background: 'transparent',
          text: DESIGN_COLORS.errorRed300,
          checkmark: DESIGN_COLORS.neutral100,
          focusOutline: DESIGN_COLORS.focusOutline
        },
        selected: {
          border: DESIGN_COLORS.focusOutline,
          background: DESIGN_COLORS.errorRed300,
          text: DESIGN_COLORS.errorRed300,
          checkmark: DESIGN_COLORS.neutral100,
          focusOutline: DESIGN_COLORS.focusOutline
        }
      },
      pressed: {
        unselected: {
          border: DESIGN_COLORS.errorRed300,
          background: 'transparent',
          text: DESIGN_COLORS.errorRed300,
          checkmark: DESIGN_COLORS.neutral100,
          pressedOutline: DESIGN_COLORS.pressedOutline
        },
        selected: {
          border: DESIGN_COLORS.errorRed300,
          background: DESIGN_COLORS.errorRed300,
          text: DESIGN_COLORS.errorRed300,
          checkmark: DESIGN_COLORS.neutral100,
          pressedOutline: DESIGN_COLORS.pressedOutline
        }
      }
    }
  };

  return colorMap[type][state][variant];
};

// CSS Custom Properties Generator
export const generateCSSCustomProperties = (colors: CheckboxColors): Record<string, string> => {
  return {
    '--checkbox-border-color': colors.border,
    '--checkbox-background-color': colors.background,
    '--checkbox-text-color': colors.text,
    '--checkbox-checkmark-color': colors.checkmark,
    '--checkbox-hover-outline': colors.hoverOutline || 'transparent',
    '--checkbox-focus-outline': colors.focusOutline || 'transparent',
    '--checkbox-pressed-outline': colors.pressedOutline || 'transparent'
  };
};

// Spacing and sizing constants from Figma
export const CHECKBOX_SPACING = {
  verticalPadding: '4px', // c4-space-2x
  horizontalPadding: '4px', // c4-space-01
  spaceBetween: '16px', // c4-space-1x
  checkboxSize: '20px',
  borderRadius: '4px',
  borderWidth: '2px',
  focusBorderWidth: '3px'
};

// Typography constants
export const CHECKBOX_TYPOGRAPHY = {
  fontFamily: 'PT Sans, sans-serif',
  fontSize: '16px',
  fontWeight: '400',
  lineHeight: '150%'
};