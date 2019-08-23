import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CardSelectionPage } from './card-selection';

@NgModule({
  declarations: [
    CardSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(CardSelectionPage),
  ],
})
export class CardSelectionPageModule {}
