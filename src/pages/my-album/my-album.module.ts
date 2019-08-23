import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyAlbumPage } from './my-album';

@NgModule({
  declarations: [
    MyAlbumPage,
  ],
  imports: [
    IonicPageModule.forChild(MyAlbumPage),
  ],
})
export class MyAlbumPageModule {}
