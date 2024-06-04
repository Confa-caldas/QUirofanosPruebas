import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { ApirestService } from '../apirest.service';
import { ToastrService } from 'ngx-toastr';
import { RestProvider } from '../providers/rest/rest';
import { Md5 } from 'ts-md5/dist/md5';
import { SingletonService } from '../singleton.service';
import { IMyDpOptions } from 'mydatepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
 import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute, NavigationEnd } from '@angular/router';
import * as moment from 'moment';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ngx-page-scroll-core';


@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  public redirectTo = null;
  constructor(public service: ApirestService,
    private router: Router,
    private toastr: ToastrService,
    public provider: RestProvider,
    public singleton: SingletonService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private pageScrollService: PageScrollService,
  ) {


  }

  ngOnInit() {
    let data = this.route.snapshot.queryParams['34240997a16763c011134c570fcc149e'];
    this.redirectTo = this.route.snapshot.params.to;
    this.confirmData(data);
  }

  confirmData(code) {
    let body = {
      "parametro": code,
      "correoMd5": ""
    };

    let token = "";

    this.provider.queryAuth('/confa/metodo13', body, 1, token).subscribe(
      response => {

        //console.log(result);       

        if (this.redirectTo) {
          this.router.navigate([this.redirectTo]);
        } else {
          //this.router.navigate(['/']);
        }

      },
      err => {
        if (err.status == 503) {
          this.toastr.error('ALGO NO VA BIEN, Parece que no tienes conexión', 'Error', { enableHtml: true, positionClass: 'toast-top-center' });
        }
      }
    );
  }

}
