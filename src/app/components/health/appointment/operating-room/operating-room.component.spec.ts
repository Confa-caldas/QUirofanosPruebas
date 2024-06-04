import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OperatingRoomComponent } from './operating-room.component';

describe('OperatingRoomComponent', () => {
  let component: OperatingRoomComponent;
  let fixture: ComponentFixture<OperatingRoomComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatingRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatingRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
