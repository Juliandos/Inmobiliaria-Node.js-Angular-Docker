import { Component, OnInit, inject } from '@angular/core';
import { PropiedadesService, Propiedad, CreatePropiedadRequest } from '../../../services/propiedades.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-propiedades',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatTableModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatSnackBarModule, MatCardModule, MatTooltipModule,
    MatIconModule, MatSelectModule
  ],
  templateUrl: './propiedades.component.html',
  styleUrls: ['./propiedades.component.scss']
})
export class PropiedadesComponent implements OnInit {
  private propiedadesService = inject(PropiedadesService);
  private snackBar = inject(MatSnackBar);

  propiedades: Propiedad[] = [];
  displayedColumns = ['id','titulo','tipo','precio','usuario','imagen','acciones'];
  filterControl = new FormControl('');

  createForm = new FormGroup({
    titulo: new FormControl('', Validators.required),
    descripcion: new FormControl(''),
    precio: new FormControl<number | null>(null),
    habitaciones: new FormControl<number | null>(null),
    banos: new FormControl<number | null>(null),
    parqueadero: new FormControl<number | null>(null),
    tipo_id: new FormControl<number | null>(null),
    usuario_id: new FormControl<number | null>(null)
  });

  showCreateForm = false;
  showEditForm = false;
  editingId: number | null = null;

  ngOnInit(){ this.loadPropiedades(); }

  get filtered(): Propiedad[] {
    const f = this.filterControl.value?.toLowerCase() || '';
    return this.propiedades.filter(p =>
      p.titulo.toLowerCase().includes(f) || p.id.toString().includes(f)
    );
  }

  loadPropiedades() {
    this.propiedadesService.getPropiedades().subscribe({
      next: data => this.propiedades = data,
      error: e => this.showSnack('Error cargando propiedades')
    });
  }

  onCreate() {
    if(this.createForm.valid){
      const data = this.createForm.value as CreatePropiedadRequest;
      this.propiedadesService.createPropiedad(data).subscribe({
        next: prop => {
          this.propiedades.push(prop);
          this.showCreateForm = false;
          this.createForm.reset();
          this.showSnack('Propiedad creada');
        },
        error: () => this.showSnack('Error creando propiedad')
      });
    }
  }

  onEdit(prop: Propiedad){
    this.editingId = prop.id;
    this.createForm.patchValue({
      titulo: prop.titulo,
      descripcion: prop.descripcion,
      precio: prop.precio,
      habitaciones: prop.habitaciones,
      banos: prop.banos,
      parqueadero: prop.parqueadero,
      tipo_id: prop.tipo?.id,
      usuario_id: prop.usuario?.id
    });
    this.showEditForm = true; this.showCreateForm = false;
  }

  onUpdate(){
  if(this.createForm.valid && this.editingId){
    const raw = this.createForm.value;
    // convertimos null a undefined
    const data: CreatePropiedadRequest = {
      ...raw,
      tipo_id: raw.tipo_id ?? undefined,
      usuario_id: raw.usuario_id ?? undefined
    } as CreatePropiedadRequest;

    this.propiedadesService.updatePropiedad(this.editingId, data).subscribe({
      next: updated => {
        const idx = this.propiedades.findIndex(p => p.id === this.editingId);
        if(idx !== -1) this.propiedades[idx] = updated;
        this.cancel();
        this.showSnack('Propiedad actualizada');
      },
      error: ()=>this.showSnack('Error actualizando')
    });
  }
}
// onUpdate(){
//     if(this.createForm.valid && this.editingId){
//       this.propiedadesService.updatePropiedad(this.editingId, this.createForm.value).subscribe({
//         next: updated => {
//           const idx = this.propiedades.findIndex(p => p.id === this.editingId);
//           if(idx !== -1) this.propiedades[idx] = updated;
//           this.cancel();
//           this.showSnack('Propiedad actualizada');
//         },
//         error: ()=>this.showSnack('Error actualizando')
//       });
//     }
//   }

  onDelete(id:number){
    if(confirm('¿Eliminar propiedad?')){
      this.propiedadesService.deletePropiedad(id).subscribe({
        next: ()=> {
          this.propiedades = this.propiedades.filter(p=>p.id!==id);
          this.showSnack('Eliminada');
        },
        error: ()=>this.showSnack('Error eliminando')
      });
    }
  }

  toggleCreate(){ this.showCreateForm = !this.showCreateForm; this.showEditForm = false; this.createForm.reset(); }
  cancel(){ this.showEditForm=false; this.editingId=null; this.createForm.reset(); }
  private showSnack(m:string){ this.snackBar.open(m,'Cerrar',{duration:3000}); }
}
