import { TestBed } from '@angular/core/testing';

import { BedlamService } from './bedlam.service';

describe('BedlamService', () => {
  let service: BedlamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BedlamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
