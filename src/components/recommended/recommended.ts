import { Component, Inject, forwardRef, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';

import { PlaylistPage } from '../../pages/playlist/playlist';

import { Song } from '../../data/Song';
import { Playlist } from '../../data/Playlist';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { SongsInitializer } from '../../data/Initializers/SongsInitializer';
import { PlaylistsInitializer } from '../../data/Initializers/PlaylistsInitializer';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';
import { SeeAllPage } from '../../pages/see-all/see-all';

@Component({
  selector: 'recommended',
  templateUrl: 'recommended.html'
})
export class RecommendedComponent implements OnInit{
  recommendedSongs: Song[] = [];
  recommendedPlaylists: Playlist[] = [];
  songs;

  constructor(
    private navCtrl: NavController,
    @Inject(forwardRef(() => MusicPlayerPageService)) public musicPlayerPageService: MusicPlayerPageService,
    private api: ApiProvider, private nav: NavController
  ) {
    console.log('Hello RecommendedComponent Component');

    this.recommendedSongs = Shuffler.shuffle(SongsInitializer.songs.slice());
    this.recommendedPlaylists = Shuffler.shuffle(
      PlaylistsInitializer.playlists.slice()
    );


  }

  ngOnInit(){
    this.getData();
  }

  goToPlaylist(playlist: Playlist) {
    this.navCtrl.push(PlaylistPage, { playlist: playlist });
  }

  getData(){
    this.api.getNewSongs()
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
        .subscribe(res =>{
          this.songs = res;
          console.log(this.songs)
        });
  }

  seeall(){
    this.nav.push(SeeAllPage,{
      data: '',
      type: 'foryou'
    })
  }
}
