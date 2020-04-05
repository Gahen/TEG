import { TestBed } from '@angular/core/testing';

import { TegService } from './teg.service';

describe('TegService', () => {
  let service: TegService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TegService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
