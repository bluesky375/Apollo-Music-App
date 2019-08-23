import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CardsManagerPage } from './cards-manager';

@NgModule({
  declarations: [
    CardsManagerPage,
  ],
  imports: [
    IonicPageModule.forChild(CardsManagerPage),
  ],
})
export class CardsManagerPageModule {}
