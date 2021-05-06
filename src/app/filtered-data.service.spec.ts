import { TestBed } from '@angular/core/testing';

import { FilteredDataService } from './filtered-data.service';

describe('FilteredDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilteredDataService = TestBed.get(FilteredDataService);
    expect(service).toBeTruthy();
  });
});
