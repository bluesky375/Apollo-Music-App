import { Component, OnInit, forwardRef, Inject } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';
import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';

@Component({
  selector: 'library-favorites',
  templateUrl: 'library-favorites.html'
})
export class LibraryFavoritesComponent implements OnInit {
  songPairs: Array<any>;

  songs: Array<any>;
  liked: Array<any>;


  constructor(private navCtrl: NavController, private api: ApiProvider,
    @Inject(forwardRef(() => MusicPlayerPageService))
    public musicPlayerPageService: MusicPlayerPageService) {
    console.log('Hello LibraryFavoritesComponent Component');
  }

  ngOnInit(){
    this.getData();
  }

  getData(){
    this.api.getAllSongs()
    .pipe(map(actions => actions.map(a => {
      const data = a.payload.doc.data();
      const did = a.payload.doc.id;
      return {did, ...data};
    })))

    .subscribe(res =>{
      this.songs = res;
      this.api.getLikedSongs(localStorage.getItem('uid'))
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))

      .subscribe(resp =>{
        this.liked = resp;
        console.log(resp);
        this.getPlayingSongs();
      });
    });
    
  }

  getPlayingSongs(){
    if(this.liked.length !== 0){
      this.songPairs = this.songs.filter( data => this.liked[0].songs.indexOf(data.did)> -1);
      console.log(this.songPairs)
    }
  }

}
