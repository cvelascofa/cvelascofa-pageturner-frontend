import { TestBed } from '@angular/core/testing';

import { ReadingProgressService } from './reading-progress.service';

describe('ReadingProgressService', () => {
  let service: ReadingProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadingProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
