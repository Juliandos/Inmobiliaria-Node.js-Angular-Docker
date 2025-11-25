import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent {
  searchForm = new FormGroup({
    buscando: new FormControl(''),
    ubicacion: new FormControl('')
  });

  ubicaciones = [
    'Popayán',
    'Cali',
    'Bogotá',
    'Medellín',
    'Buga'
  ];

  constructor(private router: Router) {}

  onSearch(): void {
    const formValue = this.searchForm.value;
    this.router.navigate(['/landing/propiedades'], {
      queryParams: {
        buscar: formValue.buscando,
        ubicacion: formValue.ubicacion
      }
    });
  }
}

