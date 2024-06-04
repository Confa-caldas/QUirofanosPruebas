import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalMessagesComponent } from './modal-messages.component';

describe('ModalMessagesComponent', () => {
  let component: ModalMessagesComponent;
  let fixture: ComponentFixture<ModalMessagesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
