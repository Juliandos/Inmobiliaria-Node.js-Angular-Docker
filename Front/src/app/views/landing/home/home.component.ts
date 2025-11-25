import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  features = [
    {
      icon: 'home',
      title: 'Propiedades de Calidad',
      description: 'Encuentra la propiedad perfecta para ti'
    },
    {
      icon: 'verified',
      title: 'Verificadas',
      description: 'Todas nuestras propiedades están verificadas'
    },
    {
      icon: 'support_agent',
      title: 'Asesoría Personalizada',
      description: 'Te acompañamos en todo el proceso'
    }
  ];
}

