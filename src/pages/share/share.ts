import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { ModalService } from '../../services/ModalService';
import { AudioService } from '../../services/AudioService';
import { SocialSharing } from '@ionic-native/social-sharing';
import { HelperProvider } from '../../providers/helper/helper';

@IonicPage()
@Component(
{
    selector: 'page-share',
    templateUrl: 'share.html'
})
export class SharePage 
{
    constructor(public modalService: ModalService,
                public audioService: AudioService,
                private socialSharing: SocialSharing,
                private helper: HelperProvider) 
    {

    }

    ionViewDidLoad() 
    {
        console.log('ionViewDidLoad SharePage');
    }

    whatsapp()
    {
        // window.open('https://play.google.com/store/apps/details?id=awesong.musicapp1', '_system', 'location=yes');
        let strText = 'Listen to '+this.audioService.playingTrack().title + ' Song.';
        this.socialSharing.shareViaWhatsApp('Listen to '+this.audioService.playingTrack().title + ' Song.', undefined, 
                'https://play.google.com/store/apps/details?id=awesong.musicapp1');
    }

    message()
    {
        let func = (res) =>
        {
            this.socialSharing.shareViaSMS('Listen to '+this.audioService.playingTrack().title + ' Song.', res.data);
        };
        let alert = this.helper.showAlertGeneric('Share via SMS','Please provide Phone no.','Enter Phone no.','send',func);
        alert.present();
    }

    facebook()
    {
        this.socialSharing.shareViaFacebookWithPasteMessageHint('Listen to '+this.audioService.playingTrack().title + ' Song.', 
                this.audioService.playingTrack().art , 'https://play.google.com/store/apps/details?id=awesong.musicapp1', 'Listen to '+this.audioService.playingTrack().title + ' Song.')
    }

    twitter()
    {
        this.socialSharing.shareViaTwitter('Listen to '+this.audioService.playingTrack().title + ' Song.', 
                this.audioService.playingTrack().art , 'https://play.google.com/store/apps/details?id=awesong.musicapp1',)
    }

    email()
    {
        this.socialSharing.shareViaEmail('Listen to '+this.audioService.playingTrack().title + ' Song.' , 
                'Listen to this song.',['testsong10@gmail.com'],undefined,undefined,[this.audioService.playingTrack().art])
    }
}
