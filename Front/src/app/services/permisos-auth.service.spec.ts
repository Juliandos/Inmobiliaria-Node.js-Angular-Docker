import { TestBed } from '@angular/core/testing';

import { PermisosAuthService } from './permisos-auth.service';

describe('PermisosAuthService', () => {
  let service: PermisosAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermisosAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
