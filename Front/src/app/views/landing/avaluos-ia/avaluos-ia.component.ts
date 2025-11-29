import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TiposPropiedadService, TipoPropiedad } from '../../../services/tipos.service';

@Component({
  selector: 'app-avaluos-ia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './avaluos-ia.component.html',
  styleUrls: ['./avaluos-ia.component.scss']
})
export class AvaluosIaComponent {
  private tiposService = inject(TiposPropiedadService);

  tipos: TipoPropiedad[] = [];
  isGenerating = signal(false);
  avaluoResult = signal<string | null>(null);

  // Formulario de avalúo
  avaluoForm = new FormGroup({
    titulo: new FormControl('', [Validators.required]),
    descripcion: new FormControl(''),
    precio_estimado: new FormControl<number | null>(null),
    area: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    habitaciones: new FormControl<number | null>(null),
    banos: new FormControl<number | null>(null),
    parqueadero: new FormControl<number | null>(null),
    ciudad: new FormControl('', [Validators.required]),
    barrio: new FormControl(''),
    estrato: new FormControl<number | null>(null),
    antiguedad: new FormControl<number | null>(null),
    tipo_id: new FormControl<number | null>(null)
  });

  ngOnInit(): void {
    this.loadTipos();
  }

  loadTipos(): void {
    this.tiposService.getTipos().subscribe({
      next: (data) => {
        this.tipos = data;
      },
      error: (err) => {
        console.error('Error cargando tipos:', err);
      }
    });
  }

  onGenerateAvaluo(): void {
    if (this.avaluoForm.valid) {
      this.isGenerating.set(true);
      this.avaluoResult.set(null);

      // Simular llamada a IA (esto se conectará con el backend después)
      setTimeout(() => {
        const formData = this.avaluoForm.value;
        const tipoNombre = this.tipos.find(t => t.id === formData.tipo_id)?.nombre || 'Propiedad';
        
        // Resultado de ejemplo (placeholder)
        const resultado = `
🏠 **AVALÚO GENERADO POR IA**

📍 **Ubicación:** ${formData.ciudad}${formData.barrio ? ', ' + formData.barrio : ''}
📐 **Área:** ${formData.area} m²
🏢 **Tipo:** ${tipoNombre}
${formData.estrato ? '⭐ **Estrato:** ' + formData.estrato : ''}
${formData.antiguedad ? '📅 **Antigüedad:** ' + formData.antiguedad + ' años' : ''}

---

**Características de la propiedad:**
• Habitaciones: ${formData.habitaciones || 'No especificado'}
• Baños: ${formData.banos || 'No especificado'}
• Parqueaderos: ${formData.parqueadero || 'No especificado'}

---

**📊 ANÁLISIS DEL MERCADO**

Basándonos en las características proporcionadas y el análisis de propiedades similares en la zona, estimamos:

💰 **Valor estimado:** $XXX,XXX,XXX COP

📈 **Rango de mercado:**
• Mínimo: $XXX,XXX,XXX COP
• Máximo: $XXX,XXX,XXX COP

---

⚠️ *Este es un avalúo estimativo generado por IA. Para un avalúo oficial, consulte con un perito certificado.*

---

*Generado el: ${new Date().toLocaleDateString('es-CO', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}*
        `.trim();

        this.avaluoResult.set(resultado);
        this.isGenerating.set(false);
      }, 2000);
    }
  }

  resetForm(): void {
    this.avaluoForm.reset();
    this.avaluoResult.set(null);
  }
}

