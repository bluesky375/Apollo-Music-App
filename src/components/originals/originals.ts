import { Component, OnInit, forwardRef, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { ApiProvider } from '../../providers/api/api';
import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';
import { SeeAllPage } from '../../pages/see-all/see-all';
import { NavController } from 'ionic-angular';


/**
 * Generated class for the OriginalsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'originals',
  templateUrl: 'originals.html'
})
export class OriginalsComponent implements OnInit {

  text: string;
  songs;
    m_bAlive: boolean = true;  
  m_nSlidesPerView: number;

  constructor(private api: ApiProvider, private nav: NavController,
    @Inject(forwardRef(() => MusicPlayerPageService)) public musicPlayerPageService: MusicPlayerPageService,
                private httpClient: HttpClient) {
    this.m_nSlidesPerView = Math.floor(document.documentElement.clientWidth / 200 + 0.5);
    console.log('Hello OriginalsComponent Component');
    this.text = 'Hello World';
  }

  ngOnInit(){
    this.api.getOriginals()
    .pipe(map(actions => actions.map(a => {
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
    this.nav.push(SeeAllPage,{
      data: '',
      type: 'originals'
    })
  }


}
