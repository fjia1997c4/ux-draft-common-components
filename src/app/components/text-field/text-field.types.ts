export type TextFieldType = 'default' | 'error' | 'disabled';
export type TextFieldState = 'unselected' | 'hover' | 'selected';
export type TextFieldInputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
export type TextFieldSize = 'small' | 'medium' | 'large';

export interface TextFieldColors {
  border: string;
  background: string;
  text: string;
  label: string;
  helperText: string;
  placeholder: string;
  focusOutline?: string;
}

export interface TextFieldStateConfig {
  value: string;
  disabled: boolean;
  error: boolean;
  focused: boolean;
  hovered: boolean;
  filled: boolean;
  required: boolean;
}

export interface TextFieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  customValidator?: (value: string) => boolean;
}