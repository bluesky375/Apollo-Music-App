import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';

import { MusicControls } from '@ionic-native/music-controls';

import { AudioProvider } from '../data/ionic-audio';

@Injectable()
export class AudioService 
{
    trackIndex: number = 0;
    public m_bFooter: boolean = false;
    m_nNotiState:number = 0;

    constructor(private platform: Platform,
                public audioProvider: AudioProvider,
                private musicControls: MusicControls,
                private events: Events) 
    {
    }

    OpenAudio(track: any): boolean 
    {
        if (!this.audioProvider.canPlay()) 
            return false;

        this.audioProvider.resetTracks();

        this.audioProvider.create(track);
        this.audioProvider.play(0);

        if (this.platform.is('cordova')) 
        {
            this.initialiseMusicControls(track);
        }

        return true;
    }

    Delay(ms: number) 
    {
        return new Promise(resolve => setTimeout(resolve, ms) );
    }   

    playingTrack() 
    {
        return this.audioProvider.playingTrack();
    }

    setTracksAndPlay(tracks: any[], trackIndex: number): boolean 
    {
        if (!this.audioProvider.canPlay()) 
        {
            return false;
        }

        this.audioProvider.resetTracks();

        this.trackIndex = trackIndex;

        tracks.forEach(track => 
        {
            this.audioProvider.create(track);
        });

        this.audioProvider.play(this.trackIndex);

        if (this.platform.is('cordova')) 
        {
            this.initialiseMusicControls(tracks[this.trackIndex]);
        }

        return true;
    }

    play() 
    {
        this.audioProvider.play(this.trackIndex);
        this.musicControls.updateIsPlaying(true);
    }

    pause() 
    {
        this.audioProvider.pause();
        this.musicControls.updateIsPlaying(false);
    }

    stop() 
    {
        if (this.audioProvider.current != undefined) 
        {
            this.audioProvider.seekTo(0);
            this.audioProvider.pause();
            this.musicControls.updateIsPlaying(false);
        }
    }    

    next() 
    {
        // if (this.audioProvider.current != undefined) 
        // {
        //     if (this.isShuffle) 
        //     {
        //         // loop until find appropriate random index
        //         while (true) 
        //         {
        //             let randomIndex = Math.floor(Math.random() * this.audioProvider.tracks.length);

        //             if (randomIndex != this.audioProvider.current) 
        //             {
        //                 this.trackIndex = randomIndex;
        //                 this.playNextOrPrevious();
        //                 break;
        //             }
        //         }
        //     } 
        //     else 
        //     {
        //         if (this.audioProvider.current < this.audioProvider.tracks.length - 1) 
        //         {
        //             this.trackIndex = this.audioProvider.current + 1;
        //         } 
        //         else 
        //         {
        //             this.trackIndex = 0;
        //         }

        //         this.playNextOrPrevious();
        //     }
        // }
    }

    previous() 
    {
        // if (this.audioProvider.current != undefined) 
        // {
        //     if (this.isShuffle) 
        //     {
        //         // loop until find appropriate random index
        //         while (true) 
        //         {
        //             let randomIndex = Math.floor(Math.random() * this.audioProvider.tracks.length + 0);

        //             if (randomIndex != this.audioProvider.current) 
        //             {
        //                 this.trackIndex = randomIndex;
        //                 this.playNextOrPrevious();
        //                 break;
        //             }
        //         }
        //     } 
        //     else 
        //     {
        //         if (this.audioProvider.current > 0) 
        //         {
        //             this.trackIndex = this.audioProvider.current - 1;
        //         } 
        //         else 
        //         {
        //             this.trackIndex = this.audioProvider.tracks.length - 1;
        //         }

        //         this.playNextOrPrevious();
        //     }
        // }
    }

    playNextOrPrevious() 
    {
        if (this.audioProvider.current != undefined) 
        {
            this.audioProvider.pause();
            this.audioProvider.seekTo(0);
        }

        this.audioProvider.play(this.trackIndex);

        if (this.platform.is('cordova')) 
        {
            this.initialiseMusicControls(this.audioProvider.tracks[this.trackIndex]);
            this.musicControls.updateIsPlaying(true);
        }
    }

    seekTo(val) 
    {
        // let seek = this.audioProvider.tracks[0].progress + 5;
        let seek = val;
        this.audioProvider.seekTo(seek);
    }

    seekBack() 
    {
        let seek = this.audioProvider.tracks[0].progress - 5;
        this.audioProvider.seekTo(seek);
    }

    progressPercentage() 
    {
        if(this.playingTrack().progress)
            return Math.trunc((this.playingTrack().progress / this.playingTrack().duration) * 100);
        else
            return null;
    }

    progressText() 
    {
        var minutes = Math.floor(this.playingTrack().progress / 60);
        var seconds = this.playingTrack().progress - minutes * 60;

        var progress = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds.toFixed(0) : seconds.toFixed(0));

        return progress;
    }

    durationText() 
    {
        var minutes = Math.floor(this.playingTrack().duration / 60);
        var seconds = this.playingTrack().duration - minutes * 60;

        var duration = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds.toFixed(0) : seconds.toFixed(0));

        return duration;
    }

    initialiseMusicControls(track) 
    {
        this.musicControls.create(
        {
            track: track.title, // optional, default : ''
            artist: track.artists, // optional, default : ''
            cover: track.art, // optional, default : nothing
            // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
            //           or a remote url ('http://...', 'https://...', 'ftp://...')
            isPlaying: true, // optional, default : true
            dismissable: true, // optional, default : false

            // hide previous/next/close buttons:
            hasPrev: true, // show previous button, optional, default: true
            hasNext: true, // show next button, optional, default: true
            hasClose: false, // show close button, optional, default: false

            // iOS only, optional
            album: track.albumName, // optional, default: ''
            duration: this.audioProvider.tracks[this.audioProvider.current].duration, // optional, default: 0
            elapsed: this.audioProvider.tracks[this.audioProvider.current].progress, // optional, default: 0
            hasSkipForward: true, // show skip forward button, optional, default: false
            hasSkipBackward: true, // show skip backward button, optional, default: false
            skipForwardInterval: 15, // display number for skip forward, optional, default: 0
            skipBackwardInterval: 15, // display number for skip backward, optional, default: 0
            hasScrubbing: false, // enable scrubbing from control center and lockscreen progress bar, optional

            // Android only, optional
            // text displayed in the status bar when the notification (and the ticker) are updated, optional
            ticker: 'Now playing ' + track.name,

            // All icons default to their built-in android equivalents
            // The supplied drawable name, e.g. 'media_play', is the name of a drawable found under android/res/drawable* folders
            playIcon: 'media_play',
            pauseIcon: 'media_pause',
            prevIcon: 'media_prev',
            nextIcon: 'media_next',
            closeIcon: 'media_close',
            notificationIcon: 'notification'
        });

        this.musicControls.subscribe().subscribe(action => 
        {
            const message = JSON.parse(action).message;

            switch (message) 
            {
                case 'music-controls-next':
                    this.m_nNotiState = 11;
                    this.events.publish('updateSongIsPlaying');
                    break;
                case 'music-controls-previous':
                    this.m_nNotiState = 12;
                    this.events.publish('updateSongIsPlaying');
                    break;
                case 'music-controls-pause':
                    this.m_nNotiState = 2;
                    break;
                case 'music-controls-play':
                    this.m_nNotiState = 1;
                    break;
                case 'music-controls-destroy':
                    this.musicControls.destroy();
                    this.stop();
                    break;
                // External controls (iOS only)
                case 'music-controls-toggle-play-pause':
                    // Do something
                    break;
                case 'music-controls-seek-to':
                    const seekToInSeconds = JSON.parse(action).position;

                    this.musicControls.updateElapsed(
                    {
                        elapsed: seekToInSeconds,
                        isPlaying: true
                    });
                    break;
                case 'music-controls-skip-forward':
                    // this.seekTo();
                    break;
                case 'music-controls-skip-backward':
                    this.seekBack();
                    break;
                // Headset events (Android only)
                // All media button events are listed below
                case 'music-controls-media-button':
                    // Do something
                    break;
                case 'music-controls-headset-unplugged':
                    this.pause();
                    break;
                case 'music-controls-headset-plugged':
                    // Do something
                    break;
                default:
                    break;
            }
        });

        this.musicControls.listen(); // activates the observable above
    }

    destroyMusicControls()
    {
        this.musicControls.destroy().then(res =>
        {
            console.log('destroyed');
        }, err => 
        {
            console.log('err while destroying')
        })
    }
}

/*
import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';

import { MusicControls } from '@ionic-native/music-controls';

import { AudioProvider } from '../data/ionic-audio';

@Injectable()
export class AudioService {
  trackIndex: number = 0;
  isRepeat: boolean = true;
  isShuffle: boolean = false;

  constructor(
    private platform: Platform,
    public audioProvider: AudioProvider,
    private musicControls: MusicControls,
    private events: Events
  ) {}

  playingTrack() {
    return this.audioProvider.playingTrack();
  }

  setTracksAndPlay(tracks: any[], trackIndex: number): boolean {
    if (!this.audioProvider.canPlay()) {
      return false;
    }

    this.audioProvider.resetTracks();

    this.trackIndex = trackIndex;

    tracks.forEach(track => {
      this.audioProvider.create(track);
    });

    this.audioProvider.play(this.trackIndex);

    if (this.platform.is('cordova')) {
      this.initialiseMusicControls(tracks[this.trackIndex]);
    }

    return true;
  }

  play() {
    this.audioProvider.play(this.trackIndex);
    this.musicControls.updateIsPlaying(true);
  }

  pause() {
    this.audioProvider.pause();
    this.musicControls.updateIsPlaying(false);
  }

  next() {
    if (this.audioProvider.current != undefined) {
      if (this.isShuffle) {
        // loop until find appropriate random index
        while (true) {
          let randomIndex = Math.floor(
            Math.random() * this.audioProvider.tracks.length
          );

          if (randomIndex != this.audioProvider.current) {
            this.trackIndex = randomIndex;
            this.playNextOrPrevious();
            break;
          }
        }
      } else {
        if (this.audioProvider.current < this.audioProvider.tracks.length - 1) {
          this.trackIndex = this.audioProvider.current + 1;
        } else {
          this.trackIndex = 0;
        }

        this.playNextOrPrevious();
      }
    }
  }

  previous() {
    if (this.audioProvider.current != undefined) {
      if (this.isShuffle) {
        // loop until find appropriate random index
        while (true) {
          let randomIndex = Math.floor(
            Math.random() * this.audioProvider.tracks.length + 0
          );

          if (randomIndex != this.audioProvider.current) {
            this.trackIndex = randomIndex;
            this.playNextOrPrevious();
            break;
          }
        }
      } else {
        if (this.audioProvider.current > 0) {
          this.trackIndex = this.audioProvider.current - 1;
        } else {
          this.trackIndex = this.audioProvider.tracks.length - 1;
        }

        this.playNextOrPrevious();
      }
    }
  }

  playNextOrPrevious() {
    if (this.audioProvider.current != undefined) {
      this.audioProvider.pause();
      this.audioProvider.seekTo(0);
    }

    this.audioProvider.play(this.trackIndex);

    if (this.platform.is('cordova')) {
      this.initialiseMusicControls(this.audioProvider.tracks[this.trackIndex]);
      this.musicControls.updateIsPlaying(true);
    }
  }

  shuffleRepeat() {
    this.isRepeat = !this.isRepeat;
    this.isShuffle = !this.isShuffle;
  }

  seekTo(val) {
    // let seek = this.audioProvider.tracks[0].progress + 5;
    let seek = val;
    this.audioProvider.seekTo(seek);
  }

  seekBack() {
    let seek = this.audioProvider.tracks[0].progress - 5;
    this.audioProvider.seekTo(seek);
  }

  stop() {
    if (this.audioProvider.current != undefined) {
      this.audioProvider.seekTo(0);
      this.audioProvider.pause();
      this.musicControls.updateIsPlaying(false);
    }
  }

  progressPercentage() {
    return Math.trunc(
      (this.playingTrack().progress / this.playingTrack().duration) * 100
    );
  }

  progressText() {
    var minutes = Math.floor(this.playingTrack().progress / 60);
    var seconds = this.playingTrack().progress - minutes * 60;

    var progress =
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds.toFixed(0) : seconds.toFixed(0));

    return progress;
  }

  durationText() {
    var minutes = Math.floor(this.playingTrack().duration / 60);
    var seconds = this.playingTrack().duration - minutes * 60;

    var duration =
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds.toFixed(0) : seconds.toFixed(0));

    return duration;
  }

  initialiseMusicControls(track) {
    this.musicControls.create({
      track: track.title, // optional, default : ''
      artist: track.artist, // optional, default : ''
      cover: track.art, // optional, default : nothing
      // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
      //           or a remote url ('http://...', 'https://...', 'ftp://...')
      isPlaying: true, // optional, default : true
      dismissable: true, // optional, default : false

      // hide previous/next/close buttons:
      hasPrev: true, // show previous button, optional, default: true
      hasNext: true, // show next button, optional, default: true
      hasClose: false, // show close button, optional, default: false

      // iOS only, optional
      album: track.albumName, // optional, default: ''
      duration: this.audioProvider.tracks[this.audioProvider.current].duration, // optional, default: 0
      elapsed: this.audioProvider.tracks[this.audioProvider.current].progress, // optional, default: 0
      hasSkipForward: true, // show skip forward button, optional, default: false
      hasSkipBackward: true, // show skip backward button, optional, default: false
      skipForwardInterval: 15, // display number for skip forward, optional, default: 0
      skipBackwardInterval: 15, // display number for skip backward, optional, default: 0
      hasScrubbing: false, // enable scrubbing from control center and lockscreen progress bar, optional

      // Android only, optional
      // text displayed in the status bar when the notification (and the ticker) are updated, optional
      ticker: 'Now playing ' + track.name,

      // All icons default to their built-in android equivalents
      // The supplied drawable name, e.g. 'media_play', is the name of a drawable found under android/res/drawable* folders
      playIcon: 'media_play',
      pauseIcon: 'media_pause',
      prevIcon: 'media_prev',
      nextIcon: 'media_next',
      closeIcon: 'media_close',
      notificationIcon: 'notification'
    });

    this.musicControls.subscribe().subscribe(action => {
      const message = JSON.parse(action).message;

      switch (message) {
        case 'music-controls-next':
          this.next();
          this.events.publish('updateSongIsPlaying');
          break;

        case 'music-controls-previous':
          this.previous();
          this.events.publish('updateSongIsPlaying');
          break;

        case 'music-controls-pause':
          this.pause();
          break;

        case 'music-controls-play':
          this.play();
          break;

        case 'music-controls-destroy':
          this.musicControls.destroy();
          this.stop();
          break;

        // External controls (iOS only)
        case 'music-controls-toggle-play-pause':
          // Do something
          break;

        case 'music-controls-seek-to':
          const seekToInSeconds = JSON.parse(action).position;

          this.musicControls.updateElapsed({
            elapsed: seekToInSeconds,
            isPlaying: true
          });
          break;

        case 'music-controls-skip-forward':
          // this.seekTo();
          break;

        case 'music-controls-skip-backward':
          this.seekBack();
          break;

        // Headset events (Android only)
        // All media button events are listed below
        case 'music-controls-media-button':
          // Do something
          break;

        case 'music-controls-headset-unplugged':
          this.pause();
          break;

        case 'music-controls-headset-plugged':
          // Do something
          break;

        default:
          break;
      }
    });

    this.musicControls.listen(); // activates the observable above
  }

  destroyMusicControls(){
    this.musicControls.destroy().then(res =>{
      console.log('destroyed');
    }, err => {
      console.log('err while destroying')
    })
  }
}
*/