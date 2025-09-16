import { Component, OnInit } from '@angular/core';
import { PermisosService, Permiso } from 'src/app/services/permisos.service';

@Component({
  selector: 'app-permisos',
  standalone: true,
  imports: [],
  templateUrl: './permisos.component.html',
  styleUrl: './permisos.component.scss'
})
export class PermisosComponent implements OnInit {
  permisos: Permiso[] = [];
  loading = true;
  error = '';

  constructor(private permisosService: PermisosService) {}

  ngOnInit(): void {
    this.permisosService.getPermisos().subscribe({
      next: (data) => {
        this.permisos = data;
        this.loading = false;
        console.log(this.permisos);
        
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los permisos';
        console.error(err);
        this.loading = false;
      }
    });
  }
}
