@echo off
echo ========================================
echo   Iniciando contenedores Docker
echo ========================================
echo.

wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose up -d"

echo.
echo ========================================
echo   Esperando a que los servicios inicien...
echo ========================================
echo.

timeout /t 5 /nobreak >nul

echo ========================================
echo   Verificando estado...
echo ========================================
echo.

wsl bash -c "cd '/mnt/c/Users/ASUS/Desktop/rescate asus/Yo/Paginas Web/Propio/Inmobiliaria Node Docker Angular' && docker compose ps"

echo.
echo ========================================
echo   Servicios disponibles en:
echo   - Frontend: http://localhost:4200
echo   - API: http://localhost:3001
echo   - MySQL: localhost:3306
echo ========================================
echo.
pause

