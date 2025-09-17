import { Component } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { Router, RouterLink } from '@angular/router';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
} from '@coreui/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { NgIf, CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
  // CommonModule,
    NgIf,
    ContainerComponent,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    ReactiveFormsModule,
  ],
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      const { nombre, apellido, email, password } = this.registerForm.value;

      this.authService.register(nombre, apellido, email, password, 3).subscribe({// El 3 sería "Cliente" en los roles entonces siempre se crea como cliente, ya despues se modificaría ya que hay que estar logueado para acceder a la ruta "roles"
        next: (res) => {
          this.router.navigate(['/login']);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error registro:', err);
          this.errorMsg = err.error?.message || 'Error al registrar usuario';
          this.loading = false;
        },
      });
    }
  }
}
