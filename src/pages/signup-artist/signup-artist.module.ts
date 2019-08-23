import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignupArtistPage } from './signup-artist';

@NgModule({
  declarations: [
    SignupArtistPage,
  ],
  imports: [
    IonicPageModule.forChild(SignupArtistPage),
  ],
})
export class SignupArtistPageModule {}
