import { Injectable } from '@angular/core';

import { Card } from '../data/Card';

import { CardsInitializer } from '../data/Initializers/CardsInitializer';
import { Randomizer } from '../data/Helpers/Randomizer';
import { Shuffler } from '../data/Helpers/Shuffler';

@Injectable()
export class CardsService {
  cardTypes: string[] = ['mastercard', 'visa', 'amex', 'discover', 'dankort'];

  cards: Card[] = [];
  currentCard: Card;

  constructor() {
    this.cards = Shuffler.shuffle(CardsInitializer.cards.slice()).splice(0, 3);
    this.currentCard = this.cards[0];
  }

  selectCard(card: Card) {
    var index = this.cards.findIndex(function(otherCard) {
      return otherCard.holder === card.holder;
    });

    if (index) {
      this.currentCard = this.cards[index];
    }
  }

  addNewCard(
    ccNumber: string,
    holder: string,
    expiryDate: string,
    ccv: string
  ) {
    var type = this.cardTypes[Randomizer.randomIntFromInterval(0, 4)];

    ccNumber = ccNumber.replace(/\s/g, '');
    expiryDate = expiryDate.replace(/\s/g, '');

    var card = new Card(type);
    card.lastDigits = ccNumber.substr(ccNumber.length - 4);
    card.holder = holder;
    card.expiryMonth = expiryDate.substr(0, 2);
    card.expiryYear = expiryDate.substr(expiryDate.length - 2);
    card.CCV = ccv;

    this.cards.push(card);
  }

  editExistingCard(
    id: string,
    ccNumber: string,
    holder: string,
    expiryDate: string,
    ccv: string
  ) {
    var index = this.cards.findIndex(function(card) {
      return card.id === id;
    });

    if (index < -1) {
      return;
    }

    var card = this.cards[index];

    ccNumber = ccNumber.replace(/\s/g, '');
    expiryDate = expiryDate.replace(/\s/g, '');

    card.lastDigits = ccNumber.substr(ccNumber.length - 4);
    card.holder = holder;
    card.expiryMonth = expiryDate.substr(0, 2);
    card.expiryYear = expiryDate.substr(expiryDate.length - 2);
    card.CCV = ccv;

    this.cards[index] = card;
  }

  removeCard(id: string) {
    var index = this.cards.findIndex(function(card) {
      return card.id === id;
    });

    if (index > -1) {
      this.cards.splice(index, 1);
    }
  }

  setCardTypes(cardElements: HTMLCollectionOf<Element>) {
    for (var i = 0; i < cardElements.length; i++) {
      var cardElement = cardElements[i];
      var card = this.cards[i];

      if (card) {
        cardElement.setAttribute('card-type', card.type);
      }
    }
  }
}
