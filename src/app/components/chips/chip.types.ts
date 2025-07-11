export type ChipSize = 'small' | 'medium' | 'large';
export type ChipColor = 'default' | 'blue' | 'green';
export type ChipVariant = 'filled' | 'outlined';

export interface ChipColors {
  background: string;
  border: string;
  text: string;
  icon: string;
  closeIcon: string;
}

export interface ChipStateConfig {
  size: ChipSize;
  color: ChipColor;
  variant: ChipVariant;
  dismissible: boolean;
  hasIcon: boolean;
  disabled: boolean;
  selected: boolean;
}

export interface ChipOption {
  id: string;
  label: string;
  value: any;
  disabled?: boolean;
  icon?: string;
  dismissible?: boolean;
}