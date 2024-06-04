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
import swal from 'sweetalert2';

@Component({
	selector: 'app-recover',
	templateUrl: './recover.component.html',
	styleUrls: ['./recover.component.scss']
})
export class RecoverComponent implements OnInit {
	public password = "";
	public confirm = "";

	//Variables para el login
	public userlogin = { 'document': '', 'password': '' };

	public user = {};
	public showCanvasLeft = false;
	public showCanvasRight = false;
	public menuXs = false;
	public showOverlay = false;
	public mediaQuery = 'lg';
	public logued = false;
	public isCollapsed = true;
	public menu = true;

	public messageAlert = "";
	public viewPass = true;
	public data = "";

	modalRef: BsModalRef;
	@ViewChild('recov', { static: false }) recov;
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
		this.data = this.route.snapshot.queryParams['e541f24f0b06368c9cfb418174699da5'];
		this.openLoginModal();
	}

	openLoginModal() {
		this.modalRef = this.modalService.show(this.recov, { class: 'modal-md', ignoreBackdropClick: true });
	}

	recover() {
		this.messageAlert = "";
		let validate = true;
		if (this.password == "" || this.confirm == "") {
			validate = false;
			let message = "Debe diligenciar todos los campos";
			this.toastr.error(message, 'Lo sentimos', { enableHtml: true, positionClass: 'toast-top-center' });
			return;
		}
		if (this.password != this.confirm) {
			validate = false;
			let message = "Los campos deben coincidir";
			this.toastr.error(message, 'Lo sentimos', { enableHtml: true, positionClass: 'toast-top-center' });
			return;
		}

		let regex = /^(?=.*\d)(?=.*[a-záéíóúüñ])/;
		if (!regex.test(this.password) || this.password.length < 6) {
			validate = false;
			let message = "La contraseña debe tener mínimo 6 caracteres y contener por lo menos 1 número";
			this.toastr.error(message, 'Lo sentimos', { enableHtml: true, positionClass: 'toast-top-center' });
			return;
		}


		if (validate) {
			let body = {
				"parametro": this.data,
				"clave": this.password,
				"sistema": "Portal confa"
			};

			let token = "";

			this.provider.queryAuth('/confa/metodo16', body, 1, token).subscribe(
				response => {
					let result = (response as any);

					if (result.respuesta == true) {
						let mensaje = "Contraseña actualizada correctamente";

						swal({
							title: "Buen trabajo.",
							text: mensaje,
							type: 'success',
							showCancelButton: false,
							confirmButtonClass: "btn btn-primary",
							confirmButtonText: "Continuar"
						});

						this.modalRef.hide();
						this.router.navigate(['/salud']);
					} else {
						this.toastr.error('No se ha podido realizar la actualización de la contraseña', 'Lo sentimos', { enableHtml: true, positionClass: 'toast-top-center' });
					}
				},
				err => {
					if (err.status == 503) {
						this.toastr.error('Parece que no tienes conexión', 'Lo sentimos', { enableHtml: true, positionClass: 'toast-top-center' });
					}
				}
			);
		}


	}

	cerrar() {
		this.modalRef.hide();
		this.router.navigate(['/']);
	}

}
