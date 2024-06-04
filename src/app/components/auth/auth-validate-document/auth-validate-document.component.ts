import { Component, OnInit, ViewChild } from '@angular/core';
import { SingletonService } from '../../../singleton.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { DataService } from '../../../data.service';
import { TranslateService } from '@ngx-translate/core';
import { ApirestService } from '../../../apirest.service';
import { ToastrService } from 'ngx-toastr';
import { RestProvider } from '../../../providers/rest/rest';
import { Md5 } from 'ts-md5/dist/md5';
import swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilitiesService } from 'src/app/services/general/utilities.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-validate-document',
  templateUrl: './auth-validate-document.component.html',
  styleUrls: ['./auth-validate-document.component.scss']
})
export class AuthValidateDocumentComponent implements OnInit {

  //Variables para el login
  public userlogin = { 'document': '' };

  modalValidate: BsModalRef;
  @ViewChild('validateDocument', { static: false }) validateDocument;

  private unsubscribes: Subscription[] = [];
  public spinLoader = false;

  constructor(
    public singleton: SingletonService,
    private modalService: BsModalService,
    private router: Router,
    public dataService: DataService,
    private translate: TranslateService,
    public service: ApirestService,
    private toastr: ToastrService,
    public provider: RestProvider,
    public auth: AuthService,
    private ut: UtilitiesService
  ) { }

  ngOnInit() {
    let openModal = this.auth._openModaalValidateDocument.subscribe(res => {

      if (res) {
        this.openModal();
      }
    });

    this.unsubscribes.push(openModal);
  }

  ngOnDestroy() {
    this.unsubscribes.forEach(sb => sb.unsubscribe());
  }

  openModal() {
    this.userlogin = { 'document': '' };
    this.modalValidate = this.modalService.show(this.validateDocument, { class: 'modal-md', ignoreBackdropClick: true });
  }

  closeModal() {
    if (this.modalValidate) {
      this.modalValidate.hide();
    }
  }

  validteDocument() {

    if (this.userlogin.document === '' || this.userlogin.document === null) {
      this.toastr.error('Debes especificar un número de documento', 'Lo sentimos');
      return;
    }

    if (this.userlogin.document.length < 5) {
      this.toastr.error('el número de documento debe contener al menos 5 caracteres', 'Lo sentimos');
      return;
    }

    this.ut.toggleSplashscreen(true);
    let bodyAuth = {
      "parametro1": this.singleton.parametro1,
      "parametro2": this.singleton.parametro2,
      "parametro3": "Web"
    }
    this.spinLoader = true;
    this.provider.queryJson('/auth', bodyAuth, 1).subscribe(
      response => {
        let result = (response as any);

        if (undefined !== result) {

          let token: string = 'Bearer ' + result.token;

          let bodyValidate = {
            "documento": "" + this.userlogin.document
          };

          //first we need to validate the the user doesn't exists
          this.provider.queryJson('/confa/metodo1', bodyValidate, 1, token).subscribe(
            response => {
              let result = (response as any);

              let exist_user = result.usuario['existeUsuario'];
              this.closeModal();
              let userData = {
                'tipoDocumento': result.usuario['tipoDocumento'],
                'document': this.userlogin.document,
                'address': '',
                'phone': '',
                'cellphone': '',
                'email': '',
                'confirm_email': '',
                'password': '',
                'confirm_password': '',
                'first_name': result.usuario['primerNombre'],
                'second_name': result.usuario['segundoNombre'],
                'first_last_name': result.usuario['primerApellido'],
                'second_last_name': result.usuario['segundoApellido'],
                'accept_terms': false,
                'accept_habeas': false,
                'gender': result.usuario['sexo'],
                'category': result.usuario['categoria'],
                'fechaNacimiento': result.usuario['fechaNacimiento']
              };


              this.ut.toggleSplashscreen(false);

              if (exist_user) {
                this.spinLoader = false;
                this.toastr.error('Ya existe un usuario registrado con este número de documento.', 'Lo sentimos', { enableHtml: true, positionClass: 'toast-top-center' });

              } else {
                //Show Register modal, we need to send user prev data
                this.spinLoader = false;
                this.auth.openModalRegister(true, userData);
              }

            },
            err => {
              if (err.status == 503) {
                this.ut.toggleSplashscreen(false);
                this.spinLoader = false;
                this.toastr.error('Parece que no tienes conexión', 'Lo sentimos', { enableHtml: true, positionClass: 'toast-top-center' });
              }
            }
          );
        }
        else {
          this.spinLoader = false;

        }
      },
      err => {

      }
    );
  }

  validateDocumentregister() {
    let values = /^[0-9]+$/;
    if (!values.test((this.userlogin.document)) || this.userlogin.document.length > 15) {
      // this.userlogin.document = "";
      let text = this.userlogin.document;
      this.userlogin.document = text.slice(0, -1);
    }
  }

}
