import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyplaylistPage } from './myplaylist';

@NgModule({
  declarations: [
    MyplaylistPage,
  ],
  imports: [
    IonicPageModule.forChild(MyplaylistPage),
  ],
})
export class MyplaylistPageModule {}
