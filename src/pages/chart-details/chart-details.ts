import { Component, Inject, forwardRef } from '@angular/core';
import { IonicPage, NavParams, ModalController } from 'ionic-angular';

import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';
import { ModalService } from '../../services/ModalService';
import { VideoService } from '../../services/VideoService';
import { AudioService } from '../../services/AudioService';

import { PurchasesPage } from '../purchases/purchases';

import { Chart } from '../../data/Chart';
import { Song } from '../../data/Song';
import { Purchase } from '../../data/Purchase';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { SongsInitializer } from '../../data/Initializers/SongsInitializer';

@IonicPage()
@Component({
  selector: 'page-chart-details',
  templateUrl: 'chart-details.html'
})
export class ChartDetailsPage {
  chart: Chart;
  chartSongs: Song[] = [];

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    public modalService: ModalService,
    private videoService: VideoService,
    private audioService: AudioService,
    @Inject(forwardRef(() => MusicPlayerPageService)) public musicPlayerPageService: MusicPlayerPageService
  ) {
    this.chart = this.navParams.get('chart');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChartDetailsPage');

    this.chartSongs = Shuffler.shuffle(SongsInitializer.songs.slice());

    for (var i = 1; i <= this.chartSongs.length; i++) {
      this.chartSongs[i - 1].rank = i;
    }
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter ChartDetailsPage');

    if (this.videoService.currentVideo) {
      this.videoService.showMiniPlayer();
    }

    if (this.audioService.playingTrack()) {
      this.musicPlayerPageService.showFooterPlayer();
    }
  }

  buySong(song: Song) {
    var purchase = new Purchase(
      song.name,
      song.pictureUrl,
      song.artistName,
      song.price
    );

    const modal = this.modalCtrl.create(PurchasesPage, { purchase: purchase });
    modal.present();
  }
}
