import { Component, Input, Inject, forwardRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { PlaylistPage } from '../../pages/playlist/playlist';

import { Playlist } from '../../data/Playlist';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { PlaylistsInitializer } from '../../data/Initializers/PlaylistsInitializer';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';
import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';
import { SeeAllPage } from '../../pages/see-all/see-all';

@Component(
{
    selector: 'best-playlists',
    templateUrl: 'best-playlists.html'
})
export class BestPlaylistsComponent 
{
    @Input() isLibrary;
    songs: Array<any>;
    myPlaylist;
    playlist;
    images: Array<any>=[];
    m_bAlive: boolean = true;  
    m_nSlidesPerView: number;

    constructor(private navCtrl: NavController, 
                private api: ApiProvider,
                @Inject(forwardRef(() => MusicPlayerPageService))
                public musicPlayerPageService: MusicPlayerPageService,
                private httpClient: HttpClient) 
    {
        this.m_nSlidesPerView = Math.floor(document.documentElement.clientWidth / 200 + 0.5);
        console.log('Hello BestPlaylistsComponent Component');

        this.getData();
    }

    goToPlaylist(playlist: Playlist) 
    {
        this.navCtrl.push(PlaylistPage, { playlist: playlist });
    }

    getData()
    {
        this.api.getAllSongs().pipe(map(actions => actions.map(a => 
        {
            const data =a.payload.doc.data();
            const did = a.payload.doc.id;
            return {did, ...data};
        }))).subscribe(res =>
        {
            this.songs = res;
            this.api.getPlaylistById(localStorage.getItem('uid')).pipe(map(actions => actions.map(a => 
            {
                const data =a.payload.doc.data();
                const did = a.payload.doc.id;
                return {did, ...data};
            }))).subscribe(resp =>
            {
                this.myPlaylist = resp;
                console.log(resp)
                if(this.myPlaylist.length > 0)
                {
                    this.playlist = this.myPlaylist[0];

                    if(this.playlist.playlist.length > 0)
                    {
                        this.images = [];
                        
                        let i;
                        for( i = 0; i < this.playlist.playlist.length; i++ )
                        {
                            let x = this.songs.filter(data => data.did === this.playlist.playlist[i].songs[0]);
                            if(x.length > 0)
                                this.images.push(x[0].imageURL);
                            else
                                this.m_bAlive = false; 

                            if( i == 0 )
                            {
                                this.httpClient.get(x[0].imageURL).subscribe(result => 
                                {
                                    console.log("Songs living");   
                                }, error => 
                                {
                                    if( error.status >= 400 || error.status == undefined )
                                        this.m_bAlive = false;  
                                });                                    
                            }
                        }
                    }
                }
            });
        });
    }

    openSeeAllPage(item,i){
    this.navCtrl.push(SeeAllPage, {
    data: item,
    type: 'playlist',
    did: this.myPlaylist[0],
    index: i
    });
    }
}
