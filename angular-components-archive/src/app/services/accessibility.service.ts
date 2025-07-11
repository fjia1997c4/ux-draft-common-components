import { Injectable, ElementRef } from '@angular/core';

export interface AccessibilityConfig {
  announceChanges?: boolean;
  focusManagement?: boolean;
  keyboardNavigation?: boolean;
  screenReaderSupport?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private liveRegion: HTMLElement | null = null;
  private focusHistory: HTMLElement[] = [];

  constructor() {
    this.createLiveRegion();
  }

  // Create ARIA live region for announcements
  private createLiveRegion(): void {
    if (typeof document === 'undefined') return;
    
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'visually-hidden';
    this.liveRegion.id = 'accessibility-live-region';
    
    document.body.appendChild(this.liveRegion);
  }

  // Announce message to screen readers
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.liveRegion) return;
    
    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      if (this.liveRegion) {
        this.liveRegion.textContent = '';
      }
    }, 1000);
  }

  // Focus management
  setFocus(element: HTMLElement | ElementRef, options?: FocusOptions): void {
    const targetElement = element instanceof ElementRef ? element.nativeElement : element;
    
    if (targetElement && typeof targetElement.focus === 'function') {
      // Store previous focus for restoration
      if (document.activeElement instanceof HTMLElement) {
        this.focusHistory.push(document.activeElement);
      }
      
      targetElement.focus(options);
    }
  }

  // Restore previous focus
  restoreFocus(): void {
    const previousElement = this.focusHistory.pop();
    if (previousElement && typeof previousElement.focus === 'function') {
      previousElement.focus();
    }
  }

  // Trap focus within container
  trapFocus(container: HTMLElement): () => void {
    const focusableElements = this.getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }

  // Get all focusable elements within container
  getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }

  // Generate unique ID for accessibility
  generateId(prefix: string = 'a11y'): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Check if element is visible to screen readers
  isVisibleToScreenReader(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    
    return !(
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      style.opacity === '0' ||
      element.hasAttribute('aria-hidden') ||
      element.getAttribute('aria-hidden') === 'true'
    );
  }

  // Create accessible description
  createDescription(text: string, id?: string): HTMLElement {
    const description = document.createElement('div');
    description.id = id || this.generateId('desc');
    description.className = 'visually-hidden';
    description.textContent = text;
    
    return description;
  }

  // Keyboard navigation helpers
  handleArrowNavigation(
    event: KeyboardEvent, 
    elements: HTMLElement[], 
    currentIndex: number,
    orientation: 'horizontal' | 'vertical' = 'vertical'
  ): number {
    let newIndex = currentIndex;
    
    const isHorizontal = orientation === 'horizontal';
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    
    switch (event.key) {
      case nextKey:
        event.preventDefault();
        newIndex = (currentIndex + 1) % elements.length;
        break;
      case prevKey:
        event.preventDefault();
        newIndex = currentIndex === 0 ? elements.length - 1 : currentIndex - 1;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = elements.length - 1;
        break;
    }
    
    if (newIndex !== currentIndex) {
      elements[newIndex].focus();
    }
    
    return newIndex;
  }

  // Announce form validation errors
  announceValidationError(fieldName: string, errorMessage: string): void {
    this.announce(`${fieldName}: ${errorMessage}`, 'assertive');
  }

  // Announce form submission status
  announceFormStatus(status: 'success' | 'error', message: string): void {
    const priority = status === 'error' ? 'assertive' : 'polite';
    this.announce(message, priority);
  }

  // Check if user prefers reduced motion
  prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Check if user prefers high contrast
  prefersHighContrast(): boolean {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }

  // Cleanup
  destroy(): void {
    if (this.liveRegion && this.liveRegion.parentNode) {
      this.liveRegion.parentNode.removeChild(this.liveRegion);
    }
    this.focusHistory = [];
  }
}