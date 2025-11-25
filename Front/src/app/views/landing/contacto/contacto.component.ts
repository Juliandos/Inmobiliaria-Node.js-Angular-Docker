import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent {
  private snackBar = inject(MatSnackBar);

  contactForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl(''),
    mensaje: new FormControl('', [Validators.required, Validators.minLength(10)])
  });

  contactInfo = [
    { icon: 'phone', title: 'Teléfono', value: '+57 300 123 4567' },
    { icon: 'email', title: 'Email', value: 'contacto@inmobiliaria.com' },
    { icon: 'location_on', title: 'Dirección', value: 'Calle 123 #45-67, Ciudad' }
  ];

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Formulario de contacto:', this.contactForm.value);
      this.showSnackBar('¡Mensaje enviado! Te contactaremos pronto.');
      this.contactForm.reset();
    }
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}

