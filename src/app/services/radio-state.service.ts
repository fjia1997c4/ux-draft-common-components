import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface RadioGroupState {
  selectedValue: any;
}

@Injectable({
  providedIn: 'root'
})
export class RadioStateService {
  private radioGroups = new Map<string, BehaviorSubject<RadioGroupState>>();

  getRadioGroup(groupId: string): Observable<RadioGroupState> {
    if (!this.radioGroups.has(groupId)) {
      this.radioGroups.set(groupId, new BehaviorSubject<RadioGroupState>({ selectedValue: null }));
    }
    return this.radioGroups.get(groupId)!.asObservable();
  }

  updateRadioState(groupId: string, selectedValue: any): void {
    if (!this.radioGroups.has(groupId)) {
      this.radioGroups.set(groupId, new BehaviorSubject<RadioGroupState>({ selectedValue: null }));
    }
    
    const newState: RadioGroupState = { selectedValue };
    this.radioGroups.get(groupId)!.next(newState);
  }

  getSelectedValue(groupId: string): any {
    if (!this.radioGroups.has(groupId)) {
      return null;
    }
    
    const currentState = this.radioGroups.get(groupId)!.value;
    return currentState.selectedValue;
  }

  clearSelection(groupId: string): void {
    if (!this.radioGroups.has(groupId)) {
      return;
    }
    
    this.radioGroups.get(groupId)!.next({ selectedValue: null });
  }

  isSelected(groupId: string, value: any): boolean {
    const selectedValue = this.getSelectedValue(groupId);
    return selectedValue === value;
  }

  // New method to initialize a radio group with a default value
  initializeGroup(groupId: string, initialValue: any = null): void {
    if (!this.radioGroups.has(groupId)) {
      this.radioGroups.set(groupId, new BehaviorSubject<RadioGroupState>({ selectedValue: initialValue }));
    }
  }

  // New method to check if a group exists
  hasGroup(groupId: string): boolean {
    return this.radioGroups.has(groupId);
  }

  // New method to get all group IDs
  getAllGroupIds(): string[] {
    return Array.from(this.radioGroups.keys());
  }
}