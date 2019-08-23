import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalService } from '../../services/ModalService';
import { MusicappServiceProvider } from '../../providers/musicapp-service/musicapp-service';
import { NativeStorage } from '@ionic-native/native-storage';

/**
 * Generated class for the MyMusicPlayerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-music-player',
  templateUrl: 'my-music-player.html',
})
export class MyMusicPlayerPage  implements OnInit{

  // /storage/emulated/0/Android/data/apollo.music/files/1553642347.mp3

  song; 
  // = {
  //   album: "",
  //   artist: [
  //     {
  //       value: "Testing song",
  //       display: "Testing Value"
  //     }
  //   ],
  //   imageId: "",
  //   imageURL: "https://firebasestorage.googleapis.com/v0/b/musicapp-zeitlab.appspot.com/o/Thumbnails%2F1552044765?alt=media&token=fa7ab886-4ab6-4ccc-971d-3af9e5ac1d8e",
  //   movie: "Toilet",
  //   oartist: "Kartik Jain",
  //   songId: "",
  //   songURL: "/storage/emulated/0/Android/data/apollo.music/files/1553642347.mp3",
  //   title: "Dil Laga Liya ha main ny",
  //   video: "",
  //   views: 0
  // };

  progress: number = 0;
  text = false;
  playing = false;
  currentProgress;

  allsongs;
  index;
  time='00:00';

  constructor(public navCtrl: NavController, 
    @Inject(forwardRef(() => MusicappServiceProvider))
    public player: MusicappServiceProvider,
     public modalService: ModalService, private native: NativeStorage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyMusicPlayerPage');
  }

  ngOnInit(){
    this.song = this.player.getCurrentTrack();
    this.allsongs = this.player.getAllsongs();
    this.text = true;
    this.playing = true;
    setTimeout( () =>{
      this.time = this.player.durationText();
      this.getCurrentProgressNumber();
    }, 500);
    


   
  }

  pause(){
    this.player.pause();
    this.playing = false;
  }
  
  play(){
    this.player.play();
    this.playing = true;
  }

  next(){
    this.player.next();
    this.song = this.player.getCurrentTrack();
    setTimeout( () =>{
      this.time = this.player.durationText();
    }, 500);

  }

  previous(){
    this.player.previous();
    this.song = this.player.getCurrentTrack();
    setTimeout( () =>{
      this.time = this.player.durationText();
    }, 500);

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

 changeSeeker(event){
   let val = Math.floor((this.currentProgress/this.player.getDuration())*100);
   if(event.value > val){
    let x = (event.value * this.player.getDuration()) / 100;
    this.player.seekTo(Math.floor(x) * 1000);
  }
  else if (event.value < val){
    let x = (event.value * this.player.getDuration()) / 100;
    this.player.seekTo(Math.floor(x) * 1000);
  }

  if(event.value === 100){
    setTimeout( () => {
      this.next();
    }, 500);
  }
 }

 temp:Array<any> ;
 delete(){
  // this.native.getItem('offline')
  //   .then(res =>{
  //     this.temp= JSON.parse(res);
  //     if(this.allsongs.length === 1){
  //       this.temp.slice(this.temp.indexOf(this.allsongs[this.d]))

  //     }
  //     else if(this.allsongs.length > 1 ){

  //     }
  //   })
 }


}
