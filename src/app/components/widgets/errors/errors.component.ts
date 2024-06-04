import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  Input,
} from "@angular/core";
import { Router } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { Subscription } from "rxjs";
import { UtilitiesService } from "src/app/services/general/utilities.service";

@Component({
  selector: "app-errors",
  templateUrl: "./errors.component.html",
  styleUrls: ["./errors.component.scss"],
})
export class ErrorsComponent implements OnInit {
  public form: boolean;
  private unsubscribes: Subscription[] = [];
  message: string;
  // =    "Actualmente no contamos con tu información en nuestra base de datos. Te invitamos a registrarte";

  modalRef: BsModalRef;
  @ViewChild("modalErrors", { static: false }) modalErrors: TemplateRef<any>;
  constructor(
    private modalService: BsModalService,
    private ut: UtilitiesService,
    private router: Router
  ) {}

  ngOnInit() {
    const errorsSubs = this.ut._showErrorsModal.subscribe((res:any) => {
      this.message =
        "Actualmente no contamos con tu información en nuestra base de datos. Te invitamos a registrarte";
      this.openModal(this.modalErrors, res.res);
    });
    this.unsubscribes.push(errorsSubs);
  }

  ngOnDestroy() {
    this.unsubscribes.forEach((sb) => sb.unsubscribe());
  }

  openModal(template: TemplateRef<any>, res: boolean = false) {
    if (localStorage.getItem("form")) {
      if (localStorage.getItem("form") == "0") {
        this.form = true;
      } else {
        this.form = false;
      }
    }
    this.modalRef = this.modalService.show(
      template,
      Object.assign({ backdrop: true }, { class: "gray modal-lg cf-modal" })
    );
  }

  closeModal() {
    this.modalRef.hide();
  }

  formulario() {
    this.modalRef.hide();
    this.router.navigate(["/quirofanos/form"]);
  }
}
