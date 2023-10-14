import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditNotesComponent } from './create-edit-notes.component';

describe('CreateEditNotesComponent', () => {
    let component: CreateEditNotesComponent;
    let fixture: ComponentFixture<CreateEditNotesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CreateEditNotesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CreateEditNotesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
