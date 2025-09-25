// src/app/services/has-permission.directive.ts
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';


@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  private modulo!: string;
  private operacion!: 'c' | 'r' | 'u' | 'd';

  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private auth: AuthService
  ) {}

  @Input() set hasPermission(value: { modulo: string, operacion: 'c' | 'r' | 'u' | 'd' }) {
    this.modulo = value.modulo;
    this.operacion = value.operacion;
    this.render();
  }

  private render() {
    this.vcr.clear();
    if (this.auth.hasPermission(this.modulo, this.operacion)) {
      this.vcr.createEmbeddedView(this.tpl);
    }
  }
}
