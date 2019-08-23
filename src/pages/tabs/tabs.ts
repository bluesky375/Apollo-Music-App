import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { VideosPage } from '../videos/videos';
import { LibraryPage } from '../library/library';
import { FcmProvider } from '../../providers/fcm/fcm';
import { ToastController, Platform, App } from 'ionic-angular';
import { tap } from 'rxjs/operators';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = HomePage;
  tab2Root = VideosPage;
  tab3Root = LibraryPage;

  loadAPI: Promise<any>;

  constructor(fcm: FcmProvider, toastCtrl: ToastController, platform: Platform, private auth: AuthProvider, private app: App) {
    localStorage.setItem('adStatus','inactive');
    this.loadAPI = new Promise((resolve) => {
      this.loadScript();
      resolve(true);
  });
  platform.ready().then(() => {

    // Get a FCM token
    fcm.getToken(localStorage.getItem('uid'))

    // Listen to incoming messages
    fcm.listenToNotifications().pipe(
      tap(msg => {
        // show a toast
        const toast = toastCtrl.create({
          message: msg.body,
          duration: 1000
        });
        toast.present();
      })
    )
    .subscribe()
  });
  }

  public loadScript() {        
    var isFound = false;
    var scripts = document.getElementsByTagName("script")
    for (var i = 0; i < scripts.length; ++i) {
        if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("loader")) {
            isFound = true;
        }
    }

    if (!isFound) {
        var dynamicScripts = ["assets/js/framework7.min.js","assets/js/script.js"];

        for (var i = 0; i < dynamicScripts .length; i++) {
            let node = document.createElement('script');
            node.src = dynamicScripts [i];
            node.type = 'text/javascript';
            node.async = false;
            node.charset = 'utf-8';
            document.getElementsByTagName('head')[0].appendChild(node);
        }

    }
}
}
