import { Component, Input, Output, EventEmitter, forwardRef, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccessibilityService } from '../../services/accessibility.service';
import { 
  CheckboxType, 
  CheckboxState, 
  CheckboxVariant, 
  CheckboxStateConfig,
  CheckboxSize 
} from './checkbox.types';
import { 
  getCheckboxColors, 
  generateCSSCustomProperties,
  CHECKBOX_SPACING,
  CHECKBOX_TYPOGRAPHY 
} from './checkbox.styles';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  template: `
    <label 
      class="checkbox-container"
      [class.disabled]="disabled"
      [class.error]="error"
      [class.focused]="focused"
      [class.hovered]="hovered"
      [class.pressed]="pressed"
      [attr.aria-label]="ariaLabel"
      [attr.aria-describedby]="ariaDescribedBy"
      [style]="containerStyles"
    >
      <div 
        class="checkbox-wrapper"
        [class.checked]="checked"
        [class.disabled]="disabled"
        [class.error]="error"
        [class.indeterminate]="indeterminate"
        [class.focused]="focused"
        [class.hovered]="hovered"
        [class.pressed]="pressed"
        [style]="checkboxStyles"
      >
        <input
          type="checkbox"
          class="checkbox-input"
          [id]="id"
          [name]="name"
          [checked]="checked"
          [disabled]="disabled"
          [indeterminate]="indeterminate"
          [attr.aria-describedby]="ariaDescribedBy"
          [attr.aria-invalid]="error"
          [attr.tabindex]="tabIndex"
          (change)="onCheckboxChange($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
          (keydown)="onKeyDown($event)"
          (mousedown)="onMouseDown()"
          (mouseup)="onMouseUp()"
        />
        <div class="checkbox-checkmark">
          <svg 
            *ngIf="checked && !indeterminate" 
            class="checkmark-icon"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            [style.color]="currentColors.checkmark"
          >
            <path 
              d="M13.5 4.5L6 12L2.5 8.5" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            />
          </svg>
          <div 
            *ngIf="indeterminate" 
            class="indeterminate-icon"
            [style.background-color]="currentColors.checkmark"
          ></div>
        </div>
      </div>
      <span 
        *ngIf="label" 
        class="checkbox-label"
        [class.disabled]="disabled"
        [class.error]="error"
        [style.color]="currentColors.text"
      >
        {{ label }}
      </span>
    </label>
  `,
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() id: string = `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  @Input() name: string = '';
  @Input() label: string = '';
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() error: boolean = false;
  @Input() indeterminate: boolean = false;
  @Input() size: CheckboxSize = 'medium';
  @Input() ariaLabel: string = '';
  @Input() ariaDescribedBy: string = '';
  @Input() tabIndex: number = 0;
  @Input() announceChanges: boolean = true;
  @Input() keyboardShortcuts: boolean = true;

  @Output() change = new EventEmitter<boolean>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();
  @Output() stateChange = new EventEmitter<CheckboxStateConfig>();
  @Output() accessibilityEvent = new EventEmitter<string>();

  // Internal state
  focused: boolean = false;
  hovered: boolean = false;
  pressed: boolean = false;

  // Computed properties
  get checkboxType(): CheckboxType {
    if (this.disabled) return 'disabled';
    if (this.error) return 'error';
    return 'enabled';
  }

  get checkboxState(): CheckboxState {
    if (this.pressed) return 'pressed';
    if (this.focused) return 'focus';
    if (this.hovered) return 'hover';
    return 'default';
  }

  get checkboxVariant(): CheckboxVariant {
    return this.checked ? 'selected' : 'unselected';
  }

  get currentColors() {
    return getCheckboxColors(this.checkboxType, this.checkboxState, this.checkboxVariant);
  }

  get containerStyles() {
    const customProps = generateCSSCustomProperties(this.currentColors);
    return {
      ...customProps,
      '--checkbox-font-family': CHECKBOX_TYPOGRAPHY.fontFamily,
      '--checkbox-font-size': CHECKBOX_TYPOGRAPHY.fontSize,
      '--checkbox-font-weight': CHECKBOX_TYPOGRAPHY.fontWeight,
      '--checkbox-line-height': CHECKBOX_TYPOGRAPHY.lineHeight
    };
  }

  get checkboxStyles() {
    const colors = this.currentColors;
    const styles: any = {
      'border-color': colors.border,
      'background-color': colors.background,
      'width': CHECKBOX_SPACING.checkboxSize,
      'height': CHECKBOX_SPACING.checkboxSize,
      'border-radius': CHECKBOX_SPACING.borderRadius,
      'border-width': CHECKBOX_SPACING.borderWidth
    };

    // Apply focus state with 3-line border system
    if (this.focused) {
      styles['border-width'] = CHECKBOX_SPACING.focusBorderWidth;
      styles['border-color'] = colors.focusOutline;
      styles['box-shadow'] = `0 0 0 1px ${colors.focusOutline}, inset 0 0 0 1px #fff`;
    }

    // Apply hover outline
    if (this.hovered && !this.focused && colors.hoverOutline) {
      styles['outline'] = `1px solid ${colors.hoverOutline}`;
      styles['outline-offset'] = '1px';
    }

    // Apply pressed outline
    if (this.pressed && colors.pressedOutline) {
      styles['outline'] = `2px solid ${colors.pressedOutline}`;
      styles['outline-offset'] = '0px';
    }

    return styles;
  }

  // ControlValueAccessor implementation
  private onChange = (value: boolean) => {};
  private onTouched = () => {};
  private previousChecked: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private accessibilityService: AccessibilityService
  ) {}

  ngOnInit() {
    this.previousChecked = this.checked;
    this.setupAccessibility();
    this.emitStateChange();
  }

  ngOnDestroy() {
    // Cleanup if needed
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
    this.pressed = false;
    this.emitStateChange();
  }

  writeValue(value: boolean): void {
    this.checked = !!value;
    this.previousChecked = this.checked;
    this.emitStateChange();
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.emitStateChange();
  }

  onCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const wasChecked = this.checked;
    this.checked = target.checked;
    this.indeterminate = false;
    
    this.onChange(this.checked);
    this.change.emit(this.checked);
    this.onTouched();
    this.emitStateChange();
    
    // Announce state change to screen readers
    if (this.announceChanges && wasChecked !== this.checked) {
      this.announceStateChange();
    }
  }

  onFocus(): void {
    this.focused = true;
    this.focus.emit();
    this.emitStateChange();
    
    // Announce checkbox information on focus
    if (this.announceChanges) {
      this.announceFocusInfo();
    }
  }

  onBlur(): void {
    this.focused = false;
    this.blur.emit();
    this.onTouched();
    this.emitStateChange();
  }

  onMouseDown(): void {
    if (!this.disabled) {
      this.pressed = true;
      this.emitStateChange();
    }
  }

  onMouseUp(): void {
    this.pressed = false;
    this.emitStateChange();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (!this.disabled) {
        this.pressed = true;
        this.toggle();
        this.emitStateChange();
      }
    }
    
    // Handle additional keyboard shortcuts
    if (this.keyboardShortcuts) {
      this.handleKeyboardShortcuts(event);
    }
  }

  toggle(): void {
    if (!this.disabled) {
      const wasChecked = this.checked;
      this.checked = !this.checked;
      this.indeterminate = false;
      this.onChange(this.checked);
      this.change.emit(this.checked);
      this.emitStateChange();
      
      // Announce toggle action
      if (this.announceChanges && wasChecked !== this.checked) {
        this.announceStateChange();
      }
    }
  }

  getState(): CheckboxStateConfig {
    return {
      checked: this.checked,
      disabled: this.disabled,
      error: this.error,
      indeterminate: this.indeterminate,
      focused: this.focused,
      hovered: this.hovered,
      pressed: this.pressed
    };
  }

  private emitStateChange(): void {
    this.stateChange.emit(this.getState());
  }
  
  // Accessibility helper methods
  private setupAccessibility(): void {
    const input = this.elementRef.nativeElement.querySelector('.checkbox-input');
    if (input) {
      // Enhanced ARIA attributes
      if (this.indeterminate) {
        input.setAttribute('aria-checked', 'mixed');
      }
      
      // Set up keyboard navigation indicator
      input.addEventListener('focus', () => {
        input.setAttribute('data-keyboard-navigation', 'true');
      });
      
      input.addEventListener('mousedown', () => {
        input.removeAttribute('data-keyboard-navigation');
      });
    }
  }
  
  private announceStateChange(): void {
    const state = this.checked ? 'checked' : 'unchecked';
    const announcement = `${this.label || 'Checkbox'} ${state}`;
    
    this.accessibilityService.announce(announcement);
    this.accessibilityEvent.emit(announcement);
  }
  
  private announceFocusInfo(): void {
    const parts: string[] = [];
    
    // Checkbox name and state
    if (this.label) {
      parts.push(this.label);
    }
    parts.push('checkbox');
    
    // Current state
    if (this.indeterminate) {
      parts.push('partially checked');
    } else {
      parts.push(this.checked ? 'checked' : 'unchecked');
    }
    
    // Additional info
    if (this.disabled) {
      parts.push('disabled');
    }
    if (this.error) {
      parts.push('invalid');
    }
    
    const announcement = parts.join(', ');
    this.accessibilityService.announce(announcement);
  }
  
  private handleKeyboardShortcuts(event: KeyboardEvent): void {
    // Ctrl+Shift+C to toggle (custom shortcut)
    if (event.key === 'c' && event.ctrlKey && event.shiftKey) {
      event.preventDefault();
      this.toggle();
    }
  }
}