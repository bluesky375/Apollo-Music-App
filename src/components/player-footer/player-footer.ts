import { Component, Inject, forwardRef, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';

import { AudioService } from '../../services/AudioService';
import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';

@Component(
{
    selector: 'player-footer',
    templateUrl: 'player-footer.html'
})
export class PlayerFooterComponent implements OnInit  
{
    constructor(public platform: Platform,
                @Inject(forwardRef(() => AudioService))
                public audioService: AudioService,
                @Inject(forwardRef(() => MusicPlayerPageService))
                public musicPlayerPageService: MusicPlayerPageService) 
    {
        console.log('Hello PlayerFooterComponent Component');

    }

    ngOnInit()
    {
    }

    OnPlayPause()
    {
        if( this.musicPlayerPageService.m_bAdvertisePlaying )
            return;
            
        if( this.audioService.playingTrack().isPlaying )
            this.audioService.pause();
        else 
            this.audioService.play();         
    }

    OnPlayPrevious() 
    {
        if(this.audioService.durationText().toString().indexOf('NaN') > -1)
            return;

        if( this.musicPlayerPageService.m_bAdvertisePlaying )
            return;

        this.musicPlayerPageService.PlayPrevious();
        this.musicPlayerPageService.setUpNextSongs();
    }

    OnPlayNext() 
    {
        if(this.audioService.durationText().toString().indexOf('NaN') > -1)
            return;

        if( this.musicPlayerPageService.m_bAdvertisePlaying )
            return;

        this.musicPlayerPageService.PlayNext();
        this.musicPlayerPageService.setUpNextSongs();
    }  
}
