export type RadioType = 'default' | 'disabled' | 'error';
export type RadioState = 'default' | 'hover' | 'focus' | 'pressed';
export type RadioVariant = 'unselected' | 'selected';
export type RadioSize = 'small' | 'medium' | 'large';

export interface RadioColors {
  border: string;
  background: string;
  text: string;
  dot: string;
  hoverOutline?: string;
  focusOutline?: string;
  pressedOutline?: string;
}

export interface RadioStateConfig {
  selected: boolean;
  disabled: boolean;
  error: boolean;
  focused?: boolean;
  hovered?: boolean;
  pressed?: boolean;
}

export interface RadioOption {
  id: string;
  label: string;
  value: any;
  disabled?: boolean;
  error?: boolean;
}

export interface RadioGroupState {
  selectedValue: any;
}

export interface RadioValidation {
  required?: boolean;
  customValidator?: (selectedValue: any) => boolean;
}