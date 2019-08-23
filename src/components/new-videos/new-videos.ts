import { Component, Inject, forwardRef, OnInit } from '@angular/core';

import { VideoDetailsPageService } from '../../services/VideoDetailsPageService';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';
import { NavController } from 'ionic-angular';
import { SeeAllPage } from '../../pages/see-all/see-all';


@Component({
  selector: 'new-videos',
  templateUrl: 'new-videos.html'
})
export class NewVideosComponent implements OnInit {
  newVideos;

  constructor(
    @Inject(forwardRef(() => VideoDetailsPageService))
    public videoDetailsPageService: VideoDetailsPageService,
    private api: ApiProvider,
    private nav: NavController
  ) {
    console.log('Hello NewVideosComponent Component');
   
  }

  ngOnInit(){
    this.api.getNewVideos()
      .pipe(map(actions => actions.map(a =>{
        const data =a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
        .subscribe(res =>{
          this.newVideos = res;
        })
  }

  seeall(){
    this.nav.push(SeeAllPage, {
      data: '',
      type: 'videos1'
    })
  }
}
