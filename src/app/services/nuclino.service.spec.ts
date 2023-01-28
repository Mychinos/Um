import { TestBed } from '@angular/core/testing';

import { NuclinoService } from './nuclino.service';

describe('NuclinoService', () => {
  let service: NuclinoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NuclinoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
