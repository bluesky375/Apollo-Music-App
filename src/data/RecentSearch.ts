import { Randomizer } from './Helpers/Randomizer';

export class RecentSearch {
  constructor(name: string) {
    this.name = name;
    this.hoursAgo = Randomizer.randomIntFromInterval(2, 23);
  }

  name: string;
  hoursAgo: number;
}
