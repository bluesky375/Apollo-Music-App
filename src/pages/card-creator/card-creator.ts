import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { CardsService } from '../../services/CardsService';
import { ModalService } from '../../services/ModalService';

@IonicPage()
@Component({
  selector: 'page-card-creator',
  templateUrl: 'card-creator.html'
})
export class CardCreatorPage {
  holder: string;
  ccNumber: string;
  expiryDate: string;
  ccv: string;

  constructor(
    public modalService: ModalService,
    private cardsService: CardsService
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CardCreatorPage');
  }

  addCard() {
    if (!this.validate()) {
      return;
    }

    this.cardsService.addNewCard(
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
