import { Component, Input, Output, EventEmitter, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessibilityService } from '../../services/accessibility.service';
import { 
  ChipSize, 
  ChipColor, 
  ChipVariant, 
  ChipStateConfig 
} from './chip.types';
import { 
  getChipColors, 
  generateChipCSSCustomProperties,
  CHIP_SPACING,
  CHIP_TYPOGRAPHY 
} from './chip.styles';

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="chip-container"
      [class.small]="size === 'small'"
      [class.medium]="size === 'medium'"
      [class.large]="size === 'large'"
      [class.dismissible]="dismissible"
      [class.has-icon]="hasIcon && size !== 'small'"
      [class.disabled]="disabled"
      [class.selected]="selected"
      [class.outlined]="variant === 'outlined'"
      [style]="containerStyles"
      [attr.role]="'button'"
      [attr.tabindex]="disabled ? '-1' : '0'"
      [attr.aria-label]="ariaLabel || label"
      [attr.aria-disabled]="disabled"
      (click)="onClick()"
      (keydown)="onKeyDown($event)"
    >
      <!-- Icon (only for medium and large) -->
      <svg 
        *ngIf="hasIcon && size !== 'small' && icon" 
        class="chip-icon"
        viewBox="0 0 16 16" 
        fill="currentColor"
        [style.color]="currentColors.icon"
      >
        <ng-container [ngSwitch]="icon">
          <path *ngSwitchCase="'star'" d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
          <path *ngSwitchCase="'heart'" d="M8 14.25l-.345-.666c-.03-.06-.047-.123-.047-.188 0-.137.111-.25.25-.25s.25.113.25.25c0 .065-.017.128-.047.188L8 14.25zm4.318-9.518c-.5-1.5-2.318-2.5-4.318-.5-2-.5-3.818.5-4.318 2-.5 1.5.5 3.5 4.318 6.5 3.818-3 4.818-5 4.318-6.5z"/>
          <path *ngSwitchCase="'user'" d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
          <path *ngSwitchCase="'tag'" d="M2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
          <path *ngSwitchDefault d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
        </ng-container>
      </svg>

      <!-- Label -->
      <span class="chip-label">{{ label }}</span>

      <!-- Close/Dismiss button (only for medium and large dismissible chips) -->
      <button
        *ngIf="dismissible && size !== 'small'"
        type="button"
        class="chip-close-button"
        [attr.aria-label]="'Remove ' + label"
        [style.color]="currentColors.closeIcon"
        (click)="onDismiss($event)"
        (keydown)="onCloseKeyDown($event)"
      >
        <svg viewBox="0 0 16 16" fill="currentColor">
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
        </svg>
      </button>
    </div>
  `,
  styleUrls: ['./chip.component.css']
})
export class ChipComponent implements OnInit {
  @Input() id: string = `chip-${Math.random().toString(36).substr(2, 9)}`;
  @Input() label: string = '';
  @Input() value: any = '';
  @Input() size: ChipSize = 'medium';
  @Input() color: ChipColor = 'default';
  @Input() variant: ChipVariant = 'filled';
  @Input() dismissible: boolean = false;
  @Input() hasIcon: boolean = false;
  @Input() icon: string = '';
  @Input() disabled: boolean = false;
  @Input() selected: boolean = false;
  @Input() ariaLabel: string = '';
  @Input() maxWords: number = 2; // Small chips max 2 words

  @Output() click = new EventEmitter<any>();
  @Output() dismiss = new EventEmitter<any>();
  @Output() stateChange = new EventEmitter<ChipStateConfig>();

  // Computed properties
  get currentColors() {
    return getChipColors(this.color, this.variant);
  }

  get containerStyles() {
    const customProps = generateChipCSSCustomProperties(this.currentColors);
    const spacing = CHIP_SPACING[this.size];
    
    return {
      ...customProps,
      '--chip-font-family': CHIP_TYPOGRAPHY.fontFamily,
      '--chip-font-size': spacing.fontSize,
      '--chip-font-weight': spacing.fontWeight,
      '--chip-line-height': spacing.lineHeight,
      '--chip-vertical-padding': spacing.verticalPadding,
      '--chip-horizontal-padding': spacing.horizontalPadding,
      '--chip-icon-text-spacing': spacing.iconTextSpacing,
      '--chip-max-width': spacing.maxWidth,
      '--chip-border-radius': CHIP_TYPOGRAPHY.borderRadius,
      '--chip-border-width': CHIP_TYPOGRAPHY.borderWidth
    };
  }

  constructor(
    private elementRef: ElementRef,
    private accessibilityService: AccessibilityService
  ) {}

  ngOnInit() {
    this.validateConfiguration();
    this.emitStateChange();
  }

  onClick(): void {
    if (!this.disabled) {
      this.click.emit(this.value || this.label);
      this.emitStateChange();
    }
  }

  onDismiss(event: Event): void {
    event.stopPropagation();
    if (!this.disabled) {
      this.dismiss.emit(this.value || this.label);
      this.accessibilityService.announce(`${this.label} removed`);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onClick();
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      if (this.dismissible && this.size !== 'small') {
        event.preventDefault();
        this.onDismiss(event);
      }
    }
  }

  onCloseKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onDismiss(event);
    }
  }

  getState(): ChipStateConfig {
    return {
      size: this.size,
      color: this.color,
      variant: this.variant,
      dismissible: this.dismissible,
      hasIcon: this.hasIcon,
      disabled: this.disabled,
      selected: this.selected
    };
  }

  private emitStateChange(): void {
    this.stateChange.emit(this.getState());
  }

  private validateConfiguration(): void {
    // Validate small chip constraints
    if (this.size === 'small') {
      if (this.hasIcon) {
        console.warn('Small chips cannot have icons');
        this.hasIcon = false;
      }
      if (this.dismissible) {
        console.warn('Small chips cannot be dismissible');
        this.dismissible = false;
      }
      
      // Check word count for small chips
      const wordCount = this.label.trim().split(/\s+/).length;
      if (wordCount > this.maxWords) {
        console.warn(`Small chips should have maximum ${this.maxWords} words`);
      }
    }

    // Validate large chip constraints
    if (this.size === 'large') {
      if (this.hasIcon && this.dismissible) {
        console.warn('Large chips cannot have both icon and dismiss button');
        // Prioritize dismiss functionality
        this.hasIcon = false;
      }
    }
  }

  // Public API methods
  focus(): void {
    this.elementRef.nativeElement.querySelector('.chip-container')?.focus();
  }

  blur(): void {
    this.elementRef.nativeElement.querySelector('.chip-container')?.blur();
  }
}