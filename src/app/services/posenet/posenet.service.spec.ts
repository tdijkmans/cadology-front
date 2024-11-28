import { TestBed } from '@angular/core/testing';

import { PosenetService } from './posenet.service';

describe('PosenetService', () => {
  let service: PosenetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosenetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
