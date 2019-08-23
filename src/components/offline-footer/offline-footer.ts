import { Component, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { MusicappServiceProvider } from '../../providers/musicapp-service/musicapp-service';
import { HelperProvider } from '../../providers/helper/helper';

/**
 * Generated class for the OfflineFooterComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'offline-footer',
  templateUrl: 'offline-footer.html'
})
export class OfflineFooterComponent implements OnInit {

  currentProgress: number = 0;
  progress:number = 0;
  songplaying = false;
  constructor(public platform: Platform, public player: MusicappServiceProvider, private helper: HelperProvider) {
  }

  ngOnInit(){
    this.helper.getTheSong().subscribe(res =>{
      this.songplaying = res;
      if(res)
        this.getCurrentProgressNumber();
    })

  }

  flag;
  getCurrentProgressNumber(){
    this.flag = setInterval( ()=> {
     this.player.getCurrentProgressNumber().then(res =>{
       this.currentProgress = res;
       this.changeProgress();
     })
   }, 1000);

   setTimeout( () => {
     clearInterval(this.flag);
   }, Math.round(this.player.getDuration() + 5) * 1000) 
 }

 changeProgress(){
  let x =  Math.floor((this.currentProgress/this.player.getDuration())*100);
  this.progress = x;
 }


}
