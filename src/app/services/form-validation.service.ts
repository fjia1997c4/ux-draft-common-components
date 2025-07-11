import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface ValidationMessage {
  type: string;
  message: string;
  priority: number;
}

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {
  
  // Custom validators
  static phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
      const isValid = phoneRegex.test(control.value);
      
      return isValid ? null : { 
        phone: { 
          message: 'Phone number must be in format (555) 123-4567',
          actualValue: control.value 
        } 
      };
    };
  }

  static passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = control.value;
      const errors: any = {};
      
      if (value.length < 8) {
        errors.minLength = { message: 'Password must be at least 8 characters long' };
      }
      
      if (!/[a-z]/.test(value)) {
        errors.lowercase = { message: 'Password must contain at least one lowercase letter' };
      }
      
      if (!/[A-Z]/.test(value)) {
        errors.uppercase = { message: 'Password must contain at least one uppercase letter' };
      }
      
      if (!/\d/.test(value)) {
        errors.number = { message: 'Password must contain at least one number' };
      }
      
      if (!/[@$!%*?&]/.test(value)) {
        errors.special = { message: 'Password must contain at least one special character (@$!%*?&)' };
      }
      
      return Object.keys(errors).length > 0 ? { passwordStrength: errors } : null;
    };
  }

  static confirmPasswordValidator(passwordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;
      
      const password = control.parent.get(passwordField);
      const confirmPassword = control;
      
      if (!password || !confirmPassword) return null;
      
      if (password.value !== confirmPassword.value) {
        return { 
          confirmPassword: { 
            message: 'Passwords do not match' 
          } 
        };
      }
      
      return null;
    };
  }

  static urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      try {
        new URL(control.value);
        return null;
      } catch {
        return { 
          url: { 
            message: 'Please enter a valid URL (e.g., https://example.com)' 
          } 
        };
      }
    };
  }

  static creditCardValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      // Remove spaces and check if it's all digits
      const cleaned = control.value.replace(/\s/g, '');
      
      if (!/^\d{16}$/.test(cleaned)) {
        return { 
          creditCard: { 
            message: 'Credit card number must be 16 digits' 
          } 
        };
      }
      
      // Luhn algorithm validation
      let sum = 0;
      let isEven = false;
      
      for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned.charAt(i), 10);
        
        if (isEven) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }
        
        sum += digit;
        isEven = !isEven;
      }
      
      return sum % 10 === 0 ? null : { 
        creditCard: { 
          message: 'Invalid credit card number' 
        } 
      };
    };
  }

  // Get validation messages with priority
  getValidationMessages(control: AbstractControl): ValidationMessage[] {
    if (!control.errors) return [];
    
    const messages: ValidationMessage[] = [];
    
    // Priority order for validation messages
    const priorityMap: { [key: string]: number } = {
      required: 1,
      email: 2,
      minlength: 3,
      maxlength: 4,
      pattern: 5,
      phone: 6,
      passwordStrength: 7,
      confirmPassword: 8,
      url: 9,
      creditCard: 10
    };
    
    Object.keys(control.errors).forEach(errorType => {
      const error = control.errors![errorType];
      let message = '';
      
      switch (errorType) {
        case 'required':
          message = 'This field is required';
          break;
        case 'email':
          message = 'Please enter a valid email address';
          break;
        case 'minlength':
          message = `Minimum ${error.requiredLength} characters required`;
          break;
        case 'maxlength':
          message = `Maximum ${error.requiredLength} characters allowed`;
          break;
        case 'pattern':
          message = 'Please enter a valid format';
          break;
        case 'passwordStrength':
          // Return the first error message from password strength validation
          const strengthErrors = Object.values(error);
          message = (strengthErrors[0] as any).message;
          break;
        default:
          message = error.message || `Invalid ${errorType}`;
      }
      
      messages.push({
        type: errorType,
        message,
        priority: priorityMap[errorType] || 99
      });
    });
    
    // Sort by priority
    return messages.sort((a, b) => a.priority - b.priority);
  }

  // Get the primary validation message (highest priority)
  getPrimaryValidationMessage(control: AbstractControl): string {
    const messages = this.getValidationMessages(control);
    return messages.length > 0 ? messages[0].message : '';
  }

  // Check if control has specific error type
  hasError(control: AbstractControl, errorType: string): boolean {
    return !!(control.errors && control.errors[errorType]);
  }

  // Get all error types for a control
  getErrorTypes(control: AbstractControl): string[] {
    return control.errors ? Object.keys(control.errors) : [];
  }
}