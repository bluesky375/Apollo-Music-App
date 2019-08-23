import { Artist } from "../Artist";

export class ArtistsInitializer {
  constructor() {}

  static artists: Artist[] = [
    new Artist('Ariana Grande', 'assets/images/artists/ariana grande.jpg'),
    new Artist('Drake', 'assets/images/artists/drake.jpg'),
    new Artist('Bruno Mars', 'assets/images/artists/bruno mars.jpg'),
    new Artist('Dua Lipa', 'assets/images/artists/dua lipa.jpg'),
    new Artist('Cardi B', 'assets/images/artists/cardi b.jpg'),
    new Artist('Childish Gambino', 'assets/images/artists/childish gambino.jpg'),
    new Artist('Ella Mai', 'assets/images/artists/ella mai.jpg'),
    new Artist('Janelle Monáe', 'assets/images/artists/janelle monae.jpg'),
    new Artist('John Mayer', 'assets/images/artists/john mayer.jpg'),
    new Artist('Kendrick Lamar', 'assets/images/artists/kendrick lamar.jpg'),
    new Artist('King Princess', 'assets/images/artists/king princess.jpg'),
    new Artist('Lady Gaga', 'assets/images/artists/lady gaga.jpg'),
    new Artist('Sheck Wes', 'assets/images/artists/sheck wes.jpg'),
    new Artist('Travis Scott', 'assets/images/artists/travis scott.jpg'),
    new Artist('Troye Sivan', 'assets/images/artists/troye sivan.jpg'),
    new Artist('Tyga', 'assets/images/artists/tyga.jpg'),
    new Artist('Zedd', 'assets/images/artists/zedd.jpg')
  ];
}
