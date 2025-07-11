import { Component, Input, Output, EventEmitter, forwardRef, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormValidationService } from '../../services/form-validation.service';
import { AccessibilityService } from '../../services/accessibility.service';
import { 
  TextFieldType, 
  TextFieldState, 
  TextFieldStateConfig,
  TextFieldInputType,
  TextFieldSize,
  TextFieldValidation 
} from './text-field.types';
import { 
  getTextFieldColors, 
  generateTextFieldCSSCustomProperties,
  TEXT_FIELD_SPACING,
  TEXT_FIELD_TYPOGRAPHY 
} from './text-field.styles';
import { 
  TEXT_FIELD_VARIANTS, 
  getTextFieldVariant, 
  applyTextFieldVariant 
} from './text-field-variants';

@Component({
  selector: 'app-text-field',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFieldComponent),
      multi: true
    }
  ],
  template: `
    <div 
      class="text-field-container"
      [class.disabled]="disabled"
      [class.error]="error || hasValidationError"
      [class.focused]="focused"
      [class.filled]="filled"
      [style]="containerStyles"
    >
      <!-- Label -->
      <label 
        *ngIf="label" 
        class="text-field-label"
        [class.required]="required && !showOptionalLabel"
        [class.optional]="showOptionalLabel"
        [for]="id"
      >
        {{ label }}
        <button
          *ngIf="showHelpIcon"
          type="button"
          class="text-field-help-icon"
          [attr.aria-label]="'Help for ' + label"
          (click)="onHelpClick()"
        >
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
          </svg>
        </button>
      </label>

      <!-- Input wrapper -->
      <div class="text-field-input-wrapper">
        <input
          class="text-field-input"
          [class.has-prefix-icon]="prefixIcon"
          [class.has-suffix-icon]="suffixIcon || (inputType === 'password' && showPasswordToggle)"
          [class.has-clear-button]="clearable && filled && !disabled"
          [id]="id"
          [name]="name"
          [type]="getInputType()"
          [value]="value"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [required]="required"
          [attr.minlength]="minLength"
          [attr.maxlength]="maxLength"
          [pattern]="pattern"
          [attr.aria-describedby]="getAriaDescribedBy()"
          [attr.aria-invalid]="error || hasValidationError"
          [attr.autocomplete]="autocomplete"
          (input)="onInput($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
          (keydown)="onKeyDown($event)"
        />
        
        <!-- Prefix Icon -->
        <svg 
          *ngIf="prefixIcon" 
          class="text-field-prefix-icon"
          viewBox="0 0 16 16" 
          fill="currentColor"
          (click)="onPrefixIconClick()"
        >
          <ng-container [ngSwitch]="prefixIcon">
            <path *ngSwitchCase="'search'" d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            <path *ngSwitchCase="'email'" d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 14H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
            <path *ngSwitchCase="'phone'" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
            <path *ngSwitchDefault d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
          </ng-container>
        </svg>
        
        <!-- Clear Button -->
        <button
          *ngIf="clearable && filled && !disabled"
          type="button"
          class="text-field-clear-button"
          [attr.aria-label]="'Clear ' + label"
          (click)="onClearClick()"
        >
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
          </svg>
        </button>
        
        <!-- Password Toggle -->
        <button
          *ngIf="inputType === 'password' && showPasswordToggle"
          type="button"
          class="text-field-password-toggle"
          [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
          (click)="onPasswordToggle()"
        >
          <svg *ngIf="!showPassword" viewBox="0 0 16 16" fill="currentColor">
            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
          </svg>
          <svg *ngIf="showPassword" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
            <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
          </svg>
        </button>
        
        <!-- Suffix Icon -->
        <svg 
          *ngIf="suffixIcon && !(inputType === 'password' && showPasswordToggle)" 
          class="text-field-suffix-icon"
          viewBox="0 0 16 16" 
          fill="currentColor"
          (click)="onSuffixIconClick()"
        >
          <ng-container [ngSwitch]="suffixIcon">
            <path *ngSwitchCase="'calendar'" d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
            <path *ngSwitchCase="'info'" d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path *ngSwitchDefault d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
          </ng-container>
        </svg>
      </div>

      <!-- Helper text or error message -->
      <div 
        *ngIf="helperText || errorMessage || hasValidationError" 
        class="text-field-helper"
        [class.error]="error || hasValidationError"
        [id]="id + '-helper'"
      >
        <svg 
          *ngIf="(error || hasValidationError) && showErrorIcon" 
          class="text-field-helper-icon error"
          viewBox="0 0 16 16" 
          fill="currentColor"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
        </svg>
        <svg 
          *ngIf="!error && !hasValidationError && showHelperIcon" 
          class="text-field-helper-icon info"
          viewBox="0 0 16 16" 
          fill="currentColor"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
        </svg>
        <span>
          {{ getDisplayMessage() }}
        </span>
      </div>

      <!-- Character counter -->
      <div 
        *ngIf="showCharacterCounter && maxLength" 
        class="text-field-counter"
      >
        <span 
          class="text-field-counter-text"
          [class.error]="value.length > maxLength"
          [id]="id + '-counter'"
          [attr.aria-live]="'polite'"
        >
          {{ value.length }}/{{ maxLength }}
        </span>
      </div>
    </div>
  `,
  styleUrls: ['./text-field.component.css']
})
export class TextFieldComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() id: string = `text-field-${Math.random().toString(36).substr(2, 9)}`;
  @Input() name: string = '';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() helperText: string = '';
  @Input() errorMessage: string = '';
  @Input() value: string = '';
  @Input() inputType: TextFieldInputType = 'text';
  @Input() size: TextFieldSize = 'medium';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() error: boolean = false;
  @Input() showOptionalLabel: boolean = false;
  @Input() showHelpIcon: boolean = false;
  @Input() showHelperIcon: boolean = false;
  @Input() showErrorIcon: boolean = true;
  @Input() showCharacterCounter: boolean = false;
  @Input() minLength: number | null = null;
  @Input() maxLength: number | null = null;
  @Input() pattern: string | null = null;
  @Input() autocomplete: string = '';
  @Input() validation: TextFieldValidation = {};
  @Input() variant: string = ''; // New variant input
  @Input() debounceTime: number = 0; // Debounce for search inputs
  @Input() clearable: boolean = false; // Show clear button
  @Input() prefixIcon: string = ''; // Icon before input
  @Input() suffixIcon: string = ''; // Icon after input
  @Input() showPasswordToggle: boolean = false; // Show password visibility toggle
  @Input() ariaLabel: string = ''; // Custom aria-label
  @Input() ariaDescribedBy: string = ''; // Custom aria-describedby
  @Input() role: string = ''; // Custom role
  @Input() announceChanges: boolean = true; // Announce changes to screen readers
  @Input() customValidators: any[] = []; // Custom validators

  @Output() valueChange = new EventEmitter<string>();
  @Output() focusEvent = new EventEmitter<void>();
  @Output() blurEvent = new EventEmitter<void>();
  @Output() keydown = new EventEmitter<KeyboardEvent>();
  @Output() helpClick = new EventEmitter<void>();
  @Output() stateChange = new EventEmitter<TextFieldStateConfig>();
  @Output() clearEvent = new EventEmitter<void>();
  @Output() prefixIconClick = new EventEmitter<void>();
  @Output() suffixIconClick = new EventEmitter<void>();
  @Output() passwordToggle = new EventEmitter<boolean>();
  @Output() validationChange = new EventEmitter<boolean>();
  @Output() accessibilityEvent = new EventEmitter<string>();

  // Internal state
  focused: boolean = false;
  hovered: boolean = false;
  filled: boolean = false;
  hasValidationError: boolean = false;
  validationErrors: string[] = [];
  private debounceTimer: any;
  private _formatValue?: (value: string) => string;
  private _parseValue?: (value: string) => string;
  showPassword: boolean = false;
  private previousValue: string = '';
  private validationTimer: any;

  // Computed properties
  get textFieldType(): TextFieldType {
    if (this.disabled) return 'disabled';
    if (this.error || this.hasValidationError) return 'error';
    return 'default';
  }

  get textFieldState(): TextFieldState {
    if (this.focused) return 'selected';
    if (this.hovered) return 'hover';
    return 'unselected';
  }

  get currentColors() {
    return getTextFieldColors(this.textFieldType, this.textFieldState);
  }

  get containerStyles() {
    const customProps = generateTextFieldCSSCustomProperties(this.currentColors);
    return {
      ...customProps,
      '--text-field-font-family': TEXT_FIELD_TYPOGRAPHY.fontFamily,
      '--text-field-label-font-size': TEXT_FIELD_TYPOGRAPHY.labelFontSize,
      '--text-field-label-font-weight': TEXT_FIELD_TYPOGRAPHY.labelFontWeight,
      '--text-field-label-line-height': TEXT_FIELD_TYPOGRAPHY.labelLineHeight,
      '--text-field-input-font-size': TEXT_FIELD_TYPOGRAPHY.inputFontSize,
      '--text-field-input-font-weight': TEXT_FIELD_TYPOGRAPHY.inputFontWeight,
      '--text-field-input-line-height': TEXT_FIELD_TYPOGRAPHY.inputLineHeight,
      '--text-field-helper-font-size': TEXT_FIELD_TYPOGRAPHY.helperFontSize,
      '--text-field-helper-font-weight': TEXT_FIELD_TYPOGRAPHY.helperFontWeight,
      '--text-field-helper-line-height': TEXT_FIELD_TYPOGRAPHY.helperLineHeight
    };
  }

  // ControlValueAccessor implementation
  private onChange = (value: string) => {};
  private onTouched = () => {};
  private formControl: AbstractControl | null = null;

  constructor(
    private elementRef: ElementRef,
    private formValidationService: FormValidationService,
    private accessibilityService: AccessibilityService
  ) {}

  ngOnInit() {
    // Apply variant configuration if specified
    if (this.variant) {
      applyTextFieldVariant(this.variant, this);
    }
    
    this.updateFilledState();
    this.validateInput();
    this.emitStateChange();
    
    // Set up accessibility features
    this.setupAccessibility();
  }

  ngOnDestroy() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    if (this.validationTimer) {
      clearTimeout(this.validationTimer);
    }
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.disabled) {
      this.hovered = true;
      this.emitStateChange();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.hovered = false;
    this.emitStateChange();
  }

  writeValue(value: string): void {
    this.value = value || '';
    this.previousValue = this.value;
    this.updateFilledState();
    this.validateInput();
    this.emitStateChange();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.emitStateChange();
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    let newValue = target.value;
    const oldValue = this.previousValue;
    
    // Apply parsing if available (remove formatting for storage)
    if (this._parseValue) {
      newValue = this._parseValue(newValue);
    }
    
    this.value = newValue;
    this.updateFilledState();
    
    // Apply formatting for display
    if (this._formatValue) {
      const formattedValue = this._formatValue(newValue);
      if (formattedValue !== target.value) {
        target.value = formattedValue;
      }
    }
    
    // Debounce validation and change events for search inputs
    if (this.debounceTime > 0) {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => {
        this.validateInput();
        this.onChange(this.value);
        this.valueChange.emit(this.value);
        this.emitStateChange();
      }, this.debounceTime);
    } else {
      this.validateInput();
      this.onChange(this.value);
      this.valueChange.emit(this.value);
      this.emitStateChange();
    }
    
    // Announce significant changes to screen readers
    if (this.announceChanges && this.shouldAnnounceChange(oldValue, this.value)) {
      this.announceValueChange(oldValue, this.value);
    }
    
    this.previousValue = this.value;
  }

  onFocus(): void {
    this.focused = true;
    this.focusEvent.emit();
    this.emitStateChange();
    
    // Announce field information to screen readers
    if (this.announceChanges) {
      const announcement = this.buildFocusAnnouncement();
      if (announcement) {
        this.accessibilityService.announce(announcement);
      }
    }
  }

  onBlur(): void {
    this.focused = false;
    this.onTouched();
    this.blurEvent.emit();
    this.emitStateChange();
    
    // Announce validation errors on blur
    if (this.hasValidationError && this.announceChanges) {
      const errorMessage = this.getDisplayMessage();
      if (errorMessage) {
        this.accessibilityService.announceValidationError(this.label || 'Field', errorMessage);
      }
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    // Handle accessibility keyboard shortcuts
    this.handleAccessibilityKeyboard(event);
    this.keydown.emit(event);
  }

  onHelpClick(): void {
    this.helpClick.emit();
  }

  onClearClick(): void {
    this.clear();
    this.clearEvent.emit();
  }

  onPrefixIconClick(): void {
    this.prefixIconClick.emit();
  }

  onSuffixIconClick(): void {
    this.suffixIconClick.emit();
  }

  onPasswordToggle(): void {
    this.showPassword = !this.showPassword;
    this.passwordToggle.emit(this.showPassword);
    
    // Update input type
    const input = this.elementRef.nativeElement.querySelector('.text-field-input');
    if (input) {
      input.type = this.showPassword ? 'text' : 'password';
    }
  }

  getAriaDescribedBy(): string {
    const describedBy: string[] = [];
    
    // Add custom aria-describedby
    if (this.ariaDescribedBy) {
      describedBy.push(this.ariaDescribedBy);
    }
    
    // Add helper text ID
    if (this.helperText || this.errorMessage || this.hasValidationError) {
      describedBy.push(this.id + '-helper');
    }
    
    // Add character counter ID
    if (this.showCharacterCounter && this.maxLength) {
      describedBy.push(this.id + '-counter');
    }
    
    return describedBy.join(' ');
  }

  getDisplayMessage(): string {
    if (this.error && this.errorMessage) {
      return this.errorMessage;
    }
    if (this.hasValidationError && this.validationErrors.length > 0) {
      return this.validationErrors[0];
    }
    return this.helperText;
  }

  private updateFilledState(): void {
    this.filled = this.value.length > 0;
  }

  private validateInput(): void {
    this.validationErrors = [];
    this.hasValidationError = false;

    if (!this.validation || this.disabled) {
      return;
    }

    // Required validation
    if (this.validation.required && !this.value.trim()) {
      this.validationErrors.push('This field is required');
    }

    // Only validate other rules if field has content
    if (this.value.trim()) {
      // Min length validation
      if (this.validation.minLength && this.value.length < this.validation.minLength) {
        this.validationErrors.push(`Minimum ${this.validation.minLength} characters required`);
      }

      // Max length validation
      if (this.validation.maxLength && this.value.length > this.validation.maxLength) {
        this.validationErrors.push(`Maximum ${this.validation.maxLength} characters allowed`);
      }

      // Email validation
      if (this.validation.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.value)) {
          this.validationErrors.push('Please enter a valid email address');
        }
      }

      // Pattern validation
      if (this.validation.pattern && !this.validation.pattern.test(this.value)) {
        this.validationErrors.push('Please enter a valid format');
      }

      // Custom validation
      if (this.validation.customValidator && !this.validation.customValidator(this.value)) {
        this.validationErrors.push('Please enter a valid value');
      }
    }

    this.hasValidationError = this.validationErrors.length > 0;
    this.validationChange.emit(!this.hasValidationError);
  }

  getState(): TextFieldStateConfig {
    return {
      value: this.value,
      disabled: this.disabled,
      error: this.error || this.hasValidationError,
      focused: this.focused,
      hovered: this.hovered,
      filled: this.filled,
      required: this.required
    };
  }

  private emitStateChange(): void {
    this.stateChange.emit(this.getState());
  }
  
  // Accessibility helper methods
  private setupAccessibility(): void {
    // Set up ARIA attributes
    const input = this.elementRef.nativeElement.querySelector('.text-field-input');
    if (input) {
      // Set aria-label if provided
      if (this.ariaLabel) {
        input.setAttribute('aria-label', this.ariaLabel);
      }
      
      // Set custom role if provided
      if (this.role) {
        input.setAttribute('role', this.role);
      }
      
      // Set up live region for value changes
      if (this.announceChanges) {
        input.setAttribute('aria-live', 'polite');
      }
    }
  }
  
  private shouldAnnounceChange(oldValue: string, newValue: string): boolean {
    // Don't announce every keystroke, only significant changes
    if (Math.abs(newValue.length - oldValue.length) > 5) return true;
    if (oldValue === '' && newValue !== '') return true;
    if (oldValue !== '' && newValue === '') return true;
    return false;
  }
  
  private announceValueChange(oldValue: string, newValue: string): void {
    let announcement = '';
    
    if (newValue === '') {
      announcement = `${this.label || 'Field'} cleared`;
    } else if (oldValue === '') {
      announcement = `${this.label || 'Field'} has content`;
    } else {
      announcement = `${this.label || 'Field'} content changed`;
    }
    
    this.accessibilityService.announce(announcement);
    this.accessibilityEvent.emit(announcement);
  }
  
  private buildFocusAnnouncement(): string {
    const parts: string[] = [];
    
    // Field name and type
    if (this.label) {
      parts.push(this.label);
    }
    
    // Field type
    if (this.inputType !== 'text') {
      parts.push(`${this.inputType} field`);
    } else {
      parts.push('text field');
    }
    
    // Required status
    if (this.required) {
      parts.push('required');
    }
    
    // Current value
    if (this.value) {
      parts.push(`current value: ${this.value}`);
    } else if (this.placeholder) {
      parts.push(`placeholder: ${this.placeholder}`);
    }
    
    // Helper text
    if (this.helperText && !this.hasValidationError) {
      parts.push(this.helperText);
    }
    
    return parts.join(', ');
  }
  
  private handleAccessibilityKeyboard(event: KeyboardEvent): void {
    // Escape key clears field (if clearable)
    if (event.key === 'Escape' && this.clearable && this.filled && !this.disabled) {
      event.preventDefault();
      this.clear();
      this.accessibilityService.announce(`${this.label || 'Field'} cleared`);
    }
    
    // Ctrl+A selects all text
    if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
      const input = event.target as HTMLInputElement;
      if (input && input.select) {
        setTimeout(() => input.select(), 0);
      }
    }
  }

  // Public API methods
  focus(): void {
    const input = this.elementRef.nativeElement.querySelector('.text-field-input');
    if (input) {
      input.focus();
    }
  }

  blur(): void {
    const input = this.elementRef.nativeElement.querySelector('.text-field-input');
    if (input) {
      input.blur();
    }
  }

  clear(): void {
    this.value = '';
    this.updateFilledState();
    this.validateInput();
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    this.emitStateChange();
    
    // Clear the actual input field
    const input = this.elementRef.nativeElement.querySelector('.text-field-input');
    if (input) {
      input.value = '';
    }
  }

  isValid(): boolean {
    return !this.hasValidationError && !this.error;
  }

  getErrors(): string[] {
    return [...this.validationErrors];
  }

  // Get available variants
  static getAvailableVariants(): string[] {
    return Object.keys(TEXT_FIELD_VARIANTS);
  }

  // Set variant programmatically
  setVariant(variant: string): void {
    this.variant = variant;
    applyTextFieldVariant(variant, this);
    
    // Enable password toggle for password variants
    if (variant === 'password' || variant === 'newPassword') {
      this.showPasswordToggle = true;
    }
    
    this.validateInput();
    this.emitStateChange();
  }
  
  // Enhanced validation with form control integration
  validateWithFormControl(control: AbstractControl): void {
    this.formControl = control;
    
    // Use form validation service for enhanced validation
    if (control.errors) {
      const messages = this.formValidationService.getValidationMessages(control);
      this.validationErrors = messages.map(m => m.message);
      this.hasValidationError = messages.length > 0;
    } else {
      this.validationErrors = [];
      this.hasValidationError = false;
    }
    
    this.emitStateChange();
  }
  
  // Get enhanced error message using validation service
  getEnhancedErrorMessage(): string {
    if (this.formControl) {
      return this.formValidationService.getPrimaryValidationMessage(this.formControl);
    }
    return this.getDisplayMessage();
  }
  
  // Announce validation status
  announceValidationStatus(): void {
    if (this.hasValidationError) {
      const message = this.getEnhancedErrorMessage();
      this.accessibilityService.announceValidationError(this.label || 'Field', message);
    } else if (this.value && this.required) {
      this.accessibilityService.announce(`${this.label || 'Field'} is valid`);
    }
  }

  getInputType(): string {
    if (this.inputType === 'password' && this.showPassword) {
      return 'text';
    }
    return this.inputType;
  }
}