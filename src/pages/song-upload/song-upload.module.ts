import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SongUploadPage } from './song-upload';

@NgModule({
  declarations: [
    SongUploadPage,
  ],
  imports: [
    IonicPageModule.forChild(SongUploadPage),
  ],
})
export class SongUploadPageModule {}
