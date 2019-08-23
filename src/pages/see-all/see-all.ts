import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalService } from '../../services/ModalService';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';
import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';
import { VideoDetailsPageService } from '../../services/VideoDetailsPageService';
import { NativeStorage } from '@ionic-native/native-storage';
import { HelperProvider } from '../../providers/helper/helper';
import { TabsPage } from '../tabs/tabs';
import { AudioService } from '../../services/AudioService';

/**
* Generated class for the SeeAllPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component(
{
    selector: 'page-see-all',
    templateUrl: 'see-all.html',
})
export class SeeAllPage implements OnInit 
{
    data;
    type;
    songs;
    listSongs: Array<any>;
    name;
    index;
    playlist;
    pid;

    constructor(public navCtrl: NavController, 
                public navParams: NavParams,
                public modalService: ModalService, 
                private api: ApiProvider,
                @Inject(forwardRef(() => MusicPlayerPageService))
                public musicPlayerPageService: MusicPlayerPageService,
                @Inject(forwardRef(() => VideoDetailsPageService))
                public videoDetailsPageService: VideoDetailsPageService,
                private audio: AudioService, 
                private nativeStorage: NativeStorage, 
                private helper: HelperProvider) 
    {
        this.data = this.navParams.get('data');
        this.type = this.navParams.get('type');
        this.pid = this.navParams.get('pid');
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

        if( this.pid == "myplaylist" || this.pid == "home" || this.pid == "artist" )
            this.MoveFooterPlayer(true);           
    }

    MoveFooterPlayer(bBottom) 
    {
        var footerPlayerElements = document.getElementsByClassName('unique-footer-player');

        for (var i = 0; i < footerPlayerElements.length; i++) 
        {
            var footerPlayer = footerPlayerElements[i];
            if( bBottom )
                footerPlayer.setAttribute('style', 'bottom: 0px !important');
            else
                footerPlayer.setAttribute('style', 'bottom: 49.5px !important');    
        }
    }    

    ngOnInit()
    {
        this.listSongs = null;
        
        if(this.type === 'playlist')
        {
            let id = this.navParams.get('did');
            this.playlist = id;
            this.index = this.navParams.get('index');
            this.name = id.playlist[this.index].name;
            this.setPlaylistSongs();
        }
        else if(this.type === 'recent')
        {
            this.setRecentSongss();
        }
        else if(this.type === 'most')
        {
            this.getMostPlayed()
        }
        else if(this.type === 'foryou')
        {
            this.setForYou();
        }
        else if(this.type === 'videos')
        {
            this.setVideos();
        }
        else if(this.type === 'videos1')
        {
            this.setNewVideos();
        }
        else if(this.type === 'originals')
        {
            this.setOriginals();
        }
        else if (this.type === 'pulicplaylist')
        {
            this.getPublicPlaylist();
        }
        else if (this.type === 'liked')
        {
            this.getLikedSongs();
        }
        else if(this.type === 'offline')
        {
            this.nativeStorage.getItem('offline').then(res =>
            {
                this.helper.getOfflineData().subscribe(res =>
                {
                    this.listSongs = res;
                })
            }, err =>
            {
                console.log(err)
            })
        }
    }

    getPublicPlaylist()
    {
        this.api.getAllSongs().pipe(map(actions => actions.map(a =>
        {
            const data = a.payload.doc.data();
            const did = a.payload.doc.id;
            return {did, ...data};
        }))).subscribe(res =>
        {
            this.songs = res;
            this.listSongs = this.songs.filter(data => this.data.songs.indexOf(data.did) > -1);
        })
    }

    liked;

    getLikedSongs()
    {
        this.api.getAllSongs().pipe(map(actions => actions.map(a => 
        {
            const data = a.payload.doc.data();
            const did = a.payload.doc.id;
            return {did, ...data};
        }))).subscribe(res =>
        {
            this.songs = res;

            let id = localStorage.getItem('uid');
            this.api.getLikedSongs(localStorage.getItem('uid')).pipe(map(actions => actions.map(a => 
            {
                const data = a.payload.doc.data();
                const did = a.payload.doc.id;
                return {did, ...data};
            }))).subscribe(resp =>
            {
                this.liked = resp;
                if(this.liked.length !== 0)
                {
                    this.listSongs = this.songs.filter( data => this.liked[0].songs.indexOf(data.did)> -1);
                }
            });
        });
    }

    setNewVideos()
    {
        this.api.getNewVideos().pipe(map(actions => actions.map(a =>
        {
            const data =a.payload.doc.data();
            const did = a.payload.doc.id;
            return {did, ...data};
        }))).subscribe(res =>
        {
            this.videos = res;
        })
    }

    setPlaylistSongs()
    {
        this.api.getAllSongs().pipe(map(actions => actions.map(a =>
        {
            const data = a.payload.doc.data();
            const did = a.payload.doc.id;
            return {did, ...data};
        })))
        .subscribe(res =>
        {
            this.songs = res;
            this.listSongs = this.songs.filter(data => this.data.songs.indexOf(data.did) > -1);
        })
    }

    recentlySongs;

    setRecentSongss()
    {
        this.api.getAllSongs().pipe(map(actions => actions.map(a => 
        {
            const data = a.payload.doc.data();
            const did = a.payload.doc.id;
            return {did, ...data};
        }))).subscribe(res =>
        {
            this.songs = res;
            this.api.getRecentlyPlayed(localStorage.getItem('uid')).pipe(map(actions => actions.map(a =>
            {
                const data = a.payload.doc.data();
                const did = a.payload.doc.id;
                return {did, ...data};
            }))).subscribe(res =>
            {
                this.recentlySongs = res;
                this.setRecentSongs();
            })
        })
    }

    setRecentSongs()
    {
        if(this.recentlySongs.length !== 0)
        {
            this.listSongs = this.songs.filter( data => this.recentlySongs[0].songs.indexOf(data.did)> -1);
        }
    }

    getMostPlayed()
    {
        this.api.getMostPlayedSongs1().pipe(map(actions => actions.map(a =>
        {
            const data = a.payload.doc.data();
            const did = a.payload.doc.id;
            return {did, ...data};
        }))).subscribe(res =>
        {
            this.listSongs = res;
        });
    }

    setOriginals()
    {
        this.api.getAllOriginals().pipe(map(actions => actions.map(a =>
        {
            const data = a.payload.doc.data();
            const did = a.payload.doc.id;
            return {did, ...data};
        }))).subscribe(res =>
        {
            this.listSongs = res;
        });
    }

    setForYou()
    {
        this.api.getNewSongs1().pipe(map(actions => actions.map(a => 
        {
            const data = a.payload.doc.data();
            const did = a.payload.doc.id;
            return {did, ...data};
        }))).subscribe(res =>
        {
            this.listSongs = res;
        });
    }

    videos;

    setVideos()
    {
        this.api.getpopularVideos1().pipe(map(actions => actions.map(a => 
        {
            const data = a.payload.doc.data();
            const did = a.payload.doc.id;
            return {did, ...data};
        }))).subscribe(res =>
        {
            this.videos =res;
        })
    }

    ionViewDidLoad() 
    {
        this.hideFooterPlayer();
        try
        {
            if(this.audio.progressPercentage())
            this.showFooterPlayer();
        }
        catch(e)
        {
        }
    }

    close()
    {
        if(this.type === 'liked' || this.type === 'offline' || this.type === 'playlist')
        {
            if( this.pid == "myplaylist" )
                this.MoveFooterPlayer(true);
            else
                this.MoveFooterPlayer(false);
            this.navCtrl.pop();
        }
        else
            this.modalService.dismiss();
    }

    delete(item, i)
    {
        let id = this.navParams.get('did');
        let x =   id.playlist.findIndex(data => data.songs.indexOf(item.did) > -1 && data.name === this.data.name); 
        this.data.songs.splice(i,1);

        this.listSongs.splice(i, 1);
      
//        this.listSongs = this.songs.filter(data => this.data.songs.indexOf(data.did) > -1);

        if(this.data.songs.length !== 0)
            id.playlist[x].songs = this.data.songs;
        else
            id.playlist.splice(x,1);
        this.api.updatePlaylist(id.did, {playlist: id.playlist});
    }

    rename()
    {
        let myfunc = (res) =>
        {
            if(res.data.length > 0)
            {
                this.playlist.playlist[this.index].name = res.data;
                this.api.updatePlaylist(this.playlist.did, {playlist: this.playlist.playlist}).then(success => this.name = res.data);
            }
        };
        const alert =  this.helper.showAlertGeneric('Playlist','Rename Playlist','Enter Name','Submit',myfunc);
        alert.present();
    }

}
