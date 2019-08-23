import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CardCreatorPage } from './card-creator';

@NgModule({
  declarations: [
    CardCreatorPage,
  ],
  imports: [
    IonicPageModule.forChild(CardCreatorPage),
  ],
})
export class CardCreatorPageModule {}
