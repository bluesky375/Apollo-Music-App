import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyMusicPlayerPage } from './my-music-player';

@NgModule({
  declarations: [
    MyMusicPlayerPage,
  ],
  imports: [
    IonicPageModule.forChild(MyMusicPlayerPage),
  ],
})
export class MyMusicPlayerPageModule {}
