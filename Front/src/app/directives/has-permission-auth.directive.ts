// Front/src/app/directives/has-permission.directive.ts
import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy, inject } from '@angular/core';
import { PermisosAuthService } from '../services/permisos-auth.service';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private permisosAuthService = inject(PermisosAuthService);
  private destroy$ = new Subject<void>();

  private _modulo = '';
  private _operacion: 'c' | 'r' | 'u' | 'd' = 'r';
  private _showWhenDenied = false;

  @Input() set hasPermission(value: string) {
    this._modulo = value;
    this.updateView();
  }

  @Input() set hasPermissionOperation(value: 'c' | 'r' | 'u' | 'd') {
    this._operacion = value;
    this.updateView();
  }

  @Input() set hasPermissionShowWhenDenied(value: boolean) {
    this._showWhenDenied = value;
    this.updateView();
  }

  ngOnInit(): void {
    // Escuchar cambios en los permisos del usuario
    this.permisosAuthService.getUserPermissions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateView();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView(): void {
    if (!this._modulo) return;

    this.permisosAuthService.hasPermission(this._modulo, this._operacion)
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasPermission => {
        this.viewContainer.clear();
        
        if (this._showWhenDenied) {
          // Mostrar solo si NO tiene permisos
          if (!hasPermission) {
            this.viewContainer.createEmbeddedView(this.templateRef);
          }
        } else {
          // Mostrar solo si TIENE permisos (comportamiento normal)
          if (hasPermission) {
            this.viewContainer.createEmbeddedView(this.templateRef);
          }
        }
      });
  }
}