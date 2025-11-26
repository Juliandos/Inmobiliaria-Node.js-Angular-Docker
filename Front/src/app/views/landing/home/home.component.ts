import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturedPropertiesComponent } from '../../../components/shared/featured-properties/featured-properties.component';
import { SearchResultsComponent } from '../../../components/shared/search-results/search-results.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FeaturedPropertiesComponent,
    SearchResultsComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
}

