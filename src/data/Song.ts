import { Randomizer } from "./Helpers/Randomizer";

export class Song {
  constructor(name: string, artistName: string, pictureUrl: string, songUrl: string) {
      this.name = name;
      this.artistName = artistName;
      this.pictureUrl = pictureUrl;
      this.songUrl = songUrl;
      this.isLiked = Randomizer.randomIntFromInterval(0, 3) === 1;
      this.rankMovement = Randomizer.randomIntFromInterval(0, 2);

      var minutes = Randomizer.randomIntFromInterval(2, 5);
      var seconds = Randomizer.randomIntFromInterval(1, 59);
      this.duration = minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
      this.price = "0.99";
  }

  id: string;
  name: string;
  artistId: string;
  artistName: string;
  pictureUrl: string;
  songUrl: string;
  isLiked: boolean;
  rank: number;
  duration: string;
  price: string;
  rankMovement: number;
}
