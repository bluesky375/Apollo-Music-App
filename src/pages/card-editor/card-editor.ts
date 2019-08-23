import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

import { CardsService } from '../../services/CardsService';
import { ModalService } from '../../services/ModalService';

import { Card } from '../../data/Card';

@IonicPage()
@Component({
  selector: 'page-card-editor',
  templateUrl: 'card-editor.html'
})
export class CardEditorPage {
  cardId: string;
  cardType: string;
  holder: string;
  ccNumber: string;
  expiryDate: string;
  ccv: string;

  constructor(
    private navParams: NavParams,
    public modalService: ModalService,
    private cardsService: CardsService
  ) {
    var card = <Card>this.navParams.get('card');

    this.cardId = card.id;
    this.cardType = card.type;
    this.holder = card.holder;
    this.ccNumber = '**** **** **** ' + card.lastDigits;
    this.expiryDate = card.expiryMonth + ' / ' + card.expiryYear;
    this.ccv = card.CCV;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CardEditorPage');
  }

  editCard() {
    if (!this.validate()) {
      return;
    }

    this.cardsService.editExistingCard(
      this.cardId,
      this.ccNumber,
      this.holder,
      this.expiryDate,
      this.ccv
    );

    this.modalService.dismiss();
  }

  validate() {
    if (!this.ccNumber) {
      return false;
    }

    var tempccNumber = this.ccNumber.replace(/\s/g, '');
    if (tempccNumber.length != 16) {
      return false;
    }

    if (!this.expiryDate) {
      return false;
    }

    var tempExpiryDate = this.expiryDate.replace(/\s/g, '');
    if (tempExpiryDate.length != 5) {
      return false;
    }

    if (!this.holder) {
      return false;
    }

    if (!this.ccv || this.ccv.length != 3) {
      return false;
    }

    return true;
  }
}
