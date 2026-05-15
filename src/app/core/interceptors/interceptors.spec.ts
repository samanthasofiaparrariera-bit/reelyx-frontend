import { TestBed } from '@angular/core/testing';

import { Auth_interceptors } from './auth_interceptors';

describe('Auth_interceptors', () => {
  let service: Auth_interceptors;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Auth_interceptors);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
