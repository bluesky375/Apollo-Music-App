import { Randomizer } from './Helpers/Randomizer';
import { GuidGenerator } from './Helpers/GuidGenerator';

export class Card {
  constructor(type: string) {
    this.type = type;
    this.holder = 'Miah Christensen';
    this.id = GuidGenerator.guid();

    switch (this.type) {
      case 'mastercard':
        this.name = 'Mastercard';
        this.pictureUrl = '../../assets/images/cards/logos/1.png';
        break;
      case 'visa':
        this.name = 'Visa';
        this.pictureUrl = '../../assets/images/cards/logos/2.png';
        break;
      case 'amex':
        this.name = 'American Express';
        this.pictureUrl = '../../assets/images/cards/logos/3.png';
        break;
      case 'discover':
        this.name = 'Discover';
        this.pictureUrl = '../../assets/images/cards/logos/4.png';
        break;
      case 'dankort':
        this.name = 'Dankort';
        this.pictureUrl = '../../assets/images/cards/logos/5.png';
        break;
    }

    var dMonth = Randomizer.randomIntFromInterval(1, 12);
    this.expiryMonth = dMonth < 10 ? '0' + dMonth : dMonth.toString();
    this.expiryYear = Randomizer.randomIntFromInterval(18, 30).toString();

    var dCCV = Randomizer.randomIntFromInterval(0, 999);
    if (dCCV < 10) {
      this.CCV = '00' + dCCV;
    } else if (dCCV < 100) {
      this.CCV = '0' + dCCV;
    } else {
      this.CCV = dCCV.toString();
    }

    var dLastDigits = Randomizer.randomIntFromInterval(0, 999);
    if (dLastDigits < 10) {
      this.lastDigits = '000' + dLastDigits;
    } else if (dLastDigits < 100) {
      this.lastDigits = '00' + dLastDigits;
    } else if (dLastDigits < 1000) {
      this.lastDigits = '0' + dLastDigits;
    } else {
      this.lastDigits == dLastDigits.toString();
    }
  }

  id: string;
  name: string;
  type: string;
  pictureUrl: string;

  holder: string;
  expiryMonth: string;
  expiryYear: string;
  CCV: string;
  lastDigits: string;
}
