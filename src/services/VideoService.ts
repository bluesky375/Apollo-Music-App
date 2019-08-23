import { Injectable } from '@angular/core';

import { Video } from '../data/Video';

import { Shuffler } from '../data/Helpers/Shuffler';
import { VideosInitializer } from '../data/Initializers/VideosInitializer';
import { ApiProvider } from '../providers/api/api';
import { map } from 'rxjs/operators';
import { ModalController } from 'ionic-angular';
import { StartPopupPage } from '../pages/start-popup/start-popup';

@Injectable()
export class VideoService {
  allVideos = [];

  currentVideo;
  currentVideoIndex: number;
  popups;

  constructor(private api: ApiProvider, private modal: ModalController) {
    this.api.getOnlyVideos()
      .pipe(map(actions => actions.map(a =>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
        .subscribe(res =>{
          this.allVideos = res;
        })
    
    this.api.getPopUp()
        .subscribe(res => {
            this.popups = res;
        })
    console.log('%c video service', 'background-color: black; color: white;')
    // this.allVideos = Shuffler.shuffle(VideosInitializer.videos.slice());
  }

  setCurrentVideo(video) {
    this.currentVideoIndex = this.allVideos.findIndex(otherVideo => {
      return otherVideo.title === video.title;
    });
    let x =  Date.now();
    localStorage.setItem('videoAd', x.toString() );
    this.checkVideoAd();
    this.currentVideo = this.allVideos[this.currentVideoIndex];
  }

  next() {
    this.currentVideoIndex =
      this.currentVideoIndex + 1 >= this.allVideos.length
        ? 0
        : this.currentVideoIndex + 1;
    this.currentVideo = this.allVideos[this.currentVideoIndex];
    this.checkVideoAd();
  }

  checkVideoAd(){
    if(localStorage.getItem('videoAd')){
      let x = parseInt(localStorage.getItem('videoAd'))
      if(Math.floor((Date.now() - x) / 1000) > 720){
        let number = Math.floor(Math.random() * this.popups.length);
        const modal = this.modal.create(StartPopupPage, {
          data: this.popups[number].imageURL
        });
        modal.present();
        modal.onDidDismiss( () =>{
          let x =  Date.now();
          localStorage.setItem('videoAd', x.toString() );
        })
      }
    }
  }

  previous() {
    this.currentVideoIndex =
      this.currentVideoIndex - 1 < 0
        ? this.allVideos.length - 1
        : this.currentVideoIndex - 1;

    this.currentVideo = this.allVideos[this.currentVideoIndex];
    this.checkVideoAd();
  }

  showMiniPlayer() {
    var miniPlayerElements = document.getElementsByClassName(
      'unique-mini-player'
    );

    for (var i = 0; i < miniPlayerElements.length; i++) {
      var miniPlayer = miniPlayerElements[i];

      if (miniPlayer) {
        miniPlayer.classList.add('alwaysblock');
        miniPlayer.classList.add('mini');
        miniPlayer.classList.add('mini-active');
      }
    }
  }

  hideMiniPlayer() {
    var miniPlayerElements = document.getElementsByClassName(
      'unique-mini-player'
    );

    for (var i = 0; i < miniPlayerElements.length; i++) {
      var miniPlayer = miniPlayerElements[i];

      if (miniPlayer) {
        miniPlayer.classList.remove('alwaysblock');
        miniPlayer.classList.remove('mini');
        miniPlayer.classList.remove('mini-active');
      }
    }

    this.currentVideo = null;
  }
}
