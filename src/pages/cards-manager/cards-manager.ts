import { Component } from '@angular/core';
import {
  IonicPage,
  ModalController,
  AlertController
} from 'ionic-angular';

import { CardsService } from '../../services/CardsService';
import { ModalService } from '../../services/ModalService';

import { CardCreatorPage } from '../card-creator/card-creator';
import { CardEditorPage } from '../card-editor/card-editor';

import { Card } from '../../data/Card';

@IonicPage()
@Component({
  selector: 'page-cards-manager',
  templateUrl: 'cards-manager.html'
})
export class CardsManagerPage {
  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public modalService: ModalService,
    private cardsService: CardsService
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CardsManagerPage');

    var cardElements = document.getElementsByClassName('unique-card2');
    this.cardsService.setCardTypes(cardElements);
  }

  addNewCard() {
    const modal = this.modalCtrl.create(CardCreatorPage);
    modal.present();
  }

  editingExistingCard(card: Card) {
    const modal = this.modalCtrl.create(CardEditorPage, { card: card });
    modal.present();
  }

  deleteCard(card: Card) {
    let alert = this.alertCtrl.create({
      title: 'Remove card',
      subTitle: 'Are you sure you want to remove this card?',
      buttons: [
        {
          text: 'No',
          handler: () => {}
        },
        {
          text: 'Yes',
          handler: () => {
            this.cardsService.removeCard(card.id);
          }
        }
      ]
    });

    alert.present();
  }
}
