import { Randomizer } from "./Helpers/Randomizer";

export class Artist {
  constructor(name: string, pictureUrl: string) {
    this.name = name;
    this.pictureUrl = pictureUrl;
    this.following = Randomizer.randomIntFromInterval(0, 1) === 1;

    var hasLikes = Randomizer.randomIntFromInterval(0, 1) === 1;
    this.likedCount = hasLikes ? Randomizer.randomIntFromInterval(1, 10) : 0;
    this.followersCount = Randomizer.randomIntFromInterval(
      100000,
      999999
    ).toLocaleString();
  }

  id: string;
  name: string;
  pictureUrl: string;
  following: boolean;
  likedCount: number;
  followersCount: string;
}
