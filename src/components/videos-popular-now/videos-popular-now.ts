import { Component, Inject, forwardRef } from '@angular/core';

import { VideoDetailsPageService } from '../../services/VideoDetailsPageService';

import { Video } from '../../data/Video';
import { VideoPair } from '../../data/VideoPair';

import { VideosInitializer } from '../../data/Initializers/VideosInitializer';
import { Shuffler } from '../../data/Helpers/Shuffler';

@Component({
  selector: 'videos-popular-now',
  templateUrl: 'videos-popular-now.html'
})
export class VideosPopularNowComponent {
  videos: Video[] = [];
  videoPairs: VideoPair[] = [];

  constructor(
    @Inject(forwardRef(() => VideoDetailsPageService))
    public videoDetailsPageService: VideoDetailsPageService
  ) {
    console.log('Hello VideosPopularNowComponent Component');

    this.videos = Shuffler.shuffle(VideosInitializer.videos.slice()).concat(
      Shuffler.shuffle(VideosInitializer.videos.slice())
    );

    this.initialiseVideoPairs();
  }

  initialiseVideoPairs() {
    var popularVideos = Shuffler.shuffle(VideosInitializer.videos.slice());

    for (var i = 0; i < popularVideos.length; i++) {
      var videoPair = new VideoPair();

      var video1 = popularVideos[i];
      videoPair.video1 = video1;

      i++;
      if (i < popularVideos.length) {
        var video2 = popularVideos[i];
        videoPair.video2 = video2;
      }

      this.videoPairs.push(videoPair);
    }
  }
}
