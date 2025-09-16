import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagenPropiedadComponent } from './imagen-propiedad.component';

describe('ImagenPropiedadComponent', () => {
  let component: ImagenPropiedadComponent;
  let fixture: ComponentFixture<ImagenPropiedadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagenPropiedadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagenPropiedadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
