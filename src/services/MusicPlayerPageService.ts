import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { VideoService } from './VideoService';
import { AudioService } from './AudioService';

import { MusicPlayerPage } from '../pages/music-player/music-player';
//import { GoogleAnalytics } from '@ionic-native/google-analytics';

import { Song } from '../data/Song';
import { ApiProvider } from '../providers/api/api';
import { map } from 'rxjs/operators';
import { MusicappServiceProvider } from '../providers/musicapp-service/musicapp-service';
import { HelperProvider } from '../providers/helper/helper';

@Injectable()
export class MusicPlayerPageService 
{
    allSongs = [];
    upNextSongs = [];
    ads;
    adSong = [];
    recent:Array<any> = [];

    m_Tracks: any[];
    m_Timer: any;
    m_nTrackIndex: number;
    m_nPlayCount: number;
    m_Advertises: any[]; 
    m_LikedSongs: any[];
    m_bAdvertisePlaying: boolean;
    m_bAdvertiseExist: boolean;
    m_bProgressChanged: boolean;
    m_bRepeat: boolean = true; //true
    m_bShuffle: boolean = false; //false 
    m_bLikedSongExist: boolean = false; 

    constructor(private modalCtrl: ModalController,
                private videoService: VideoService,
                private audioService: AudioService,
                private api: ApiProvider, 
                private player: MusicappServiceProvider/*,
                private m_GoogleAnalytics: GoogleAnalytics*/) 
    {
        this.api.getRecentlyPlayed(localStorage.getItem('uid')).pipe(map(actions => actions.map(a =>
        {
            const data = a.payload.doc.data();
            const did = a.payload.doc.id;
            return {did, ...data};
        }))).subscribe(res =>
        {
            this.recent = res;
            console.log(this.recent);
        });

        this.m_bAdvertiseExist = true;
        this.api.getAds().pipe(map(actions => actions.map(a =>
        {
            const data = a.payload.doc.data();
            const did = a.payload.doc.id;
            return {did, ...data};
        }))).subscribe(res =>
        {
            this.ads = res;
            if( this.ads.length == 0 )
                this.m_bAdvertiseExist = false;
            console.log(this.ads);
        }, error =>
        {
            this.m_bAdvertiseExist = false;
        });    
    }

    GetLikedSongs()
    {
        let id = localStorage.getItem('uid');
        this.api.getLikedSongs(localStorage.getItem('uid')).pipe(map(actions => actions.map(a =>
        {
            const data = a.payload.doc.data();
            const did = a.payload.doc.id;
            return {did, ...data};
        }))).subscribe(res =>
        {
            this.m_LikedSongs = res;

            this.m_bLikedSongExist = false;
            if( this.m_LikedSongs[0].songs.length > 0 )
            {
                let i, j;
                for( i = 0; i < this.m_Tracks.length; i++ )
                {
                    for( j = 0; j < this.m_LikedSongs[0].songs.length; j++ )
                    {
                        if( this.m_Tracks[i].did == this.m_LikedSongs[0].songs[j] )
                        {
                            this.m_Tracks[i].bLike = true;
                            break;
                        }
                    }
                }

                this.m_bLikedSongExist = true;
            }
        });  
    } 

    SetLikeSongs(val)
    {
        if(val === 'like')
        {
            if( this.m_bLikedSongExist )
            {
                let x: Array<string> = this.m_LikedSongs[0].songs;
                let id = localStorage.getItem('songId');
                x.push(id);

                let data = 
                {
                    uid: localStorage.getItem('uid'),
                    songs: x
                };

                this.api.updateLikedSongs(this.m_LikedSongs[0].did, data);
            }
            else
            {
                let x = [];
                x.push(localStorage.getItem('songId'));
            
                let data = 
                {
                    uid: localStorage.getItem('uid'),
                    songs: x
                };

                this.api.addLikedsong(data);
            }

            this.m_Tracks[this.m_nTrackIndex].bLike = true;
        }
        else if(val === 'dislike')
        {
            let x: Array<string> = this.m_LikedSongs[0].songs;
            x.splice(x.indexOf(localStorage.getItem('songId')), 1);
    
            let data = 
            {
                uid: localStorage.getItem('uid'),
                songs: x
            };

            this.api.updateLikedSongs(this.m_LikedSongs[0].did, data).then(res =>
            {

            }, err =>
            {
                console.log(err);
            })

            this.m_Tracks[this.m_nTrackIndex].bLike = false;
        }
    }

    getCurrentSongDetails()
    {
        return this.allSongs[this.audioService.trackIndex];
    }

    openMusicPlayer(songs, trackIndex: number) 
    {
        if(localStorage.getItem('adStatus') !== 'active')
        {
            this.videoService.hideMiniPlayer();
            this.hideFooterPlayer();
            this.hideFooterPlayerSecond();
            this.stopOfflinePlayer();

            this.allSongs = songs;

            this.m_Tracks = this.GetTracksFromSongs(this.allSongs);
            this.m_nTrackIndex = trackIndex;
            this.m_Advertises = this.GetTracksFromSongs(this.ads);

            this.GetLikedSongs();

            this.m_nPlayCount = 0;
            this.m_bAdvertisePlaying = false;
            this.m_bProgressChanged = false;

            this.PlayRepeat();
            this.SetTimer();

            const modal = this.modalCtrl.create(MusicPlayerPage, {songs: songs, index: trackIndex});
            modal.onDidDismiss(() => 
            {
                this.showFooterPlayer();
            });
            modal.present();
        }
    }

    SetTimer()
    {
        setTimeout( () =>
        {
            this.m_Timer = setInterval(() => 
            {       
                this.OnTimer();
            }, 100)      
        }, 3000);  
    }

    KillTimer()
    {
        clearInterval(this.m_Timer);
        this.m_Timer = null;
    }

    OnTimer()
    {
        if( this.audioService.playingTrack().progress)
        {
            this.m_bProgressChanged = true;
        }
        else 
        {
            if( this.m_bProgressChanged )
            {
                if( this.m_bRepeat )
                    this.PlayRepeat();
                else if( this.m_bShuffle )
                    this.PlayRandom();
                else
                    this.PlayNext();  
            }
        }

        if( this.m_bAdvertisePlaying == false && this.audioService.m_nNotiState > 0 )
        {
            switch( this.audioService.m_nNotiState )
            {
                case 1:
                    this.audioService.m_nNotiState = 0;
                    this.PlayPause(true);
                    break;
                case 2:
                    this.audioService.m_nNotiState = 0;
                    this.PlayPause(false);
                    break;
                case 11:
                    this.audioService.m_nNotiState = 0;
                    this.PlayNext();
                    break;
                case 12:
                    this.audioService.m_nNotiState = 0;
                    this.PlayPrevious();
                    break;
            }
        }  
    }    

    TrackEvent(song)
    {
/*        
        this.m_GoogleAnalytics.trackView(song).then(()=>
        {
            console.log('Success');
        }).catch((e)=>
        {
            console.log("Faild"+ e)
        })
*/        
    }

    PlayRepeat()
    {
        this.m_bProgressChanged = false;

        if( this.m_bAdvertiseExist && this.m_nPlayCount == 2 )
        {
            this.audioService.OpenAudio(this.m_Advertises[0]);
            this.m_nPlayCount = 0;
            this.m_bAdvertisePlaying = true;
            localStorage.setItem('songId', this.m_Advertises[0].did);
        }
        else
        {
            this.audioService.OpenAudio(this.m_Tracks[this.m_nTrackIndex]);
            this.m_nPlayCount++;
            this.m_bAdvertisePlaying = false;
            localStorage.setItem('songId', this.allSongs[this.m_nTrackIndex].did);
            this.TrackEvent(this.allSongs[this.m_nTrackIndex].title);
        } 

        this.SetRecentSongs();
    }

    PlayRandom()
    {
        let nRandomIndex = Math.floor(Math.random() * this.allSongs.length);

        if( nRandomIndex != this.m_nTrackIndex ) 
        {
            this.m_nTrackIndex = nRandomIndex;
            this.PlayRepeat();
        }        
    }

    PlayNext()
    {
        if( this.m_bShuffle )
            this.PlayRandom();
        else
        {
            this.m_bProgressChanged = false;

            if( this.m_bAdvertiseExist && this.m_nPlayCount == 2 )
            {
                this.audioService.OpenAudio(this.m_Advertises[0]);
                this.m_nPlayCount = 0;
                this.m_bAdvertisePlaying = true;
                localStorage.setItem('songId', this.m_Advertises[0].did);
            }
            else
            {
                if (this.m_nTrackIndex < this.m_Tracks.length - 1) 
                    this.m_nTrackIndex++;
                else
                    this.m_nTrackIndex = 0;            

                this.audioService.OpenAudio(this.m_Tracks[this.m_nTrackIndex]);
                this.m_nPlayCount++;
                this.m_bAdvertisePlaying = false;
                localStorage.setItem('songId', this.allSongs[this.m_nTrackIndex].did);
            }

            this.SetRecentSongs();
        }
    }

    PlayPrevious()
    {
        this.m_bProgressChanged = false;

        if( this.m_bAdvertiseExist && this.m_nPlayCount == 2 )
        {
            this.audioService.OpenAudio(this.m_Advertises[0]);
            this.m_nPlayCount = 0;
            this.m_bAdvertisePlaying = true;
            localStorage.setItem('songId', this.m_Advertises[0].did);

            if (this.m_nTrackIndex == 0 ) 
                this.m_nTrackIndex = this.m_Tracks.length - 1;
            else
                this.m_nTrackIndex--;                   
        }
        else
        {
            if (this.m_nTrackIndex == 0 ) 
                this.m_nTrackIndex = this.m_Tracks.length - 1;
            else
                this.m_nTrackIndex--;            

            this.audioService.OpenAudio(this.m_Tracks[this.m_nTrackIndex]);
            this.m_nPlayCount++;
            this.m_bAdvertisePlaying = false;
            localStorage.setItem('songId', this.allSongs[this.m_nTrackIndex].did);
            this.TrackEvent(this.allSongs[this.m_nTrackIndex].title);
        }

        this.SetRecentSongs();
    }

    PlayPause(bPlay: boolean)
    {
        if( bPlay )
            this.audioService.play();
        else
            this.audioService.pause();
    }

    SetRepeat() 
    {
        if( !this.m_bRepeat )
            this.m_bShuffle = false;

        this.m_bRepeat = !this.m_bRepeat;
    }   

    SetShuffle() 
    {
        if( !this.m_bShuffle )
            this.m_bRepeat = false;

        this.m_bShuffle = !this.m_bShuffle;
    }         

    GetTracksFromSongs(songs) 
    {
        var tracks = [];

        for( var i = 0; i < songs.length; i++ )
        {
            var song = songs[i];

            var artists = song.artist;
            if( artists.length == 1 )
                artists = artists[0].value;
            else if( artists.length == 2 )
                artists = artists[1].value;  
            else
                artists = song.oartist;

            var track = 
            {
                did: song.did,
                src: song.songURL,
                artist: song.oartist,
                artists: artists,
                title: song.title,
                art: song.imageURL,
                preload: 'metadata', // tell the plugin to preload metadata such as duration for this track, set to 'none' to turn off
                isLiked: song.isLiked,
                bLike: false
            };    

            tracks.push(track);        
        }

        return tracks;
    } 

    SetRecentSongs()
    {
        let nDid;

        if( this.m_bAdvertisePlaying)
            nDid = this.m_Advertises[0].did;
        else
            nDid = this.m_Tracks[this.m_nTrackIndex].did;

        if(this.recent.length === 0)
        {
            let x = { uid: localStorage.getItem('uid'), songs: [] }
            x.songs.push(nDid);

            this.api.addRecentPlayed(x).then( res =>
            {
                console.log('recently added');
            }, err =>
            {
                console.log(err.message);
            })
        }
        else
        {
            if(this.recent[0].songs.indexOf(nDid) > -1)
            {
                let index = this.recent[0].songs.indexOf(nDid);
                this.recent[0].songs.splice(index,1);
            }

            this.recent[0].songs.unshift(nDid);            

            if(this.recent[0].songs.length === 100)
                this.recent[0].songs.pop(this.recent[0].songs.length - 1);

            let data = 
            {
                uid: localStorage.getItem('uid'),
                songs: this.recent[0].songs
            }

            this.api.updateRecentlyPlayed(this.recent[0].did,data).then( res =>
            {
                console.log('recently added');
            }, err =>
            {
                console.log(err.message);
            })
        }
    }


    SetRecentlyPlayed()
    {
        // if(this.recent.length === 0)
        // {
        //     let x = { uid: localStorage.getItem('uid'), songs: [] }
        //     x.songs.push(localStorage.getItem('songId'));

        //     this.api.addRecentPlayed(x).then( res =>
        //     {
        //         console.log('recently added');
        //     }, err =>
        //     {
        //         console.log(err.message);
        //     })
        // }
        // else
        // {
        //     const songId = localStorage.getItem('songId');

        //     if(this.recent[0].songs.indexOf(songId) > -1)
        //     {
        //         let index = this.recent[0].songs.indexOf(songId);
        //         this.recent[0].songs.splice(index,1);

        //         if(this.recent[0].songs.length !== 100)
        //         {
        //             this.recent[0].songs.unshift(songId);
        //             let data = 
        //             {
        //                 uid: localStorage.getItem('uid'),
        //                 songs: this.recent[0].songs
        //             }

        //             this.api.updateRecentlyPlayed(this.recent[0].did,data).then( res =>
        //             {
        //                 console.log('recently added');
        //             }, err =>
        //             {
        //                 console.log(err.message);
        //             })
        //         }
        //     }
        //     else
        //     {
        //         if(this.recent[0].songs.length !== 10)
        //         {
        //             let x = this.recent[0].songs;
        //             x.push(songId);
        //             let data = 
        //             {
        //                 uid: localStorage.getItem('uid'),
        //                 songs: x
        //             }

        //             this.api.updateRecentlyPlayed(this.recent[0].did,data).then( res =>
        //             {
        //                 console.log('recently added');
        //             }, err =>
        //             {
        //                 console.log(err.message);
        //             })
        //         }
        //     }      
        // }
    }

    playAd(songs, trackIndex)
    {
        this.allSongs = songs;
        var tracks = this.GetTracksFromSongs(songs);

        if (!this.audioService.setTracksAndPlay(tracks, trackIndex)) 
        {
            return;
        }

        this.setUpNextSongs();
    }

    simpleOpenMusicPlayer() 
    {
        this.hideFooterPlayer();
        this.hideFooterPlayerSecond();
        const modal = this.modalCtrl.create(MusicPlayerPage);

        modal.onDidDismiss(() => 
        {
            this.showFooterPlayer();
        });

        modal.present();
    }

    simplePlaySong(song) 
    {
        var tracks = this.GetTracksFromSongs(this.allSongs);

        var trackIndex = this.allSongs.findIndex(function(otherSong) 
        {
            return otherSong.name === song.name;
        });

        if (!this.audioService.setTracksAndPlay(tracks, trackIndex)) 
        {
            return;
        }

        this.setUpNextSongs();
    }

    setUpNextSongs() 
    {
        // localStorage.setItem('songId', this.allSongs[this.audioService.trackIndex].did);
        // this.updateSong();
        // this.SetRecentlyPlayed();
        // this.upNextSongs = this.allSongs.slice();
        // this.upNextSongs.splice(0, this.audioService.trackIndex + 1);
    }

    getAllSongs()
    {
        return this.allSongs;
    }

    updateSong()
    {
        if(localStorage.getItem('adStatus') === 'inactive')
        {
            this.allSongs[this.audioService.trackIndex].views++
            this.api.updateSongs(localStorage.getItem('songId'), this.allSongs[this.audioService.trackIndex] ).then(res =>
            {
                console.log('views Updated');
            }, err =>
            {
                console.log(err)
            })
        }
    }

    showFooterPlayer() 
    {
        var footerPlayerElements = document.getElementsByClassName('unique-footer-player');

        for (var i = 0; i < footerPlayerElements.length; i++) 
        {
            var footerPlayer = footerPlayerElements[i];

            if (footerPlayer) 
            {
                footerPlayer.classList.add('alwaysblock');
                footerPlayer.classList.add('mini');
                footerPlayer.classList.add('mini-active');
            }
        }

        this.audioService.m_bFooter = true;
    }

    hideFooterPlayer() 
    {
        var footerPlayerElements = document.getElementsByClassName('unique-footer-player');

        for (var i = 0; i < footerPlayerElements.length; i++) 
        {
            var footerPlayer = footerPlayerElements[i];

            if (footerPlayer) 
            {
                footerPlayer.classList.remove('alwaysblock');
                footerPlayer.classList.remove('mini');
                footerPlayer.classList.remove('mini-active');
            }
        }
        this.audioService.m_bFooter = false;
    }

    hideFooterPlayerSecond() 
    {
        var footerPlayerElements = document.getElementsByClassName('offline-footer-player');

        for (var i = 0; i < footerPlayerElements.length; i++) 
        {
            var footerPlayer = footerPlayerElements[i];

            if (footerPlayer) 
            {
                footerPlayer.classList.remove('alwaysblock');
                footerPlayer.classList.remove('mini');
                footerPlayer.classList.remove('mini-active');
            }
        }
    }

    stopOfflinePlayer()
    {
        if(this.player.getMedia())
        {
            this.player.destroy();
        }
    }
}

/*
import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { VideoService } from './VideoService';
import { AudioService } from './AudioService';

import { MusicPlayerPage } from '../pages/music-player/music-player';

import { Song } from '../data/Song';
import { ApiProvider } from '../providers/api/api';
import { map } from 'rxjs/operators';
import { MusicappServiceProvider } from '../providers/musicapp-service/musicapp-service';
import { HelperProvider } from '../providers/helper/helper';

@Injectable()
export class MusicPlayerPageService {
  allSongs = [];
  upNextSongs = [];
  ads;
  adSong = [];
  recent:Array<any> = [];
  constructor(
    private modalCtrl: ModalController,
    private videoService: VideoService,
    private audioService: AudioService,
    private api: ApiProvider, private player: MusicappServiceProvider
  ) {
    this.api.getRecentlyPlayed(localStorage.getItem('uid'))
    .pipe(map(actions => actions.map(a =>{
      const data = a.payload.doc.data();
      const did = a.payload.doc.id;
      return {did, ...data};
    })))
      .subscribe(res =>{
        this.recent = res;
        console.log(this.recent);
      });
  }

  getCurrentSongDetails(){
    return this.allSongs[this.audioService.trackIndex];
  }


  openMusicPlayer(songs, trackIndex: number) {
    localStorage.setItem('songId',songs[trackIndex].did);
    if(localStorage.getItem('adStatus') !== 'active'){
        this.videoService.hideMiniPlayer();
    this.hideFooterPlayer();
    this.hideFooterPlayerSecond();
    this.stopOfflinePlayer();
    this.allSongs = songs;
    var tracks = this.getTracksFromSongs(songs);

    if (!this.audioService.setTracksAndPlay(tracks, trackIndex)) {
      return;
    }

    this.setUpNextSongs();

    const modal = this.modalCtrl.create(MusicPlayerPage, {songs: songs, index: trackIndex});

    modal.onDidDismiss(() => {
      this.showFooterPlayer();
    });

    modal.present();


    }
  
  }

  setRecentlyPlayed(){
    if(this.recent.length === 0){
      let x = {
        uid: localStorage.getItem('uid'),
        songs: []
      }
      x.songs.push(localStorage.getItem('songId'));
      this.api.addRecentPlayed(x)
        .then( res =>{
          console.log('recently added');
        }, err =>{
          console.log(err.message);
        })
    }
    else{
      const songId = localStorage.getItem('songId');
     
        if(this.recent[0].songs.indexOf(songId) > -1){
          let index = this.recent[0].songs.indexOf(songId);
          this.recent[0].songs.splice(index,1);
        
          if(this.recent[0].songs.length !== 100){
            this.recent[0].songs.unshift(songId);
            let data = {
              uid: localStorage.getItem('uid'),
              songs: this.recent[0].songs
            }
            this.api.updateRecentlyPlayed(this.recent[0].did,data)
            .then( res =>{
              console.log('recently added');
            }, err =>{
              console.log(err.message);
            })
          }
            
          
        }
        else{
          if(this.recent[0].songs.length !== 10){
            let x = this.recent[0].songs;
            x.push(songId);
            let data ={
              uid: localStorage.getItem('uid'),
              songs: x
            }
            this.api.updateRecentlyPlayed(this.recent[0].did,data)
            .then( res =>{
              console.log('recently added');
            }, err =>{
              console.log(err.message);
            })
          }
        }      
    }
  }

  playAd(songs, trackIndex){
    this.allSongs = songs;
    var tracks = this.getTracksFromSongs(songs);

    if (!this.audioService.setTracksAndPlay(tracks, trackIndex)) {
      return;
    }

    this.setUpNextSongs();
  }

  simpleOpenMusicPlayer() {
    this.hideFooterPlayer();
    this.hideFooterPlayerSecond();
    const modal = this.modalCtrl.create(MusicPlayerPage);

    modal.onDidDismiss(() => {
      this.showFooterPlayer();
    });

    modal.present();
  }

  simplePlaySong(song) {
    var tracks = this.getTracksFromSongs(this.allSongs);

    var trackIndex = this.allSongs.findIndex(function(otherSong) {
      return otherSong.name === song.name;
    });

    if (!this.audioService.setTracksAndPlay(tracks, trackIndex)) {
      return;
    }

    this.setUpNextSongs();
  }

  setUpNextSongs() {
    localStorage.setItem('songId', this.allSongs[this.audioService.trackIndex].did);
    this.updateSong();
    this.setRecentlyPlayed();
      this.upNextSongs = this.allSongs.slice();
      this.upNextSongs.splice(0, this.audioService.trackIndex + 1);

  }

  getAllSongs(){
    return this.allSongs;
  }

  updateSong(){
    if(localStorage.getItem('adStatus') === 'inactive'){
          this.allSongs[this.audioService.trackIndex].views++
    this.api.updateSongs(localStorage.getItem('songId'), this.allSongs[this.audioService.trackIndex] )
    .then(res =>{
      console.log('views Updated');
    }, err =>{
      console.log(err)
    })
    }

  }




  getTracksFromSongs(songs) {
    var tracks = [];
    
    songs.forEach(song => {
      var track = {
        src: song.songURL,
        artist: song.oartist,
        title: song.title,
        art: song.imageURL,
        preload: 'metadata',
        isLiked: song.isLiked
      };

      tracks.push(track);
    });

    return tracks;
  } 

  showFooterPlayer() {
    var footerPlayerElements = document.getElementsByClassName(
      'unique-footer-player'
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

  hideFooterPlayer() {
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

  hideFooterPlayerSecond() {
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

  stopOfflinePlayer(){
    if(this.player.getMedia()){
      this.player.destroy();
    }
  }
}
*/