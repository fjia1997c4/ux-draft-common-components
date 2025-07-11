import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioComponent } from './radio.component';
import { RadioGroupComponent } from './radio-group.component';

@NgModule({
  imports: [
    CommonModule,
    RadioComponent,
    RadioGroupComponent
  ],
  exports: [
    RadioComponent,
    RadioGroupComponent
  ]
})
export class RadioModule { }