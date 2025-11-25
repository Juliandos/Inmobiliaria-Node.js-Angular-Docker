import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.scss']
})
export class NosotrosComponent {
  mision = 'Facilitar el acceso a propiedades de calidad, brindando un servicio transparente, confiable y personalizado que satisfaga las necesidades de nuestros clientes.';
  
  vision = 'Ser la plataforma inmobiliaria líder en la región, reconocida por nuestra excelencia en el servicio, innovación tecnológica y compromiso con la satisfacción del cliente.';
  
  valores = [
    { icon: 'verified', title: 'Transparencia', description: 'Honestidad en cada transacción' },
    { icon: 'favorite', title: 'Compromiso', description: 'Dedicados a nuestros clientes' },
    { icon: 'star', title: 'Excelencia', description: 'Calidad en todo lo que hacemos' },
    { icon: 'handshake', title: 'Confianza', description: 'Relaciones duraderas' }
  ];
}

