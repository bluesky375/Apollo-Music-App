import { Video } from '../Video';

export class VideosInitializer {
  constructor() {}

  static videos: Video[] = [
    new Video(
      'This Is America',
      'Childish Gambino',
      'assets/images/videos/this is america.jpg',
      'VYOjWnS4cMY'
    ),
    new Video(
      'No Limit',
      'G-Eazy',
      'assets/images/videos/no limit.jpg',
      'l_lblj8Cq0o'
    ),
    new Video(
      'rockstar',
      'Post Malone',
      'assets/images/videos/rockstar.jpg',
      'UceaB4D0jpo'
    ),
    new Video(
      'Look What You Made Me Do',
      'Taylor Swift',
      'assets/images/videos/look what you made me do.jpg',
      '3tmd-ClpJxA'
    ),
    new Video(
      'Better',
      'Khalid',
      'assets/images/videos/better.jpg',
      'x3bfa3DZ8JM'
    ),
    new Video(
      'Self Care',
      'Mac Miller',
      'assets/images/videos/self care.jpg',
      'SsKT0s5J8ko'
    )
  ];
}
