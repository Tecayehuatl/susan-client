import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditPatientComponent } from './create-edit-patient.component';

describe('CreateEditPatientComponent', () => {
  let component: CreateEditPatientComponent;
  let fixture: ComponentFixture<CreateEditPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditPatientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
