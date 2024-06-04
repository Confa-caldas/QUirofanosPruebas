import { Component, OnInit } from '@angular/core';
import * as globals from '../../../../globals';

@Component({
  selector: 'app-download-app',
  templateUrl: './download-app.component.html',
  styleUrls: ['./download-app.component.scss']
})
export class DownloadAppComponent implements OnInit {
 
  public bgimage = globals.bannerDownloadApp;
  public androidUrl = globals.urlAndroid;
  public iosUrl = globals.urlIOS;

  constructor() { }

  ngOnInit() {
  }


  downloadAppFunc(target){
    switch(target){
      case 'android':
          window.open(this.androidUrl, '_blank');
        break;

      case 'ios':
        window.open(this.iosUrl, '_blank');
        break;
    }
  }

}
