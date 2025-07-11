import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CheckboxGroupState {
  [key: string]: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CheckboxStateService {
  private checkboxGroups = new Map<string, BehaviorSubject<CheckboxGroupState>>();

  getCheckboxGroup(groupId: string): Observable<CheckboxGroupState> {
    if (!this.checkboxGroups.has(groupId)) {
      this.checkboxGroups.set(groupId, new BehaviorSubject<CheckboxGroupState>({}));
    }
    return this.checkboxGroups.get(groupId)!.asObservable();
  }

  updateCheckboxState(groupId: string, checkboxId: string, checked: boolean): void {
    if (!this.checkboxGroups.has(groupId)) {
      this.checkboxGroups.set(groupId, new BehaviorSubject<CheckboxGroupState>({}));
    }
    
    const currentState = this.checkboxGroups.get(groupId)!.value;
    const newState = { ...currentState, [checkboxId]: checked };
    this.checkboxGroups.get(groupId)!.next(newState);
  }

  getCheckboxState(groupId: string, checkboxId: string): boolean {
    if (!this.checkboxGroups.has(groupId)) {
      return false;
    }
    
    const currentState = this.checkboxGroups.get(groupId)!.value;
    return currentState[checkboxId] || false;
  }

  selectAll(groupId: string, checkboxIds: string[]): void {
    if (!this.checkboxGroups.has(groupId)) {
      this.checkboxGroups.set(groupId, new BehaviorSubject<CheckboxGroupState>({}));
    }
    
    const newState: CheckboxGroupState = {};
    checkboxIds.forEach(id => {
      newState[id] = true;
    });
    
    this.checkboxGroups.get(groupId)!.next(newState);
  }

  deselectAll(groupId: string): void {
    if (!this.checkboxGroups.has(groupId)) {
      return;
    }
    
    this.checkboxGroups.get(groupId)!.next({});
  }

  getSelectedCount(groupId: string): number {
    if (!this.checkboxGroups.has(groupId)) {
      return 0;
    }
    
    const currentState = this.checkboxGroups.get(groupId)!.value;
    return Object.values(currentState).filter(Boolean).length;
  }

  isAllSelected(groupId: string, totalCount: number): boolean {
    return this.getSelectedCount(groupId) === totalCount;
  }

  isIndeterminate(groupId: string, totalCount: number): boolean {
    const selectedCount = this.getSelectedCount(groupId);
    return selectedCount > 0 && selectedCount < totalCount;
  }
}