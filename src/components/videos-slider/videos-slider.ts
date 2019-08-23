import { Component, Inject, forwardRef, OnInit } from '@angular/core';

import { VideoDetailsPageService } from '../../services/VideoDetailsPageService';
import { ApiProvider } from '../../providers/api/api';

import { map } from 'rxjs/operators';

@Component({
  selector: 'videos-slider',
  templateUrl: 'videos-slider.html'
})
export class VideosSliderComponent implements OnInit {
  // videos: Video[] = [];
  videos;
  constructor(
    @Inject(forwardRef(() => VideoDetailsPageService))
    public videoDetailsPageService: VideoDetailsPageService,
    private api: ApiProvider
  ) {
  }

  ngOnInit(){
    this.api.getpopularVideos()
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
      .subscribe(res =>{
        this.videos =res;
      });
  }
}
