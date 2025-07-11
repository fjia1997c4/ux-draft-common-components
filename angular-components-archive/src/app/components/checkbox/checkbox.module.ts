import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from './checkbox.component';

@NgModule({
  imports: [
    CommonModule,
    CheckboxComponent
  ],
  exports: [
    CheckboxComponent
  ]
})
export class CheckboxModule { }