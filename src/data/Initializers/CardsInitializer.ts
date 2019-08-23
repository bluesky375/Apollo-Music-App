import { Card } from '../Card';

export class CardsInitializer {
  static cards: Card[] = [
    new Card('mastercard'),
    new Card('visa'),
    new Card('amex'),
    new Card('discover'),
    new Card('dankort')
  ];
}
