import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ChartDetailsPage } from '../../pages/chart-details/chart-details';

import { Chart } from '../../data/Chart';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { ChartsInitializer } from '../../data/Initializers/ChartsInitializer';

@Component({
  selector: 'charts',
  templateUrl: 'charts.html'
})
export class ChartsComponent {
  charts: Chart[] = [];

  constructor(private navCtrl: NavController) {
    console.log('Hello ChartsComponent Component');
    this.charts = Shuffler.shuffle(ChartsInitializer.charts);
  }

  openChart(chart: Chart) {
    this.navCtrl.push(ChartDetailsPage, { chart: chart });
  }
}
