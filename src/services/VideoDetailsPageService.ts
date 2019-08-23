import { Injectable, Inject, forwardRef } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { VideoService } from './VideoService';
import { MusicPlayerPageService } from './MusicPlayerPageService';

import { VideoDetailsPage } from '../pages/video-details/video-details';

import { AudioService } from './AudioService';

@Injectable()
export class VideoDetailsPageService {
  constructor(
    private modalCtrl: ModalController,
    private videoService: VideoService,
    @Inject(forwardRef(() => MusicPlayerPageService))
    public musicPlayerPageService: MusicPlayerPageService,
    private audioService: AudioService
  ) {}

  openVideo(video) {
    this.videoService.hideMiniPlayer();

    this.musicPlayerPageService.hideFooterPlayer();
    this.audioService.stop();

    console.log(video);
    const modal = this.modalCtrl.create(VideoDetailsPage, { video: video });

    modal.onDidDismiss(() => {
      this.videoService.showMiniPlayer();
    });

    modal.present();
  }
}
