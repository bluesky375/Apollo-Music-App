import { Component, forwardRef, Inject } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { ModalService } from '../../services/ModalService';

import { RecentSearch } from '../../data/RecentSearch';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { SongsInitializer } from '../../data/Initializers/SongsInitializer';
import { AlbumsInitializer } from '../../data/Initializers/AlbumsInitializer';
import { ArtistsInitializer } from '../../data/Initializers/ArtistsInitializer';
import { PlaylistsInitializer } from '../../data/Initializers/PlaylistsInitializer';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';
import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';
import { ArtistPage } from '../artist/artist';

@IonicPage()
@Component(
{
    selector: 'page-search',
    templateUrl: 'search.html'
})
export class SearchPage 
{
    recentSearches: RecentSearch[] = [];

    users: Array<any>;
    songs: Array<any>;
    resultSongs: Array<any>;
    resultUser: Array<any>;
    showSong= false;
    showUser= false;

    constructor(public modalService: ModalService, 
                private api: ApiProvider,
                @Inject(forwardRef(() => MusicPlayerPageService))
                public musicPlayerPageService: MusicPlayerPageService, 
                private nav: NavController) 
    {

    }

    ionViewDidLoad() 
    {
        console.log('ionViewDidLoad SearchPage');

        this.getData();

        var songs = Shuffler.shuffle(SongsInitializer.songs.slice()).splice(0, 3);
        songs.forEach(song => 
        {
            this.recentSearches.push(new RecentSearch(song.name));
        });

        var albums = Shuffler.shuffle(AlbumsInitializer.albums.slice()).splice(0, 3);
        albums.forEach(album => 
        {
            this.recentSearches.push(new RecentSearch(album.name));
        });

        var artists = Shuffler.shuffle(ArtistsInitializer.artists.slice()).splice(0, 3);
        artists.forEach(artist => 
        {
            this.recentSearches.push(new RecentSearch(artist.name));
        });

        var playlists = Shuffler.shuffle(PlaylistsInitializer.playlists.slice()).splice(0, 3);
        playlists.forEach(playlist => 
        {
            this.recentSearches.push(new RecentSearch(playlist.name));
        });

        this.recentSearches = this.recentSearches.sort(function(a, b) 
        {
            return a.hoursAgo - b.hoursAgo;
        });
    }

    remove(recentSearch: RecentSearch) 
    {
        var index = this.recentSearches.findIndex(function(otherRecentSearch) 
        {
            return otherRecentSearch.name === recentSearch.name;
        });

        if (index >= 0) 
        {
            this.recentSearches.splice(index, 1);
        }
    }

    getData()
    {
        this.api.getAllUsersData().pipe(map(actions => actions.map(a =>
        {
            const data =a.payload.doc.data();
            const did = a.payload.doc.id;
            return {did, ...data};
        }))).subscribe(res =>
        {
            this.users =res;
            console.log(res)
        });

        this.api.getAllSongs().pipe(map(actions => actions.map(a=>
        {
            const data = a.payload.doc.data();
            const did = a.payload.doc.id;
            return {did, ...data};
        }))).subscribe( res => 
        {
            this.songs = res;
        });    
    }

    searchText(val: string)
    {
        if(val.length >3)
        {
            this.resultSongs = this.songs.filter(data => data.title.toLowerCase().indexOf(val.toLowerCase()) !== -1 );
            this.resultUser = this.users.filter(data => data.username.toLowerCase().indexOf(val.toLowerCase()) !== -1 && data.isVerified === true);
            if(this.resultSongs.length !== 0 )
            {
                this.showSong = true;
            }
            else
            {
                this.showSong = false;
            }

            if(this.resultUser.length !== 0 )
            {
                this.showUser = true;
            }
            else
            {
                this.showUser = false;
            }
        }
        else
        {
            this.showSong = false;
            this.showUser = false;
        }
    }

    UserProfile(item)
    {
        console.log(item)
        this.modalService.dismiss();
        this.nav.push(ArtistPage, {data: item});
    }
}
