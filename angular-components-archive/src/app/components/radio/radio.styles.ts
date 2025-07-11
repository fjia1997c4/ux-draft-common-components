import { RadioType, RadioState, RadioVariant, RadioColors } from './radio.types';

// Design System Colors from Figma (reusing checkbox colors)
export const DESIGN_COLORS = {
  // Neutral Colors
  neutral100: '#FCFCFC',
  neutral200: '#EEEEEE', 
  neutral300: '#D3D3D3',
  neutral400: '#918F8F', // Updated for disabled states
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

// Color mapping based on Figma specifications for radio buttons
export const getRadioColors = (
  type: RadioType,
  state: RadioState,
  variant: RadioVariant
): RadioColors => {
  const colorMap: Record<RadioType, Record<RadioState, Record<RadioVariant, RadioColors>>> = {
    default: {
      default: {
        unselected: {
          border: '#3A3A3A', // neutral600 from Figma
          background: 'transparent',
          text: DESIGN_COLORS.neutral700,
          dot: DESIGN_COLORS.primaryBlue
        },
        selected: {
          border: DESIGN_COLORS.primaryBlue,
          background: 'transparent',
          text: DESIGN_COLORS.neutral700,
          dot: DESIGN_COLORS.primaryBlue
        }
      },
      hover: {
        unselected: {
          border: DESIGN_COLORS.neutral700,
          background: 'transparent',
          text: DESIGN_COLORS.neutral700,
          dot: DESIGN_COLORS.primaryBlue,
          hoverOutline: DESIGN_COLORS.hoverOutline
        },
        selected: {
          border: DESIGN_COLORS.primaryBlue, // blue 600 - #1A70B3
          background: 'transparent',
          text: DESIGN_COLORS.neutral700, // neutral 700 - #0A0A0A
          dot: DESIGN_COLORS.primaryBlue,
          hoverOutline: DESIGN_COLORS.hoverOutline
        }
      },
      focus: {
        unselected: {
          border: DESIGN_COLORS.focusOutline,
          background: 'transparent',
          text: DESIGN_COLORS.neutral700,
          dot: DESIGN_COLORS.primaryBlue,
          focusOutline: DESIGN_COLORS.focusOutline
        },
        selected: {
          border: DESIGN_COLORS.focusOutline,
          background: 'transparent',
          text: DESIGN_COLORS.neutral700,
          dot: DESIGN_COLORS.primaryBlue,
          focusOutline: DESIGN_COLORS.focusOutline
        }
      },
      pressed: {
        unselected: {
          border: DESIGN_COLORS.neutral700,
          background: 'transparent',
          text: DESIGN_COLORS.neutral700,
          dot: DESIGN_COLORS.primaryBlue,
          pressedOutline: DESIGN_COLORS.pressedOutline
        },
        selected: {
          border: DESIGN_COLORS.primaryBlue, // blue 600 - #1A70B3
          background: 'transparent',
          text: DESIGN_COLORS.neutral700, // neutral 700 - #0A0A0A
          dot: DESIGN_COLORS.primaryBlue,
          pressedOutline: DESIGN_COLORS.pressedOutline
        }
      }
    },
    disabled: {
      default: {
        unselected: {
          border: DESIGN_COLORS.neutral400,
          background: 'transparent',
          text: '#6C6C6C', // neutral 500 - #6C6C6C
          dot: DESIGN_COLORS.neutral400
        },
        selected: {
          border: DESIGN_COLORS.neutral400, // neutral 400 - #918F8F
          background: 'transparent',
          text: '#6C6C6C', // neutral 500 - #6C6C6C
          dot: DESIGN_COLORS.neutral400
        }
      },
      hover: {
        unselected: {
          border: DESIGN_COLORS.neutral400,
          background: 'transparent',
          text: '#6C6C6C',
          dot: DESIGN_COLORS.neutral400
        },
        selected: {
          border: DESIGN_COLORS.neutral400,
          background: 'transparent',
          text: '#6C6C6C',
          dot: DESIGN_COLORS.neutral400
        }
      },
      focus: {
        unselected: {
          border: DESIGN_COLORS.neutral400,
          background: 'transparent',
          text: '#6C6C6C',
          dot: DESIGN_COLORS.neutral400
        },
        selected: {
          border: DESIGN_COLORS.neutral400,
          background: 'transparent',
          text: '#6C6C6C',
          dot: DESIGN_COLORS.neutral400
        }
      },
      pressed: {
        unselected: {
          border: DESIGN_COLORS.neutral400,
          background: 'transparent',
          text: '#6C6C6C',
          dot: DESIGN_COLORS.neutral400
        },
        selected: {
          border: DESIGN_COLORS.neutral400,
          background: 'transparent',
          text: '#6C6C6C',
          dot: DESIGN_COLORS.neutral400
        }
      }
    },
    error: {
      default: {
        unselected: {
          border: DESIGN_COLORS.errorRed300,
          background: 'transparent',
          text: DESIGN_COLORS.errorRed300,
          dot: DESIGN_COLORS.errorRed300
        },
        selected: {
          border: DESIGN_COLORS.errorRed300,
          background: 'transparent',
          text: DESIGN_COLORS.errorRed300,
          dot: DESIGN_COLORS.errorRed300
        }
      },
      hover: {
        unselected: {
          border: DESIGN_COLORS.errorRed300,
          background: 'transparent',
          text: DESIGN_COLORS.errorRed300,
          dot: DESIGN_COLORS.errorRed300,
          hoverOutline: DESIGN_COLORS.hoverOutline
        },
        selected: {
          border: DESIGN_COLORS.errorRed300,
          background: 'transparent',
          text: DESIGN_COLORS.errorRed300,
          dot: DESIGN_COLORS.errorRed300,
          hoverOutline: DESIGN_COLORS.hoverOutline
        }
      },
      focus: {
        unselected: {
          border: DESIGN_COLORS.focusOutline,
          background: 'transparent',
          text: DESIGN_COLORS.errorRed300,
          dot: DESIGN_COLORS.errorRed300,
          focusOutline: DESIGN_COLORS.focusOutline
        },
        selected: {
          border: DESIGN_COLORS.focusOutline,
          background: 'transparent',
          text: DESIGN_COLORS.errorRed300,
          dot: DESIGN_COLORS.errorRed300,
          focusOutline: DESIGN_COLORS.focusOutline
        }
      },
      pressed: {
        unselected: {
          border: DESIGN_COLORS.errorRed300,
          background: 'transparent',
          text: DESIGN_COLORS.errorRed300,
          dot: DESIGN_COLORS.errorRed300,
          pressedOutline: DESIGN_COLORS.pressedOutline
        },
        selected: {
          border: DESIGN_COLORS.errorRed300,
          background: 'transparent',
          text: DESIGN_COLORS.errorRed300,
          dot: DESIGN_COLORS.errorRed300,
          pressedOutline: DESIGN_COLORS.pressedOutline
        }
      }
    }
  };

  return colorMap[type][state][variant];
};

// CSS Custom Properties Generator
export const generateRadioCSSCustomProperties = (colors: RadioColors): Record<string, string> => {
  return {
    '--radio-border-color': colors.border,
    '--radio-background-color': colors.background,
    '--radio-text-color': colors.text,
    '--radio-dot-color': colors.dot,
    '--radio-hover-outline': colors.hoverOutline || 'transparent',
    '--radio-focus-outline': colors.focusOutline || 'transparent',
    '--radio-pressed-outline': colors.pressedOutline || 'transparent'
  };
};

// Spacing and sizing constants from Figma
export const RADIO_SPACING = {
  verticalPadding: '4px', // c4-space-2x
  horizontalPadding: '4px', // c4-space-01
  spaceBetween: '16px', // c4-space-1x
  radioSize: '20px',
  borderRadius: '50%', // Circular for radio buttons
  borderWidth: '2px',
  focusBorderWidth: '3px',
  dotSize: '8px' // Inner dot size when selected
};

// Typography constants (same as checkbox)
export const RADIO_TYPOGRAPHY = {
  fontFamily: 'PT Sans, sans-serif',
  fontSize: '16px',
  fontWeight: '400',
  lineHeight: '150%'
};