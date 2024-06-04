import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public user = new BehaviorSubject<string[]>([]);
  current = this.user.asObservable();

  constructor() { }

  changeUser(list: string[]) {
    this.user.next(list);
  }
}
