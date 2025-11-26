import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LandingHeaderComponent } from '../header/header.component';
import { LandingFooterComponent } from '../footer/footer.component';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { HeroCarouselComponent } from '../hero-carousel/hero-carousel.component';

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
    // Detectar cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkRoute(event.url);
      });

    // Verificar ruta inicial
    this.checkRoute(this.router.url);
  }

  checkRoute(url: string): void {
    // Ocultar hero-section en la vista de detalle de propiedad
    this.showHeroSection = !url.includes('/propiedad/');
  }
}

