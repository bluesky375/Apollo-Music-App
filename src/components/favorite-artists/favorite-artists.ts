import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ArtistPage } from '../../pages/artist/artist';

import { Artist } from '../../data/Artist';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { ArtistsInitializer } from '../../data/Initializers/ArtistsInitializer';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';

@Component({
  selector: 'favorite-artists',
  templateUrl: 'favorite-artists.html'
})
export class FavoriteArtistsComponent implements OnInit{
  favoriteArtists: Array<any> = [];

  constructor(private navCtrl: NavController, private api: ApiProvider) {
    console.log('Hello FavoriteArtistsComponent Component');
    // this.favoriteArtists = Shuffler.shuffle(ArtistsInitializer.artists);
  }

  ngOnInit(){
    this.getData();
  }

  artistId;
  artists;

  getData(){
    this.api.getFollowings(localStorage.getItem('uid'))
      .pipe(map(actions => actions.map(a =>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
        .subscribe(res =>{
          this.artistId = res;
          this.api.getAllUsersData()
          .pipe(map(actions => actions.map(a =>{
            const data = a.payload.doc.data();
            const did = a.payload.doc.id;
            return {did, ...data};
          })))

            .subscribe(resp =>{
              this.artists = resp;
              this.setArtist();
            })

        })
  }

  setArtist(){
    if(this.artistId.length > 0){
      this.favoriteArtists = this.artists.filter(data => this.artistId[0].users.indexOf(data.did) > -1);
      console.log(this.favoriteArtists);
    }
  }

  goToArtist(artist) {
    this.navCtrl.push(ArtistPage, { data: artist });
  }
}
