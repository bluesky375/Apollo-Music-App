import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ModalService } from '../../services/ModalService';
import { AudioService } from '../../services/AudioService';

import { AlbumPage } from '../album/album';
import { ArtistPage } from '../artist/artist';

import { Album } from '../../data/Album';
import { Artist } from '../../data/Artist';

import { Randomizer } from '../../data/Helpers/Randomizer';
import { AlbumsInitializer } from '../../data/Initializers/AlbumsInitializer';
import { ArtistsInitializer } from '../../data/Initializers/ArtistsInitializer';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';
import { HelperProvider } from '../../providers/helper/helper';

@IonicPage()
@Component(
{
    selector: 'page-options',
    templateUrl: 'options.html'
})
export class OptionsPage 
{
    randomAlbum: Album;
    randomArtist: Artist;
    playlist: Array<any>;
    myplaylist;
    artist;
    name;
    image;

    constructor(private navCtrl: NavController,
                public modalService: ModalService,
                public audioService: AudioService,
                private api: ApiProvider,
                private helper: HelperProvider,
                private navparams: NavParams) 
    {
        this.artist = this.navparams.get('artist');
        this.name = this.navparams.get('title');
        this.image = this.navparams.get('image');
        console.log(this.artist)
    }

    ionViewDidLoad() 
    {
        console.log('ionViewDidLoad OptionsPage');

        this.api.getPlaylistById(localStorage.getItem('uid'))
        .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return { did, ...data };
        })))
        .subscribe(res => {
        this.playlist = res;
        console.log(res)
        if (res)
        this.myplaylist = this.playlist[0];
        });


        this.randomAlbum =
        AlbumsInitializer.albums[
        Randomizer.randomIntFromInterval(0, AlbumsInitializer.albums.length - 1)
        ];

        this.randomArtist =
        ArtistsInitializer.artists[
        Randomizer.randomIntFromInterval(
        0,
        ArtistsInitializer.artists.length - 1
        )
        ];
    }

    goToAlbum() 
    {
        this.navCtrl.push(AlbumPage, { album: this.randomAlbum });
    }

    goToArtist() 
    {
        this.navCtrl.push(ArtistPage, { artist: this.randomArtist });
    }

    title;
    createNew() 
    {
        let func = (data) => 
        {
            this.title = data.title;
        }

        let alert = this.helper.showAlert(func);
        alert.present();
        alert.onDidDismiss((data) => 
        {
            if (data.title !== "") 
            {
                this.addToPlaylistName(data.title);
            }
        });
    }

    temp;
    flag: Array<any> = [];

    addToPlaylistName(value) 
    {
        if (this.playlist.length === 0) 
        {
            this.temp = 
            {
                uid: localStorage.getItem('uid'),
                playlist: []
            }

            let data = 
            {
                name: value,
                songs: []
            }

            data.songs.push(localStorage.getItem('songId'));
            this.flag.push(data);
            this.temp.playlist = this.flag;
            this.api.addToPlaylist(this.temp).then(res => 
            {
                console.log(res);
                this.helper.presentToast('Song added to Playlist');
            }, err => 
            {
                this.helper.presentToast(err.message);
            });
        }
        else 
        {
            this.temp = this.myplaylist.playlist;
            let data = 
            {
                name: value,
                songs: []
            }

            data.songs.push(localStorage.getItem('songId'));
            this.temp.push(data);
            this.api.updatePlaylist(this.playlist[0].did, 
            {
                uid: localStorage.getItem('uid'),
                playlist: this.temp
            }).then(res => 
            {
                console.log(res);
                this.helper.presentToast('Song added to Playlist');
            }, err => 
            {
                this.helper.presentToast(err.message);
            });
        }
    }

    addToExistingPlaylist(item, i) {
    let x :Array<any> = this.myplaylist.playlist[i].songs.filter(data => data === localStorage.getItem('songId'));
    if(x.length > 0){
    this.helper.presentToast('Song already Exists in the playlist.');
    }
    else{
    this.myplaylist.playlist[i].songs.push(localStorage.getItem('songId'));
    this.temp = {
    uid: localStorage.getItem('uid'),
    playlist: this.myplaylist.playlist
    }
    this.api.updatePlaylist(this.myplaylist.did, this.temp)
    .then(res => {
    this.helper.presentToast('Song added to Playlist');
    }, err => {
    this.helper.presentToast(err.message);
    });
    }
    }
    }
