import { Component, OnInit } from '@angular/core';
import * as globals from '../../../globals';

@Component({
  selector: 'app-main-health',
  templateUrl: './main-health.component.html',
  styleUrls: ['./main-health.component.scss']
})
export class MainHealthComponent implements OnInit {

  public bgimage = globals.image;
  public androidUrl = globals.urlAndroid;
  public iosUrl = globals.urlIOS;
  constructor() { }

  ngOnInit() {

  }


  downloadAppFunc(target) {
    switch (target) {
      case 'android':
        window.open(this.androidUrl, '_blank');
        break;

      case 'ios':
        window.open(this.iosUrl, '_blank');
        break;
    }
  }
}
