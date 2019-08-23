import { Injectable } from '@angular/core';
import { App } from 'ionic-angular';

@Injectable()
export class ModalService {
  constructor(private app: App) {}

  dismiss() {
    this.app.getActiveNav().pop();
  }
}
