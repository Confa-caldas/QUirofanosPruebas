import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ApirestService } from '../apirest.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RestProvider } from '../providers/rest/rest';
import { Md5 } from 'ts-md5/dist/md5'; 
import { SingletonService } from '../singleton.service';
import { IMyDpOptions, MyDatePicker } from 'mydatepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { listLocales } from 'ngx-bootstrap/chronos';
import * as moment from 'moment';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ngx-page-scroll-core';

moment.locale('es');


@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {


	//Variables para el login
	public user = { 'document': '', 'password': '' };


	//Multiselect information
	public centroVacacionalId; // id to send in query
	public resortList = []; //array data
	public resortSelect = 0; //ngModel
	public resortSettings = {};

	//Variables para las tabs de cada sección de detalles
	public imagesSection = 'active';
	public detailSection = ''

	//Variables for dates inputs
	public dat1;
	public dat2;
	public startDate = "";
	public finishDate = "";
	public date = new Date();
	public initDate = { year: this.date.getFullYear(), month: (this.date.getMonth() + 1), day: this.date.getDate() };

	public disabledDays = [];
	public disabledUntil = { year: this.date.getFullYear(), month: (this.date.getMonth() + 1), day: this.date.getDate() };
	public disableUnitilFinish = this.initDate;
	// Array to show housing units
	public housingUnits = [];

	//divs hidden
	public listItemsDiv = true;
	public reserveDiv = true;
	public detailsDiv = true;

	//attributes
	public document_type = null;
	public document = null;
	public resort;
	public housingUnit;
	public capacity;

	//details housing information
	public detailsHousing = [];
	//user attributes
	public userNameReserve = "";
	public valor;

	public resorts = [];
	public showOverlay = false;

	//filtroos
	public options_TypeUnit = [];
	public option_capacity = [];
	public filter_TypeUnit = 0;
	public filter_capacity = 0;

	public search = false;

	//Reseves list
	public myreserves = [];

	public placeholderEntry: string = 'Ingreso';
	public placeholderOut: string = 'Salida';
	public disableSince = { year: this.date.getFullYear() + 1, month: 2, day: 1 };

	//Options date start
	public dateOptionsInit: IMyDpOptions = {
		// other options...
		dayLabels: { su: "Do", mo: "Lu", tu: "Ma", we: "Mi", th: "Ju", fr: "Vi", sa: "Sa" },
		monthLabels: { 1: "Ene", 2: "Feb", 3: "Mar", 4: "Abr", 5: "May", 6: "Jun", 7: "Jul", 8: "Ago", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dic" },
		dateFormat: "yyyy-mm-dd",
		firstDayOfWeek: "mo",
		sunHighlight: true,
		showTodayBtn: true,
		yearSelector: false,
		minYear: this.date.getFullYear(),
		maxYear: this.date.getFullYear() + 1,
		todayBtnTxt: "Hoy",
		disableUntil: this.disabledUntil,
		disableDays: this.disabledDays,
		disableSince: this.disableSince,
		openSelectorOnInputClick: true,
		editableDateField: false,
		inline: false
	};

	//Options date start
	public dateOptionsFinish: IMyDpOptions = {
		// other options...
		dayLabels: { su: "Do", mo: "Lu", tu: "Ma", we: "Mi", th: "Ju", fr: "Vi", sa: "Sa" },
		monthLabels: { 1: "Ene", 2: "Feb", 3: "Mar", 4: "Abr", 5: "May", 6: "Jun", 7: "Jul", 8: "Ago", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dic" },
		dateFormat: "yyyy-mm-dd",
		firstDayOfWeek: "mo",
		sunHighlight: true,
		showTodayBtn: true,
		yearSelector: false,
		minYear: this.date.getFullYear(),
		maxYear: this.date.getFullYear() + 1,
		todayBtnTxt: "Hoy",
		disableUntil: this.disableUnitilFinish,
		disableDays: this.disabledDays,
		disableSince: this.disableSince,
		openSelectorOnInputClick: true,
		editableDateField: false,
		inline: false
	};

	// Initialized to specific date (09.10.2018).

	public model: any = { date: { year: 2018, month: 10, day: 9 } };

	@ViewChild('mydp', { static: false }) mydp: MyDatePicker;
	constructor(public service: ApirestService,
		private router: Router,
		private toastr: ToastrService,
		public provider: RestProvider,
		private pageScrollService: PageScrollService,
		public singleton: SingletonService,
		private modalService: BsModalService) {

	}

	ngOnInit() {
		// this.getResorts();
	}

	async getResorts() {
		let token = localStorage.getItem('gtoken');
		if (null == localStorage.getItem('token') || 'null' == localStorage.getItem('token') || undefined == localStorage.getItem('token')) {
			await this.generateGToken();
			token = localStorage.getItem('gtoken');
		}

		let body = {
			"consultar": true
		}

		this.provider.queryJson('/metodo10', body, 3, token).subscribe(
			response => {
				let result = (response as any);
				this.resortList = result;
			},
			err => {
				console.log(err);
			}
		);
	}

	generateGToken() {
			let bodyToken = {
				"parametro1": "209fb77b7a1b36c8d0139cfa43ed7e29",
        "parametro2": "87c2264a3c4a03c716b012ceac0b0e66",
        "parametro3": "Web"
			};

      this.provider.queryJson('/auth', bodyToken, 1)
        .subscribe(response => {
			let result = (response as any);

					if (undefined !== result) {
						let token: string = 'Bearer ' + result.token;
						localStorage.setItem('gtoken', token);
					}
				});
	}

	//Obtenemos el id del centro vacacional y consultamos
	onItemSelect() {
		this.centroVacacionalId = this.resortSelect;
		this.getClosedDays();
	}

	// this function get the closed day of resort
	getClosedDays() {
		this.listItemsDiv = false;
		this.reserveDiv = true;
		let body = {
			"centroVacacionalId": this.centroVacacionalId
		}

		//if disabled days is greater than 0, we delete all information
		if (this.disabledDays.length > 0) {
			for (let i = 0; i < this.disabledDays.length; i++) {
				this.disabledDays.splice(i);
			}
		}
		let token = localStorage.getItem('gtoken');
		//Method responsible for consulting the days when the resort is not open or available
		this.provider.queryJson('/metodo4', body, 3, token).subscribe(
			response => {
				let result = (response as any);
				//we get the array, and  split data to format
				for (let i = 0; i < result.length; i++) {
					let temp = result[i];
					let datos = temp.split("-");
					let days = { year: parseInt(datos[0]), month: parseInt(datos[1]), day: parseInt(datos[2]) };
					//Add days to array closed days
					this.disabledDays.push(days);
				}
			},
			err => {
				console.log(err);
			}
		);
	}

	//When date changed, we format input date and save in global variables
	dateChange(event, tipe) {
		if (tipe == 1) {
			if (event.formatted != '') {
				this.startDate = event.formatted + "";
				this.initDate = event.date;
				this.dateOptionsFinish = {
					// other options...
					minYear: this.date.getFullYear(),
					maxYear: this.date.getFullYear() + 1,
					todayBtnTxt: "Hoy",
					disableUntil: this.initDate,
					disableDays: this.disabledDays,
					openSelectorOnInputClick: true,
					editableDateField: false,
					inline: false
				}
				let date = moment(this.startDate).add(1, 'days').format("YYYY-MM-DD");
				this.dat2 = {
					date: { year: parseInt(moment(date).format('YYYY')), month: parseInt(moment(date).format('M')), day: parseInt(moment(date).format('D')) },
					//epoc: new Date(this.finishDate).getTime(),
					formatted: this.finishDate,
					jsdate: new Date(this.finishDate)
				};
				this.finishDate = date;

				const pageScrollInstance: PageScrollInstance = this.pageScrollService.create({
					document: this.document,
					scrollTarget: '#dateout',
					scrollOffset: 5 // Set the desired scroll offset here
				  });
				  this.pageScrollService.start(pageScrollInstance);
				
				//document.getElementById("datefinish").click();
				this.mydp.openBtnClicked();
			} else {
				this.dat2 = null;
			}

		} else {
			this.finishDate = event.formatted + "";
		}
	}

	consultar() {
		let validate = true;
		let url = this.singleton.url;
		if (this.resortSelect == 0 || this.startDate == "" || this.finishDate == "") {
			validate = false;
			this.toastr.error("Debes diligenciar todos los datos", 'Error', { enableHtml: true, positionClass: 'toast-top-center' });
			return;
		}
		if (this.startDate >= this.finishDate) {
			validate = false;
			this.toastr.error("La fecha de ingreso no debe ser mayor o igual a la fecha de salida", 'Error', { enableHtml: true, positionClass: 'toast-top-center' });
			return;
		}

		if (validate) {
			//url += "/"+this.resortSelect+"/"+this.startDate+"/"+this.finishDate;
			url += "/alojamiento?e541f24f=" + this.resortSelect + "&c9cfb4=" + this.startDate + "&699da5=" + this.finishDate;


			window.open(url, '_parent');
		}
	}

}
