import { TestBed } from '@angular/core/testing';

import { EditionTypeService } from './edition-type.service';

describe('EditionTypeService', () => {
  let service: EditionTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditionTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
