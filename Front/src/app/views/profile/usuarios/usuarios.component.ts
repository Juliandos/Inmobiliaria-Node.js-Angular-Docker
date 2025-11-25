import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { UsuariosService, Usuario, CreateUsuarioRequest, UpdateUsuarioRequest } from '../../../services/usuarios.service';
import { RolesService, Rol } from '../../../services/roles.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HasPermissionDirective } from 'src/app/directives/has-permission.directive';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    MatTooltipModule,
    HasPermissionDirective
  ]
})
export class UsuariosComponent implements OnInit, AfterViewInit {
  private usuariosService = inject(UsuariosService);
  private rolesService = inject(RolesService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // ViewChild para paginador y ordenamiento
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // DataSource para la tabla
  dataSource = new MatTableDataSource<Usuario>([]);
  roles: Rol[] = [];
  displayedColumns = ['id', 'email', 'nombre', 'apellido', 'rol_id', 'acciones'];
  filterControl = new FormControl('');
  loading = false;
  
  // Formularios
  createForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rol_id: new FormControl<number | null>(null, [Validators.required])
  });

  editForm = new FormGroup({
    id: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    password: new FormControl(''),
    rol_id: new FormControl<number | null>(null, [Validators.required])
  });

  // Estado del formulario
  showCreateForm = false;
  showEditForm = false;
  editingUserId: number | null = null;

  ngOnInit(): void {
    this.loadUsuarios();
    this.loadRoles();
    
    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: Usuario, filter: string): boolean => {
      const searchStr = filter.toLowerCase();
      return data.nombre.toLowerCase().includes(searchStr) ||
             data.apellido.toLowerCase().includes(searchStr) ||
             data.email.toLowerCase().includes(searchStr) ||
             data.id.toString().includes(searchStr) ||
             (data.rol?.nombre?.toLowerCase() || '').includes(searchStr);
    };

    // Suscribirse a cambios en el filtro
    this.filterControl.valueChanges.subscribe(value => {
      this.dataSource.filter = value?.trim().toLowerCase() || '';
    });
  }

  ngAfterViewInit(): void {
    // Configurar paginador y ordenamiento después de que la vista se inicialice
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Configurar el ordenamiento personalizado para campos anidados
    this.dataSource.sortingDataAccessor = (item: Usuario, property: string) => {
      switch (property) {
        case 'rol_id': return item.rol?.nombre || '';
        default: return (item as any)[property];
      }
    };
  }

  loadUsuarios(): void {
    this.loading = true;
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.showSnackBar('Error cargando usuarios');
        this.loading = false;
      }
    });
  }

  loadRoles(): void {
    this.rolesService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        
        // Establecer el primer rol como predeterminado si existe
        if (this.roles.length > 0) {
          this.createForm.patchValue({ rol_id: this.roles[0].id });
        }
      },
      error: (err) => {
        console.error('Error cargando roles:', err);
        this.showSnackBar('Error cargando roles');
      }
    });
  }

  // ✅ CREAR USUARIO
  onCreateUsuario(): void {
    if (this.createForm.valid) {
      const newUser: CreateUsuarioRequest = {
        email: this.createForm.value.email!,
        nombre: this.createForm.value.nombre!,
        apellido: this.createForm.value.apellido!,
        password: this.createForm.value.password!,
        rol_id: this.createForm.value.rol_id!
      };

      this.usuariosService.createUsuario(newUser).subscribe({
        next: (usuario) => {
          const currentData = this.dataSource.data;
          this.dataSource.data = [...currentData, usuario];
          this.createForm.reset();
          this.showCreateForm = false;
          this.showSnackBar('Usuario creado exitosamente');
        },
        error: (err) => {
          console.error('Error creando usuario:', err);
          this.showSnackBar('Error creando usuario');
        }
      });
    }
  }

  // ✅ PREPARAR EDICIÓN
  onEditUsuario(usuario: Usuario): void {
    this.editingUserId = usuario.id;
    this.editForm.patchValue({
      id: usuario.id.toString(),
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      password: '', // No mostrar la contraseña actual
      rol_id: usuario.rol_id // Ya es number
    });
    this.showEditForm = true;
    this.showCreateForm = false;
  }

  // ✅ ACTUALIZAR USUARIO
  onUpdateUsuario(): void {
    if (this.editForm.valid && this.editingUserId) {
      const updateData: UpdateUsuarioRequest = {
        email: this.editForm.value.email!,
        nombre: this.editForm.value.nombre!,
        apellido: this.editForm.value.apellido!,
        rol_id: this.editForm.value.rol_id! // Ya es number | null, pero sabemos que no es null por la validación
      };

      // Solo incluir password si se proporcionó
      if (this.editForm.value.password && this.editForm.value.password.length > 0) {
        updateData.password = this.editForm.value.password;
      }

      this.usuariosService.updateUsuario(this.editingUserId, updateData).subscribe({
        next: (updatedUser) => {
          const currentData = this.dataSource.data;
          const index = currentData.findIndex(u => u.id === this.editingUserId);
          if (index !== -1) {
            currentData[index] = updatedUser;
            this.dataSource.data = [...currentData];
          }
          this.cancelEdit();
          this.showSnackBar('Usuario actualizado exitosamente');
        },
        error: (err) => {
          console.error('Error actualizando usuario:', err);
          this.showSnackBar('Error actualizando usuario');
        }
      });
    }
  }

  // ✅ ELIMINAR USUARIO
  onDeleteUsuario(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.usuariosService.deleteUsuario(id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(u => u.id !== id);
          this.showSnackBar('Usuario eliminado exitosamente');
        },
        error: (err) => {
          console.error('Error eliminando usuario:', err);
          this.showSnackBar('Error eliminando usuario');
        }
      });
    }
  }

  // ✅ UTILIDADES
  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    this.showEditForm = false;
    if (this.showCreateForm) {
      this.createForm.reset();
      // Establecer rol predeterminado si hay roles disponibles
      if (this.roles.length > 0) {
        this.createForm.patchValue({ rol_id: this.roles[0].id });
      }
    }
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.editingUserId = null;
    this.editForm.reset();
  }

  getRolName(rolId: number): string {
    const rol = this.roles.find(r => r.id === rolId);
    return rol ? rol.nombre : `Rol ${rolId}`;
  }

  getRolNameFromUser(usuario: Usuario): string {
    // Primero intentar obtener de la relación incluida
    if (usuario.rol?.nombre) {
      return usuario.rol.nombre;
    }
    // Si no, buscar en la lista local de roles
    return this.getRolName(usuario.rol_id);
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  // ✅ LIMPIAR FILTRO
  clearFilter(): void {
    this.filterControl.setValue('');
  }

  // ✅ EXPORTAR A CSV
  exportToCSV(): void {
    const data = this.dataSource.filteredData;
    if (data.length === 0) {
      this.showSnackBar('No hay datos para exportar');
      return;
    }

    const headers = ['ID', 'Email', 'Nombre', 'Apellido', 'Rol'];
    const csvData = data.map(u => [
      u.id,
      u.email,
      u.nombre,
      u.apellido,
      this.getRolNameFromUser(u)
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    this.showSnackBar('Datos exportados correctamente');
  }

  // ✅ OBTENER TOTAL DE REGISTROS
  getTotalRecords(): number {
    return this.dataSource.data.length;
  }

  // ✅ OBTENER REGISTROS FILTRADOS
  getFilteredRecords(): number {
    return this.dataSource.filteredData.length;
  }
}