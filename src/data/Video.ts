import { Randomizer } from './Helpers/Randomizer';

export class Video {
  constructor(
    title: string,
    oartist: string,
    imageURL: string,
    video: string
  ) {
    this.title = title;
    this.oartist = oartist;
    this.imageURL = imageURL;

    this.video =
      'https://www.youtube.com/embed/' +
      video +
      '?controls=0&amp;modestbranding=1&amp;rel=0&amp;showinfo=0&amp;loop=0&amp;fs=0&amp;hl=en&amp;enablejsapi=1&amp;widgetid=1';

    this.viewsCount = Randomizer.randomIntFromInterval(
      100000,
      999999
    ).toLocaleString();

    this.likesCount = Randomizer.randomIntFromInterval(
      100000,
      999999
    ).toLocaleString();

    this.isLiked = Randomizer.randomIntFromInterval(0, 1) === 1;

    var minutes = Randomizer.randomIntFromInterval(2, 5);
    var seconds = Randomizer.randomIntFromInterval(1, 59);
    this.duration = minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
  }

  id: string;
  title: string;
  oartist: string;
  imageURL: string;
  viewsCount: string;
  likesCount: string;
  video: string;
  isLiked: boolean;
  duration: string;
}
