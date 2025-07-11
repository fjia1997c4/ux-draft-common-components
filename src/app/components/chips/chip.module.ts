import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipComponent } from './chip.component';
import { ChipGroupComponent } from './chip-group.component';

@NgModule({
  imports: [
    CommonModule,
    ChipComponent,
    ChipGroupComponent
  ],
  exports: [
    ChipComponent,
    ChipGroupComponent
  ]
})
export class ChipModule { }