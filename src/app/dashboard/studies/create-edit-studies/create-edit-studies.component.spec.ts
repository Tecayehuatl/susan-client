import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditStudiesComponent } from './create-edit-studies.component';

describe('CreateEditStudiesComponent', () => {
  let component: CreateEditStudiesComponent;
  let fixture: ComponentFixture<CreateEditStudiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditStudiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditStudiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
