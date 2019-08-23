import { Component } from '@angular/core';
import { ModalController, MenuController } from 'ionic-angular';

import { VideoService } from '../../services/VideoService';
import { SearchPage } from '../search/search';
import { StartPopupPage } from '../start-popup/start-popup';
import { ApiProvider } from '../../providers/api/api';
import { HelperProvider } from '../../providers/helper/helper';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  type;
  popup;
  user; 

  constructor(
    private videoService: VideoService,
    private modalCtrl: ModalController,
    private api: ApiProvider, private menu: MenuController,
    private helper: HelperProvider
  ) {
    this.type = localStorage.getItem('type');
    this.api.getPopUp()
    .subscribe(ress =>{
      this.popup = ress;
      if(this.popup.status === 'active'){
         const modal = this.modalCtrl.create(StartPopupPage, {
          data: this.popup.imageURL
        });
        modal.present();
      }
       
    });
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter HomePage');

    if (this.videoService.currentVideo) {
      this.videoService.showMiniPlayer();
    }

    this.api.getUserById(localStorage.getItem('uid'))
      .subscribe(res =>{
        this.user = res;
        this.helper.setAccountType(this.user.premium.type);
        let date = new Date(this.user.premium.date.toDate());
        let today = Date.now();
        if(this.user.premium.type === 'premium')
          if(date.getTime() +2628000000 < today){
          localStorage.setItem('accountType','free');
          this.helper.setAccountType('free');
          this.user.premium.type = 'free';
          this.user.premium.payed = false;
          this.api.updateUser(localStorage.getItem('uid'), this.user);
        }
        
      })

    this.menu.enable(true);

 
  }

  openSearch() {
    const modal = this.modalCtrl.create(SearchPage);
    modal.present();
  }
}
