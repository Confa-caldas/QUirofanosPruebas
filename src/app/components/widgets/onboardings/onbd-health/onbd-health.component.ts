import { Component, OnInit, ViewChild } from "@angular/core";
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as globals from "src/app/globals";
import { UtilitiesService } from "src/app/services/general/utilities.service";

@Component({
  selector: "app-onbd-health",
  templateUrl: "./onbd-health.component.html",
  styleUrls: ["./onbd-health.component.scss"],
})
export class OnbdHealthComponent implements OnInit {
  modalRef: BsModalRef;
  @ViewChild("onboarding", { static: false }) onboarding;

  public images = globals.healthImagesOnboarding;

  constructor(
    private modalService: BsModalService,
    private ut: UtilitiesService
  ) {}

  ngOnInit() {
    //   if (!this.ut.getTimeOnBording('health')) {
    //     this.modalRef = this.modalService.show(this.onboarding, { class: 'modal-lg', ignoreBackdropClick: true });
    //     this.ut.setTimeOnboarding('health');
    //   }
    // }
    // closeModal() {
    //   if (this.modalRef) {
    //     this.modalRef.hide();
    //   }
  }
}
