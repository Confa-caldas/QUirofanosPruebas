import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UtilitiesService } from "src/app/services/general/utilities.service";

@Component({
  selector: "app-modal-messages",
  templateUrl: "./modal-messages.component.html",
  styleUrls: ["./modal-messages.component.scss"],
})
export class ModalMessagesComponent implements OnInit {
  messages: String[];

  constructor(
    public utilitiesService: UtilitiesService,
    public router: Router
  ) {}

  ngOnInit() {}

  closeInfoButton() {
    if (this.utilitiesService.showModalInfo) {
      this.utilitiesService.showModalInfo = false;
    }
  }
}
