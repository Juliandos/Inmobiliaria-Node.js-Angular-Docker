import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { 
  ContainerComponent, RowComponent, ColComponent, CardGroupComponent, 
  TextColorDirective, CardComponent, CardBodyComponent, FormDirective, 
  InputGroupComponent, InputGroupTextDirective, FormControlDirective, 
  ButtonDirective 
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ContainerComponent, RowComponent, ColComponent, CardGroupComponent,
    TextColorDirective, CardComponent, CardBodyComponent, FormDirective,
    InputGroupComponent, InputGroupTextDirective, IconDirective,
    FormControlDirective, ButtonDirective, NgStyle, FormsModule
  ]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}
  // console.log("prueba");
  
  onSubmit(event: Event) {
    event.preventDefault();
    console.log('📤 Formulario enviado'); // <- Confirma que entra aquí
    this.error = '';
    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        console.log('📥 Respuesta en componente:', res); // <- Si llega aquí
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('❌ Error de login:', err);
        this.error = err.error?.message || 'Error de autenticación';
        this.loading = false;
      },
      complete: () => {
        console.log('🔚 Petición completada');
        this.loading = false;
      }
    });
  }

}
