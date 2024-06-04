import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { Subscription } from "rxjs";
import { TermsService } from "src/app/services/user/terms.service";
import * as globals from "../../../../globals";
import { Router } from "@angular/router";

@Component({
  selector: "app-terms-conditions",
  templateUrl: "./terms-conditions.component.html",
  styleUrls: ["./terms-conditions.component.scss"],
})
export class TermsConditionsComponent implements OnInit {
  private unsubscribes: Subscription[] = [];
  public calledByForm: boolean = false;

  public superSaludImg = globals.supersalud;
  public superSub = globals.superSub;
  public politicaDatos = globals.politicaDatos;
  public logoConta = globals.logoPoli;
  modalRef: BsModalRef;

  @ViewChild("modalPolicy", { static: false }) modalPolicy: TemplateRef<any>;
  @ViewChild("modalConditions", { static: false }) modalConditions: TemplateRef<any>;

  constructor(
    private modalService: BsModalService,
    private terms: TermsService,
    private router: Router
  ) {}

  ngOnInit() {
    const callTermsSubs = this.terms._callTerms.subscribe((res) => {
      this.openModal(this.modalPolicy, res);
    });

    const conditions = this.terms._callTermsService.subscribe((res) => {
      this.openModal(this.modalConditions, res);
    });

    this.unsubscribes.push(callTermsSubs);
    this.unsubscribes.push(conditions);
  }

  ngOnDestroy() {
    this.unsubscribes.forEach((sb) => sb.unsubscribe());
  }

  openModal(template: TemplateRef<any>, res: boolean = false) {
    this.calledByForm = res;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({ backdrop: true }, { class: "gray modal-lg cf-modal" })
    );
  }

  closeModal() {
    this.modalRef.hide();
  }

  acceptTerms() {
    this.terms.acceptTerms(true);
    this.closeModal();
    this.router.navigate(["/quirofanos/citas"]);
  }

  acceptService() {
    this.terms.acceptTermsService(true);
    this.closeModal();
  }
}
