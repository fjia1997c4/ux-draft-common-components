import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from './checkbox.component';
import { CheckboxStateService, CheckboxGroupState } from '../../services/checkbox-state.service';
import { Subject, takeUntil } from 'rxjs';

export interface CheckboxOption {
  id: string;
  label: string;
  value: any;
  disabled?: boolean;
  error?: boolean;
}

@Component({
  selector: 'app-checkbox-group',
  standalone: true,
  imports: [CommonModule, CheckboxComponent],
  template: `
    <div class="checkbox-group" [attr.role]="'group'" [attr.aria-labelledby]="groupId + '-label'">
      <div *ngIf="label" class="checkbox-group-label" [id]="groupId + '-label'">
        {{ label }}
      </div>
      
      <div *ngIf="showSelectAll" class="checkbox-group-select-all">
        <app-checkbox
          [id]="groupId + '-select-all'"
          [label]="selectAllLabel"
          [checked]="isAllSelected"
          [indeterminate]="isIndeterminate"
          [disabled]="disabled"
          (change)="onSelectAllChange($event)"
        />
      </div>
      
      <div class="checkbox-group-options">
        <app-checkbox
          *ngFor="let option of options; trackBy: trackByOptionId"
          [id]="option.id"
          [label]="option.label"
          [checked]="getOptionChecked(option.id)"
          [disabled]="disabled || (option.disabled ?? false)"
          [error]="option.error ?? false"
          [name]="groupId"
          (change)="onOptionChange(option, $event)"
        />
      </div>
      
      <div *ngIf="errorMessage" class="checkbox-group-error">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styleUrls: ['./checkbox-group.component.css']
})
export class CheckboxGroupComponent implements OnInit, OnDestroy {
  @Input() groupId: string = `checkbox-group-${Math.random().toString(36).substr(2, 9)}`;
  @Input() label: string = '';
  @Input() options: CheckboxOption[] = [];
  @Input() disabled: boolean = false;
  @Input() showSelectAll: boolean = false;
  @Input() selectAllLabel: string = 'Select All';
  @Input() errorMessage: string = '';
  @Input() required: boolean = false;
  @Input() minSelection: number = 0;
  @Input() maxSelection: number = Infinity;

  @Output() selectionChange = new EventEmitter<CheckboxOption[]>();
  @Output() validationChange = new EventEmitter<boolean>();

  private destroy$ = new Subject<void>();
  
  isAllSelected: boolean = false;
  isIndeterminate: boolean = false;
  selectedOptions: CheckboxOption[] = [];

  constructor(private checkboxStateService: CheckboxStateService) {}

  ngOnInit(): void {
    this.checkboxStateService.getCheckboxGroup(this.groupId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.updateGroupState(state);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByOptionId(index: number, option: CheckboxOption): string {
    return option.id;
  }

  getOptionChecked(optionId: string): boolean {
    return this.checkboxStateService.getCheckboxState(this.groupId, optionId);
  }

  onOptionChange(option: CheckboxOption, checked: boolean): void {
    this.checkboxStateService.updateCheckboxState(this.groupId, option.id, checked);
    this.validateSelection();
  }

  onSelectAllChange(checked: boolean): void {
    if (checked) {
      const enabledOptions = this.options.filter(opt => !opt.disabled);
      this.checkboxStateService.selectAll(this.groupId, enabledOptions.map(opt => opt.id));
    } else {
      this.checkboxStateService.deselectAll(this.groupId);
    }
    this.validateSelection();
  }

  private updateGroupState(state: CheckboxGroupState): void {
    this.selectedOptions = this.options.filter(opt => state[opt.id]);
    
    const enabledOptions = this.options.filter(opt => !opt.disabled);
    const selectedEnabledCount = enabledOptions.filter(opt => state[opt.id]).length;
    
    this.isAllSelected = selectedEnabledCount === enabledOptions.length && enabledOptions.length > 0;
    this.isIndeterminate = selectedEnabledCount > 0 && selectedEnabledCount < enabledOptions.length;
    
    this.selectionChange.emit(this.selectedOptions);
  }

  private validateSelection(): void {
    const selectedCount = this.selectedOptions.length;
    const isValid = (!this.required || selectedCount > 0) && 
                   selectedCount >= this.minSelection && 
                   selectedCount <= this.maxSelection;
    
    this.validationChange.emit(isValid);
  }

  getSelectedValues(): any[] {
    return this.selectedOptions.map(opt => opt.value);
  }

  getSelectedCount(): number {
    return this.selectedOptions.length;
  }

  reset(): void {
    this.checkboxStateService.deselectAll(this.groupId);
  }
}