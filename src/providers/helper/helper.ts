import { Injectable, forwardRef, Inject } from '@angular/core';
import { ActionSheetController } from 'ionic-angular';
import { ToastController, LoadingController } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertController } from 'ionic-angular';
import { AudioService } from '../../services/AudioService';
import { MusicappServiceProvider } from '../musicapp-service/musicapp-service';
import { NativeStorage } from '@ionic-native/native-storage';

/*
Generated class for the HelperProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/
@Injectable()
export class HelperProvider 
{
    private status: BehaviorSubject<string>;
    private song: BehaviorSubject<boolean>;
    private offlineData: BehaviorSubject<Array<any>>;
    private accountType: BehaviorSubject<string>;
    private uid: BehaviorSubject<string>;

    constructor(private actionSheetCtrl: ActionSheetController,
                private toastCtrl: ToastController, 
                private loadingCtrl: LoadingController, 
                private http: Http, 
                public alertCtrl: AlertController,
                private music: AudioService, 
                private native: NativeStorage) 
    {
        this.status = new BehaviorSubject<string>('inactive');
        this.song = new BehaviorSubject<boolean>(false);
        this.offlineData = new BehaviorSubject<Array<any>>([]);
        if(localStorage.getItem('accountType'))
            this.accountType = new BehaviorSubject<string>(localStorage.getItem('accountType'));
        else  
            this.accountType = new BehaviorSubject<string>('');
        
        if(localStorage.getItem('uid'))
            this.uid = new BehaviorSubject<string>(localStorage.getItem('uid'));
        else  
            this.uid = new BehaviorSubject<string>('');
    }

    getUid()
    {
        return this.uid.asObservable();
    }

    setUid(val)
    {
        this.uid.next(val);
    }

    getAccountType()
    {
        return this.accountType.asObservable();
    }

    setAccountType(val)
    {
        this.accountType.next(val);
    }

    public getOfflineData(): Observable<Array<any>> 
    {
        return this.offlineData.asObservable();
    }

    public setOfflineData(newValue): void 
    {
        this.offlineData.next(newValue);
    }

    public getTheStatus(): Observable<string> 
    {
        return this.status.asObservable();
    }

    public setTheStatus(newValue: string): void 
    {
        this.status.next(newValue);
    }

    public getTheSong(): Observable<boolean>
    {
        return this.song.asObservable();
    }

    public setTheSong(newValue: boolean): void
    {
        this.song.next(newValue)
    }

    presentActionSheet(title, n1, n2, myfunc, myfunc1) 
    {
        let actionSheet = this.actionSheetCtrl.create(
        {
            title: title,
            buttons: 
            [
                { text: n1, role: 'destructive', cssClass: 'actions-sheet', handler: myfunc },
                { text: n2, role: 'destructive', cssClass: 'actions-sheet', handler: myfunc1 },
                { text: 'Cancel', role: 'cancel', cssClass: 'action-sheet-cancel', handler: () => {} } 
            ]
        });
        
        actionSheet.present();
    }

    presentToast(msg) 
    {
        let toast = this.toastCtrl.create(
        {
            message: msg,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    }

    loading;

    presentLoadingDefault() 
    {
        this.loading = this.loadingCtrl.create(
        {
            content: 'Please wait...'
        });

        this.loading.present();
    }

    closeLoading() 
    {
        this.loading.dismiss();
    }

    getCountries() 
    {
        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: myHeaders });

        return this.http.get('./assets/data/country.json', options).pipe(map((this.extractData)))
    }

    extractData(res) 
    {
        let body = res.json();
        return body;
    }

    showAlert(myfunc) 
    {
        const alert = this.alertCtrl.create(
        {
            title: 'Custom Playlist',
            subTitle: 'Enter a Name.',
            inputs: 
            [
                { name: 'title', placeholder: 'Name' },
            ],
            buttons: 
            [
                { text: 'Cancel', handler: data => { console.log('Cancel clicked'); }},
                { text: 'Save', handler: myfunc }
            ]
        });

        return alert;
    }

    showPassword(myfunc) 
    {
        const alert = this.alertCtrl.create(
        {
            title: 'Change Password',
            subTitle: 'Enter new Password.',
            inputs: 
            [
                { name: 'password', placeholder: 'Password', type: 'password' },
            ],
            buttons: 
            [
                { text: 'Cancel', handler: data => { console.log('Cancel clicked'); } },
                { text: 'Save', handler: myfunc }
            ]
        });

        return alert;
    }

    showAlertGeneric(t,s,p,btn,myfunc) 
    {
        const alert = this.alertCtrl.create(
        {
            title: t,
            subTitle: s,
            inputs: 
            [
                { name: 'data', placeholder: p, type: 'text' },
            ],
            buttons: 
            [
                { text: 'Cancel', handler: data => { console.log('Cancel clicked'); }},
                { text: btn, handler: myfunc }
            ]
        });

        return alert;
    }

    stopMusic()
    {
        if(this.music.playingTrack())
        {
            this.music.stop();
            this.music.pause();
            this.music.destroyMusicControls();
            alert('coming')
        }
    }
}
