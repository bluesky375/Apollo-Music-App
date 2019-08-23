import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SeeAllPage } from './see-all';

@NgModule({
  declarations: [
    SeeAllPage,
  ],
  imports: [
    IonicPageModule.forChild(SeeAllPage),
  ],
})
export class SeeAllPageModule {}
