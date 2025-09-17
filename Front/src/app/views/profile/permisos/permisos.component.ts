import { Component, OnInit, inject } from '@angular/core';
import { PermisosService, Permiso } from '../../../services/permisos.service';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
  ]
})
export class PermisosComponent implements OnInit {
  private permisosService = inject(PermisosService);

  permisos: Permiso[] = [];
  displayedColumns = ['id', 'nombre'];
  filterControl = new FormControl('');

  ngOnInit(): void {
    this.loadPermisos();
  }

  get filteredPermisos(): Permiso[] {
    const filter = this.filterControl.value?.toLowerCase() || '';
    return this.permisos.filter(p =>
      p.nombre.toLowerCase().includes(filter) ||
      p.id.toString().includes(filter)
    );
  }

  loadPermisos(): void {
    this.permisosService.getPermisos().subscribe({
      next: (data) => (this.permisos = data),
      error: (err) => console.error('Error cargando permisos:', err)
    });
  }
}
