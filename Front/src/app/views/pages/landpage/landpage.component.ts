import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ButtonDirective, CardBodyComponent, CardComponent, CardGroupComponent, ColComponent, ContainerComponent, FormControlDirective, FormDirective, InputGroupComponent, InputGroupTextDirective, RowComponent, TextColorDirective } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landpage',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // Material
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    ContainerComponent, RowComponent, ColComponent, CardGroupComponent,
    TextColorDirective, CardComponent, CardBodyComponent, FormDirective,
    InputGroupComponent, InputGroupTextDirective, IconDirective,
    FormControlDirective, ButtonDirective, NgStyle, FormsModule, RouterLink
  ],
  templateUrl: './landpage.component.html',
  styleUrls: ['./landpage.component.scss']
})
export class LandpageComponent implements OnInit {

  formPropiedad!: FormGroup;
  propiedades: any[] = [];
  displayedColumns: string[] = ['nombre', 'precio', 'direccion', 'acciones'];

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formPropiedad = this.fb.group({
      nombre: ['', Validators.required],
      precio: ['', Validators.required],
      direccion: ['', Validators.required]
    });

    this.getPropiedades();
  }

  getPropiedades() {
    this.http.get<any[]>('http://localhost/LoriCode/back/api-imagen/')
      .subscribe(data => {
        this.propiedades = data;
      });
  }

  guardarPropiedad() {
    if (this.formPropiedad.valid) {
      const nuevaPropiedad = this.formPropiedad.value;
      this.propiedades.push(nuevaPropiedad); // Solo frontend (ejemplo)
      this.formPropiedad.reset();
    }
  }

  editarPropiedad(prop: any) {
    this.formPropiedad.patchValue(prop);
  }

  eliminarPropiedad(id: number) {
    this.propiedades = this.propiedades.filter(p => p.id !== id);
  }
}
