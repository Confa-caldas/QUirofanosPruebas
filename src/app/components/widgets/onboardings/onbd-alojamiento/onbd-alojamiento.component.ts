import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as globals from 'src/app/globals';
import * as moment from "moment";

import { UtilitiesService } from 'src/app/services/general/utilities.service'

@Component({
  selector: 'app-onbd-alojamiento',
  templateUrl: './onbd-alojamiento.component.html',
  styleUrls: ['./onbd-alojamiento.component.scss']
})
export class OnbdAlojamientoComponent implements OnInit {

  modalRef: BsModalRef;
  @ViewChild('onboarding', { static: false }) onboarding;

  public video = globals.alojamientoVideoUrlOnboarding;

  constructor(
    private modalService: BsModalService,
    private ut: UtilitiesService,
  ) { }

  ngOnInit() {
    let currentDate = moment().add(1, 'days').unix();

    if (!this.ut.getTimeOnBording('accommodation')) {

      this.modalRef = this.modalService.show(this.onboarding, { class: 'modal-lg', ignoreBackdropClick: true });

      this.ut.setTimeOnboarding('accommodation');

    }

  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

}
