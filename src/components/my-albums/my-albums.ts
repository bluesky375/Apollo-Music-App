import { Component, OnInit } from '@angular/core';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';
import { ModalController } from 'ionic-angular';
import { MyAlbumPage } from '../../pages/my-album/my-album';

/**
 * Generated class for the MyAlbumsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'my-albums',
  templateUrl: 'my-albums.html'
})
export class MyAlbumsComponent implements OnInit {

  text: string;
  albums: Array<any>;

  constructor(private api: ApiProvider, private modal: ModalController) {
    console.log('Hello MyAlbumsComponent Component');
    this.text = 'Hello World';
  }

  ngOnInit(){
    this.getData();
  }

  getData(){
    this.api.getAllAlbumsById(localStorage.getItem('uid'))
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))

        .subscribe(res =>{
          this.albums = res;

        })
  }

  openSeeAllPage(item,i){
    const modal = this.modal.create(MyAlbumPage,{
      data: item
    });
    modal.present();
  }

}
