import { TestBed } from '@angular/core/testing';

import { Cv } from './cv';

describe('Cv', () => {
  let service: Cv;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cv);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
