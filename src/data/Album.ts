import { Randomizer } from './Helpers/Randomizer';

export class Album {
  constructor(name: string, artistName: string, pictureUrl: string) {
    this.name = name;
    this.artistName = artistName;
    this.pictureUrl = pictureUrl;
    this.songsCount = Randomizer.randomIntFromInterval(8, 15);
    this.isLiked = Randomizer.randomIntFromInterval(0, 3) === 1;

    this.isPurchased = Randomizer.randomIntFromInterval(0, 2) === 1;
    var dPrice = Randomizer.randomIntFromInterval(5, 19) + 0.99;
    this.price = this.isPurchased ? '' : dPrice.toFixed(2);
  }

  id: string;
  name: string;
  pictureUrl: string;
  artistId: string;
  artistName: string;
  isLiked: boolean;
  songsCount: number;
  isPurchased: boolean;
  price: string;
}
