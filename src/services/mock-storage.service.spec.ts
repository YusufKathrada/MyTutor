import { TestBed } from '@angular/core/testing';

import { MockStorage } from './mock-storage.service';

describe('MockStorageService', () => {
  let service: MockStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockStorage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
