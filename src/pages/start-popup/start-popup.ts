import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalService } from '../../services/ModalService';

/**
 * Generated class for the StartPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-start-popup',
  templateUrl: 'start-popup.html',
})
export class StartPopupPage {

  image;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modal: ModalService) {
    this.image = this.navParams.get('data');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartPopupPage');
  }

}
