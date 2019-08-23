import { Randomizer } from './Helpers/Randomizer';

export class Playlist {
  constructor(name: string, pictureUrl: string) {
    this.name = name;
    this.pictureUrl = pictureUrl;
    this.following = Randomizer.randomIntFromInterval(0, 1) === 1;

    this.songsCount = Randomizer.randomIntFromInterval(
      10,
      50
    ).toLocaleString();
    this.followersCount = Randomizer.randomIntFromInterval(
      100000,
      999999
    ).toLocaleString();
  }

  id: string;
  name: string;
  pictureUrl: string;
  following: boolean;
  songsCount: string;
  followersCount: string;
}
