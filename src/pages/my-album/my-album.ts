import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { ModalService } from '../../services/ModalService';
import { HelperProvider } from '../../providers/helper/helper';
import { map } from 'rxjs/operators';
import { SongUploadPage } from '../song-upload/song-upload';

/**
 * Generated class for the MyAlbumPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-album',
  templateUrl: 'my-album.html',
})
export class MyAlbumPage implements OnInit {

  data;
  songs;
  albumsongs;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modaCtrl: ModalController,
    private api: ApiProvider, private helper: HelperProvider, private modal: ModalService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyAlbumPage');
  }

  ngOnInit(){
    this.data = this.navParams.get('data');
    if(this.data.songs.length > 0)
         this.getData();
  }

  getData(){
    this.api.getAllSongs()
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))

      .subscribe(res => {
        this.songs = res;
          if(this.data.songs.length > 0){
            this.setAlbumsongs();
          }
      })
  }

  setAlbumsongs(){
    this.albumsongs = this.songs.filter(data => this.data.songs.indexOf(data.did) > -1);
  }

  close(){
    this.modal.dismiss();
  }

  addSong(){
    const modal = this.modaCtrl.create(SongUploadPage,{
      type: 'album',
      data: this.data
    });
    modal.onDidDismiss( () =>{
      this.modal.dismiss();
    });
    modal.present();
  }

}
