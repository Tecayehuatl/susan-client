import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditBranchOfficesComponent } from './create-edit-branch-offices.component';

describe('CreateEditBranchOfficesComponent', () => {
    let component: CreateEditBranchOfficesComponent;
    let fixture: ComponentFixture<CreateEditBranchOfficesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CreateEditBranchOfficesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CreateEditBranchOfficesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
