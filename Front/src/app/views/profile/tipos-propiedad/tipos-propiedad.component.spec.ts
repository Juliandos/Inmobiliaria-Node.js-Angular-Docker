import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoPropiedadComponent } from './tipos-propiedad.component';

describe('TipoPropiedadComponent', () => {
  let component: TipoPropiedadComponent;
  let fixture: ComponentFixture<TipoPropiedadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoPropiedadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoPropiedadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
