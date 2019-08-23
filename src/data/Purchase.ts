export class Purchase {
  constructor(name: string, pictureUrl: string, artistName: string, price: string) {
      this.name = name;
      this.pictureUrl = pictureUrl;
      this.artistName = artistName;
      this.price = price;
  }

    id: string;
    name: string;
    pictureUrl: string;
    artistName: string;
    price: string;
}
