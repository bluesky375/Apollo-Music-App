import { Component, Inject, forwardRef, OnInit } from '@angular/core';
import { IonicPage, NavParams, ModalController } from 'ionic-angular';

import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';
import { ModalService } from '../../services/ModalService';
import { VideoService } from '../../services/VideoService';
import { AudioService } from '../../services/AudioService';

import { PurchasesPage } from '../purchases/purchases';

import { Album } from '../../data/Album';
import { Song } from '../../data/Song';
import { Purchase } from '../../data/Purchase';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { SongsInitializer } from '../../data/Initializers/SongsInitializer';
import {map } from 'rxjs/operators';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-album',
  templateUrl: 'album.html'
})
export class AlbumPage implements OnInit {
  album;
  albumSongs;
  songs;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    public modalService: ModalService,
    private videoService: VideoService,
    private audioService: AudioService,
    @Inject(forwardRef(() => MusicPlayerPageService))
    public musicPlayerPageService: MusicPlayerPageService,
    private api: ApiProvider
  ) {
    this.album = this.navParams.get('album');
  }

  ngOnInit(){
    this.api.getAllSongs()
      .pipe(map(actions => actions.map(a =>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
        .subscribe(res =>{
          this.songs = res;
            if(this.songs.length>0){
              console.log(this.album)
              this.albumSongs = this.songs.filter(data => this.album.songs.indexOf(data.did) > -1 );
              console.log(this.albumSongs)
            }
        })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlbumPage');

    this.albumSongs = Shuffler.shuffle(SongsInitializer.songs.slice()).splice(
      0,
      this.album.songsCount
    );

    for (var i = 1; i <= this.albumSongs.length; i++) {
      this.albumSongs[i - 1].rank = i;
      this.albumSongs[i - 1].price = (
        Number(this.album.price) / this.album.songsCount
      ).toFixed(2);
    }
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter AlbumPage');

    if (this.videoService.currentVideo) {
      this.videoService.showMiniPlayer();
    }

    if (this.audioService.playingTrack()) {
      this.musicPlayerPageService.showFooterPlayer();
    }
  }

  buyAlbum() {
    var purchase = new Purchase(
      this.album.name,
      this.album.pictureUrl,
      this.album.artistName,
      this.album.price
    );

    const modal = this.modalCtrl.create(PurchasesPage, { purchase: purchase });
    modal.present();
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
