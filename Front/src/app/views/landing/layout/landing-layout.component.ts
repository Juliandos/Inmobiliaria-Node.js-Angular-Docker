import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
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
export class LandingLayoutComponent {
}

