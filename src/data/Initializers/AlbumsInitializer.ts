import { Album } from '../Album';

export class AlbumsInitializer {
  constructor() {}

  static albums: Album[] = [
    new Album('Scorpion', 'Drake', 'assets/images/albums/scorpion.jpg'),
    new Album('Yours Truly', 'Ariana Grande', 'assets/images/albums/yours truly.png'),
    new Album('Unorthodox Jukebox', 'Bruno Mars', 'assets/images/albums/unorthodox jukebox.png'),
    new Album('Bartier Cardi', 'Cardi B', 'assets/images/albums/bartier cardi.jpg'),
    new Album('Because the Internet', 'Childish Gambino', 'assets/images/albums/because the internet.png'),
    new Album('ArchAndroid', 'Janelle Monáe', 'assets/images/albums/archandroid.jpg'),
    new Album('The Search for Everything', 'John Mayer', 'assets/images/albums/the search for everything.jpg'),
    new Album('Good Kid Mad City', 'Kendrick Lamar', 'assets/images/albums/good kid mad city.jpg'),
    new Album('Born This Way', 'Lady Gaga', 'assets/images/albums/born this way.png'),
    new Album('Astro World', 'Travis Scott', 'assets/images/albums/astro world.jpg'),
    new Album('Gold', 'Tyga', 'assets/images/albums/gold.jpg'),
    new Album('True Colors', 'Zedd', 'assets/images/albums/true colors.png')
  ];
}
