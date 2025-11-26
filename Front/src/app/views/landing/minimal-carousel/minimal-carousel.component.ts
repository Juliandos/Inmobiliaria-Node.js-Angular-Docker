import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-minimal-carousel',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './minimal-carousel.component.html',
  styleUrls: ['./minimal-carousel.component.scss']
})
export class MinimalCarouselComponent implements OnInit {
  @Input() title: string = '';
  @Input() images: { url: string; alt: string }[] = [];
  
  currentIndex = 0;

  ngOnInit(): void {
    if (this.images.length > 0) {
      setInterval(() => {
        this.nextImage();
      }, 5000);
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

