import { TestBed } from '@angular/core/testing';

import { BranchOfficesService } from './branch-offices.service';

describe('BranchOfficesService', () => {
    let service: BranchOfficesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BranchOfficesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
