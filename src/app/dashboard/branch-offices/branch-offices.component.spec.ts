import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchOfficesComponent } from './branch-offices.component';

describe('BranchOfficesComponent', () => {
  let component: BranchOfficesComponent;
  let fixture: ComponentFixture<BranchOfficesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchOfficesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchOfficesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
