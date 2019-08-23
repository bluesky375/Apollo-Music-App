import { Component } from '@angular/core';
import {
  IonicPage,
  NavParams,
  ModalController
} from 'ionic-angular';

import { CardsService } from '../../services/CardsService';
import { ModalService } from '../../services/ModalService';

import { CardSelectionPage } from '../card-selection/card-selection';

import { Purchase } from '../../data/Purchase';

@IonicPage()
@Component({
  selector: 'page-purchases',
  templateUrl: 'purchases.html'
})
export class PurchasesPage {
  purchase: Purchase;
  cardType: string;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    public modalService: ModalService,
    private cardsService: CardsService
  ) {
    this.purchase = this.navParams.get('purchase');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PurchasesPage');
    this.cardType = this.cardsService.currentCard.type;
  }

  openCardSelection() {
    const modal = this.modalCtrl.create(CardSelectionPage, {
      purchase: this.purchase
    });

    modal.onDidDismiss(() => {
      this.cardType = this.cardsService.currentCard.type;
    });

    modal.present();
  }
}
