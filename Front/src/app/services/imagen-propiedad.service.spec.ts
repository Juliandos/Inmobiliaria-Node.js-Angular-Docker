import { TestBed } from '@angular/core/testing';

import { ImagenPropiedadService } from './imagen-propiedad.service';

describe('ImagenPropiedadService', () => {
  let service: ImagenPropiedadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagenPropiedadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
