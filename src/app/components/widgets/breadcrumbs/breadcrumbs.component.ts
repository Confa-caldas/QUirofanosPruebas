import { Component, OnInit, Input } from "@angular/core";
import { UtilitiesService } from "./../../../services/general/utilities.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-breadcrumbs",
  templateUrl: "./breadcrumbs.component.html",
  styleUrls: ["./breadcrumbs.component.scss"],
})
export class BreadcrumbsComponent implements OnInit {
  @Input() back: string;
  @Input() backMain: string;
  @Input() step: number = null;

  constructor(private ut: UtilitiesService, private router: Router) {}

  ngOnInit() {
    if (this.step == 0) {
      this.ut.getStepBreadCrumbs(1);
    }
  }

  goto(step) {
    this.ut.getStepBreadCrumbs(step);
  }
  atras() {
    this.router.navigate(["/quirofanos/citas"]);
  }

  logout() {
    this.ut.toggleSplashscreen(true);
    setTimeout(() => {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("health");
      localStorage.removeItem("user_agreements");
      localStorage.removeItem("user_health");
      localStorage.removeItem("htoken");
      localStorage.removeItem("gtoken");
      localStorage.removeItem("form");
      this.router.navigate(["/quirofanos"]);
      this.ut.toggleSplashscreen(false);
    }, 500);
  }
}
