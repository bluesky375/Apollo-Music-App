import { Component, Inject, forwardRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';
import { ModalService } from '../../services/ModalService';
import { VideoService } from '../../services/VideoService';
import { AudioService } from '../../services/AudioService';

import { Playlist } from '../../data/Playlist';
import { Song } from '../../data/Song';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { SongsInitializer } from '../../data/Initializers/SongsInitializer';

@IonicPage()
@Component({
  selector: 'page-playlist',
  templateUrl: 'playlist.html'
})
export class PlaylistPage {
  playlist: Playlist;
  playlistSongs: Song[] = [];

  constructor(
    private navCtrl: NavController,
    public modalService: ModalService,
    private videoService: VideoService,
    private audioService: AudioService,
    private navParams: NavParams,
    @Inject(forwardRef(() => MusicPlayerPageService))
    public musicPlayerPageService: MusicPlayerPageService
  ) {
    this.playlist = this.navParams.get('playlist');
    this.playlistSongs = Shuffler.shuffle(SongsInitializer.songs.slice());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlaylistPage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter PlaylistPage');

    if (this.videoService.currentVideo) {
      this.videoService.showMiniPlayer();
    }

    if (this.audioService.playingTrack()) {
      this.musicPlayerPageService.showFooterPlayer();
    }
  }

  dismiss() {
    this.navCtrl.pop();
  }
}
