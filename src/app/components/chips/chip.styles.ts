import { ChipColor, ChipVariant, ChipColors, ChipSize } from './chip.types';

// Design System Colors from Figma
export const DESIGN_COLORS = {
  // Neutral Colors
  neutral100: '#FCFCFC',
  neutral300: '#D3D3D3',
  neutral500: '#6C6C6C',
  neutral700: '#0A0A0A',
  
  // Blue Colors
  blue100: '#F2F9FF',
  blue700: '#115387',
  
  // Green Colors
  green100: '#E6F3D8',
  green500: '#006447',
  
  // Background Colors
  white: '#FFFFFF'
};

// Color mapping based on Figma specifications
export const getChipColors = (
  color: ChipColor,
  variant: ChipVariant
): ChipColors => {
  const colorMap: Record<ChipColor, Record<ChipVariant, ChipColors>> = {
    default: {
      filled: {
        background: DESIGN_COLORS.neutral100,
        border: DESIGN_COLORS.neutral300,
        text: DESIGN_COLORS.neutral700,
        icon: DESIGN_COLORS.neutral700,
        closeIcon: DESIGN_COLORS.neutral700
      },
      outlined: {
        background: 'transparent',
        border: DESIGN_COLORS.neutral300,
        text: DESIGN_COLORS.neutral700,
        icon: DESIGN_COLORS.neutral700,
        closeIcon: DESIGN_COLORS.neutral700
      }
    },
    blue: {
      filled: {
        background: DESIGN_COLORS.blue100,
        border: DESIGN_COLORS.blue700,
        text: DESIGN_COLORS.blue700,
        icon: DESIGN_COLORS.blue700,
        closeIcon: DESIGN_COLORS.blue700
      },
      outlined: {
        background: 'transparent',
        border: DESIGN_COLORS.blue700,
        text: DESIGN_COLORS.blue700,
        icon: DESIGN_COLORS.blue700,
        closeIcon: DESIGN_COLORS.blue700
      }
    },
    green: {
      filled: {
        background: DESIGN_COLORS.green100,
        border: DESIGN_COLORS.green500,
        text: DESIGN_COLORS.green500,
        icon: DESIGN_COLORS.green500,
        closeIcon: DESIGN_COLORS.green500
      },
      outlined: {
        background: 'transparent',
        border: DESIGN_COLORS.green500,
        text: DESIGN_COLORS.green500,
        icon: DESIGN_COLORS.green500,
        closeIcon: DESIGN_COLORS.green500
      }
    }
  };

  return colorMap[color][variant];
};

// CSS Custom Properties Generator
export const generateChipCSSCustomProperties = (colors: ChipColors): Record<string, string> => {
  return {
    '--chip-background-color': colors.background,
    '--chip-border-color': colors.border,
    '--chip-text-color': colors.text,
    '--chip-icon-color': colors.icon,
    '--chip-close-icon-color': colors.closeIcon
  };
};

// Spacing and sizing constants from Figma
export const CHIP_SPACING: Record<ChipSize, any> = {
  small: {
    verticalPadding: '0px',
    horizontalPadding: '4px',
    iconTextSpacing: 'N/A', // Small chips don't have icons
    maxWidth: '300px',
    fontSize: '14px',
    lineHeight: '150%',
    fontWeight: '400'
  },
  medium: {
    verticalPadding: '4px',
    horizontalPadding: '12px',
    iconTextSpacing: '4px',
    maxWidth: '300px',
    fontSize: '14px',
    lineHeight: '150%',
    fontWeight: '400'
  },
  large: {
    verticalPadding: '4px',
    horizontalPadding: '12px',
    iconTextSpacing: '4px',
    maxWidth: '300px',
    fontSize: '16px',
    lineHeight: '150%',
    fontWeight: '400'
  }
};

// Typography constants from Figma
export const CHIP_TYPOGRAPHY = {
  fontFamily: 'PT Sans, sans-serif',
  borderRadius: '16px', // Rounded pill shape
  borderWidth: '1px'
};