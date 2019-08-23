import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { VideoService } from '../../services/VideoService';

@Component({
  selector: 'mini-video-player',
  templateUrl: 'mini-video-player.html'
})
export class MiniVideoPlayerComponent {
  constructor(
    public videoService: VideoService,
    public sanitizer: DomSanitizer
  ) {
    console.log('Hello MiniVideoPlayerComponent Component');
  }
}
