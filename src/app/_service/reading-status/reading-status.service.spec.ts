import { TestBed } from '@angular/core/testing';

import { ReadingStatusService } from './reading-status.service';

describe('ReadingStatusService', () => {
  let service: ReadingStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadingStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
