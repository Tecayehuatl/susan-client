import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditDoctorsComponent } from './create-edit-doctors.component';

describe('CreateEditDoctorsComponent', () => {
  let component: CreateEditDoctorsComponent;
  let fixture: ComponentFixture<CreateEditDoctorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditDoctorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
