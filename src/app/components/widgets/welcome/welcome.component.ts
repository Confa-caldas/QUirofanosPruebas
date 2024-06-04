import { Component, OnInit, Input } from "@angular/core";
import { DataService } from "../../../data.service";
import { Subscription } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { RestProvider } from "../../../providers/rest/rest";
import { first } from "rxjs/operators";
import { UtilitiesService } from "../../../services/general/utilities.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.scss"],
})
export class WelcomeComponent implements OnInit {
  public userHealt = {
    adicional: null,
    documento: null,
    fechaNacimiento: null,
    tipoDocumento: null,
    user: null,
  };

  public user = null;

  private unsubscribes: Subscription[] = [];

  public showTabs: boolean = false;
  public confaUser: object = null;
  @Input() showHideUserhealth = false;

  constructor(
    public dataService: DataService,
    private cookieService: CookieService,
    private provider: RestProvider,
    private ut: UtilitiesService,
    private router: Router
  ) {}

  ngOnInit() {
    let userHealth = JSON.parse(localStorage.getItem("user_health"));
    if (userHealth) {
      this.userHealt["adicional"] = userHealth["adicional"];
      this.userHealt["documento"] = userHealth["documento"];
      this.userHealt["fechaNacimiento"] = userHealth["fechaNacimiento"];
      this.userHealt["tipoDocumento"] = userHealth["tipoDocumento"];
      this.userHealt["user"] = userHealth["user"];
    }

    this.confaUser = JSON.parse(localStorage.getItem("user"));

    let response = this.dataService.user.subscribe((data) => {
      this.getUser();
    });
    this.getUser();

    this.unsubscribes.push(response);
  }

  ngOnDestroy() {
    this.unsubscribes.forEach((sb) => sb.unsubscribe());
  }

  getUser() {
    this.loadUserInfo().then(() => {
      this.user = JSON.parse(localStorage.getItem("user"));

      if (this.user && this.ut.validateToken) {
        this.showTabs = true;
      } else {
        this.showTabs = false;
      }
    });
  }

  private loadUserInfo() {
    let token =
      this.cookieService.get("ptoken") !== ""
        ? JSON.parse(this.cookieService.get("ptoken"))
        : null;

    if (token) {
      return new Promise<void>((resolve, reject) => {
        this.provider
          .login(token["token"])
          .pipe(first())
          .subscribe((response:any) => {
            let user = response.json();
            localStorage.setItem("user", JSON.stringify(user));
            resolve();
          });
      });
    } else {
      return new Promise<void>((resolve, reject) => {
        resolve();
      });
    }
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
