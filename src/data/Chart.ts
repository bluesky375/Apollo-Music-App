import { Randomizer } from './Helpers/Randomizer';

export class Chart {
  constructor(name: string, pictureUrl: string) {
    this.name = name;
    this.pictureUrl = pictureUrl;
    this.followersCount = Randomizer.randomIntFromInterval(
      100000,
      999999
    ).toLocaleString();
  }

  id: string;
  name: string;
  pictureUrl: string;
  followersCount: string;
}
