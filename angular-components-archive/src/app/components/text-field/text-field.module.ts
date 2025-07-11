import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextFieldComponent } from './text-field.component';

@NgModule({
  imports: [
    CommonModule,
    TextFieldComponent
  ],
  exports: [
    TextFieldComponent
  ]
})
export class TextFieldModule { }