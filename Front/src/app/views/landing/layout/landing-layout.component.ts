import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LandingHeaderComponent } from '../../../components/shared/header/header.component';
import { LandingFooterComponent } from '../../../components/shared/footer/footer.component';
import { SearchFilterComponent } from '../../../components/shared/search-filter/search-filter.component';
import { HeroCarouselComponent } from '../../../components/landing/hero-carousel/hero-carousel.component';

@Component({
  selector: 'app-landing-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LandingHeaderComponent,
    LandingFooterComponent,
    SearchFilterComponent,
    HeroCarouselComponent
  ],
  templateUrl: './landing-layout.component.html',
  styleUrls: ['./landing-layout.component.scss']
})
export class LandingLayoutComponent implements OnInit {
  private router = inject(Router);
  showHeroSection = true;

  ngOnInit(): void {
    // Verificar ruta inicial
    this.checkRoute(this.router.url);
    
    // Detectar cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkRoute(event.urlAfterRedirects || event.url);
      });
  }

  checkRoute(url: string): void {
    // Ocultar hero-section en detalle de propiedad, nosotros, contacto y avaluos-ia
    const isPropertyDetail = url.includes('/propiedad/');
    const isNosotros = url.includes('/nosotros');
    const isContacto = url.includes('/contacto');
    const isAvaluosIA = url.includes('/avaluos-ia');
    
    this.showHeroSection = !isPropertyDetail && !isNosotros && !isContacto && !isAvaluosIA;
  }
}

