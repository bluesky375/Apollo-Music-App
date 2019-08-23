import { Component, Inject, forwardRef } from '@angular/core';
import { IonicPage, ModalController, NavParams, Platform } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';

import { ModalService } from '../../services/ModalService';
import { AudioService } from '../../services/AudioService';
import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';

import { SharePage } from '../share/share';
import { OptionsPage } from '../options/options';

import { Song } from '../../data/Song';
import { HelperProvider } from '../../providers/helper/helper';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { NativeStorage } from '@ionic-native/native-storage';

@IonicPage()
@Component(
{
    selector: 'page-music-player',
    templateUrl: 'music-player.html'
})
export class MusicPlayerPage 
{
    songs;
    index;
    count = 0;
    time;
    adSong: Array<any> = [];
//    ads;
    isActive= false;
    likedsongs;
    isLiked = false;
    exist= false;
    accountType;
    m_bAlive: boolean = true;

    constructor(private modalCtrl: ModalController,
                public modalService: ModalService,
                public audioService: AudioService,
                private params: NavParams,
                private transfer: FileTransfer,
                private nativeStorage: NativeStorage,
                @Inject(forwardRef(() => MusicPlayerPageService)) public musicPlayerPageService: MusicPlayerPageService,
                private helper: HelperProvider,
                private api: ApiProvider,
                private file: File,
                private platform: Platform,
                private httpClient: HttpClient) 
    {
        this.songs = this.params.get('songs');
        this.index = this.params.get('index');
        localStorage.removeItem('count');
        localStorage.removeItem('timer');
        localStorage.setItem('adStatus', 'inactive');
    }

    ionViewDidLoad() 
    {
        console.log('ionViewDidLoad MusicPlayerPage');  
//        this.getData();
        this.resetTime();
        this.helper.getAccountType().subscribe(res =>
        {
            this.accountType = res;
            console.log(this.accountType);
        })

        this.httpClient.get(this.songs[this.index].imageURL).subscribe(result => 
        {
            console.log("Success : Url is alive");  
        }, error => 
        {
            if( error.status >= 400 || error.status == undefined )           
            {
                this.m_bAlive = false;  
            }
            else if( error.status == 0 ) 
            {
                console.log("Fail : Url is alive");
            }
        });   
    }

    // getData()
    // {
    //     this.api.getLikedSongs(localStorage.getItem('uid')).pipe(map(actions => actions.map(a =>
    //     {
    //         const data = a.payload.doc.data();
    //         const did = a.payload.doc.id;
    //         return {did, ...data};
    //     }))).subscribe(res =>
    //     {
    //         this.likedsongs = res;
    //         this.checkCurrentSongLike();
    //     });
    // }

    // checkCurrentSongLike()
    // {
    //     let id = localStorage.getItem('songId');

    //     if(this.likedsongs.length > 0 )
    //     {
    //         let x: Array<string> = this.likedsongs[0].songs;
    //         let check: Array<string> = x.filter(data => data === localStorage.getItem('songId'));
    //         if(check.length > 0)
    //         {
    //             this.isLiked = true;
    //         }
    //         else
    //         {
    //             this.isLiked = false;
    //         }
        
    //         this.exist = true;
    //     }
    //     else
    //     {
    //         this.exist = false;
    //     }
    // }

    likeSong(val)
    {
        this.musicPlayerPageService.SetLikeSongs(val);
    }

    options() 
    {
        const modal = this.modalCtrl.create(OptionsPage);
        modal.present();
    }

    OnPlayPause()
    {
        if( this.musicPlayerPageService.m_bAdvertisePlaying )
            return;
            
        if( this.audioService.playingTrack().isPlaying )
            this.audioService.pause();
        else 
            this.audioService.play();         
    }

    OnPlayPrevious() 
    {
        if(this.audioService.durationText().toString().indexOf('NaN') > -1)
            return;

        if( this.musicPlayerPageService.m_bAdvertisePlaying )
            return;

        // if(this.accountType === 'premium')
        // {
        //     this.musicPlayerPageService.PlayPrevious();
        //     this.musicPlayerPageService.setUpNextSongs();
        //     this.checkCurrentSongLike();
        // }

        this.musicPlayerPageService.PlayPrevious();
        this.musicPlayerPageService.setUpNextSongs();
        // this.checkCurrentSongLike();
    }

    OnPlayNext() 
    {
        if(this.audioService.durationText().toString().indexOf('NaN') > -1)
            return;

        if( this.musicPlayerPageService.m_bAdvertisePlaying )
            return;

        this.musicPlayerPageService.PlayNext();
        this.musicPlayerPageService.setUpNextSongs();
        // this.checkCurrentSongLike();
    }

    changeSeeker(event)
    {
        if( this.musicPlayerPageService.m_bAdvertisePlaying )
            return;

        let val = this.audioService.progressPercentage();
        let seeker = (event.value / 100) * this.audioService.playingTrack().duration;
        if(event.value > val)
            this.audioService.seekTo(seeker);
        else if (event.value < val)
            this.audioService.seekTo(seeker);
    }

    changeSong(song: Song) 
    {
        this.musicPlayerPageService.simplePlaySong(song);
    }

    flagSongs;
    flagIndex;
    allSongs;

    play()
    {
        // this.isActive = true;
        // this.adSong.push(this.ads[0]);
        // this.updateAds(this.ads[0]);
        // this.flagSongs = this.musicPlayerPageService.allSongs;
        // this.flagIndex = this.audioService.trackIndex;
        // this.musicPlayerPageService.playAd(this.adSong,0);
        // this.resetTime();
        // setTimeout( () =>
        // {
        //     this.isActive = false;
        //     localStorage.setItem('adStatus','changed')
        // }, 10000);
    }

    setAds()
    {
        if(localStorage.getItem('adStatus') === 'changed')
        {
            this.musicPlayerPageService.playAd(this.flagSongs,this.flagIndex);
            this.resetTime();
            localStorage.setItem('adStatus','inactive');
        }
        else
        {
            this.count++;
            localStorage.setItem('count', this.count.toString());
            this.checkAdConition();
        }

    }

    checkAdConition()
    {
        this.time = parseInt(localStorage.getItem('timer'));
        this.count = parseInt(localStorage.getItem('count'))
        console.log(Math.floor((Date.now() - this.time )/1000))
        if( Math.floor((Date.now() - this.time )/1000) > 720 && this.count >= 4){
        localStorage.setItem('adStatus','active');
        }
        else{

        }
    }

    resetTime()
    {
        this.count = 0;
        this.time = Date.now();
        localStorage.setItem('count', this.count.toString());
        localStorage.setItem('timer', Date.now().toString());
    }

    updateAds(data)
    {
        let id = data.did;
        delete data['did'];
        data.views++;
        this.api.updateAdsSong(id,data)
        .then(res =>{
        console.log('Ad Updated')
        }, err =>{
        console.log('error while updating');
        })
    }

    doNotheing()
    {
        return;
    }

    setDownload()
    {
        let path = '';
        if(this.platform.is('ios'))
        {
            path = this.file.documentsDirectory;
        }
        else
        {
            if(this.platform.is('cordova'))
                path = this.file.externalDataDirectory.toString().slice(8);
        }

        const fileTransfer: FileTransferObject = this.transfer.create();
        let id = Math.floor(Date.now() / 1000);
        let src = this.audioService.playingTrack().src;

        fileTransfer.download(src, path + `${id}.mp3`, true).then((entry) => 
        {
            this.nativeStorage.getItem('offline').then(data =>
            {
                let x: Array<any> = JSON.parse(data);
                let temp = this.musicPlayerPageService.getCurrentSongDetails();
                temp.songURL = entry.toURL();
                x.push(temp);
        
                this.nativeStorage.setItem('offline', JSON.stringify(x)).then(() =>  
                {
                    this.helper.presentToast('Song saved as Offline');
                    this.helper.setOfflineData(x);
                    this.setSavedSongsId();
                }, error => console.error('Error storing item', error));
            }, err =>
            {
                let x = [];
                let temp = this.musicPlayerPageService.getCurrentSongDetails();
                temp.songURL = entry.toURL();
                x.push(temp);
        
                this.nativeStorage.setItem('offline', JSON.stringify(x)).then(() => 
                {
                    this.helper.presentToast('Song saved as Offline');
                    this.setSavedSongsId();
                    this.helper.setOfflineData(x);
                }, error => console.error('Error storing item', error));
            });
        }, (err) => 
        {
            // handle error
            console.log(err);
        });
    }

    download()
    {
        this.nativeStorage.getItem('songsId').then( res => 
        {
            let x: Array<any> = JSON.parse(res) ;
            let check: Array<any> = x.filter(data => data === localStorage.getItem('songId'));
         
            if(check.length > 0)
            {
                this.helper.presentToast('Song Already saved');
                return;
            }
            else
            {
                this.setDownload();
            }
        }, err =>
        {
            this.setDownload();
        })
    }

    setSavedSongsId()
    {
        this.nativeStorage.getItem('songsId')
        .then(ress =>{
        let x: Array<any> = JSON.parse(ress);
        x.push(localStorage.getItem('songId'));
        this.nativeStorage.setItem('songsId',JSON.stringify(x));
        }, errr =>{
        let x: Array<any> = [];
        x.push(localStorage.getItem('songId'));
        this.nativeStorage.setItem('songsId',JSON.stringify(x));
        })   
    }

    share() 
    {
        const modal = this.modalCtrl.create(SharePage);
        modal.present();
    }
}
