import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChartDetailsPage } from './chart-details';

@NgModule({
  declarations: [
    ChartDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChartDetailsPage),
  ],
})
export class ChartDetailsPageModule {}
