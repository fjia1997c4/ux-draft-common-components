import { TextFieldValidation } from './text-field.types';

// Specialized input type configurations
export interface TextFieldVariantConfig {
  inputType: string;
  placeholder: string;
  validation: TextFieldValidation;
  formatValue?: (value: string) => string;
  parseValue?: (value: string) => string;
  mask?: string;
  autocomplete?: string;
}

// Phone number formatting
export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return value;
};

// Currency formatting
export const formatCurrency = (value: string): string => {
  const cleaned = value.replace(/[^\d.]/g, '');
  const number = parseFloat(cleaned);
  if (isNaN(number)) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(number);
};

// Social Security Number formatting
export const formatSSN = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return value;
};

// Credit card formatting
export const formatCreditCard = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleaned;
};

// Predefined text field variants
export const TEXT_FIELD_VARIANTS: Record<string, TextFieldVariantConfig> = {
  email: {
    inputType: 'email',
    placeholder: 'Enter your email address',
    validation: {
      required: true,
      email: true
    },
    autocomplete: 'email'
  },
  
  password: {
    inputType: 'password',
    placeholder: 'Enter your password',
    validation: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
    },
    autocomplete: 'current-password'
  },
  
  newPassword: {
    inputType: 'password',
    placeholder: 'Create a new password',
    validation: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
    },
    autocomplete: 'new-password'
  },
  
  phone: {
    inputType: 'tel',
    placeholder: '(555) 123-4567',
    validation: {
      required: true,
      pattern: /^\(\d{3}\) \d{3}-\d{4}$/
    },
    formatValue: formatPhoneNumber,
    parseValue: (value: string) => value.replace(/\D/g, ''),
    autocomplete: 'tel'
  },
  
  currency: {
    inputType: 'text',
    placeholder: '$0.00',
    validation: {
      pattern: /^\$\d{1,3}(,\d{3})*(\.\d{2})?$/
    },
    formatValue: formatCurrency,
    parseValue: (value: string) => value.replace(/[^\d.]/g, ''),
    autocomplete: 'off'
  },
  
  ssn: {
    inputType: 'text',
    placeholder: '123-45-6789',
    validation: {
      required: true,
      pattern: /^\d{3}-\d{2}-\d{4}$/
    },
    formatValue: formatSSN,
    parseValue: (value: string) => value.replace(/\D/g, ''),
    autocomplete: 'off'
  },
  
  creditCard: {
    inputType: 'text',
    placeholder: '1234 5678 9012 3456',
    validation: {
      required: true,
      pattern: /^\d{4} \d{4} \d{4} \d{4}$/,
      minLength: 19,
      maxLength: 19
    },
    formatValue: formatCreditCard,
    parseValue: (value: string) => value.replace(/\D/g, ''),
    autocomplete: 'cc-number'
  },
  
  url: {
    inputType: 'url',
    placeholder: 'https://example.com',
    validation: {
      pattern: /^https?:\/\/.+/
    },
    autocomplete: 'url'
  },
  
  search: {
    inputType: 'search',
    placeholder: 'Search...',
    validation: {},
    autocomplete: 'off'
  },
  
  firstName: {
    inputType: 'text',
    placeholder: 'Enter your first name',
    validation: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Z\s'-]+$/
    },
    autocomplete: 'given-name'
  },
  
  lastName: {
    inputType: 'text',
    placeholder: 'Enter your last name',
    validation: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Z\s'-]+$/
    },
    autocomplete: 'family-name'
  },
  
  zipCode: {
    inputType: 'text',
    placeholder: '12345',
    validation: {
      required: true,
      pattern: /^\d{5}(-\d{4})?$/
    },
    autocomplete: 'postal-code'
  }
};

// Helper function to get variant configuration
export const getTextFieldVariant = (variant: string): TextFieldVariantConfig | null => {
  return TEXT_FIELD_VARIANTS[variant] || null;
};

// Helper function to apply variant to component
export const applyTextFieldVariant = (variant: string, component: any): void => {
  const config = getTextFieldVariant(variant);
  if (config) {
    component.inputType = config.inputType;
    component.placeholder = config.placeholder;
    component.validation = { ...component.validation, ...config.validation };
    component.autocomplete = config.autocomplete || '';
    
    // Store formatting functions for use in component
    if (config.formatValue) {
      component._formatValue = config.formatValue;
    }
    if (config.parseValue) {
      component._parseValue = config.parseValue;
    }
  }
};