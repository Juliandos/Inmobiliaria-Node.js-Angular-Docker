import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgStyle } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    NgStyle,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss']
})
export class PublicLayoutComponent {
  // Método para scroll al top cuando cambien las rutas
  onActivate(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}

