export type CheckboxType = 'enabled' | 'disabled' | 'error';
export type CheckboxState = 'default' | 'hover' | 'focus' | 'pressed';
export type CheckboxVariant = 'unselected' | 'selected';
export type CheckboxSize = 'small' | 'medium' | 'large';

export interface CheckboxColors {
  border: string;
  background: string;
  text: string;
  checkmark: string;
  hoverOutline?: string;
  focusOutline?: string;
  pressedOutline?: string;
}

export interface CheckboxStateConfig {
  checked: boolean;
  disabled: boolean;
  error: boolean;
  indeterminate?: boolean;
  focused?: boolean;
  hovered?: boolean;
  pressed?: boolean;
}

export interface CheckboxOption {
  id: string;
  label: string;
  value: any;
  disabled?: boolean;
  error?: boolean;
}

export interface CheckboxGroupState {
  [key: string]: boolean;
}

export interface CheckboxValidation {
  required?: boolean;
  minSelection?: number;
  maxSelection?: number;
  customValidator?: (selectedOptions: CheckboxOption[]) => boolean;
}