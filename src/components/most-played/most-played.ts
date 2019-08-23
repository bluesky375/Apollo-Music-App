import { Component, Inject, forwardRef, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';

import { Song } from '../../data/Song';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { SongsInitializer } from '../../data/Initializers/SongsInitializer';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';
import { NavController } from 'ionic-angular';
import { SeeAllPage } from '../../pages/see-all/see-all';

@Component({
  selector: 'most-played',
  templateUrl: 'most-played.html'
})
export class MostPlayedComponent implements OnInit {
  mostPlayedSongs: Song[] = [];
  songs;
  m_bAlive: boolean = true;
  m_nSlidesPerView: number;

  constructor(
    @Inject(forwardRef(() => MusicPlayerPageService))
    public musicPlayerPageService: MusicPlayerPageService, private api: ApiProvider, private nav: NavController,
                private httpClient: HttpClient) {
    this.m_nSlidesPerView = Math.floor(document.documentElement.clientWidth / 200 + 0.5);
    console.log('Hello MostPlayedComponent Component');
    this.mostPlayedSongs = Shuffler.shuffle(SongsInitializer.songs.slice());
  }

  ngOnInit(){
    this.getData();
  }

  getData(){
    this.api.getMostPlayedSongs()
      .pipe(map(actions => actions.map(a =>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
        .subscribe(res =>{
          this.songs = res;

            this.httpClient.get(this.songs[0].imageURL).subscribe(result => 
            {
                console.log("Songs living");   
            }, error => 
            {
                if( error.status >= 400 || error.status == undefined )
                    this.m_bAlive = false;  
            });

        });
  }

  seeall(){
    this.nav.push(SeeAllPage, {
      data: '',
      type: 'most'
    })
  }
}
