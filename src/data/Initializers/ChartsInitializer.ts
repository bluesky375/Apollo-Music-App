import { Chart } from "../Chart";

export class ChartsInitializer {
    static charts: Chart[] = [
        new Chart('Top 50 Australia', 'assets/images/charts/top 50 australia.jpg'),
        new Chart('Top 50 Slovakia', 'assets/images/charts/top 50 slovakia.jpg'),
        new Chart('Top 50 Sweden', 'assets/images/charts/top 50 sweden.jpg'),
        new Chart('Top 50 France', 'assets/images/charts/top 50 france.jpg'),
        new Chart('Top 50 Argentina', 'assets/images/charts/top 50 argentina.jpg'),
        new Chart('Top 50 Canada', 'assets/images/charts/top 50 canada.jpg')
    ];
}
