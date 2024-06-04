import { Component, OnInit, Input } from "@angular/core";
import * as globals from "../../../../globals";

@Component({
  selector: "app-attention-information",
  templateUrl: "./attention-information.component.html",
  styleUrls: ["./attention-information.component.scss"],
})
export class AttentionInformationComponent implements OnInit {
  @Input() parentWidgetStyle: string;
  @Input() widgetStyle: string;
  collection = [];

  public correo = globals.correo;

  constructor() {}

  ngOnInit() {
    this.parentWidgetStyle = this.parentWidgetStyle
      ? this.parentWidgetStyle
      : "1";
    this.widgetStyle = this.widgetStyle ? this.widgetStyle : "1";
    this.loadList();
  }

  loadList() {
    const _collection = [
      {
        title: "Puntos de atención",
        image: globals.attentionsPoints,
        items: [
          {
            value:
              "<strong>Centro Médico Confa de la 50</strong> (Calle 50-Cra.25)",
          },
          {
            value:
              "<strong>Centro Médico Confa San Marcel</strong> (Av. Alberto Mendoza / Cra. 30 #93 - 25)",
          },
        ],
      },
      {
        title: "Líneas de atención",
        image: globals.contactsLines,
        items: [
          {
            value:
              "<strong>Centro de información:</strong> 606 8783430 (Opción 1) - 606 8783111",
          },
        ],
      },
    ];
    this.collection = _collection;
    //console.log(this.collection);
  }
}
