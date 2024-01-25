import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricInfoComponent } from './historic-info.component';

describe('HistoricInfoComponent', () => {
    let component: HistoricInfoComponent;
    let fixture: ComponentFixture<HistoricInfoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HistoricInfoComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HistoricInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
