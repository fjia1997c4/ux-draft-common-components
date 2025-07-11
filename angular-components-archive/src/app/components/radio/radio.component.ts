import { Component, Input, Output, EventEmitter, forwardRef, OnInit, OnDestroy, HostListener, ElementRef, Inject, Optional } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AccessibilityService } from '../../services/accessibility.service';
import { 
  RadioType, 
  RadioState, 
  RadioVariant, 
  RadioStateConfig,
  RadioSize 
} from './radio.types';
import { 
  getRadioColors, 
  generateRadioCSSCustomProperties,
  RADIO_SPACING,
  RADIO_TYPOGRAPHY 
} from './radio.styles';
import { RadioStateService } from '../../services/radio-state.service';

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true
    }
  ],
  template: `
    <label 
      class="radio-container"
      [class.disabled]="disabled"
      [class.error]="error"
      [class.focused]="focused"
      [class.hovered]="hovered"
      [class.pressed]="pressed"
      [class.selected]="selected"
      [attr.aria-label]="ariaLabel"
      [attr.aria-describedby]="ariaDescribedBy"
      [style]="containerStyles"
    >
      <div 
        class="radio-wrapper"
        [class.selected]="selected"
        [class.disabled]="disabled"
        [class.error]="error"
        [class.focused]="focused"
        [class.hovered]="hovered"
        [class.pressed]="pressed"
        [style]="radioStyles"
      >
        <input
          type="radio"
          class="radio-input"
          [id]="id"
          [name]="name"
          [value]="value"
          [checked]="selected"
          [disabled]="disabled"
          [attr.aria-describedby]="ariaDescribedBy"
          [attr.aria-invalid]="error"
          [attr.tabindex]="tabIndex"
          (change)="onRadioChange($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
          (keydown)="onKeyDown($event)"
          (mousedown)="onMouseDown()"
          (mouseup)="onMouseUp()"
        />
        <div class="radio-dot">
          <div 
            class="dot-inner"
            [style.background-color]="currentColors.dot"
          ></div>
        </div>
      </div>
      <span 
        *ngIf="label" 
        class="radio-label"
        [class.disabled]="disabled"
        [class.error]="error"
        [style.color]="currentColors.text"
      >
        {{ label }}
      </span>
    </label>
  `,
  styleUrls: ['./radio.component.css']
})
export class RadioComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() id: string = `radio-${Math.random().toString(36).substr(2, 9)}`;
  @Input() name: string = '';
  @Input() label: string = '';
  @Input() value: any = '';
  @Input() selected: boolean = false;
  @Input() disabled: boolean = false;
  @Input() error: boolean = false;
  @Input() size: RadioSize = 'medium';
  @Input() ariaLabel: string = '';
  @Input() ariaDescribedBy: string = '';
  @Input() tabIndex: number = 0;
  @Input() announceChanges: boolean = true;
  @Input() keyboardShortcuts: boolean = true;

  @Output() change = new EventEmitter<any>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();
  @Output() stateChange = new EventEmitter<RadioStateConfig>();
  @Output() accessibilityEvent = new EventEmitter<string>();

  // Internal state
  focused: boolean = false;
  hovered: boolean = false;
  pressed: boolean = false;
  private destroy$ = new Subject<void>();

  // Computed properties
  get radioType(): RadioType {
    if (this.disabled) return 'disabled';
    if (this.error) return 'error';
    return 'default';
  }

  get radioState(): RadioState {
    if (this.pressed) return 'pressed';
    if (this.focused) return 'focus';
    if (this.hovered) return 'hover';
    return 'default';
  }

  get radioVariant(): RadioVariant {
    return this.selected ? 'selected' : 'unselected';
  }

  get currentColors() {
    return getRadioColors(this.radioType, this.radioState, this.radioVariant);
  }

  get containerStyles() {
    const customProps = generateRadioCSSCustomProperties(this.currentColors);
    return {
      ...customProps,
      '--radio-font-family': RADIO_TYPOGRAPHY.fontFamily,
      '--radio-font-size': RADIO_TYPOGRAPHY.fontSize,
      '--radio-font-weight': RADIO_TYPOGRAPHY.fontWeight,
      '--radio-line-height': RADIO_TYPOGRAPHY.lineHeight
    };
  }

  get radioStyles() {
    const colors = this.currentColors;
    const styles: any = {
      'border-color': colors.border,
      'background-color': colors.background,
      'width': RADIO_SPACING.radioSize,
      'height': RADIO_SPACING.radioSize,
      'border-radius': RADIO_SPACING.borderRadius,
      'border-width': RADIO_SPACING.borderWidth
    };

    // Apply focus state with 3-line border system
    if (this.focused) {
      styles['border-width'] = RADIO_SPACING.focusBorderWidth;
      styles['border-color'] = colors.focusOutline;
      styles['box-shadow'] = `0 0 0 1px ${colors.focusOutline}, inset 0 0 0 1px #FCFCFC`;
    }

    // Apply hover outline for unselected and selected states
    if (this.hovered && !this.focused && colors.hoverOutline) {
      styles['outline'] = `1px solid ${colors.hoverOutline}`;
      styles['outline-offset'] = '1px';
    }

    // Apply pressed outline for both selected and unselected states
    if (this.pressed && colors.pressedOutline) {
      styles['outline'] = `2px solid ${colors.pressedOutline}`;
      styles['outline-offset'] = '0px';
    }

    // Ensure selected state maintains proper border color
    if (this.selected && !this.focused) {
      styles['border-color'] = colors.border;
    }

    return styles;
  }

  // ControlValueAccessor implementation
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(
    private elementRef: ElementRef,
    private radioStateService: RadioStateService,
    @Optional() @Inject(NgControl) private ngControl: NgControl,
    private accessibilityService: AccessibilityService
  ) {}

  ngOnInit() {
    // Subscribe to radio group state changes if this radio is part of a group
    if (this.name) {
      this.radioStateService.initializeGroup(this.name);
      
      this.radioStateService.getRadioGroup(this.name)
        .pipe(takeUntil(this.destroy$))
        .subscribe(state => {
          const wasSelected = this.selected;
          this.selected = state.selectedValue === this.value;
          
          // Only emit change if selection state actually changed
          if (wasSelected !== this.selected) {
            this.emitStateChange();
          }
        });
    }
    
    this.setupAccessibility();
    this.emitStateChange();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  writeValue(value: any): void {
    this.selected = value === this.value;
    
    // Update radio group state if this radio is part of a group
    if (this.name && this.selected) {
      this.radioStateService.updateRadioState(this.name, this.value);
    }
    
    this.emitStateChange();
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.emitStateChange();
  }

  onRadioChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.checked && !this.disabled) {
      const wasSelected = this.selected;
      this.selected = true;
      
      // Update radio group state
      if (this.name) {
        this.radioStateService.updateRadioState(this.name, this.value);
      }
      
      // Emit to form control and component output
      this.onChange(this.value);
      this.change.emit(this.value);
      this.onTouched();
      this.emitStateChange();
      
      // Announce selection change
      if (this.announceChanges && !wasSelected) {
        this.announceSelectionChange();
      }
    }
  }

  onFocus(): void {
    this.focused = true;
    this.focus.emit();
    this.emitStateChange();
    
    // Announce radio information on focus
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
        this.select();
        this.emitStateChange();
      }
    }
    
    // Handle arrow key navigation for radio groups
    if (this.name && (event.key === 'ArrowUp' || event.key === 'ArrowDown' || 
                      event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      this.handleArrowNavigation(event);
    }
    
    // Handle additional keyboard shortcuts
    if (this.keyboardShortcuts) {
      this.handleKeyboardShortcuts(event);
    }
  }

  select(): void {
    if (!this.disabled && !this.selected) {
      const wasSelected = this.selected;
      this.selected = true;
      
      // Update radio group state
      if (this.name) {
        this.radioStateService.updateRadioState(this.name, this.value);
      }
      
      this.onChange(this.value);
      this.change.emit(this.value);
      this.emitStateChange();
      
      // Announce selection
      if (this.announceChanges && !wasSelected) {
        this.announceSelectionChange();
      }
    }
  }

  getState(): RadioStateConfig {
    return {
      selected: this.selected,
      disabled: this.disabled,
      error: this.error,
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
    const input = this.elementRef.nativeElement.querySelector('.radio-input');
    if (input) {
      // Set up keyboard navigation indicator
      input.addEventListener('focus', () => {
        input.setAttribute('data-keyboard-navigation', 'true');
      });
      
      input.addEventListener('mousedown', () => {
        input.removeAttribute('data-keyboard-navigation');
      });
    }
  }
  
  private announceSelectionChange(): void {
    const announcement = `${this.label || this.value} selected`;
    this.accessibilityService.announce(announcement);
    this.accessibilityEvent.emit(announcement);
  }
  
  private announceFocusInfo(): void {
    const parts: string[] = [];
    
    // Radio name and state
    if (this.label) {
      parts.push(this.label);
    }
    parts.push('radio button');
    
    // Current state
    parts.push(this.selected ? 'selected' : 'not selected');
    
    // Group information
    if (this.name) {
      // Get all radios in the same group
      const groupRadios = document.querySelectorAll(`input[name="${this.name}"]`);
      if (groupRadios.length > 1) {
        const currentIndex = Array.from(groupRadios).indexOf(
          this.elementRef.nativeElement.querySelector('.radio-input')
        ) + 1;
        parts.push(`${currentIndex} of ${groupRadios.length}`);
      }
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
  
  private handleArrowNavigation(event: KeyboardEvent): void {
    if (!this.name) return;
    
    event.preventDefault();
    
    // Get all radio buttons in the same group
    const groupRadios = Array.from(
      document.querySelectorAll(`input[name="${this.name}"]`)
    ) as HTMLInputElement[];
    
    const currentIndex = groupRadios.findIndex(radio => 
      radio === this.elementRef.nativeElement.querySelector('.radio-input')
    );
    
    let nextIndex = currentIndex;
    
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % groupRadios.length;
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      nextIndex = currentIndex === 0 ? groupRadios.length - 1 : currentIndex - 1;
    }
    
    if (nextIndex !== currentIndex) {
      // Focus and select the next radio
      groupRadios[nextIndex].focus();
      groupRadios[nextIndex].click();
    }
  }
  
  private handleKeyboardShortcuts(event: KeyboardEvent): void {
    // Home/End keys for first/last radio in group
    if (this.name && (event.key === 'Home' || event.key === 'End')) {
      event.preventDefault();
      
      const groupRadios = Array.from(
        document.querySelectorAll(`input[name="${this.name}"]`)
      ) as HTMLInputElement[];
      
      const targetIndex = event.key === 'Home' ? 0 : groupRadios.length - 1;
      groupRadios[targetIndex].focus();
      groupRadios[targetIndex].click();
    }
  }
}