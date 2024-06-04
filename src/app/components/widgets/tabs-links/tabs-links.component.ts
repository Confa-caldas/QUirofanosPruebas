import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-tabs-links",
  templateUrl: "./tabs-links.component.html",
  styleUrls: ["./tabs-links.component.scss"],
})
export class TabsLinksComponent implements OnInit {
  public to_appointments = "/quirofanos/citas";
  public to_accommodation = "/alojamiento";

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {}
}
