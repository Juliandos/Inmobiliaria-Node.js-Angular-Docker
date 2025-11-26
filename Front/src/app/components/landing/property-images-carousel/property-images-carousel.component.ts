import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-property-images-carousel',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './property-images-carousel.component.html',
  styleUrls: ['./property-images-carousel.component.scss']
})
export class PropertyImagesCarouselComponent implements OnInit {
  @Input() images: { id: number; url: string }[] = [];
  
  currentIndex = 0;

  ngOnInit(): void {
    if (this.images.length > 0) {
      setInterval(() => {
        this.nextImage();
      }, 6000);
    }
  }

  nextImage(): void {
    if (this.images.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }
  }

  previousImage(): void {
    if (this.images.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    }
  }

  goToImage(index: number): void {
    this.currentIndex = index;
  }
}

