import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditPaymentsComponent } from './create-edit-payments.component';

describe('CreateEditPaymentsComponent', () => {
  let component: CreateEditPaymentsComponent;
  let fixture: ComponentFixture<CreateEditPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
