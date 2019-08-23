import { Component } from '@angular/core';
import { IonicPage, NavParams, ModalController } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { DomSanitizer } from '@angular/platform-browser';

import { ModalService } from '../../services/ModalService';
import { VideoService } from '../../services/VideoService';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';
import { OptionsPage } from '../options/options';

@IonicPage()
@Component({
  selector: 'page-video-details',
  templateUrl: 'video-details.html'
})
export class VideoDetailsPage {
  relatedVideos = [];
  showHeader: boolean = true;
  likedsongs;
  constructor(
    private navParams: NavParams,
    public modalService: ModalService,
    public videoService: VideoService,
    private screenOrientation: ScreenOrientation,
    public sanitizer: DomSanitizer,
    private api: ApiProvider, private modalCtrl: ModalController
  ) {
    var video = this.navParams.get('video');
    this.videoService.setCurrentVideo(video);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoDetailsPage');

    this.setRelatedVideos();
    this.setHeaderVisibility();
    
    this.api.getLikedSongs(localStorage.getItem('uid'))
    .pipe(map(actions => actions.map(a =>{
      const data = a.payload.doc.data();
      const did = a.payload.doc.id;
      return {did, ...data};
    })))
      .subscribe(res =>{
        this.likedsongs = res;
        this.checkCurrentSongLike();
      });
  }

  exist= false;
  isLiked = false;

  checkCurrentSongLike(){
    if(this.likedsongs.length > 0 ){
       let x: Array<string> = this.likedsongs[0].songs;
      let check: Array<string> = x.filter(data => data === this.videoService.currentVideo.did);
      if(check.length > 0){
        this.isLiked = true;
      }
      else{
        this.isLiked = false;
      }
      this.exist = true;
    }
    else{
      this.exist = false;
    }
   
  }

  likeSong(val){
    if(val === 'like'){
      if(this.exist){
        let x: Array<string> = this.likedsongs[0].songs;
        x.push(this.videoService.currentVideo.did);
        let data = {
          uid: localStorage.getItem('uid'),
          songs: x
        };
        this.api.updateLikedSongs(this.likedsongs[0].did, data);
      }
      else if(!this.exist){
        let x = [];
        x.push(this.videoService.currentVideo.did);
        let data = {
          uid: localStorage.getItem('uid'),
          songs: x
        };
        this.api.addLikedsong(data);
      }
    }
    else if(val === 'dislike'){
      let x: Array<string> = this.likedsongs[0].songs;
      x.splice(x.indexOf(this.videoService.currentVideo.did), 1);
      let data = {
        uid: localStorage.getItem('uid'),
        songs: x
      };
      this.api.updateLikedSongs(this.likedsongs[0].did, data).then(res =>{
        this.isLiked = false;
      }, err =>{
        console.log(err);
      })
    }
  }

  setHeaderVisibility() {
    // detect orientation changes
    this.screenOrientation.onChange().subscribe(() => {
      if (
        this.screenOrientation.type ===
        this.screenOrientation.ORIENTATIONS.LANDSCAPE
      ) {
        this.showHeader = false;
      } else {
        this.showHeader = true;
      }
    });
  }

  changeVideo(video) {
    console.log('coming');
    this.videoService.setCurrentVideo(video);
    this.setRelatedVideos();
  }

  nextVideo() {
    this.videoService.next();
    this.setRelatedVideos();
  }

  previousVideo() {
    this.videoService.previous();
    this.setRelatedVideos();
  }

  setRelatedVideos() {
    var tempVideos = this.videoService.allVideos.slice();
    tempVideos.splice(this.videoService.currentVideoIndex, 1);
    this.relatedVideos = Shuffler.shuffle(tempVideos.slice());
  }

  options(){
    localStorage.setItem('songId', this.videoService.currentVideo.did);
    const modal = this.modalCtrl.create(OptionsPage,{
      artist: this.videoService.currentVideo.oartist,
      title: this.videoService.currentVideo.title,
      image: this.videoService.currentVideo.imageURL
    });
    modal.present();
  }


}
