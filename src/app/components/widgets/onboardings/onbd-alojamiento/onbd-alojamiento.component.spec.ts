import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OnbdAlojamientoComponent } from './onbd-alojamiento.component';

describe('OnbdAlojamientoComponent', () => {
  let component: OnbdAlojamientoComponent;
  let fixture: ComponentFixture<OnbdAlojamientoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OnbdAlojamientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnbdAlojamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
