import { Component, ViewChild } from '@angular/core';
import { Platform, App, MenuController, NavController, Nav, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { GoogleAnalytics } from '@ionic-native/google-analytics';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { AuthProvider } from '../providers/auth/auth';
import { AudioService } from '../services/AudioService';
import firebase  from 'firebase';
import { HelperProvider } from '../providers/helper/helper';
import { CardSelectionPage } from '../pages/card-selection/card-selection';
import { SeeAllPage } from '../pages/see-all/see-all';
import { ApiProvider } from '../providers/api/api';
import { Subscription } from 'rxjs';
import { MyplaylistPage } from '../pages/myplaylist/myplaylist';

@Component(
{
    templateUrl: 'app.html'
})
export class MyApp 
{
    m_Platform: any;
    rootPage: any;
    user;
    @ViewChild(Nav) nav;

    constructor(platform: Platform,
                statusBar: StatusBar,
                splashScreen: SplashScreen,
                private auth: AuthProvider,
                private audio: AudioService,
                private app: App,
                private helper: HelperProvider,
                private menu: MenuController,
                private api: ApiProvider/*,
                private m_GoogleAnalytics: GoogleAnalytics*/) 
    {
        platform.ready().then(() => 
        {
            this.m_Platform = platform;
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
/*
            if( platform.is('ios') )
                statusBar.hide();
            else if( platform.is('android')) 
            {                
            }            
*/
/*
            this.m_GoogleAnalytics.startTrackerWithId('UA-141228717-1').then(() => 
            {
                this.helper.presentToast('Enjoy the redefined Music!');
                // console.log('Google analytics is ready now');
                this.m_GoogleAnalytics.trackView('test');
                // Tracker is ready
                // You can now track pages or set additional information such as AppVersion or UserId
            }).catch(e => 
            {
                //this.helper.presentToast('Google analytics failed');
                console.log('Error starting GoogleAnalytics', e);
            });        
*/
            splashScreen.hide();
        });

        this.rootPage = LoginPage;

        if(localStorage.getItem('uid'))
        {
            this.rootPage = TabsPage;
        }
        else
        {
            this.rootPage = LoginPage;
        }

        this.helper.getUid().subscribe(res =>
        {
            if(res !== '')
                this.getData(res);
        })
    }

    $ob: Subscription;

    getData(res)
    {
        this.$ob = this.api.getUserById(res).subscribe(res =>
        {
            this.user = res;
        });
    }

    logout()
    {
        this.$ob.unsubscribe();
        this.user =null;
        localStorage.removeItem('uid');
        localStorage.clear();
        this.auth.logout();
        this.audio.destroyMusicControls();
        this.app.getRootNav().setRoot(LoginPage);
        this.menu.close();
        this.menu.enable(false);
    }

    buy()
    {
        if (this.m_Platform.is('ios')) 
            return;

        this.menu.close();

        this.nav.push(CardSelectionPage);
    }

    USER;

    resetPassword()
    {
        this.menu.close();

        let func = (data) => 
        {
            firebase.auth().onAuthStateChanged( user => 
            {
                if (user)
                {
                    this.USER = user;
                    console.log(user)
                    user.updatePassword(data.password).then(res => 
                    {
                        this.helper.presentToast('Password Updated');
                    }, err =>
                    {
                        console.log('Error while updating password');
                    })
                } else 
                {
                    console.log(user)
                }
            });
        }

        let x =    this.helper.showPassword(func);
        x.present();
    }

    liked()
    {
        this.menu.close();

        this.nav.push(SeeAllPage,
        {
            type: 'liked'
        })
    }

    offline()
    {
        this.menu.close();
        this.nav.push(SeeAllPage,
        {
            type: 'offline'
        })
    }

    playlist()
    {
        this.menu.close();
        this.nav.push(MyplaylistPage)
    }
/*
    google()
    {
        this.m_GoogleAnalytics.startTrackerWithId('UA-141228717-1', 30).then(() => 
        {
            console.log('Google analytics is ready now');
            this.m_GoogleAnalytics.trackView('Screen Title').then(()=>
            {
                console.log('Success');
            }).catch((e)=>
            {
                console.log("Faild"+ e)
            })

            this.m_GoogleAnalytics.trackView('Screen Title', 'XXX').then(()=>
            {
                console.log("Success 1")
            }).catch((e)=>
            {
                console.log("Faild 1" + e)
            })

            this.m_GoogleAnalytics.trackEvent('Category', 'Action', 'Label', 30).then(()=>
            {
                console.log("Success Event");
            }).catch(()=>
            {
                console.log("Faild")
            })

            this.m_GoogleAnalytics.trackMetric(5).then(()=>
            {
                console.log("Key Matrics run successfully");
            }).catch((e)=>
            {
                console.log("Faild" + e)
            })

            this.m_GoogleAnalytics.trackTiming('Category', 2, 'Variable', 'Label').then(()=>
            {
                console.log("TrackTiming success")
            }).catch((e)=>
            {
                console.log("Faild"+ e)
            })

            // Tracker is ready
            // You can now track pages or set additional information such as AppVersion or UserId
            this.m_GoogleAnalytics.debugMode();
            this.m_GoogleAnalytics.setAllowIDFACollection(true);
        }).catch(e => console.log('Error starting GoogleAnalytics', e));
    }
*/    
}
