// Front/src/app/directives/disable-if-no-permission.directive.ts
import { Directive, Input, ElementRef, OnInit, OnDestroy, inject } from '@angular/core';
import { PermisosAuthService } from '../services/permisos-auth.service';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[disableIfNoPermission]',
  standalone: true
})
export class DisableIfNoPermissionDirective implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private permisosAuthService = inject(PermisosAuthService);
  private destroy$ = new Subject<void>();

  private _modulo = '';
  private _operacion: 'c' | 'r' | 'u' | 'd' = 'r';

  @Input() set disableIfNoPermission(value: string) {
    this._modulo = value;
    this.updateButtonState();
  }

  @Input() set disableIfNoPermissionOperation(value: 'c' | 'r' | 'u' | 'd') {
    this._operacion = value;
    this.updateButtonState();
  }

  ngOnInit(): void {
    // Escuchar cambios en los permisos del usuario
    this.permisosAuthService.getUserPermissions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateButtonState();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateButtonState(): void {
    if (!this._modulo) return;

    this.permisosAuthService.hasPermission(this._modulo, this._operacion)
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasPermission => {
        const element = this.elementRef.nativeElement as HTMLButtonElement;
        
        if (!hasPermission) {
          element.disabled = true;
          element.style.opacity = '0.5';
          element.title = 'No tienes permisos para esta acción';
        } else {
          element.disabled = false;
          element.style.opacity = '1';
          element.title = '';
        }
      });
  }
} 