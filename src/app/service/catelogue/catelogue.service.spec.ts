import { TestBed } from '@angular/core/testing';

import { CatelogueService } from './catelogue.service';

describe('CatelogueService', () => {
  let service: CatelogueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatelogueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
