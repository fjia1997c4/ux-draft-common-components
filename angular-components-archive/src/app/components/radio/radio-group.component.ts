import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RadioComponent } from './radio.component';
import { RadioStateService, RadioGroupState } from '../../services/radio-state.service';
import { Subject, takeUntil } from 'rxjs';

export interface RadioOption {
  id: string;
  label: string;
  value: any;
  disabled?: boolean;
  error?: boolean;
}

@Component({
  selector: 'app-radio-group',
  standalone: true,
  imports: [CommonModule, RadioComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true
    }
  ],
  template: `
    <div 
      class="radio-group"
      [class.horizontal]="layout === 'horizontal'"
      [attr.role]="'radiogroup'" 
      [attr.aria-labelledby]="groupId + '-label'"
      [attr.aria-invalid]="errorMessage ? 'true' : 'false'"
    >
      <div *ngIf="label" class="radio-group-label" [id]="groupId + '-label'">
        {{ label }}
      </div>
      
      <div class="radio-group-options">
        <app-radio
          *ngFor="let option of options; trackBy: trackByOptionId"
          [id]="option.id"
          [name]="groupId"
          [label]="option.label"
          [value]="option.value"
          [selected]="getOptionSelected(option.value)"
          [disabled]="disabled || (option.disabled ?? false)"
          [error]="(option.error ?? false) || !!errorMessage"
          (change)="onOptionChange($event)"
          (focus)="onOptionFocus()"
          (blur)="onOptionBlur()"
        />
      </div>
      
      <div *ngIf="errorMessage" class="radio-group-error" [attr.aria-live]="'polite'">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styleUrls: ['./radio-group.component.css']
})
export class RadioGroupComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() groupId: string = `radio-group-${Math.random().toString(36).substr(2, 9)}`;
  @Input() label: string = '';
  @Input() options: RadioOption[] = [];
  @Input() disabled: boolean = false;
  @Input() errorMessage: string = '';
  @Input() required: boolean = false;
  @Input() layout: 'vertical' | 'horizontal' = 'vertical';

  @Output() selectionChange = new EventEmitter<any>();
  @Output() validationChange = new EventEmitter<boolean>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();

  private destroy$ = new Subject<void>();
  
  selectedValue: any = null;
  selectedOption: RadioOption | null = null;

  // ControlValueAccessor implementation
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(private radioStateService: RadioStateService) {}

  ngOnInit(): void {
    // Initialize the radio group in the service
    this.radioStateService.initializeGroup(this.groupId, this.selectedValue);
    
    // Subscribe to radio group state changes
    this.radioStateService.getRadioGroup(this.groupId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.updateGroupState(state);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.selectedValue = value;
    this.radioStateService.updateRadioState(this.groupId, value);
    this.updateSelectedOption();
    this.validateSelection();
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  trackByOptionId(index: number, option: RadioOption): string {
    return option.id;
  }

  getOptionSelected(optionValue: any): boolean {
    return this.radioStateService.isSelected(this.groupId, optionValue);
  }

  onOptionChange(selectedValue: any): void {
    this.selectedValue = selectedValue;
    this.radioStateService.updateRadioState(this.groupId, selectedValue);
    
    // Notify form control
    this.onChange(selectedValue);
    
    this.updateSelectedOption();
    this.validateSelection();
  }

  onOptionFocus(): void {
    this.focus.emit();
  }

  onOptionBlur(): void {
    this.onTouched();
    this.blur.emit();
  }

  private updateGroupState(state: RadioGroupState): void {
    const previousValue = this.selectedValue;
    this.selectedValue = state.selectedValue;
    this.updateSelectedOption();
    
    // Only emit if value actually changed
    if (previousValue !== this.selectedValue) {
      this.selectionChange.emit(this.selectedValue);
    }
  }

  private updateSelectedOption(): void {
    this.selectedOption = this.options.find(opt => opt.value === this.selectedValue) || null;
  }

  private validateSelection(): void {
    const isValid = !this.required || this.selectedValue !== null;
    this.validationChange.emit(isValid);
  }

  // Public API methods
  getSelectedValue(): any {
    return this.selectedValue;
  }

  getSelectedOption(): RadioOption | null {
    return this.selectedOption;
  }

  reset(): void {
    this.radioStateService.clearSelection(this.groupId);
    this.onChange(null);
  }

  selectOption(value: any): void {
    const option = this.options.find(opt => opt.value === value);
    if (option && !option.disabled && !this.disabled) {
      this.onOptionChange(value);
    }
  }

  // Validation helper
  isValid(): boolean {
    return !this.required || this.selectedValue !== null;
  }

  // Get validation errors
  getErrors(): string[] {
    const errors: string[] = [];
    if (this.required && this.selectedValue === null) {
      errors.push('Selection is required');
    }
    return errors;
  }
}