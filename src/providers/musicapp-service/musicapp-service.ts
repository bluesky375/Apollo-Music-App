import { Media, MediaObject } from '@ionic-native/media';
import { Injectable, forwardRef, Inject } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { MyMusicPlayerPage } from '../../pages/my-music-player/my-music-player';
import { HelperProvider } from '../helper/helper';

/*
  Generated class for the MusicappServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MusicappServiceProvider {

  file: MediaObject;
  allsongs;
  trackIndex: number;
  public currentProgress;
  public songPlaying = false;
  public exist = false;

  constructor(private media: Media, public modal: ModalController, private helper: HelperProvider) {
    console.log('Hello MusicappServiceProvider Provider');
  }

  create(song, trackIndex){
    this.allsongs = song;
    this.trackIndex = trackIndex;
    this.file= this.media.create(this.allsongs[this.trackIndex].songURL);
    this.file.play();
    this.exist = true;
  }

  createsong(){
    this.file= this.media.create(this.allsongs[this.trackIndex].songURL);
    this.file.play();
    this.exist = true;
    this.file.onStatusUpdate.subscribe ( res => {
     if(res === this.media.MEDIA_PAUSED){
        this.songPlaying = false;
        this.helper.setTheSong(false);
      }
      else if (res === this.media.MEDIA_RUNNING){
        this.songPlaying = true;
        this.helper.setTheSong(true);
      }
    })
  }

  pause(){
    this.file.pause();
    this.songPlaying = false;
  }
  
  play(){
    this.file.play();
    this.songPlaying = true;
  }

  durationText() {
    if(!this.file.getDuration()){
      return '00:00';
    }
    var minutes = Math.floor(this.file.getDuration() / 60);
    var seconds = this.file.getDuration() - minutes * 60;

    var duration =
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds.toFixed(0) : seconds.toFixed(0));


    return duration;
  }

  getCurrentProgressNumber(){
    return this.file.getCurrentPosition();

  }

  getDuration(){
    return this.file.getDuration();
  }

    progressText(current) {
      if(!current)
      return '00:00';
    var minutes = Math.floor( current / 60);
    var seconds = current- minutes * 60;

    var progress =
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds.toFixed(0) : seconds.toFixed(0));

    return progress;
  }

  next(){
    if(this.allsongs.length !== this.trackIndex+1){
      this.trackIndex++;
      this.file.release();
      this.file = this.media.create(this.allsongs[this.trackIndex].songURL);
      this.file.play();
      this.songPlaying = true;
    }
    else{
      this.trackIndex = 0;
      this.file.release();
      this.file = this.media.create(this.allsongs[this.trackIndex].songURL);
      this.file.play();
      this.songPlaying = true;
    }
  }

  previous(){
    if(this.trackIndex - 1 ! === -1){
      this.trackIndex = this.allsongs.length - 1;
      this.file.release();
      this.file = this.media.create(this.allsongs[this.trackIndex].songURL);
      this.file.play();
      this.songPlaying = true;
    }
    else{
      this.trackIndex--;
      this.file.release();
      this.file = this.media.create(this.allsongs[this.trackIndex].songURL);
      this.file.play();
      this.songPlaying = true;
    }
  }

  getCurrentTrack(){
    return this.allsongs[this.trackIndex];
  }

  seekTo(val: number){
    this.file.seekTo(val);
  }

  hideFooterPlayer() {
    var footerPlayerElements = document.getElementsByClassName(
      'offline-footer-player'
    );

    for (var i = 0; i < footerPlayerElements.length; i++) {
      var footerPlayer = footerPlayerElements[i];

      if (footerPlayer) {
        footerPlayer.classList.remove('alwaysblock');
        footerPlayer.classList.remove('mini');
        footerPlayer.classList.remove('mini-active');
      }
    }
  }

  showFooterPlayer() {
    var footerPlayerElements = document.getElementsByClassName(
      'offline-footer-player'
    );

    for (var i = 0; i < footerPlayerElements.length; i++) {
      var footerPlayer = footerPlayerElements[i];

      if (footerPlayer) {
        footerPlayer.classList.add('alwaysblock');
        footerPlayer.classList.add('mini');
        footerPlayer.classList.add('mini-active');
      }
    }
  }

mediaPlaying(){
//  return  this.file.onStatusUpdate;
}

getMedia(){
  return this.file;
}

openMediaPlayer(){
  this.hideFooterPlayer();
  const modal = this.modal.create(MyMusicPlayerPage);
  modal.onDidDismiss(() => {
    this.showFooterPlayer();
  });

  modal.present();
}

openMusicPlayer(songs, index){
  this.hideFooterPlayer();
  this.hideFooterPlayerSecond();
  this.allsongs = songs;
  this.trackIndex = index;
  this.helper.stopMusic();
  if(this.file)
    this.file.release();
  this.createsong();
  const modal = this.modal.create(MyMusicPlayerPage);
  modal.onDidDismiss(() => {
    this.showFooterPlayer();
  });

  modal.present();
  
}

hideFooterPlayerSecond() {
  var footerPlayerElements = document.getElementsByClassName(
    'unique-footer-player'
  );

  for (var i = 0; i < footerPlayerElements.length; i++) {
    var footerPlayer = footerPlayerElements[i];

    if (footerPlayer) {
      footerPlayer.classList.remove('alwaysblock');
      footerPlayer.classList.remove('mini');
      footerPlayer.classList.remove('mini-active');
    }
  }
}

destroy(){
  this.file.pause();
  this.file.release();
}

getAllsongs(){
  return this.allsongs;
}

getCurrentTrackIndex(){
  return this.trackIndex;
}




}
