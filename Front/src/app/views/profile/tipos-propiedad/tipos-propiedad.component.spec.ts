import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposPropiedadComponent } from './tipos-propiedad.component';

describe('TiposPropiedadComponent', () => {
  let component: TiposPropiedadComponent;
  let fixture: ComponentFixture<TiposPropiedadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposPropiedadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposPropiedadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
