import { Injectable } from "@angular/core";
import * as _environment from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class SingletonService {
  /**
   * GLOBAL PARAMETERS IMPORTED FROM ENVIRONMENTS FOLDER
   * It is used in the URL to redirect when the user will pay something or to use in the menu
   */
  // site url
  public url = _environment._site.url;
  public parametro1 = _environment.parameters.first;
  public parametro2 = _environment.parameters.second;
  //Layout url menu
  public portal = _environment._site.confaUrl;

  //********************************************************************************************* */

  //flag to know if there is a logged user
  public loggedIn = false;
  //in order to know if the session has expired
  public isExpired: boolean = false;

  /**
   * This variables are used on acommodation to preload data when user back on second step (make booking)
   * and view some reserve with reserve_id
   */
  public housingUnitToBook;
  private bookingdata = null;
  private prebooking = null;
  public reserve_id = null;
  public id_resort_prereserve = null;
  public search_date_start = null;
  public search_date_finish = null;

  constructor() {}

  /**
   * Returns the pages to render in pagination
   * @param array result
   */
  pagination(result) {
    let currentPage = result["current_page"];
    //let first_page_url = result['first_page_url'];
    let lastPage = result["last_page"];

    let pages = [];
    let from = 1;
    let to = lastPage;

    if (result["data"].length > 0) {
      pages.push(["&laquo;", 1, ""]);

      if (currentPage == 1) {
        pages.push(["&lt;", 1, ""]);
      } else if (currentPage > 1) {
        pages.push(["&lt;", currentPage - 1, ""]);

        if (currentPage > 3) {
          from = currentPage - 2;
        }
      }

      if (from + 5 > lastPage) {
        to = lastPage;
      } else {
        to = from + 5;
      }

      for (var i = from; i <= to; ++i) {
        if (i == currentPage) {
          pages.push([i + "", i, "active"]);
        } else {
          pages.push([i + "", i, ""]);
        }
      }

      if (currentPage + 1 < lastPage) {
        pages.push(["&gt;", currentPage + 1, ""]);
      } else {
        pages.push(["&gt;", lastPage, ""]);
      }

      pages.push(["&raquo;", lastPage, ""]);
    }

    return pages;
  }

  /**
   * Convert a base64 string in a Blob according to the data and contentType.
   *
   * @param b64Data {String} Pure base64 string without contentType
   * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
   * @param sliceSize {Int} SliceSize to process the byteCharacters
   * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
   * @return Blob
   */
  b64toBlob(b64Data, contentType, sliceSize = 512) {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  setBookingData(data) {
    this.bookingdata = data;
  }

  getBookingData() {
    return this.bookingdata;
  }

  setPreBookingData(data) {
    this.prebooking = data;
  }

  getPreBookingData() {
    return this.prebooking;
  }
}
