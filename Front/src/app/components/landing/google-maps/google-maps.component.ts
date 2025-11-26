import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-google-maps',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss']
})
export class GoogleMapsComponent implements OnInit, OnDestroy {
  private sanitizer = inject(DomSanitizer);

  @Input() address: string = '';
  @Input() height: string = '400px';
  @Input() lat?: number;
  @Input() lng?: number;

  mapUrl: SafeResourceUrl = '';

  ngOnInit(): void {
    this.generateMapUrl();
  }

  ngOnDestroy(): void {
    // Cleanup si es necesario
  }

  generateMapUrl(): void {
    let url = '';
    
    if (this.lat && this.lng) {
      // Si tenemos coordenadas, usar Google Maps sin API key
      url = `https://www.google.com/maps?q=${this.lat},${this.lng}&output=embed&z=15`;
    } else if (this.address) {
      // Si tenemos dirección, buscar por dirección
      const encodedAddress = encodeURIComponent(this.address + ', Popayán, Colombia');
      url = `https://www.google.com/maps?q=${encodedAddress}&output=embed&z=15`;
    } else {
      // Por defecto, Popayán, Colombia
      url = `https://www.google.com/maps?q=Popayán,Colombia&output=embed&z=15`;
    }

    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

