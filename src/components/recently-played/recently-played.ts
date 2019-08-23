import { Component, Inject, forwardRef } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';

import { Song } from '../../data/Song';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { SongsInitializer } from '../../data/Initializers/SongsInitializer';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';
import { NavController } from 'ionic-angular';
import { SeeAllPage } from '../../pages/see-all/see-all';

@Component(
{
    selector: 'recently-played',
    templateUrl: 'recently-played.html'
})
export class RecentlyPlayedComponent 
{
    recentlyPlayedSongs: Song[] = [];
    recentlySongs;
    songs;
    isLiked=[];
    likedsongs;
    exist = false;
    m_bAlive: boolean = true;   
    recent: Array<any> = []; 
    m_nSlidesPerView: number;

    constructor(@Inject(forwardRef(() => MusicPlayerPageService)) public musicPlayerPageService: MusicPlayerPageService,
                private api: ApiProvider, private navCtrl: NavController,
                private httpClient: HttpClient) 
    {
        this.m_nSlidesPerView = Math.floor(document.documentElement.clientWidth / 200 + 0.5);
        console.log('Hello RecentlyPlayedComponent Component');

        //this.recentlyPlayedSongs = Shuffler.shuffle(SongsInitializer.songs.slice()).slice(0, 6);

        this.getData();
    }

    getData()
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
            this.api.getRecentlyPlayed2(localStorage.getItem('uid')).pipe(map(actions => actions.map(a =>
            {
                const data = a.payload.doc.data();
                const did = a.payload.doc.id;
                return {did, ...data};
            }))).subscribe(res =>
            {
                this.recentlySongs = res;

                this.setRecentSongs();

                this.httpClient.get(this.recentlySongs[0].songs[0].imageURL).subscribe(result => 
                {
                    console.log("Songs living");   
                }, error => 
                {
                    if( error.status >= 400 )
                        this.m_bAlive = false;  
                });    
            })
        })
    }

    checkCurrentSongLike()
    {
        if(this.likedsongs.length > 0 )
        {
            let x: Array<string> = this.likedsongs[0].songs;
            for(let i = 0; i< this.recent.length; i++)
            {
                if(x.indexOf(this.recent[i].did) > -1 )
                {
                    this.isLiked[i] = true;
                }
                else
                {
                    this.isLiked[i] = false;
                }
            }
            this.exist = true;
        }
        else
        {
            this.exist = false;
        }
    }

    setRecentSongs()
    {
        if(this.recentlySongs[0].songs.length !== 0)
        {
            this.recent = [];

            let i, item, nLength;
            for( i = 0; i < this.recentlySongs[0].songs.length; i++ )
            {
                item = this.songs.filter( data => data.did === this.recentlySongs[0].songs[i]);
                this.recent.push(item[0]);
            }

            // this.recent = this.songs.filter( data => this.recentlySongs[0].songs.indexOf(data.did)> -1);
            
            this.api.getLikedSongs(localStorage.getItem('uid')).pipe(map(actions => actions.map(a =>
            {
                const data = a.payload.doc.data();
                const did = a.payload.doc.id;
                return {did, ...data};
            }))).subscribe(res =>
            {
                this.likedsongs = res;
                for(let i = 0; i< 10; i++)
                {
                    this.isLiked.push(false);
                }
                this.checkCurrentSongLike();
            });
        }
    }    

    // setRecentSongs()
    // {
    //     if(this.recentlySongs.length !== 0)
    //     {
    //         this.recent = this.songs.filter( data => this.recentlySongs[0].songs.indexOf(data.did)> -1);
    //         this.recent = this.songs.filter( data => this.recentlySongs[0].songs.indexOf(data.did)> -1);
            
    //         console.log(this.recent);
    //         this.api.getLikedSongs(localStorage.getItem('uid')).pipe(map(actions => actions.map(a =>
    //         {
    //             const data = a.payload.doc.data();
    //             const did = a.payload.doc.id;
    //             return {did, ...data};
    //         }))).subscribe(res =>
    //         {
    //             this.likedsongs = res;
    //             for(let i = 0; i< this.recent.length; i++)
    //             {
    //                 this.isLiked.push(false);
    //             }
    //             this.checkCurrentSongLike();
    //         });
    //     }
    // }

    likeSong(val,i)
    {
        if(val === 'like')
        {
            if(this.exist)
            {
                let x: Array<string> = this.likedsongs[0].songs;
                x.push(this.recent[i].did);
                let data = 
                {
                    uid: localStorage.getItem('uid'),
                    songs: x
                };

                this.api.updateLikedSongs(this.likedsongs[0].did, data);
            }
            else if(!this.exist)
            {
                let x = [];
                x.push(this.recent[i].did);
                let data = 
                {
                    uid: localStorage.getItem('uid'),
                    songs: x
                };
                this.api.addLikedsong(data);
            }
        }
        else if(val === 'dislike')
        {
            let x: Array<string> = this.likedsongs[0].songs;
            x.splice(x.indexOf(this.recent[i].did), 1);
            let data = 
            {
                uid: localStorage.getItem('uid'),
                songs: x
            };

            this.api.updateLikedSongs(this.likedsongs[0].did, data).then(res =>
            {
                this.isLiked[i] = false;
            }, err =>
            {
                console.log(err);
            })
        }
    }

    seeall()
    {
        this.navCtrl.push(SeeAllPage, { data: '', type: 'recent' })
    }
}
