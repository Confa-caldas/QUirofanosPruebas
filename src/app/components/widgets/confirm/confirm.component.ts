import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { UtilitiesService } from 'src/app/services/general/utilities.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  private unsubscribes: Subscription[] = [];
  @Input() message: string;
  @Input() message2: string
  @Input() title: String;

  modalRef: BsModalRef;
  @ViewChild('modalConfirm', { static: false }) modalConfirm: TemplateRef<any>;
  
  constructor(
    private modalService: BsModalService,
    private ut: UtilitiesService,
  ) { }

  ngOnInit() {

    const errorsSubs = this.ut._showConfirmModal.subscribe((res: { res: boolean, message: string, message2: string, title: string }) => {
    
       if(res.res){
        this.message= res.message;
        this.message2=res.message2;
        this.title = res.title;
        this.openModal(this.modalConfirm, res.res );
       }
    }); 
    this.unsubscribes.push(errorsSubs);

  }

  ngOnDestroy() {
      this.unsubscribes.forEach(sb => sb.unsubscribe());
  }

  openModal(template: TemplateRef<any>, res: boolean = false) {
      if(!this.modalRef){
        this.modalRef = this.modalService.show(
          template,
          Object.assign({ backdrop: true }, { class: "gray modal-lg cf-modal" })
        );
      }
  }

  closeModal() {
      this.modalRef.hide();
      this.modalRef = null;
      this.ut.responseConfirmModal(false);
  }

  confirmData(){
    this.modalRef.hide();
    this.modalRef = null;
    this.ut.responseConfirmModal(true);
  }

}
