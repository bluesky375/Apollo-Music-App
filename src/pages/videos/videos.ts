import { Component, Inject, forwardRef } from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';

import { VideoService } from '../../services/VideoService';
import { AudioService } from '../../services/AudioService';
import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';

import { SearchPage } from '../search/search';

@IonicPage()
@Component({
  selector: 'page-videos',
  templateUrl: 'videos.html'
})
export class VideosPage {
  constructor(
    private videoService: VideoService,
    private audioService: AudioService,
    @Inject(forwardRef(() => MusicPlayerPageService))
    public musicPlayerPageService: MusicPlayerPageService,
    private modalCtrl: ModalController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideosPage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter VideosPage');

    if (this.videoService.currentVideo) {
      this.videoService.showMiniPlayer();
    }

    if (this.audioService.playingTrack()) {
      this.musicPlayerPageService.showFooterPlayer();
    }
  }

  openSearch() {
    const modal = this.modalCtrl.create(SearchPage);
    modal.present();
  }
}
